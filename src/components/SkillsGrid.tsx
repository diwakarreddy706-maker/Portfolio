"use client";

import React from "react";
import { skills } from "../data/portfolio";
import { Reveal } from "./Reveal";

export const SkillsGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {skills.map((skill, idx) => (
        <Reveal key={idx} delay={idx * 0.08}>
          <div className="bg-[#0D0D0D] border border-[#1F1F1F] rounded-2xl p-6 flex flex-col justify-between hover:border-zinc-700 transition-all h-full group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 px-2.5 py-0.5 rounded-full font-semibold">
                  {skill.tier}
                </span>
              </div>
              <h5 className="font-display font-bold text-lg text-white group-hover:text-zinc-300 transition-colors mt-2">
                {skill.name}
              </h5>
              <span className="font-mono text-[10px] text-zinc-400 uppercase italic tracking-widest block mt-1">
                {skill.category}
              </span>
              <p className="text-zinc-400 text-xs leading-relaxed mt-4 line-clamp-3">
                {skill.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#1F1F1F]">
              <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                APPLIED IN:
              </div>
              <div className="font-mono text-xs text-zinc-300 font-semibold tracking-wide">
                {skill.usedIn}
              </div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
};
