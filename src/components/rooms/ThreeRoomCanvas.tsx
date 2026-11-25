"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  Play,
  Pause,
  RotateCcw,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Bot,
  Activity,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Filter,
  Info,
  ChevronUp,
  ChevronDown,
  Sparkles,
  MousePointerClick,
  Layers,
  Crosshair,
  Volume2,
  VolumeX,
  Mic,
  Sliders,
  Cpu,
  Radio,
  Zap,
  Globe,
  Database,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { soundManager } from "../AudioClick";

export interface ThreeRoomCanvasProps {
  activeProjectId: "adenver-ai" | "icu-monitoring" | "ets-expense";
  onClose?: () => void;
}

interface CameraWaypoint {
  num: string;
  stageTitle: string;
  badge: string;
  subtitle: string;
  description: string;
  camPos: [number, number, number];
  lookAt: [number, number, number];
  fov?: number;
}

interface InteractableObjectMeta {
  id: string;
  name: string;
  category: string;
  specs: string;
  role: string;
  stationIdx: number;
  actionLabel?: string;
  chapterIdx?: number;
}

// ==========================================
// 1. ADENVER AI — PERSONAL AI WORKSTATION
// ==========================================
const ADENVER_WAYPOINTS: CameraWaypoint[] = [
  {
    num: "01",
    stageTitle: "1. WORKSTATION // 3D HOLOGRAPHIC STUDIO",
    badge: "HOLOGRAPHIC STUDIO",
    subtitle: "Local-First Desktop AI Development Suite",
    description:
      "A developer's personal AI workspace: beveled walnut standing desk, curved ultrawide monitor, broadcast boom mic, studio headphones, and a sci-fi 3D Holographic Projector Dome displaying Adenver AI's complete architecture in real time.",
    camPos: [0, 2.7, 4.2],
    lookAt: [0, 1.28, 0],
    fov: 46,
  },
  {
    num: "02",
    stageTitle: "2. HOLOGRAPHIC DOME & NEURAL ORRERY",
    badge: "3D PROJECTION",
    subtitle: "Planetary Architecture · Live Data Flow",
    description:
      "Close inspection of the 3D Holographic Projector Dome: central autonomous neural sun, orbiting local dispatch and SQLite memory nodes, trajectory rings, and floating holographic telemetry cards.",
    camPos: [0, 1.62, 1.65],
    lookAt: [0, 1.3, 0.15],
    fov: 42,
  },
  {
    num: "03",
    stageTitle: "3. SQLITE MEMORY VAULT & PERIPHERALS",
    badge: "PERSISTENT STORAGE",
    subtitle: "Tasks · Notes · Embeddings",
    description:
      "A 3-bay desktop memory enclosure storing structured SQLite databases with live status LEDs, alongside an articulated studio condenser microphone with shockmount and mechanical keyboard.",
    camPos: [0.75, 1.35, 1.15],
    lookAt: [0.65, 1.15, 0.05],
    fov: 38,
  },
  {
    num: "04",
    stageTitle: "4. ARCHITECTURAL OVERVIEW // HIGH VANTAGE",
    badge: "WORKSPACE AUDIT",
    subtitle: "Contained Personal Assistant Environment",
    description:
      "High vantage point over the complete developer study showing the ergonomic office chair, walnut standing desk, acoustic hex wall tiles, holographic dome light field, and balanced studio lighting.",
    camPos: [-2.5, 3.4, 3.2],
    lookAt: [0.15, 1.18, 0],
    fov: 48,
  },
];

// ==========================================
// 2. SMART ICU MONITORING — CLINICAL BAY
// ==========================================
const ICU_WAYPOINTS: CameraWaypoint[] = [
  {
    num: "01",
    stageTitle: "1. ICU BAY // CLINICAL ESTABLISHING SHOT",
    badge: "CRITICAL CARE BAY",
    subtitle: "Real-Time Patient Monitoring Prototype",
    description:
      "Recognizable hospital intensive care room: articulated ICU bed with head inclined at 30° Fowler position, bedside physiological monitor cart, modern mechanical ventilator with dual breathing circuit, and IV infusion stand.",
    camPos: [0, 2.25, 4.0],
    lookAt: [0, 1.15, 0],
    fov: 46,
  },
  {
    num: "02",
    stageTitle: "2. BEDSIDE MONITOR // LIVE ECG & PLETH",
    badge: "PHYSIOLOGICAL TELEMETRY",
    subtitle: "Heart Rate · SpO2 · NIBP · Temperature",
    description:
      "Clinical 19-inch anti-glare display rendering real-time sweeping green ECG and cyan SpO2 plethysmograph waveforms with continuous vital metrics (simulated demo data).",
    camPos: [1.02, 1.48, 1.35],
    lookAt: [0.85, 1.42, 0.05],
    fov: 38,
  },
  {
    num: "03",
    stageTitle: "3. VENTILATOR & IV STAND // O2 & FLUIDS",
    badge: "LIFE SUPPORT SYSTEMS",
    subtitle: "Dual Breathing Circuit · Infusion Pump",
    description:
      "Intensive care ventilator with touchscreen and corrugated blue/white medical silicone breathing tubes, beside a wheeled stainless steel IV infusion pump stand with saline and medication bags.",
    camPos: [-1.45, 1.55, 1.35],
    lookAt: [-1.12, 1.22, -0.15],
    fov: 40,
  },
  {
    num: "04",
    stageTitle: "4. WIDE CLINICAL OVERVIEW // ELEVATED",
    badge: "PATIENT SUITE",
    subtitle: "Standard Hospital Safety Protocol",
    description:
      "Overhead clinical view showcasing cleanroom ceiling lighting, wall-mounted medical gas headwall (O2, Vacuum, Air), safety siderails, and central-locking bed casters.",
    camPos: [-2.5, 2.85, 3.2],
    lookAt: [0.1, 1.12, 0],
    fov: 48,
  },
];

// ==========================================
// 3. ETS — SRI BASAVESHWARA HARVESTING & CO.
// ==========================================
const ETS_WAYPOINTS: CameraWaypoint[] = [
  {
    num: "01",
    stageTitle: "1. OPERATIONS HANGAR // FLEET & OFFICE",
    badge: "HARVEST OPERATIONS",
    subtitle: "Sri Basaveshwara Harvesting & Co.",
    description:
      "A practical agribusiness workshop: agricultural harvesting tractor with deep-lug chevron rear tires, accounts desk with computer running Django ETS, 55-gallon diesel fuel drum, and maintenance tools.",
    camPos: [0, 3.4, 5.2],
    lookAt: [0, 1.35, 0],
    fov: 48,
  },
  {
    num: "02",
    stageTitle: "2. HARVESTING MACHINERY // 3D TRACTOR",
    badge: "FLEET ASSET",
    subtitle: "Heavy-Duty Harvesting Engine",
    description:
      "Agricultural harvesting tractor with signature green chassis, massive chevron-treaded rear drive tires with yellow rims, ROPS safety cab, front ventilation grille, and vertical diesel exhaust stack.",
    camPos: [-1.6, 1.85, 2.2],
    lookAt: [-1.1, 1.28, -0.2],
    fov: 42,
  },
  {
    num: "03",
    stageTitle: "3. ACCOUNTS DESK // DJANGO ETS LEDGER",
    badge: "FINANCIAL ERP",
    subtitle: "Django ORM & Relational MySQL Engine",
    description:
      "Operations desk with workstation PC displaying the live ETS Expense Tracking ledger table, calculating categorized income, fuel costs, and net seasonal balance in real time.",
    camPos: [1.35, 1.52, 1.42],
    lookAt: [1.1, 1.28, -0.1],
    fov: 38,
  },
  {
    num: "04",
    stageTitle: "4. MAINTENANCE & FUEL // EXPENSE PROVENANCE",
    badge: "SERVICE & PARTS",
    subtitle: "Direct Link: Machinery → Operating Costs",
    description:
      "Industrial 55-gallon diesel drum with rotary hand pump and dispensing nozzle, mechanic's roll-cab tool chest, wall pegboard with spare harvester blades, and 3-tier MySQL database cylinder.",
    camPos: [2.5, 2.4, 2.5],
    lookAt: [0.8, 1.18, 0],
    fov: 46,
  },
];

// Sample Ledger Items for ETS (Portfolio Demo Data)
interface EtsRecord {
  id: string;
  type: "income" | "expense";
  desc: string;
  amount: string;
  numAmount: number;
  date: string;
}

const ETS_LEDGER: EtsRecord[] = [
  { id: "1", type: "income", desc: "Commercial Service Contract #4", amount: "+₹1,25,000", numAmount: 125000, date: "OCT 12" },
  { id: "2", type: "expense", desc: "Operational Supplies & Diesel Fuel", amount: "-₹42,000", numAmount: 42000, date: "OCT 13" },
  { id: "3", type: "income", desc: "Agricultural Contract Retainer #12", amount: "+₹85,000", numAmount: 85000, date: "OCT 14" },
  { id: "4", type: "expense", desc: "Harvester Blade Repairs & Belt Kit", amount: "-₹14,500", numAmount: 14500, date: "OCT 15" },
  { id: "5", type: "income", desc: "Commercial Service Retainer #16", amount: "+₹1,35,000", numAmount: 135000, date: "OCT 16" },
  { id: "6", type: "expense", desc: "Field Labor & Lubricant Disbursements", amount: "-₹28,000", numAmount: 28000, date: "OCT 17" },
];

// Adenver AI Holographic Explanation Chapters (Matching Hologram Nodes)
interface AdenverChapter {
  id: number;
  nodeKey: string;
  title: string;
  subtitle: string;
  speechText: string;
  bullets: string[];
  specs: string;
  color: string;
}

const ADENVER_CHAPTERS: AdenverChapter[] = [
  {
    id: 1,
    nodeKey: "core",
    title: "ADENVER AUTONOMOUS NEURAL CORE",
    subtitle: "Central Processing Brain · Zero-Telemetry",
    speechText:
      "Online. Greetings. I am Adenver AI. At the center of this holographic dome is my autonomous neural core. All cognitive tasks, code parsing, and analysis occur directly on your local workstation without external cloud dependencies.",
    bullets: [
      "100% Offline execution: zero code or private data leaves your hardware.",
      "Embedded execution harness for autonomous multi-step reasoning.",
      "Zero telemetry tracking: completely sovereign developer copilot.",
    ],
    specs: "Central Core · Neural Processor · 100% Local",
    color: "#00f0ff",
  },
  {
    id: 2,
    nodeKey: "dispatch",
    title: "MULTI-MODEL ORBITAL MATRIX",
    subtitle: "Ollama · LM Studio · Groq · Gemini",
    speechText:
      "Orbiting the central core is the model dispatch engine. For daily private coding, I query Ollama running Llama 3.2 locally. When ultra-high reasoning or multimodal perception is demanded, I seamlessly route to Groq or Gemini with your permission.",
    bullets: [
      "Primary Local: Ollama daemon streaming Llama-3.2 at 28 tok/s.",
      "Secondary Local: LM Studio Q4 quantization in host RAM.",
      "Burst Cloud: Groq Llama-3.3-70B and Gemini 1.5 Flash API.",
    ],
    specs: "Orbit Alpha · Model Routing Matrix · 0ms Egress",
    color: "#38bdf8",
  },
  {
    id: 3,
    nodeKey: "memory",
    title: "SQLITE ENCRYPTED MEMORY VAULT",
    subtitle: "Persistent Embeddings & Task Indexing",
    speechText:
      "On the second orbital trajectory is my persistent memory vault. Powered by an encrypted 3-bay SQLite database with vector indexing, I maintain your preferences, project structures, and task history across restarts.",
    bullets: [
      "Tasks.db: Structured relational issue tracking and sprint state.",
      "Notes.db: Vector-indexed local embeddings for semantic recall.",
      "Context.db: User preferences, local shell environment, and keys.",
    ],
    specs: "Orbit Beta · SQLite FTS5 · Vector Retrieval",
    color: "#10b981",
  },
  {
    id: 4,
    nodeKey: "gateway",
    title: "ADENVER HUMAN-IN-THE-LOOP GATEWAY",
    subtitle: "Sandboxed Execution & Containment Shield",
    speechText:
      "Guarding the outer perimeter is the human-in-the-loop security gateway. Any high-risk file modification, shell command, or financial dispatch requires your explicit authorization before execution.",
    bullets: [
      "Cryptographically audited execution log with action hashes.",
      "Strict Allow/Deny controls preventing accidental system damage.",
      "Isolated execution containment with zero silent writes.",
    ],
    specs: "Orbit Gamma · Security Boundary · Permission Shield",
    color: "#f59e0b",
  },
];

export const ThreeRoomCanvas: React.FC<ThreeRoomCanvasProps> = ({
  activeProjectId,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Tour navigation state
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
  const [inspectedObject, setInspectedObject] = useState<InteractableObjectMeta | null>(null);
  const isFlyingRef = useRef<boolean>(true);
  const isUserInteractingRef = useRef<boolean>(false);

  // ==============================================================
  // 3D HOLOGRAPHIC PROJECTION & VOICE STATE
  // ==============================================================
  const [isDenverAwake, setIsDenverAwake] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [denverChapterIdx, setDenverChapterIdx] = useState<number>(0);
  const [isSpeechMuted, setIsSpeechMuted] = useState<boolean>(false);
  const isDenverAwakeRef = useRef<boolean>(false);

  useEffect(() => {
    isDenverAwakeRef.current = isDenverAwake;
  }, [isDenverAwake]);

  // Room 1 (Adenver AI) Interactive State
  const [selectedProvider, setSelectedProvider] = useState<"ollama" | "lmstudio" | "groq" | "gemini">("ollama");
  const [actionGateState, setActionGateState] = useState<"pending" | "approved" | "blocked">("pending");

  // Room 2 (Smart ICU) Interactive State
  const [isCriticalAlert, setIsCriticalAlert] = useState<boolean>(false);

  // Room 3 (ETS) Interactive State
  const [etsFilter, setEtsFilter] = useState<"all" | "income" | "expense">("all");

  // Camera coordinates interpolation refs
  const targetCamPos = useRef(new THREE.Vector3(0, 3.2, 5.2));
  const targetLookAt = useRef(new THREE.Vector3(0, 1.28, 0));
  const targetFov = useRef<number>(45);

  const waypoints = useMemo(() => {
    if (activeProjectId === "adenver-ai") return ADENVER_WAYPOINTS;
    if (activeProjectId === "icu-monitoring") return ICU_WAYPOINTS;
    return ETS_WAYPOINTS;
  }, [activeProjectId]);

  const currentWaypoint = waypoints[currentStepIdx] || waypoints[0];

  useEffect(() => {
    const wp = waypoints[currentStepIdx];
    if (wp) {
      targetCamPos.current.set(...wp.camPos);
      targetLookAt.current.set(...wp.lookAt);
      if (wp.fov) targetFov.current = wp.fov;
      isFlyingRef.current = true;
    }
  }, [currentStepIdx, waypoints]);

  // Reset step and states on room change
  useEffect(() => {
    setCurrentStepIdx(0);
    setIsCriticalAlert(false);
    setActionGateState("pending");
    setEtsFilter("all");
    setInspectedObject(null);
    setIsDenverAwake(false);
    setDenverChapterIdx(0);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    isFlyingRef.current = true;
    setIsInfoOpen(false);
  }, [activeProjectId]);

  // ==============================================================
  // SPEECH SYNTHESIS & VOICE WAKE WORD
  // ==============================================================
  const speakDenverText = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      if (isSpeechMuted) return;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.02;
      utterance.pitch = 1.05;

      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          (v.name.includes("Google") ||
            v.name.includes("Natural") ||
            v.name.includes("Samantha") ||
            v.name.includes("Daniel") ||
            v.name.includes("Alex"))
      );
      if (preferred) utterance.voice = preferred;

      window.speechSynthesis.speak(utterance);
    },
    [isSpeechMuted]
  );

  const activateDenver = useCallback((chapterIdx: number = 0) => {
    soundManager.playDenverWake();
    setIsDenverAwake(true);
    setIsPlaying(false);
    setDenverChapterIdx(chapterIdx);

    // Smooth camera push toward the Holographic Projection Dome
    targetCamPos.current.set(0, 1.65, 1.6);
    targetLookAt.current.set(0, 1.32, 0.15);
    targetFov.current = 42;
    isFlyingRef.current = true;

    speakDenverText(ADENVER_CHAPTERS[chapterIdx].speechText);
  }, [speakDenverText]);

  const handleNextDenverChapter = useCallback(() => {
    soundManager.playClick();
    const nextIdx = (denverChapterIdx + 1) % ADENVER_CHAPTERS.length;
    setDenverChapterIdx(nextIdx);
    speakDenverText(ADENVER_CHAPTERS[nextIdx].speechText);
  }, [denverChapterIdx, speakDenverText]);

  const handlePrevDenverChapter = useCallback(() => {
    soundManager.playClick();
    const prevIdx = (denverChapterIdx - 1 + ADENVER_CHAPTERS.length) % ADENVER_CHAPTERS.length;
    setDenverChapterIdx(prevIdx);
    speakDenverText(ADENVER_CHAPTERS[prevIdx].speechText);
  }, [denverChapterIdx, speakDenverText]);

  const dismissDenver = useCallback(() => {
    soundManager.playSnap();
    setIsDenverAwake(false);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    const wp = waypoints[0];
    targetCamPos.current.set(...wp.camPos);
    targetLookAt.current.set(...wp.lookAt);
    targetFov.current = wp.fov || 45;
    isFlyingRef.current = true;
  }, [waypoints]);

  const startVoiceListener = useCallback(() => {
    interface SpeechRecognitionLike {
      continuous: boolean;
      interimResults: boolean;
      lang: string;
      onstart: (() => void) | null;
      onresult: ((event: { results: Array<{ 0: { transcript: string } }> }) => void) | null;
      onerror: (() => void) | null;
      onend: (() => void) | null;
      start: () => void;
      stop: () => void;
    }
    interface WindowWithSpeech extends Window {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    }
    const win = window as unknown as WindowWithSpeech;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      activateDenver(0);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        soundManager.playClick();
      };

      recognition.onresult = () => {
        setIsListening(false);
        activateDenver(0);
      };

      recognition.onerror = () => {
        setIsListening(false);
        activateDenver(0);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      activateDenver(0);
    }
  }, [activateDenver]);

  // ==============================================================
  // EXACT RECONCILED ETS FINANCIAL CALCULATIONS
  // ==============================================================
  const filteredEtsRecords = useMemo(() => {
    if (etsFilter === "income") return ETS_LEDGER.filter((r) => r.type === "income");
    if (etsFilter === "expense") return ETS_LEDGER.filter((r) => r.type === "expense");
    return ETS_LEDGER;
  }, [etsFilter]);

  const etsGlobalTotals = useMemo(() => {
    let income = 0;
    let expense = 0;
    ETS_LEDGER.forEach((r) => {
      if (r.type === "income") income += r.numAmount;
      else expense += r.numAmount;
    });
    return {
      income,
      expense,
      net: income - expense,
    };
  }, []);

  const etsFilterSubtotal = useMemo(() => {
    let sum = 0;
    filteredEtsRecords.forEach((r) => {
      sum += r.numAmount;
    });

    if (etsFilter === "income") {
      return {
        label: "FILTERED INCOME SUBTOTAL",
        badgeLabel: "INCOME SUBTOTAL",
        amountFormatted: `+₹${sum.toLocaleString("en-IN")}`,
        color: "#10b981",
        recordCount: filteredEtsRecords.length,
        subtext: "3 Verified Revenue Contracts (Sample)",
      };
    }

    if (etsFilter === "expense") {
      return {
        label: "FILTERED EXPENSES SUBTOTAL",
        badgeLabel: "EXPENSES SUBTOTAL",
        amountFormatted: `-₹${sum.toLocaleString("en-IN")}`,
        color: "#f43f5e",
        recordCount: filteredEtsRecords.length,
        subtext: "Diesel Fuel, Blades & Field Labor (Sample)",
      };
    }

    const net = etsGlobalTotals.net;
    return {
      label: "FILTERED NET SUBTOTAL",
      badgeLabel: "ALL RECORDS NET",
      amountFormatted: `+₹${net.toLocaleString("en-IN")}`,
      color: "#10b981",
      recordCount: ETS_LEDGER.length,
      subtext: `Sample Gross: ₹${etsGlobalTotals.income.toLocaleString("en-IN")} | Sample Costs: ₹${etsGlobalTotals.expense.toLocaleString("en-IN")}`,
    };
  }, [etsFilter, filteredEtsRecords, etsGlobalTotals]);

  // ==============================================================
  // THREE.JS HIGH-FIDELITY SCENE WITH 3D HOLOGRAPHIC DOME & ORRERY
  // ==============================================================
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(
      activeProjectId === "adenver-ai"
        ? 0x05070d
        : activeProjectId === "icu-monitoring"
        ? 0x0c141a
        : 0x0c0906
    );

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(...currentWaypoint.camPos);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 2. OrbitControls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.03;
    controls.minDistance = 0.8;
    controls.maxDistance = 14;

    controls.addEventListener("start", () => {
      isUserInteractingRef.current = true;
    });

    controls.addEventListener("end", () => {
      setTimeout(() => {
        isUserInteractingRef.current = false;
      }, 2000);
    });

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(animationFrameId);
    };
    canvas.addEventListener("webglcontextlost", handleContextLost, false);

    // 3. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(
      0xffffff,
      activeProjectId === "icu-monitoring" ? 0.76 : 0.44
    );
    scene.add(ambientLight);

    const mainSpot = new THREE.SpotLight(
      0xffffff,
      activeProjectId === "icu-monitoring" ? 3.8 : 3.2
    );
    mainSpot.position.set(
      activeProjectId === "icu-monitoring" ? 0.6 : 4.5,
      7.5,
      activeProjectId === "icu-monitoring" ? 4.2 : 5.5
    );
    mainSpot.angle = Math.PI / 3.4;
    mainSpot.penumbra = 0.35;
    mainSpot.castShadow = true;
    mainSpot.shadow.mapSize.width = 2048;
    mainSpot.shadow.mapSize.height = 2048;
    mainSpot.shadow.bias = -0.0004;
    scene.add(mainSpot);

    const fillSpot = new THREE.PointLight(
      activeProjectId === "adenver-ai"
        ? 0x00f0ff
        : activeProjectId === "icu-monitoring"
        ? isCriticalAlert
          ? 0xff2244
          : 0x14b8a6
        : 0xf59e0b,
      isCriticalAlert ? 4.4 : activeProjectId === "icu-monitoring" ? 3.2 : 2.4,
      15
    );
    fillSpot.position.set(-3.2, 3.2, -1.8);
    scene.add(fillSpot);

    const rimLight = new THREE.DirectionalLight(
      activeProjectId === "adenver-ai"
        ? 0x38bdf8
        : activeProjectId === "icu-monitoring"
        ? isCriticalAlert
          ? 0xff4444
          : 0x5eead4
        : 0xfbbf24,
      activeProjectId === "icu-monitoring" ? 1.5 : 0.9
    );
    rimLight.position.set(-5, 4, 4);
    scene.add(rimLight);

    // Subtle atmospheric dust particles
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 11;
      particlePositions[i + 1] = Math.random() * 4.2;
      particlePositions[i + 2] = (Math.random() - 0.5) * 11;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color:
        activeProjectId === "adenver-ai"
          ? 0x00f0ff
          : activeProjectId === "icu-monitoring"
          ? isCriticalAlert
            ? 0xff4444
            : 0x2dd4bf
          : 0xf59e0b,
      size: 0.028,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Dynamic Canvas Texture References
    let monitorCanvas: HTMLCanvasElement | null = null;
    let monitorCtx: CanvasRenderingContext2D | null = null;
    let dynamicTexture: THREE.CanvasTexture | null = null;
    let ecgTime = 0;

    // Raycast Registry
    const interactables: Array<{
      mesh: THREE.Object3D;
      meta: InteractableObjectMeta;
    }> = [];

    const registerInteractable = (mesh: THREE.Object3D, meta: InteractableObjectMeta) => {
      mesh.userData = { isInteractable: true, meta };
      interactables.push({ mesh, meta });
    };

    // ==============================================================
    // REFERENCES FOR 3D HOLOGRAPHIC DOME & ORRERY ANIMATIONS
    // ==============================================================
    let holoBaseGroupRef: THREE.Group | null = null;
    let holoDialOuterRing: THREE.Mesh | null = null;
    let holoNebulaParticles: THREE.Points | null = null;
    let holoDomeMesh: THREE.Mesh | null = null;
    let holoCoreSun: THREE.Mesh | null = null;
    let holoCorePointLight: THREE.PointLight | null = null;

    // 4 Planetary Nodes
    let node1DispatchPivot: THREE.Group | null = null;
    let node2MemoryPivot: THREE.Group | null = null;
    let node3GatewayPivot: THREE.Group | null = null;
    let node4DaemonPivot: THREE.Group | null = null;

    let node1CardMesh: THREE.Mesh | null = null;
    let node2CardMesh: THREE.Mesh | null = null;
    let node3CardMesh: THREE.Mesh | null = null;

    // ==============================================================
    // ROOM 1: ADENVER AI — PERSONAL AI WORKSTATION WITH 3D HOLOGRAPHIC DOME
    // ==============================================================
    if (activeProjectId === "adenver-ai") {
      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(10.5, 10.5),
        new THREE.MeshStandardMaterial({
          color: 0x141210,
          roughness: 0.75,
          metalness: 0.12,
        })
      );
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      scene.add(floor);

      const floorGrid = new THREE.GridHelper(10.5, 21, 0x00f0ff, 0x1f242e);
      floorGrid.position.y = 0.001;
      scene.add(floorGrid);

      // Back Wall with Acoustic Hex Tiles
      const backWall = new THREE.Mesh(
        new THREE.PlaneGeometry(10.5, 5.2),
        new THREE.MeshStandardMaterial({ color: 0x0d1117, roughness: 0.92 })
      );
      backWall.position.set(0, 2.6, -4.2);
      backWall.receiveShadow = true;
      scene.add(backWall);

      for (let x = -3.0; x <= 3.0; x += 0.85) {
        for (let y = 1.9; y <= 3.7; y += 0.75) {
          const hex = new THREE.Mesh(
            new THREE.CylinderGeometry(0.36, 0.36, 0.045, 6),
            new THREE.MeshStandardMaterial({ color: 0x18202c, roughness: 0.72 })
          );
          hex.rotation.x = Math.PI / 2;
          hex.position.set(x, y, -4.17);
          scene.add(hex);
        }
      }

      // Developer Desk Group
      const deskGroup = new THREE.Group();

      const tabletop = new THREE.Mesh(
        new THREE.BoxGeometry(2.35, 0.055, 1.1),
        new THREE.MeshStandardMaterial({
          color: 0x2e1e12,
          roughness: 0.6,
          metalness: 0.08,
        })
      );
      tabletop.position.set(0, 0.96, 0);
      tabletop.castShadow = true;
      tabletop.receiveShadow = true;
      deskGroup.add(tabletop);

      const legMat = new THREE.MeshStandardMaterial({ color: 0x111317, metalness: 0.85, roughness: 0.25 });
      const legGeo = new THREE.BoxGeometry(0.08, 0.93, 0.08);
      [-0.98, 0.98].forEach((x) => {
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.set(x, 0.465, 0);
        leg.castShadow = true;
        deskGroup.add(leg);

        const foot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.045, 0.88), legMat);
        foot.position.set(x, 0.022, 0);
        foot.castShadow = true;
        deskGroup.add(foot);
      });

      // 34" Curved Ultrawide Display on Articulated Arm
      monitorCanvas = document.createElement("canvas");
      monitorCanvas.width = 800;
      monitorCanvas.height = 380;
      monitorCtx = monitorCanvas.getContext("2d");
      dynamicTexture = new THREE.CanvasTexture(monitorCanvas);

      const monitorGroup = new THREE.Group();
      const armBase = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.45, 16), legMat);
      armBase.position.set(0, 1.2, -0.42);
      armBase.castShadow = true;
      monitorGroup.add(armBase);

      const screenBezel = new THREE.Mesh(
        new THREE.BoxGeometry(1.28, 0.58, 0.045),
        new THREE.MeshStandardMaterial({ color: 0x101318, metalness: 0.82, roughness: 0.22 })
      );
      screenBezel.position.set(0, 1.54, -0.26);
      screenBezel.castShadow = true;
      monitorGroup.add(screenBezel);

      const screenDisplay = new THREE.Mesh(
        new THREE.PlaneGeometry(1.23, 0.53),
        new THREE.MeshBasicMaterial({ map: dynamicTexture })
      );
      screenDisplay.position.set(0, 1.54, -0.236);
      monitorGroup.add(screenDisplay);

      const rearGlow = new THREE.PointLight(0x00f0ff, 1.6, 2.6);
      rearGlow.position.set(0, 1.54, -0.44);
      monitorGroup.add(rearGlow);

      deskGroup.add(monitorGroup);
      registerInteractable(screenBezel, {
        id: "adenver-monitor",
        name: "CURVED ULTRAWIDE // AI MATRIX DISPATCH",
        category: "MULTI-MODEL ROUTER",
        specs: "34\" Curved 144Hz · Ollama/LMStudio/Groq/Gemini · Zero Telemetry",
        role: "Live matrix routing user prompts between private local daemons and cloud APIs. Click to switch active route.",
        stationIdx: 1,
        actionLabel: "SWITCH PROVIDER ROUTE",
      });

      // ==============================================================
      // 3D SCI-FI HOLOGRAPHIC PROJECTOR TABLE & DOME (MATCHING REFERENCE)
      // ==============================================================
      const holoSystemGroup = new THREE.Group();
      holoSystemGroup.position.set(0, 0.99, 0.12);

      // 1. Cyber Projector Circular Base Platform
      const basePlatform = new THREE.Mesh(
        new THREE.CylinderGeometry(0.55, 0.58, 0.024, 48),
        new THREE.MeshStandardMaterial({ color: 0x090d14, metalness: 0.92, roughness: 0.2 })
      );
      basePlatform.position.y = 0.012;
      basePlatform.receiveShadow = true;
      holoSystemGroup.add(basePlatform);

      // Outer Dial Ring with Laser Ticks
      const dialRing = new THREE.Mesh(
        new THREE.RingGeometry(0.51, 0.54, 48),
        new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide })
      );
      dialRing.rotation.x = -Math.PI / 2;
      dialRing.position.y = 0.025;
      holoSystemGroup.add(dialRing);
      holoDialOuterRing = dialRing;

      // Inner Concentric Radar Tracks
      [0.44, 0.36, 0.26, 0.14].forEach((r, idx) => {
        const track = new THREE.Mesh(
          new THREE.RingGeometry(r, r + 0.005, 36),
          new THREE.MeshBasicMaterial({
            color: idx % 2 === 0 ? 0x00f0ff : 0x38bdf8,
            transparent: true,
            opacity: 0.45,
            side: THREE.DoubleSide,
          })
        );
        track.rotation.x = -Math.PI / 2;
        track.position.y = 0.025;
        holoSystemGroup.add(track);
      });

      // Perimeter Vertical Glowing Light Equalizer Bars (Reference image rim bars)
      const barCount = 36;
      const barGeo = new THREE.BoxGeometry(0.008, 0.038, 0.008);
      const barMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.75 });
      for (let b = 0; b < barCount; b++) {
        const theta = (b * Math.PI * 2) / barCount;
        const bar = new THREE.Mesh(barGeo, barMat);
        bar.position.set(Math.cos(theta) * 0.545, 0.038, Math.sin(theta) * 0.545);
        holoSystemGroup.add(bar);
      }

      // Swirling Cosmic Nebula / Galaxy Core (Particle System in Center)
      const nebulaCount = 200;
      const nebulaGeo = new THREE.BufferGeometry();
      const nebulaPos = new Float32Array(nebulaCount * 3);
      for (let n = 0; n < nebulaCount * 3; n += 3) {
        const radius = Math.pow(Math.random(), 1.5) * 0.32;
        const angle = Math.random() * Math.PI * 2;
        nebulaPos[n] = Math.cos(angle) * radius;
        nebulaPos[n + 1] = 0.028 + Math.random() * 0.015;
        nebulaPos[n + 2] = Math.sin(angle) * radius;
      }
      nebulaGeo.setAttribute("position", new THREE.BufferAttribute(nebulaPos, 3));
      const nebulaMat = new THREE.PointsMaterial({
        color: 0x38bdf8,
        size: 0.02,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });
      const nebulaParticles = new THREE.Points(nebulaGeo, nebulaMat);
      holoSystemGroup.add(nebulaParticles);
      holoNebulaParticles = nebulaParticles;

      // 2. Translucent Holographic Grid Dome (Hemisphere from reference image)
      const domeGeo = new THREE.SphereGeometry(0.53, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const domeMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        wireframe: true,
        transparent: true,
        opacity: 0.24,
        blending: THREE.AdditiveBlending,
      });
      const domeMesh = new THREE.Mesh(domeGeo, domeMat);
      domeMesh.position.y = 0.025;
      holoSystemGroup.add(domeMesh);
      holoDomeMesh = domeMesh;

      // Inner Luminous Volumetric Shell
      const domeGlowMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide,
        roughness: 0.2,
      });
      const domeGlow = new THREE.Mesh(domeGeo, domeGlowMat);
      domeGlow.position.y = 0.025;
      holoSystemGroup.add(domeGlow);

      // 3. Central Autonomous Neural Core (The Glowing Sun/Brain)
      const coreSunGroup = new THREE.Group();
      coreSunGroup.position.set(0, 0.26, 0);

      const coreSunGeo = new THREE.SphereGeometry(0.065, 24, 24);
      const coreSunMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x00f0ff,
        emissiveIntensity: 3.5,
        roughness: 0.1,
      });
      const coreSunMesh = new THREE.Mesh(coreSunGeo, coreSunMat);
      coreSunGroup.add(coreSunMesh);
      holoCoreSun = coreSunMesh;

      // Shimmering Solar Corona Rings
      const coronaRing = new THREE.Mesh(
        new THREE.RingGeometry(0.075, 0.09, 32),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.7 })
      );
      coronaRing.rotation.x = Math.PI / 2;
      coreSunGroup.add(coronaRing);

      const pLight = new THREE.PointLight(0x00f0ff, 3.2, 4.8);
      coreSunGroup.add(pLight);
      holoCorePointLight = pLight;

      holoSystemGroup.add(coreSunGroup);

      registerInteractable(coreSunMesh, {
        id: "denver-holo-core",
        name: "3D HOLOGRAPHIC // DENVER NEURAL CORE",
        category: "AUTONOMOUS BRAIN",
        specs: "Central Hologram Engine · Local Ollama/Llama-3.2 · Zero Telemetry",
        role: "The central autonomous brain in the 3D hologram. Click to start the step-by-step 3D holographic project tour.",
        stationIdx: 0,
        actionLabel: "START 3D HOLOGRAM TOUR",
        chapterIdx: 0,
      });

      // 4. Four 3D Planetary Orbiting Architecture Nodes (Matching Orrery Planets)

      // NODE 1: Local Model Dispatch Engine (Ollama / Llama-3.2)
      const pivot1 = new THREE.Group();
      pivot1.position.y = 0.25;

      const track1 = new THREE.Mesh(
        new THREE.TorusGeometry(0.24, 0.0025, 8, 48),
        new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.45 })
      );
      track1.rotation.x = Math.PI / 2 + 0.28;
      pivot1.add(track1);

      const planet1 = new THREE.Mesh(
        new THREE.SphereGeometry(0.038, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0x0284c7, emissive: 0x00f0ff, emissiveIntensity: 1.8 })
      );
      planet1.position.set(0.24, 0.06, 0);
      pivot1.add(planet1);

      holoSystemGroup.add(pivot1);
      node1DispatchPivot = pivot1;

      registerInteractable(planet1, {
        id: "denver-node-dispatch",
        name: "ORBIT ALPHA // MODEL DISPATCH ENGINE",
        category: "NEURAL INFERENCE",
        specs: "Local Ollama Llama-3.2 (28 tok/s) · LM Studio · Groq · Gemini API",
        role: "Dispatches prompts to private local neural engines, bursting to cloud APIs only when complex reasoning is required.",
        stationIdx: 1,
        actionLabel: "INSPECT DISPATCH",
        chapterIdx: 1,
      });

      // NODE 2: SQLite Encrypted Memory Vault
      const pivot2 = new THREE.Group();
      pivot2.position.y = 0.28;

      const track2 = new THREE.Mesh(
        new THREE.TorusGeometry(0.36, 0.0025, 8, 48),
        new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.45 })
      );
      track2.rotation.x = Math.PI / 2 - 0.22;
      pivot2.add(track2);

      const planet2 = new THREE.Mesh(
        new THREE.SphereGeometry(0.034, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0x065f46, emissive: 0x10b981, emissiveIntensity: 1.8 })
      );
      planet2.position.set(-0.36, -0.05, 0);
      pivot2.add(planet2);

      // Orbiting Satellite / Moon (Vector Embeddings)
      const moon2 = new THREE.Mesh(
        new THREE.SphereGeometry(0.012, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0x6ee7b7 })
      );
      moon2.position.set(-0.41, -0.04, 0);
      pivot2.add(moon2);

      holoSystemGroup.add(pivot2);
      node2MemoryPivot = pivot2;

      registerInteractable(planet2, {
        id: "denver-node-memory",
        name: "ORBIT BETA // SQLITE MEMORY VAULT",
        category: "VECTOR PERSISTENCE",
        specs: "Tasks.db · Notes.db · Local FTS5 Vector Cache · Zero Cloud Sync",
        role: "Maintains local persistent state, semantic embeddings, and project history across developer restarts.",
        stationIdx: 2,
        actionLabel: "INSPECT MEMORY",
        chapterIdx: 2,
      });

      // NODE 3: Security & Gateway Protocol (Human-in-the-Loop)
      const pivot3 = new THREE.Group();
      pivot3.position.y = 0.26;

      const track3 = new THREE.Mesh(
        new THREE.TorusGeometry(0.46, 0.0025, 8, 48),
        new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.45 })
      );
      track3.rotation.x = Math.PI / 2 + 0.15;
      pivot3.add(track3);

      const planet3 = new THREE.Mesh(
        new THREE.SphereGeometry(0.036, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0x92400e, emissive: 0xf59e0b, emissiveIntensity: 1.8 })
      );
      planet3.position.set(0, 0.05, 0.46);
      pivot3.add(planet3);

      // Saturn-like Shield Ring around Node 3
      const ring3 = new THREE.Mesh(
        new THREE.RingGeometry(0.045, 0.06, 24),
        new THREE.MeshBasicMaterial({ color: 0xfbbf24, side: THREE.DoubleSide, transparent: true, opacity: 0.7 })
      );
      ring3.rotation.x = Math.PI / 2;
      ring3.position.set(0, 0.05, 0.46);
      pivot3.add(ring3);

      holoSystemGroup.add(pivot3);
      node3GatewayPivot = pivot3;

      registerInteractable(planet3, {
        id: "denver-node-gateway",
        name: "ORBIT GAMMA // HUMAN GATEWAY GUARD",
        category: "SECURITY CONTAINMENT",
        specs: "Strict Allow/Deny Sandbox · Cryptographic Action Hashing",
        role: "Prevents autonomous destructive writes. All shell scripts and file executions require explicit user approval.",
        stationIdx: 0,
        actionLabel: "INSPECT GATEWAY",
        chapterIdx: 3,
      });

      // 5. Floating 3D Telemetry Data Cards (Matching [FC-02], [R-5], [G-51] from Reference)
      const createHoloCardCanvas = (tag: string, title: string, stat1: string, stat2: string, col: string) => {
        const c = document.createElement("canvas");
        c.width = 320;
        c.height = 160;
        const ctx = c.getContext("2d");
        if (!ctx) return new THREE.CanvasTexture(c);

        ctx.fillStyle = "rgba(7, 13, 22, 0.85)";
        ctx.fillRect(0, 0, 320, 160);

        ctx.strokeStyle = col;
        ctx.lineWidth = 3;
        ctx.strokeRect(3, 3, 314, 154);

        // Header Tag
        ctx.fillStyle = col;
        ctx.font = "bold 18px monospace";
        ctx.fillText(`[ ${tag} ]`, 14, 28);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 15px monospace";
        ctx.fillText(title, 14, 58);

        ctx.fillStyle = "#94a3b8";
        ctx.font = "12px monospace";
        ctx.fillText(stat1, 14, 88);
        ctx.fillText(stat2, 14, 114);

        // Mini telemetry graph lines
        ctx.strokeStyle = col;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(14, 140);
        for (let x = 14; x < 300; x += 15) {
          ctx.lineTo(x, 140 - Math.random() * 14);
        }
        ctx.stroke();

        const tex = new THREE.CanvasTexture(c);
        return tex;
      };

      // Card 1: Node Dispatch
      const cardTex1 = createHoloCardCanvas("FC-01", "NEURAL DISPATCH", "• Ollama: Llama-3.2 (28 t/s)", "• 0ms Cloud Egress / Offline", "#00f0ff");
      const card1 = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.12), new THREE.MeshBasicMaterial({ map: cardTex1, side: THREE.DoubleSide, transparent: true, opacity: 0.9 }));
      card1.position.set(-0.32, 0.44, 0.05);
      card1.rotation.y = 0.25;
      holoSystemGroup.add(card1);
      node1CardMesh = card1;

      // Card 2: Memory Vault
      const cardTex2 = createHoloCardCanvas("R-05", "SQLITE VAULT", "• Tasks.db & Notes.db Cache", "• FTS5 Vector Embeddings", "#10b981");
      const card2 = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.12), new THREE.MeshBasicMaterial({ map: cardTex2, side: THREE.DoubleSide, transparent: true, opacity: 0.9 }));
      card2.position.set(0.32, 0.46, -0.05);
      card2.rotation.y = -0.25;
      holoSystemGroup.add(card2);
      node2CardMesh = card2;

      // Card 3: Security Gate
      const cardTex3 = createHoloCardCanvas("G-51", "SECURITY GATEWAY", "• Human-in-the-Loop Barrier", "• Sandboxed Action Auditing", "#f59e0b");
      const card3 = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.12), new THREE.MeshBasicMaterial({ map: cardTex3, side: THREE.DoubleSide, transparent: true, opacity: 0.9 }));
      card3.position.set(0.0, 0.52, 0.22);
      holoSystemGroup.add(card3);
      node3CardMesh = card3;

      deskGroup.add(holoSystemGroup);
      holoBaseGroupRef = holoSystemGroup;

      // Peripherals on Tabletop
      const keyboard = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.022, 0.19),
        new THREE.MeshStandardMaterial({ color: 0x1e2430, roughness: 0.45, metalness: 0.35 })
      );
      keyboard.position.set(-0.1, 1.006, 0.36);
      keyboard.castShadow = true;
      deskGroup.add(keyboard);

      const mouse = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.035, 0.13),
        new THREE.MeshStandardMaterial({ color: 0x1f232d, roughness: 0.4 })
      );
      mouse.position.set(0.34, 1.008, 0.36);
      mouse.castShadow = true;
      deskGroup.add(mouse);

      // Desktop Audio DAC
      const audioDac = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.06, 0.16),
        new THREE.MeshStandardMaterial({ color: 0x242832, metalness: 0.85, roughness: 0.25 })
      );
      audioDac.position.set(-0.75, 1.02, 0.22);
      audioDac.castShadow = true;
      deskGroup.add(audioDac);

      const volumeKnob = new THREE.Mesh(
        new THREE.CylinderGeometry(0.022, 0.022, 0.025, 16),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95, roughness: 0.1 })
      );
      volumeKnob.position.set(-0.75, 1.055, 0.22);
      deskGroup.add(volumeKnob);

      // Ceramic Mug
      const mug = new THREE.Mesh(
        new THREE.CylinderGeometry(0.038, 0.035, 0.09, 16),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3, metalness: 0.1 })
      );
      mug.position.set(0.72, 1.035, 0.32);
      mug.castShadow = true;
      deskGroup.add(mug);

      // Studio Boom Mic
      const boomArm = new THREE.Group();
      const micPole1 = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.42, 8), legMat);
      micPole1.position.set(-0.68, 1.16, -0.1);
      micPole1.rotation.z = -0.38;
      boomArm.add(micPole1);

      const micCapsule = new THREE.Mesh(
        new THREE.CylinderGeometry(0.028, 0.028, 0.12, 16),
        new THREE.MeshStandardMaterial({ color: 0x222630, metalness: 0.82, roughness: 0.2 })
      );
      micCapsule.position.set(-0.42, 1.4, 0.16);
      micCapsule.rotation.z = 0.52;
      micCapsule.castShadow = true;
      boomArm.add(micCapsule);

      const micRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.032, 0.005, 12, 24),
        new THREE.MeshBasicMaterial({ color: 0x10b981 })
      );
      micRing.position.set(-0.42, 1.46, 0.16);
      micRing.rotation.x = Math.PI / 2;
      boomArm.add(micRing);

      deskGroup.add(boomArm);
      registerInteractable(micCapsule, {
        id: "adenver-mic",
        name: "BROADCAST BOOM MICROPHONE",
        category: "VOICE CHAT INTERFACE",
        specs: "Cardioid Condenser · Suspension Shockmount · Hardware Mute Ring",
        role: "Hands-free natural speech interface streaming audio directly to local speech-to-text whisper daemons.",
        stationIdx: 2,
        actionLabel: "INSPECT AUDIO CHAIN",
      });

      // 3-Bay Desktop SQLite Memory Vault
      const vaultGroup = new THREE.Group();
      const vaultEnclosure = new THREE.Mesh(
        new THREE.BoxGeometry(0.26, 0.18, 0.34),
        new THREE.MeshStandardMaterial({ color: 0x181c24, metalness: 0.88, roughness: 0.2 })
      );
      vaultEnclosure.position.set(0.88, 1.08, 0.05);
      vaultEnclosure.castShadow = true;
      vaultGroup.add(vaultEnclosure);

      for (let b = 0; b < 3; b++) {
        const slot = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.028, 0.01), new THREE.MeshStandardMaterial({ color: 0x090b0e }));
        slot.position.set(0.88, 1.13 - b * 0.048, 0.221);
        vaultGroup.add(slot);

        const bayLed = new THREE.Mesh(new THREE.SphereGeometry(0.007, 8, 8), new THREE.MeshBasicMaterial({ color: 0x10b981 }));
        bayLed.position.set(0.96, 1.13 - b * 0.048, 0.223);
        vaultGroup.add(bayLed);
      }
      deskGroup.add(vaultGroup);
      registerInteractable(vaultEnclosure, {
        id: "adenver-vault",
        name: "SQLITE 3-BAY MEMORY VAULT",
        category: "PERSISTENT EMBEDDINGS",
        specs: "Hot-Swap NVMe Trays · SQLite FTS5 · Local Vector Embeddings Cache",
        role: "Isolated encrypted storage containing memory tables (Tasks.db, Notes.db, Context.db) without external cloud sync.",
        stationIdx: 2,
        actionLabel: "VIEW MEMORY STRUCTURE",
      });

      // Provider Status LEDs along front bezel
      const providerLedGroup = new THREE.Group();
      const providers: Array<{ id: "ollama" | "lmstudio" | "groq" | "gemini"; col: number; x: number }> = [
        { id: "ollama", col: 0x00f0ff, x: -0.22 },
        { id: "lmstudio", col: 0x38bdf8, x: -0.07 },
        { id: "groq", col: 0xf59e0b, x: 0.08 },
        { id: "gemini", col: 0x10b981, x: 0.23 },
      ];
      providers.forEach((p) => {
        const isSelected = selectedProvider === p.id;
        const led = new THREE.Mesh(
          new THREE.CylinderGeometry(0.012, 0.012, 0.01, 16),
          new THREE.MeshBasicMaterial({ color: isSelected ? p.col : 0x334155 })
        );
        led.position.set(p.x, 1.25, -0.23);
        led.rotation.x = Math.PI / 2;
        providerLedGroup.add(led);
      });
      deskGroup.add(providerLedGroup);

      scene.add(deskGroup);

      // Ergonomic Office Chair
      const chairGroup = new THREE.Group();
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5;
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.03, 0.04), legMat);
        leg.position.set(Math.cos(angle) * 0.22, 0.08, Math.sin(angle) * 0.22);
        leg.rotation.y = -angle;
        chairGroup.add(leg);
      }

      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 0.42, 16),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.1 })
      );
      stem.position.set(0, 0.25, 0);
      chairGroup.add(stem);

      const seat = new THREE.Mesh(
        new THREE.BoxGeometry(0.54, 0.075, 0.52),
        new THREE.MeshStandardMaterial({ color: 0x181a20, roughness: 0.85 })
      );
      seat.position.set(0, 0.48, 0);
      seat.castShadow = true;
      chairGroup.add(seat);

      const backrest = new THREE.Mesh(
        new THREE.BoxGeometry(0.48, 0.6, 0.04),
        new THREE.MeshStandardMaterial({ color: 0x1e222b, roughness: 0.9 })
      );
      backrest.position.set(0, 0.82, 0.24);
      backrest.rotation.x = 0.08;
      backrest.castShadow = true;
      chairGroup.add(backrest);

      chairGroup.position.set(0, 0, 0.92);
      scene.add(chairGroup);
      registerInteractable(seat, {
        id: "adenver-chair",
        name: "ERGONOMIC MESH TASK CHAIR",
        category: "STUDIO HARDWARE",
        specs: "3D Lumbar Support · Pneumatic Cylinder · 5-Star Caster Base",
        role: "Designed for focused extended development sessions during multi-agent pipeline orchestration.",
        stationIdx: 0,
        actionLabel: "OVERVIEW STUDIO",
      });
    }

    // ==============================================================
    // ROOM 2: SMART ICU MONITORING — RECOGNIZABLE HOSPITAL BAY
    // ==============================================================
    if (activeProjectId === "icu-monitoring") {
      // 1. Hygienic Polished Hospital Flooring & Patient Care Inlay
      const floorMat = new THREE.MeshStandardMaterial({
        color: 0x223038,
        roughness: 0.28,
        metalness: 0.12,
      });
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(12.0, 12.0), floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      scene.add(floor);

      // Contrast Sanitary Inlay Zone under Bed
      const inlayMat = new THREE.MeshStandardMaterial({
        color: 0x18242b,
        roughness: 0.35,
        metalness: 0.08,
      });
      const inlay = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 4.8), inlayMat);
      inlay.rotation.x = -Math.PI / 2;
      inlay.position.set(0, 0.002, 0.1);
      inlay.receiveShadow = true;
      scene.add(inlay);

      const floorGrid = new THREE.GridHelper(12.0, 24, 0x14b8a6, 0x1e353f);
      floorGrid.position.y = 0.003;
      scene.add(floorGrid);

      // 2. Hospital Architectural Walls (Back, Left, Right)
      const wallMat = new THREE.MeshStandardMaterial({
        color: 0x23323c,
        roughness: 0.65,
      });
      const backWall = new THREE.Mesh(new THREE.BoxGeometry(11.0, 5.0, 0.15), wallMat);
      backWall.position.set(0, 2.5, -3.9);
      backWall.receiveShadow = true;
      scene.add(backWall);

      const sideWallMat = new THREE.MeshStandardMaterial({
        color: 0x1e2b34,
        roughness: 0.7,
      });
      const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.15, 5.0, 8.5), sideWallMat);
      leftWall.position.set(-5.2, 2.5, 0.35);
      leftWall.receiveShadow = true;
      scene.add(leftWall);

      const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.15, 5.0, 8.5), sideWallMat);
      rightWall.position.set(5.2, 2.5, 0.35);
      rightWall.receiveShadow = true;
      scene.add(rightWall);

      // Hospital Wall Baseboard / Skirting
      const skirtingMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 });
      const backSkirting = new THREE.Mesh(new THREE.BoxGeometry(11.0, 0.16, 0.18), skirtingMat);
      backSkirting.position.set(0, 0.08, -3.88);
      scene.add(backSkirting);

      // Wall Protection Bumper Crash Rails (Prevents bed & equipment impact)
      const bumperMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
      const crashRail = new THREE.Mesh(new THREE.BoxGeometry(10.8, 0.12, 0.05), bumperMat);
      crashRail.position.set(0, 0.82, -3.81);
      scene.add(crashRail);

      const handrailMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.15 });
      const handrail = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 10.8, 16), handrailMat);
      handrail.rotation.z = Math.PI / 2;
      handrail.position.set(0, 1.15, -3.79);
      scene.add(handrail);

      // 3. Cleanroom Ceiling & 4x Recessed LED Troffer Light Fixtures
      const ceilingMat = new THREE.MeshStandardMaterial({ color: 0x1a252c, roughness: 0.8 });
      const ceiling = new THREE.Mesh(new THREE.BoxGeometry(11.0, 0.15, 8.5), ceilingMat);
      ceiling.position.set(0, 4.8, 0.35);
      scene.add(ceiling);

      const trofferBezelMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 });
      const trofferLightMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
      [
        [-1.6, -1.0],
        [1.6, -1.0],
        [-1.6, 1.8],
        [1.6, 1.8],
      ].forEach(([tx, tz]) => {
        const bezel = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.04, 0.8), trofferBezelMat);
        bezel.position.set(tx, 4.74, tz);
        scene.add(bezel);

        const diffuser = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.7), trofferLightMat);
        diffuser.rotation.x = Math.PI / 2;
        diffuser.position.set(tx, 4.71, tz);
        scene.add(diffuser);
      });

      // Dedicated Overhead Clinical Examination Light right above the patient bed
      const overheadExamLight = new THREE.PointLight(0xffffff, 2.6, 8.5);
      overheadExamLight.position.set(0, 3.8, 0);
      scene.add(overheadExamLight);

      // 4. Ceiling Privacy Curtain Track & Antimicrobial Cubicle Curtain
      const trackCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(2.4, 4.4, -3.6),
        new THREE.Vector3(2.4, 4.4, 1.2),
        new THREE.Vector3(2.4, 4.4, 2.5),
        new THREE.Vector3(3.8, 4.4, 2.5),
      ]);
      const trackMesh = new THREE.Mesh(
        new THREE.TubeGeometry(trackCurve, 32, 0.018, 8, false),
        handrailMat
      );
      scene.add(trackMesh);

      // Semi-drawn pleated hospital curtain in calming medical teal/sage
      const curtainMat = new THREE.MeshStandardMaterial({
        color: 0x1b434c,
        roughness: 0.85,
        side: THREE.DoubleSide,
      });
      for (let ci = 0; ci < 8; ci++) {
        const pleat = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.1, 12), curtainMat);
        pleat.position.set(2.4 + (ci % 2 === 0 ? 0.025 : -0.025), 2.85, 1.2 + ci * 0.16);
        scene.add(pleat);
      }

      // 5. Architectural Medical Headwall Console Unit
      const headwallMat = new THREE.MeshStandardMaterial({
        color: 0xd1d5db,
        metalness: 0.72,
        roughness: 0.25,
      });
      const headwall = new THREE.Mesh(new THREE.BoxGeometry(4.4, 1.15, 0.12), headwallMat);
      headwall.position.set(0, 1.95, -3.78);
      headwall.castShadow = true;
      scene.add(headwall);

      // Overbed Indirect Examination Luminaire Strip
      const overbedLightBar = new THREE.Mesh(
        new THREE.BoxGeometry(3.6, 0.05, 0.08),
        new THREE.MeshBasicMaterial({ color: 0xf1f5f9 })
      );
      overbedLightBar.position.set(0, 2.55, -3.74);
      scene.add(overbedLightBar);

      // Color-Coded Medical Gas Terminal Outlets (ISO / NFPA Medical Standard)
      // Green = O2, Yellow = Medical Air, White = Vacuum / Suction, Blue = Reserve
      const gasTerminalColors = [
        { col: 0x16a34a, label: "O2", x: -1.75 },
        { col: 0xeab308, label: "AIR", x: -1.35 },
        { col: 0xf8fafc, label: "VAC", x: -0.95 },
        { col: 0x2563eb, label: "N2O", x: -0.55 },
      ];
      gasTerminalColors.forEach(({ col, x }) => {
        // Outer chrome collar
        const collar = new THREE.Mesh(
          new THREE.CylinderGeometry(0.055, 0.055, 0.03, 16),
          handrailMat
        );
        collar.rotation.x = Math.PI / 2;
        collar.position.set(x, 1.95, -3.71);
        scene.add(collar);

        // Color-coded gas terminal face
        const terminal = new THREE.Mesh(
          new THREE.CylinderGeometry(0.042, 0.042, 0.035, 16),
          new THREE.MeshStandardMaterial({ color: col, metalness: 0.65, roughness: 0.3 })
        );
        terminal.rotation.x = Math.PI / 2;
        terminal.position.set(x, 1.95, -3.7);
        scene.add(terminal);
      });

      // Wall-Mounted Suction Canister Jar connected to Vacuum outlet
      const canisterMat = new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        transparent: true,
        opacity: 0.75,
        roughness: 0.18,
      });
      const suctionCanister = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.07, 0.28, 16), canisterMat);
      suctionCanister.position.set(-0.95, 1.58, -3.68);
      scene.add(suctionCanister);

      const canisterLid = new THREE.Mesh(
        new THREE.CylinderGeometry(0.082, 0.082, 0.04, 16),
        new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 })
      );
      canisterLid.position.set(-0.95, 1.74, -3.68);
      scene.add(canisterLid);

      // Red Emergency Hospital Electrical Outlets & Dual Sockets
      const emergencyOutletMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.35 });
      for (let ei = 0; ei < 4; ei++) {
        const emSocket = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.11, 0.02), emergencyOutletMat);
        emSocket.position.set(0.65 + ei * 0.14, 1.95, -3.71);
        scene.add(emSocket);
      }

      // Nurse Call & Code Blue Panel
      const nurseCallPanel = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.32, 0.025),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 })
      );
      nurseCallPanel.position.set(1.5, 1.95, -3.71);
      scene.add(nurseCallPanel);

      const codeBlueBtn = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 0.02, 16),
        new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.2 })
      );
      codeBlueBtn.rotation.x = Math.PI / 2;
      codeBlueBtn.position.set(1.5, 2.02, -3.69);
      scene.add(codeBlueBtn);

      // 6. High-Fidelity ICU Patient Bed (Articulated 30° Fowler Incline)
      const bedGroup = new THREE.Group();

      // Lower Chassis & Hydraulic Dual Lift Columns
      const frameMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.65, roughness: 0.3 });
      const lowerFrame = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.16, 2.38), frameMat);
      lowerFrame.position.set(0, 0.32, 0);
      lowerFrame.castShadow = true;
      bedGroup.add(lowerFrame);

      // Dual Telescopic Lift Columns
      const colMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.85, roughness: 0.2 });
      [-0.6, 0.6].forEach((cz) => {
        const liftCol = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.085, 0.3, 16), colMat);
        liftCol.position.set(0, 0.44, cz);
        liftCol.castShadow = true;
        bedGroup.add(liftCol);
      });

      // 4 Heavy-Duty Central Locking Twin-Wheel Hospital Casters
      const casterForkMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.88, roughness: 0.18 });
      const casterWheelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.4, roughness: 0.4 });
      [
        [-0.64, 0.12, -0.98],
        [0.64, 0.12, -0.98],
        [-0.64, 0.12, 0.98],
        [0.64, 0.12, 0.98],
      ].forEach(([wx, wy, wz]) => {
        const fork = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.14, 12), casterForkMat);
        fork.position.set(wx, wy + 0.05, wz);
        bedGroup.add(fork);

        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.105, 0.075, 16), casterWheelMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(wx, wy, wz);
        wheel.castShadow = true;
        bedGroup.add(wheel);
      });

      // Central Brake & Steer Locking Pedals (Red Brake, Green Steer)
      const brakePedal = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.035, 0.08),
        new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3 })
      );
      brakePedal.position.set(0.68, 0.15, 0);
      bedGroup.add(brakePedal);

      const steerPedal = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.035, 0.08),
        new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.3 })
      );
      steerPedal.position.set(-0.68, 0.15, 0);
      bedGroup.add(steerPedal);

      // Backup Chrome Oxygen Cylinder on lower frame shelf
      const underbedTank = new THREE.Mesh(
        new THREE.CylinderGeometry(0.065, 0.065, 0.85, 16),
        handrailMat
      );
      underbedTank.rotation.x = Math.PI / 2;
      underbedTank.position.set(0, 0.22, 0);
      bedGroup.add(underbedTank);

      // Upper Profiling Deck (Articulated Fowler Incline: Head Section angled 30°)
      const mattressMat = new THREE.MeshStandardMaterial({
        color: 0x164e63,
        roughness: 0.68,
      });

      // Flat Pelvis & Lower Body Section
      const lowerMattress = new THREE.Mesh(
        new THREE.BoxGeometry(1.36, 0.22, 1.28),
        mattressMat
      );
      lowerMattress.position.set(0, 0.64, 0.45);
      lowerMattress.castShadow = true;
      bedGroup.add(lowerMattress);

      // Folded Hospital Blanket in clean medical teal with turned-down white sheet cuff
      const blanketMat = new THREE.MeshStandardMaterial({
        color: 0x0e7490,
        roughness: 0.85,
      });
      const blanket = new THREE.Mesh(new THREE.BoxGeometry(1.38, 0.13, 1.2), blanketMat);
      blanket.position.set(0, 0.74, 0.5);
      blanket.castShadow = true;
      bedGroup.add(blanket);

      const sheetCuff = new THREE.Mesh(
        new THREE.BoxGeometry(1.38, 0.08, 0.14),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.9 })
      );
      sheetCuff.position.set(0, 0.77, -0.12);
      bedGroup.add(sheetCuff);

      // Inclined Head / Fowler Section (30° Angle)
      const headMattressGroup = new THREE.Group();
      headMattressGroup.position.set(0, 0.58, -0.18);
      headMattressGroup.rotation.x = 0.32; // ~20-30° Fowler incline

      const headMattress = new THREE.Mesh(
        new THREE.BoxGeometry(1.36, 0.22, 0.98),
        mattressMat
      );
      headMattress.position.set(0, 0.06, -0.45);
      headMattress.castShadow = true;
      headMattressGroup.add(headMattress);

      // Contoured Foam Hospital Pillow with anatomical head indent
      const pillowMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 });
      const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.13, 0.46), pillowMat);
      pillow.position.set(0, 0.2, -0.62);
      pillow.castShadow = true;
      headMattressGroup.add(pillow);

      bedGroup.add(headMattressGroup);

      // Molded ABS Medical Headboard & Footboard (Clean Light-Gray with Push Handles)
      const boardMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.38,
        metalness: 0.15,
      });
      const headboard = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.74, 0.09), boardMat);
      headboard.position.set(0, 0.88, -1.2);
      headboard.castShadow = true;
      bedGroup.add(headboard);

      // Push Grab Handles on Headboard
      const handleMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.3 });
      [-0.52, 0.52].forEach((hx) => {
        const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.28, 12), handleMat);
        grip.position.set(hx, 1.24, -1.2);
        bedGroup.add(grip);
      });

      const footboard = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.52, 0.09), boardMat);
      footboard.position.set(0, 0.76, 1.2);
      footboard.castShadow = true;
      bedGroup.add(footboard);

      // Clear Acrylic Patient Chart Holder on Footboard
      const chartHolder = new THREE.Mesh(
        new THREE.BoxGeometry(0.42, 0.3, 0.03),
        new THREE.MeshStandardMaterial({ color: 0xf1f5f9, transparent: true, opacity: 0.75 })
      );
      chartHolder.position.set(0, 0.76, 1.25);
      bedGroup.add(chartHolder);

      // 4x Split Foldable Safety Siderails with Angle Degree Gauge
      [-0.7, 0.7].forEach((rx) => {
        // Upper Head Siderail (Inclined with Backrest)
        const upperRailGroup = new THREE.Group();
        upperRailGroup.position.set(rx, 0.68, -0.18);
        upperRailGroup.rotation.x = 0.32;

        const topRailMesh = new THREE.Mesh(
          new THREE.CylinderGeometry(0.024, 0.024, 0.78, 16),
          handrailMat
        );
        topRailMesh.rotation.x = Math.PI / 2;
        topRailMesh.position.set(0, 0.28, -0.42);
        upperRailGroup.add(topRailMesh);

        for (let sp = -0.68; sp <= -0.16; sp += 0.18) {
          const spindle = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.26, 8), handrailMat);
          spindle.position.set(0, 0.15, sp);
          upperRailGroup.add(spindle);
        }
        bedGroup.add(upperRailGroup);

        // Lower Foot Siderail (Horizontal)
        const lowerRailTop = new THREE.Mesh(
          new THREE.CylinderGeometry(0.024, 0.024, 0.78, 16),
          handrailMat
        );
        lowerRailTop.rotation.x = Math.PI / 2;
        lowerRailTop.position.set(rx, 0.92, 0.55);
        bedGroup.add(lowerRailTop);

        for (let sp = 0.25; sp <= 0.85; sp += 0.2) {
          const spindle = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.26, 8), handrailMat);
          spindle.position.set(rx, 0.79, sp);
          bedGroup.add(spindle);
        }
      });

      scene.add(bedGroup);
      registerInteractable(lowerMattress, {
        id: "icu-bed",
        name: "CRITICAL CARE HOSPITAL BED",
        category: "PATIENT ENVIRONMENT",
        specs: "Articulating Profiling Deck · 30° Fowler Incline · Split Safety Rails",
        role: "Standard ICU care bay configured with split safety siderails, central locking casters, and emergency CPR quick-drop lever.",
        stationIdx: 0,
        actionLabel: "OVERVIEW ICU BAY",
      });

      // 7. Bedside Physiological Vitals Monitor Cart
      const cartGroup = new THREE.Group();

      // 5-Star Caster Mobile Base
      const monitorBaseY = 0.08;
      for (let bi = 0; bi < 5; bi++) {
        const rad = (bi * 2 * Math.PI) / 5;
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.04, 0.32), handrailMat);
        leg.position.set(1.15 + Math.sin(rad) * 0.18, monitorBaseY, 0.1 + Math.cos(rad) * 0.18);
        leg.rotation.y = rad;
        cartGroup.add(leg);

        const miniCaster = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.025, 12), casterWheelMat);
        miniCaster.rotation.z = Math.PI / 2;
        miniCaster.position.set(1.15 + Math.sin(rad) * 0.34, monitorBaseY - 0.02, 0.1 + Math.cos(rad) * 0.34);
        cartGroup.add(miniCaster);
      }

      // Aluminum Support Mast & Articulated Dual-Pivot Arm
      const cartPole = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 1.48, 16), handrailMat);
      cartPole.position.set(1.15, 0.78, 0.1);
      cartPole.castShadow = true;
      cartGroup.add(cartPole);

      // Lower Accessory Stainless Utility Tray
      const basket = new THREE.Mesh(
        new THREE.BoxGeometry(0.38, 0.18, 0.26),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.22 })
      );
      basket.position.set(1.15, 0.65, 0.1);
      cartGroup.add(basket);

      // 19" Medical Monitor Enclosure (Anti-Microbial Medical Off-White Housing)
      const monitorEnclosure = new THREE.Mesh(
        new THREE.BoxGeometry(0.78, 0.54, 0.09),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35, metalness: 0.15 })
      );
      monitorEnclosure.position.set(1.05, 1.48, 0.1);
      monitorEnclosure.rotation.y = -0.45;
      monitorEnclosure.castShadow = true;
      cartGroup.add(monitorEnclosure);

      // Front Display Dark Bezel
      const screenBezel = new THREE.Mesh(
        new THREE.PlaneGeometry(0.74, 0.5),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 })
      );
      screenBezel.position.set(1.031, 1.48, 0.144);
      screenBezel.rotation.y = -0.45;
      cartGroup.add(screenBezel);

      // Rotary Navigation Dial ("Trim Knob") on front bezel
      const trimKnob = new THREE.Mesh(
        new THREE.CylinderGeometry(0.026, 0.026, 0.02, 16),
        new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.2 })
      );
      trimKnob.rotation.x = Math.PI / 2;
      trimKnob.position.set(1.28, 1.3, 0.26);
      cartGroup.add(trimKnob);

      // Silicone Alarm Lightbar across Top Edge
      const alarmBarMat = new THREE.MeshBasicMaterial({
        color: isCriticalAlert ? 0xef4444 : 0x14b8a6,
      });
      const alarmBar = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.04, 0.06), alarmBarMat);
      alarmBar.position.set(1.05, 1.76, 0.1);
      alarmBar.rotation.y = -0.45;
      cartGroup.add(alarmBar);

      // Emergency Strobe Point Light when Critical Alert is Active
      if (isCriticalAlert) {
        const alarmStrobeLight = new THREE.PointLight(0xef4444, 4.2, 5.5);
        alarmStrobeLight.position.set(1.05, 1.82, 0.1);
        cartGroup.add(alarmStrobeLight);
      }

      // Multi-Parameter Dynamic Canvas Screen
      monitorCanvas = document.createElement("canvas");
      monitorCanvas.width = 540;
      monitorCanvas.height = 360;
      monitorCtx = monitorCanvas.getContext("2d");
      dynamicTexture = new THREE.CanvasTexture(monitorCanvas);

      const monitorDisplay = new THREE.Mesh(
        new THREE.PlaneGeometry(0.71, 0.46),
        new THREE.MeshBasicMaterial({ map: dynamicTexture })
      );
      monitorDisplay.position.set(1.028, 1.48, 0.148);
      monitorDisplay.rotation.y = -0.45;
      cartGroup.add(monitorDisplay);

      // Patient Lead Cables Routed to Bed (ECG, SpO2, NIBP)
      const cableCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(1.05, 1.25, 0.1),
        new THREE.Vector3(0.95, 0.95, 0.25),
        new THREE.Vector3(0.72, 0.78, 0.15),
      ]);
      const cableMesh = new THREE.Mesh(
        new THREE.TubeGeometry(cableCurve, 20, 0.014, 8, false),
        new THREE.MeshStandardMaterial({ color: 0x14b8a6, roughness: 0.5 })
      );
      cartGroup.add(cableMesh);

      scene.add(cartGroup);

      registerInteractable(monitorEnclosure, {
        id: "icu-monitor",
        name: "BEDSIDE PHYSIOLOGICAL VITALS MONITOR",
        category: "CONTINUOUS TELEMETRY",
        specs: "19\" Medical Anti-Glare · Live Sweep ECG & Pleth · Automated Sepsis Classifier",
        role: "Live multi-parameter telemetry displaying simulated vital signs and real-time sepsis probability score. Click to simulate emergency alert.",
        stationIdx: 1,
        actionLabel: isCriticalAlert ? "RESET TO NORMAL" : "TRIGGER CRITICAL ALERT",
      });

      // 8. Intensive Care Mechanical Ventilator Cart
      const ventGroup = new THREE.Group();

      // Mobile Ventilator Trolley Base with Casters
      const ventBase = new THREE.Mesh(
        new THREE.BoxGeometry(0.58, 0.12, 0.52),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.3 })
      );
      ventBase.position.set(-1.28, 0.14, -0.45);
      ventBase.castShadow = true;
      ventGroup.add(ventBase);

      [-0.22, 0.22].forEach((vx) => {
        [-0.2, 0.2].forEach((vz) => {
          const vWheel = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.04, 12), casterWheelMat);
          vWheel.rotation.z = Math.PI / 2;
          vWheel.position.set(-1.28 + vx, 0.06, -0.45 + vz);
          ventGroup.add(vWheel);
        });
      });

      // Modern Ventilator Casing (Clean Medical White & Slate)
      const ventBody = new THREE.Mesh(
        new THREE.BoxGeometry(0.54, 1.08, 0.46),
        new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.3, roughness: 0.35 })
      );
      ventBody.position.set(-1.28, 0.7, -0.45);
      ventBody.castShadow = true;
      ventGroup.add(ventBody);

      // Rear Gas Connections (Green O2 & Yellow Air Hoses to Headwall)
      const o2HoseCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.28, 0.8, -0.68),
        new THREE.Vector3(-1.45, 1.2, -2.2),
        new THREE.Vector3(-1.75, 1.95, -3.7),
      ]);
      const o2Hose = new THREE.Mesh(
        new THREE.TubeGeometry(o2HoseCurve, 24, 0.016, 8, false),
        new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.4 })
      );
      ventGroup.add(o2Hose);

      // Tilted 12" Ventilator Touchscreen Display
      const ventScreenGroup = new THREE.Group();
      ventScreenGroup.position.set(-1.28, 1.3, -0.42);
      ventScreenGroup.rotation.x = -0.22;

      const ventScreen = new THREE.Mesh(
        new THREE.BoxGeometry(0.48, 0.34, 0.04),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 })
      );
      ventScreenGroup.add(ventScreen);

      const ventDisplayFace = new THREE.Mesh(
        new THREE.PlaneGeometry(0.44, 0.3),
        new THREE.MeshBasicMaterial({ color: 0x0284c7 })
      );
      ventDisplayFace.position.set(0, 0, 0.022);
      ventScreenGroup.add(ventDisplayFace);
      ventGroup.add(ventScreenGroup);

      // Active Heated Humidifier Water Chamber
      const humidifierChamber = new THREE.Mesh(
        new THREE.CylinderGeometry(0.085, 0.085, 0.22, 16),
        new THREE.MeshStandardMaterial({
          color: 0x7dd3fc,
          transparent: true,
          opacity: 0.65,
          roughness: 0.15,
        })
      );
      humidifierChamber.position.set(-1.06, 0.82, -0.25);
      ventGroup.add(humidifierChamber);

      const heaterBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.092, 0.092, 0.05, 16),
        new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.6 })
      );
      heaterBase.position.set(-1.06, 0.7, -0.25);
      ventGroup.add(heaterBase);

      // Articulated Circuit Support Arm & Dual Corrugated Silicone Tubes
      const tubeSupportArm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, 0.72, 12),
        handrailMat
      );
      tubeSupportArm.rotation.z = -Math.PI / 4;
      tubeSupportArm.position.set(-1.02, 1.05, -0.32);
      ventGroup.add(tubeSupportArm);

      // Blue Inspiratory Corrugated Tube
      const tubeCurve1 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.06, 0.92, -0.25),
        new THREE.Vector3(-0.88, 1.12, -0.45),
        new THREE.Vector3(-0.55, 0.94, -0.72),
      ]);
      const tubeMesh1 = new THREE.Mesh(
        new THREE.TubeGeometry(tubeCurve1, 32, 0.024, 8, false),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.35, transparent: true, opacity: 0.88 })
      );
      ventGroup.add(tubeMesh1);

      // White Expiratory Corrugated Tube
      const tubeCurve2 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.22, 0.86, -0.25),
        new THREE.Vector3(-0.92, 1.05, -0.5),
        new THREE.Vector3(-0.55, 0.9, -0.76),
      ]);
      const tubeMesh2 = new THREE.Mesh(
        new THREE.TubeGeometry(tubeCurve2, 32, 0.022, 8, false),
        new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.45, transparent: true, opacity: 0.88 })
      );
      ventGroup.add(tubeMesh2);

      // Patient Y-Piece Connector
      const yPiece = new THREE.Mesh(
        new THREE.CylinderGeometry(0.028, 0.028, 0.09, 12),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, transparent: true, opacity: 0.9 })
      );
      yPiece.position.set(-0.54, 0.92, -0.74);
      ventGroup.add(yPiece);

      scene.add(ventGroup);

      registerInteractable(ventBody, {
        id: "icu-vent",
        name: "INTENSIVE CARE MECHANICAL VENTILATOR",
        category: "RESPIRATORY LIFE SUPPORT",
        specs: "Active Heated Humidifier · Dual Corrugated Circuit · Tidal Volume Control",
        role: "Maintains mechanical ventilation support with closed-loop pressure and flow monitoring (Simulated prototype setup).",
        stationIdx: 2,
        actionLabel: "INSPECT VENTILATOR",
      });

      // 9. Volumetric Dual-Channel IV Infusion Pump Stand
      const ivGroup = new THREE.Group();

      // 5-Star Chrome Wheeled Base
      const ivBaseY = 0.08;
      for (let ii = 0; ii < 5; ii++) {
        const rad = (ii * 2 * Math.PI) / 5;
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.035, 0.3), handrailMat);
        leg.position.set(-1.18 + Math.sin(rad) * 0.16, ivBaseY, 0.85 + Math.cos(rad) * 0.16);
        leg.rotation.y = rad;
        ivGroup.add(leg);

        const miniCaster = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.02, 12), casterWheelMat);
        miniCaster.rotation.z = Math.PI / 2;
        miniCaster.position.set(-1.18 + Math.sin(rad) * 0.3, ivBaseY - 0.02, 0.85 + Math.cos(rad) * 0.3);
        ivGroup.add(miniCaster);
      }

      // Telescoping Chrome Pole
      const ivPole = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 2.18, 16), handrailMat);
      ivPole.position.set(-1.18, 1.1, 0.85);
      ivPole.castShadow = true;
      ivGroup.add(ivPole);

      // Top 4 Ram's Horn Hanger Hooks
      [-0.14, 0.14].forEach((hx) => {
        const hook = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 8, 16, Math.PI), handrailMat);
        hook.position.set(-1.18 + hx, 2.14, 0.85);
        hook.rotation.z = Math.PI / 2;
        ivGroup.add(hook);
      });

      // Dual Hanging IV Infusion Bags (1000 mL Saline & 250 mL Medication)
      const salineBagMat = new THREE.MeshStandardMaterial({
        color: 0xbae6fd,
        transparent: true,
        opacity: 0.72,
        roughness: 0.1,
      });
      const salineBag = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.32, 0.07), salineBagMat);
      salineBag.position.set(-1.28, 1.96, 0.85);
      ivGroup.add(salineBag);

      // Blue Infusion Port & Graduated Lines
      const salinePort = new THREE.Mesh(
        new THREE.CylinderGeometry(0.016, 0.016, 0.04, 12),
        new THREE.MeshStandardMaterial({ color: 0x0284c7 })
      );
      salinePort.position.set(-1.28, 1.78, 0.85);
      ivGroup.add(salinePort);

      // Clear Drip Chamber
      const dripChamber1 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, 0.07, 12),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, transparent: true, opacity: 0.7 })
      );
      dripChamber1.position.set(-1.28, 1.72, 0.85);
      ivGroup.add(dripChamber1);

      // Second Medicated Bag (250 mL Piggyback)
      const medBag = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.22, 0.06), salineBagMat);
      medBag.position.set(-1.08, 1.98, 0.85);
      ivGroup.add(medBag);

      const medAlertStripe = new THREE.Mesh(
        new THREE.BoxGeometry(0.142, 0.04, 0.062),
        new THREE.MeshBasicMaterial({ color: 0xf97316 })
      );
      medAlertStripe.position.set(-1.08, 2.02, 0.85);
      ivGroup.add(medAlertStripe);

      // Dual-Channel Digital Volumetric Infusion Pump Unit
      const pump = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 0.34, 0.18),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35, metalness: 0.15 })
      );
      pump.position.set(-1.18, 1.38, 0.85);
      pump.castShadow = true;
      ivGroup.add(pump);

      // Dual LCD Rate Displays on the Pump Unit
      [-0.06, 0.06].forEach((dx, pi) => {
        const pumpScreen = new THREE.Mesh(
          new THREE.PlaneGeometry(0.09, 0.06),
          new THREE.MeshBasicMaterial({ color: 0x0284c7 })
        );
        pumpScreen.position.set(-1.18 + dx, 1.44, 0.942);
        ivGroup.add(pumpScreen);

        // LED Indicator Status
        const runLed = new THREE.Mesh(
          new THREE.CylinderGeometry(0.008, 0.008, 0.01, 8),
          new THREE.MeshBasicMaterial({ color: 0x10b981 })
        );
        runLed.rotation.x = Math.PI / 2;
        runLed.position.set(-1.18 + dx, 1.38, 0.942);
        ivGroup.add(runLed);
      });

      // Clear IV Tubing Draping gracefully towards patient bed
      const ivTubeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.28, 1.68, 0.85),
        new THREE.Vector3(-1.18, 1.25, 0.85),
        new THREE.Vector3(-0.95, 0.95, 0.65),
        new THREE.Vector3(-0.68, 0.78, 0.45),
      ]);
      const ivTubeMesh = new THREE.Mesh(
        new THREE.TubeGeometry(ivTubeCurve, 24, 0.009, 8, false),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, transparent: true, opacity: 0.65 })
      );
      ivGroup.add(ivTubeMesh);

      scene.add(ivGroup);

      registerInteractable(pump, {
        id: "icu-iv",
        name: "VOLUMETRIC IV INFUSION PUMP & STAND",
        category: "FLUID THERAPY",
        specs: "Dual-Channel Infusion · 0.9% Normal Saline · Anti-Free-Flow Clamp",
        role: "Delivers precision intravenous fluid and vasopressor titration as part of standard critical care protocol.",
        stationIdx: 2,
        actionLabel: "INSPECT INFUSION",
      });
    }

    // ==============================================================
    // ROOM 3: ETS — AGRIBUSINESS WORKSHOP & FLEET OPERATIONS
    // ==============================================================
    if (activeProjectId === "ets-expense") {
      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(12.5, 12.5),
        new THREE.MeshStandardMaterial({ color: 0x1e1914, roughness: 0.78, metalness: 0.15 })
      );
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      scene.add(floor);

      const floorGrid = new THREE.GridHelper(12.5, 25, 0xf59e0b, 0x33261a);
      floorGrid.position.y = 0.001;
      scene.add(floorGrid);

      const backWall = new THREE.Mesh(
        new THREE.PlaneGeometry(12.5, 5.6),
        new THREE.MeshStandardMaterial({ color: 0x17130e, roughness: 0.9 })
      );
      backWall.position.set(0, 2.8, -4.6);
      backWall.receiveShadow = true;
      scene.add(backWall);

      const tractorGroup = new THREE.Group();
      const tractorGreen = new THREE.MeshStandardMaterial({ color: 0x15803d, metalness: 0.62, roughness: 0.32 });
      const tractorYellow = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.72, roughness: 0.28 });
      const tireRubber = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.92, metalness: 0.08 });

      const engineHood = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.78, 1.85), tractorGreen);
      engineHood.position.set(-1.6, 1.08, -0.6);
      engineHood.castShadow = true;
      tractorGroup.add(engineHood);

      const frontGrille = new THREE.Mesh(
        new THREE.BoxGeometry(0.85, 0.55, 0.05),
        new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.85 })
      );
      frontGrille.position.set(-1.6, 1.05, -1.53);
      tractorGroup.add(frontGrille);

      [-0.32, 0.32].forEach((dx) => {
        const headlight = new THREE.Mesh(
          new THREE.CylinderGeometry(0.06, 0.06, 0.04, 16),
          new THREE.MeshBasicMaterial({ color: 0xfef08a })
        );
        headlight.rotation.x = Math.PI / 2;
        headlight.position.set(-1.6 + dx, 1.25, -1.54);
        tractorGroup.add(headlight);
      });

      const exhaustStack = new THREE.Mesh(
        new THREE.CylinderGeometry(0.048, 0.048, 1.2, 16),
        new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.92, roughness: 0.18 })
      );
      exhaustStack.position.set(-1.25, 1.9, -0.9);
      exhaustStack.castShadow = true;
      tractorGroup.add(exhaustStack);

      // Operator Cab with Steel ROPS Frame & Tinted Glass Enclosure
      const cabGlass = new THREE.Mesh(
        new THREE.BoxGeometry(1.22, 1.34, 1.25),
        new THREE.MeshStandardMaterial({
          color: 0x0f172a,
          transparent: true,
          opacity: 0.45,
          roughness: 0.12,
          metalness: 0.85,
        })
      );
      cabGlass.position.set(-1.6, 1.82, 0.48);
      tractorGroup.add(cabGlass);

      // 4x Steel Cab ROPS Roll-Cage Uprights
      const pillarMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.45, metalness: 0.82 });
      [
        [-0.58, -0.58],
        [0.58, -0.58],
        [-0.58, 0.58],
        [0.58, 0.58],
      ].forEach(([px, pz]) => {
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 1.36, 12), pillarMat);
        pillar.position.set(-1.6 + px, 1.82, 0.48 + pz);
        pillar.castShadow = true;
        tractorGroup.add(pillar);
      });

      // Interior High-Back Driver Seat & Steering Column
      const seatMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.85 });
      const seatCushion = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.12, 0.46), seatMat);
      seatCushion.position.set(-1.6, 1.45, 0.5);
      tractorGroup.add(seatCushion);

      const seatBack = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.52, 0.1), seatMat);
      seatBack.position.set(-1.6, 1.72, 0.68);
      tractorGroup.add(seatBack);

      const steeringColumn = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.45, 8),
        new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.8 })
      );
      steeringColumn.rotation.x = -0.4;
      steeringColumn.position.set(-1.6, 1.55, 0.28);
      tractorGroup.add(steeringColumn);

      const steeringWheel = new THREE.Mesh(
        new THREE.TorusGeometry(0.14, 0.022, 8, 20),
        new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.6 })
      );
      steeringWheel.rotation.x = -0.4;
      steeringWheel.position.set(-1.6, 1.7, 0.22);
      tractorGroup.add(steeringWheel);

      const cabRoof = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.13, 1.45), tractorYellow);
      cabRoof.position.set(-1.6, 2.52, 0.5);
      cabRoof.castShadow = true;
      tractorGroup.add(cabRoof);

      const beaconLight = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.08, 16),
        new THREE.MeshBasicMaterial({ color: 0xf59e0b })
      );
      beaconLight.position.set(-1.6, 2.62, 0.5);
      tractorGroup.add(beaconLight);

      [-0.88, 0.88].forEach((offset) => {
        const rearTire = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.4, 24), tireRubber);
        rearTire.rotation.z = Math.PI / 2;
        rearTire.position.set(-1.6 + offset, 0.8, 0.6);
        rearTire.castShadow = true;
        tractorGroup.add(rearTire);

        const yellowRim = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.42), tractorYellow);
        yellowRim.rotation.z = Math.PI / 2;
        yellowRim.position.set(-1.6 + offset, 0.8, 0.6);
        tractorGroup.add(yellowRim);
      });

      [-0.68, 0.68].forEach((offset) => {
        const frontTire = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.25, 20), tireRubber);
        frontTire.rotation.z = Math.PI / 2;
        frontTire.position.set(-1.6 + offset, 0.45, -1.08);
        frontTire.castShadow = true;
        tractorGroup.add(frontTire);
      });

      scene.add(tractorGroup);
      registerInteractable(engineHood, {
        id: "ets-tractor",
        name: "AGRICULTURAL HARVESTING TRACTOR // COMBINE",
        category: "FLEET MACHINERY",
        specs: "High-Torque Turbo Diesel · Deep-Lug Drive Tires · ROPS Safety Cab",
        role: "Primary revenue-generating harvesting machinery. Operating diesel fuel and maintenance costs directly reconcile to the ETS ledger.",
        stationIdx: 1,
        actionLabel: "INSPECT HARVESTER",
      });

      const deskGroup = new THREE.Group();
      const deskTop = new THREE.Mesh(
        new THREE.BoxGeometry(2.15, 0.065, 1.08),
        new THREE.MeshStandardMaterial({ color: 0x3d2715, roughness: 0.68, metalness: 0.1 })
      );
      deskTop.position.set(1.4, 0.94, 0.1);
      deskTop.castShadow = true;
      deskTop.receiveShadow = true;
      deskGroup.add(deskTop);

      const deskLegMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.85 });
      [-0.92, 0.92].forEach((dx) => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.92, 0.88), deskLegMat);
        leg.position.set(1.4 + dx, 0.46, 0.1);
        leg.castShadow = true;
        deskGroup.add(leg);
      });

      const fileCabinet = new THREE.Mesh(
        new THREE.BoxGeometry(0.42, 0.68, 0.72),
        new THREE.MeshStandardMaterial({ color: 0x18202c, metalness: 0.75, roughness: 0.3 })
      );
      fileCabinet.position.set(2.0, 0.34, 0.1);
      fileCabinet.castShadow = true;
      deskGroup.add(fileCabinet);

      monitorCanvas = document.createElement("canvas");
      monitorCanvas.width = 660;
      monitorCanvas.height = 380;
      monitorCtx = monitorCanvas.getContext("2d");
      dynamicTexture = new THREE.CanvasTexture(monitorCanvas);

      const deskMonitor = new THREE.Mesh(
        new THREE.BoxGeometry(0.88, 0.54, 0.055),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.72 })
      );
      deskMonitor.position.set(1.4, 1.38, -0.05);
      deskMonitor.rotation.y = -0.15;
      deskMonitor.castShadow = true;
      deskGroup.add(deskMonitor);

      const monitorFace = new THREE.Mesh(
        new THREE.PlaneGeometry(0.84, 0.5),
        new THREE.MeshBasicMaterial({ map: dynamicTexture })
      );
      monitorFace.position.set(1.4, 1.38, -0.021);
      monitorFace.rotation.y = -0.15;
      deskGroup.add(monitorFace);
      scene.add(deskGroup);

      registerInteractable(deskMonitor, {
        id: "ets-desk",
        name: "ERP OPERATIONS & ACCOUNTS WORKSTATION",
        category: "FINANCIAL LEDGER",
        specs: "Django 5.0 · MySQL Database · Real-Time Profit & Expense Analytics",
        role: "Operations terminal calculating live income from harvesting contracts vs diesel and repairs. Click to filter ledger records.",
        stationIdx: 2,
        actionLabel: "CYCLE LEDGER FILTER",
      });

      const drumMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, metalness: 0.85, roughness: 0.25 });
      const fuelDrum = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.92, 24), drumMat);
      fuelDrum.position.set(-0.25, 0.46, -1.8);
      fuelDrum.castShadow = true;

      const rotaryPump = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.35, 12),
        new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.9 })
      );
      rotaryPump.position.set(-0.25, 1.05, -1.8);
      scene.add(rotaryPump);
      scene.add(fuelDrum);

      registerInteractable(fuelDrum, {
        id: "ets-fuel",
        name: "55-GALLON DIESEL FUEL DEPOT",
        category: "OPERATING EXPENDITURE",
        specs: "High-Sulfur Industrial Diesel · Manual Rotary Hand Pump",
        role: "Primary recurring machinery operating expense. Direct provenance for the ₹42,000 diesel fuel ledger entry.",
        stationIdx: 3,
        actionLabel: "SHOW FUEL EXPENSES",
      });

      const toolChest = new THREE.Mesh(
        new THREE.BoxGeometry(0.75, 0.9, 0.48),
        new THREE.MeshStandardMaterial({ color: 0xb91c1c, metalness: 0.78, roughness: 0.3 })
      );
      toolChest.position.set(2.4, 0.45, -1.8);
      toolChest.castShadow = true;
      scene.add(toolChest);

      registerInteractable(toolChest, {
        id: "ets-tools",
        name: "MECHANIC ROLL-CAB TOOL CHEST",
        category: "MAINTENANCE ASSETS",
        specs: "Heavy-Duty Workshop Cabinet · Spare Harvester Sickle Blades & Belts",
        role: "Maintenance depot supporting regular harvesting blade replacements and field repairs.",
        stationIdx: 3,
        actionLabel: "VIEW MAINTENANCE",
      });

      const mysqlGroup = new THREE.Group();
      for (let c = 0; c < 3; c++) {
        const disc = new THREE.Mesh(
          new THREE.CylinderGeometry(0.44, 0.44, 0.17, 24),
          new THREE.MeshStandardMaterial({ color: 0x332211, metalness: 0.92, roughness: 0.2 })
        );
        disc.position.y = 0.15 + c * 0.25;
        disc.castShadow = true;
        mysqlGroup.add(disc);

        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(0.45, 0.016, 12, 28),
          new THREE.MeshBasicMaterial({ color: 0xf59e0b })
        );
        ring.position.y = 0.15 + c * 0.25;
        ring.rotation.x = Math.PI / 2;
        mysqlGroup.add(ring);
      }
      mysqlGroup.position.set(0.65, 0, -2.5);
      scene.add(mysqlGroup);
    }

    // =============================================================
    // 4. MOUSE RAYCASTING & CLICK INTERACTION SYSTEM
    // =============================================================
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let downPos = { x: 0, y: 0, time: 0 };

    const onPointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const targetMeshes = interactables.map((item) => item.mesh);
      const intersects = raycaster.intersectObjects(targetMeshes, true);

      if (intersects.length > 0) {
        canvas.style.cursor = "pointer";
        let topObj: THREE.Object3D | null = intersects[0].object;
        while (topObj && !topObj.userData?.meta) {
          topObj = topObj.parent;
        }
        if (topObj && topObj.userData?.meta) {
          setInspectedObject(topObj.userData.meta);
        }
      } else {
        canvas.style.cursor = "grab";
      }
    };

    const onPointerDown = (e: MouseEvent) => {
      downPos = { x: e.clientX, y: e.clientY, time: Date.now() };
    };

    const onPointerUp = (e: MouseEvent) => {
      const dx = Math.abs(e.clientX - downPos.x);
      const dy = Math.abs(e.clientY - downPos.y);
      const dt = Date.now() - downPos.time;

      if (dx < 6 && dy < 6 && dt < 450) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const targetMeshes = interactables.map((item) => item.mesh);
        const intersects = raycaster.intersectObjects(targetMeshes, true);

        if (intersects.length > 0) {
          let topObj: THREE.Object3D | null = intersects[0].object;
          while (topObj && !topObj.userData?.meta) {
            topObj = topObj.parent;
          }
          if (topObj && topObj.userData?.meta) {
            const meta: InteractableObjectMeta = topObj.userData.meta;
            setInspectedObject(meta);

            // Direct object trigger shortcuts
            if (meta.id.startsWith("denver-")) {
              const chIdx = meta.chapterIdx !== undefined ? meta.chapterIdx : 0;
              activateDenver(chIdx);
            } else if (meta.id === "icu-monitor") {
              soundManager.playClick();
              setIsCriticalAlert((prev) => !prev);
              setCurrentStepIdx(meta.stationIdx);
              setIsPlaying(false);
              isFlyingRef.current = true;
            } else if (meta.id === "adenver-monitor") {
              soundManager.playClick();
              const providersList: Array<"ollama" | "lmstudio" | "groq" | "gemini"> = ["ollama", "lmstudio", "groq", "gemini"];
              setSelectedProvider((prev) => {
                const idx = providersList.indexOf(prev);
                return providersList[(idx + 1) % providersList.length];
              });
              setCurrentStepIdx(meta.stationIdx);
              setIsPlaying(false);
              isFlyingRef.current = true;
            } else if (meta.id === "ets-fuel") {
              soundManager.playClick();
              setEtsFilter("expense");
              setCurrentStepIdx(meta.stationIdx);
              setIsPlaying(false);
              isFlyingRef.current = true;
            } else if (meta.id === "ets-desk") {
              soundManager.playClick();
              setEtsFilter((prev) => (prev === "all" ? "income" : prev === "income" ? "expense" : "all"));
              setCurrentStepIdx(meta.stationIdx);
              setIsPlaying(false);
              isFlyingRef.current = true;
            } else {
              soundManager.playClick();
              setCurrentStepIdx(meta.stationIdx);
              setIsPlaying(false);
              isFlyingRef.current = true;
            }
          }
        }
      }
    };

    canvas.addEventListener("mousemove", onPointerMove);
    canvas.addEventListener("mousedown", onPointerDown);
    canvas.addEventListener("mouseup", onPointerUp);

    // -------------------------------------------------------------
    // RENDER ANIMATION TICKER
    // -------------------------------------------------------------
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let isRunning = true;

    const animate = () => {
      if (!isRunning) return;
      animationFrameId = requestAnimationFrame(animate);

      if (document.hidden) return;

      const time = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        particles.rotation.y = time * 0.02;
      }

      // ===========================================================
      // 3D SCI-FI HOLOGRAPHIC DOME & ORRERY ANIMATIONS
      // ===========================================================
      if (activeProjectId === "adenver-ai") {
        const isAwake = isDenverAwakeRef.current;
        const speed = isAwake ? 2.8 : 1.0;

        // Swirling Cyber Base Dial
        if (holoDialOuterRing) {
          holoDialOuterRing.rotation.z -= 0.006 * speed;
        }

        // Swirling Nebula Galaxy Disc
        if (holoNebulaParticles) {
          holoNebulaParticles.rotation.y = time * 0.25 * speed;
        }

        // Rotating Holographic Grid Dome
        if (holoDomeMesh) {
          holoDomeMesh.rotation.y = time * 0.05 * speed;
          (holoDomeMesh.material as THREE.MeshBasicMaterial).opacity = isAwake
            ? 0.36 + Math.sin(time * 4) * 0.08
            : 0.22;
        }

        // Pulsing Central Autonomous Core
        if (holoCoreSun && holoCorePointLight) {
          const corePulse = isAwake
            ? 3.8 + Math.sin(time * 6) * 1.6
            : 2.2 + Math.sin(time * 2) * 0.6;
          (holoCoreSun.material as THREE.MeshStandardMaterial).emissiveIntensity = corePulse;
          holoCorePointLight.intensity = corePulse * 1.2;
        }

        // Revolving 3D Planetary Architecture Nodes
        if (node1DispatchPivot) node1DispatchPivot.rotation.y = time * 0.45 * speed;
        if (node2MemoryPivot) node2MemoryPivot.rotation.y = -time * 0.32 * speed;
        if (node3GatewayPivot) node3GatewayPivot.rotation.y = time * 0.22 * speed;

        // Floating 3D HUD Telemetry Cards gentle bobbing
        if (node1CardMesh) node1CardMesh.position.y = 0.44 + Math.sin(time * 2 + 1) * 0.015;
        if (node2CardMesh) node2CardMesh.position.y = 0.46 + Math.sin(time * 2 + 2) * 0.015;
        if (node3CardMesh) node3CardMesh.position.y = 0.52 + Math.sin(time * 2 + 3) * 0.015;
      }

      // ===========================================================
      // CONTINUOUS AUTOMATIC CINEMATIC CAMERA SYSTEM
      // ===========================================================
      if (isPlaying && !isUserInteractingRef.current) {
        if (prefersReducedMotion) {
          camera.position.set(0, 2.5, 4.2);
          controls.target.set(0, 1.25, 0);
        } else if (isDenverAwakeRef.current) {
          // Push in smoothly on 3D Holographic Dome when Adenver AI is explaining
          const targetPush = new THREE.Vector3(0, 1.62, 1.65);
          const targetLook = new THREE.Vector3(0, 1.30, 0.15);
          camera.position.lerp(targetPush, 0.04);
          controls.target.lerp(targetLook, 0.045);
          if (camera.fov !== 42) {
            camera.fov = THREE.MathUtils.lerp(camera.fov, 42, 0.04);
            camera.updateProjectionMatrix();
          }
        } else {
          // Smooth continuous cinematic orbital flythrough per room
          if (activeProjectId === "adenver-ai") {
            // Elegant 360° orbital sweep around the workstation & glowing holographic dome
            const orbitSpeed = 0.14;
            const t = time * orbitSpeed;
            const radius = 3.65 + Math.sin(t * 1.4) * 0.45;
            const camX = Math.sin(t) * radius;
            const camZ = Math.cos(t) * radius;
            const camY = 2.15 + Math.sin(t * 1.7) * 0.35;

            camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.04);
            controls.target.lerp(new THREE.Vector3(0, 1.28 + Math.sin(t * 1.1) * 0.07, 0.1), 0.045);
          } else if (activeProjectId === "icu-monitoring") {
            // Reverent clinical jib arc sweep across bed, headwall and bedside telemetry cart
            const orbitSpeed = 0.11;
            const t = time * orbitSpeed;
            const arcAngle = Math.sin(t) * 0.82; // smooth back-and-forth ~95° sweeping arc
            const radius = 3.7 + Math.cos(t * 1.3) * 0.35;
            const camX = Math.sin(arcAngle) * radius;
            const camZ = Math.cos(arcAngle) * radius + 0.35;
            const camY = 1.9 + Math.sin(t * 1.5) * 0.28;

            camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.04);
            controls.target.lerp(new THREE.Vector3(0, 1.14, 0), 0.045);
          } else {
            // ETS Expense: Grand agribusiness hangar sweep from harvesting tractor to ERP ledger desk
            const orbitSpeed = 0.10;
            const t = time * orbitSpeed;
            const arcAngle = Math.sin(t) * 0.78; // sweeps across hangar
            const radius = 4.65 + Math.sin(t * 1.2) * 0.5;
            const camX = Math.sin(arcAngle) * radius - 0.2;
            const camZ = Math.cos(arcAngle) * radius + 0.25;
            const camY = 2.2 + Math.cos(t * 1.4) * 0.32;

            camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.04);
            controls.target.lerp(new THREE.Vector3(0, 1.12, 0), 0.045);
          }

          if (camera.fov !== 45) {
            camera.fov = THREE.MathUtils.lerp(camera.fov, 45, 0.04);
            camera.updateProjectionMatrix();
          }
        }
      }

      controls.update();

      // -----------------------------------------------------------
      // DYNAMIC SCREEN CANVAS DRAWING ROUTINES
      // -----------------------------------------------------------
      if (monitorCtx && dynamicTexture) {
        // A. ADENVER AI DYNAMIC MONITOR DISPLAY
        if (activeProjectId === "adenver-ai") {
          const w = 800;
          const h = 380;
          monitorCtx.fillStyle = "#070a0f";
          monitorCtx.fillRect(0, 0, w, h);

          monitorCtx.fillStyle = "#0d131d";
          monitorCtx.fillRect(0, 0, w, 46);
          monitorCtx.font = "bold 15px monospace";
          monitorCtx.fillStyle = isDenverAwakeRef.current ? "#38bdf8" : "#00f0ff";
          monitorCtx.fillText(
            isDenverAwakeRef.current
              ? "ADENVER AI // 3D HOLOGRAPHIC ORRERY ONLINE"
              : "ADENVER AI // PERSONAL ASSISTANT DAEMON",
            20,
            29
          );

          monitorCtx.font = "12px monospace";
          monitorCtx.fillStyle = isDenverAwakeRef.current ? "#38bdf8" : "#64748b";
          monitorCtx.fillText(
            isDenverAwakeRef.current ? "HOLOGRAPHIC DOME: 100% [PROJECTION ACTIVE]" : "v2.4-LOCAL · PYSIDE6 · ZERO TELEMETRY",
            440,
            29
          );

          monitorCtx.strokeStyle = "#1e293b";
          monitorCtx.strokeRect(20, 60, w - 40, 88);
          monitorCtx.fillStyle = "#0f172a";
          monitorCtx.fillRect(20, 60, w - 40, 88);

          const provColor =
            selectedProvider === "ollama"
              ? "#00f0ff"
              : selectedProvider === "lmstudio"
              ? "#38bdf8"
              : selectedProvider === "groq"
              ? "#f59e0b"
              : "#10b981";

          monitorCtx.font = "bold 18px monospace";
          monitorCtx.fillStyle = provColor;
          monitorCtx.fillText(`ACTIVE ROUTE: [${selectedProvider.toUpperCase()}]`, 35, 95);

          monitorCtx.font = "13px monospace";
          monitorCtx.fillStyle = "#94a3b8";
          if (selectedProvider === "ollama") {
            monitorCtx.fillText("Local Llama-3.2 daemon · 100% offline · 28 tok/s · 0ms egress", 35, 122);
          } else if (selectedProvider === "lmstudio") {
            monitorCtx.fillText("Local HTTP endpoint · Q4_K_M quant · Private local RAM inference", 35, 122);
          } else if (selectedProvider === "groq") {
            monitorCtx.fillText("Cloud Ultra-Low Latency Llama-3.3-70b · 280 tok/s · TLS Encrypted", 35, 122);
          } else {
            monitorCtx.fillText("Gemini 1.5 Flash API · Multimodal reasoning · 1M token context", 35, 122);
          }

          monitorCtx.fillStyle = "#0c1524";
          monitorCtx.fillRect(20, 160, 360, 82);
          monitorCtx.font = "bold 13px monospace";
          monitorCtx.fillStyle = "#38bdf8";
          monitorCtx.fillText("SQLITE MEMORY VAULT", 35, 185);
          monitorCtx.font = "11px monospace";
          monitorCtx.fillStyle = "#cbd5e1";
          monitorCtx.fillText("• Tasks.db: 24 active records indexed", 35, 208);
          monitorCtx.fillText("• Notes.db: 48 embeddings in local cache", 35, 226);

          monitorCtx.fillStyle =
            actionGateState === "approved"
              ? "#064e3b"
              : actionGateState === "blocked"
              ? "#7f1d1d"
              : "#18202f";
          monitorCtx.fillRect(395, 160, w - 415, 82);

          monitorCtx.font = "bold 13px monospace";
          monitorCtx.fillStyle =
            actionGateState === "approved"
              ? "#34d399"
              : actionGateState === "blocked"
              ? "#f87171"
              : "#fbbf24";
          monitorCtx.fillText(
            actionGateState === "approved"
              ? "GATEWAY: [APPROVED]"
              : actionGateState === "blocked"
              ? "GATEWAY: [ACTION BLOCKED]"
              : "GATEWAY: [ACTION PENDING]",
            410,
            185
          );

          monitorCtx.font = "11px monospace";
          monitorCtx.fillStyle = "#f1f5f9";
          monitorCtx.fillText(
            actionGateState === "approved"
              ? "✓ Permission verified · Audit log written (Demo)"
              : actionGateState === "blocked"
              ? "✕ Action denied by user · Aborted safely (Demo)"
              : "⚠ High-risk script execution requested (Demo)",
            410,
            212
          );

          monitorCtx.fillStyle = "#090d14";
          monitorCtx.fillRect(20, 256, w - 40, 102);
          monitorCtx.font = "12px monospace";
          monitorCtx.fillStyle = "#22d3ee";
          monitorCtx.fillText("> user: 'Analyze harvest logistics and update SQLite storage'", 35, 284);
          monitorCtx.fillStyle = "#94a3b8";
          monitorCtx.fillText("  adenver_core: intent recognized -> dispatched to " + selectedProvider, 35, 308);
          monitorCtx.fillText("  status: streaming response tokens -> validation check passed", 35, 332);

          dynamicTexture.needsUpdate = true;
        }

        // B. SMART ICU DYNAMIC MONITOR DISPLAY
        if (activeProjectId === "icu-monitoring") {
          ecgTime += isCriticalAlert ? 5.2 : 2.6;
          const w = 540;
          const h = 360;
          monitorCtx.fillStyle = isCriticalAlert ? "#1a0808" : "#070c0e";
          monitorCtx.fillRect(0, 0, w, h);

          monitorCtx.strokeStyle = isCriticalAlert ? "#331111" : "#102026";
          monitorCtx.lineWidth = 1;
          for (let x = 0; x < w; x += 32) {
            monitorCtx.beginPath();
            monitorCtx.moveTo(x, 0);
            monitorCtx.lineTo(x, h);
            monitorCtx.stroke();
          }
          for (let y = 0; y < h; y += 32) {
            monitorCtx.beginPath();
            monitorCtx.moveTo(0, y);
            monitorCtx.lineTo(w, y);
            monitorCtx.stroke();
          }

          monitorCtx.font = "bold 15px monospace";
          monitorCtx.fillStyle = isCriticalAlert ? "#ef4444" : "#14b8a6";
          monitorCtx.fillText("BED 04 // ICU TELEMETRY", 20, 32);

          monitorCtx.font = "bold 11px monospace";
          monitorCtx.fillStyle = isCriticalAlert ? "#fca5a5" : "#2dd4bf";
          monitorCtx.fillText(
            isCriticalAlert ? "ALERT: CRITICAL SEPSIS SPIKE [0.84]" : "SEPSIS RISK: 0.14 [STABLE]",
            255,
            32
          );

          monitorCtx.font = "10px monospace";
          monitorCtx.fillStyle = "#94a3b8";
          monitorCtx.fillText("DEMO DATA · NOT CLINICALLY VALIDATED", 20, 54);

          monitorCtx.strokeStyle = isCriticalAlert ? "#ef4444" : "#10b981";
          monitorCtx.lineWidth = 3;
          monitorCtx.beginPath();
          for (let x = 0; x < w; x += 2) {
            const sweep = (x + ecgTime) % 180;
            let y = 120;
            if (sweep > 30 && sweep < 42) y -= 18;
            else if (sweep >= 42 && sweep < 54) y += isCriticalAlert ? 72 : 56;
            else if (sweep >= 54 && sweep < 68) y -= 38;
            else if (sweep >= 68 && sweep < 85) y += 10;
            monitorCtx.lineTo(x, y);
          }
          monitorCtx.stroke();

          monitorCtx.strokeStyle = isCriticalAlert ? "#f97316" : "#06b6d4";
          monitorCtx.lineWidth = 2.5;
          monitorCtx.beginPath();
          for (let x = 0; x < w; x += 2) {
            const pleth = (x + ecgTime * 0.8) % 120;
            const y = 205 + Math.sin(pleth * 0.08) * (isCriticalAlert ? 18 : 12);
            monitorCtx.lineTo(x, y);
          }
          monitorCtx.stroke();

          monitorCtx.fillStyle = isCriticalAlert ? "#ef4444" : "#10b981";
          monitorCtx.font = "bold 32px monospace";
          monitorCtx.fillText(isCriticalAlert ? "138" : "74", 25, 290);
          monitorCtx.font = "11px monospace";
          monitorCtx.fillText("HR (BPM)", 25, 312);

          monitorCtx.fillStyle = isCriticalAlert ? "#f97316" : "#06b6d4";
          monitorCtx.font = "bold 32px monospace";
          monitorCtx.fillText(isCriticalAlert ? "86%" : "98%", 150, 290);
          monitorCtx.font = "11px monospace";
          monitorCtx.fillText("SpO2", 150, 312);

          monitorCtx.fillStyle = isCriticalAlert ? "#ef4444" : "#f59e0b";
          monitorCtx.font = "bold 32px monospace";
          monitorCtx.fillText(isCriticalAlert ? "39.4" : "37.0", 275, 290);
          monitorCtx.font = "11px monospace";
          monitorCtx.fillText("TEMP (°C)", 275, 312);

          monitorCtx.fillStyle = "#e2e8f0";
          monitorCtx.font = "bold 26px monospace";
          monitorCtx.fillText(isCriticalAlert ? "88/54" : "120/80", 395, 290);
          monitorCtx.font = "11px monospace";
          monitorCtx.fillText("NIBP (mmHg)", 395, 312);

          dynamicTexture.needsUpdate = true;
        }

        // C. ETS EXPENSE DYNAMIC LEDGER DISPLAY
        if (activeProjectId === "ets-expense") {
          const w = 660;
          const h = 380;
          monitorCtx.fillStyle = "#0f0d0a";
          monitorCtx.fillRect(0, 0, w, h);

          monitorCtx.fillStyle = "#19140e";
          monitorCtx.fillRect(0, 0, w, 50);

          monitorCtx.font = "bold 15px monospace";
          monitorCtx.fillStyle = "#f59e0b";
          monitorCtx.fillText("SRI BASAVESHWARA HARVESTING & CO.", 20, 25);

          monitorCtx.font = "11px monospace";
          monitorCtx.fillStyle = "#64748b";
          monitorCtx.fillText("SAMPLE DATA · NOT ACTUAL COMPANY ACCOUNTS", 20, 43);

          monitorCtx.fillStyle = "#261d14";
          monitorCtx.fillRect(20, 58, w - 40, 34);
          monitorCtx.font = "bold 11px monospace";
          monitorCtx.fillStyle = "#f59e0b";
          monitorCtx.fillText(
            `FILTER: [${etsFilter.toUpperCase()}] · ${filteredEtsRecords.length} MATCHING RECORDS · ${etsFilterSubtotal.badgeLabel}: ${etsFilterSubtotal.amountFormatted}`,
            30,
            80
          );

          filteredEtsRecords.slice(0, 5).forEach((r, idx) => {
            monitorCtx!.fillStyle = idx % 2 === 0 ? "#17120c" : "#120e09";
            monitorCtx!.fillRect(20, 98 + idx * 35, w - 40, 31);

            monitorCtx!.font = "11px monospace";
            monitorCtx!.fillStyle = "#cbd5e1";
            monitorCtx!.fillText(`${r.date}  ${r.desc}`, 30, 119 + idx * 35);

            monitorCtx!.font = "bold 12px monospace";
            monitorCtx!.fillStyle = r.type === "income" ? "#10b981" : "#f43f5e";
            monitorCtx!.fillText(r.amount, 520, 119 + idx * 35);
          });

          monitorCtx.fillStyle = "#1f1811";
          monitorCtx.fillRect(20, 285, w - 40, 78);

          monitorCtx.font = "11px monospace";
          monitorCtx.fillStyle = "#94a3b8";
          monitorCtx.fillText(
            `OVERALL SEASONAL NET (ALL RECORDS): +₹${etsGlobalTotals.net.toLocaleString("en-IN")}  (Income: ₹${etsGlobalTotals.income.toLocaleString("en-IN")} | Costs: ₹${etsGlobalTotals.expense.toLocaleString("en-IN")})`,
            30,
            308
          );

          monitorCtx.font = "bold 13px monospace";
          monitorCtx.fillStyle = etsFilterSubtotal.color;
          monitorCtx.fillText(
            `${etsFilterSubtotal.label}: ${etsFilterSubtotal.amountFormatted}  (${etsFilterSubtotal.subtext})`,
            30,
            340
          );

          dynamicTexture.needsUpdate = true;
        }
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Reliable resumption: immediately resume rendering when visitor returns to tab
    const handleVisibilityChange = () => {
      if (!document.hidden && isRunning) {
        cancelAnimationFrame(animationFrameId);
        clock.start();
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      isRunning = false;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", onPointerMove);
      canvas.removeEventListener("mousedown", onPointerDown);
      canvas.removeEventListener("mouseup", onPointerUp);
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material?.dispose();
          }
        }
      });
      if (dynamicTexture) {
        dynamicTexture.dispose();
      }
      renderer.dispose();
    };
  }, [activeProjectId, isCriticalAlert, selectedProvider, actionGateState, etsFilter, filteredEtsRecords, etsFilterSubtotal, etsGlobalTotals, activateDenver]);

  // Handlers
  const handleSelectProvider = (provider: "ollama" | "lmstudio" | "groq" | "gemini") => {
    soundManager.playClick();
    setSelectedProvider(provider);
    setIsPlaying(false);
  };

  const handleGateAction = (action: "approved" | "blocked") => {
    soundManager.playSnap();
    setActionGateState(action);
    setIsPlaying(false);
  };

  const handleToggleCritical = () => {
    soundManager.playSnap();
    setIsCriticalAlert((prev) => !prev);
    setIsPlaying(false);
  };

  const handleFilterChange = (filter: "all" | "income" | "expense") => {
    soundManager.playClick();
    setEtsFilter(filter);
    setIsPlaying(false);
  };

  const currentChapter = ADENVER_CHAPTERS[denverChapterIdx];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[560px] bg-black rounded-2xl md:rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl flex flex-col justify-between select-none"
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* ============================================================== */}
      {/* TOP MINIMAL FLOATING HUD                                        */}
      {/* ============================================================== */}
      <div className="relative z-20 p-2.5 sm:p-4 flex items-center justify-between gap-2 pointer-events-none">
        {/* Left: Room Badge */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="px-3 py-1 rounded-full bg-black/85 backdrop-blur-md border border-zinc-800 font-mono text-xs text-white flex items-center gap-2 shadow-lg">
            <span
              className={`w-2 h-2 rounded-full ${
                activeProjectId === "adenver-ai"
                  ? isDenverAwake
                    ? "bg-cyan-400 animate-ping"
                    : "bg-cyan-400"
                  : activeProjectId === "icu-monitoring"
                  ? isCriticalAlert
                    ? "bg-red-500 animate-ping"
                    : "bg-teal-400"
                  : "bg-amber-400"
              }`}
            />
            <span className="font-bold tracking-wider">
              {activeProjectId === "adenver-ai"
                ? isDenverAwake
                  ? "ADENVER AI // 3D HOLOGRAPHIC DOME ONLINE"
                  : "ADENVER AI // WORKSTATION"
                : activeProjectId === "icu-monitoring"
                ? "SMART ICU // CRITICAL CARE"
                : "SRI BASAVESHWARA HARVESTING & CO."}
            </span>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          {/* Voice Trigger in Adenver AI */}
          {activeProjectId === "adenver-ai" && (
            <button
              onClick={startVoiceListener}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[11px] font-bold transition-all cursor-pointer shadow-lg backdrop-blur-md border ${
                isListening
                  ? "bg-red-500 text-white border-red-400 animate-pulse shadow-[0_0_18px_rgba(239,68,68,0.7)]"
                  : isDenverAwake
                  ? "bg-cyan-400 text-black border-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.6)]"
                  : "bg-cyan-950/80 border-cyan-800 text-cyan-300 hover:bg-cyan-900 hover:text-white"
              }`}
              title="Voice activate: say 'Hey Adenver' or click to awaken 3D hologram tour"
            >
              <Mic className={`w-3.5 h-3.5 ${isListening ? "animate-bounce" : ""}`} />
              <span className="hidden xs:inline">
                {isListening ? "LISTENING..." : isDenverAwake ? "HOLOGRAM ACTIVE" : "🎙️ HEY ADENVER"}
              </span>
            </button>
          )}

          {/* Details / Info Toggle Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              setIsInfoOpen((prev) => !prev);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-mono text-[11px] sm:text-xs transition-colors cursor-pointer shadow-lg backdrop-blur-md ${
              isInfoOpen
                ? "bg-white text-black border-white font-bold"
                : "bg-black/80 border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500"
            }`}
            title="Toggle Description Drawer"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{isInfoOpen ? "CLOSE" : "DETAILS"}</span>
            {isInfoOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {/* Automatic Cinematic Motion Toggle */}
          <button
            onClick={() => {
              soundManager.playClick();
              setIsPlaying((prev) => !prev);
            }}
            className={`px-3 py-1 rounded-full font-mono text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg backdrop-blur-md border ${
              isPlaying
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 hover:bg-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                : "bg-white/10 text-zinc-300 border-white/20 hover:bg-white/20"
            }`}
            title={isPlaying ? "Pause cinematic camera motion" : "Resume automatic cinematic camera"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="hidden sm:inline">{isPlaying ? "PAUSE" : "CINEMATIC"}</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3D HOLOGRAPHIC EXPLANATION HUD (WAKES ON "HEY ADENVER" OR CLICK) */}
      {/* ============================================================== */}
      {activeProjectId === "adenver-ai" && isDenverAwake && (
        <div className="relative z-30 mx-3 sm:mx-6 p-4 sm:p-5 rounded-2xl bg-black/92 backdrop-blur-2xl border border-cyan-400/60 shadow-[0_0_35px_rgba(6,182,212,0.3)] max-w-xl transition-all animate-in fade-in zoom-in-95 duration-250 pointer-events-auto">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-900/60">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
              <div>
                <span className="font-mono text-xs font-bold text-cyan-300 tracking-wider block">
                  3D HOLOGRAPHIC PROJECTION // ADENVER AI ARCHITECTURE
                </span>
                <span className="font-mono text-[10px] text-zinc-400 uppercase">
                  NODE {currentChapter.id} / 04 : {currentChapter.subtitle}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Sound Voice Mute Toggle */}
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsSpeechMuted((prev) => {
                    if (!prev && typeof window !== "undefined" && "speechSynthesis" in window) {
                      window.speechSynthesis.cancel();
                    }
                    return !prev;
                  });
                }}
                className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
                title={isSpeechMuted ? "Unmute Voice" : "Mute Voice"}
              >
                {isSpeechMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
              </button>

              <button
                onClick={dismissDenver}
                className="text-zinc-400 hover:text-white font-mono text-xs px-1 cursor-pointer"
                title="Dismiss Holographic HUD"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Equalizer Visualizer */}
          <div className="flex items-center gap-1 my-2 py-1 px-2.5 rounded-lg bg-cyan-950/40 border border-cyan-900/40">
            <div className="flex items-center gap-0.5 h-3">
              {[40, 90, 60, 100, 75, 45, 85, 30, 95, 70, 50].map((h, i) => (
                <span
                  key={i}
                  style={{ height: `${h}%` }}
                  className="w-1 bg-cyan-400 rounded-full animate-pulse"
                />
              ))}
            </div>
            <span className="font-mono text-[10px] text-cyan-300 uppercase tracking-widest pl-2">
              HOLOGRAPHIC DOME ACTIVE · LIVE 3D ORRERY TELEMETRY
            </span>
          </div>

          {/* Chapter Content */}
          <div className="my-2.5">
            <h4 className="font-mono text-sm font-bold text-white tracking-wide mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentChapter.color }} />
              {currentChapter.title}
            </h4>

            <p className="font-mono text-xs text-cyan-100/90 leading-relaxed italic mb-2.5 p-2 rounded bg-cyan-950/30 border border-cyan-800/40">
              "{currentChapter.speechText}"
            </p>

            <ul className="space-y-1 my-2">
              {currentChapter.bullets.map((b, idx) => (
                <li key={idx} className="font-mono text-[11px] text-zinc-300 flex items-start gap-1.5">
                  <span className="text-cyan-400 mt-0.5">▸</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer Controls & Next Chapter */}
          <div className="flex items-center justify-between pt-2 border-t border-cyan-900/60 text-[10px] font-mono">
            <span className="text-zinc-400">{currentChapter.specs}</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevDenverChapter}
                className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
              >
                PREV
              </button>
              <button
                onClick={handleNextDenverChapter}
                className="px-3 py-1 rounded bg-cyan-400 text-black font-bold hover:bg-cyan-300 transition-colors cursor-pointer flex items-center gap-1 shadow-[0_0_12px_rgba(34,211,238,0.5)]"
              >
                <span>NEXT NODE</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3D OBJECT INSPECTOR HUD CARD (Hover / Click Feedback)          */}
      {/* ============================================================== */}
      {inspectedObject && !isDenverAwake && (
        <div className="relative z-30 mx-3 sm:mx-6 p-3 sm:p-3.5 rounded-2xl bg-black/90 backdrop-blur-xl border border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.15)] max-w-md transition-all animate-in fade-in slide-in-from-top-2 duration-150 pointer-events-auto">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Crosshair className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="font-mono text-[11px] font-bold text-white tracking-wider">
                {inspectedObject.name}
              </span>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-wider text-cyan-400 bg-cyan-950/70 border border-cyan-900/70 px-2 py-0.5 rounded-full font-bold">
              {inspectedObject.category}
            </span>
          </div>

          <p className="font-mono text-[10px] text-zinc-300 leading-snug mb-2">
            {inspectedObject.role}
          </p>

          <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-zinc-900">
            <span className="font-mono text-[9px] text-zinc-400 truncate max-w-[220px]">
              {inspectedObject.specs}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  soundManager.playClick();
                  if (inspectedObject.id.startsWith("denver-")) {
                    activateDenver(inspectedObject.chapterIdx || 0);
                  } else {
                    setCurrentStepIdx(inspectedObject.stationIdx);
                    setIsPlaying(false);
                    isFlyingRef.current = true;
                  }
                }}
                className="px-2 py-0.5 rounded bg-cyan-400 text-black font-mono text-[10px] font-bold hover:bg-cyan-300 transition-colors cursor-pointer"
              >
                {inspectedObject.id.startsWith("denver-") ? "EXPLORE" : "FOCUS 3D"}
              </button>
              <button
                onClick={() => setInspectedObject(null)}
                className="text-zinc-400 hover:text-zinc-200 font-mono text-[10px] px-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* COLLAPSIBLE DETAILS DRAWER                                      */}
      {/* ============================================================== */}
      {isInfoOpen && (
        <div className="relative z-30 mx-3 sm:mx-6 p-3.5 sm:p-4 rounded-2xl bg-black/92 backdrop-blur-2xl border border-zinc-700 shadow-2xl max-w-lg transition-all animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800">
            <div>
              <span className="font-mono text-xs font-bold text-white tracking-wider block">
                {currentWaypoint.stageTitle}
              </span>
              <span className="font-mono text-[10px] text-zinc-400 uppercase italic">
                {currentWaypoint.subtitle}
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-950/70 border border-emerald-900/70 px-2 py-0.5 rounded-full font-bold">
              {currentWaypoint.badge}
            </span>
          </div>

          <p className="font-mono text-xs text-zinc-300 leading-relaxed mb-2.5">
            {currentWaypoint.description}
          </p>

          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-2 border-t border-zinc-900">
            <span>STYLIZED PROCEDURAL 3D MESHES · 3D HOLOGRAPHIC PROJECTION</span>
            <button
              onClick={() => setIsInfoOpen(false)}
              className="text-zinc-400 hover:text-white underline cursor-pointer"
            >
              HIDE DETAILS
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* BOTTOM SLIM DOCKED ACTION DECK                                 */}
      {/* ============================================================== */}
      <div className="relative z-20 p-2 sm:p-3 flex flex-col gap-1.5 pointer-events-none">
        <div className="w-full max-w-4xl mx-auto p-2 sm:p-2.5 rounded-2xl bg-black/85 backdrop-blur-xl border border-zinc-800 shadow-2xl pointer-events-auto flex flex-col gap-2">
          {/* Top Row: Room-Specific Working Signature Controls */}
          <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
            {/* 1. ADENVER AI CONTROLS */}
            {activeProjectId === "adenver-ai" && (
              <>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                    ROUTE:
                  </span>
                  {(["ollama", "lmstudio", "groq", "gemini"] as const).map((prov) => (
                    <button
                      key={prov}
                      onClick={() => handleSelectProvider(prov)}
                      className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full font-mono text-[10px] font-bold tracking-wider transition-all cursor-pointer ${
                        selectedProvider === prov
                          ? "bg-cyan-400 text-black shadow-[0_0_12px_rgba(34,211,238,0.5)] scale-105"
                          : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                      }`}
                    >
                      {prov.toUpperCase()}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => activateDenver(0)}
                    className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full font-mono text-[9.5px] sm:text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                      isDenverAwake
                        ? "bg-cyan-400 text-black border-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.6)]"
                        : "bg-cyan-950/60 text-cyan-300 border-cyan-800 hover:bg-cyan-900"
                    }`}
                  >
                    <Zap className="w-3 h-3 text-cyan-400" />
                    <span>3D HOLOGRAM EXPLANATION</span>
                  </button>

                  <button
                    onClick={() => handleGateAction("approved")}
                    className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full font-mono text-[9.5px] sm:text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      actionGateState === "approved"
                        ? "bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                        : "bg-emerald-950/60 text-emerald-300 border border-emerald-800 hover:bg-emerald-900"
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>ALLOW</span>
                  </button>
                  <button
                    onClick={() => handleGateAction("blocked")}
                    className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full font-mono text-[9.5px] sm:text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      actionGateState === "blocked"
                        ? "bg-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                        : "bg-red-950/60 text-red-300 border border-red-800 hover:bg-red-900"
                    }`}
                  >
                    <XCircle className="w-3 h-3" />
                    <span>DENY</span>
                  </button>
                </div>
              </>
            )}

            {/* 2. SMART ICU CONTROLS */}
            {activeProjectId === "icu-monitoring" && (
              <>
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-teal-400" />
                  <span className="font-mono text-[10px] text-teal-300 uppercase tracking-wider font-semibold">
                    TELEMETRY FEED ACTIVE // CRITICAL MONITORING
                  </span>
                </div>

                <button
                  onClick={handleToggleCritical}
                  className={`px-3 py-1 rounded-full font-mono text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg ${
                    isCriticalAlert
                      ? "bg-red-500 text-white animate-pulse shadow-[0_0_18px_rgba(239,68,68,0.7)]"
                      : "bg-red-950/80 text-red-300 border border-red-800 hover:bg-red-900"
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{isCriticalAlert ? "ALERT ACTIVE: SEPSIS SPIKE" : "SIMULATE CRITICAL ALERT"}</span>
                </button>
              </>
            )}

            {/* 3. ETS CONTROLS WITH RECONCILED DUAL TOTALS */}
            {activeProjectId === "ets-expense" && (
              <>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Filter className="w-3 h-3 text-amber-400" />
                  <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                    FILTER:
                  </span>
                  {(["all", "income", "expense"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => handleFilterChange(filter)}
                      className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full font-mono text-[10px] font-bold tracking-wider transition-all cursor-pointer ${
                        etsFilter === filter
                          ? "bg-amber-400 text-black shadow-[0_0_12px_rgba(245,158,11,0.5)] scale-105"
                          : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                      }`}
                    >
                      {filter.toUpperCase()}
                    </button>
                  ))}
                </div>

                <div className="font-mono text-[10px] sm:text-[11px] flex items-center gap-2 flex-wrap">
                  <span className="text-amber-400 font-bold uppercase tracking-wider hidden sm:inline">
                    SRI BASAVESHWARA HARVESTING &amp; CO.
                  </span>
                  <span className="text-zinc-600 hidden sm:inline">|</span>
                  <span className="text-zinc-400">
                    {etsFilterSubtotal.badgeLabel}:{" "}
                    <strong style={{ color: etsFilterSubtotal.color }} className="font-bold">
                      {etsFilterSubtotal.amountFormatted}
                    </strong>
                  </span>

                  <span className="text-zinc-500">|</span>

                  <span className="text-zinc-400 hidden xs:inline">
                    SEASONAL NET:{" "}
                    <strong className="text-emerald-400 font-bold">
                      +₹{etsGlobalTotals.net.toLocaleString("en-IN")}
                    </strong>
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Bottom Row: Automatic Cinematic Camera Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 pt-2 border-t border-zinc-900/80">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isPlaying ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
              <span className="font-mono text-[10px] text-zinc-300 uppercase tracking-widest font-semibold">
                {isPlaying ? "AUTOMATIC CINEMATIC 3D ORBIT ACTIVE" : "MANUAL 3D ORBIT · DRAG TO EXPLORE"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden md:inline font-mono text-[9px] text-zinc-400 uppercase tracking-wider">
                DRAG WITH MOUSE TO FREELY ROTATE
              </span>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsPlaying((prev) => !prev);
                }}
                className={`px-3 py-1 rounded-full font-mono text-[10px] font-bold tracking-wider transition-all cursor-pointer flex items-center gap-1.5 border ${
                  isPlaying
                    ? "bg-zinc-900 text-zinc-400 hover:text-white border-zinc-800"
                    : "bg-emerald-400 text-black border-emerald-300 shadow-[0_0_14px_rgba(52,211,153,0.5)]"
                }`}
              >
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{isPlaying ? "PAUSE MOTION" : "RESUME CINEMATIC"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
