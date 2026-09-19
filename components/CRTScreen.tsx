"use client";

import React, {
  ReactNode,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import confetti from "canvas-confetti";
import { fireEldritchTentacles } from "@/lib/confetti";

export interface CRTScreenHandle {
  triggerRealityGlitch: (intensity: "low" | "high") => void;
  fireTentacles: () => void;
  triggerScreenRumble: () => void;
}

interface CRTScreenProps {
  children: ReactNode;
  isGlitching?: boolean;
  isPermanentGlitch?: boolean;
  powerOn?: boolean;
}

const ELDRITCH_WHISPERS = [
  "Ph'nglui mglw'nafh Cthulhu R'lyeh wgah'nagl fhtagn...",
  "Ia! Ia! Cthulhu fhtagn! The Sleeper stirs beneath the silt...",
  "Y'AI'NG'NGAH YOG-SOTHOTH H'EE-L'GEB F'AI THRODOG...",
  "COGNITIVE FIREWALL DESTROYED // NON-EUCLIDEAN CALCULUS DETECTED",
  "THE BLACK SEAS OF INFINITY WHISPER THY SOUL ID: PID-1099-VOID",
  "DO NOT SIGN THE CEASE-AND-DESIST... HEARD IN THE DEEP...",
];

export const CRTScreen = forwardRef<CRTScreenHandle, CRTScreenProps>(
  (
    {
      children,
      isGlitching = false,
      isPermanentGlitch = false,
      powerOn = true,
    },
    ref
  ) => {
    const [temporaryGlitch, setTemporaryGlitch] = useState<boolean>(false);
    const [glitchIntensity, setGlitchIntensity] = useState<"low" | "high">("low");
    const [isScreenRumble, setIsScreenRumble] = useState<boolean>(false);
    const glitchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const rumbleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Tentacle particle splash using canvas-confetti
    const fireTentacles = useCallback(() => {
      fireEldritchTentacles();
    }, []);

    // Trigger reality glitch dynamically on mutations or sanity drain
    const triggerRealityGlitch = useCallback((intensity: "low" | "high") => {
      if (glitchTimeoutRef.current) {
        clearTimeout(glitchTimeoutRef.current);
      }

      setGlitchIntensity(intensity);
      setTemporaryGlitch(true);

      const durationMs = intensity === "high" ? 1400 : 650;
      glitchTimeoutRef.current = setTimeout(() => {
        setTemporaryGlitch(false);
      }, durationMs);
    }, []);

    // Trigger 0.4s screen rumble effect for [DRIVE PETITIONER MAD]
    const triggerScreenRumble = useCallback(() => {
      if (rumbleTimeoutRef.current) {
        clearTimeout(rumbleTimeoutRef.current);
      }
      setIsScreenRumble(true);
      rumbleTimeoutRef.current = setTimeout(() => {
        setIsScreenRumble(false);
      }, 400);
    }, []);

    // Expose handle for parent components
    useImperativeHandle(
      ref,
      () => ({
        triggerRealityGlitch,
        fireTentacles,
        triggerScreenRumble,
      }),
      [triggerRealityGlitch, fireTentacles, triggerScreenRumble]
    );

    // Cleanup timeouts on unmount
    useEffect(() => {
      return () => {
        if (glitchTimeoutRef.current) clearTimeout(glitchTimeoutRef.current);
        if (rumbleTimeoutRef.current) clearTimeout(rumbleTimeoutRef.current);
      };
    }, []);

    const hasGlitchActive = isGlitching || temporaryGlitch || isPermanentGlitch;
    const isHighOrPermanent = isPermanentGlitch || (temporaryGlitch && glitchIntensity === "high");

    // Random whisper glyphs for sanity meltdown (<35%)
    const activeWhispers = useMemo(() => {
      if (!isPermanentGlitch) return [];
      return [
        { text: ELDRITCH_WHISPERS[0], top: "15%", left: "6%", delay: "0s" },
        { text: ELDRITCH_WHISPERS[1], top: "72%", left: "10%", delay: "1.2s" },
        { text: ELDRITCH_WHISPERS[2], top: "28%", right: "8%", delay: "0.6s" },
        { text: ELDRITCH_WHISPERS[3], top: "84%", right: "12%", delay: "2s" },
      ];
    }, [isPermanentGlitch]);

    return (
      <div className="bg-[#050b07] text-[#33ff66] min-h-screen font-mono p-6 border-2 border-[#1a5c2d] shadow-[0_0_20px_rgba(51,255,102,0.15)] flex flex-col justify-center items-center relative overflow-hidden">
        {/* Outer Vintage Terminal Chassis / Bezel */}
        <div
          className={`w-full max-w-[1600px] h-[calc(100vh-3rem)] crt-bezel bg-void-950 flex flex-col transition-all duration-200 ${
            hasGlitchActive ? "animate-shake ring-2 ring-eldritch-blood shadow-blood" : "ring-1 ring-phosphor-dim"
          } ${isScreenRumble ? "translate-x-1 translate-y-1 animate-screen-rumble" : ""}`}
        >
          {/* Terminal Header Bar */}
          <header className="h-10 bg-void-900 border-b border-phosphor-dim px-4 flex items-center justify-between text-xs tracking-wider z-20 select-none">
            <div className="flex items-center space-x-3">
              <span
                className={`inline-block w-2.5 h-2.5 rounded-full ${
                  hasGlitchActive
                    ? "bg-eldritch-blood animate-ping shadow-[0_0_10px_#ff2244]"
                    : "bg-phosphor-base animate-pulse shadow-[0_0_8px_#00ff66]"
                }`}
              />
              <span
                className={`font-bold tracking-widest uppercase ${
                  hasGlitchActive
                    ? "text-eldritch-blood glow-blood glitch-text"
                    : "text-phosphor-laser"
                }`}
                data-text="R'LYEH ABYSSAL TERMINAL // OS-VOID v7.13"
              >
                R&apos;LYEH ABYSSAL TERMINAL // OS-VOID v7.13
              </span>
            </div>

            <div className="hidden sm:flex items-center space-x-4 text-phosphor-dark">
              <span>MEM: 64K CYCLOPEAN</span>
              <span>BAUD: 300 NON-EUCLIDEAN</span>
              <span
                className={`font-mono animate-pulse ${
                  isPermanentGlitch
                    ? "text-eldritch-blood font-bold"
                    : "text-phosphor-bright"
                }`}
              >
                {isPermanentGlitch ? "SANITY MELTDOWN (<35%) // CHROMATIC ABERRATION ACTIVE" : "SIGNAL: HARMONIZED"}
              </span>
            </div>
          </header>

          {/* Inner Curved Phosphor Screen Area */}
          <div
            className="relative flex-1 flex flex-col overflow-hidden bg-void-950 crt-screen-curvature transition-all duration-300"
            style={
              isPermanentGlitch
                ? {
                    filter: "hue-rotate(90deg) contrast(160%) saturate(140%)",
                  }
                : undefined
            }
          >
            {/* Momentary Floating Eldritch Whisper Glyphs (<35% Sanity) */}
            {isPermanentGlitch && (
              <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
                {activeWhispers.map((w, idx) => (
                  <div
                    key={idx}
                    className="whisper-glyph select-none"
                    style={{
                      top: w.top,
                      left: w.left,
                      right: w.right,
                      animationDelay: w.delay,
                    }}
                  >
                    {w.text}
                  </div>
                ))}
              </div>
            )}

            {/* Main Application Content Container with skew & glitch when active */}
            <main
              className={`relative z-10 flex-1 flex flex-col overflow-hidden transition-all duration-150 ${
                powerOn ? "animate-flicker" : "opacity-0"
              } ${
                hasGlitchActive
                  ? `animate-glitch skew-y-3 ${isHighOrPermanent ? "scale-[1.01]" : ""}`
                  : ""
              }`}
            >
              {children}
            </main>

            {/* CRT Scanline Horizontal Raster Lines (Aggressive Flicker when Meltdown) */}
            <div
              className={`absolute inset-0 crt-scanlines pointer-events-none z-30 ${
                isPermanentGlitch ? "crt-scanlines-meltdown" : ""
              }`}
              aria-hidden="true"
            />

            {/* CRT Animated Vertical Cathode Sweeping Beam */}
            <div
              className="absolute inset-x-0 h-28 crt-beam animate-scanline pointer-events-none z-30"
              aria-hidden="true"
            />

            {/* CRT Spherical Glass Reflection Glare */}
            <div
              className="absolute inset-0 crt-glare pointer-events-none z-30"
              aria-hidden="true"
            />

            {/* Heavy CRT Vignette / Radial Shadowing */}
            <div
              className="absolute inset-0 shadow-[inset_0_0_90px_rgba(0,0,0,0.92)] pointer-events-none z-30"
              aria-hidden="true"
            />
          </div>

          {/* Chassis Footer Status Bar */}
          <footer className="h-7 bg-void-900 border-t border-phosphor-dim px-4 flex items-center justify-between text-[11px] text-phosphor-dim select-none z-20">
            <div className="flex items-center space-x-2">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isPermanentGlitch ? "bg-eldritch-blood animate-ping" : "bg-phosphor-base"
                }`}
              />
              <span>
                {isPermanentGlitch
                  ? "PSYCHIC CONTAINMENT COLLAPSE (<35%) - GLYPH INTERFERENCE OCCURRING"
                  : "SUB-ETHER COUPLING: LOCKED"}
              </span>
            </div>
            <div className="tracking-widest hidden md:block">
              <span>UNAUTHORIZED ACCESS WILL RESULT IN IMMEDIATE ESSENCE COMMODIFICATION</span>
            </div>
          </footer>
        </div>
      </div>
    );
  }
);

CRTScreen.displayName = "CRTScreen";
