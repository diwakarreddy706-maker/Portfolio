"use client";

import React, { useState } from "react";
import { ArrowUp, ArrowUpRight, Copy, Check } from "lucide-react";
import { personalInfo, socialLinks } from "../data/portfolio";
import { Reveal } from "./Reveal";
import { Magnetic } from "./Magnetic";
import { TextScramble } from "./TextScramble";
import { soundManager } from "./AudioClick";
import { useToast } from "./CopyToast";

interface FooterProps {
  onOpenContact: () => void;
  lenisRef?: any;
}

export const Footer: React.FC<FooterProps> = ({ onOpenContact, lenisRef }) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const scrollToTop = () => {
    soundManager.playClick(1400);
    if (lenisRef && lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCopyEmail = () => {
    soundManager.playSnap();
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    showToast(`COPIED TO CLIPBOARD: ${personalInfo.email}`);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <footer className="border-t border-[#1F1F1F] bg-[#000000] pt-24 pb-12 select-none">
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
        {/* Giant CTA Header */}
        <Reveal>
          <span className="font-mono text-xs uppercase italic tracking-widest text-zinc-400 mb-4 block">
            //GET IN TOUCH
          </span>
          <h2 className="font-display font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-white uppercase leading-[0.9] mb-8">
            LET&apos;S WORK<br />TOGETHER
          </h2>

          <p className="text-zinc-400 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Open to software engineering roles, technical internships, and building high-performance digital systems.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
            {/* Contact Modal Trigger */}
            <Magnetic strength={0.3}>
              <button
                onClick={() => {
                  soundManager.playClick(1200);
                  onOpenContact();
                }}
                className="px-8 py-3.5 bg-transparent text-white border border-white font-display font-bold text-xs tracking-widest uppercase rounded-full hover:bg-white hover:text-black transition-colors duration-300 shadow-xl cursor-pointer"
              >
                <TextScramble text="CONTACT NOW" />
              </button>
            </Magnetic>

            {/* One-Click Direct Email Copy */}
            <Magnetic strength={0.3}>
              <button
                onClick={handleCopyEmail}
                className="px-6 py-3.5 bg-[#0D0D0D] text-zinc-300 border border-[#2A2A2A] hover:border-zinc-500 font-mono text-xs uppercase tracking-wider rounded-full flex items-center gap-2 hover:text-white transition-all duration-300 cursor-pointer shadow-lg"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">EMAIL COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>COPY EMAIL</span>
                  </>
                )}
              </button>
            </Magnetic>
          </div>
        </Reveal>

        {/* Social Links Row with Magnetic Physics */}
        <div className="flex justify-center items-center gap-6 sm:gap-8 py-8 border-t border-b border-[#1F1F1F] font-mono text-xs uppercase italic tracking-widest flex-wrap">
          {socialLinks.map((link, idx) => (
            <Magnetic key={idx} strength={0.25}>
              <a
                href={link.url}
                target={link.url.startsWith("http") ? "_blank" : undefined}
                rel={link.url.startsWith("http") ? "noopener noreferrer" : undefined}
                onClick={() => soundManager.playClick(850)}
                className="text-zinc-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-1"
              >
                <span>{link.name}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </Magnetic>
          ))}
        </div>

        {/* Oversized Wordmark & Bottom Bar */}
        <div className="py-16 text-center select-none overflow-hidden">
          <span className="font-display font-black text-[14vw] leading-none text-zinc-900 uppercase tracking-tighter block hover:text-zinc-800 transition-colors duration-500">
            {personalInfo.name}
          </span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono uppercase italic text-zinc-400 pt-8 border-t border-[#1F1F1F]">
          <div>© 2026 {personalInfo.fullName.toUpperCase()}. ALL RIGHTS RESERVED.</div>
          <Magnetic strength={0.3}>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer px-2 py-1"
            >
              <span>BACK TO TOP</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </Magnetic>
        </div>
      </div>
    </footer>
  );
};
