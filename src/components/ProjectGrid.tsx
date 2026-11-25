"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { portfolioProjects, Project } from "../data/portfolio";
import {
  X,
  Activity,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
  Code,
  Video,
} from "lucide-react";
import { CardTilt } from "./CardTilt";
import { soundManager } from "./AudioClick";
import dynamic from "next/dynamic";

const PreviewSkeleton: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div className="w-full h-full flex flex-col items-center justify-center gap-2 font-mono text-[10px] text-zinc-500">
    <div
      className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
      style={{ borderColor: `${color}80`, borderTopColor: "transparent" }}
    />
    <span className="uppercase tracking-widest">{label} PREVIEW</span>
  </div>
);

const AdenverPreview = dynamic(
  () => import("./previews/AdenverPreview").then((mod) => mod.AdenverPreview),
  {
    ssr: false,
    loading: () => <PreviewSkeleton color="#00f0ff" label="ADENVER AI" />,
  }
);

const IcuPreview = dynamic(
  () => import("./previews/IcuPreview").then((mod) => mod.IcuPreview),
  {
    ssr: false,
    loading: () => <PreviewSkeleton color="#14b8a6" label="SMART ICU" />,
  }
);

const EtsPreview = dynamic(
  () => import("./previews/EtsPreview").then((mod) => mod.EtsPreview),
  {
    ssr: false,
    loading: () => <PreviewSkeleton color="#f59e0b" label="ETS EXPENSE" />,
  }
);

const Project3DRoomModal = dynamic(
  () => import("./Project3DRoomModal").then((mod) => mod.Project3DRoomModal),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
            LOADING 3D ROOM...
          </span>
        </div>
      </div>
    ),
  }
);

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}



interface ProjectGridProps {
  onOpenIcuSimulator?: () => void;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({
  onOpenIcuSimulator,
}) => {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [is3DRoomOpen, setIs3DRoomOpen] = useState(false);
  const [active3DRoomId, setActive3DRoomId] = useState<string>("adenver-ai");

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const projectModalRef = useRef<HTMLDivElement>(null);
  const lastActiveTriggerRef = useRef<HTMLElement | null>(null);

  // Focus trapping and restoration for project details modal
  useEffect(() => {
    if (activeProject) {
      const timer = setTimeout(() => {
        const focusable = projectModalRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable && focusable.length > 0) {
          focusable[0].focus();
        }
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setActiveProject(null);
          return;
        }
        if (e.key === "Tab") {
          const focusable = projectModalRef.current?.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (!focusable || focusable.length === 0) return;

          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        clearTimeout(timer);
        lastActiveTriggerRef.current?.focus();
      };
    }
  }, [activeProject]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Clean, uniform scroll reveal for all portfolio cards
      cardRefs.current.forEach((card) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0.9, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              end: "top 65%",
              scrub: 0.5,
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleCardClick = (project: Project) => {
    lastActiveTriggerRef.current = document.activeElement as HTMLElement;
    soundManager.playClick(1050);
    setActiveProject(project);
  };

  const handleOpen3DRoom = (projectId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundManager.playSnap();
    setActive3DRoomId(projectId);
    setActiveProject(null);
    setIs3DRoomOpen(true);
  };

  const projectSequenceMeta = [
    {
      seq: "01",
      domain: "LOCAL AI & NEURAL VAULT",
      accent: "#00f0ff",
      accentBorder: "border-cyan-500/50",
      accentText: "text-cyan-300",
      accentBg: "bg-cyan-950/80 hover:bg-[#00f0ff]",
      accentGlow: "hover:shadow-[0_0_25px_rgba(0,240,255,0.45)]",
    },
    {
      seq: "02",
      domain: "HEALTHCARE IOT & SEPSIS ML",
      accent: "#14b8a6",
      accentBorder: "border-teal-500/50",
      accentText: "text-teal-300",
      accentBg: "bg-teal-950/80 hover:bg-[#14b8a6]",
      accentGlow: "hover:shadow-[0_0_25px_rgba(20,184,166,0.45)]",
    },
    {
      seq: "03",
      domain: "AGRIBUSINESS ERP & LEDGER",
      accent: "#f59e0b",
      accentBorder: "border-amber-500/50",
      accentText: "text-amber-300",
      accentBg: "bg-amber-950/80 hover:bg-[#f59e0b]",
      accentGlow: "hover:shadow-[0_0_25px_rgba(245,158,11,0.45)]",
    },
  ];

  return (
    <>
      <div
        ref={containerRef}
        className="flex flex-col gap-20 md:gap-28 select-none pt-8"
      >
        {portfolioProjects.map((project, idx) => {
          const meta = projectSequenceMeta[idx] || projectSequenceMeta[0];

          return (
            <div
              key={project.id}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              data-cursor="ENTER"
              className="w-full max-w-5xl mx-auto project-card group flex flex-col will-change-transform"
            >
              {/* 3D Tilt Container with Specular Glare */}
              <CardTilt maxAngle={5} className="w-full">
                <div
                  onClick={() => handleOpen3DRoom(project.id)}
                  className="w-full aspect-[16/10] rounded-2xl overflow-hidden border border-[#1F1F1F] bg-[#0E0E0E] relative flex items-center justify-center transition-colors duration-500 group-hover:border-zinc-500 shadow-2xl cursor-pointer"
                >
                  {/* Subtle Background Radial Depth */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-black pointer-events-none" />

                  {/* Top-Left: Curated Sequence Badge */}
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/85 border border-zinc-800 backdrop-blur-md shadow-xl">
                    <span className="font-mono text-xs font-black tracking-widest text-white">
                      {meta.seq} <span className="text-zinc-500">/ 03</span>
                    </span>
                    <span className="w-1 h-1 rounded-full bg-zinc-600" />
                    <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 font-semibold hidden xs:inline">
                      {meta.domain}
                    </span>
                  </div>

                  {/* Visual Mockup Container (scales 1.05 on hover) */}
                  <div className="w-[88%] h-[82%] rounded-xl bg-black/95 border border-[#222222] p-3 sm:p-4 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-transform duration-500 ease-out group-hover:scale-105">
                    {project.id === "adenver-ai" && <AdenverPreview />}
                    {project.id === "icu-monitoring" && <IcuPreview />}
                    {project.id === "ets-expense" && <EtsPreview />}
                  </div>
                </div>
              </CardTilt>

              {/* Title, Category Label & Simplified Action Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-5 pb-2 gap-4">
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-zinc-400">
                      {meta.seq} //
                    </span>
                    <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                      {project.category}
                    </span>
                    {project.statusBadge && (
                      <span className="font-mono text-[9px] uppercase tracking-wider text-amber-400 bg-amber-950/40 border border-amber-900/60 px-2.5 py-0.5 rounded-full">
                        {project.statusBadge}
                      </span>
                    )}
                  </div>

                  <h3
                    onClick={() => handleCardClick(project)}
                    className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white uppercase tracking-tight hover:text-zinc-200 transition-colors cursor-pointer"
                  >
                    {project.title}
                  </h3>

                  {/* Simplified Action Area: Primary "ENTER 3D ROOM", Secondary "DETAILS", & small text links */}
                  <div className="flex flex-col gap-2.5 mt-3 pt-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      {/* Primary Button: Enter 3D Room */}
                      <button
                        onClick={(e) => handleOpen3DRoom(project.id, e)}
                        aria-label={`Enter 3D Room for ${project.title}`}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-mono text-[11px] uppercase font-bold tracking-wider transition-all duration-200 cursor-pointer shadow-lg border hover:scale-105 active:scale-95 ${meta.accentBg} ${meta.accentText} hover:text-black ${meta.accentBorder} ${meta.accentGlow}`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>ENTER 3D ROOM</span>
                      </button>

                      {/* Secondary Button: Details */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(project);
                        }}
                        aria-label={`View details for ${project.title}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-mono text-[11px] uppercase font-semibold tracking-wider transition-colors cursor-pointer"
                      >
                        <span>DETAILS</span>
                      </button>
                    </div>

                    {/* Small text-link row for Code / Demo / Video (rendered only when that link exists) */}
                    {(project.repoUrl || project.demoUrl || project.videoUrl) && (
                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400 pt-0.5">
                        {project.repoUrl && (
                          <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-zinc-400 hover:text-emerald-400 transition-colors"
                          >
                            <Code className="w-3 h-3 text-emerald-400/80" />
                            <span>Code ↗</span>
                          </a>
                        )}
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-zinc-400 hover:text-cyan-400 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3 text-cyan-400/80" />
                            <span>Demo ↗</span>
                          </a>
                        )}
                        {project.videoUrl && (
                          <a
                            href={project.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-zinc-400 hover:text-amber-400 transition-colors"
                          >
                            <Video className="w-3 h-3 text-amber-400/80" />
                            <span>Video ↗</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Corner Arrow moves diagonally on card hover (x: 4, y: -4) */}
                <div
                  onClick={() => handleCardClick(project)}
                  className="w-10 h-10 rounded-full border border-zinc-800 bg-[#121212] flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-white transition-colors duration-300 shadow-md shrink-0 cursor-pointer"
                >
                  <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Details Modal Drawer */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
          <div
            ref={projectModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            className="relative w-full max-w-2xl bg-[#0D0D0D] border border-[#262626] rounded-2xl p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setActiveProject(null)}
              aria-label="Close project modal"
              className="absolute top-5 right-5 p-2 rounded-full border border-[#262626] bg-[#141414] text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 mb-2 block font-semibold">
              // PROJECT DETAILS
            </span>
            {activeProject.statusBadge && (
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-amber-950/50 border border-amber-800/60 text-amber-300 font-mono text-[10px] uppercase tracking-wider font-semibold">
                <span>⚠</span>
                <span>{activeProject.statusBadge}</span>
              </div>
            )}
            <h3 id="project-modal-title" className="font-display font-black text-3xl md:text-4xl text-white uppercase tracking-tight mb-2">
              {activeProject.title}
            </h3>
            <p className="font-mono text-xs uppercase italic text-zinc-400 mb-6">
              {activeProject.category}
            </p>

            {activeProject.videoUrl && (
              <div className="mb-6 overflow-hidden rounded-xl border border-[#262626] bg-black shadow-xl">
                <video
                  className="block aspect-video w-full"
                  controls
                  playsInline
                  preload="none"
                  poster={activeProject.posterUrl}
                  aria-label={`${activeProject.title} demo video`}
                >
                  <source src={activeProject.videoUrl} type="video/mp4" />
                  Your browser does not support the video element.
                </video>
              </div>
            )}

            <p className="text-zinc-300 text-sm md:text-base leading-relaxed mb-6">
              {activeProject.description}
            </p>

            {activeProject.highlights && (
              <div className="mb-6 space-y-2">
                <span className="font-mono text-xs uppercase tracking-wider text-zinc-400 block font-semibold">
                  KEY ARCHITECTURAL HIGHLIGHTS:
                </span>
                {activeProject.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs md:text-sm text-zinc-300">
                    <span className="text-emerald-400 font-bold mt-0.5">▸</span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="mb-6">
              <span className="font-mono text-xs uppercase tracking-wider text-zinc-400 block mb-3 font-semibold">
                TECHNOLOGY STACK:
              </span>
              <div className="flex flex-wrap gap-2">
                {activeProject.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-[#1A1A1A] text-neutral-300 border border-[#2E2E2E] rounded-md font-mono text-xs uppercase tracking-wider"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Interactive Simulator Callout (for Smart ICU) */}
            {activeProject.id === "icu-monitoring" && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="font-mono text-xs uppercase tracking-wider text-emerald-300 font-bold flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    INTERACTIVE ICU SIMULATOR
                  </span>
                  <span className="font-mono text-[11px] text-zinc-400 mt-0.5">
                    Test live telemetry waveforms, fictional patient vitals &amp; rule-based sepsis early-warning alerts.
                  </span>
                </div>
                <button
                  onClick={() => {
                    soundManager.playClick(1100);
                    onOpenIcuSimulator?.();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold tracking-wider transition-all duration-200 cursor-pointer shadow-lg hover:scale-105 active:scale-95 shrink-0"
                >
                  <Activity className="w-3.5 h-3.5 text-black" />
                  <span>TRY THE SIMULATOR</span>
                </button>
              </div>
            )}

            {/* Project Links & Proof (Code, Demo, Video) */}
            {(activeProject.repoUrl || activeProject.demoUrl || activeProject.videoUrl) && (
              <div className="mb-8">
                <span className="font-mono text-xs uppercase tracking-wider text-zinc-400 block mb-3 font-semibold">
                  PROJECT LINKS:
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  {activeProject.repoUrl && (
                    <a
                      href={activeProject.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 text-zinc-200 hover:text-white font-mono text-xs font-semibold tracking-wider transition-colors"
                    >
                      <Code className="w-4 h-4 text-emerald-400" />
                      <span>VIEW CODE</span>
                    </a>
                  )}
                  {activeProject.demoUrl && (
                    <a
                      href={activeProject.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 text-zinc-200 hover:text-white font-mono text-xs font-semibold tracking-wider transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-cyan-400" />
                      <span>LIVE DEMO</span>
                    </a>
                  )}
                  {activeProject.videoUrl && (
                    <a
                      href={activeProject.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 text-zinc-200 hover:text-white font-mono text-xs font-semibold tracking-wider transition-colors"
                    >
                      <Video className="w-4 h-4 text-amber-400" />
                      <span>WATCH DEMO</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Launch 3D Room Button inside Modal */}
            <div className="pt-4 border-t border-[#1F1F1F] flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={() => handleOpen3DRoom(activeProject.id)}
                style={{
                  backgroundColor:
                    activeProject.id === "adenver-ai"
                      ? "#00f0ff"
                      : activeProject.id === "icu-monitoring"
                      ? "#14b8a6"
                      : "#f59e0b",
                  boxShadow:
                    activeProject.id === "adenver-ai"
                      ? "0 0 25px rgba(0,240,255,0.4)"
                      : activeProject.id === "icu-monitoring"
                      ? "0 0 25px rgba(20,184,166,0.4)"
                      : "0 0 25px rgba(245,158,11,0.4)",
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-full text-black font-display font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-black" />
                <span>ENTER 3D ROOM</span>
              </button>

              <button
                onClick={() => setActiveProject(null)}
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-zinc-700 hover:border-zinc-400 text-zinc-300 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3D Animated Room Modal */}
      <Project3DRoomModal
        isOpen={is3DRoomOpen}
        onClose={() => setIs3DRoomOpen(false)}
        initialProjectId={active3DRoomId}
      />
    </>
  );
};
