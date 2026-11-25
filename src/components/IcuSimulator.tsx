"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Activity,
  Heart,
  Thermometer,
  Zap,
  AlertTriangle,
  Play,
  Square,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  ShieldAlert,
  Server,
  Cpu,
  Radio,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import {
  IcuVitals,
  computeDemoRisk,
  DemoRiskResult,
  DEMO_THRESHOLDS,
} from "../lib/icuDemoLogic";

interface PatientProfile {
  id: string;
  bedLabel: string;
  name: string;
  age: number;
  condition: string;
  vitals: IcuVitals;
}

const FICTIONAL_PATIENTS: PatientProfile[] = [
  {
    id: "bed-1",
    bedLabel: "BED 01",
    name: "Patient A",
    age: 58,
    condition: "Post-Operative Cardiac Recovery",
    vitals: {
      heartRate: 74,
      bloodPressureSystolic: 122,
      bloodPressureDiastolic: 78,
      spO2: 98,
      temperature: 37.0,
    },
  },
  {
    id: "bed-2",
    bedLabel: "BED 02",
    name: "Patient B",
    age: 64,
    condition: "Pulmonary Observation & Hypoxia Watch",
    vitals: {
      heartRate: 104,
      bloodPressureSystolic: 106,
      bloodPressureDiastolic: 68,
      spO2: 93,
      temperature: 38.2,
    },
  },
  {
    id: "bed-3",
    bedLabel: "BED 03",
    name: "Patient C",
    age: 71,
    condition: "Suspected Systemic Sepsis Cascade",
    vitals: {
      heartRate: 126,
      bloodPressureSystolic: 86,
      bloodPressureDiastolic: 54,
      spO2: 88,
      temperature: 39.2,
    },
  },
];

const PRESETS = {
  stable: {
    label: "STABLE",
    vitals: {
      heartRate: 72,
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 78,
      spO2: 98,
      temperature: 36.8,
    },
  },
  earlyWarning: {
    label: "EARLY WARNING",
    vitals: {
      heartRate: 106,
      bloodPressureSystolic: 102,
      bloodPressureDiastolic: 66,
      spO2: 93,
      temperature: 38.3,
    },
  },
  critical: {
    label: "CRITICAL",
    vitals: {
      heartRate: 128,
      bloodPressureSystolic: 84,
      bloodPressureDiastolic: 52,
      spO2: 87,
      temperature: 39.4,
    },
  },
};

const REAL_PIPELINE_STAGES = [
  { id: "esp32", label: "ESP32 Sensors", sub: "MAX30102 · MLX90614 · MPU6050" },
  { id: "flask", label: "Flask & Socket.IO", sub: "Real-time Telemetry Ingestion" },
  { id: "rf", label: "Random Forest Engine", sub: "Sepsis Risk Classifier" },
  { id: "firebase", label: "Firebase & Web UI", sub: "Cloud Persistence & Telemetry" },
  { id: "alerts", label: "Buzzer & Local LLM", sub: "Audio Alert · Ollama Handover" },
];

export const IcuSimulator: React.FC = () => {
  const [selectedBedId, setSelectedBedId] = useState<string>("bed-1");
  const [vitals, setVitals] = useState<IcuVitals>(FICTIONAL_PATIENTS[0].vitals);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [isScenarioRunning, setIsScenarioRunning] = useState<boolean>(false);
  const [scenarioProgress, setScenarioProgress] = useState<number>(0);
  const [scenarioCaption, setScenarioCaption] = useState<string>("");
  const [activePipelineIdx, setActivePipelineIdx] = useState<number>(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const scenarioTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scenarioIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastBeatTimeRef = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);

  // Computed Demo Risk
  const riskResult: DemoRiskResult = computeDemoRisk(vitals);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // IntersectionObserver & Visibility handling to pause loops when off-screen or tab hidden
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting && !document.hidden;
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(el);

    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden && (observer ? true : true);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Pipeline active stage cycle
  useEffect(() => {
    const interval = setInterval(() => {
      if (isVisibleRef.current) {
        setActivePipelineIdx((prev) => (prev + 1) % REAL_PIPELINE_STAGES.length);
      }
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  // Synthesized pulse oximeter / ECG beep
  const playCardiacBeep = useCallback(
    (spO2Val: number) => {
      if (!soundEnabled) return;
      try {
        if (!audioCtxRef.current) {
          const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          audioCtxRef.current = new AudioCtxClass();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === "suspended") {
          ctx.resume();
        }

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Real pulse oximeter frequency drops with lower SpO2 (e.g. 880Hz at 100%, down to ~520Hz at 80%)
        const baseFreq = 520 + Math.max(0, Math.min(100, spO2Val) - 80) * 18;
        osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
        osc.type = "sine";

        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.07);
      } catch {
        // AudioContext silent fallback
      }
    },
    [soundEnabled]
  );

  // Smooth vital animator for presets
  const animateVitalsTo = (target: IcuVitals) => {
    if (prefersReducedMotion) {
      setVitals(target);
      return;
    }

    const start = { ...vitals };
    const startTime = performance.now();
    const duration = 500; // ms

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      setVitals({
        heartRate: Math.round(start.heartRate + (target.heartRate - start.heartRate) * ease),
        bloodPressureSystolic: Math.round(
          start.bloodPressureSystolic + (target.bloodPressureSystolic - start.bloodPressureSystolic) * ease
        ),
        bloodPressureDiastolic: Math.round(
          start.bloodPressureDiastolic + (target.bloodPressureDiastolic - start.bloodPressureDiastolic) * ease
        ),
        spO2: Math.round(start.spO2 + (target.spO2 - start.spO2) * ease),
        temperature: Number(
          (start.temperature + (target.temperature - start.temperature) * ease).toFixed(1)
        ),
      });

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };

  // Automated 20-second Deterioration Scenario
  const handleStartScenario = () => {
    if (isScenarioRunning) return;
    setIsScenarioRunning(true);
    setScenarioProgress(0);

    const startTime = Date.now();
    const totalDuration = 20000; // 20 seconds

    const updateScenario = () => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / totalDuration) * 100));
      setScenarioProgress(pct);

      if (elapsed < 5000) {
        setScenarioCaption("Stage 1 (0-5s): Baseline Stable. Patient exhibits normal resting rhythm and adequate perfusion.");
        setVitals({
          heartRate: 74,
          bloodPressureSystolic: 122,
          bloodPressureDiastolic: 78,
          spO2: 98,
          temperature: 37.0,
        });
      } else if (elapsed < 10000) {
        setScenarioCaption("Stage 2 (5-10s): Early Systemic Warning. Pyrexia developing with compensatory pulse elevation.");
        setVitals({
          heartRate: 104,
          bloodPressureSystolic: 108,
          bloodPressureDiastolic: 70,
          spO2: 94,
          temperature: 38.3,
        });
      } else if (elapsed < 15000) {
        setScenarioCaption("Stage 3 (10-15s): Hypoxia & Vasodilation. Peripheral SpO2 drops below 92%, systolic pressure declining.");
        setVitals({
          heartRate: 114,
          bloodPressureSystolic: 98,
          bloodPressureDiastolic: 62,
          spO2: 90,
          temperature: 38.9,
        });
      } else if (elapsed < 20000) {
        setScenarioCaption("Stage 4 (15-20s): Critical Sepsis Cascade. Severe tachycardia (126 bpm), hypotension (84 mmHg), critical hypoxemia.");
        setVitals({
          heartRate: 126,
          bloodPressureSystolic: 84,
          bloodPressureDiastolic: 54,
          spO2: 87,
          temperature: 39.3,
        });
      } else {
        setScenarioCaption("Scenario Complete. Patient vitals simulate severe sepsis state requiring urgent clinical resuscitation.");
        setIsScenarioRunning(false);
        if (scenarioIntervalRef.current) clearInterval(scenarioIntervalRef.current);
      }
    };

    scenarioIntervalRef.current = setInterval(updateScenario, 250);
  };

  const handleStopScenario = () => {
    setIsScenarioRunning(false);
    if (scenarioIntervalRef.current) clearInterval(scenarioIntervalRef.current);
    if (scenarioTimerRef.current) clearTimeout(scenarioTimerRef.current);
  };

  const handleReset = () => {
    handleStopScenario();
    setScenarioProgress(0);
    setScenarioCaption("");
    const activePatient = FICTIONAL_PATIENTS.find((p) => p.id === selectedBedId) || FICTIONAL_PATIENTS[0];
    setVitals(activePatient.vitals);
  };

  // Canvas Scrolling Waveforms Engine (ECG, Pleth SpO2, ABP)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 640);
    let height = (canvas.height = 240);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 240;
    };
    window.addEventListener("resize", handleResize);

    let sweepX = 0;
    let cyclePhase = 0; // 0 to 1 representing position in cardiac beat
    let lastTime = performance.now();

    const render = (time: number) => {
      animFrameRef.current = requestAnimationFrame(render);

      if (!isVisibleRef.current) return;

      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // Heart rate drives the frequency of the pulse wave
      const beatsPerSecond = Math.max(30, Math.min(200, vitals.heartRate)) / 60;
      cyclePhase = (cyclePhase + delta * beatsPerSecond) % 1;

      // Speed of visual sweep line across canvas
      const sweepSpeed = 160; // px/sec
      const stepX = sweepSpeed * delta;
      const prevX = sweepX;
      sweepX = (sweepX + stepX) % width;

      // Trigger audible pulse on R-peak detection (around cyclePhase 0.2)
      if (cyclePhase >= 0.18 && cyclePhase <= 0.24) {
        if (time - lastBeatTimeRef.current > (60 / vitals.heartRate) * 700) {
          lastBeatTimeRef.current = time;
          playCardiacBeep(vitals.spO2);
        }
      }

      // Clear cursor band ahead of sweep line (classical phosphor radar/telemetry sweep)
      const clearBandWidth = Math.max(16, stepX * 2);
      ctx.fillStyle = "#070b09";
      ctx.fillRect(sweepX, 0, clearBandWidth, height);

      // Channel 1: Lead II ECG (Top third, Y center ~42)
      const ecgBaseline = 42;
      const getEcgOffset = (phase: number) => {
        // P-wave
        if (phase >= 0.05 && phase < 0.13) {
          return -Math.sin(((phase - 0.05) / 0.08) * Math.PI) * 7;
        }
        // Q-dip
        if (phase >= 0.16 && phase < 0.18) {
          return 5;
        }
        // R-peak
        if (phase >= 0.18 && phase < 0.22) {
          return -34;
        }
        // S-dip
        if (phase >= 0.22 && phase < 0.26) {
          return 9;
        }
        // T-wave
        if (phase >= 0.32 && phase < 0.48) {
          return -Math.sin(((phase - 0.32) / 0.16) * Math.PI) * 11;
        }
        // Baseline noise
        return (Math.random() - 0.5) * 1.2;
      };

      // Channel 2: Plethysmogram / SpO2 (Middle third, Y center ~120)
      const plethBaseline = 120;
      const getPlethOffset = (phase: number) => {
        const amplitude = (vitals.spO2 / 100) * 24;
        if (phase >= 0.18 && phase < 0.55) {
          // Systolic rise and dicrotic notch
          const p = (phase - 0.18) / 0.37;
          const mainRise = Math.sin(p * Math.PI);
          const dicrotic = p > 0.45 && p < 0.75 ? Math.sin(((p - 0.45) / 0.3) * Math.PI) * 0.3 : 0;
          return -(mainRise + dicrotic) * amplitude;
        }
        return (Math.random() - 0.5) * 0.8;
      };

      // Channel 3: Arterial Blood Pressure (ABP) (Bottom third, Y center ~198)
      const abpBaseline = 198;
      const getAbpOffset = (phase: number) => {
        const pulsePressure = Math.max(20, vitals.bloodPressureSystolic - vitals.bloodPressureDiastolic);
        const scale = (pulsePressure / 60) * 26;
        if (phase >= 0.2 && phase < 0.65) {
          const p = (phase - 0.2) / 0.45;
          return -Math.sin(p * Math.PI) * scale;
        }
        return (Math.random() - 0.5) * 0.6;
      };

      // Draw ECG (Green)
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = "#10b981";
      ctx.beginPath();
      ctx.moveTo(prevX, ecgBaseline + getEcgOffset((cyclePhase - 0.02 + 1) % 1));
      ctx.lineTo(sweepX, ecgBaseline + getEcgOffset(cyclePhase));
      ctx.stroke();

      // Draw Pleth (Cyan)
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = "#00f0ff";
      ctx.beginPath();
      ctx.moveTo(prevX, plethBaseline + getPlethOffset((cyclePhase - 0.02 + 1) % 1));
      ctx.lineTo(sweepX, plethBaseline + getPlethOffset(cyclePhase));
      ctx.stroke();

      // Draw ABP (Amber)
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = "#f59e0b";
      ctx.beginPath();
      ctx.moveTo(prevX, abpBaseline + getAbpOffset((cyclePhase - 0.02 + 1) % 1));
      ctx.lineTo(sweepX, abpBaseline + getAbpOffset(cyclePhase));
      ctx.stroke();

      // Leading Sweep Marker
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.fillRect(sweepX, 0, 1.5, height);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [vitals.heartRate, vitals.bloodPressureSystolic, vitals.bloodPressureDiastolic, vitals.spO2, playCardiacBeep]);

  // Handle bed change
  const handleSelectBed = (bedId: string) => {
    setSelectedBedId(bedId);
    handleStopScenario();
    const targetPatient = FICTIONAL_PATIENTS.find((p) => p.id === bedId);
    if (targetPatient) {
      animateVitalsTo(targetPatient.vitals);
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full text-white font-sans bg-[#0A0D0B] border border-[#1F2922] rounded-2xl overflow-hidden shadow-2xl p-4 sm:p-6 md:p-8 space-y-6 select-none"
    >
      {/* Permanent Required Clinical Simulator Disclaimer */}
      <div className="bg-black/70 border border-[#263229] px-4 py-2.5 rounded-xl flex items-center gap-3">
        <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
        <p className="font-mono text-[10px] md:text-xs text-zinc-300 tracking-wider uppercase leading-snug">
          <span className="text-emerald-400 font-bold">SIMULATED DEMO. </span>
          Illustrative logic only. Fictional patients. Not a medical device. Not clinically validated. Not medical advice.
        </p>
      </div>

      {/* Header Bar: Bed Selector & Tactile Audio FX Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A241C] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold">
              SMART ICU MONITORING // INTERACTIVE SIMULATOR
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Hardware-in-the-loop virtual bedside console. Test sepsis-risk predictions across fictional patient states.
          </p>
        </div>

        {/* Right Header Actions: Sound Toggle + Active Preset Indicator */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled((prev) => !prev)}
            aria-pressed={soundEnabled}
            aria-label="Toggle telemetry sound effects"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111713] border border-[#263328] hover:border-emerald-500/50 text-zinc-300 hover:text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-bold">AUDIO FX: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
                <span>AUDIO FX: OFF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bed Selector Tabs: Fictional Patients */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {FICTIONAL_PATIENTS.map((patient) => {
          const isSelected = selectedBedId === patient.id;
          return (
            <button
              key={patient.id}
              onClick={() => handleSelectBed(patient.id)}
              className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "bg-[#142017] border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                  : "bg-[#0D130F] border-[#1A241C] hover:border-zinc-700 text-zinc-400"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`font-mono text-xs font-bold ${isSelected ? "text-emerald-400" : "text-zinc-300"}`}>
                  {patient.bedLabel} · {patient.name}
                </span>
                <span className="font-mono text-[10px] text-zinc-400">Age: {patient.age}</span>
              </div>
              <p className="text-[11px] text-zinc-400 truncate">{patient.condition}</p>
            </button>
          );
        })}
      </div>

      {/* Four Vital Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Heart Rate */}
        <div className="p-3.5 rounded-xl bg-[#0D1410] border border-[#1A261D] space-y-1">
          <div className="flex items-center justify-between font-mono text-[11px] text-zinc-400">
            <span className="flex items-center gap-1.5 uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              HEART RATE
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                vitals.heartRate > DEMO_THRESHOLDS.heartRate.tachycardia
                  ? "bg-rose-950/80 text-rose-400 border border-rose-800"
                  : vitals.heartRate > DEMO_THRESHOLDS.heartRate.mildTachycardia
                  ? "bg-amber-950/80 text-amber-400 border border-amber-800"
                  : "bg-emerald-950/80 text-emerald-400 border border-emerald-800"
              }`}
            >
              {vitals.heartRate > DEMO_THRESHOLDS.heartRate.tachycardia
                ? "Tachycardia"
                : vitals.heartRate > DEMO_THRESHOLDS.heartRate.mildTachycardia
                ? "Elevated"
                : "Normal"}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-black text-3xl tabular-nums text-white">
              {Math.round(vitals.heartRate)}
            </span>
            <span className="font-mono text-xs text-zinc-400">bpm</span>
          </div>
          <p className="font-mono text-[10px] text-zinc-400">Normal range: 60 - 100 bpm</p>
        </div>

        {/* Blood Pressure */}
        <div className="p-3.5 rounded-xl bg-[#0D1410] border border-[#1A261D] space-y-1">
          <div className="flex items-center justify-between font-mono text-[11px] text-zinc-400">
            <span className="flex items-center gap-1.5 uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              BLOOD PRESSURE
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                vitals.bloodPressureSystolic <= DEMO_THRESHOLDS.bloodPressure.systolicSevereHypotension
                  ? "bg-rose-950/80 text-rose-400 border border-rose-800"
                  : vitals.bloodPressureSystolic < DEMO_THRESHOLDS.bloodPressure.systolicHypotension
                  ? "bg-amber-950/80 text-amber-400 border border-amber-800"
                  : "bg-emerald-950/80 text-emerald-400 border border-emerald-800"
              }`}
            >
              {vitals.bloodPressureSystolic < DEMO_THRESHOLDS.bloodPressure.systolicHypotension
                ? "Hypotensive"
                : "Normotensive"}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-black text-3xl tabular-nums text-white">
              {Math.round(vitals.bloodPressureSystolic)}/{Math.round(vitals.bloodPressureDiastolic)}
            </span>
            <span className="font-mono text-xs text-zinc-400">mmHg</span>
          </div>
          <p className="font-mono text-[10px] text-zinc-400">Normal: 110-130 / 70-85 mmHg</p>
        </div>

        {/* SpO2 */}
        <div className="p-3.5 rounded-xl bg-[#0D1410] border border-[#1A261D] space-y-1">
          <div className="flex items-center justify-between font-mono text-[11px] text-zinc-400">
            <span className="flex items-center gap-1.5 uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              SPO2 (OXYGEN)
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                vitals.spO2 <= DEMO_THRESHOLDS.spO2.criticalHypoxia
                  ? "bg-rose-950/80 text-rose-400 border border-rose-800"
                  : vitals.spO2 < DEMO_THRESHOLDS.spO2.hypoxia
                  ? "bg-amber-950/80 text-amber-400 border border-amber-800"
                  : "bg-emerald-950/80 text-emerald-400 border border-emerald-800"
              }`}
            >
              {vitals.spO2 < DEMO_THRESHOLDS.spO2.hypoxia ? "Hypoxic" : "Optimal"}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-black text-3xl tabular-nums text-white">
              {Math.round(vitals.spO2)}
            </span>
            <span className="font-mono text-xs text-zinc-400">%</span>
          </div>
          <p className="font-mono text-[10px] text-zinc-400">Normal range: 95% - 100%</p>
        </div>

        {/* Temperature */}
        <div className="p-3.5 rounded-xl bg-[#0D1410] border border-[#1A261D] space-y-1">
          <div className="flex items-center justify-between font-mono text-[11px] text-zinc-400">
            <span className="flex items-center gap-1.5 uppercase tracking-wider">
              <Thermometer className="w-3.5 h-3.5 text-emerald-400" />
              TEMPERATURE
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                vitals.temperature >= DEMO_THRESHOLDS.temperature.highFever
                  ? "bg-rose-950/80 text-rose-400 border border-rose-800"
                  : vitals.temperature >= DEMO_THRESHOLDS.temperature.fever ||
                    vitals.temperature <= DEMO_THRESHOLDS.temperature.hypothermia
                  ? "bg-amber-950/80 text-amber-400 border border-amber-800"
                  : "bg-emerald-950/80 text-emerald-400 border border-emerald-800"
              }`}
            >
              {vitals.temperature >= DEMO_THRESHOLDS.temperature.fever
                ? "Febrile"
                : vitals.temperature <= DEMO_THRESHOLDS.temperature.hypothermia
                ? "Hypothermic"
                : "Normal"}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-black text-3xl tabular-nums text-white">
              {vitals.temperature.toFixed(1)}
            </span>
            <span className="font-mono text-xs text-zinc-400">°C</span>
          </div>
          <p className="font-mono text-[10px] text-zinc-400">Normal: 36.5°C - 37.5°C</p>
        </div>
      </div>

      {/* Main Interactive Deck: Waveform Telemetry (Left) + Sepsis AI Engine Risk Gauge (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Telemetry Waveform Panel (Cols 1-7) */}
        <div className="lg:col-span-7 bg-[#070b09] border border-[#1A241C] rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#141C16] pb-2 font-mono text-xs">
            <span className="text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              CONTINUOUS CLINICAL TELEMETRY STREAM
            </span>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="text-emerald-400 font-bold">ECG II</span>
              <span className="text-cyan-400 font-bold">PLETH</span>
              <span className="text-amber-400 font-bold">ABP</span>
            </div>
          </div>

          <div className="relative w-full h-[240px] bg-[#070b09] rounded-lg overflow-hidden border border-[#162018]">
            <canvas ref={canvasRef} className="w-full h-full block" />
            {/* Telemetry Channel Labels Overlay */}
            <div className="absolute top-2 left-3 font-mono text-[10px] text-emerald-400/80 pointer-events-none">
              LEAD II · 25 mm/s · GAIN 1.0
            </div>
            <div className="absolute top-[88px] left-3 font-mono text-[10px] text-cyan-400/80 pointer-events-none">
              PLETH (SpO2) · {Math.round(vitals.spO2)}%
            </div>
            <div className="absolute top-[168px] left-3 font-mono text-[10px] text-amber-400/80 pointer-events-none">
              ABP · {Math.round(vitals.bloodPressureSystolic)}/{Math.round(vitals.bloodPressureDiastolic)} mmHg
            </div>
          </div>
        </div>

        {/* Sepsis AI Engine Risk Gauge & Diagnostic Explanations (Cols 8-12) */}
        <div className="lg:col-span-5 bg-[#0D1410] border border-[#1A261D] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1A241C] pb-2">
            <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              SEPSIS AI ENGINE // RISK GAUGE
            </span>
            <span
              className={`font-mono text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                riskResult.level === "High"
                  ? "bg-rose-950/80 text-rose-400 border border-rose-800"
                  : riskResult.level === "Elevated"
                  ? "bg-amber-950/80 text-amber-400 border border-amber-800"
                  : "bg-emerald-950/80 text-emerald-400 border border-emerald-800"
              }`}
            >
              {riskResult.level} RISK
            </span>
          </div>

          {/* Semi-Circle Risk Score Meter */}
          <div className="text-center py-2">
            <div className="inline-block relative">
              <svg width="220" height="110" viewBox="0 0 220 110" className="overflow-visible">
                {/* Background Arc */}
                <path
                  d="M 20 100 A 90 90 0 0 1 200 100"
                  fill="none"
                  stroke="#1c261e"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                {/* Active Arc scaled to score */}
                <path
                  d="M 20 100 A 90 90 0 0 1 200 100"
                  fill="none"
                  stroke={
                    riskResult.level === "High"
                      ? "#f43f5e"
                      : riskResult.level === "Elevated"
                      ? "#f59e0b"
                      : "#10b981"
                  }
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * riskResult.score) / 100}
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-1 pointer-events-none">
                <span className="font-display font-black text-4xl tabular-nums text-white">
                  {riskResult.score}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400">
                  / 100 INDEX
                </span>
              </div>
            </div>
            {/* Required Label */}
            <p className="font-mono text-xs text-zinc-400 uppercase tracking-wider mt-2">
              Demo risk score (illustrative)
            </p>
          </div>

          {/* Transparent Diagnostic Reasons List */}
          <div className="space-y-2 pt-2 border-t border-[#1A241C]">
            <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 block font-semibold">
              EVALUATION RATIONALE:
            </span>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {riskResult.reasons.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                  <span
                    className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${
                      riskResult.level === "High"
                        ? "bg-rose-400"
                        : riskResult.level === "Elevated"
                        ? "bg-amber-400"
                        : "bg-emerald-400"
                    }`}
                  />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Real Hardware-Software Pipeline Strip (from project description) */}
      <div className="bg-[#0B100D] border border-[#18241B] rounded-xl p-3.5 space-y-2">
        <div className="flex items-center justify-between font-mono text-xs text-zinc-400">
          <span className="uppercase tracking-wider flex items-center gap-1.5 font-semibold text-zinc-300">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            AUTHENTIC ARCHITECTURAL DATAFLOW
          </span>
          <span className="text-[10px] text-emerald-400 uppercase">
            Active: {REAL_PIPELINE_STAGES[activePipelineIdx].label}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1">
          {REAL_PIPELINE_STAGES.map((stage, idx) => {
            const isActive = activePipelineIdx === idx;
            return (
              <div
                key={stage.id}
                className={`p-2 rounded-lg border transition-colors duration-300 ${
                  isActive
                    ? "bg-[#142318] border-emerald-500/80 text-white shadow-sm"
                    : "bg-[#090D0A] border-[#18241B] text-zinc-500"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"
                    }`}
                  />
                  <span className="font-mono text-[11px] font-bold truncate">{stage.label}</span>
                </div>
                <p className="font-mono text-[9px] text-zinc-400 truncate">{stage.sub}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* High Risk Alert Banner (with aria-live="polite") */}
      {riskResult.level === "High" && (
        <div
          role="status"
          aria-live="polite"
          className={`px-4 py-3 rounded-xl border border-rose-500/80 bg-rose-950/60 flex items-center gap-3 text-rose-200 ${
            prefersReducedMotion ? "" : "animate-pulse"
          }`}
        >
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <div className="text-xs md:text-sm font-mono tracking-wide">
            <span className="font-bold text-white">CRITICAL ALERT: </span>
            SEPSIS RISK ELEVATED — CLINICAL INTERVENTION REQUIRED
          </div>
        </div>
      )}

      {/* Interactive Controls & Scenario Section */}
      <div className="bg-[#0B100D] border border-[#1A241C] rounded-xl p-5 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1A241C] pb-3">
          <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            VITAL PARAMETER CALIBRATION &amp; PRESETS
          </span>

          {/* Presets Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider mr-1">
              PRESETS:
            </span>
            <button
              onClick={() => animateVitalsTo(PRESETS.stable.vitals)}
              className="px-3 py-1 rounded-full bg-[#111713] border border-[#233226] hover:border-emerald-500 text-emerald-400 font-mono text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-colors"
            >
              STABLE
            </button>
            <button
              onClick={() => animateVitalsTo(PRESETS.earlyWarning.vitals)}
              className="px-3 py-1 rounded-full bg-[#111713] border border-[#233226] hover:border-amber-500 text-amber-400 font-mono text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-colors"
            >
              EARLY WARNING
            </button>
            <button
              onClick={() => animateVitalsTo(PRESETS.critical.vitals)}
              className="px-3 py-1 rounded-full bg-[#111713] border border-[#233226] hover:border-rose-500 text-rose-400 font-mono text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-colors"
            >
              CRITICAL
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Heart Rate Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-mono text-xs">
              <label htmlFor="hr-slider" className="text-zinc-300">
                Heart Rate (HR)
              </label>
              <span className="text-emerald-400 font-bold tabular-nums">
                {Math.round(vitals.heartRate)} bpm
              </span>
            </div>
            <input
              id="hr-slider"
              type="range"
              min="40"
              max="180"
              step="1"
              value={Math.round(vitals.heartRate)}
              aria-valuetext={`Heart rate ${Math.round(vitals.heartRate)} beats per minute`}
              onChange={(e) =>
                setVitals((prev) => ({ ...prev, heartRate: Number(e.target.value) }))
              }
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>

          {/* Systolic Blood Pressure Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-mono text-xs">
              <label htmlFor="bp-sys-slider" className="text-zinc-300">
                Systolic Blood Pressure (BP)
              </label>
              <span className="text-amber-400 font-bold tabular-nums">
                {Math.round(vitals.bloodPressureSystolic)} mmHg
              </span>
            </div>
            <input
              id="bp-sys-slider"
              type="range"
              min="60"
              max="180"
              step="1"
              value={Math.round(vitals.bloodPressureSystolic)}
              aria-valuetext={`Systolic blood pressure ${Math.round(vitals.bloodPressureSystolic)} millimeters of mercury`}
              onChange={(e) =>
                setVitals((prev) => ({ ...prev, bloodPressureSystolic: Number(e.target.value) }))
              }
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Diastolic Blood Pressure Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-mono text-xs">
              <label htmlFor="bp-dia-slider" className="text-zinc-300">
                Diastolic Blood Pressure
              </label>
              <span className="text-amber-400 font-bold tabular-nums">
                {Math.round(vitals.bloodPressureDiastolic)} mmHg
              </span>
            </div>
            <input
              id="bp-dia-slider"
              type="range"
              min="40"
              max="110"
              step="1"
              value={Math.round(vitals.bloodPressureDiastolic)}
              aria-valuetext={`Diastolic blood pressure ${Math.round(vitals.bloodPressureDiastolic)} millimeters of mercury`}
              onChange={(e) =>
                setVitals((prev) => ({ ...prev, bloodPressureDiastolic: Number(e.target.value) }))
              }
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* SpO2 Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-mono text-xs">
              <label htmlFor="spo2-slider" className="text-zinc-300">
                Oxygen Saturation (SpO2)
              </label>
              <span className="text-cyan-400 font-bold tabular-nums">
                {Math.round(vitals.spO2)} %
              </span>
            </div>
            <input
              id="spo2-slider"
              type="range"
              min="75"
              max="100"
              step="1"
              value={Math.round(vitals.spO2)}
              aria-valuetext={`Oxygen saturation ${Math.round(vitals.spO2)} percent`}
              onChange={(e) =>
                setVitals((prev) => ({ ...prev, spO2: Number(e.target.value) }))
              }
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Temperature Slider */}
          <div className="space-y-1.5 md:col-span-2">
            <div className="flex justify-between font-mono text-xs">
              <label htmlFor="temp-slider" className="text-zinc-300">
                Core Body Temperature
              </label>
              <span className="text-emerald-400 font-bold tabular-nums">
                {vitals.temperature.toFixed(1)} °C
              </span>
            </div>
            <input
              id="temp-slider"
              type="range"
              min="35.0"
              max="41.0"
              step="0.1"
              value={vitals.temperature}
              aria-valuetext={`Core body temperature ${vitals.temperature.toFixed(1)} degrees Celsius`}
              onChange={(e) =>
                setVitals((prev) => ({ ...prev, temperature: Number(e.target.value) }))
              }
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Automated Scenario Runner (20-Second Automated Deterioration Sequence) */}
        <div className="border-t border-[#1A241C] pt-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-zinc-200 font-bold block">
                AUTOMATED CLINICAL DETERIORATION SCENARIO (20 SECONDS)
              </span>
              <p className="text-[11px] text-zinc-400">
                Simulates real-time clinical degradation from resting stability to acute sepsis cascade.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {!isScenarioRunning ? (
                <button
                  onClick={handleStartScenario}
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors shadow-lg"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  RUN SCENARIO
                </button>
              ) : (
                <button
                  onClick={handleStopScenario}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors shadow-lg"
                >
                  <Square className="w-3.5 h-3.5 fill-white" />
                  STOP
                </button>
              )}

              <button
                onClick={handleReset}
                className="px-3 py-2 rounded-lg border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                RESET
              </button>
            </div>
          </div>

          {/* Scenario Progress Bar & Live Caption */}
          {scenarioCaption && (
            <div className="bg-[#080D0A] border border-[#1A261D] rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between font-mono text-[10px] text-zinc-400">
                <span className="text-emerald-400 uppercase font-semibold">SCENARIO PROGRESS</span>
                <span>{scenarioProgress}% (20s Total)</span>
              </div>
              <div className="w-full h-1.5 bg-[#141C16] rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-300"
                  style={{ width: `${scenarioProgress}%` }}
                />
              </div>
              <p className="font-mono text-xs text-zinc-200">{scenarioCaption}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface IcuSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IcuSimulatorModal: React.FC<IcuSimulatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Focus trap & Escape listener
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

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
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
        clearTimeout(timer);
        previousActiveElement.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-xl select-none overflow-y-auto">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Smart ICU Monitoring Interactive Simulator"
        className="relative w-full max-w-6xl bg-[#070b09] border border-[#1e2a21] rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl my-auto max-h-[94vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Smart ICU Simulator"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 rounded-full border border-zinc-700 bg-[#121914] text-zinc-300 hover:text-white hover:border-zinc-400 flex items-center justify-center transition-colors cursor-pointer z-20 shadow-md"
        >
          <X className="w-4 h-4" />
        </button>

        <IcuSimulator />
      </div>
    </div>
  );
};
