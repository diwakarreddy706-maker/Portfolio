"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: string | number; // e.g. "10+", "15+", "2.0+", "12+", or 92 (for 92%)
  suffix?: string;        // e.g. "%" or ""
  duration?: number;      // in seconds
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  suffix = "",
  duration = 1.6,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [displayValue, setDisplayValue] = useState<string>("0");

  useEffect(() => {
    if (!isInView) return;

    // Parse the target numeric value and any suffix
    const strVal = String(value).trim();
    const hasPlus = strVal.endsWith("+");
    const cleanNum = parseFloat(strVal.replace(/[^0-9.]/g, ""));
    const isDecimal = strVal.includes(".");
    const decimalMatch = strVal.match(/\.([0-9]+)/);
    const decimalPlaces = decimalMatch ? decimalMatch[1].length : 1;

    if (isNaN(cleanNum)) {
      setDisplayValue(strVal);
      return;
    }

    let start = 0;
    const startTime = performance.now();
    const durationMs = duration * 1000;

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = start + (cleanNum - start) * easeProgress;

      const formatted = isDecimal
        ? current.toFixed(decimalPlaces)
        : Math.floor(current).toString();

      setDisplayValue(`${formatted}${hasPlus ? "+" : ""}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        const finalFormatted = isDecimal
          ? cleanNum.toFixed(decimalPlaces)
          : cleanNum.toString();
        setDisplayValue(`${finalFormatted}${hasPlus ? "+" : ""}${suffix}`);
      }
    };

    requestAnimationFrame(updateCount);
  }, [isInView, value, suffix, duration]);

  return <span ref={ref}>{displayValue}</span>;
};

