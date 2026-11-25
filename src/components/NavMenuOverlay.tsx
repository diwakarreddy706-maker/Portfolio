"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";
import { personalInfo } from "../data/portfolio";
import { soundManager } from "./AudioClick";
import { Magnetic } from "./Magnetic";

interface NavMenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenContact: () => void;
  lenisRef?: any;
}

export const NavMenuOverlay: React.FC<NavMenuOverlayProps> = ({
  isOpen,
  onClose,
  onOpenContact,
  lenisRef,
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Lock body scroll & trap focus while overlay is open
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const timer = setTimeout(() => {
        const focusable = overlayRef.current?.querySelectorAll<HTMLElement>(
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
          const focusable = overlayRef.current?.querySelectorAll<HTMLElement>(
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
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
        clearTimeout(timer);
        previousActiveElement.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  const handleClose = () => {
    soundManager.playClick(900);
    onClose();
  };

  const handleNavigate = (target: "home" | "work" | "education" | "contact") => {
    soundManager.playClick(1100);
    onClose();

    if (target === "contact") {
      setTimeout(() => {
        onOpenContact();
      }, 350);
      return;
    }

    setTimeout(() => {
      if (target === "home") {
        if (lenisRef && lenisRef.current) {
          lenisRef.current.scrollTo(0, { duration: 1.2 });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else if (target === "work") {
        const el = document.getElementById("portfolio");
        if (el) {
          if (lenisRef && lenisRef.current) {
            lenisRef.current.scrollTo(el, { duration: 1.2, offset: -80 });
          } else {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }
      } else if (target === "education") {
        const el = document.getElementById("education");
        if (el) {
          if (lenisRef && lenisRef.current) {
            lenisRef.current.scrollTo(el, { duration: 1.2, offset: -80 });
          } else {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }
      }
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 bg-[#0a0a0a] bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:16px_16px] flex flex-col justify-between px-6 py-6 md:px-12 md:py-8 text-white select-none overflow-y-auto overflow-x-hidden"
        >
          {/* Subtle Swiss Grid Hairline Columns matching reference */}
          <div className="absolute inset-0 pointer-events-none grid grid-cols-2 md:grid-cols-4 divide-x divide-[#161616] opacity-70" />

          {/* Top Bar matching reference */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="relative z-10 flex items-center justify-between w-full shrink-0"
          >
            {/* Top-Left: Location Coordinates */}
            <div className="font-mono text-xs md:text-sm tracking-wider text-zinc-300">
              <span className="text-zinc-400 uppercase italic">LOCAL/ </span>
              <span>12° 58&apos; 44.7&quot; N</span>
            </div>

            {/* Top-Center: Circular Close [X] Button with Magnetic Pull */}
            <Magnetic strength={0.4}>
              <button
                onClick={handleClose}
                aria-label="Close navigation overlay"
                className="w-10 h-10 rounded-full bg-[#141414] border border-[#2a2a2a] hover:border-zinc-400 flex items-center justify-center text-zinc-400 hover:text-white hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer shadow-lg"
                title="Close Menu"
              >
                <X className="w-4 h-4" />
              </button>
            </Magnetic>

            {/* Top-Right: CONTACT NOW Pill Button */}
            <Magnetic strength={0.3}>
              <button
                onClick={() => handleNavigate("contact")}
                className="px-5 py-2 text-xs md:text-sm font-mono tracking-widest text-white border border-white rounded-full hover:bg-white hover:text-black transition-colors duration-300 cursor-pointer"
              >
                CONTACT NOW
              </button>
            </Magnetic>
          </motion.div>

          {/* Center: Responsive HOME / WORK / EDUCATION / CONTACT Stack */}
          <div
            className="relative z-10 my-auto flex flex-col items-center justify-center text-center gap-0.5 sm:gap-1 md:gap-2 py-4 md:py-6 shrink-0"
            onMouseLeave={() => setHoveredItem(null)}
          >
            {/* HOME */}
            <div className="overflow-hidden py-0.5 sm:py-1">
              <motion.button
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => handleNavigate("home")}
                onMouseEnter={() => {
                  soundManager.playSnap();
                  setHoveredItem("home");
                }}
                className={`block font-display font-black text-5xl sm:text-7xl md:text-8xl lg:text-[7.5vh] xl:text-[9vh] leading-[0.9] tracking-tighter uppercase transition-colors duration-300 cursor-pointer will-change-transform ${
                  hoveredItem === "home"
                    ? "text-white"
                    : hoveredItem === null
                    ? "text-zinc-500 hover:text-white"
                    : "text-zinc-700"
                }`}
              >
                HOME
              </motion.button>
            </div>

            {/* WORK */}
            <div className="overflow-hidden py-0.5 sm:py-1">
              <motion.button
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => handleNavigate("work")}
                onMouseEnter={() => {
                  soundManager.playSnap();
                  setHoveredItem("work");
                }}
                className={`block font-display font-black text-5xl sm:text-7xl md:text-8xl lg:text-[7.5vh] xl:text-[9vh] leading-[0.9] tracking-tighter uppercase transition-colors duration-300 cursor-pointer will-change-transform ${
                  hoveredItem === "work"
                    ? "text-white"
                    : hoveredItem === null
                    ? "text-white"
                    : "text-zinc-700"
                }`}
              >
                WORK
              </motion.button>
            </div>

            {/* EDUCATION */}
            <div className="overflow-hidden py-0.5 sm:py-1">
              <motion.button
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => handleNavigate("education")}
                onMouseEnter={() => {
                  soundManager.playSnap();
                  setHoveredItem("education");
                }}
                className={`block font-display font-black text-5xl sm:text-7xl md:text-8xl lg:text-[7.5vh] xl:text-[9vh] leading-[0.9] tracking-tighter uppercase transition-colors duration-300 cursor-pointer will-change-transform ${
                  hoveredItem === "education"
                    ? "text-white"
                    : hoveredItem === null
                    ? "text-zinc-500 hover:text-white"
                    : "text-zinc-700"
                }`}
              >
                EDUCATION
              </motion.button>
            </div>

            {/* CONTACT */}
            <div className="overflow-hidden py-0.5 sm:py-1">
              <motion.button
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => handleNavigate("contact")}
                onMouseEnter={() => {
                  soundManager.playSnap();
                  setHoveredItem("contact");
                }}
                className={`block font-display font-black text-5xl sm:text-7xl md:text-8xl lg:text-[7.5vh] xl:text-[9vh] leading-[0.9] tracking-tighter uppercase transition-colors duration-300 cursor-pointer will-change-transform ${
                  hoveredItem === "contact"
                    ? "text-white"
                    : hoveredItem === null
                    ? "text-white"
                    : "text-zinc-700"
                }`}
              >
                CONTACT
              </motion.button>
            </div>
          </div>

          {/* Bottom Bar matching reference */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3 }}
            className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 w-full font-mono text-xs uppercase tracking-wider text-zinc-400 pb-2 border-t border-[#1a1a1a] pt-4 shrink-0 mt-4"
          >
            {/* Copyright */}
            <div className="text-zinc-400 font-mono text-xs tracking-wider">
              ©2026 ALL RIGHTS RESERVED
            </div>

            {/* Social Links matching reference: INSTAGRAM ↗ | LINKEDIN ↗ | GITHUB ↗ */}
            <div className="flex items-center gap-6 sm:gap-8 font-mono text-xs uppercase font-semibold text-white tracking-wider">
              <Magnetic strength={0.3}>
                <a
                  href={personalInfo.instagram || "https://www.instagram.com/_diwakar__12?mdxt=b2gyeGdpcWcyN3Bx&utm_source=qr"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundManager.playClick(850)}
                  className="hover:text-zinc-400 transition-colors flex items-center gap-1 group px-2 py-1"
                >
                  <span>INSTAGRAM</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </Magnetic>

              <Magnetic strength={0.3}>
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundManager.playClick(850)}
                  className="hover:text-zinc-400 transition-colors flex items-center gap-1 group px-2 py-1"
                >
                  <span>LINKEDIN</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </Magnetic>

              <Magnetic strength={0.3}>
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundManager.playClick(850)}
                  className="hover:text-zinc-400 transition-colors flex items-center gap-1 group px-2 py-1"
                >
                  <span>GITHUB</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </Magnetic>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
