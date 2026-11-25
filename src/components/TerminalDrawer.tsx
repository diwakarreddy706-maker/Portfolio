"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, X, CornerDownLeft, Sparkles } from "lucide-react";
import { personalInfo, portfolioProjects, skills, education, awards } from "../data/portfolio";
import { soundManager } from "./AudioClick";

interface TerminalDrawerProps {
  onOpenContact: () => void;
  onOpenIcuSimulator?: () => void;
  onOpenChat?: () => void;
}

interface HistoryItem {
  command: string;
  output: React.ReactNode;
}

export const TerminalDrawer: React.FC<TerminalDrawerProps> = ({
  onOpenContact,
  onOpenIcuSimulator,
  onOpenChat,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      command: "welcome",
      output: (
        <div className="text-zinc-400 space-y-1">
          <p className="text-emerald-400 font-bold">
            Diwakar Reddy // Interactive CLI v2.4 (Bengaluru, IN)
          </p>
          <p>Type <span className="text-white font-bold">&apos;help&apos;</span> to inspect available commands, or <span className="text-white font-bold">&apos;resume&apos;</span> to download CV.</p>
        </div>
      ),
    },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut listener: Ctrl+K or `~`
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key === "k") || e.key === "`") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        soundManager.playClick(1100);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [isOpen, history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim().toLowerCase();
    if (!cmd) return;

    soundManager.playClick(900);
    setInputVal("");

    if (cmd === "clear") {
      setHistory([]);
      return;
    }

    let output: React.ReactNode = null;

    switch (cmd) {
      case "help":
        output = (
          <div className="space-y-1 text-zinc-300">
            <p className="text-white font-bold mb-1">AVAILABLE PROTOCOLS:</p>
            <p><span className="text-emerald-400 font-bold">about</span> - Background &amp; RRCE Degree credentials</p>
            <p><span className="text-emerald-400 font-bold">ask</span> - Open AI chat assistant grounded in portfolio data</p>
            <p><span className="text-emerald-400 font-bold">skills</span> - Engineering stacks &amp; tech capabilities</p>
            <p><span className="text-emerald-400 font-bold">education</span> - Academic background &amp; degree credentials</p>
            <p><span className="text-emerald-400 font-bold">icu</span> - Launch interactive Smart ICU Monitoring simulator</p>
            <p><span className="text-emerald-400 font-bold">projects</span> - Production repos &amp; architectural builds</p>
            <p><span className="text-emerald-400 font-bold">awards</span> - Research publications, certifications &amp; symposiums</p>
            <p><span className="text-emerald-400 font-bold">resume</span> - Download official Diwakar Reddy CV</p>
            <p><span className="text-emerald-400 font-bold">contact</span> - Open direct contact modal</p>
            <p><span className="text-emerald-400 font-bold">sudo hire</span> - Trigger recruitment sequence</p>
            <p><span className="text-emerald-400 font-bold">clear</span> - Clear terminal session</p>
          </div>
        );
        break;

      case "about":
        output = (
          <div className="text-zinc-300 space-y-1">
            <p className="text-white font-semibold">DIWAKAR REDDY</p>
            <p>Degree: B.E. Computer Science &amp; Design (RRCE Bengaluru)</p>
            <p>CGPA: 7.00 // Location: Bengaluru, Karnataka, India</p>
            <p>Focus: Full-Stack Web Systems, Java Architecture, AI Integration</p>
          </div>
        );
        break;

      case "education":
        output = (
          <div className="space-y-3 text-zinc-300">
            <p className="text-white font-bold text-xs uppercase tracking-wider">ACADEMIC BACKGROUND &amp; QUALIFICATIONS:</p>
            {education.map((edu, idx) => (
              <div key={idx} className="border-l-2 border-emerald-500/80 pl-3 py-1 bg-black/40 rounded-r">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span className="text-emerald-400 font-bold text-xs">[{edu.level}] {edu.qualification}</span>
                  <span className="font-mono text-[10px] text-zinc-400">{edu.years}</span>
                </div>
                <p className="text-zinc-200 text-xs font-medium">{edu.institution}</p>
                {edu.board && <p className="text-[10px] text-zinc-400 font-mono">Board: {edu.board}</p>}
                <p className="text-[10px] text-zinc-400 font-mono">Location: {edu.location}</p>
                {edu.subjects && (
                  <p className="text-[10px] text-zinc-400 font-mono">Subjects: {edu.subjects.join(", ")}</p>
                )}
                <p className="text-[11px] text-emerald-300 font-mono font-semibold pt-0.5">Result: {edu.result}</p>
              </div>
            ))}
          </div>
        );
        break;

      case "icu":
      case "icu simulator":
      case "simulator":
        output = (
          <p className="text-emerald-400 font-semibold">
            ✓ Initializing Smart ICU Monitoring interactive simulator...
          </p>
        );
        setTimeout(() => {
          if (onOpenIcuSimulator) onOpenIcuSimulator();
        }, 300);
        break;

      case "ask":
      case "chat":
      case "ai":
        output = (
          <p className="text-emerald-400 font-semibold">
            ✓ Opening Ask My AI interactive assistant drawer...
          </p>
        );
        setTimeout(() => {
          if (onOpenChat) onOpenChat();
        }, 300);
        break;

      case "skills":
        output = (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-300">
            {skills.map((s, idx) => (
              <div key={idx} className="border border-zinc-800 p-2 rounded bg-black/40">
                <p className="text-emerald-400 font-bold text-[10px]">{s.name}</p>
                <p className="text-[10px] text-zinc-400">{s.category} · <span className="text-emerald-400 font-mono">[{s.tier}]</span></p>
                <p className="text-[9px] text-zinc-400 truncate">Applied in: {s.usedIn}</p>
              </div>
            ))}
          </div>
        );
        break;

      case "projects":
        output = (
          <div className="space-y-2 text-zinc-300">
            {portfolioProjects.map((p) => (
              <div key={p.id} className="border-b border-zinc-900 pb-1">
                <p className="text-white font-bold">{p.title} <span className="text-emerald-400 text-[10px]">[{p.category}]</span></p>
                <p className="text-xs text-zinc-400">{p.description}</p>
              </div>
            ))}
          </div>
        );
        break;

      case "awards":
      case "publications":
      case "publication":
        output = (
          <div className="space-y-2 text-zinc-300">
            <p className="text-white font-bold text-xs uppercase tracking-wider">AWARDS, PUBLICATIONS &amp; CERTIFICATIONS:</p>
            {awards.map((aw, idx) => (
              <div key={idx} className="border-l-2 border-emerald-500/80 pl-3 py-1 bg-black/40 rounded-r">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span className="text-emerald-400 font-bold text-xs">{aw.name}</span>
                  <span className="font-mono text-[10px] text-zinc-400">{aw.year}</span>
                </div>
                <p className="text-[11px] text-zinc-300 leading-snug">{aw.description}</p>
              </div>
            ))}
          </div>
        );
        break;

      case "resume":
        output = (
          <p className="text-emerald-400 font-bold">
            ✓ Triggering download of Diwakar_Reddy_Resume.pdf...
          </p>
        );
        const link = document.createElement("a");
        link.href = "/Diwakar_Reddy_Resume.pdf";
        link.download = "Diwakar_Reddy_Resume.pdf";
        link.click();
        break;

      case "contact":
        output = <p className="text-sky-400">Opening contact modal...</p>;
        setTimeout(() => onOpenContact(), 300);
        break;

      case "sudo hire":
      case "hire":
        output = (
          <div className="text-emerald-400 font-bold space-y-1">
            <p>🚀 ACCESS GRANTED. STATUS: READY TO CONTRIBUTE.</p>
            <p className="text-zinc-300 text-xs">Let&apos;s build impactful software together. Email: diwakarreddy...@gmail.com</p>
          </div>
        );
        break;

      default:
        output = (
          <p className="text-rose-400">
            command not found: {cmd}. Type &apos;help&apos; for available protocols.
          </p>
        );
    }

    setHistory((prev) => [...prev, { command: cmd, output }]);
  };

  return (
    <>
      {/* Floating HUD Trigger docked at bottom-left (separated from Ask My AI on bottom-right) */}
      <button
        onClick={() => {
          setIsOpen(true);
          soundManager.playClick(1200);
        }}
        className="fixed bottom-6 left-6 z-40 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#0D0D0D]/90 border border-[#262626] hover:border-zinc-500 text-zinc-300 hover:text-white font-mono text-xs tracking-wider shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 group cursor-pointer"
        title="Open Developer Terminal (Ctrl + K or ~)"
      >
        <Terminal className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
        <span className="text-[11px] font-semibold">DEV_CLI</span>
        <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[9px] border border-zinc-700">~</kbd>
      </button>

      {/* Slide-Up Terminal Drawer Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl bg-[#0A0A0A] border border-[#222222] rounded-2xl shadow-2xl overflow-hidden flex flex-col font-mono text-xs text-white h-[440px]"
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#111111] border-b border-[#222222]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-zinc-400 text-[11px] font-semibold tracking-wider">
                    bash - diwakar@bengaluru-terminal
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Terminal Content */}
              <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3 select-text">
                {history.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <span className="text-emerald-400 font-bold">&gt;</span>
                      <span className="text-white font-semibold">{item.command}</span>
                    </div>
                    <div className="pl-4">{item.output}</div>
                  </div>
                ))}
              </div>

              {/* Command Input Form */}
              <form onSubmit={handleCommand} className="flex items-center gap-2 px-4 py-3 bg-[#0D0D0D] border-t border-[#222222]">
                <span className="text-emerald-400 font-bold">&gt;</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="type 'help', 'skills', 'projects', 'resume'..."
                  className="flex-1 bg-transparent text-white focus:outline-none font-mono text-xs placeholder:text-zinc-600"
                />
                <button type="submit" aria-label="Execute command" className="text-zinc-400 hover:text-white">
                  <CornerDownLeft className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
