"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TimelineItem {
  primaryTitle: string;
  badge?: string;
  dateOrYear: string;
  description: string;
  certificateUrl?: string;
  linkUrl?: string;
  linkText?: string;
}

interface TimelineListProps {
  items: TimelineItem[];
}

export const TimelineList: React.FC<TimelineListProps> = ({ items }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const rows = containerRef.current?.querySelectorAll(".timeline-row");
      const dividers = containerRef.current?.querySelectorAll(".timeline-divider");

      // Draw hairline dividers left to right
      if (dividers && dividers.length > 0) {
        gsap.fromTo(
          dividers,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Each row fades and slides up on entry
      if (rows && rows.length > 0) {
        gsap.fromTo(
          rows,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
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
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col select-none">
      {items.map((item, idx) => (
        <div key={idx} className="relative">
          {/* Hairline divider that draws left to right */}
          <div className="timeline-divider w-full h-[1px] bg-[#1F1F1F] origin-left will-change-transform" />

          {/* Job row: fades & slides up on entry */}
          <div className="timeline-row grid grid-cols-1 md:grid-cols-12 gap-4 py-8 items-start group hover:bg-[#0D0D0D] px-4 rounded-xl transition-colors duration-300 will-change-transform">
            <div className="md:col-span-4">
              <h4 className="font-display font-bold text-xl text-white group-hover:text-zinc-200 transition-colors">
                {item.primaryTitle}
              </h4>
              {item.badge && (
                <span className="inline-block mt-2 font-mono text-[10px] uppercase italic tracking-widest text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 px-2.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </div>

            <div className="md:col-span-5">
              <p className="text-zinc-400 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="md:col-span-3 md:text-right flex flex-col md:items-end justify-between gap-2.5 font-mono text-xs uppercase italic tracking-wider text-zinc-400">
              <span className="mb-0.5">{item.dateOrYear}</span>
              <div className="flex flex-col md:items-end gap-2 w-full md:w-auto">
                {item.linkUrl && (
                  <a
                    href={item.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 text-[11px] font-mono text-emerald-400 hover:text-white transition-colors not-italic border border-emerald-900/60 bg-emerald-950/40 px-3 py-1 rounded-full group-hover:border-emerald-500/50 cursor-pointer whitespace-nowrap"
                  >
                    <span>{item.linkText || "VIEW PAPER"}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
                {item.certificateUrl && (
                  <a
                    href={item.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 text-[11px] font-mono text-cyan-400 hover:text-white transition-colors not-italic border border-cyan-900/60 bg-cyan-950/30 px-3 py-1 rounded-full group-hover:border-cyan-500/50 cursor-pointer whitespace-nowrap"
                  >
                    <span>VIEW CERTIFICATE</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      {/* Bottom final divider */}
      <div className="timeline-divider w-full h-[1px] bg-[#1F1F1F] origin-left will-change-transform" />
    </div>
  );
};
