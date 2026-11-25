"use client";

import React, { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { soundManager } from "./AudioClick";
import { Magnetic } from "./Magnetic";
import { TextScramble } from "./TextScramble";

interface NavbarProps {
  onOpenContact: () => void;
  onToggleMenu?: () => void;
  isMenuOpen?: boolean;
  lenisRef?: any;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenContact,
  onToggleMenu,
  isMenuOpen = false,
  lenisRef,
}) => {
  const [time, setTime] = useState<string>("--:--:--");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString("en-US", {
        timeZone: "Asia/Kolkata",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    soundManager.enabled = nextState;
    if (nextState) soundManager.playClick(1200);
  };

  const handleMenuClick = () => {
    soundManager.playClick(1000);
    if (onToggleMenu) onToggleMenu();
  };

  const handleContactClick = () => {
    soundManager.playClick(1300);
    onOpenContact();
  };

  return (
    <header className="sticky top-0 z-40 relative flex items-center justify-between px-6 py-4 md:px-12 bg-black/85 backdrop-blur-md border-b border-[#1F1F1F] select-none">
      {/* Live Bengaluru Time + Sound Toggle */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 font-mono text-xs md:text-sm tracking-wider text-white">
          <span className="text-zinc-400 uppercase italic">LOCAL/</span>
          <span className="tabular-nums font-semibold tracking-wider text-zinc-200">{time}</span>
        </div>

        {/* Audio FX Toggle Pill (Always keyboard accessible) */}
        <button
          onClick={toggleSound}
          aria-label="Toggle Sound Effects"
          aria-pressed={soundEnabled}
          title={soundEnabled ? "Mute Sound FX" : "Enable Tactile Sound FX"}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#111111] border border-[#222222] hover:border-zinc-500 text-zinc-400 hover:text-white font-mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-bold">FX ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3 h-3 text-zinc-400" />
              <span>FX OFF</span>
            </>
          )}
        </button>
      </div>

      {/* Center: Interactive 4-Dot Menu Trigger */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <Magnetic strength={0.4}>
          <button
            onClick={handleMenuClick}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            title="Open Navigation Menu"
            className="group w-10 h-10 rounded-xl bg-[#0D0D0D] border border-[#222222] hover:border-zinc-500 flex items-center justify-center transition-all duration-300 cursor-pointer shadow-md hover:scale-105 active:scale-95"
          >
            <div
              className={`grid grid-cols-2 gap-1.5 transition-all duration-300 group-hover:scale-110 ${
                isMenuOpen ? "rotate-45" : ""
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 group-hover:bg-white transition-colors duration-200" />
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 group-hover:bg-white transition-colors duration-200" />
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 group-hover:bg-white transition-colors duration-200" />
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 group-hover:bg-white transition-colors duration-200" />
            </div>
          </button>
        </Magnetic>
      </div>

      {/* Navigation Actions (Right: Contact CTA) */}
      <nav aria-label="Main Navigation" className="flex items-center gap-3">
        <Magnetic strength={0.25}>
          <button
            onClick={handleContactClick}
            className="px-5 py-2 text-xs md:text-sm font-mono tracking-widest text-white border border-white/60 rounded-full hover:bg-white hover:text-black transition-colors duration-300 cursor-pointer"
          >
            <TextScramble text="CONTACT NOW" />
          </button>
        </Magnetic>
      </nav>
    </header>
  );
};
