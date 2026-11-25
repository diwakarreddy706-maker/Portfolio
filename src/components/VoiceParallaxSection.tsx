"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personalInfo } from "../data/portfolio";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const VoiceParallaxSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);
  const signaturePath1Ref = useRef<SVGPathElement>(null);
  const signaturePath2Ref = useRef<SVGPathElement>(null);
  const floatingCardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Pin statement section while scrolling through
      const pinTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        pin: pinContainerRef.current,
        start: "top top",
        end: "+=130%",
        scrub: 1,
      });

      // 2. Timeline for floating interest/work images: appear around text, drift upward, fade out
      // (scale: 0.8 -> 1, opacity: 0 -> 1 -> 0, drift y: 0 -> -60)
      const cards = floatingCardsRef.current?.querySelectorAll(".floating-pill-card");
      if (cards && cards.length > 0) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=130%",
            scrub: 1,
          },
        });

        // Stagger each image so max ~3 are active at any point
        cards.forEach((card, i) => {
          const startAt = i * 0.18;
          tl.fromTo(
            card,
            { scale: 0.78, opacity: 0, y: 35 },
            {
              scale: 1,
              opacity: 1,
              y: 0,
              duration: 0.22,
              ease: "power2.out",
            },
            startAt
          ).to(
            card,
            {
              y: -50,
              opacity: 0,
              scale: 0.9,
              duration: 0.20,
              ease: "power2.in",
            },
            startAt + 0.32
          );
        });
      }

      // 3. Handwritten signature draw effect via stroke-dashoffset
      if (signaturePath1Ref.current && signaturePath2Ref.current) {
        const len1 = signaturePath1Ref.current.getTotalLength() || 500;
        const len2 = signaturePath2Ref.current.getTotalLength() || 250;

        gsap.set(signaturePath1Ref.current, {
          strokeDasharray: len1,
          strokeDashoffset: len1,
        });
        gsap.set(signaturePath2Ref.current, {
          strokeDasharray: len2,
          strokeDashoffset: len2,
        });

        const sigTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top+=40% top",
            end: "+=60%",
            scrub: 1,
          },
        });

        sigTl
          .to(signaturePath1Ref.current, { strokeDashoffset: 0, ease: "none" })
          .to(signaturePath2Ref.current, { strokeDashoffset: 0, ease: "none" }, "-=0.2");
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen my-12 border-t border-b border-[#1F1F1F] overflow-hidden select-none"
    >
      {/* Pinned Viewport Container */}
      <div
        ref={pinContainerRef}
        className="w-full h-screen flex flex-col items-center justify-center relative px-6 md:px-12 bg-[#0a0a0a]"
      >
        {/* Subtle Background Microdot Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:22px_22px] pointer-events-none" />

        {/* Floating Images Container (Max 3 visible at once as user scrolls) */}
        <div
          ref={floatingCardsRef}
          className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
        >
          {/* Floating Card 1: Top-Left Portrait snapshot */}
          <div aria-hidden="true" className="floating-pill-card absolute left-[4%] sm:left-[8%] top-[12%] sm:top-[16%] w-40 sm:w-52 rounded-2xl border border-zinc-700 bg-black/95 p-2 shadow-2xl opacity-0 will-change-transform">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-zinc-900">
              <Image
                src="/portrait.jpg"
                alt=""
                fill
                sizes="(max-width: 640px) 160px, 208px"
                className="object-cover object-top"
              />
            </div>
            <div className="p-1.5 font-mono text-[9px] uppercase tracking-wider text-zinc-400 text-center">
              WORKSPACE // BENGALURU
            </div>
          </div>

          {/* Floating Card 2: Top-Right Java Core Telemetry Terminal */}
          <div aria-hidden="true" className="floating-pill-card absolute right-[4%] sm:right-[9%] top-[14%] sm:top-[18%] w-48 sm:w-60 rounded-2xl border border-emerald-900/80 bg-black/95 p-3 shadow-2xl opacity-0 will-change-transform">
            <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400 pb-1.5 border-b border-zinc-900 mb-1.5">
              <span className="text-emerald-400 font-bold">DIWAKAR_CORE.JAVA</span>
              <span className="text-emerald-400">● LIVE</span>
            </div>
            <div className="font-mono text-[9px] text-emerald-400/90 space-y-0.5 leading-tight">
              <div>&gt; STATUS: COMPILED_OK</div>
              <div className="text-zinc-400">ADDR: 12.9716° N, 77.5946° E</div>
              <div>MEM: 64MB // JAVA_CORE</div>
              <div className="text-emerald-300">&gt; JAVA_CORE</div>
            </div>
          </div>

          {/* Floating Card 3: Mid-Left Candid Perspective */}
          <div aria-hidden="true" className="floating-pill-card absolute left-[6%] sm:left-[10%] bottom-[16%] sm:bottom-[20%] w-44 sm:w-56 rounded-2xl border border-zinc-700 bg-black/95 p-2 shadow-2xl opacity-0 will-change-transform">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-zinc-900">
              <Image
                src="/about-portrait.jpg"
                alt=""
                fill
                sizes="(max-width: 640px) 176px, 224px"
                className="object-cover"
                style={{ objectPosition: "center 20%" }}
              />
            </div>
            <div className="p-1.5 font-mono text-[9px] uppercase tracking-wider text-zinc-400 text-center">
              SYSTEM EXPLORATION // 2026
            </div>
          </div>

          {/* Floating Card 4: Bottom-Right Sunset Horizon */}
          <div aria-hidden="true" className="floating-pill-card absolute right-[5%] sm:right-[10%] bottom-[14%] sm:bottom-[18%] w-48 sm:w-64 rounded-2xl border border-zinc-700 bg-black/95 p-2 shadow-2xl opacity-0 will-change-transform">
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-zinc-900">
              <Image
                src="/sunset-lifestyle.jpg"
                alt=""
                fill
                sizes="(max-width: 640px) 192px, 256px"
                className="object-cover"
                style={{ objectPosition: "center 39%" }}
              />
            </div>
            <div className="p-1.5 font-mono text-[9px] uppercase tracking-wider text-zinc-400 text-center">
              HORIZON // 12° 58&apos; 44.7&quot; N
            </div>
          </div>
        </div>

        {/* Centered Pinned Statement Text */}
        <div
          ref={statementRef}
          className="relative z-20 max-w-4xl mx-auto text-center"
        >
          <span className="font-mono text-xs uppercase italic tracking-widest text-zinc-400 mb-6 block">
            05 // STATEMENT Â· SINCE {personalInfo.sinceYear}
          </span>

          <blockquote className="font-display font-black text-2xl sm:text-4xl md:text-5xl lg:text-[3.25rem] tracking-tight uppercase leading-[1.08] text-white my-6">
            A BENGALURU-BASED SOFTWARE DEVELOPER, SPECIALIZING IN HELPING TEAMS AND ORGANIZATIONS TURN THEIR IDEAS INTO IMPACTFUL DIGITAL PRODUCTS AND SOFTWARE SOLUTIONS.
          </blockquote>

          {/* Handwritten Signature with SVG stroke-dashoffset draw effect */}
          <div className="flex flex-col items-center justify-center gap-3 mt-8">
            <svg
              viewBox="0 0 240 70"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-14 sm:h-16 w-auto text-white stroke-white opacity-95"
            >
              <path
                ref={signaturePath1Ref}
                d="M15 45 C18 20, 28 8, 38 35 C42 48, 36 60, 48 52 C58 44, 62 25, 68 40 C72 50, 80 48, 88 38 C96 28, 102 44, 110 38 C118 32, 126 46, 134 36 C142 26, 148 42, 156 34 C164 26, 172 40, 180 32 C192 20, 204 45, 225 25"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                ref={signaturePath2Ref}
                d="M32 30 Q70 22, 130 25 Q180 28, 215 22"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            <span className="font-mono text-xs text-zinc-400 uppercase italic tracking-widest">
              {personalInfo.fullName.toUpperCase()}Â©
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
