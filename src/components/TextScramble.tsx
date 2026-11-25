"use client";

import React, { useState, useEffect, useRef } from "react";

interface TextScrambleProps {
  text: string;
  className?: string;
  scrambleOnHover?: boolean;
  triggerOnMount?: boolean;
  as?: React.ElementType;
}

const GLYPHS = "!<>-_\\/[]{}—=+*^?#01X_";

export const TextScramble: React.FC<TextScrambleProps> = ({
  text,
  className = "",
  scrambleOnHover = true,
  triggerOnMount = false,
  as: Component = "span",
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const frameRef = useRef<number | null>(null);

  const startScramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);

    const length = text.length;
    let iteration = 0;
    const maxIterations = length * 2.5;

    const update = () => {
      iteration += 1;
      const progress = iteration / maxIterations;

      const scrambled = text
        .split("")
        .map((char, index) => {
          if (char === " " || char === "\n") return char;
          if (index / length < progress) {
            return text[index];
          }
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join("");

      setDisplayText(scrambled);

      if (iteration < maxIterations) {
        frameRef.current = requestAnimationFrame(update);
      } else {
        setDisplayText(text);
        setIsScrambling(false);
      }
    };

    frameRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    setDisplayText(text);
    if (triggerOnMount) {
      startScramble();
    }
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [text, triggerOnMount]);

  return (
    <Component
      onMouseEnter={scrambleOnHover ? startScramble : undefined}
      className={`inline-block transition-colors ${className}`}
    >
      {displayText}
    </Component>
  );
};

