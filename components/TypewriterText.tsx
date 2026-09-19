"use client";

import React, { useState, useEffect, useRef } from "react";
import { soundEngine } from "@/lib/soundEngine";

interface TypewriterTextProps {
  text: string;
  speedMs?: number;
  className?: string;
  onComplete?: () => void;
  enableSound?: boolean;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speedMs = 12,
  className = "",
  onComplete,
  enableSound = true,
}) => {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const charIndexRef = useRef<number>(0);

  useEffect(() => {
    // Reset state whenever target text changes
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setDisplayedText("");
    setIsTyping(true);
    charIndexRef.current = 0;

    const streamNextChar = () => {
      if (charIndexRef.current < text.length) {
        const nextChar = text.charAt(charIndexRef.current);
        charIndexRef.current += 1;
        setDisplayedText(text.slice(0, charIndexRef.current));

        // Procedural mechanical teletype sound with random variance
        if (enableSound && nextChar !== " " && charIndexRef.current % 2 === 0) {
          soundEngine.playTeletypeClick();
        }

        // Slight random jitter for organic retro teletype mechanism feel
        const jitter = Math.floor(Math.random() * 8) - 4;
        const delay = Math.max(4, speedMs + jitter);

        timeoutRef.current = setTimeout(streamNextChar, delay);
      } else {
        setIsTyping(false);
        if (onComplete) onComplete();
      }
    };

    // Initial slight pause before teletype hammers begin
    timeoutRef.current = setTimeout(streamNextChar, 50);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, speedMs, enableSound, onComplete]);

  // Click to instant-reveal
  const handleInstantReveal = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setDisplayedText(text);
    setIsTyping(false);
    if (onComplete) onComplete();
  };

  return (
    <span
      onClick={handleInstantReveal}
      className={`cursor-pointer ${className}`}
      title={isTyping ? "Click to instant-complete printout" : undefined}
    >
      {displayedText}
      {isTyping && (
        <span className="inline-block w-2 h-3.5 bg-phosphor-base ml-0.5 animate-pulse align-middle" />
      )}
    </span>
  );
};
