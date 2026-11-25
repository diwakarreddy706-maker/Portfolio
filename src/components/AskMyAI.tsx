"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  X,
  Send,
  RotateCcw,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  User,
} from "lucide-react";
import { soundManager } from "./AudioClick";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  fallback?: boolean;
}

interface AskMyAIProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const STARTER_CHIPS = [
  "What projects has Diwakar built?",
  "What is ADENVER AI?",
  "What are his strongest skills?",
  "Is he open to internships?",
  "Tell me about his publication",
];

export const AskMyAI: React.FC<AskMyAIProps> = ({ isOpen, setIsOpen }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-welcome",
      role: "assistant",
      content:
        "Hello! I am Diwakar's portfolio AI assistant. Feel free to ask anything about his projects, technical skills, education, or research publication.",
    },
  ]);
  const [inputVal, setInputVal] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }
  }, [messages, isLoading, isOpen, prefersReducedMotion]);

  // Focus trap & Escape listener
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;

      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsOpen(false);
          return;
        }

        if (e.key === "Tab") {
          const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
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
        window.removeEventListener("keydown", handleKeyDown);
        clearTimeout(timer);
        previousActiveElement.current?.focus();
      };
    }
  }, [isOpen, setIsOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend || inputVal).trim();
    if (!content || isLoading) return;
    if (content.length > 500) return;

    soundManager.playClick(1000);
    setInputVal("");

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      // Send conversation history to server
      const payloadMessages = newHistory
        .filter((m) => m.id !== "initial-welcome")
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payloadMessages }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMsg =
          errorData.error ||
          "Unable to complete query right now. You can email Diwakar directly at diwakarreddy706@gmail.com.";
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: errorMsg,
          },
        ]);
        return;
      }

      const data = await res.json();
      const reply =
        data.reply ||
        "I don't have that information on my portfolio. You can email Diwakar directly at diwakarreddy706@gmail.com.";

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: reply,
          fallback: data.fallback,
        },
      ]);
      soundManager.playSnap();
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content:
            "I could not connect to the assistant service. You can email Diwakar directly at diwakarreddy706@gmail.com.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    soundManager.playClick(900);
    setMessages([
      {
        id: "initial-welcome-reset",
        role: "assistant",
        content:
          "Chat reset. Ask me anything about Diwakar's projects, skills, education, or publications!",
      },
    ]);
  };

  const handleChipClick = (chipText: string) => {
    handleSendMessage(chipText);
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right, distinct from other controls) */}
      <button
        ref={triggerButtonRef}
        onClick={() => {
          soundManager.playClick(1100);
          setIsOpen(!isOpen);
        }}
        aria-label="Ask my AI chat assistant"
        aria-expanded={isOpen}
        title="Ask Diwakar's AI Assistant"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#0D0D0D] border border-emerald-500/60 hover:border-emerald-400 text-white font-mono text-xs uppercase tracking-wider shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
        <Bot className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform duration-300" />
        <span className="font-bold hidden sm:inline">ASK MY AI</span>
      </button>

      {/* Chat Dialog Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Ask Diwakar's Portfolio AI Assistant"
          className="fixed inset-x-3 bottom-3 sm:inset-x-auto sm:right-6 sm:bottom-20 z-50 w-auto sm:w-[420px] max-w-[calc(100vw-1.5rem)] h-[580px] max-h-[88vh] bg-[#0A0D0B] border border-[#1E2E23] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white select-none backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Header Bar */}
          <div className="p-3.5 sm:p-4 border-b border-[#1A261D] bg-[#0E1410] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center">
                <Bot className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                    DIWAKAR // AI
                  </h3>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
                    Grounded
                  </span>
                </div>
                <p className="font-mono text-[10px] text-zinc-400">
                  Answers exclusively from portfolio data
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleClearChat}
                title="Clear conversation"
                aria-label="Clear conversation history"
                className="p-1.5 rounded-lg border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  soundManager.playClick(900);
                  setIsOpen(false);
                }}
                title="Close AI assistant"
                aria-label="Close AI assistant dialog"
                className="p-1.5 rounded-lg border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Permanent Disclaimer Strip */}
          <div className="px-4 py-2 bg-black/60 border-b border-[#162018] shrink-0 flex items-center gap-2 text-zinc-400 font-mono text-[10px] leading-tight">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              AI assistant. Answers come only from this portfolio and may be imperfect.
            </span>
          </div>

          {/* Messages Stream Container */}
          <div
            role="log"
            aria-live="polite"
            className="flex-1 overflow-y-auto p-4 space-y-3 font-sans text-xs select-text"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-[#121E16] border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3 h-3 text-emerald-400" />
                  </div>
                )}

                <div
                  className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-zinc-800 text-white rounded-br-sm border border-zinc-700"
                      : "bg-[#111A14] text-zinc-200 rounded-bl-sm border border-[#1E2E23]"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {msg.fallback && (
                    <span className="block mt-1 font-mono text-[9px] uppercase tracking-wider text-zinc-400">
                      • Offline knowledge answer
                    </span>
                  )}
                </div>

                {msg.role === "user" && (
                  <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3 h-3 text-zinc-300" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-6 h-6 rounded-full bg-[#121E16] border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <Bot className="w-3 h-3 text-emerald-400" />
                </div>
                <div className="p-3 rounded-xl bg-[#111A14] border border-[#1E2E23] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Starter Chips Bar */}
          <div className="p-2 border-t border-[#162018] bg-[#080D0A] shrink-0">
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {STARTER_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChipClick(chip)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-full bg-[#111813] border border-[#213025] hover:border-emerald-500 text-zinc-300 hover:text-white font-mono text-[10px] tracking-wide whitespace-nowrap transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Input & Form Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-[#1A261D] bg-[#0E1410] shrink-0 space-y-1.5"
          >
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                maxLength={500}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask about projects, skills, education..."
                aria-label="Type your question about Diwakar"
                disabled={isLoading}
                className="flex-1 bg-[#080D0A] border border-[#1E2C22] focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isLoading}
                aria-label="Send message"
                className="w-8 h-8 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-black flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-md disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between font-mono text-[9px] text-zinc-400 px-1">
              <span>Enter to send · Under 120 words</span>
              <span className={inputVal.length > 450 ? "text-amber-400" : ""}>
                {inputVal.length}/500
              </span>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
