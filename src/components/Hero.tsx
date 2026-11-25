"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, Globe, BadgeCheck } from "lucide-react";
import { personalInfo, metadataStrip } from "../data/portfolio";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const Hero: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const wordmarkMaskRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const infoStripRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Giant "DIWAKAR" wordmark translates up on scroll, clipped by overflow mask (no fade)
      if (wordmarkRef.current && sectionRef.current) {
        gsap.to(wordmarkRef.current, {
          y: -140,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      // 2. Info items scroll up slightly faster than the wordmark (parallax)
      if (infoStripRef.current && sectionRef.current) {
        gsap.to(infoStripRef.current, {
          y: -220,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      // 3. Hero photo rises in initially
      if (frameRef.current) {
        gsap.fromTo(
          frameRef.current,
          { y: 70, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.1, ease: "power3.out", delay: 0.2 }
        );

        // Scrubbed top and bottom crop (clip-path inset)
        gsap.fromTo(
          frameRef.current,
          { clipPath: "inset(0% 0% 0% 0% round 24px)" },
          {
            clipPath: "inset(14% 0% 14% 0% round 24px)",
            ease: "none",
            scrollTrigger: {
              trigger: frameRef.current,
              start: "top 45%",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      }

      // 4. Image inside moves slower (parallax, scale ~1.15 -> 1)
      if (imgRef.current && frameRef.current) {
        gsap.fromTo(
          imgRef.current,
          { scale: 1.15, yPercent: 0 },
          {
            scale: 1.0,
            yPercent: -12,
            ease: "none",
            scrollTrigger: {
              trigger: frameRef.current,
              start: "top 45%",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative pt-8 pb-16 overflow-hidden bg-[#0a0a0a]"
    >
      {/* Giant "DIWAKAR" wordmark with fit-text width constraint and overflow clip */}
      <div
        ref={wordmarkMaskRef}
        className="w-full overflow-hidden flex justify-center items-center select-none py-2 px-2"
      >
        <h1
          ref={wordmarkRef}
          className="font-display font-black text-[17.2vw] leading-[0.80] tracking-tighter text-white uppercase whitespace-nowrap text-center cursor-default will-change-transform"
        >
          {personalInfo.name}
        </h1>
      </div>

      {/* Clear First Screen Statement & Availability Status */}
      <div className="flex items-center justify-center pt-2 pb-1 px-4">
        <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#111111]/90 border border-zinc-800 backdrop-blur-md shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
          <span className="font-mono text-xs text-white font-semibold tracking-wide">
            Full-stack &amp; AI developer
          </span>
          <span className="text-zinc-600">·</span>
          <span className="font-mono text-xs text-zinc-300">Bengaluru</span>
          <span className="text-zinc-600">·</span>
          <span className="font-mono text-xs text-emerald-400 font-semibold tracking-wide">
            Open to internships
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* 3-Column Metadata Strip (Parallax faster than wordmark) */}
        <div
          ref={infoStripRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 my-6 border-t border-b border-[#1F1F1F] text-center will-change-transform"
        >
          {metadataStrip.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center">
                {item.iconType === "pin" && (
                  <MapPin className="w-4 h-4 text-[#22c55e]" />
                )}
                {item.iconType === "globe" && (
                  <Globe className="w-4 h-4 text-neutral-200" strokeWidth={1.6} />
                )}
                {item.iconType === "badge" && (
                  <BadgeCheck className="w-4 h-4 text-[#38bdf8]" />
                )}
              </div>
              <span className="font-mono text-[10px] uppercase italic tracking-widest text-zinc-400">
                {item.tag}
              </span>
              <span className="font-display font-bold text-xs md:text-sm text-white tracking-tight uppercase">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Hero Portrait Banner with Clip-Path Scrub & Inner Parallax */}
        <div
          ref={frameRef}
          className="relative w-full h-[520px] sm:h-[620px] md:h-[720px] lg:h-[780px] rounded-2xl md:rounded-3xl overflow-hidden border border-[#1F1F1F] shadow-2xl group bg-[#0D0D0D] will-change-transform"
          style={{ clipPath: "inset(0% 0% 0% 0% round 24px)" }}
        >
          <Image
            ref={imgRef}
            src="/portrait.jpg"
            alt="Diwakar Reddy Portrait"
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover transition-filter duration-700 will-change-transform"
            style={{ objectPosition: "55% 4%" }}
          />
          {/* Bottom subtle shadow gradient for text badge legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Identification Pill Badge */}
          <div className="absolute bottom-6 left-6 px-4 py-2 rounded-full bg-black/85 backdrop-blur-md border border-[#262626] flex items-center gap-2.5 font-mono text-xs text-neutral-200 shadow-xl z-10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
            <span className="font-mono text-xs uppercase tracking-wider font-semibold">
              Full-stack &amp; AI developer · Bengaluru · Open to internships
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
