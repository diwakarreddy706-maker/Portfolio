"use client";

import React, { useState, useEffect, useRef } from "react";
import { TrendingUp, ArrowDownRight, ArrowUpRight, BarChart3, Database } from "lucide-react";

interface LedgerRow {
  date: string;
  desc: string;
  category: string;
  amount: number;
  type: "income" | "expense";
}

const LEDGER_DATA: LedgerRow[] = [
  {
    date: "OCT 14",
    desc: "Paddy Harvesting Service #104",
    category: "Operations",
    amount: 48500,
    type: "income",
  },
  {
    date: "OCT 17",
    desc: "Diesel Fuel Batch (450 Liters)",
    category: "Fuel",
    amount: -18200,
    type: "expense",
  },
  {
    date: "OCT 21",
    desc: "Tractor Hydraulic Servicing",
    category: "Maintenance",
    amount: -6800,
    type: "expense",
  },
  {
    date: "OCT 25",
    desc: "Custom Grain Threshing Batch",
    category: "Contract",
    amount: 32200,
    type: "income",
  },
];

const MONTHLY_BARS = [
  { month: "JUL", heightPercent: 45, income: 42000 },
  { month: "AUG", heightPercent: 62, income: 58000 },
  { month: "SEP", heightPercent: 78, income: 74000 },
  { month: "OCT", heightPercent: 95, income: 98000 },
];

export const EtsPreview: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isOnScreen, setIsOnScreen] = useState(true);

  // Progressive row reveal index (0 to 4)
  const [visibleRowsCount, setVisibleRowsCount] = useState(4);
  const [runningNet, setRunningNet] = useState(55700);

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

  // Progressive row sliding and running total update loop
  useEffect(() => {
    if (isReducedMotion) {
      setVisibleRowsCount(LEDGER_DATA.length);
      setRunningNet(55700);
      return;
    }

    if (!isOnScreen) return;

    let currentRow = 0;
    setVisibleRowsCount(0);
    setRunningNet(0);

    const interval = setInterval(() => {
      currentRow += 1;

      if (currentRow <= LEDGER_DATA.length) {
        setVisibleRowsCount(currentRow);
        // Calculate cumulative running net
        const subtotal = LEDGER_DATA.slice(0, currentRow).reduce(
          (acc, item) => acc + item.amount,
          0
        );
        setRunningNet(subtotal);
      } else if (currentRow > LEDGER_DATA.length + 2) {
        // Pause at full view, then restart cycle
        currentRow = 0;
        setVisibleRowsCount(0);
        setRunningNet(0);
      }
    }, 1100);

    return () => clearInterval(interval);
  }, [isReducedMotion, isOnScreen]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col justify-between font-mono select-none"
    >
      {/* Top Header: Business Name & Balance Summary */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-[10px]">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-zinc-200 font-semibold tracking-wider text-[9px] sm:text-[10px]">
            SRI BASAVESHWARA HARVESTING &amp; CO.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[9px] uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded font-bold">
            DJANGO ETS
          </span>
          <span className="text-[8px] uppercase tracking-widest text-zinc-500 border border-zinc-800 px-1.5 py-0.5 rounded bg-zinc-900/60">
            ILLUSTRATIVE PREVIEW
          </span>
        </div>
      </div>

      {/* Middle Grid: Running Ledger List (Left) + Seasonal Bar Chart (Right) */}
      <div className="my-auto py-2 grid grid-cols-1 md:grid-cols-12 gap-2">
        {/* Left Column: Sliding Transaction Ledger Rows (8 cols) */}
        <div className="md:col-span-8 flex flex-col gap-1.5 justify-center">
          {/* Running Balance Banner */}
          <div className="flex items-center justify-between px-2 py-1 rounded bg-[#141414] border border-zinc-800 text-[9.5px]">
            <span className="text-zinc-400">RUNNING BALANCE:</span>
            <span
              className={`font-bold transition-all duration-300 ${
                runningNet >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {runningNet >= 0 ? `+₹${runningNet.toLocaleString("en-IN")}` : `-₹${Math.abs(runningNet).toLocaleString("en-IN")}`}
            </span>
          </div>

          {/* Sequential Sliding Ledger Rows */}
          <div className="flex flex-col gap-1">
            {LEDGER_DATA.map((row, idx) => {
              const isVisible = idx < visibleRowsCount || isReducedMotion;

              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between px-2 py-1 rounded border text-[9px] transition-all duration-300 ease-out ${
                    isVisible
                      ? "opacity-100 translate-x-0 bg-black/60 border-zinc-800"
                      : "opacity-0 -translate-x-4 bg-transparent border-transparent pointer-events-none"
                  }`}
                  style={{
                    transform: isVisible ? "translateX(0)" : "translateX(-12px)",
                  }}
                >
                  <div className="flex items-center gap-1.5 truncate pr-2">
                    <span className="text-zinc-500 text-[8px] shrink-0">{row.date}</span>
                    <span className="text-zinc-300 truncate font-medium">{row.desc}</span>
                  </div>

                  <span
                    className={`shrink-0 font-bold ${
                      row.type === "income" ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {row.type === "income"
                      ? `+₹${row.amount.toLocaleString("en-IN")}`
                      : `-₹${Math.abs(row.amount).toLocaleString("en-IN")}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Growing Agribusiness Bar Chart (4 cols) */}
        <div className="md:col-span-4 bg-[#12100d] border border-amber-950/70 rounded-lg p-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[8px] text-amber-400/90 mb-1 border-b border-amber-950/70 pb-1">
            <span className="flex items-center gap-1 font-semibold">
              <BarChart3 className="w-2.5 h-2.5 text-amber-400" />
              HARVEST REVENUE
            </span>
            <span className="text-zinc-500">2024</span>
          </div>

          {/* Bar Chart Columns */}
          <div className="flex items-end justify-between gap-1.5 h-16 sm:h-20 pt-1 pb-1 px-1">
            {MONTHLY_BARS.map((b, idx) => {
              // Bar height scales as rows reveal, or full if reduced-motion
              const scaleRatio = isReducedMotion
                ? 1
                : Math.min(1, Math.max(0.2, visibleRowsCount / LEDGER_DATA.length));
              const currentHeight = Math.round(b.heightPercent * scaleRatio);

              return (
                <div key={b.month} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  {/* The bar element */}
                  <div
                    className="w-full bg-gradient-to-t from-amber-600/50 to-amber-400 rounded-t transition-all duration-500 ease-out shadow-[0_0_8px_rgba(245,158,11,0.2)]"
                    style={{
                      height: `${currentHeight}%`,
                      transform: "translateZ(0)",
                    }}
                  />
                  <span className="text-[7.5px] text-zinc-400 font-bold">{b.month}</span>
                </div>
              );
            })}
          </div>

          <div className="text-[7.5px] text-zinc-500 text-center border-t border-amber-950/70 pt-1">
            NET HARVEST MARGIN: +41%
          </div>
        </div>
      </div>

      {/* Sub-footer */}
      <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[9px] text-zinc-400">
        <span>DJANGO ORM · MYSQL ENGINE</span>
        <span className="text-amber-400 font-semibold">RELATIONAL LEDGER ACTIVE</span>
      </div>
    </div>
  );
};
