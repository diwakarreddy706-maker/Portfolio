"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SectionHeaderProps {
  index: string;
  tag: string;
  title: string;
  year?: string;
  twoLines?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  index,
  tag,
  title,
  year,
  twoLines = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const lines = headingRef.current?.querySelectorAll(".header-line");
      if (lines && lines.length > 0) {
        gsap.fromTo(
          lines,
          { yPercent: 100 },
          {
            yPercent: 0,
            duration: 0.9,
            ease: "power4.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Split title if twoLines requested or if title is "LATEST PORTFOLIO"
  const lines =
    twoLines || title === "LATEST PORTFOLIO"
      ? title.split(" ")
      : [title];

  return (
    <div
      ref={containerRef}
      className="flex flex-col md:flex-row md:items-end justify-between border-t border-[#1F1F1F] pt-20 pb-10 select-none"
    >
      <div>
        <span className="font-mono text-xs uppercase italic tracking-widest text-zinc-400 mb-3 block">
          {index} {tag}
        </span>
        <h2
          ref={headingRef}
          className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white uppercase leading-[0.92]"
        >
          {lines.map((line, idx) => (
            <span key={idx} className="block overflow-hidden pb-1">
              <span className="block header-line will-change-transform">
                {line}
              </span>
            </span>
          ))}
        </h2>
      </div>

      {year && (
        <span className="font-mono text-xs uppercase italic tracking-widest text-zinc-400 mt-4 md:mt-0 font-medium">
          {year}
        </span>
      )}
    </div>
  );
};
