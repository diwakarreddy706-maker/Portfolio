"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bot, User, Database, ShieldCheck, Cpu } from "lucide-react";

const SAMPLE_QUESTION = "Summarize pending tasks from local memory.";
const SAMPLE_ANSWER_WORDS = [
  "Retrieved",
  "3",
  "tasks",
  "from",
  "SQLite",
  "vault:",
  "model",
  "router",
  "eval,",
  "audio",
  "pipeline,",
  "and",
  "schema",
  "check.",
  "Ollama",
  "3.2",
  "local",
  "model",
  "active.",
  "Offline",
  "privacy",
  "preserved.",
];

export const AdenverPreview: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [typedQuestion, setTypedQuestion] = useState("");
  const [displayedWordsCount, setDisplayedWordsCount] = useState(0);
  const [isTypingQuestion, setIsTypingQuestion] = useState(true);
  const [isStreamingAnswer, setIsStreamingAnswer] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isOnScreen, setIsOnScreen] = useState(true);

  // Detect prefers-reduced-motion
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

  // Animation typing loop
  useEffect(() => {
    if (isReducedMotion) {
      setTypedQuestion(SAMPLE_QUESTION);
      setDisplayedWordsCount(SAMPLE_ANSWER_WORDS.length);
      setIsTypingQuestion(false);
      setIsStreamingAnswer(false);
      return;
    }

    if (!isOnScreen) return;

    let timeoutId: NodeJS.Timeout;

    if (isTypingQuestion) {
      if (typedQuestion.length < SAMPLE_QUESTION.length) {
        timeoutId = setTimeout(() => {
          setTypedQuestion(SAMPLE_QUESTION.slice(0, typedQuestion.length + 1));
        }, 38);
      } else {
        timeoutId = setTimeout(() => {
          setIsTypingQuestion(false);
          setIsStreamingAnswer(true);
          setDisplayedWordsCount(0);
        }, 350);
      }
    } else if (isStreamingAnswer) {
      if (displayedWordsCount < SAMPLE_ANSWER_WORDS.length) {
        timeoutId = setTimeout(() => {
          setDisplayedWordsCount((prev) => prev + 1);
        }, 75);
      } else {
        // Full answer displayed, pause before restarting loop
        timeoutId = setTimeout(() => {
          setTypedQuestion("");
          setDisplayedWordsCount(0);
          setIsTypingQuestion(true);
          setIsStreamingAnswer(false);
        }, 3200);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [
    isReducedMotion,
    isOnScreen,
    typedQuestion,
    displayedWordsCount,
    isTypingQuestion,
    isStreamingAnswer,
  ]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col justify-between font-mono select-none"
    >
      {/* Top Window Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-[10px]">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500/80" />
            <span className="w-2 h-2 rounded-full bg-amber-500/80" />
            <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-zinc-400 pl-1 font-semibold tracking-wider text-[9px] sm:text-[10px]">
            ADENVER // PySide6 GUI
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[9px] uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded font-bold">
            OLLAMA 3.2
          </span>
          <span className="text-[8px] uppercase tracking-widest text-zinc-500 border border-zinc-800 px-1.5 py-0.5 rounded bg-zinc-900/60">
            ILLUSTRATIVE PREVIEW
          </span>
        </div>
      </div>

      {/* Main Chat Stream View */}
      <div className="my-auto py-2.5 flex flex-col gap-2 overflow-hidden">
        {/* User Question */}
        <div className="flex items-start gap-2 bg-[#141414] border border-zinc-800/90 rounded-lg p-2.5">
          <div className="w-5 h-5 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 shrink-0">
            <User className="w-3 h-3" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[9px] text-zinc-400 uppercase font-semibold">User</div>
            <p className="text-white text-xs leading-snug">
              {typedQuestion}
              {isTypingQuestion && !isReducedMotion && (
                <span className="inline-block w-1.5 h-3 ml-0.5 bg-cyan-400 animate-pulse align-middle" />
              )}
            </p>
          </div>
        </div>

        {/* Assistant Response */}
        <div className="flex items-start gap-2 bg-black/70 border border-cyan-500/30 rounded-lg p-2.5 shadow-[0_0_15px_rgba(0,240,255,0.08)]">
          <div className="w-5 h-5 rounded-md bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-300 shrink-0">
            <Bot className="w-3 h-3" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-[9px] text-cyan-400 font-semibold mb-0.5">
              <span>ADENVER AI</span>
              <span className="text-zinc-500 text-[8px]">LOCAL MEMORY</span>
            </div>
            <p className="text-zinc-200 text-[11px] leading-relaxed">
              {isStreamingAnswer || isReducedMotion ? (
                <>
                  {SAMPLE_ANSWER_WORDS.slice(0, displayedWordsCount).join(" ")}
                  {isStreamingAnswer &&
                    displayedWordsCount < SAMPLE_ANSWER_WORDS.length &&
                    !isReducedMotion && (
                      <span className="inline-block w-1.5 h-3 ml-1 bg-cyan-400 animate-pulse align-middle" />
                    )}
                </>
              ) : (
                <span className="text-zinc-600 italic text-[10px]">Awaiting query...</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Status Bar / Sub-footer */}
      <div className="pt-2 border-t border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-[9.5px] text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="text-zinc-300">
            Model router: local first, cloud fallback
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[9px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>LOCAL MEMORY ACTIVE</span>
        </div>
      </div>
    </div>
  );
};
