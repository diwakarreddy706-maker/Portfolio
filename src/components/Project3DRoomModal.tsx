"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Bot,
  Activity,
  TrendingUp,
  AlertTriangle,
  Filter,
} from "lucide-react";
import { soundManager } from "./AudioClick";
import { RoomShell, RoomTourStep } from "./rooms/RoomShell";
import { AdenverRoom, ADENVER_TOUR_STEPS } from "./rooms/AdenverRoom";
import { IcuRoom, ICU_TOUR_STEPS } from "./rooms/IcuRoom";
import { EtsRoom, ETS_TOUR_STEPS } from "./rooms/EtsRoom";
import { ThreeRoomCanvas } from "./rooms/ThreeRoomCanvas";

export interface Project3DRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProjectId?: string;
}

interface RoomMeta {
  id: string;
  name: string;
  title: string;
  category: string;
  themeColor: string;
  accentBg: string;
  icon: React.ElementType;
  tourSteps: RoomTourStep[];
  watermarks: string[];
}

const ROOM_CATALOG: Record<string, RoomMeta> = {
  "adenver-ai": {
    id: "adenver-ai",
    name: "ADENVER AI",
    title: "THE CORE CHAMBER // NEURAL VAULT",
    category: "CYBERPUNK COMMAND VAULT",
    themeColor: "#00f0ff",
    accentBg: "rgba(0, 240, 255, 0.15)",
    icon: Bot,
    tourSteps: ADENVER_TOUR_STEPS,
    watermarks: ["Local-First AI", "Offline Daemon Active"],
  },
  "icu-monitoring": {
    id: "icu-monitoring",
    name: "SMART ICU",
    title: "THE PATIENT BAY // TELEMETRY SUITE",
    category: "CLINICAL HOSPITAL BAY",
    themeColor: "#14b8a6",
    accentBg: "rgba(20, 184, 166, 0.15)",
    icon: Activity,
    tourSteps: ICU_TOUR_STEPS,
    watermarks: ["Simulated demo data", "Prototype, not clinically validated"],
  },
  "ets-expense": {
    id: "ets-expense",
    name: "SRI BASAVESHWARA HARVESTING & CO.",
    title: "AGRIBUSINESS OPERATIONS // HARVEST ERP",
    category: "AGRIBUSINESS TIMBER OFFICE",
    themeColor: "#f59e0b",
    accentBg: "rgba(245, 158, 11, 0.15)",
    icon: TrendingUp,
    tourSteps: ETS_TOUR_STEPS,
    watermarks: ["Sample data", "Harvest ERP 2024"],
  },
};

type ProjectRoomId = "adenver-ai" | "icu-monitoring" | "ets-expense";

export const Project3DRoomModal: React.FC<Project3DRoomModalProps> = ({
  isOpen,
  onClose,
  initialProjectId = "adenver-ai",
}) => {
  const [activeRoomId, setActiveRoomId] = useState<ProjectRoomId>(
    (initialProjectId in ROOM_CATALOG ? initialProjectId : "adenver-ai") as ProjectRoomId
  );
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlayingTour, setIsPlayingTour] = useState<boolean>(true);
  const [renderMode, setRenderMode] = useState<"webgl" | "css3d">("webgl");

  // Detect WebGL capability and switch to CSS 3D fallback if unavailable
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const testCanvas = document.createElement("canvas");
        const hasWebGL = !!(
          window.WebGLRenderingContext &&
          (testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl"))
        );
        if (!hasWebGL) {
          setRenderMode("css3d");
        }
      } catch {
        setRenderMode("css3d");
      }
    }
  }, []);

  // Room 2 Signature Interaction state: Critical Event Simulation (6s duration)
  const [isCriticalSimulated, setIsCriticalSimulated] = useState(false);

  // Room 3 Signature Interaction state: Financial Filter Mode
  const [etsFilterMode, setEtsFilterMode] = useState<"all" | "income" | "expense">("all");

  // Sync initial project when modal opens
  useEffect(() => {
    if (isOpen) {
      const validId: ProjectRoomId =
        initialProjectId && initialProjectId in ROOM_CATALOG
          ? (initialProjectId as ProjectRoomId)
          : "adenver-ai";
      setActiveRoomId(validId);
      setCurrentStepIndex(0);
      setIsPlayingTour(true);
      setIsCriticalSimulated(false);
    }
  }, [isOpen, initialProjectId]);

  const roomModalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Focus trap & restore on close
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;

      const timer = setTimeout(() => {
        const focusable = roomModalRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable && focusable.length > 0) {
          focusable[0].focus();
        }
      }, 60);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
          return;
        }
        if (e.key === "Tab") {
          const focusable = roomModalRef.current?.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (!focusable || focusable.length === 0) return;

          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        clearTimeout(timer);
        previousActiveElement.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentRoom = ROOM_CATALOG[activeRoomId] || ROOM_CATALOG["adenver-ai"];

  // Trigger signature Critical Event in Room 2 (lasts 6 seconds)
  const handleTriggerCritical = () => {
    if (isCriticalSimulated) return;
    soundManager.playSnap();
    setIsCriticalSimulated(true);
    setTimeout(() => {
      setIsCriticalSimulated(false);
    }, 6000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/95 backdrop-blur-2xl select-none overflow-hidden [perspective:1400px]">
        {/* Main 3D Room Viewer Window Enclosure with Smooth 3D Entrance Animation */}
        <motion.div
          ref={roomModalRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${currentRoom.name} 3D Interactive Room`}
          initial={{ opacity: 0, scale: 0.88, rotateX: 10, y: 35 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, rotateX: -8, y: 25 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{
            borderColor: `${currentRoom.themeColor}40`,
            boxShadow: `0 0 60px ${currentRoom.themeColor}1a, 0 25px 60px -15px rgba(0, 0, 0, 0.95)`,
            transformStyle: "preserve-3d",
          }}
          className="relative w-full max-w-6xl h-[92vh] bg-[#060606] border rounded-3xl flex flex-col overflow-hidden"
        >
          {/* Top Bar: Dedicated Single Project Identity (Completely Isolated - No other projects visible) */}
          <div
            className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[#1F1F1F] gap-3 z-30 transition-colors"
            style={{
              background: `linear-gradient(90deg, ${currentRoom.themeColor}0d 0%, #0a0a0a 45%, #0a0a0a 100%)`,
            }}
          >
            {/* Dedicated Project Identity */}
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center border transition-all shrink-0"
                style={{
                  backgroundColor: `${currentRoom.themeColor}18`,
                  borderColor: `${currentRoom.themeColor}50`,
                  color: currentRoom.themeColor,
                  boxShadow: `0 0 16px ${currentRoom.themeColor}28`,
                }}
              >
                <currentRoom.icon className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span
                    className="font-mono text-xs font-black tracking-widest uppercase"
                    style={{ color: currentRoom.themeColor }}
                  >
                    {currentRoom.name} // 3D ROOM
                  </span>
                  <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full font-mono text-[9px] uppercase tracking-wider bg-white/5 border border-white/10 text-zinc-400">
                    ISOLATED 3D SPACE
                  </span>
                </div>
                <span className="font-mono text-[10px] text-zinc-400 tracking-wider uppercase hidden xs:inline">
                  {currentRoom.title}
                </span>
              </div>
            </div>

            {/* Right: Engine Status Badge & Close [X] */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-[10px] text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>CINEMATIC 3D ENGINE</span>
              </div>

              <button
                onClick={onClose}
                aria-label="Exit 3D Room"
                className="w-8 h-8 rounded-full border border-[#262626] bg-[#141414] flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ACTIVE 3D ROOM VIEWER */}
          <div className="relative flex-1 w-full overflow-hidden">
            {renderMode === "webgl" ? (
              <div className="w-full h-full p-2 sm:p-3">
                <ThreeRoomCanvas
                  activeProjectId={activeRoomId}
                  onClose={onClose}
                />
              </div>
            ) : (
              <RoomShell
              key={activeRoomId} // Cleanly resets GSAP ticker, quickTo, and assembly stagger on switch
              roomId={currentRoom.id}
              roomTitle={currentRoom.title}
              roomCategory={currentRoom.category}
              themeColor={currentRoom.themeColor}
              accentBg={currentRoom.accentBg}
              tourSteps={currentRoom.tourSteps}
              currentStepIndex={currentStepIndex}
              onStepChange={setCurrentStepIndex}
              isPlayingTour={isPlayingTour}
              onTogglePlay={() => setIsPlayingTour(!isPlayingTour)}
              watermarkLabels={currentRoom.watermarks}
              // Signature Controls per room
              signatureControls={
                <>
                  {/* ROOM 2 SIGNATURE: Simulate Critical Event Button */}
                  {activeRoomId === "icu-monitoring" && (
                    <button
                      onClick={handleTriggerCritical}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        isCriticalSimulated
                          ? "bg-red-500 text-black shadow-[0_0_20px_#ef4444] animate-pulse"
                          : "bg-red-950/60 hover:bg-red-500 text-red-300 hover:text-black border border-red-800"
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{isCriticalSimulated ? "CRITICAL ACTIVE (6s)" : "SIMULATE CRITICAL"}</span>
                    </button>
                  )}

                  {/* ROOM 3 SIGNATURE: Income / Expense Filter Chips */}
                  {activeRoomId === "ets-expense" && (
                    <div className="flex items-center gap-1 bg-[#121212] border border-amber-900/50 rounded-full p-0.5 font-mono text-[9px]">
                      {(["all", "income", "expense"] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => {
                            soundManager.playSnap();
                            setEtsFilterMode(mode);
                          }}
                          className={`px-2 py-0.5 rounded-full uppercase transition-all cursor-pointer ${
                            etsFilterMode === mode
                              ? "bg-amber-400 text-black font-bold shadow-md"
                              : "text-zinc-400 hover:text-white"
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              }
            >
              {({ currentStep, currentStepIndex, hoveredProp, setHoveredProp, onSelectPropStep }) => (
                <>
                  {/* ROOM 1: THE CORE CHAMBER (Octagonal Cyberpunk Vault) */}
                  {activeRoomId === "adenver-ai" && (
                    <AdenverRoom
                      currentStep={currentStep}
                      currentStepIndex={currentStepIndex}
                      hoveredProp={hoveredProp}
                      setHoveredProp={setHoveredProp}
                      onSelectPropStep={onSelectPropStep}
                    />
                  )}

                  {/* ROOM 2: THE PATIENT BAY (Clinical Hospital Room) */}
                  {activeRoomId === "icu-monitoring" && (
                    <IcuRoom
                      currentStep={currentStep}
                      currentStepIndex={currentStepIndex}
                      hoveredProp={hoveredProp}
                      setHoveredProp={setHoveredProp}
                      onSelectPropStep={onSelectPropStep}
                      isCriticalSimulated={isCriticalSimulated}
                      onTriggerCritical={handleTriggerCritical}
                    />
                  )}

                  {/* ROOM 3: THE COUNTING HOUSE (Harvest Business Office) */}
                  {activeRoomId === "ets-expense" && (
                    <EtsRoom
                      currentStep={currentStep}
                      currentStepIndex={currentStepIndex}
                      hoveredProp={hoveredProp}
                      setHoveredProp={setHoveredProp}
                      onSelectPropStep={onSelectPropStep}
                      filterMode={etsFilterMode}
                      onFilterChange={setEtsFilterMode}
                    />
                  )}
                </>
              )}
            </RoomShell>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
