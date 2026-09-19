"use client";

import React from "react";
import { EldritchPetition, WorkflowAction } from "@/types/eldritch";
import { soundEngine } from "@/lib/soundEngine";
import { TypewriterText } from "@/components/TypewriterText";

interface PetitionViewerProps {
  petition: EldritchPetition | null;
  currentSanity: number;
  isProcessing: boolean;
  onAction: (action: WorkflowAction, petition: EldritchPetition) => void;
}

export const PetitionViewer: React.FC<PetitionViewerProps> = ({
  petition,
  currentSanity,
  isProcessing,
  onAction,
}) => {
  if (!petition) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-void-950 font-mono select-none">
        <div className="text-4xl text-phosphor-dim mb-4 animate-pulse">☠</div>
        <p className="text-sm text-phosphor-laser tracking-widest uppercase mb-2 glow-text">
          ABYSSAL REPOSITORY STANDBY
        </p>
        <p className="text-xs text-phosphor-dim max-w-md">
          SELECT A FILED PETITION FROM THE QUEUE SIDEBAR TO COMMENCE THE
          SACRED ADJUDICATION PROCEDURE.
        </p>
      </div>
    );
  }

  const isAlreadyProcessed = petition.status !== "pending";
  const canSanction = currentSanity >= petition.sanityDrain;

  const handleAction = (action: WorkflowAction) => {
    // Mechanical rubber stamp thump sound
    soundEngine.playStampThump();
    onAction(action, petition);
  };

  const getStampDisplay = () => {
    switch (petition.status) {
      case "sanctioned":
        return (
          <div
            key={`stamp-${petition._id}-sanctioned`}
            className="animate-stamp-slam border-4 border-double border-phosphor-base text-phosphor-base px-6 py-3 uppercase font-bold tracking-widest text-lg sm:text-xl md:text-2xl shadow-phosphor-bright bg-void-950/95 flex flex-col items-center justify-center gap-0.5 select-none z-30"
          >
            <span className="text-[9px] tracking-widest text-phosphor-laser border-b border-phosphor-base/60 pb-0.5 mb-0.5">
              OFFICIAL ABYSSAL DECREE // RATIFIED
            </span>
            <span className="glow-text font-mono">[SANCTIONED BY CTHULHU]</span>
            <span className="text-[8px] text-phosphor-bright/80 tracking-tighter">
              TITHE COLLECTED // REALITY AMENDED
            </span>
          </div>
        );
      case "smited":
        return (
          <div
            key={`stamp-${petition._id}-smited`}
            className="animate-stamp-slam border-4 border-double border-eldritch-blood text-eldritch-blood px-6 py-3 uppercase font-bold tracking-widest text-lg sm:text-xl md:text-2xl shadow-blood bg-void-950/95 flex flex-col items-center justify-center gap-0.5 select-none z-30"
          >
            <span className="text-[9px] tracking-widest text-eldritch-blood border-b border-eldritch-blood/60 pb-0.5 mb-0.5">
              ABYSSAL REJECTION // CITATION 666
            </span>
            <span className="glow-blood font-mono">[SMITED TO ASHES]</span>
            <span className="text-[8px] text-eldritch-blood/80 tracking-tighter">
              MATTER DISPERSED INTO COSMIC PLASMA
            </span>
          </div>
        );
      case "driven_mad":
        return (
          <div
            key={`stamp-${petition._id}-madness`}
            className="animate-stamp-slam border-4 border-double border-eldritch-purple text-eldritch-purple px-6 py-3 uppercase font-bold tracking-widest text-lg sm:text-xl md:text-2xl shadow-purple bg-void-950/95 flex flex-col items-center justify-center gap-0.5 select-none z-30"
          >
            <span className="text-[9px] tracking-widest text-eldritch-purple border-b border-eldritch-purple/60 pb-0.5 mb-0.5">
              PSYCHO-CHEMICAL VERDICT // NON-EUCLIDEAN
            </span>
            <span className="glow-purple font-mono">[COGNITIVE COLLAPSE]</span>
            <span className="text-[8px] text-eldritch-purple/80 tracking-tighter">
              CONSCIOUSNESS FRACTURED FOREVER
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="flex-1 flex flex-col bg-void-950 overflow-hidden font-mono select-none relative">
      {/* Document Workspace Bar */}
      <div className="p-3 bg-void-900 border-b border-phosphor-dim flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-phosphor-dark">DOC ID:</span>
          <span className="text-xs font-bold text-phosphor-laser tracking-wider">
            {petition._id}
          </span>
        </div>

        <div className="flex items-center space-x-4 text-xs">
          <span className="text-phosphor-dim">
            SUBMITTED: {petition.createdAt ? new Date(petition.createdAt).toLocaleDateString() : "ETERNAL TIME"}
          </span>
          <span
            className={`px-2 py-0.5 border text-[11px] uppercase tracking-wider font-bold ${
              petition.status === "pending"
                ? "border-eldritch-amber text-eldritch-amber bg-eldritch-amber/10"
                : petition.status === "sanctioned"
                ? "border-phosphor-base text-phosphor-base bg-phosphor-base/10"
                : petition.status === "smited"
                ? "border-eldritch-blood text-eldritch-blood bg-eldritch-blood/10"
                : "border-eldritch-purple text-eldritch-purple bg-eldritch-purple/10"
            }`}
          >
            STATUS: {petition.status}
          </span>
        </div>
      </div>

      {/* Main Document Content Scrollable Area */}
      <div className="relative flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {/* Render Interactive Bureaucratic Rubber Stamp if Processed */}
        {isAlreadyProcessed && (
          <div className="absolute top-10 right-4 sm:right-10 pointer-events-none z-30">
            {getStampDisplay()}
          </div>
        )}

        {/* Title Header with Teletype Stream */}
        <div className="border-b border-dashed border-phosphor-dim/70 pb-4">
          <h1 className="text-base sm:text-lg md:text-xl font-bold text-phosphor-laser tracking-wider glow-text">
            <TypewriterText key={`title-${petition._id}`} text={petition.title} speedMs={10} />
          </h1>
        </div>

        {/* Petitioner Dossier & Credentials Grid with Teletype */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 border border-phosphor-dim/60 bg-void-900/60 rounded-sm text-xs">
          <div>
            <span className="block text-[10px] text-phosphor-dark uppercase">PETITIONER:</span>
            <span className="font-bold text-phosphor-bright">
              <TypewriterText
                key={`petitioner-${petition._id}`}
                text={petition.petitioner.name}
                speedMs={12}
              />
            </span>
          </div>

          <div>
            <span className="block text-[10px] text-phosphor-dark uppercase">ORIGIN REALM:</span>
            <span className="text-phosphor-base">
              <TypewriterText
                key={`realm-${petition._id}`}
                text={petition.petitioner.realm}
                speedMs={12}
              />
            </span>
          </div>

          <div>
            <span className="block text-[10px] text-phosphor-dark uppercase">DANGER LEVEL:</span>
            <span
              className={`font-bold ${
                petition.petitioner.dangerLevel === "Total Reality Collapse"
                  ? "text-eldritch-blood glow-blood"
                  : petition.petitioner.dangerLevel === "Cataclysm"
                  ? "text-eldritch-amber glow-amber"
                  : "text-phosphor-bright"
              }`}
            >
              {petition.petitioner.dangerLevel}
            </span>
          </div>
        </div>

        {/* The Formal Plea with Teletype Stream */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-phosphor-laser font-bold uppercase tracking-wider">
            <span>§ I. FORMAL PLEA &amp; JUSTIFICATION</span>
            <span className="text-[10px] text-phosphor-dim font-normal italic">
              [click text to instant-print]
            </span>
          </div>
          <div className="p-4 border-l-2 border-phosphor-dark bg-void-900/40 text-xs sm:text-sm text-phosphor-bright leading-relaxed">
            <TypewriterText
              key={`plea-${petition._id}`}
              text={petition.plea}
              speedMs={6}
            />
          </div>
        </div>

        {/* Blood-Tithe / Demanded Sacrifice with Teletype Stream */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs text-eldritch-amber font-bold uppercase tracking-wider">
            <span>§ II. OFFERED SACRIFICE / BLOOD-TITHE</span>
          </div>
          <div className="p-3 border border-dashed border-eldritch-amber/50 bg-eldritch-amber/5 text-xs text-eldritch-amber font-mono">
            <TypewriterText
              key={`sacrifice-${petition._id}`}
              text={petition.demandedSacrifice}
              speedMs={6}
            />
          </div>
        </div>

        {/* Sanity Drain Metric */}
        <div className="flex items-center justify-between p-3 border border-phosphor-dim bg-void-900/40 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-eldritch-blood font-bold">☠ PSI-DRAIN COST:</span>
            <span className="text-phosphor-bright">
              Ratification extracts <span className="text-eldritch-blood font-bold">{petition.sanityDrain} PSY</span> from the overseer&apos;s cortex.
            </span>
          </div>
          <span className="text-[10px] text-phosphor-dim uppercase">
            {canSanction ? "SUFFICIENCY CONFIRMED" : "INSUFFICIENT SANITY"}
          </span>
        </div>

        {/* Review Notes / Abyssal Decree Record */}
        {petition.reviewNotes && (
          <div className="space-y-2">
            <div className="text-xs text-phosphor-dim uppercase tracking-wider">
              § III. OFFICIAL BUREAUCRATIC DECREE LOG:
            </div>
            <div className="p-3 border border-phosphor-dim/50 bg-void-850/60 text-xs text-phosphor-bright italic font-mono leading-relaxed">
              &quot;{petition.reviewNotes}&quot;
            </div>
          </div>
        )}
      </div>

      {/* Action Dock */}
      <div className="p-3 md:p-4 bg-void-900 border-t border-phosphor-dim">
        <div className="text-[11px] text-phosphor-dim uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>ABYSSAL EXECUTIVE ACTIONS</span>
          {isAlreadyProcessed && (
            <span className="text-eldritch-amber">
              [DECREE ALREADY EXECUTED - RE-ADJUDICATION OVERRIDES FILE]
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Action 1: SANCTION DOOM */}
          <button
            type="button"
            disabled={isProcessing || (!canSanction && petition.status !== "sanctioned")}
            onClick={() => handleAction("sanction")}
            className={`px-4 py-3 border font-mono font-bold text-xs tracking-wider uppercase transition-all duration-150 flex flex-col items-center justify-center gap-1 ${
              canSanction || petition.status === "sanctioned"
                ? "border-phosphor-base bg-phosphor-dim/30 text-phosphor-laser hover:bg-phosphor-base hover:text-black shadow-phosphor hover:shadow-phosphor-bright active:scale-[0.98]"
                : "border-gray-800 text-gray-600 cursor-not-allowed opacity-50"
            }`}
          >
            <span className="text-sm">[SANCTION DOOM]</span>
            <span className="text-[10px] opacity-80 font-normal">
              (-{petition.sanityDrain} PSY // GRANT PLEA)
            </span>
          </button>

          {/* Action 2: REJECT & SMITE */}
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => handleAction("smite")}
            className="px-4 py-3 border border-eldritch-blood bg-eldritch-blood/15 text-eldritch-blood font-mono font-bold text-xs tracking-wider uppercase transition-all duration-150 flex flex-col items-center justify-center gap-1 hover:bg-eldritch-blood hover:text-black shadow-blood active:scale-[0.98]"
          >
            <span className="text-sm">[REJECT &amp; SMITE]</span>
            <span className="text-[10px] opacity-80 font-normal">
              (DISSOLVE PETITIONER IN PLASMA)
            </span>
          </button>

          {/* Action 3: DRIVE PETITIONER MAD */}
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => handleAction("drive_mad")}
            className="px-4 py-3 border border-eldritch-purple bg-eldritch-purple/15 text-eldritch-purple font-mono font-bold text-xs tracking-wider uppercase transition-all duration-150 flex flex-col items-center justify-center gap-1 hover:bg-eldritch-purple hover:text-white shadow-purple active:scale-[0.98]"
          >
            <span className="text-sm">[DRIVE PETITIONER MAD]</span>
            <span className="text-[10px] opacity-80 font-normal">
              (IRRADIATE WITH NON-EUCLIDEAN MATH)
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
