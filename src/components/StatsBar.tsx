"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { stats } from "../data/portfolio";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const StatsBar: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const numRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      stats.forEach((stat, idx) => {
        const numEl = numRefs.current[idx];
        const labelEl = labelRefs.current[idx];
        if (!numEl) return;

        const raw = String(stat.number).trim();
        const hasPlus = raw.endsWith("+");
        const targetNum = parseFloat(raw.replace(/[^0-9.]/g, "")) || 0;
        const isDecimal = raw.includes(".");
        const decimalPlaces = isDecimal ? (raw.split(".")[1]?.length || 2) : 0;

        const counterObj = { val: 0 };

        // Number counts up from 0 when entering viewport
        gsap.to(counterObj, {
          val: targetNum,
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          onUpdate: () => {
            if (numEl) {
              const formatted = isDecimal
                ? counterObj.val.toFixed(decimalPlaces)
                : Math.floor(counterObj.val).toString();
              numEl.innerText = `${formatted}${hasPlus ? "+" : ""}`;
            }
          },
        });

        // Small uppercase label fading in beneath
        if (labelEl) {
          gsap.fromTo(
            labelEl,
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              delay: 0.2 + idx * 0.08,
              scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 py-12 border-t border-b border-[#1F1F1F] my-8 select-none"
    >
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center md:items-start p-6 bg-[#0D0D0D] border border-[#1F1F1F] rounded-2xl hover:border-zinc-600 transition-colors duration-300 shadow-xl"
        >
          <div className="font-display font-black text-4xl md:text-6xl text-white mb-2 tracking-tight">
            <span
              ref={(el) => {
                numRefs.current[idx] = el;
              }}
            >
              0
            </span>
          </div>
          <div
            ref={(el) => {
              labelRefs.current[idx] = el;
            }}
            className="font-mono text-xs uppercase italic tracking-widest text-zinc-400 text-center md:text-left will-change-transform"
          >
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};
