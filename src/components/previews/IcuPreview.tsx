"use client";

import React, { useState, useEffect, useRef } from "react";
import { Activity, Heart, ShieldAlert, Thermometer, Waves } from "lucide-react";

export const IcuPreview: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isOnScreen, setIsOnScreen] = useState(true);

  // Dynamic vitals state
  const [hr, setHr] = useState(78);
  const [bpSys, setBpSys] = useState(120);
  const [bpDia, setBpDia] = useState(80);
  const [spo2, setSpo2] = useState(98);
  const [temp, setTemp] = useState(36.8);

  // Sepsis risk score (0.0 to 1.0)
  const [riskScore, setRiskScore] = useState(0.14);
  const [riskLevel, setRiskLevel] = useState<"LOW" | "ELEVATED">("LOW");

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // IntersectionObserver & Visibility API to pause when offscreen / tab hidden
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let isIntersecting = true;
    let isTabVisible = !document.hidden;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isIntersecting = entry.isIntersecting;
          setIsOnScreen(isIntersecting && isTabVisible);
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(el);

    const onVisibilityChange = () => {
      isTabVisible = !document.hidden;
      setIsOnScreen(isIntersecting && isTabVisible);
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  // Subtle cyclic oscillation for vitals and risk gauge
  useEffect(() => {
    if (isReducedMotion) {
      setHr(78);
      setBpSys(120);
      setBpDia(80);
      setSpo2(98);
      setTemp(36.8);
      setRiskScore(0.14);
      setRiskLevel("LOW");
      return;
    }

    if (!isOnScreen) return;

    let step = 0;
    const interval = setInterval(() => {
      step = (step + 1) % 12;

      // Slowly shift vitals within normal fictional range
      const hrVariations = [78, 79, 81, 83, 82, 80, 78, 77, 76, 77, 78, 79];
      const bpVariations: [number, number][] = [
        [120, 80],
        [121, 81],
        [122, 82],
        [124, 83],
        [122, 82],
        [119, 80],
        [118, 79],
        [117, 78],
        [118, 79],
        [119, 80],
        [120, 80],
        [120, 81],
      ];
      const spo2Variations = [98, 98, 97, 97, 98, 99, 98, 98, 97, 98, 99, 98];
      const tempVariations = [36.8, 36.9, 37.0, 37.1, 37.0, 36.9, 36.8, 36.7, 36.8, 36.9, 37.0, 36.9];

      // Risk score moves smoothly between 0.12 (Low) and 0.36 (Elevated)
      const riskScores = [0.12, 0.15, 0.19, 0.25, 0.32, 0.36, 0.31, 0.24, 0.18, 0.14, 0.12, 0.13];

      const currentScore = riskScores[step];
      setHr(hrVariations[step]);
      setBpSys(bpVariations[step][0]);
      setBpDia(bpVariations[step][1]);
      setSpo2(spo2Variations[step]);
      setTemp(tempVariations[step]);
      setRiskScore(currentScore);
      setRiskLevel(currentScore > 0.28 ? "ELEVATED" : "LOW");
    }, 1800);

    return () => clearInterval(interval);
  }, [isReducedMotion, isOnScreen]);

  // Single unit of P-Q-R-S-T ECG wave across 150px
  const ecgWavePattern = "M 0 20 L 25 20 L 32 16 L 38 20 L 48 20 L 53 4 L 59 36 L 64 14 L 68 20 L 80 20 L 88 15 L 98 20 L 150 20";

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col justify-between font-mono select-none"
    >
      {/* Top Telemetry Header */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-[10px]">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-teal-400" />
          <span className="text-zinc-200 font-semibold tracking-wider text-[9px] sm:text-[10px]">
            BEDSIDE TELEMETRY // BED 04
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-amber-400 bg-amber-950/40 border border-amber-900/60 px-2 py-0.5 rounded font-bold">
            Prototype, not clinically validated
          </span>
          <span className="text-[8px] uppercase tracking-widest text-zinc-500 border border-zinc-800 px-1.5 py-0.5 rounded bg-zinc-900/60">
            ILLUSTRATIVE PREVIEW
          </span>
        </div>
      </div>

      {/* Middle Grid: 4 Vitals Cards + ECG Waveform + Sepsis Risk Gauge */}
      <div className="my-auto py-2 flex flex-col gap-2">
        {/* 4 Small Vital Cards */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
          {/* Heart Rate */}
          <div className="bg-[#141414] border border-zinc-800/90 rounded-lg p-1.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[8px] text-zinc-400">
              <span>HR</span>
              <Heart className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
            </div>
            <div className="text-emerald-400 font-bold text-sm sm:text-base leading-none my-0.5">
              {hr}
            </div>
            <span className="text-[8px] text-zinc-500">bpm</span>
          </div>

          {/* Blood Pressure */}
          <div className="bg-[#141414] border border-zinc-800/90 rounded-lg p-1.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[8px] text-zinc-400">
              <span>BP</span>
              <span className="text-[7.5px] text-zinc-500">NIBP</span>
            </div>
            <div className="text-white font-bold text-xs sm:text-sm leading-none my-0.5">
              {bpSys}/{bpDia}
            </div>
            <span className="text-[8px] text-zinc-500">mmHg</span>
          </div>

          {/* SpO2 */}
          <div className="bg-[#141414] border border-zinc-800/90 rounded-lg p-1.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[8px] text-zinc-400">
              <span>SpO2</span>
              <Waves className="w-2.5 h-2.5 text-teal-400" />
            </div>
            <div className="text-teal-300 font-bold text-sm sm:text-base leading-none my-0.5">
              {spo2}%
            </div>
            <span className="text-[8px] text-zinc-500">Normal</span>
          </div>

          {/* Temperature */}
          <div className="bg-[#141414] border border-zinc-800/90 rounded-lg p-1.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[8px] text-zinc-400">
              <span>TEMP</span>
              <Thermometer className="w-2.5 h-2.5 text-amber-400" />
            </div>
            <div className="text-amber-300 font-bold text-sm sm:text-base leading-none my-0.5">
              {temp.toFixed(1)}°
            </div>
            <span className="text-[8px] text-zinc-500">Celsius</span>
          </div>
        </div>

        {/* Real-time Scrolling ECG Line */}
        <div className="bg-[#0b0f0e] border border-teal-900/50 rounded-lg p-1.5 sm:p-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-[8px] text-teal-400/80 mb-1">
            <span className="flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
              LEAD II ECG TELEMETRY
            </span>
            <span className="text-zinc-500">SWEEP: 25 mm/s</span>
          </div>

          {/* Scrolling SVG Waveform */}
          <div className="w-full h-8 sm:h-10 relative overflow-hidden">
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f2420_1px,transparent_1px),linear-gradient(to_bottom,#0f2420_1px,transparent_1px)] bg-[size:10px_10px] opacity-40 pointer-events-none" />

            <svg
              className="absolute inset-0 w-full h-full overflow-visible"
              preserveAspectRatio="none"
              viewBox="0 0 300 40"
            >
              <g
                className={
                  isReducedMotion || !isOnScreen
                    ? ""
                    : "animate-[ecgScroll_2.4s_linear_infinite]"
                }
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                <path
                  d={`${ecgWavePattern} ${ecgWavePattern} ${ecgWavePattern}`}
                  fill="none"
                  stroke="#14b8a6"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </div>
        </div>

        {/* Sepsis AI Risk Gauge */}
        <div className="bg-[#121212] border border-zinc-800 rounded-lg p-2 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[9px]">
            <span className="text-zinc-400 flex items-center gap-1 font-semibold">
              <ShieldAlert className="w-3 h-3 text-teal-400" />
              SEPSIS RISK ENGINE (RANDOM FOREST)
            </span>
            <span
              className={`font-bold px-1.5 py-0.2 rounded text-[8.5px] ${
                riskLevel === "ELEVATED"
                  ? "bg-amber-950/80 text-amber-300 border border-amber-800/60"
                  : "bg-emerald-950/80 text-emerald-300 border border-emerald-800/60"
              }`}
            >
              {riskLevel} ({riskScore.toFixed(2)})
            </span>
          </div>

          {/* Progress Gauge Bar */}
          <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden p-0.5 border border-zinc-800 flex items-center">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                riskLevel === "ELEVATED" ? "bg-amber-500" : "bg-teal-400"
              }`}
              style={{
                width: `${Math.round(riskScore * 100)}%`,
                transform: "translateZ(0)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Sub-footer */}
      <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[9px] text-zinc-400">
        <span>ESP32 · FLASK · RANDOM FOREST</span>
        <span className="text-teal-400 font-semibold">PUBLISHED IN IJIRCCE</span>
      </div>

      {/* Embedded CSS for smooth horizontal SVG sweep */}
      <style jsx>{`
        @keyframes ecgScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-150px);
          }
        }
      `}</style>
    </div>
  );
};
