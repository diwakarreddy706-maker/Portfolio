"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  Heart,
  Thermometer,
  Radio,
  Bell,
  AlertTriangle,
  FileText,
  MessageSquare,
  ShieldAlert,
  Server,
  Zap,
} from "lucide-react";
import { soundManager } from "../AudioClick";
import { RoomTourStep } from "./RoomShell";

export const ICU_TOUR_STEPS: RoomTourStep[] = [
  {
    title: "1. MONITOR // PATIENT VITALS TELEMETRY",
    stageBadge: "STEP 1: MONITOR",
    focusTarget: "bed_sensors",
    rotX: 16,
    rotY: -15,
    zoomZ: 30,
    description:
      "Interactive patient monitoring interface tracking simulated clinical telemetry: heart rate, SpO2, and body temperature.",
    techHighlight: "HTML5 · CSS3 · JavaScript · Telemetry Streaming",
  },
  {
    title: "2. INTERFACE // REACTIVE WEB CONSOLE",
    stageBadge: "STEP 2: INTERFACE",
    focusTarget: "sensor_cart",
    rotX: 20,
    rotY: -35,
    zoomZ: 70,
    description:
      "Responsive web console engineered with Tailwind CSS to display live vitals telemetry, patient status indicators, and real-time updates.",
    techHighlight: "Tailwind CSS · Dynamic DOM Updates · Status Indicators",
  },
  {
    title: "3. PREDICT RISK // SEPSIS RISK SCORE",
    stageBadge: "STEP 3: PREDICT RISK",
    focusTarget: "wall_pipeline",
    rotX: 18,
    rotY: 35,
    zoomZ: 40,
    description:
      "Risk index scoring algorithm evaluating vital trend variance into categorized risk tiers: Low Risk, Moderate, and Critical warning.",
    techHighlight: "Sepsis Risk Index · Vital Metric Normalization · Clinical Logic",
  },
  {
    title: "4. CLOUD SYNC // FIREBASE & ALERT STATE",
    stageBadge: "STEP 4: CLOUD SYNC",
    focusTarget: "monitor_screen",
    rotX: 22,
    rotY: -10,
    zoomZ: 100,
    description:
      "Synchronizes event logs to Firebase Firestore in real-time. Critical metric alerts trigger responsive dashboard banner notifications and patient summaries.",
    techHighlight: "Firebase Firestore Sync · Real-time Event Logging · Visual Status Alerts",
  },
];

interface IcuRoomProps {
  currentStep: RoomTourStep;
  currentStepIndex: number;
  hoveredProp: string | null;
  setHoveredProp: (id: string | null) => void;
  onSelectPropStep: (stepIdx: number) => void;
  isCriticalSimulated: boolean;
  onTriggerCritical: () => void;
}

export const IcuRoom: React.FC<IcuRoomProps> = ({
  currentStep,
  currentStepIndex,
  hoveredProp,
  setHoveredProp,
  onSelectPropStep,
  isCriticalSimulated,
  onTriggerCritical,
}) => {
  // Live simulated vital drift (~1 update/sec)
  const [vitals, setVitals] = useState({
    hr: 74,
    spo2: 98,
    temp: 37.0,
    bpSys: 120,
    bpDia: 80,
    sepsisScore: 0.14,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Realistic simulated drift
  useEffect(() => {
    const timer = setInterval(() => {
      setVitals((prev) => {
        if (isCriticalSimulated) {
          return {
            hr: 126,
            spo2: 91,
            temp: 39.2,
            bpSys: 88,
            bpDia: 54,
            sepsisScore: 0.79,
          };
        }
        const deltaHr = Math.floor(Math.random() * 3) - 1;
        const newHr = Math.max(68, Math.min(80, prev.hr + deltaHr));
        const newTemp = +(37.0 + (Math.random() * 0.2 - 0.1)).toFixed(1);
        const newScore = +(0.12 + Math.random() * 0.04).toFixed(2);
        return {
          hr: newHr,
          spo2: Math.random() > 0.8 ? 97 : 98,
          temp: newTemp,
          bpSys: 120 + Math.floor(Math.random() * 3) - 1,
          bpDia: 80 + Math.floor(Math.random() * 3) - 1,
          sepsisScore: newScore,
        };
      });
    }, 1100);

    return () => clearInterval(timer);
  }, [isCriticalSimulated]);

  // Handle critical simulation trigger toast
  useEffect(() => {
    if (isCriticalSimulated) {
      setToastMessage("CRITICAL EVENT LOGGED: SEPSIS RISK SPIKE (0.79) → ALERT DISPATCHED");
      const t = setTimeout(() => setToastMessage(null), 5500);
      return () => clearTimeout(t);
    }
  }, [isCriticalSimulated]);

  // Sepsis risk tone: teal (low) -> amber (mod) -> red (critical)
  const riskColor = isCriticalSimulated
    ? "#ef4444"
    : vitals.sepsisScore > 0.4
    ? "#f59e0b"
    : "#14b8a6";

  return (
    <div
      className="relative w-[720px] h-[700px] flex items-center justify-center select-none"
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {/* Critical Simulation Alert Toast Banner */}
      {toastMessage && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 bg-red-950/95 border-2 border-red-500 text-red-200 px-4 py-2 rounded-xl font-mono text-xs shadow-[0_0_30px_rgba(239,68,68,0.6)] flex items-center gap-2 animate-bounce">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. VISIBLE CEILING WITH TWO GLOWING LIGHT PANELS AND CEILING RAIL */}
      <div
        className="assemble-prop absolute w-[640px] h-[520px] pointer-events-none flex items-center justify-around p-8"
        style={{
          transform: "rotateX(90deg) translateZ(240px)",
          transformStyle: "preserve-3d",
          background: "linear-gradient(180deg, #101416 0%, #161c1e 100%)",
        }}
      >
        {/* Ceiling light panel 1 */}
        <div
          className={`w-44 h-24 rounded-lg transition-all duration-700 ${
            isCriticalSimulated
              ? "bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
              : "bg-white/80 shadow-[0_0_40px_rgba(255,255,255,0.4)]"
          }`}
        />
        {/* Longitudinal Ceiling curtain track */}
        <div className="absolute w-[600px] h-1.5 bg-zinc-700 rounded-full top-1/2 -translate-y-1/2" />
        {/* Ceiling light panel 2 */}
        <div
          className={`w-44 h-24 rounded-lg transition-all duration-700 ${
            isCriticalSimulated
              ? "bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
              : "bg-white/80 shadow-[0_0_40px_rgba(255,255,255,0.4)]"
          }`}
        />
      </div>

      {/* 2. TILED HOSPITAL FLOOR GRID */}
      <div
        className="assemble-prop absolute w-[660px] h-[560px] rounded-2xl border border-zinc-800/80 flex items-center justify-center pointer-events-none"
        style={{
          transform: "rotateX(90deg) translateZ(-160px)",
          transformStyle: "preserve-3d",
          backgroundColor: isCriticalSimulated ? "#0d0a0a" : "#111618",
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          transition: "background-color 0.8s ease",
        }}
      >
        {/* Floor Glow Ring Under Bed (Turns Teal -> Amber -> Red on Critical) */}
        <div
          className="absolute w-72 h-72 rounded-full transition-all duration-700"
          style={{
            backgroundColor: `${riskColor}15`,
            boxShadow: `0 0 70px ${riskColor}`,
            border: `2px solid ${riskColor}50`,
          }}
        />
      </div>

      {/* 3. BACK WALL WITH WINDOW-STYLE PANEL */}
      <div
        className="assemble-prop absolute w-[640px] h-[340px] rounded-xl border border-zinc-800 bg-[#121618] p-4 flex justify-between"
        style={{
          transform: "translateZ(-280px)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Exterior Window Panel (Soft Night Daylight/Window View) */}
        <div className="w-56 h-48 rounded-lg border border-zinc-700/60 bg-gradient-to-b from-sky-950/40 via-cyan-950/20 to-black p-2 relative overflow-hidden shadow-inner">
          <div className="absolute bottom-2 left-2 font-mono text-[8px] text-zinc-500">
            EXTERIOR // RRCE CAMPUS
          </div>
        </div>

        {/* Clinical Info Wall Plate */}
        <div className="text-right font-mono text-[9px] text-zinc-500 space-y-1">
          <p className="text-zinc-300 font-bold">ICU_UNIT // BAY_04</p>
          <p>BENGALURU_IN</p>
          <p className="text-teal-400">TELEMETRY_BUS: ACTIVE</p>
        </div>
      </div>

      {/* 4. LEFT PRIVACY CURTAIN (CSS 3D Folded Strips) */}
      <div
        className="assemble-prop absolute w-28 h-[320px] flex pointer-events-none"
        style={{
          transform: "rotateY(90deg) translateZ(-300px) translateY(-10px)",
          transformStyle: "preserve-3d",
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="w-5 h-full bg-gradient-to-r from-teal-950/40 via-zinc-800 to-zinc-900 border-r border-teal-900/40 shadow-xl"
            style={{
              transform: `rotateY(${i % 2 === 0 ? 25 : -25}deg)`,
              transformOrigin: "left center",
            }}
          />
        ))}
      </div>

      {/* 5. CENTER: HOSPITAL BED WITH PATIENT TELEMETRY INTERFACE (STEP 1: MONITOR) */}
      <div
        data-prop-step="0"
        onMouseEnter={() => setHoveredProp("PATIENT BED & TELEMETRY")}
        onMouseLeave={() => setHoveredProp(null)}
        onClick={() => onSelectPropStep(0)}
        className={`assemble-prop absolute w-52 h-80 rounded-2xl border bg-[#182022] shadow-2xl p-3 flex flex-col justify-between cursor-pointer transition-all duration-500 ${
          currentStep.focusTarget === "bed_sensors" || hoveredProp === "PATIENT BED & TELEMETRY"
            ? "border-teal-400 shadow-[0_0_35px_rgba(20,184,166,0.5)] translate-z-[14px]"
            : "border-zinc-700/80 hover:border-teal-500/40"
        }`}
        style={{
          transform: "rotateX(75deg) translateY(-20px) translateZ(-20px)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Pillow & Patient Head Area */}
        <div className="w-full flex justify-center">
          <div className="w-24 h-14 rounded-xl bg-zinc-800/80 border border-zinc-700 flex flex-col items-center justify-center relative">
            {/* Temp telemetry marker */}
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b] absolute -top-1" />
            <span className="font-mono text-[7.5px] text-zinc-400">TEMP_TELEMETRY</span>
          </div>
        </div>

        {/* Patient Silhouette Mat */}
        <div className="my-auto w-36 mx-auto h-40 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col items-center justify-center p-2 relative">
          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 mb-2" />
          <div className="w-20 h-16 rounded-lg bg-zinc-800 border border-zinc-700" />
          {/* SpO2 indicator */}
          <div className="absolute right-2 top-16 flex items-center gap-1 font-mono text-[7px] text-teal-300">
            <span className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_8px_#14b8a6] animate-pulse" />
            <span>PULSE_OXIMETRY</span>
          </div>
        </div>

        {/* Bed foot rail */}
        <div className="w-full h-2 rounded-full bg-zinc-700 flex justify-between px-2 text-[7px] font-mono text-zinc-400">
          <span>BED_04</span>
          <span>ESTIMATED TELEMETRY</span>
        </div>
      </div>

      {/* 6. BEDSIDE MONITOR ON ARTICULATED ARM (STEP 4: ALERT & AI SUPPORT) */}
      <div
        data-prop-step="3"
        onMouseEnter={() => setHoveredProp("BEDSIDE VITAL MONITOR")}
        onMouseLeave={() => setHoveredProp(null)}
        onClick={() => onSelectPropStep(3)}
        className={`assemble-prop absolute w-64 p-3 rounded-xl border bg-black/95 shadow-2xl cursor-pointer transition-all duration-500 ${
          currentStep.focusTarget === "monitor_screen" || hoveredProp === "BEDSIDE VITAL MONITOR"
            ? "border-teal-400 shadow-[0_0_35px_rgba(20,184,166,0.6)] translate-z-[24px]"
            : "border-zinc-800 hover:border-teal-500/50"
        }`}
        style={{
          transform: "rotateY(-18deg) translateZ(80px) translateY(-50px) translateX(120px)",
          transformStyle: "preserve-3d",
          borderColor: isCriticalSimulated ? "#ef4444" : undefined,
          boxShadow: isCriticalSimulated ? "0 0 40px rgba(239,68,68,0.7)" : undefined,
        }}
      >
        {/* Monitor Header */}
        <div className="flex justify-between items-center text-[9px] font-mono border-b border-zinc-800 pb-1 mb-2">
          <span className="flex items-center gap-1 text-teal-400 font-bold">
            <Activity className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
            VITAL_MONITOR // BED_04
          </span>
          <span
            className="font-mono text-[8px] px-1.5 py-0.5 rounded font-bold"
            style={{
              color: riskColor,
              backgroundColor: `${riskColor}20`,
            }}
          >
            SEPSIS: {vitals.sepsisScore} [{isCriticalSimulated ? "CRITICAL" : "LOW RISK"}]
          </span>
        </div>

        {/* Continuous SVG ECG Waveform Loop */}
        <div className="w-full h-10 bg-[#070b0c] rounded border border-zinc-900 mb-2 relative overflow-hidden flex items-center">
          <svg viewBox="0 0 200 40" className="w-full h-8 stroke-teal-400 fill-none">
            <path
              d="M0 20 L40 20 L50 8 L60 32 L70 12 L80 20 L200 20"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="200"
              strokeDashoffset={isCriticalSimulated ? "0" : undefined}
              className="animate-[pulse_1.5s_infinite]"
            />
          </svg>
        </div>

        {/* 4 Numeric Tiles (HR, SpO2, Temp, Heuristic BP) */}
        <div className="grid grid-cols-2 gap-1.5 font-mono text-[9px]">
          <div className="p-1.5 rounded bg-[#0d1416] border border-zinc-800 flex justify-between">
            <span className="text-zinc-400">HEART RATE:</span>
            <span className="text-teal-300 font-bold">{vitals.hr} BPM</span>
          </div>
          <div className="p-1.5 rounded bg-[#0d1416] border border-zinc-800 flex justify-between">
            <span className="text-zinc-400">SPO2:</span>
            <span className="text-teal-300 font-bold">{vitals.spo2}%</span>
          </div>
          <div className="p-1.5 rounded bg-[#0d1416] border border-zinc-800 flex justify-between">
            <span className="text-zinc-400">TEMP:</span>
            <span className="text-amber-300 font-bold">{vitals.temp}°C</span>
          </div>
          <div className="p-1.5 rounded bg-[#0d1416] border border-zinc-800 flex flex-col">
            <div className="flex justify-between">
              <span className="text-zinc-400">BP (HEURISTIC):</span>
              <span className="text-zinc-200 font-bold">{vitals.bpSys}/{vitals.bpDia}</span>
            </div>
            <span className="text-[7px] text-zinc-500 text-right">Estimated</span>
          </div>
        </div>
      </div>

      {/* 7. LEFT CONSOLE CART (Web Console & Status Indicators) (STEP 2: INTERFACE) */}
      <div
        data-prop-step="1"
        onMouseEnter={() => setHoveredProp("CLINICAL WEB CONSOLE")}
        onMouseLeave={() => setHoveredProp(null)}
        onClick={() => onSelectPropStep(1)}
        className={`assemble-prop absolute w-52 p-3 rounded-xl border bg-black/95 shadow-2xl cursor-pointer transition-all duration-500 ${
          currentStep.focusTarget === "sensor_cart" || hoveredProp === "CLINICAL WEB CONSOLE"
            ? "border-teal-400 shadow-[0_0_30px_rgba(20,184,166,0.5)] translate-z-[20px]"
            : "border-zinc-800 hover:border-teal-500/50"
        }`}
        style={{
          transform: "rotateY(30deg) translateZ(40px) translateY(20px) translateX(-180px)",
          transformStyle: "preserve-3d",
        }}
      >
        <div className="flex justify-between items-center text-[9px] font-mono text-zinc-300 border-b border-zinc-800 pb-1 mb-2 font-bold">
          <span>WEB_CONSOLE // BEDSIDE</span>
          <span className="text-teal-400 text-[8px] bg-teal-950/60 px-1 rounded">TAILWIND_UI</span>
        </div>

        {/* Console Telemetry Display */}
        <div className="w-full bg-[#1b2f21] border border-emerald-900/60 rounded p-1.5 font-mono text-[8px] text-emerald-300 mb-2">
          <p>HR:{vitals.hr} SpO2:{vitals.spo2}%</p>
          <p>T:{vitals.temp}C SEPSIS:{vitals.sepsisScore}</p>
        </div>

        {/* Console Status: Normal OK, Alert Indicator */}
        <div className="flex items-center justify-between text-[8px] font-mono text-zinc-400 bg-[#0a0f12] p-1.5 rounded border border-zinc-800">
          <div className="flex items-center gap-1">
            <span
              className={`w-2 h-2 rounded-full ${
                isCriticalSimulated ? "bg-zinc-600" : "bg-emerald-400 shadow-[0_0_6px_#10b981]"
              }`}
            />
            <span>OK</span>
          </div>

          <div className="flex items-center gap-1">
            <span
              className={`w-2 h-2 rounded-full ${
                isCriticalSimulated ? "bg-red-500 shadow-[0_0_10px_#ef4444] animate-ping" : "bg-zinc-600"
              }`}
            />
            <span>ALERT</span>
          </div>

          <div
            className={`flex items-center gap-1 ${
              isCriticalSimulated ? "text-red-400 animate-pulse font-bold" : "text-zinc-500"
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>CRITICAL</span>
          </div>
        </div>
      </div>

      {/* 8. RIGHT WALL PIPELINE BOARD (Data Flow & Firebase Sync) (STEP 3: PREDICT RISK) */}
      <div
        data-prop-step="2"
        onMouseEnter={() => setHoveredProp("APPLICATION DATA FLOW")}
        onMouseLeave={() => setHoveredProp(null)}
        onClick={() => onSelectPropStep(2)}
        className={`assemble-prop absolute w-60 p-3 rounded-xl border bg-black/95 shadow-2xl cursor-pointer transition-all duration-500 ${
          currentStep.focusTarget === "wall_pipeline" || hoveredProp === "APPLICATION DATA FLOW"
            ? "border-teal-400 shadow-[0_0_35px_rgba(20,184,166,0.5)] translate-z-[18px]"
            : "border-zinc-800 hover:border-teal-500/50"
        }`}
        style={{
          transform: "rotateY(-75deg) translateZ(-190px) translateY(-30px)",
          transformStyle: "preserve-3d",
        }}
      >
        <div className="flex justify-between items-center text-[9px] font-mono text-teal-400 border-b border-zinc-800 pb-1 mb-2 font-bold">
          <span>DATA FLOW // FIREBASE &amp; WEB</span>
          <span className="text-zinc-500 text-[8px]">PROTOTYPE</span>
        </div>

        {/* Flow: Web Stream -> Sepsis Scoring -> Firebase -> Live UI */}
        <div className="font-mono text-[8px] text-zinc-300 space-y-1 mb-3 bg-[#0a0f12] p-2 rounded border border-zinc-800">
          <p className="text-zinc-400">• Vitals Stream Ingestion</p>
          <p className="text-teal-300">• Sepsis Risk Scoring Engine</p>
          <p className="text-emerald-400 font-bold">• Firebase Firestore Sync</p>
          <p className="text-sky-300">• Responsive Tailwind UI</p>
        </div>

        {/* Dashboard Modules */}
        <div className="text-[8px] font-mono text-zinc-400 font-bold mb-1.5">
          DASHBOARD MODULES:
        </div>
        <div className="grid grid-cols-2 gap-1 font-mono text-[7.5px]">
          <span className="p-1 rounded bg-[#0d1416] border border-zinc-800 text-zinc-300 text-center">
            Vitals Stream
          </span>
          <span className="p-1 rounded bg-[#0d1416] border border-zinc-800 text-zinc-300 text-center">
            Risk Analysis
          </span>
          <span className="p-1 rounded bg-[#0d1416] border border-zinc-800 text-zinc-300 text-center">
            Firebase Store
          </span>
          <span className="p-1 rounded bg-[#0d1416] border border-zinc-800 text-zinc-300 text-center">
            Clinical Report
          </span>
        </div>
      </div>
    </div>
  );
};
