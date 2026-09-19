"use client";

import React, { useMemo, useEffect } from "react";

interface SanityMeterProps {
  sanity: number; // 0 - 100
  maxSanity?: number;
  activePetitionDrain?: number;
  activePetitionTitle?: string;
  onRestoreSanity?: () => void;
  onTriggerGlitch?: (intensity: "low" | "high") => void;
}

export const SanityMeter: React.FC<SanityMeterProps> = ({
  sanity,
  maxSanity = 100,
  activePetitionDrain = 0,
  activePetitionTitle,
  onRestoreSanity,
  onTriggerGlitch,
}) => {
  const percentage = Math.max(0, Math.min(100, Math.round((sanity / maxSanity) * 100)));
  const isSevereHazard = percentage < 35;
  const isCritical = percentage < 20;
  const isWarning = percentage < 50 && !isSevereHazard;

  // Trigger high reality glitch when dropping below 35%
  useEffect(() => {
    if (isSevereHazard && onTriggerGlitch) {
      onTriggerGlitch("high");
    }
  }, [isSevereHazard, onTriggerGlitch]);

  const statusLabel = useMemo(() => {
    if (percentage <= 0) return "CEREBRAL COLLAPSE // ZERO SYNAPSE REPAIR";
    if (percentage < 20) return "TOTAL PSYCHOSIS // COGNITIVE DISSOLUTION";
    if (percentage < 35) return "SANITY MELTDOWN (<35%) // CHROMATIC ABERRATION ACTIVE";
    if (percentage < 50) return "SEVERE PARANOIA & VOID WHISPERS";
    if (percentage < 75) return "MILD REALITY DETACHMENT";
    return "LUCID COGNITION (BUREAUCRATICALLY STABLE)";
  }, [percentage]);

  const totalSegments = 20;
  const activeSegments = Math.round((percentage / 100) * totalSegments);
  
  // Calculate projected drain segments if sanctioned
  const projectedLossPercentage = Math.round((activePetitionDrain / maxSanity) * 100);
  const projectedDrainSegments = Math.min(
    activeSegments,
    Math.round((projectedLossPercentage / 100) * totalSegments)
  );

  const getBarColor = (index: number): string => {
    const isProjectedDrain = index >= activeSegments - projectedDrainSegments && index < activeSegments;

    if (isProjectedDrain && activePetitionDrain > 0) {
      return "bg-eldritch-blood/60 animate-pulse shadow-[0_0_6px_#ff2244]";
    }

    if (isCritical || isSevereHazard) {
      return "bg-eldritch-blood shadow-[0_0_8px_#ff2244]";
    }
    if (isWarning) {
      return "bg-eldritch-amber shadow-[0_0_6px_#ffaa00]";
    }
    return index < 12
      ? "bg-phosphor-base shadow-[0_0_6px_#00ff66]"
      : "bg-phosphor-bright shadow-[0_0_8px_#80ffaa]";
  };

  return (
    <div
      className={`border p-3 transition-colors duration-300 ${
        isSevereHazard
          ? "border-eldritch-blood bg-void-950/95 shadow-blood"
          : isWarning
          ? "border-eldritch-amber bg-void-900/80 shadow-amber"
          : "border-phosphor-dark bg-void-900/60 shadow-phosphor"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <div className="flex items-center space-x-2">
          <span
            className={`w-2.5 h-2.5 rounded-sm ${
              isSevereHazard
                ? "bg-eldritch-blood animate-ping"
                : isWarning
                ? "bg-eldritch-amber animate-pulse"
                : "bg-phosphor-base"
            }`}
          />
          <h2
            className={`text-xs font-bold tracking-widest uppercase ${
              isSevereHazard
                ? "text-eldritch-blood glow-blood glitch-text"
                : isWarning
                ? "text-eldritch-amber glow-amber"
                : "text-phosphor-bright glow-text"
            }`}
            data-text="DEPARTMENT SANITY GAUGE"
          >
            DEPARTMENT SANITY GAUGE
          </h2>

          {activePetitionDrain > 0 && (
            <span className="hidden md:inline-block px-1.5 py-0.5 border border-eldritch-blood/70 bg-eldritch-blood/10 text-eldritch-blood text-[9px] font-mono tracking-wider">
              PROJECTED DRAIN: -{activePetitionDrain} PSY
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span
            className={`font-mono font-bold text-sm tracking-widest ${
              isSevereHazard
                ? "text-eldritch-blood glow-blood animate-pulse"
                : isWarning
                ? "text-eldritch-amber glow-amber"
                : "text-phosphor-laser glow-text"
            }`}
          >
            {percentage}% [{sanity}/{maxSanity} PSY-UNITS]
          </span>

          {onRestoreSanity && percentage < 100 && (
            <button
              onClick={onRestoreSanity}
              type="button"
              className="px-2 py-0.5 text-[10px] tracking-wider border border-phosphor-dim hover:border-phosphor-base text-phosphor-base hover:bg-phosphor-dim/30 transition-colors uppercase"
              title="Consume ritual sedative to restore sanity"
            >
              [RITUAL TONIC]
            </button>
          )}
        </div>
      </div>

      {/* Segmented Digital Bar with Projected Drain Flash */}
      <div className="grid grid-cols-20 gap-1 h-4 bg-void-950 p-1 border border-phosphor-dim/50 rounded-sm">
        {Array.from({ length: totalSegments }).map((_, idx) => {
          const isActive = idx < activeSegments;
          return (
            <div
              key={idx}
              className={`h-full rounded-[1px] transition-all duration-200 ${
                isActive ? getBarColor(idx) : "bg-void-850 opacity-25"
              }`}
            />
          );
        })}
      </div>

      {/* Sub-status and Diagnostic Message */}
      <div className="mt-2 flex items-center justify-between text-[11px]">
        <div className="flex items-center space-x-1 font-mono">
          <span className="text-phosphor-dim">CONDITION:</span>
          <span
            className={`font-semibold tracking-wide ${
              isSevereHazard
                ? "text-eldritch-blood glow-blood glitch-text"
                : isWarning
                ? "text-eldritch-amber"
                : "text-phosphor-base"
            }`}
            data-text={statusLabel}
          >
            {statusLabel}
          </span>
        </div>

        <div className="text-[10px] text-phosphor-dark font-mono">
          {isSevereHazard ? (
            <span className="text-eldritch-blood animate-pulse font-bold">
              [PSYCHIC CHROMATIC SHIFT LOCK ACTIVE]
            </span>
          ) : (
            <span>THRESHOLD LIMIT: 35% SANITY MELTDOWN // 20% PSI-FAILSAFE</span>
          )}
        </div>
      </div>

      {/* Active Warning Banner when Sanity < 35% */}
      {isSevereHazard && (
        <div className="mt-2 p-1.5 border border-dashed border-eldritch-blood bg-eldritch-blood/15 text-eldritch-blood text-[10px] font-mono tracking-wider text-center animate-pulse">
          WARNING: SANITY CRITICALLY DRAINED (&lt;35%). REALITY CONTRAST MATRIX AND HUE SHIFTER LOCKED ENGAGED.
        </div>
      )}
    </div>
  );
};
