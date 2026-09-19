"use client";

import React, { useRef, useEffect, useState } from "react";
import { WorkflowHistoryEntry } from "@/types/eldritch";
import { isSanityConfigured } from "@/lib/sanity";

interface WorkflowLogProps {
  logs: WorkflowHistoryEntry[];
  isLoading?: boolean;
}

export const WorkflowLog: React.FC<WorkflowLogProps> = ({
  logs,
  isLoading = false,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPulseActive, setIsPulseActive] = useState<boolean>(false);
  const previousLogsCountRef = useRef<number>(logs.length);
  const pulseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger bright green pulse whenever a new workflow transition log is written
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }

    if (logs.length > previousLogsCountRef.current) {
      setIsPulseActive(true);
      if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
      pulseTimerRef.current = setTimeout(() => {
        setIsPulseActive(false);
      }, 1800);
    }
    previousLogsCountRef.current = logs.length;

    return () => {
      if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
    };
  }, [logs]);

  return (
    <div
      className={`w-full bg-void-950 border-t border-phosphor-dim select-none font-mono transition-all duration-300 ${
        isPulseActive
          ? "ring-2 ring-phosphor-base shadow-[0_0_35px_rgba(0,255,102,0.85)] bg-phosphor-dim/20"
          : ""
      }`}
    >
      {/* Log Console Ribbon Header */}
      <div
        className={`px-3 py-1.5 border-b border-phosphor-dim/60 flex items-center justify-between text-[11px] transition-colors ${
          isPulseActive ? "bg-phosphor-dark/50" : "bg-void-900"
        }`}
      >
        <div className="flex items-center space-x-2">
          <span
            className={`inline-block w-2.5 h-2.5 rounded-full ${
              isPulseActive
                ? "bg-phosphor-base animate-ping shadow-[0_0_12px_#00ff66]"
                : "bg-phosphor-base animate-pulse"
            }`}
          />
          <span
            className={`font-bold tracking-widest uppercase transition-all ${
              isPulseActive
                ? "text-phosphor-laser text-shadow-[0_0_12px_#00ff66] animate-pulse"
                : "text-phosphor-laser glow-text"
            }`}
          >
            GROQ AUDIT STREAM // *[_type == &quot;workflowHistory&quot;] | order(_createdAt desc)[0...10]
          </span>
          {isPulseActive && (
            <span className="text-[9px] px-1.5 py-0.2 bg-phosphor-base text-black font-bold uppercase rounded-[2px] animate-bounce">
              [NEW AUDIT COMMITTED]
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3 text-[10px] text-phosphor-dim">
          <span className="hidden sm:inline">
            BUFFER: {logs.length} RECORDS
          </span>
          <span
            className={`px-1.5 py-0.2 border text-[9px] uppercase font-bold rounded-[2px] ${
              isSanityConfigured
                ? "border-phosphor-base text-phosphor-bright bg-phosphor-dim/30"
                : "border-eldritch-amber/70 text-eldritch-amber bg-eldritch-amber/10"
            }`}
          >
            {isSanityConfigured ? "SANITY GROQ LIVE" : "LOCAL CACHE STREAM"}
          </span>
        </div>
      </div>

      {/* Scrolling Audit Log Terminal Window */}
      <div
        ref={scrollRef}
        className="h-24 sm:h-28 overflow-y-auto p-2 sm:p-3 space-y-1 bg-void-950/90 text-xs font-mono"
      >
        {isLoading ? (
          <div className="text-phosphor-dim animate-pulse py-2 text-center text-xs">
            [QUERYING SANITY ABYSSAL REPOSITORY VIA GROQ...]
          </div>
        ) : logs.length === 0 ? (
          <div className="text-phosphor-dim py-2 text-center text-xs">
            [NO WORKFLOW HISTORY RECORDED IN THIS SPATIAL TIMELINE]
          </div>
        ) : (
          logs.slice(0, 10).map((log, index) => {
            const isLatest = index === 0;
            const isSanction = log.action === "sanction";
            const isSmite = log.action === "smite";
            const isMadness = log.action === "drive_mad";

            return (
              <div
                key={log._id}
                className={`flex items-start justify-between gap-2 px-2 py-0.5 rounded-[2px] transition-all leading-relaxed ${
                  isLatest && isPulseActive
                    ? "bg-phosphor-dim/50 border-l-4 border-l-phosphor-base text-phosphor-laser shadow-[0_0_12px_rgba(0,255,102,0.4)]"
                    : isLatest
                    ? "bg-phosphor-dim/20 border-l-2 border-l-phosphor-base text-phosphor-laser"
                    : "text-phosphor-bright/80 hover:bg-void-900"
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <span
                    className={`font-mono font-bold tracking-tight ${
                      isLatest ? "text-phosphor-laser glow-text" : "text-phosphor-bright"
                    }`}
                  >
                    {log.formattedEntry}
                  </span>
                </div>

                <div className="shrink-0 flex items-center space-x-2 text-[10px]">
                  <span
                    className={`px-1 py-0.2 border uppercase rounded-[2px] ${
                      isSanction
                        ? "border-phosphor-base text-phosphor-laser bg-phosphor-dim/30"
                        : isSmite
                        ? "border-eldritch-blood text-eldritch-blood bg-eldritch-blood/10"
                        : isMadness
                        ? "border-eldritch-purple text-eldritch-purple bg-eldritch-purple/10"
                        : "border-phosphor-dim text-phosphor-dim"
                    }`}
                  >
                    {log.action.replace("_", " ")}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
