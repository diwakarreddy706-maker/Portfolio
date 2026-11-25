"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { approachPhases, personalInfo } from "../data/portfolio";
import { Bot, Cpu, Activity, Terminal } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const IntroApproach: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const dotsContainerRef = useRef<HTMLDivElement>(null);
  const lineFillRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  // Cycling thumbnail index for approach card visual
  const [thumbIndex, setThumbIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setThumbIndex((prev) => (prev + 1) % 3);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Intro headline reveals line by line from below overflow-hidden mask
      // (y: 100% -> 0, 0.9s, power4.out, 0.1s stagger)
      const lines = headlineRef.current?.querySelectorAll(".headline-line");
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
              trigger: headlineRef.current,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 2. Subtext fades in after
      if (subtextRef.current) {
        gsap.fromTo(
          subtextRef.current,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headlineRef.current,
              start: "top 75%",
              toggleActions: "play none none none",
            },
            delay: 0.35,
          }
        );
      }

      // 3. Line connecting the 3 numbered dots draws across as user scrolls (scrub: 1)
      if (lineFillRef.current && dotsContainerRef.current) {
        gsap.fromTo(
          lineFillRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: dotsContainerRef.current,
              start: "top 80%",
              end: "bottom 55%",
              scrub: 1,
            },
          }
        );
      }

      // 4. Three cards fade/slide up with a 0.15s stagger
      const cards = cardsContainerRef.current?.querySelectorAll(".approach-card");
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 55 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.15,
            scrollTrigger: {
              trigger: cardsContainerRef.current,
              start: "top 82%",
              toggleActions: "play none none none",
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
      id="approach"
      className="pb-28 pt-20 border-t border-[#1F1F1F] select-none"
    >
      {/* Index Tag */}
      <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-zinc-400 mb-8">
        <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
        <span>01 // APPROACH &amp; METHODOLOGY</span>
      </div>

      {/* Intro Headline - Each line inside an overflow-hidden mask */}
      <div ref={headlineRef} className="max-w-5xl mb-8">
        <h2 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-[5.2vw] tracking-tighter uppercase leading-[0.92] text-white">
          <span className="block overflow-hidden pb-1">
            <span className="block headline-line will-change-transform">
              I&apos;M {personalInfo.name.toUpperCase()},
            </span>
          </span>
          <span className="block overflow-hidden pb-1">
            <span className="block headline-line will-change-transform">
              A SOFTWARE DEVELOPER
            </span>
          </span>
          <span className="block overflow-hidden pb-1">
            <span className="block headline-line will-change-transform text-zinc-400">
              BUILDING SCALABLE SYSTEMS.
            </span>
          </span>
        </h2>
      </div>

      {/* Subtext fades in after */}
      <p
        ref={subtextRef}
        className="font-display font-bold text-lg sm:text-xl md:text-2xl text-zinc-300 uppercase tracking-tight leading-snug max-w-3xl mb-16 will-change-transform"
      >
        We engineer high-throughput systems through systematic exploration, resilient architectures, and continuous observability.
      </p>

      {/* 3 Numbered Dots (01, 02, 03) Connected by Thin Scrubbed Line */}
      <div ref={dotsContainerRef} className="relative my-14">
        {/* Track Line */}
        <div className="w-full h-[1px] bg-zinc-800 relative">
          <div
            ref={lineFillRef}
            className="absolute inset-0 bg-white origin-left will-change-transform"
          />
        </div>

        {/* Numbered Dots overlay */}
        <div className="relative -top-3.5 flex justify-between items-center w-full">
          {["01 // EXPLORATION", "02 // ARCHITECTURE", "03 // OBSERVABILITY"].map((label, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-[#0a0a0a] border border-white flex items-center justify-center shadow-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
              </div>
              <span className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-zinc-300 mt-2 text-center whitespace-nowrap">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Three Approach Cards - Staggered Slide-Up */}
      <div
        ref={cardsContainerRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6"
      >
        {approachPhases.map((phase, idx) => (
          <div
            key={phase.num}
            className="approach-card rounded-2xl border border-[#1F1F1F] bg-[#0E0E0E] p-6 flex flex-col justify-between hover:border-zinc-500 transition-colors duration-300 shadow-xl group will-change-transform"
          >
            <div>
              {/* Header with Step label and Dot Fill Indicator */}
              <div className="flex items-center justify-between pb-4 border-b border-[#1A1A1A] mb-5">
                <span className="font-mono text-[11px] uppercase italic tracking-widest text-zinc-400">
                  {phase.step}
                </span>

                {/* Dot Indicator Fills: Card 1 = 1 dot, Card 2 = 2 dots, Card 3 = 3 dots */}
                <div className="flex items-center gap-1.5" title={`Step ${idx + 1} of 3`}>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      idx >= 0
                        ? "bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]"
                        : "bg-zinc-700"
                    }`}
                  />
                  <span
                    className={`w-2 h-2 rounded-full ${
                      idx >= 1
                        ? "bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]"
                        : "bg-zinc-700"
                    }`}
                  />
                  <span
                    className={`w-2 h-2 rounded-full ${
                      idx >= 2
                        ? "bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]"
                        : "bg-zinc-700"
                    }`}
                  />
                </div>
              </div>

              <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight mb-3 group-hover:text-zinc-200 transition-colors">
                {phase.title}
              </h3>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mb-6">
                {phase.description}
              </p>
            </div>

            {/* Thumbnail Trio Cycle Area */}
            <div className="w-full h-24 rounded-xl bg-black border border-[#1F1F1F] p-3 flex items-center justify-between overflow-hidden relative">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#141414] border border-[#262626] flex items-center justify-center text-zinc-300">
                  {idx === 0 && <Bot className="w-4 h-4 text-emerald-400" />}
                  {idx === 1 && <Cpu className="w-4 h-4 text-sky-400" />}
                  {idx === 2 && <Activity className="w-4 h-4 text-amber-400" />}
                </div>
                <div className="font-mono text-[10px] text-zinc-400 leading-tight">
                  <div className="text-white font-bold tracking-wider">
                    {idx === 0 && "NEURAL ROUTING"}
                    {idx === 1 && "CORE ARCHITECTURE"}
                    {idx === 2 && "LIVE TELEMETRY"}
                  </div>
                  <div className="text-zinc-400">
                    {idx === 0 && (thumbIndex === 0 ? "Ollama Local" : thumbIndex === 1 ? "Groq API" : "Gemini API")}
                    {idx === 1 && (thumbIndex === 0 ? "PySide6 Desktop" : thumbIndex === 1 ? "Django & MySQL" : "Flask & SQLite")}
                    {idx === 2 && (thumbIndex === 0 ? "ESP32 Sensors" : thumbIndex === 1 ? "Socket.IO Live" : "Local Summaries")}
                  </div>
                </div>
              </div>

              {/* Pulsing state dot */}
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[9px] text-emerald-400 font-bold">READY</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
