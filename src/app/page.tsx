"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { IntroApproach } from "../components/IntroApproach";
import { SectionHeader } from "../components/SectionHeader";
import { ProjectGrid } from "../components/ProjectGrid";
import { AboutScrollReveal } from "../components/AboutScrollReveal";
import { VoiceParallaxSection } from "../components/VoiceParallaxSection";
import { StatsBar } from "../components/StatsBar";
import { TimelineList } from "../components/TimelineList";
import { EducationSection } from "../components/EducationSection";
import { SkillsGrid } from "../components/SkillsGrid";
import { ContactModal } from "../components/ContactModal";
import { NavMenuOverlay } from "../components/NavMenuOverlay";
import { Footer } from "../components/Footer";
import { Reveal } from "../components/Reveal";
import { ScrollProgress } from "../components/ScrollProgress";
import { TerminalDrawer } from "../components/TerminalDrawer";
import dynamic from "next/dynamic";

const IcuSimulatorModal = dynamic(
  () => import("../components/IcuSimulator").then((mod) => mod.IcuSimulatorModal),
  {
    ssr: false,
    loading: () => null,
  }
);

const AskMyAI = dynamic(
  () => import("../components/AskMyAI").then((mod) => mod.AskMyAI),
  {
    ssr: false,
    loading: () => null,
  }
);
import {
  personalInfo,
  experiences,
  awards,
} from "../data/portfolio";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [isIcuSimulatorOpen, setIsIcuSimulatorOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize smooth inertial scroll (Lenis, lerp ~0.08) connected with GSAP ScrollTrigger
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    // Skip Lenis on touch devices for native, responsive touch scrolling
    if (prefersReducedMotion || isTouch) return;

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      syncTouch: false,
    });
    lenisRef.current = lenis;

    // Connect Lenis to ScrollTrigger update
    lenis.on("scroll", ScrollTrigger.update);

    const tickerHandler = (time: number) => {
      if (document.hidden) return; // Pause RAF loop work when tab is hidden
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerHandler);
    gsap.ticker.lagSmoothing(0);

    // Pause/resume GSAP ticker & Lenis & CSS marquee on tab visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        lenis.stop();
        gsap.ticker.sleep();
        document.body.classList.add("tab-hidden");
      } else {
        lenis.start();
        gsap.ticker.wake();
        document.body.classList.remove("tab-hidden");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      lenis.destroy();
      gsap.ticker.remove(tickerHandler);
      lenisRef.current = null;
    };
  }, []);

  return (
    <main id="main-content" className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Skip to Content Accessible Link */}
      <a
        href="#portfolio"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:font-mono focus:text-xs focus:uppercase focus:font-bold focus:tracking-wider focus:rounded-full focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
      >
        Skip to content
      </a>

      {/* Top 2px Architectural Hairline Scroll Progress Bar */}
      <ScrollProgress />

      <Navbar
        onOpenContact={() => setIsContactOpen(true)}
        onToggleMenu={() => setIsNavMenuOpen((prev) => !prev)}
        isMenuOpen={isNavMenuOpen}
        lenisRef={lenisRef}
      />
      <NavMenuOverlay
        isOpen={isNavMenuOpen}
        onClose={() => setIsNavMenuOpen(false)}
        onOpenContact={() => setIsContactOpen(true)}
        lenisRef={lenisRef}
      />

      {/* Hero Section with Fit-Text Wordmark & Parallax Clip-Path */}
      <Hero />

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section 01 //INTRO & APPROACH (Line-masked headline, scrubbed line, 3 cards) */}
        <IntroApproach />

        {/* Section 02 //PORTFOLIO (Two-line masked heading & staggered parallax cards) */}
        <section id="portfolio" className="pb-24">
          <SectionHeader
            index="02"
            tag="//PORTFOLIO"
            title="LATEST PORTFOLIO"
            twoLines={true}
            year="2023 - 2026"
          />
          <ProjectGrid onOpenIcuSimulator={() => setIsIcuSimulatorOpen(true)} />
        </section>

        {/* Section 03 //WHO AM I (Scale heading, dark-fade portrait, line-by-line bio) */}
        <section id="about" className="py-24 border-t border-[#1F1F1F]">
          {/* Top 3-Column Header Bar: 03 | //WHO AM I | SINCE 2023 */}
          <Reveal>
            <div className="flex items-center justify-between py-4 border-b border-[#1F1F1F] font-mono text-xs uppercase italic tracking-widest text-zinc-400 mb-12 md:mb-16">
              <span>03</span>
              <span className="text-zinc-300">//WHO AM I</span>
              <span>SINCE {personalInfo.sinceYear}</span>
            </div>
          </Reveal>

          {/* Animated Scroll-Linked Reveal Component */}
          <AboutScrollReveal />

          {/* Full-Width Parallax Cinematic Banner (0:31 - 0:35 in reference video) */}
          <Reveal delay={0.25}>
            <div className="relative w-full h-[520px] sm:h-[640px] md:h-[740px] lg:h-[800px] rounded-3xl overflow-hidden border border-[#1F1F1F] mt-24 mb-12 bg-[#0D0D0D] group shadow-2xl">
              <Image
                src="/sunset-lifestyle.jpg"
                alt="Panoramic view across Bengaluru horizon at sunset"
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover brightness-105 contrast-105 transition-all duration-700 group-hover:scale-105"
                style={{ objectPosition: "center 39%" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-10 flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-widest text-zinc-300">
                  BENGALURU, INDIA · 12° 58&apos; 44.7&quot; N
                </span>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Section 04 //STATEMENT (Pinned center text, floating interest cards, SVG draw signature) */}
        <VoiceParallaxSection />

        {/* Section 05 //PROFILE SNAPSHOT (Count-up from 0 via ScrollTrigger) */}
        <section id="stats" className="py-12 border-b border-[#1F1F1F]">
          <SectionHeader
            index="05"
            tag="//PROFILE SNAPSHOT"
            title="PROFILE SNAPSHOT"
          />
          <StatsBar />
        </section>

        {/* Section 06 //PROJECTS & WORK (Left label, fade/slide rows, left-to-right hairline dividers) */}
        <section id="work" className="pb-24 pt-12">
          <SectionHeader
            index="06"
            tag="//PROJECTS & WORK"
            title="PROJECTS & WORK"
            year="2024 - PRESENT"
          />
          <TimelineList
            items={experiences.map((exp) => ({
              primaryTitle: exp.company,
              badge: exp.role,
              dateOrYear: exp.date,
              description: exp.summary,
            }))}
          />
        </section>

        {/* Section 07 //EDUCATION (Hairline timeline: B.E., PU, 10th) */}
        <section id="education" className="pb-24">
          <SectionHeader
            index="07"
            tag="//EDUCATION"
            title="ACADEMIC BACKGROUND"
          />
          <EducationSection />
        </section>

        {/* Section 08 //ACHIEVEMENTS */}
        <section id="awards" className="pb-24">
          <SectionHeader
            index="08"
            tag="//ACHIEVEMENTS"
            title="ACHIEVEMENTS"
          />
          <TimelineList
            items={awards.map((aw) => ({
              primaryTitle: aw.name,
              badge: aw.badge,
              dateOrYear: aw.year,
              description: aw.description,
              certificateUrl: aw.certificateUrl,
              linkUrl: aw.linkUrl,
              linkText: aw.linkText,
            }))}
          />
        </section>

        {/* Section 09 //CORE CAPABILITIES */}
        <section id="skills" className="pb-24">
          <SectionHeader
            index="09"
            tag="//SKILLS"
            title="CORE CAPABILITIES"
          />
          <SkillsGrid />
        </section>
      </div>

      <Footer onOpenContact={() => setIsContactOpen(true)} lenisRef={lenisRef} />
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* Interactive Developer CLI Drawer (Ctrl+K or ~) */}
      <TerminalDrawer
        onOpenContact={() => setIsContactOpen(true)}
        onOpenIcuSimulator={() => setIsIcuSimulatorOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Accessible Lazy-Loaded Smart ICU Monitoring Simulator Dialog */}
      <IcuSimulatorModal
        isOpen={isIcuSimulatorOpen}
        onClose={() => setIsIcuSimulatorOpen(false)}
      />

      {/* Accessible Lazy-Loaded Ask My AI Assistant */}
      <AskMyAI
        isOpen={isChatOpen}
        setIsOpen={setIsChatOpen}
      />
    </main>
  );
}
