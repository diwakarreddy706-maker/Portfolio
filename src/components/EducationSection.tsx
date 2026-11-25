"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { education } from "../data/portfolio";
import { Award } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const EducationSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const rows = containerRef.current?.querySelectorAll(".edu-row");
      const dividers = containerRef.current?.querySelectorAll(".edu-divider");

      if (dividers && dividers.length > 0) {
        gsap.fromTo(
          dividers,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      if (rows && rows.length > 0) {
        gsap.fromTo(
          rows,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.15,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {education.map((item, idx) => (
        <div key={`${item.level}-${idx}`} className="edu-row group">
          {/* Hairline Divider with scaleX transform origin left */}
          <div className="edu-divider w-full h-[1px] bg-[#1F1F1F] origin-left" />

          {/* Timeline Row Container */}
          <div className="py-8 md:py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start transition-colors duration-300 group-hover:bg-[#111111]/40 rounded-xl px-2 sm:px-4">
            {/* Left Column: Level Badge & Timeline Year (cols 1-3) */}
            <div className="lg:col-span-3 flex flex-row lg:flex-col items-center lg:items-start justify-between lg:justify-start gap-2">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center justify-center px-3 py-1 rounded bg-[#161616] border border-[#2b2b2b] text-emerald-400 font-mono text-xs font-bold tracking-wider">
                  {item.level}
                </span>
                {item.status && (
                  <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800">
                    {item.status}
                  </span>
                )}
              </div>
              <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                {item.years}
              </span>
            </div>

            {/* Middle Column: Institution, Qualification & Board (cols 4-9) */}
            <div className="lg:col-span-6 space-y-2">
              <h3 className="text-lg md:text-xl font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors duration-200">
                {item.institution}
              </h3>
              <p className="text-sm md:text-base text-zinc-200 font-medium">
                {item.qualification}
              </p>

              {item.board && (
                <p className="font-mono text-xs text-zinc-400">
                  <span className="text-zinc-400 uppercase italic">Board: </span>
                  <span className="text-zinc-300">{item.board}</span>
                </p>
              )}

              <p className="font-mono text-xs text-zinc-400">
                <span className="text-zinc-400 uppercase italic">Location: </span>
                <span className="text-zinc-300">{item.location}</span>
              </p>

              {item.subjects && item.subjects.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {item.subjects.map((sub, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded bg-[#141414] border border-[#242424] text-[11px] font-mono text-zinc-300"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Result Badge (cols 10-12) */}
            <div className="lg:col-span-3 flex flex-col lg:items-end gap-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-semibold tracking-wide">
                <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{item.result}</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Bottom Closing Hairline Divider */}
      <div className="edu-divider w-full h-[1px] bg-[#1F1F1F] origin-left" />
    </div>
  );
};
