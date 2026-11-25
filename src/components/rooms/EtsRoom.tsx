"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  FileSpreadsheet,
  Database,
  Calendar,
  Layers,
  CheckCircle2,
  Filter,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { soundManager } from "../AudioClick";
import { RoomTourStep } from "./RoomShell";

export const ETS_TOUR_STEPS: RoomTourStep[] = [
  {
    title: "1. RECORD // INCOME & EXPENSE ENTRY",
    stageBadge: "STEP 1: RECORD",
    focusTarget: "ledger_desk",
    rotX: 18,
    rotY: 0,
    zoomZ: -100,
    description:
      "Structured web forms for logging business revenue, operational expenses, and supplier transactions for Sri Basaveshwara Harvesting & Co.",
    techHighlight: "Django Form Validation · CSRF Protected · Mobile-Responsive Accounting",
  },
  {
    title: "2. STORE // DJANGO ORM & MYSQL CYLINDER",
    stageBadge: "STEP 2: STORE",
    focusTarget: "mysql_cylinder",
    rotX: 20,
    rotY: 0,
    zoomZ: -20,
    description:
      "Ledger transactions map through Django Class-Based Views and ORM models, persisting into a relational MySQL engine with strict foreign key financial integrity.",
    techHighlight: "Python 3 · Django ORM · Relational MySQL Database Engine",
  },
  {
    title: "3. ORGANIZE // DJANGO PIPELINE FLOW & PEGBOARD",
    stageBadge: "STEP 3: ORGANIZE",
    focusTarget: "django_pegboard",
    rotX: 22,
    rotY: 0,
    zoomZ: 60,
    description:
      "Transaction flows route systematically from HTML View submissions to Model validation, automated database writes, and aggregated balance sheet reports.",
    techHighlight: "Form → View/Model → MySQL → Report · Modular MVC Architecture",
  },
  {
    title: "4. REVIEW TOTALS // 4-SIDED FINANCIAL PILLAR",
    stageBadge: "STEP 4: REVIEW TOTALS",
    focusTarget: "financial_pillar",
    rotX: 24,
    rotY: 0,
    zoomZ: 140,
    description:
      "The rotating financial pillar computes real-time gross income, categorized operational expenditures, and seasonal net balance totals.",
    techHighlight: "Aggregated Django Queries · Real-time Rupee Balance Sheet Analytics",
  },
];

interface EtsRoomProps {
  currentStep: RoomTourStep;
  currentStepIndex: number;
  hoveredProp: string | null;
  setHoveredProp: (id: string | null) => void;
  onSelectPropStep: (stepIdx: number) => void;
  filterMode: "all" | "income" | "expense";
  onFilterChange: (mode: "all" | "income" | "expense") => void;
}

interface LedgerItem {
  id: string;
  type: "income" | "expense";
  desc: string;
  amount: string;
  rawAmount: number;
  date: string;
}

const SAMPLE_LEDGER: LedgerItem[] = [
  { id: "1", type: "income", desc: "Commercial Service Contract #4", amount: "+₹1,25,000", rawAmount: 125000, date: "OCT 12" },
  { id: "2", type: "expense", desc: "Operational Supplies & Fuel", amount: "-₹42,000", rawAmount: 42000, date: "OCT 13" },
  { id: "3", type: "income", desc: "Agricultural Contract Retainer #12", amount: "+₹85,000", rawAmount: 85000, date: "OCT 14" },
  { id: "4", type: "expense", desc: "Equipment Maintenance & Repairs", amount: "-₹14,500", rawAmount: 14500, date: "OCT 15" },
  { id: "5", type: "income", desc: "Commercial Service Retainer", amount: "+₹1,35,000", rawAmount: 135000, date: "OCT 16" },
  { id: "6", type: "expense", desc: "Field Operational Disbursements", amount: "-₹28,000", rawAmount: 28000, date: "OCT 17" },
];

export const EtsRoom: React.FC<EtsRoomProps> = ({
  currentStep,
  currentStepIndex,
  hoveredProp,
  setHoveredProp,
  onSelectPropStep,
  filterMode,
  onFilterChange,
}) => {
  // Sliding rows animation phase
  const [slidePhase, setSlidePhase] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlidePhase((prev) => (prev + 1) % SAMPLE_LEDGER.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  // Filtered ledger rows
  const visibleLedger = SAMPLE_LEDGER.filter((item) => {
    if (filterMode === "income") return item.type === "income";
    if (filterMode === "expense") return item.type === "expense";
    return true;
  });

  // Dynamic calculations based on filter
  const totalIncome = 345000;
  const totalExpense = 84500;
  const netProfit = totalIncome - totalExpense;

  // Window light tone shifts across the tour steps (morning -> evening)
  const windowTimeOverlay =
    currentStepIndex === 0
      ? "from-amber-400/20 via-yellow-500/10 to-transparent" // morning
      : currentStepIndex === 1
      ? "from-amber-500/25 via-amber-600/15 to-transparent" // midday
      : currentStepIndex === 2
      ? "from-orange-500/30 via-amber-700/20 to-transparent" // afternoon
      : "from-rose-500/25 via-amber-900/20 to-transparent"; // golden evening

  return (
    <div
      className="relative w-[720px] h-[700px] flex items-center justify-center select-none"
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {/* 1. GABLED BARN ROOF (Two Sloped Roof Panels Meeting at a Ridge Beam) */}
      <div
        className="assemble-prop absolute w-[640px] h-[400px] pointer-events-none flex justify-center"
        style={{
          transform: "translateZ(260px) translateY(-140px)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Ridge Beam */}
        <div className="absolute w-[620px] h-3 bg-amber-950 border border-amber-800 rounded shadow-2xl z-20" />

        {/* Left Sloped Roof Panel */}
        <div
          className="absolute w-[620px] h-48 bg-gradient-to-b from-[#1b1410] to-[#120e0b] border border-amber-900/40 shadow-2xl"
          style={{
            transform: "rotateX(28deg) translateY(-85px)",
            transformOrigin: "center top",
          }}
        />

        {/* Right Sloped Roof Panel */}
        <div
          className="absolute w-[620px] h-48 bg-gradient-to-t from-[#1b1410] to-[#120e0b] border border-amber-900/40 shadow-2xl"
          style={{
            transform: "rotateX(-28deg) translateY(85px)",
            transformOrigin: "center bottom",
          }}
        />
      </div>

      {/* 2. FLOOR: Dark Wooden Planks with an Agronomic Green Area Rug */}
      <div
        className="assemble-prop absolute w-[660px] h-[580px] rounded-2xl border border-amber-950 flex items-center justify-center pointer-events-none"
        style={{
          transform: "rotateX(90deg) translateZ(-160px)",
          transformStyle: "preserve-3d",
          backgroundColor: "#110e0c",
          backgroundImage:
            "repeating-linear-gradient(90deg, #18130f 0px, #18130f 38px, #120e0a 38px, #120e0a 40px)",
          boxShadow: "inset 0 0 50px rgba(0,0,0,0.9)",
        }}
      >
        {/* Green Agronomic Rug Zone Under Desk */}
        <div
          className="w-[420px] h-[340px] rounded-xl border border-emerald-900/40 shadow-2xl"
          style={{
            backgroundColor: "rgba(22, 101, 52, 0.15)",
            boxShadow: "0 0 30px rgba(34, 197, 94, 0.1)",
          }}
        />
      </div>

      {/* 3. BACK WINDOW WITH STYLIZED WHEAT-FIELD HORIZON & SWAYING STALKS */}
      <div
        className="assemble-prop absolute w-[640px] h-[360px] rounded-xl border border-amber-900/50 bg-[#120e0a] p-4 flex justify-between overflow-hidden"
        style={{
          transform: "translateZ(-280px)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Large Back Window */}
        <div className="relative w-80 h-56 rounded-xl border-2 border-amber-800/80 bg-gradient-to-b from-amber-950/60 via-amber-900/20 to-black overflow-hidden shadow-inner flex flex-col justify-end p-2">
          {/* Moving Sunlight Tone Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-b ${windowTimeOverlay} transition-all duration-1000`} />

          {/* Stylized Swaying Wheat Stalks (CSS Animated Strips) */}
          <div className="relative z-10 flex items-end justify-between w-full h-24 px-2">
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className="w-1.5 rounded-t-full bg-gradient-to-t from-amber-700 via-amber-400 to-yellow-200"
                style={{
                  height: `${55 + (i % 6) * 7}px`,
                  animation: "sway 3s ease-in-out infinite alternate",
                  animationDelay: `${(i * 0.18)}s`,
                  transformOrigin: "bottom center",
                }}
              />
            ))}
          </div>

          <div className="absolute top-2 left-2 z-20 font-mono text-[8px] text-amber-400/80 font-bold">
            FIELD_VIEW // KARNATAKA AGRI
          </div>
        </div>

        {/* Business Office Wall Plaque */}
        <div className="text-right font-mono text-[9px] text-amber-500/70 space-y-1">
          <p className="text-white font-bold">SRI BASAVESHWARA HARVESTING &amp; CO.</p>
          <p>COMMERCIAL_ERP // DJANGO 5.0</p>
          <p className="text-emerald-400">STATUS: AUDITED &amp; PERSISTENT</p>
        </div>
      </div>

      {/* 4. CENTER: WOODEN LEDGER DESK WITH OPEN BOOK (STEP 1: RECORD) */}
      <div
        data-prop-step="0"
        onMouseEnter={() => setHoveredProp("WOODEN LEDGER DESK")}
        onMouseLeave={() => setHoveredProp(null)}
        onClick={() => onSelectPropStep(0)}
        className={`assemble-prop absolute w-64 h-72 rounded-2xl border bg-[#1d1612] shadow-2xl p-3 flex flex-col justify-between cursor-pointer transition-all duration-500 ${
          currentStep.focusTarget === "ledger_desk" || hoveredProp === "WOODEN LEDGER DESK"
            ? "border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.5)] translate-z-[15px]"
            : "border-amber-900/60 hover:border-amber-500/50"
        }`}
        style={{
          transform: "rotateX(70deg) translateY(-20px) translateZ(-10px)",
          transformStyle: "preserve-3d",
        }}
      >
        <div className="flex justify-between items-center text-[9px] font-mono text-amber-400 border-b border-amber-900/60 pb-1 font-bold">
          <span className="flex items-center gap-1">
            <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
            OPEN_LEDGER.DB
          </span>
          <span className="text-emerald-400 text-[8px] uppercase">[{filterMode}]</span>
        </div>

        {/* Open Ledger Entries with sliding rows into MySQL */}
        <div className="space-y-1 font-mono text-[8px] my-auto">
          {visibleLedger.slice(0, 4).map((item, idx) => (
            <div
              key={item.id}
              className={`p-1.5 rounded border flex justify-between items-center transition-all duration-300 ${
                slidePhase === idx
                  ? "bg-amber-500/20 border-amber-400 translate-x-2 text-white"
                  : "bg-black/60 border-amber-950 text-zinc-300"
              }`}
            >
              <div className="flex items-center gap-1">
                {item.type === "income" ? (
                  <ArrowUpRight className="w-2.5 h-2.5 text-emerald-400" />
                ) : (
                  <ArrowDownLeft className="w-2.5 h-2.5 text-amber-400" />
                )}
                <span className="truncate max-w-[100px]">{item.desc}</span>
              </div>
              <span
                className={`font-bold ${
                  item.type === "income" ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {item.amount}
              </span>
            </div>
          ))}
        </div>

        <div className="font-mono text-[7.5px] text-zinc-500 border-t border-amber-950 pt-1 flex justify-between">
          <span>ROW_SYNC: REALTIME</span>
          <span className="text-amber-400">SAMPLE RUPEE DATA</span>
        </div>
      </div>

      {/* 5. HERO PROP: ROTATING 4-SIDED 3D FINANCIAL PILLAR ON DESK (STEP 4: REVIEW TOTALS) */}
      <div
        data-prop-step="3"
        onMouseEnter={() => setHoveredProp("4-SIDED FINANCIAL PILLAR")}
        onMouseLeave={() => setHoveredProp(null)}
        onClick={() => onSelectPropStep(3)}
        className={`assemble-prop absolute w-48 p-3 rounded-2xl border bg-black/95 shadow-2xl cursor-pointer transition-all duration-500 ${
          currentStep.focusTarget === "financial_pillar" || hoveredProp === "4-SIDED FINANCIAL PILLAR"
            ? "border-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.6)] translate-z-[30px]"
            : "border-amber-900/80 hover:border-amber-400/60"
        }`}
        style={{
          transform: "translateZ(100px) translateY(-80px) translateX(110px)",
          transformStyle: "preserve-3d",
        }}
      >
        <div className="flex justify-between items-center text-[9px] font-mono text-amber-400 border-b border-zinc-800 pb-1 mb-2 font-bold">
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            FINANCIAL_PILLAR
          </span>
          <span className="text-zinc-500 text-[8px]">4-SIDED</span>
        </div>

        {/* 4-Sided Pillar Data Bars */}
        <div className="space-y-1.5 font-mono text-[8.5px]">
          {/* Income Side */}
          <div className="p-1 rounded bg-[#16120e] border border-amber-950">
            <div className="flex justify-between text-zinc-400">
              <span>INCOME:</span>
              <span className="text-emerald-400 font-bold">₹{totalIncome.toLocaleString()}</span>
            </div>
            <div className="w-full h-1 bg-zinc-800 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all duration-700"
                style={{ width: filterMode === "expense" ? "0%" : "85%" }}
              />
            </div>
          </div>

          {/* Expense Side */}
          <div className="p-1 rounded bg-[#16120e] border border-amber-950">
            <div className="flex justify-between text-zinc-400">
              <span>EXPENSE:</span>
              <span className="text-amber-400 font-bold">₹{totalExpense.toLocaleString()}</span>
            </div>
            <div className="w-full h-1 bg-zinc-800 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-amber-400 transition-all duration-700"
                style={{ width: filterMode === "income" ? "0%" : "42%" }}
              />
            </div>
          </div>

          {/* Net Profit Side */}
          <div className="p-1 rounded bg-[#16120e] border border-amber-950">
            <div className="flex justify-between text-zinc-400">
              <span>NET PROFIT:</span>
              <span className="text-sky-300 font-bold">₹{netProfit.toLocaleString()}</span>
            </div>
          </div>

          {/* Transactions Side */}
          <div className="p-1 rounded bg-[#16120e] border border-amber-950 flex justify-between text-zinc-400">
            <span>AUDITED OPS:</span>
            <span className="text-zinc-200 font-bold">142 Entries</span>
          </div>
        </div>
      </div>

      {/* 6. LEFT WALL: MYSQL DATABASE CYLINDER & ARCHIVE BOXES (STEP 2: STORE) */}
      <div
        data-prop-step="1"
        onMouseEnter={() => setHoveredProp("MYSQL DATABASE CYLINDER")}
        onMouseLeave={() => setHoveredProp(null)}
        onClick={() => onSelectPropStep(1)}
        className={`assemble-prop absolute w-52 p-3 rounded-xl border bg-black/95 shadow-2xl cursor-pointer transition-all duration-500 ${
          currentStep.focusTarget === "mysql_cylinder" || hoveredProp === "MYSQL DATABASE CYLINDER"
            ? "border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.5)] translate-z-[20px]"
            : "border-amber-950 hover:border-amber-500/50"
        }`}
        style={{
          transform: "rotateY(75deg) translateZ(-190px) translateY(-30px)",
          transformStyle: "preserve-3d",
        }}
      >
        <div className="flex justify-between items-center text-[9px] font-mono text-amber-400 border-b border-zinc-800 pb-1 mb-2 font-bold">
          <span className="flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-amber-400" />
            MYSQL_CYLINDER
          </span>
          <span className="text-emerald-400 text-[8px]">INNODB</span>
        </div>

        {/* 3D Stacked Storage Cylinder Discs */}
        <div className="space-y-1.5 my-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-4 rounded-full border border-amber-500/50 bg-gradient-to-r from-amber-950 via-amber-800/40 to-amber-950 shadow-md flex items-center justify-center font-mono text-[7px] text-amber-200"
            >
              TABLE_PARTITION_0{i + 1}
            </div>
          ))}
        </div>

        <p className="font-mono text-[8px] text-zinc-400 bg-[#120e0a] p-1.5 rounded border border-amber-950">
          • Auto-aggregating revenue totals &amp; expense deductions.
        </p>
      </div>

      {/* 7. RIGHT WALL: PEGBOARD "DJANGO FLOW" (STEP 3: ORGANIZE) */}
      <div
        data-prop-step="2"
        onMouseEnter={() => setHoveredProp("DJANGO FLOW PEGBOARD")}
        onMouseLeave={() => setHoveredProp(null)}
        onClick={() => onSelectPropStep(2)}
        className={`assemble-prop absolute w-56 p-3 rounded-xl border bg-black/95 shadow-2xl cursor-pointer transition-all duration-500 ${
          currentStep.focusTarget === "django_pegboard" || hoveredProp === "DJANGO FLOW PEGBOARD"
            ? "border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.5)] translate-z-[20px]"
            : "border-amber-950 hover:border-amber-500/50"
        }`}
        style={{
          transform: "rotateY(-75deg) translateZ(-190px) translateY(-30px)",
          transformStyle: "preserve-3d",
        }}
      >
        <div className="flex justify-between items-center text-[9px] font-mono text-emerald-400 border-b border-zinc-800 pb-1 mb-2 font-bold">
          <span>DJANGO_FLOW // PEGBOARD</span>
          <span className="text-zinc-500 text-[8px]">MVC</span>
        </div>

        {/* Pegboard Pipeline Path: Form -> View/Model -> MySQL -> Report */}
        <div className="space-y-1.5 font-mono text-[8px] text-zinc-300">
          <div className="p-1 rounded bg-[#120e0a] border border-amber-900/60 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>1. FORM INPUT</span>
          </div>
          <div className="p-1 rounded bg-[#120e0a] border border-amber-900/60 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>2. DJANGO VIEW &amp; MODEL</span>
          </div>
          <div className="p-1 rounded bg-[#120e0a] border border-amber-900/60 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>3. MYSQL PERSISTENCE</span>
          </div>
          <div className="p-1 rounded bg-[#120e0a] border border-amber-900/60 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
            <span>4. BALANCE REPORT</span>
          </div>
        </div>
      </div>

      {/* 8. FLOOR / WINDOW MONTHLY CASH-FLOW STRIP WITH FLOATING COIN PARTICLES */}
      <div
        className="assemble-prop absolute w-80 p-2 rounded-xl border border-amber-950 bg-black/90 shadow-2xl flex items-center justify-between pointer-events-none"
        style={{
          transform: "rotateX(50deg) translateY(150px) translateZ(40px)",
          transformStyle: "preserve-3d",
        }}
      >
        <span className="font-mono text-[8px] text-amber-400 font-bold">OCT CASH-FLOW:</span>
        <div className="flex items-center gap-1 font-mono text-[8px] text-zinc-400">
          <span className="px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-900/40">
            +₹3.45L
          </span>
          <span className="px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-900/40">
            -₹84.5K
          </span>
        </div>
      </div>
    </div>
  );
};
