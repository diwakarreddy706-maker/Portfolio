"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, ArrowUpRight, Copy, Check, Download } from "lucide-react";
import { personalInfo } from "../data/portfolio";
import { soundManager } from "./AudioClick";
import { useToast } from "./CopyToast";
import { Magnetic } from "./Magnetic";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Trap focus & restore focus on close
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;

      const timer = setTimeout(() => {
        const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable && focusable.length > 0) {
          focusable[0].focus();
        }
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
          return;
        }
        if (e.key === "Tab") {
          const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
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
        previousActiveElement.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    soundManager.playSnap();
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    showToast(`COPIED TO CLIPBOARD: ${personalInfo.email}`);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleClose = () => {
    soundManager.playClick(900);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-[#0D0D0D] border border-[#222222] rounded-3xl p-8 z-10 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#1F1F1F]">
              <span className="font-mono text-xs uppercase italic tracking-widest text-zinc-400">
                //GET IN TOUCH
              </span>
              <Magnetic strength={0.3}>
                <button
                  onClick={handleClose}
                  aria-label="Close modal"
                  className="w-8 h-8 rounded-full border border-[#222222] flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </Magnetic>
            </div>

            <h3 id="contact-modal-title" className="font-display font-black text-3xl text-white mb-2 tracking-tight uppercase">
              LET&apos;S WORK TOGETHER
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Available for software engineering internships, technical collaborations, and full-stack software development projects.
            </p>

            <div className="flex flex-col gap-3">
              {/* Email Card with Copy Action */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#141414] border border-[#222222] hover:border-zinc-600 transition-all group">
                <a
                  href={`mailto:${personalInfo.email}`}
                  onClick={() => soundManager.playClick(1100)}
                  className="flex items-center gap-4 min-w-0 flex-1"
                >
                  <div className="w-10 h-10 rounded-xl bg-black border border-[#222222] flex items-center justify-center text-white group-hover:scale-105 transition-transform shrink-0">
                    <Mail className="w-5 h-5 text-sky-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono text-[10px] uppercase italic tracking-wider text-zinc-400">
                      DIRECT EMAIL
                    </div>
                    <div className="font-mono text-sm text-white font-medium truncate">
                      {personalInfo.email}
                    </div>
                  </div>
                </a>

                <button
                  onClick={handleCopyEmail}
                  title="Copy email to clipboard"
                  className="p-2 rounded-lg bg-black/60 border border-[#262626] hover:border-zinc-500 text-zinc-400 hover:text-white transition-all shrink-0 ml-2 cursor-pointer"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Direct Resume Download Card */}
              <a
                href="/Diwakar_Reddy_Resume.pdf"
                download="Diwakar_Reddy_Resume.pdf"
                onClick={() => soundManager.playClick(1000)}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#141414] to-[#141414] border border-emerald-900/50 hover:border-emerald-500/60 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-black border border-emerald-800/80 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-mono text-[9px] uppercase italic tracking-wider text-emerald-400">
                      OFFICIAL CV
                    </div>
                    <div className="font-display font-bold text-xs text-white">
                      DOWNLOAD RESUME (PDF)
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-emerald-400 group-hover:text-white transition-colors shrink-0" />
              </a>

              {/* Professional Profiles: LinkedIn, GitHub, Instagram */}
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundManager.playClick(900)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#141414] border border-[#222222] hover:border-zinc-500 transition-all group"
                >
                  <div className="min-w-0">
                    <div className="font-mono text-[8.5px] uppercase italic tracking-wider text-zinc-400">
                      PROFILE
                    </div>
                    <div className="font-display font-bold text-[11px] text-white truncate">
                      LINKEDIN
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors shrink-0 ml-1" />
                </a>

                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundManager.playClick(900)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#141414] border border-[#222222] hover:border-zinc-500 transition-all group"
                >
                  <div className="min-w-0">
                    <div className="font-mono text-[8.5px] uppercase italic tracking-wider text-zinc-400">
                      CODE
                    </div>
                    <div className="font-display font-bold text-[11px] text-white truncate">
                      GITHUB
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors shrink-0 ml-1" />
                </a>

                <a
                  href={personalInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundManager.playClick(900)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#141414] border border-[#222222] hover:border-zinc-500 transition-all group"
                >
                  <div className="min-w-0">
                    <div className="font-mono text-[8.5px] uppercase italic tracking-wider text-zinc-400">
                      SOCIAL
                    </div>
                    <div className="font-display font-bold text-[11px] text-white truncate">
                      INSTAGRAM
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors shrink-0 ml-1" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
