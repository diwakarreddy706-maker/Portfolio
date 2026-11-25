"use client";

import React, { useEffect, useRef, useState } from "react";

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [cursorMode, setCursorMode] = useState<"default" | "view" | "link">("default");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable on touch devices or reduced motion
    if (
      typeof window === "undefined" ||
      window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let currX = -100;
    let currY = -100;
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const onMouseEnter = () => setIsVisible(true);
    const onMouseLeave = () => setIsVisible(false);

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.closest('[data-cursor="view"]') || target.closest(".project-card")) {
        setCursorMode("view");
      } else if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest('[role="button"]') ||
        target.closest(".interactive-target")
      ) {
        setCursorMode("link");
      } else {
        setCursorMode("default");
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseenter", onMouseEnter);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("mouseover", onMouseOver);

    // RAF smooth inertia loop (lerp ~0.15)
    const render = () => {
      currX += (mouseX - currX) * 0.15;
      currY += (mouseY - currY) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currX}px, ${currY}px, 0)`;
      }

      animId = requestAnimationFrame(render);
    };
    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseenter", onMouseEnter);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(animId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 will-change-transform"
      style={{ left: 0, top: 0 }}
      aria-hidden="true"
    >
      <div
        className={`flex items-center justify-center transition-all duration-200 ease-out ${
          cursorMode === "view"
            ? "px-3.5 py-1.5 rounded-full bg-white text-black shadow-2xl scale-100"
            : cursorMode === "link"
            ? "w-8 h-8 rounded-full border border-white/80 bg-white/10 backdrop-blur-xs scale-100"
            : "w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] scale-100"
        }`}
      >
        {cursorMode === "view" && (
          <span
            ref={textRef}
            className="font-mono text-[10px] font-black tracking-widest text-black uppercase select-none animate-fadeIn"
          >
            VIEW
          </span>
        )}
      </div>
    </div>
  );
};
