"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { CRTScreen, CRTScreenHandle } from "@/components/CRTScreen";
import { SanityMeter } from "@/components/SanityMeter";
import { PetitionList } from "@/components/PetitionList";
import { PetitionViewer } from "@/components/PetitionViewer";
import { WorkflowLog } from "@/components/WorkflowLog";
import {
  EldritchPetition,
  WorkflowAction,
  PetitionStatus,
  WorkflowHistoryEntry,
} from "@/types/eldritch";
import {
  FALLBACK_PETITIONS,
  FALLBACK_WORKFLOW_HISTORY,
  transitionPetitionWorkflow,
  fetchPetitions,
  fetchWorkflowHistory,
  isSanityConfigured,
} from "@/lib/sanity";
import { soundEngine } from "@/lib/soundEngine";

export default function EldritchBureaucracyDashboard() {
  const crtRef = useRef<CRTScreenHandle>(null);

  const [petitions, setPetitions] = useState<EldritchPetition[]>(() =>
    JSON.parse(JSON.stringify(FALLBACK_PETITIONS))
  );
  const [activePetitionId, setActivePetitionId] = useState<string | null>(
    FALLBACK_PETITIONS[0]?._id ?? null
  );
  const [sanity, setSanity] = useState<number>(100);
  const [statusFilter, setStatusFilter] = useState<PetitionStatus | "all">("all");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [systemAlert, setSystemAlert] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // GROQ workflow history log stream
  const [workflowLogs, setWorkflowLogs] = useState<WorkflowHistoryEntry[]>(() =>
    JSON.parse(JSON.stringify(FALLBACK_WORKFLOW_HISTORY))
  );
  const [isLogsLoading, setIsLogsLoading] = useState<boolean>(false);

  // Initialize petitions & GROQ workflow history on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [initialPetitions, initialLogs] = await Promise.all([
          fetchPetitions(),
          fetchWorkflowHistory(),
        ]);

        const petitionsData =
          initialPetitions && Array.isArray(initialPetitions) && initialPetitions.length > 0
            ? initialPetitions
            : JSON.parse(JSON.stringify(FALLBACK_PETITIONS));

        setPetitions(petitionsData);
        if (petitionsData.length > 0) {
          setActivePetitionId(petitionsData[0]._id);
        }

        const logsData =
          initialLogs && Array.isArray(initialLogs) && initialLogs.length > 0
            ? initialLogs
            : JSON.parse(JSON.stringify(FALLBACK_WORKFLOW_HISTORY));
        setWorkflowLogs(logsData);
      } catch (err) {
        console.error("Failed to load initial data, using fallbacks:", err);
        const fallbackData = JSON.parse(JSON.stringify(FALLBACK_PETITIONS));
        setPetitions(fallbackData);
        if (fallbackData.length > 0) {
          setActivePetitionId(fallbackData[0]._id);
        }
        setWorkflowLogs(JSON.parse(JSON.stringify(FALLBACK_WORKFLOW_HISTORY)));
      } finally {
        setIsLoaded(true);
        setIsLogsLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute active petition object
  const activePetition = useMemo(() => {
    if (!activePetitionId) return null;
    return petitions.find((p) => p._id === activePetitionId) || null;
  }, [petitions, activePetitionId]);

  // Statistics counters
  const stats = useMemo(() => {
    return {
      total: petitions.length,
      pending: petitions.filter((p) => p.status === "pending").length,
      sanctioned: petitions.filter((p) => p.status === "sanctioned").length,
      smited: petitions.filter((p) => p.status === "smited").length,
      drivenMad: petitions.filter((p) => p.status === "driven_mad").length,
    };
  }, [petitions]);

  // Sanity thresholds
  const isSevereHazard = sanity < 35;
  const isCritical = sanity < 20;
  const isCompletelyLost = sanity <= 0;

  // Optimistic Workflow Action Handler linked to Visual Triggers
  const handleWorkflowAction = useCallback(
    async (action: WorkflowAction, targetPetition: EldritchPetition) => {
      if (isProcessing) return;
      setIsProcessing(true);

      // Trigger visual glitches, rumble, and procedural audio based on decision
      switch (action) {
        case "sanction":
          soundEngine.playSanction();
          // Fire dark-green tentacles curling across CRT (#00ff66, #1a5c2d, #052e16)
          crtRef.current?.fireTentacles();
          crtRef.current?.triggerRealityGlitch("high");
          break;
        case "smite":
          soundEngine.playEldritchSmite();
          crtRef.current?.triggerRealityGlitch("high");
          break;
        case "drive_mad":
          // Dissonance audio chord and 0.4s screen rumble effect
          soundEngine.playDissonanceChord();
          soundEngine.playInsanityPulse();
          crtRef.current?.triggerScreenRumble();
          crtRef.current?.triggerRealityGlitch("low");
          break;
      }

      // Optimistic state calculation
      const previousPetitions = [...petitions];
      const previousSanity = sanity;
      const previousLogs = [...workflowLogs];

      let newSanity = sanity;
      if (action === "sanction") {
        newSanity = Math.max(0, sanity - targetPetition.sanityDrain);
        setSanity(newSanity);
      }

      const optimisticStatus: PetitionStatus =
        action === "sanction"
          ? "sanctioned"
          : action === "smite"
          ? "smited"
          : "driven_mad";

      const optimisticNote = `[ADJUDICATED] Decree executed: ${action.toUpperCase()} on petition ${
        targetPetition._id
      }.`;

      // Update petition locally immediately (optimistic UI)
      setPetitions((current) =>
        current.map((p) =>
          p._id === targetPetition._id
            ? { ...p, status: optimisticStatus, reviewNotes: optimisticNote }
            : p
        )
      );

      // Generate local optimistic log for immediate display
      const timeStr = new Date().toTimeString().split(" ")[0];
      const citeNum = Math.floor(Math.random() * 12) + 1;
      const appliedDrain = action === "sanction" ? targetPetition.sanityDrain : 0;
      const actionLabel =
        action === "sanction"
          ? "Sanctioned Doom"
          : action === "smite"
          ? "Smited into Cinders"
          : "Inflicted Non-Euclidean Madness";

      const optimisticLog: WorkflowHistoryEntry = {
        _id: `wf-optimistic-${Date.now()}`,
        _type: "workflowHistory",
        _createdAt: new Date().toISOString(),
        petitionId: targetPetition._id,
        action,
        actionLabel,
        arbiterCite: citeNum,
        sanityDrain: appliedDrain,
        formattedEntry: `[${timeStr}] ${targetPetition._id.toUpperCase()}: ${actionLabel} by Arbiter [cite: ${citeNum}]. Sanity Drain: -${appliedDrain}.`,
      };

      setWorkflowLogs((prev) => [optimisticLog, ...prev.slice(0, 9)]);

      const alertMsg =
        action === "sanction"
          ? `PLEA SANCTIONED: -${targetPetition.sanityDrain} PSY DRAIN APPLIED.`
          : action === "smite"
          ? `SMITE DISPATCHED: PETITIONER ANNIHILATED INTO CINDERS.`
          : `PSYCHIC TORMENT UNLEASHED: PETITIONER HAS BECOME NON-LINEAR.`;

      setSystemAlert(alertMsg);

      try {
        const result = await transitionPetitionWorkflow(
          targetPetition._id,
          action,
          targetPetition.sanityDrain
        );

        // Update with verified server/persistence notes & verified log
        setPetitions((current) =>
          current.map((p) =>
            p._id === targetPetition._id
              ? { ...p, status: result.targetStatus, reviewNotes: result.updatedNotes }
              : p
          )
        );

        if (result.newWorkflowEntry) {
          setWorkflowLogs((prev) => [
            result.newWorkflowEntry,
            ...prev.filter((l) => l._id !== optimisticLog._id).slice(0, 9),
          ]);
        }
      } catch (err) {
        console.error("Workflow mutation error:", err);
        // Rollback state if critical failure occurs
        setPetitions(previousPetitions);
        setSanity(previousSanity);
        setWorkflowLogs(previousLogs);
        setSystemAlert("COMMUNICATION WITH VOID CLIENT FAILED. REVERTING ROLLBACK.");
      } finally {
        setIsProcessing(false);
      }
    },
    [isProcessing, petitions, sanity, workflowLogs]
  );

  // Reset local state to default factory conditions
  const handleResetSession = useCallback(() => {
    soundEngine.playKeyClick();
    soundEngine.playBootSequence();
    const freshData = JSON.parse(JSON.stringify(FALLBACK_PETITIONS));
    setPetitions(freshData);
    setSanity(100);
    setActivePetitionId(freshData[0]._id);
    setStatusFilter("all");
    setWorkflowLogs(JSON.parse(JSON.stringify(FALLBACK_WORKFLOW_HISTORY)));
    setSystemAlert("BUREAUCRACY REBOOTED // ALL TEMPORAL MATRICES RESTORED TO 100%");
  }, []);

  // Restore sanity via ritual sedative
  const handleRestoreSanity = useCallback(() => {
    soundEngine.playKeyClick();
    soundEngine.playSanction();
    setSanity(100);
    setSystemAlert("SEDATIVE CONSUMED: SANITY RESYNCHRONIZED TO 100 PSY-UNITS.");
  }, []);

  // Toggle Audio Mute and Ambient Cosmic Drone
  const handleToggleMute = useCallback(() => {
    const nextMute = !isAudioMuted;
    setIsAudioMuted(nextMute);
    soundEngine.setMuted(nextMute);
    if (!nextMute) {
      soundEngine.playKeyClick();
      soundEngine.startCosmicDrone();
    } else {
      soundEngine.stopCosmicDrone();
    }
  }, [isAudioMuted]);

  return (
    <CRTScreen
      ref={crtRef}
      isGlitching={isCritical}
      isPermanentGlitch={isSevereHazard}
      powerOn={isLoaded}
    >
      {/* Top Global Command Bar */}
      <nav className="p-2 sm:p-3 bg-void-900 border-b border-phosphor-dim/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono select-none">
        {/* Title & Live Status */}
        <div className="flex items-center space-x-3">
          <span className="text-sm font-bold text-phosphor-laser tracking-widest uppercase glow-text">
            CTHULHU&apos;S INBOX
          </span>
          <span className="hidden sm:inline-block text-phosphor-dark">|</span>
          <span className="hidden sm:inline-block text-[10px] text-phosphor-dim uppercase">
            SANITY PROTOCOL ACTIVE
          </span>
          {isSanityConfigured ? (
            <span className="px-1.5 py-0.5 border border-phosphor-base bg-phosphor-dim/40 text-[9px] text-phosphor-bright font-bold uppercase rounded-[2px]">
              SANITY CMS ONLINE
            </span>
          ) : (
            <span className="px-1.5 py-0.5 border border-eldritch-amber/50 bg-eldritch-amber/10 text-[9px] text-eldritch-amber uppercase rounded-[2px]">
              MOCK VOID CACHE ACTIVE
            </span>
          )}
        </div>

        {/* Global Action Toolbar */}
        <div className="flex items-center space-x-2">
          {/* Audio Toggle */}
          <button
            onClick={handleToggleMute}
            type="button"
            className="px-2.5 py-1 border border-phosphor-dim hover:border-phosphor-base text-phosphor-bright hover:bg-phosphor-dim/30 text-[10px] tracking-wider uppercase transition-colors"
          >
            {isAudioMuted ? "[AUDIO: MUTED]" : "[AUDIO: LIVE FX]"}
          </button>

          {/* Reset State Button */}
          <button
            onClick={handleResetSession}
            type="button"
            className="px-2.5 py-1 border border-eldritch-blood/70 hover:border-eldritch-blood text-eldritch-blood hover:bg-eldritch-blood/20 text-[10px] tracking-wider uppercase transition-colors"
          >
            [PURGE &amp; RESET MATRIX]
          </button>
        </div>
      </nav>

      {/* Sanity Meter & Diagnostic Strip with Projected Active Drain */}
      <section className="p-2 sm:p-3 bg-void-950 border-b border-phosphor-dim/80">
        <SanityMeter
          sanity={sanity}
          maxSanity={100}
          activePetitionDrain={activePetition ? activePetition.sanityDrain : 0}
          activePetitionTitle={activePetition ? activePetition.title : undefined}
          onRestoreSanity={handleRestoreSanity}
          onTriggerGlitch={(intensity) => crtRef.current?.triggerRealityGlitch(intensity)}
        />
      </section>

      {/* Statistics Ticker Bar */}
      <section className="bg-void-900/90 border-b border-phosphor-dim/60 px-3 py-1.5 flex flex-wrap items-center justify-between text-[11px] font-mono text-phosphor-dim gap-2">
        <div className="flex items-center space-x-4">
          <span>
            QUEUE: <strong className="text-phosphor-bright">{stats.total}</strong>
          </span>
          <span>
            PENDING:{" "}
            <strong className="text-eldritch-amber">{stats.pending}</strong>
          </span>
          <span>
            SANCTIONED:{" "}
            <strong className="text-phosphor-laser">{stats.sanctioned}</strong>
          </span>
          <span>
            SMITED:{" "}
            <strong className="text-eldritch-blood">{stats.smited}</strong>
          </span>
          <span>
            MADNESS:{" "}
            <strong className="text-eldritch-purple">{stats.drivenMad}</strong>
          </span>
        </div>

        {systemAlert && (
          <div className="text-[10px] text-phosphor-laser font-bold uppercase tracking-wider animate-pulse truncate max-w-sm">
            &gt;&gt; {systemAlert}
          </div>
        )}
      </section>

      {/* Main Terminal Grid (Sidebar Queue + Document Workspace) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Sidebar Petition List */}
        <PetitionList
          petitions={petitions}
          activePetitionId={activePetitionId}
          onSelectPetition={(p) => setActivePetitionId(p._id)}
          statusFilter={statusFilter}
          onFilterChange={(f) => setStatusFilter(f)}
        />

        {/* Central Petition Terminal Workspace */}
        <PetitionViewer
          petition={activePetition}
          currentSanity={sanity}
          isProcessing={isProcessing}
          onAction={handleWorkflowAction}
        />

        {/* Full Cognitive Collapse Screen Overlay when Sanity <= 0 */}
        {isCompletelyLost && (
          <div className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-6 text-center border-4 border-eldritch-blood animate-screen-shake">
            <div className="text-5xl text-eldritch-blood mb-4 animate-bounce">
              👁 𐍈 ☠ 𐍈 👁
            </div>
            <h2
              className="text-2xl sm:text-3xl font-mono font-bold text-eldritch-blood tracking-widest uppercase mb-3 glow-blood glitch-text"
              data-text="TOTAL CEREBRAL EXTINCTION"
            >
              TOTAL CEREBRAL EXTINCTION
            </h2>
            <p className="text-xs sm:text-sm text-phosphor-bright font-mono max-w-lg mb-6 leading-relaxed">
              Your mortal synapses have liquified under the weight of
              non-Euclidean administrative jurisprudence. The cosmos continues
              unsupervised while your soul is filed under &quot;Misplaced
              Vouchers&quot;.
            </p>
            <button
              onClick={handleResetSession}
              type="button"
              className="px-6 py-3 border-2 border-phosphor-base bg-phosphor-dim/40 text-phosphor-bright hover:bg-phosphor-base hover:text-black font-mono font-bold text-sm tracking-widest uppercase transition-all shadow-phosphor-bright"
            >
              [REBOOT MIND &amp; RESET BUREAUCRACY]
            </button>
          </div>
        )}
      </div>

      {/* Bottom GROQ-powered Workflows Log Window */}
      <WorkflowLog logs={workflowLogs} isLoading={isLogsLoading} />
    </CRTScreen>
  );
}
