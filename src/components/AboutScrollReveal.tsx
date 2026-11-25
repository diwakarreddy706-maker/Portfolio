"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const AboutScrollReveal: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(prefersReduced);
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`relative w-full ${reducedMotion ? "py-10" : ""}`}
    >
      {/* 1. Heading, z-index 1 (pinned at top: 12vh while section scrolls) */}
      <div
        ref={headingRef}
        className={`${
          reducedMotion ? "relative mb-10" : "sticky top-[12vh]"
        } z-[1] w-full flex flex-col items-center justify-center text-center select-none px-4 pointer-events-none`}
      >
        <h2
          className="tracking-tight uppercase text-white text-center font-extrabold font-display"
          style={{
            fontFamily: "var(--font-display), sans-serif",
            fontSize: "clamp(1.4rem, 3.2vw, 3rem)",
            lineHeight: 0.95,
          }}
        >
          <span className="block whitespace-nowrap">MORE ABOUT</span>
          <span className="block whitespace-nowrap">DIWAKAR©</span>
        </h2>
      </div>

      {/* 2. ONE container wrapping Card AND Text block: opaque background (#0a0a0a), full viewport width, relative, z-index: 2 */}
      <div
        className={`relative z-[2] flex flex-col items-center pb-20 ${
          reducedMotion ? "mt-0" : "mt-[45vh] sm:mt-[55vh]"
        }`}
        style={{
          backgroundColor: "#0a0a0a",
          width: "100vw",
          marginLeft: "calc(50% - 50vw)",
          marginRight: "calc(50% - 50vw)",
        }}
      >
        {/* Inner Centered Container */}
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center">
          {/* Portrait card (opaque background, tall ~3:4, rounded 4-6px) */}
          <div
            ref={cardRef}
            className="relative w-full max-w-sm sm:max-w-md mx-auto bg-[#0a0a0a] p-2 sm:p-2.5 rounded-[6px] shadow-2xl border border-[#222222]"
          >
            <div className="relative aspect-[3/4] w-full rounded-[4px] overflow-hidden bg-[#0a0a0a]">
              <Image
                src="/portrait.jpg"
                alt="Portrait of Diwakar Reddy in grayscale"
                fill
                sizes="(max-width: 640px) 100vw, 448px"
                className="object-cover"
                style={{
                  objectPosition: "55% 4%",
                  filter: "grayscale(100%) brightness(0.85) contrast(1.15)",
                }}
              />
            </div>
          </div>

          {/* Text block directly beneath the card (scrolls up with it at the same speed) */}
          <div className="w-full max-w-3xl mx-auto text-center mt-10 md:mt-14 px-4">
            {/* Bold line */}
            <h3 className="font-display font-black text-xl sm:text-2xl md:text-3xl text-white uppercase tracking-tight leading-snug mb-6 max-w-2xl mx-auto">
              I&apos;M A COMPUTER SCIENCE AND DESIGN STUDENT IN BENGALURU.
            </h3>

            {/* Bold paragraph (3 lines) */}
            <p className="font-display font-bold text-base sm:text-lg md:text-xl text-zinc-200 uppercase tracking-tight leading-relaxed mb-6 max-w-2xl mx-auto">
              I BUILD RESPONSIVE INTERFACES AND WORKING APPLICATIONS, FROM A LOCAL-FIRST AI ASSISTANT TO A REAL BUSINESS EXPENSE SYSTEM.
            </p>

            {/* Grey body paragraph (about 4 lines) */}
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-10 max-w-2xl mx-auto">
              I&apos;m a B.E. student at Rajarajeswari College of Engineering, learning by building. My work covers Python, Django, JavaScript and React, with a focus on practical problem-solving. I&apos;m looking to apply these skills on real-world software projects while I keep improving.
            </p>

            {/* Button: white pill "DOWNLOAD RESUME" (hover: white fill inverts to outline, 0.3s ease, no movement) */}
            <div>
              <a
                href="/Diwakar_Reddy_Resume.pdf"
                download="Diwakar_Reddy_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white text-black border border-white font-mono text-xs uppercase tracking-widest font-bold hover:bg-transparent hover:text-white transition-colors duration-300 shadow-xl cursor-pointer"
              >
                DOWNLOAD RESUME
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
