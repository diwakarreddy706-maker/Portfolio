"use client";

import React, { useState, useEffect } from "react";
import {
  Bot,
  Cpu,
  Database,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Terminal,
} from "lucide-react";
import { soundManager } from "../AudioClick";
import { RoomTourStep } from "./RoomShell";

export const ADENVER_TOUR_STEPS: RoomTourStep[] = [
  {
    title: "1. ASK // INTENT DISPATCH & PROMPT BUFFER",
    stageBadge: "STEP 1: ASK",
    focusTarget: "prompt_panel",
    rotX: 18,
    rotY: 0,
    zoomZ: 40,
    description:
      "Prompts enter the desktop assistant via the interactive terminal window. Natural language tasks are parsed, tokenized, and queued for local or cloud neural synthesis.",
    techHighlight: "PySide6 (Qt) · Threaded QWorkers · Windows System Tray Daemon",
  },
  {
    title: "2. ROUTE // HYBRID NEURAL INFERENCE ENGINE",
    stageBadge: "STEP 2: ROUTE",
    focusTarget: "router_core",
    rotX: 24,
    rotY: 90,
    zoomZ: 0,
    description:
      "The central Neural Router polyhedron inspects offline connectivity and workload urgency, dispatching requests to Local Ollama/LM Studio or cloud Groq/Gemini Flash providers.",
    techHighlight: "Intelligent Multi-Provider Routing (Ollama · Groq · Gemini API)",
  },
  {
    title: "3. REMEMBER // 3-DRAWER PERSISTENT MEMORY VAULT",
    stageBadge: "STEP 3: REMEMBER",
    focusTarget: "memory_vault",
    rotX: 36,
    rotY: 180,
    zoomZ: -40,
    description:
      "The floor-mounted Memory Vault indexes structured user context across 3 persistent SQLite stores: Tasks, Notes, and User Preferences without external cloud leakage.",
    techHighlight: "Local-First SQLite Architecture · ACID Compliant · Zero Telemetry",
  },
  {
    title: "4. ACT SAFELY // USER CONFIRMATION & GATEWAY",
    stageBadge: "STEP 4: ACT SAFELY",
    focusTarget: "action_panel",
    rotX: 20,
    rotY: 270,
    zoomZ: 50,
    description:
      "High-risk desktop operations (file deletions, bash scripts, registry modifications) trigger interactive Allow/Deny confirmation gates before executing.",
    techHighlight: "Sandboxed Command Gateway · Interactive Security Dialog · Audit Logs",
  },
];

interface AdenverRoomProps {
  currentStep: RoomTourStep;
  currentStepIndex: number;
  hoveredProp: string | null;
  setHoveredProp: (id: string | null) => void;
  onSelectPropStep: (stepIdx: number) => void;
}

export const AdenverRoom: React.FC<AdenverRoomProps> = ({
  currentStep,
  currentStepIndex,
  hoveredProp,
  setHoveredProp,
  onSelectPropStep,
}) => {
  // Signature Interaction: Force chosen provider
  const [selectedProvider, setSelectedProvider] = useState<"ollama" | "lmstudio" | "groq" | "gemini">("ollama");

  // Interactive Action Dialog: Allow or Deny
  const [actionState, setActionState] = useState<"idle" | "allowed" | "denied">("idle");
  const [activeDrawer, setActiveDrawer] = useState<"tasks" | "notes" | "user">("tasks");

  // Pulse animation trigger on packet arrival
  const [packetPhase, setPacketPhase] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPacketPhase((prev) => (prev + 1) % 100);
    }, 40);
    return () => clearInterval(timer);
  }, []);

  const handleProviderClick = (provider: "ollama" | "lmstudio" | "groq" | "gemini") => {
    soundManager.playSnap();
    setSelectedProvider(provider);
    onSelectPropStep(1); // Jump to Route step
  };

  const handleActionAllow = () => {
    soundManager.playSuccess();
    setActionState("allowed");
    setTimeout(() => setActionState("idle"), 3500);
  };

  const handleActionDeny = () => {
    soundManager.playClick(600);
    setActionState("denied");
    setTimeout(() => setActionState("idle"), 3500);
  };

  // Provider metadata
  const isLocal = selectedProvider === "ollama" || selectedProvider === "lmstudio";
  const packetColor = isLocal ? "#00f0ff" : "#c084fc"; // cyan for local, violet for cloud

  // Radius for the 8-sided octagonal chamber
  const radius = 340;
  const panelWidth = 280;

  return (
    <div
      className="relative w-[700px] h-[700px] flex items-center justify-center select-none"
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {/* 1. FLOOR: Circular Grid Disc with Outward Radial Pulse Every 3s */}
      <div
        className="assemble-prop absolute w-[640px] h-[640px] rounded-full border border-cyan-500/30 flex items-center justify-center pointer-events-none"
        style={{
          transform: "rotateX(90deg) translateZ(-160px)",
          transformStyle: "preserve-3d",
          background: "radial-gradient(circle, rgba(0, 240, 255, 0.08) 0%, rgba(5, 5, 5, 0.95) 75%)",
        }}
      >
        {/* Concentric rings on floor */}
        <div className="absolute w-[480px] h-[480px] rounded-full border border-cyan-500/20" />
        <div className="absolute w-[320px] h-[320px] rounded-full border border-cyan-500/25" />
        <div className="absolute w-[160px] h-[160px] rounded-full border border-violet-500/30" />

        {/* 8 radial spoke lines */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-[640px] h-[1px] bg-cyan-500/15"
            style={{ transform: `rotate(${i * 22.5}deg)` }}
          />
        ))}

        {/* 3-Second Outward Traveling Pulse Ring */}
        <div
          className="absolute w-24 h-24 rounded-full border-2 border-cyan-400 animate-ping opacity-60"
          style={{ animationDuration: "3s" }}
        />
      </div>

      {/* 2. OPEN CEILING: Three Concentric Hex-Rings Counter-Rotating Overhead */}
      <div
        className="assemble-prop absolute w-[520px] h-[520px] pointer-events-none flex items-center justify-center"
        style={{
          transform: "rotateX(90deg) translateZ(240px)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Outer Hex Ring */}
        <div
          className="absolute w-[460px] h-[460px] rounded-full border border-dashed border-cyan-500/30 animate-spin"
          style={{ animationDuration: "38s" }}
        />
        {/* Middle Hex Ring (Reverse) */}
        <div
          className="absolute w-[320px] h-[320px] rounded-full border-2 border-violet-500/40 animate-spin"
          style={{ animationDuration: "24s", animationDirection: "reverse" }}
        />
        {/* Inner Hex Core */}
        <div
          className="absolute w-[180px] h-[180px] rounded-full border border-cyan-400/50 animate-spin"
          style={{ animationDuration: "14s" }}
        />
      </div>

      {/* 3. OCTAGONAL CHAMBER WALLS (8 panels arranged at rotateY(45deg * i) translateZ(radius)) */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = i * 45;
        return (
          <div
            key={i}
            className="assemble-prop absolute h-[320px] rounded-xl border border-cyan-900/30 bg-[#070b0e]/85 backdrop-blur-xs flex flex-col justify-between p-3.5 shadow-2xl transition-all duration-500"
            style={{
              width: `${panelWidth}px`,
              transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
              transformStyle: "preserve-3d",
              boxShadow: "inset 0 0 20px rgba(0, 240, 255, 0.05)",
            }}
          >
            {/* Header of panel */}
            <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 border-b border-white/5 pb-1">
              <span>PANEL_0{i + 1} // OCT</span>
              <span className="text-cyan-400/70">{angle}° N</span>
            </div>

            {/* WALL PANEL 0: Desktop Assistant Terminal Window (STEP 1: ASK) */}
            {i === 0 && (
              <div
                data-prop-step="0"
                onMouseEnter={() => setHoveredProp("PROMPT & DISPATCH TERMINAL")}
                onMouseLeave={() => setHoveredProp(null)}
                onClick={() => onSelectPropStep(0)}
                className={`my-auto p-3 rounded-lg border bg-black/90 transition-all cursor-pointer ${
                  currentStep.focusTarget === "prompt_panel" || hoveredProp === "PROMPT & DISPATCH TERMINAL"
                    ? "border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.4)] translate-z-[12px]"
                    : "border-cyan-950/80 hover:border-cyan-500/50"
                }`}
              >
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-cyan-400 font-bold mb-2">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>ADENVER_PROMPT.CLI</span>
                </div>
                <div className="bg-[#0a0f14] p-2 rounded border border-cyan-950 font-mono text-[9px] text-zinc-300 space-y-1">
                  <p className="text-cyan-300 font-semibold">&gt; summarize --system-logs</p>
                  <p className="text-zinc-500">Parsing query context...</p>
                  <div className="flex items-center gap-1 text-[8.5px] text-emerald-400 pt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>ROUTER READY: 18ms</span>
                  </div>
                </div>
              </div>
            )}

            {/* WALL PANEL 1: Ollama Local Terminal (STEP 2: ROUTE) */}
            {i === 1 && (
              <div
                data-prop-step="1"
                onMouseEnter={() => setHoveredProp("OLLAMA LOCAL ENGINE")}
                onMouseLeave={() => setHoveredProp(null)}
                onClick={() => handleProviderClick("ollama")}
                className={`my-auto p-3 rounded-lg border bg-black/90 transition-all cursor-pointer ${
                  selectedProvider === "ollama"
                    ? "border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.5)] translate-z-[12px]"
                    : "border-cyan-950/80 hover:border-cyan-500/50"
                }`}
              >
                <div className="flex justify-between items-center text-[10px] font-mono mb-1.5">
                  <span className="text-white font-bold">OLLAMA 3.2</span>
                  <span className="text-cyan-400 font-mono text-[8px] bg-cyan-950/60 border border-cyan-800/60 px-1.5 py-0.5 rounded">
                    [LOCAL]
                  </span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden my-2">
                  <div className="w-[35%] h-full bg-cyan-400" />
                </div>
                <div className="text-[8.5px] font-mono text-zinc-400 flex justify-between">
                  <span>LOAD: 35%</span>
                  <span className="text-cyan-300">PRIVACY: 100%</span>
                </div>
              </div>
            )}

            {/* WALL PANEL 2: LM Studio Local Terminal */}
            {i === 2 && (
              <div
                data-prop-step="1"
                onMouseEnter={() => setHoveredProp("LM STUDIO LOCAL RUNTIME")}
                onMouseLeave={() => setHoveredProp(null)}
                onClick={() => handleProviderClick("lmstudio")}
                className={`my-auto p-3 rounded-lg border bg-black/90 transition-all cursor-pointer ${
                  selectedProvider === "lmstudio"
                    ? "border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.5)] translate-z-[12px]"
                    : "border-cyan-950/80 hover:border-cyan-500/50"
                }`}
              >
                <div className="flex justify-between items-center text-[10px] font-mono mb-1.5">
                  <span className="text-white font-bold">LM STUDIO</span>
                  <span className="text-cyan-400 font-mono text-[8px] bg-cyan-950/60 border border-cyan-800/60 px-1.5 py-0.5 rounded">
                    [LOCAL]
                  </span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden my-2">
                  <div className="w-[20%] h-full bg-cyan-400" />
                </div>
                <div className="text-[8.5px] font-mono text-zinc-400 flex justify-between">
                  <span>LOAD: 20%</span>
                  <span className="text-cyan-300">VRAM: 4.2 GB</span>
                </div>
              </div>
            )}

            {/* WALL PANEL 3: Groq Cloud Terminal */}
            {i === 3 && (
              <div
                data-prop-step="1"
                onMouseEnter={() => setHoveredProp("GROQ CLOUD LPUs")}
                onMouseLeave={() => setHoveredProp(null)}
                onClick={() => handleProviderClick("groq")}
                className={`my-auto p-3 rounded-lg border bg-black/90 transition-all cursor-pointer ${
                  selectedProvider === "groq"
                    ? "border-violet-400 shadow-[0_0_25px_rgba(192,132,252,0.5)] translate-z-[12px]"
                    : "border-violet-950/80 hover:border-violet-500/50"
                }`}
              >
                <div className="flex justify-between items-center text-[10px] font-mono mb-1.5">
                  <span className="text-white font-bold">GROQ LPU</span>
                  <span className="text-violet-400 font-mono text-[8px] bg-violet-950/60 border border-violet-800/60 px-1.5 py-0.5 rounded">
                    [CLOUD]
                  </span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden my-2">
                  <div className="w-[82%] h-full bg-violet-400" />
                </div>
                <div className="text-[8.5px] font-mono text-zinc-400 flex justify-between">
                  <span>LOAD: 82%</span>
                  <span className="text-violet-300">840 T/s</span>
                </div>
              </div>
            )}

            {/* WALL PANEL 4: Gemini Cloud Terminal */}
            {i === 4 && (
              <div
                data-prop-step="1"
                onMouseEnter={() => setHoveredProp("GEMINI 1.5 FLASH API")}
                onMouseLeave={() => setHoveredProp(null)}
                onClick={() => handleProviderClick("gemini")}
                className={`my-auto p-3 rounded-lg border bg-black/90 transition-all cursor-pointer ${
                  selectedProvider === "gemini"
                    ? "border-violet-400 shadow-[0_0_25px_rgba(192,132,252,0.5)] translate-z-[12px]"
                    : "border-violet-950/80 hover:border-violet-500/50"
                }`}
              >
                <div className="flex justify-between items-center text-[10px] font-mono mb-1.5">
                  <span className="text-white font-bold">GEMINI FLASH</span>
                  <span className="text-violet-400 font-mono text-[8px] bg-violet-950/60 border border-violet-800/60 px-1.5 py-0.5 rounded">
                    [CLOUD]
                  </span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden my-2">
                  <div className="w-[65%] h-full bg-violet-400" />
                </div>
                <div className="text-[8.5px] font-mono text-zinc-400 flex justify-between">
                  <span>LOAD: 65%</span>
                  <span className="text-violet-300">1M CTX</span>
                </div>
              </div>
            )}

            {/* WALL PANEL 5: Desktop Assistant Interactive Confirmation Window (STEP 4: ACT SAFELY) */}
            {i === 5 && (
              <div
                data-prop-step="3"
                onMouseEnter={() => setHoveredProp("SECURITY CONFIRMATION GATEWAY")}
                onMouseLeave={() => setHoveredProp(null)}
                className={`my-auto p-3 rounded-lg border bg-black/90 transition-all ${
                  currentStep.focusTarget === "action_panel" || hoveredProp === "SECURITY CONFIRMATION GATEWAY"
                    ? "border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.4)] translate-z-[12px]"
                    : "border-cyan-950/80"
                }`}
              >
                <div className="flex items-center gap-1.5 font-mono text-[9.5px] text-amber-400 font-bold mb-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>CONFIRM ACTION?</span>
                </div>
                <p className="font-mono text-[8.5px] text-zinc-300 mb-2">
                  &gt; Execute `rm -rf /cache/temp_dir`?
                </p>

                {actionState === "idle" && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleActionAllow}
                      className="flex-1 py-1 px-2 rounded bg-emerald-500/20 border border-emerald-500/60 hover:bg-emerald-500 text-emerald-300 hover:text-black font-mono text-[9px] font-bold transition-all cursor-pointer"
                    >
                      ALLOW
                    </button>
                    <button
                      onClick={handleActionDeny}
                      className="flex-1 py-1 px-2 rounded bg-red-500/20 border border-red-500/60 hover:bg-red-500 text-red-300 hover:text-black font-mono text-[9px] font-bold transition-all cursor-pointer"
                    >
                      DENY
                    </button>
                  </div>
                )}

                {actionState === "allowed" && (
                  <div className="p-1.5 rounded bg-emerald-950/80 border border-emerald-500 text-center font-mono text-[8.5px] text-emerald-300 flex items-center justify-center gap-1 animate-pulse">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>ALLOWED &amp; AUDITED</span>
                  </div>
                )}

                {actionState === "denied" && (
                  <div className="p-1.5 rounded bg-red-950/80 border border-red-500 text-center font-mono text-[8.5px] text-red-300 flex items-center justify-center gap-1 animate-pulse">
                    <XCircle className="w-3 h-3 text-red-400" />
                    <span>BLOCKED SECURELY</span>
                  </div>
                )}
              </div>
            )}

            {/* WALL PANEL 6 & 7: Ambient Cyberpunk Telemetry */}
            {(i === 6 || i === 7) && (
              <div className="my-auto font-mono text-[9px] text-zinc-500 space-y-2 p-2">
                <div className="flex justify-between border-b border-zinc-900 pb-1">
                  <span>SOCKET:</span>
                  <span className="text-cyan-400">WS://127.0.0.1</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-1">
                  <span>STATUS:</span>
                  <span className="text-emerald-400">ISOLATED</span>
                </div>
                <div className="flex justify-between">
                  <span>ROUTING:</span>
                  <span className="text-violet-400 uppercase">{selectedProvider}</span>
                </div>
              </div>
            )}

            {/* Panel footer */}
            <div className="font-mono text-[8px] text-zinc-600 border-t border-white/5 pt-1 flex justify-between">
              <span>CYBER_VAULT</span>
              <span className="text-cyan-500/40">● ONLINE</span>
            </div>
          </div>
        );
      })}

      {/* 4. CENTER: "NEURAL ROUTER" POLYHEDRON ON FLOATING PLINTH (STEP 2: ROUTE) */}
      <div
        data-prop-step="1"
        onMouseEnter={() => setHoveredProp("NEURAL ROUTER POLYHEDRON")}
        onMouseLeave={() => setHoveredProp(null)}
        onClick={() => onSelectPropStep(1)}
        className={`assemble-prop absolute flex items-center justify-center cursor-pointer transition-all ${
          currentStep.focusTarget === "router_core" || hoveredProp === "NEURAL ROUTER POLYHEDRON"
            ? "scale-110 drop-shadow-[0_0_35px_rgba(0,240,255,0.7)]"
            : "hover:scale-105"
        }`}
        style={{
          transform: "translateZ(20px)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Floating Plinth Base */}
        <div
          className="absolute w-36 h-36 rounded-full border border-cyan-400/40 bg-black/90 shadow-2xl flex items-center justify-center"
          style={{ transform: "rotateX(90deg) translateZ(-60px)" }}
        >
          <div className="w-24 h-24 rounded-full border border-dashed border-violet-400/50 animate-spin" />
        </div>

        {/* 3D Polyhedron Core (Spinning) */}
        <div
          className="relative w-24 h-24 rounded-2xl border-2 border-cyan-400 bg-black/95 shadow-[0_0_30px_rgba(0,240,255,0.5)] flex flex-col items-center justify-center p-2"
          style={{
            animation: "spin 22s linear infinite",
            transformStyle: "preserve-3d",
          }}
        >
          <Cpu className="w-8 h-8 text-cyan-300 animate-pulse" />
          <span className="font-mono text-[8px] font-bold text-white tracking-widest mt-1">
            CORE_ROUTER
          </span>
          <span
            className="font-mono text-[7px] uppercase font-semibold px-1 rounded"
            style={{
              color: packetColor,
              backgroundColor: `${packetColor}20`,
            }}
          >
            {selectedProvider}
          </span>
        </div>

        {/* Orbiting Satellite Nodes */}
        <div
          className="absolute w-44 h-44 rounded-full pointer-events-none"
          style={{
            animation: "spin 9s linear infinite",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#00f0ff]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-violet-400 shadow-[0_0_12px_#c084fc]" />
        </div>
      </div>

      {/* 5. LOW MEMORY VAULT CONSOLE (3 Drawers: Tasks, Notes, User Info) (STEP 3: REMEMBER) */}
      <div
        data-prop-step="2"
        onMouseEnter={() => setHoveredProp("SQLITE MEMORY VAULT")}
        onMouseLeave={() => setHoveredProp(null)}
        onClick={() => onSelectPropStep(2)}
        className={`assemble-prop absolute w-72 p-3 rounded-xl border bg-black/95 shadow-2xl cursor-pointer transition-all duration-500 ${
          currentStep.focusTarget === "memory_vault" || hoveredProp === "SQLITE MEMORY VAULT"
            ? "border-cyan-400 shadow-[0_0_30px_rgba(0,240,255,0.4)] translate-z-[20px]"
            : "border-cyan-950/90 hover:border-cyan-500/50"
        }`}
        style={{
          transform: "rotateX(30deg) translateY(140px) translateZ(80px)",
          transformStyle: "preserve-3d",
        }}
      >
        <div className="flex justify-between items-center text-[10px] font-mono text-cyan-400 font-bold border-b border-cyan-950 pb-1.5 mb-2">
          <span className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            MEMORY_VAULT // SQLITE
          </span>
          <span className="text-zinc-500 text-[8.5px]">ACID_LOCAL</span>
        </div>

        {/* 3 Interactive Sliding Drawers */}
        <div className="grid grid-cols-3 gap-1.5">
          {(["tasks", "notes", "user"] as const).map((drawer) => {
            const isDrawerActive = activeDrawer === drawer;
            return (
              <button
                key={drawer}
                onClick={(e) => {
                  e.stopPropagation();
                  soundManager.playClick(1100);
                  setActiveDrawer(drawer);
                }}
                className={`p-2 rounded font-mono text-[9px] uppercase font-bold transition-all border cursor-pointer ${
                  isDrawerActive
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 translate-y-[-4px] shadow-lg"
                    : "bg-[#0d141a] text-zinc-400 border-zinc-800 hover:text-white"
                }`}
              >
                {drawer}
              </button>
            );
          })}
        </div>

        {/* Drawer Content Preview */}
        <div className="mt-2.5 p-2 rounded bg-[#070b0e] border border-cyan-950 font-mono text-[8.5px] text-zinc-300 space-y-0.5">
          {activeDrawer === "tasks" && <p>• 14 active tasks indexed in local SQLite</p>}
          {activeDrawer === "notes" && <p>• 38 research notes · vector embeddings ready</p>}
          {activeDrawer === "user" && <p>• User preferences &amp; safe directory whitelist</p>}
        </div>
      </div>

      {/* 6. TRAVELING DATA PACKET (Curved path between Prompt -> Router -> Provider -> Back) */}
      <div
        className="absolute w-2.5 h-2.5 rounded-full pointer-events-none shadow-lg transition-transform duration-75"
        style={{
          backgroundColor: packetColor,
          boxShadow: `0 0 14px ${packetColor}`,
          transform: `translate3d(${Math.sin((packetPhase * Math.PI) / 50) * 160}px, ${
            Math.cos((packetPhase * Math.PI) / 50) * 120
          }px, ${Math.sin((packetPhase * Math.PI) / 25) * 60}px)`,
        }}
      />
    </div>
  );
};
