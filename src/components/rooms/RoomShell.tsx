"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Rotate3d,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Hand,
  Keyboard,
  Info,
} from "lucide-react";
import { soundManager } from "../AudioClick";

export interface RoomTourStep {
  title: string;
  stageBadge: string;
  focusTarget: string;
  rotX: number;
  rotY: number;
  zoomZ: number;
  description: string;
  techHighlight: string;
}

export interface RoomShellProps {
  roomId: string;
  roomTitle: string;
  roomCategory: string;
  themeColor: string;
  accentBg: string;
  tourSteps: RoomTourStep[];
  currentStepIndex: number;
  onStepChange: (index: number) => void;
  isPlayingTour: boolean;
  onTogglePlay: () => void;
  children: (helpers: {
    currentStep: RoomTourStep;
    currentStepIndex: number;
    hoveredProp: string | null;
    setHoveredProp: (id: string | null) => void;
    onSelectPropStep: (stepIdx: number) => void;
  }) => React.ReactNode;
  signatureControls?: React.ReactNode;
  watermarkLabels?: string[];
  minRotX?: number;
  maxRotX?: number;
  minZoom?: number;
  maxZoom?: number;
}

export const RoomShell: React.FC<RoomShellProps> = ({
  roomId,
  roomTitle,
  roomCategory,
  themeColor,
  accentBg,
  tourSteps,
  currentStepIndex,
  onStepChange,
  isPlayingTour,
  onTogglePlay,
  children,
  signatureControls,
  watermarkLabels = [],
  minRotX = 5,
  maxRotX = 55,
  minZoom = -400,
  maxZoom = 250,
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [hoveredProp, setHoveredProp] = useState<string | null>(null);
  const [touchOrbitEnabled, setTouchOrbitEnabled] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isInView, setIsInView] = useState(true);

  // Raw non-React animation state (driven by GSAP ticker for 60fps without React re-renders)
  const animState = useRef({
    targetRotX: tourSteps[0]?.rotX ?? 20,
    targetRotY: tourSteps[0]?.rotY ?? -20,
    targetZoomZ: tourSteps[0]?.zoomZ ?? 0,
    currRotX: tourSteps[0]?.rotX ?? 20,
    currRotY: tourSteps[0]?.rotY ?? -20,
    currZoomZ: tourSteps[0]?.zoomZ ?? 0,
    mouseXParallax: 0,
    mouseYParallax: 0,
    isDragging: false,
    lastX: 0,
    lastY: 0,
    idleTimer: 0,
  });

  // GSAP quickTo functions for smooth interpolation
  const quickRotX = useRef<any>(null);
  const quickRotY = useRef<any>(null);
  const quickZoomZ = useRef<any>(null);

  const currentStep = tourSteps[currentStepIndex] || tourSteps[0];

  // 1. Reduced motion detection
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // 2. IntersectionObserver (Pause ticker and timers when offscreen)
  useEffect(() => {
    if (!stageRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, []);

  // 3. Initialize GSAP quickTo and unified Ticker loop
  useEffect(() => {
    if (!cameraRef.current) return;

    quickRotX.current = gsap.quickTo(animState.current, "currRotX", {
      duration: 0.7,
      ease: "power3.out",
    });
    quickRotY.current = gsap.quickTo(animState.current, "currRotY", {
      duration: 0.7,
      ease: "power3.out",
    });
    quickZoomZ.current = gsap.quickTo(animState.current, "currZoomZ", {
      duration: 0.7,
      ease: "power3.out",
    });

    const tickerCb = () => {
      if (!isInView || !cameraRef.current) return;

      const state = animState.current;

      // When dragging or moving, advance quickTo towards target
      quickRotX.current(state.targetRotX + state.mouseYParallax);
      quickRotY.current(state.targetRotY + state.mouseXParallax);
      quickZoomZ.current(state.targetZoomZ);

      // Direct ref transform write (Zero React state overhead!)
      cameraRef.current.style.transform = `translateZ(${state.currZoomZ}px) rotateX(${state.currRotX}deg) rotateY(${state.currRotY}deg)`;
    };

    gsap.ticker.add(tickerCb);
    return () => {
      gsap.ticker.remove(tickerCb);
    };
  }, [isInView]);

  // 4. Update camera target on step or room change
  useEffect(() => {
    if (!currentStep) return;
    const state = animState.current;
    state.targetRotX = Math.max(minRotX, Math.min(maxRotX, currentStep.rotX));
    state.targetRotY = currentStep.rotY;
    state.targetZoomZ = Math.max(minZoom, Math.min(maxZoom, currentStep.zoomZ));
  }, [currentStepIndex, currentStep, minRotX, maxRotX, minZoom, maxZoom]);

  // 5. Scroll entrance assembly animation (GSAP stagger)
  useEffect(() => {
    if (!contentRef.current || isReducedMotion) return;

    const propsAndWalls = contentRef.current.querySelectorAll(".assemble-prop");
    if (propsAndWalls.length === 0) return;

    gsap.fromTo(
      propsAndWalls,
      {
        transform: "translateZ(-300px) rotateY(-20deg) scale(0.85)",
        opacity: 0,
      },
      {
        transform: "translateZ(0px) rotateY(0deg) scale(1)",
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.04,
        overwrite: "auto",
      }
    );
  }, [roomId, isReducedMotion]);

  // 6. Auto-Tour Interval (7s each) with 6s idle resumption
  useEffect(() => {
    if (!isPlayingTour || isReducedMotion || !isInView) return;

    const timer = setInterval(() => {
      onStepChange((currentStepIndex + 1) % tourSteps.length);
      soundManager.playClick(1000);
    }, 7000);

    return () => clearInterval(timer);
  }, [isPlayingTour, isReducedMotion, isInView, currentStepIndex, tourSteps.length, onStepChange]);

  // Idle timer to resume tour after 6s of user inactivity
  const markUserActive = useCallback(() => {
    const state = animState.current;
    if (isPlayingTour) {
      onTogglePlay(); // pause
    }
    window.clearTimeout(state.idleTimer);
    state.idleTimer = window.setTimeout(() => {
      if (!isPlayingTour) {
        onTogglePlay(); // resume
      }
    }, 6000);
  }, [isPlayingTour, onTogglePlay]);

  // 7. Mouse/Touch Drag to Orbit (Clamped)
  const onPointerDown = (e: React.PointerEvent) => {
    // Only drag with primary mouse button or touch
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (e.pointerType === "touch" && !touchOrbitEnabled) return;

    animState.current.isDragging = true;
    animState.current.lastX = e.clientX;
    animState.current.lastY = e.clientY;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    markUserActive();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const state = animState.current;

    // Subtle mouse parallax tilt (max 4deg) when idle
    if (!state.isDragging && e.pointerType === "mouse" && stageRef.current) {
      const rect = stageRef.current.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;
      state.mouseXParallax = normX * 4;
      state.mouseYParallax = -normY * 4;
      return;
    }

    if (!state.isDragging) return;

    const deltaX = e.clientX - state.lastX;
    const deltaY = e.clientY - state.lastY;
    state.lastX = e.clientX;
    state.lastY = e.clientY;

    state.targetRotY += deltaX * 0.45;
    state.targetRotX = Math.max(minRotX, Math.min(maxRotX, state.targetRotX - deltaY * 0.45));
    markUserActive();
  };

  const onPointerUp = (e: React.PointerEvent) => {
    animState.current.isDragging = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  // 8. Ctrl/Cmd + Wheel to Zoom (Normal wheel scrolls page via Lenis)
  const onWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const state = animState.current;
      const delta = -e.deltaY * 0.8;
      state.targetZoomZ = Math.max(minZoom, Math.min(maxZoom, state.targetZoomZ + delta));
      markUserActive();
    }
  };

  // Manual Zoom helpers (for buttons & touch)
  const zoomIn = () => {
    animState.current.targetZoomZ = Math.min(maxZoom, animState.current.targetZoomZ + 60);
    markUserActive();
  };

  const zoomOut = () => {
    animState.current.targetZoomZ = Math.max(minZoom, animState.current.targetZoomZ - 60);
    markUserActive();
  };

  const resetCamera = () => {
    const state = animState.current;
    state.targetRotX = currentStep.rotX;
    state.targetRotY = currentStep.rotY;
    state.targetZoomZ = currentStep.zoomZ;
    soundManager.playSnap();
    markUserActive();
  };

  // Keyboard navigation when stage is focused
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === "Space") {
      e.preventDefault();
      onTogglePlay();
    } else if (e.code === "ArrowRight") {
      e.preventDefault();
      onStepChange((currentStepIndex + 1) % tourSteps.length);
      markUserActive();
    } else if (e.code === "ArrowLeft") {
      e.preventDefault();
      onStepChange((currentStepIndex - 1 + tourSteps.length) % tourSteps.length);
      markUserActive();
    } else if (e.code === "KeyR") {
      e.preventDefault();
      resetCamera();
    }
  };

  // 20 particles desktop, 8 mobile
  const particleCount = typeof window !== "undefined" && window.innerWidth < 640 ? 8 : 20;

  return (
    <div
      ref={stageRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none outline-none focus:ring-1 focus:ring-white/20"
      style={{
        perspective: "1200px",
        touchAction: "pan-y",
        backgroundColor: "#050505",
      }}
    >
      {/* Dynamic Ambient Background Dust Particles (20 on desktop, 8 mobile) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
        {Array.from({ length: particleCount }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              top: `${(i * 17) % 100}%`,
              left: `${(i * 29) % 100}%`,
              backgroundColor: themeColor,
              animationDuration: `${3 + (i % 4)}s`,
              animationDelay: `${(i % 5) * 0.7}s`,
            }}
          />
        ))}
      </div>

      {/* Top Metadata Header & Signature Controls Bar */}
      <div className="relative z-30 flex flex-wrap items-center justify-between px-4 sm:px-6 py-2.5 bg-black/60 backdrop-blur-md border-b border-white/10 gap-2">
        <div className="flex items-center gap-2.5">
          <span
            className="w-2.5 h-2.5 rounded-full animate-ping"
            style={{ backgroundColor: themeColor }}
          />
          <span className="font-display font-black text-xs sm:text-sm text-white tracking-wider uppercase">
            {roomTitle}
          </span>
          <span className="text-zinc-600 text-xs hidden md:inline">//</span>
          <span className="font-mono text-[10px] text-zinc-400 uppercase hidden md:inline">
            {roomCategory}
          </span>
        </div>

        {/* Signature Interaction Controls injection (e.g., Critical button, Filter chips) */}
        <div className="flex items-center gap-2">
          {signatureControls}

          {/* Touch Orbit & Zoom Buttons */}
          <div className="flex items-center gap-1 bg-[#111111] border border-white/10 rounded-full px-1.5 py-0.5">
            <button
              onClick={() => setTouchOrbitEnabled(!touchOrbitEnabled)}
              title={touchOrbitEnabled ? "Orbit Active" : "Tap to Orbit"}
              className={`p-1 rounded-full text-xs transition-colors cursor-pointer sm:hidden ${
                touchOrbitEnabled ? "bg-white text-black font-bold" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Hand className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={zoomIn}
              title="Zoom In (Ctrl + Wheel)"
              className="p-1 rounded-full text-zinc-400 hover:text-white cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={zoomOut}
              title="Zoom Out (Ctrl + Wheel)"
              className="p-1 rounded-full text-zinc-400 hover:text-white cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={resetCamera}
              title="Reset View (R)"
              className="p-1 rounded-full text-zinc-400 hover:text-white cursor-pointer"
            >
              <Rotate3d className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3D VIEWPORT CONTAINER (Strict preserve-3d, no overflow:hidden or filter on direct parents) */}
      <div
        className="relative flex-1 w-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* CAMERA GROUP (Rotated & Translated by GSAP Ticker) */}
        <div
          ref={cameraRef}
          className="relative flex items-center justify-center will-change-transform"
          style={{
            transformStyle: "preserve-3d",
            transformOrigin: "center center 0px",
          }}
        >
          {/* ROOM CONTENT WRAPPER */}
          <div
            ref={contentRef}
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {children({
              currentStep,
              currentStepIndex,
              hoveredProp,
              setHoveredProp,
              onSelectPropStep: (stepIdx) => {
                onStepChange(stepIdx);
                markUserActive();
              },
            })}
          </div>
        </div>

        {/* Permanent Watermark / Legal Disclaimer Labels */}
        {watermarkLabels.length > 0 && (
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-1 pointer-events-none">
            {watermarkLabels.map((lbl, idx) => (
              <span
                key={idx}
                className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 bg-black/80 backdrop-blur-xs border border-white/10 px-2.5 py-0.5 rounded-full"
              >
                {lbl}
              </span>
            ))}
          </div>
        )}

        {/* Hovered Prop Tooltip HUD */}
        {hoveredProp && (
          <div className="absolute top-4 right-4 z-20 pointer-events-none bg-black/85 border border-white/20 backdrop-blur-md rounded-lg px-3 py-1.5 shadow-2xl flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
            <Sparkles className="w-3 h-3 text-emerald-400 animate-spin" />
            <span className="font-mono text-[10px] text-zinc-200 uppercase tracking-widest font-semibold">
              FOCUS: {hoveredProp} · CLICK TO JUMP
            </span>
          </div>
        )}
      </div>

      {/* BOTTOM STEP CONSOLE & TOUR ORCHESTRATION */}
      <div className="relative z-30 bg-black/80 backdrop-blur-md border-t border-white/10 p-3 sm:p-4 flex flex-col gap-2.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Step Info */}
          <div className="flex flex-col gap-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span
                className="font-mono text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border"
                style={{
                  color: themeColor,
                  borderColor: `${themeColor}55`,
                  backgroundColor: `${themeColor}15`,
                }}
              >
                {currentStep.stageBadge}
              </span>
              <h4 className="font-display font-black text-xs sm:text-sm md:text-base text-white tracking-tight uppercase">
                {currentStep.title}
              </h4>
            </div>
            <p className="text-zinc-300 text-xs leading-relaxed line-clamp-2">
              {currentStep.description}
            </p>
            <div className="font-mono text-[10px] text-zinc-500 tracking-wider">
              TECH: <span className="text-zinc-300">{currentStep.techHighlight}</span>
            </div>
          </div>

          {/* Tour Controls (Step Selector, Play/Pause, Next/Prev) */}
          <div className="flex items-center justify-between md:justify-end gap-3">
            {/* Step Indicators */}
            <div className="flex items-center gap-1.5">
              {tourSteps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onStepChange(idx);
                    markUserActive();
                  }}
                  className={`w-7 h-7 rounded-full font-mono text-[10px] font-bold flex items-center justify-center transition-all cursor-pointer ${
                    currentStepIndex === idx
                      ? "bg-white text-black scale-110 shadow-lg"
                      : "bg-[#141414] text-zinc-400 border border-white/10 hover:border-white/40"
                  }`}
                >
                  0{idx + 1}
                </button>
              ))}
            </div>

            {/* Play/Pause & Prev/Next Buttons */}
            <div className="flex items-center gap-1 bg-[#111111] border border-white/10 rounded-full p-1">
              <button
                onClick={() => {
                  onStepChange((currentStepIndex - 1 + tourSteps.length) % tourSteps.length);
                  markUserActive();
                }}
                title="Previous Step (Left Arrow)"
                className="p-1.5 rounded-full text-zinc-400 hover:text-white cursor-pointer"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onTogglePlay}
                title={isPlayingTour ? "Pause Tour (Space)" : "Play Tour (Space)"}
                className="p-1.5 rounded-full bg-white text-black hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                {isPlayingTour ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
              </button>

              <button
                onClick={() => {
                  onStepChange((currentStepIndex + 1) % tourSteps.length);
                  markUserActive();
                }}
                title="Next Step (Right Arrow)"
                className="p-1.5 rounded-full text-zinc-400 hover:text-white cursor-pointer"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Animated Progress Bar (7s interval indicator) */}
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isPlayingTour ? "bg-white" : "bg-zinc-600"
            }`}
            style={{
              width: `${((currentStepIndex + 1) / tourSteps.length) * 100}%`,
              boxShadow: `0 0 10px ${themeColor}`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
