"use client";

import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none h-[2px] bg-transparent">
      <motion.div
        style={{ scaleX, transformOrigin: "0%" }}
        className="h-full bg-gradient-to-r from-zinc-600 via-white to-emerald-400 shadow-[0_0_10px_rgba(255,255,255,0.7)]"
      />
    </div>
  );
};

