"use client";

import React from "react";
import { EldritchPetition, DangerLevel, PetitionStatus } from "@/types/eldritch";
import { soundEngine } from "@/lib/soundEngine";

interface PetitionListProps {
  petitions: EldritchPetition[];
  activePetitionId: string | null;
  onSelectPetition: (petition: EldritchPetition) => void;
  statusFilter: PetitionStatus | "all";
  onFilterChange: (filter: PetitionStatus | "all") => void;
}

export const PetitionList: React.FC<PetitionListProps> = ({
  petitions,
  activePetitionId,
  onSelectPetition,
  statusFilter,
  onFilterChange,
}) => {
  const getDangerBadge = (danger: DangerLevel): { badge: string; border: string; glow: string } => {
    switch (danger) {
      case "Total Reality Collapse":
        return {
          badge: "bg-eldritch-blood/20 text-eldritch-blood",
          border: "border-eldritch-blood",
          glow: "glow-blood",
        };
      case "Cataclysm":
        return {
          badge: "bg-eldritch-amber/20 text-eldritch-amber",
          border: "border-eldritch-amber",
          glow: "glow-amber",
        };
      case "Class-1 Infestation":
      default:
        return {
          badge: "bg-phosphor-dim/30 text-phosphor-bright",
          border: "border-phosphor-dark",
          glow: "glow-text",
        };
    }
  };

  const getStatusBadge = (status: PetitionStatus): { text: string; style: string } => {
    switch (status) {
      case "sanctioned":
        return {
          text: "[SANCTIONED]",
          style: "text-phosphor-laser border-phosphor-base bg-phosphor-dim/30",
        };
      case "smited":
        return {
          text: "[SMITED]",
          style: "text-eldritch-blood border-eldritch-blood bg-eldritch-blood/20",
        };
      case "driven_mad":
        return {
          text: "[MADNESS]",
          style: "text-eldritch-purple border-eldritch-purple bg-eldritch-purple/20",
        };
      case "pending":
      default:
        return {
          text: "[PENDING]",
          style: "text-eldritch-amber border-eldritch-amber bg-eldritch-amber/15 animate-pulse",
        };
    }
  };

  const filteredPetitions = petitions.filter((p) =>
    statusFilter === "all" ? true : p.status === statusFilter
  );

  const handleSelect = (p: EldritchPetition) => {
    soundEngine.playKeyClick();
    onSelectPetition(p);
  };

  const handleFilterClick = (filter: PetitionStatus | "all") => {
    soundEngine.playKeyClick();
    onFilterChange(filter);
  };

  return (
    <aside className="w-full lg:w-80 flex flex-col border-b lg:border-b-0 lg:border-r border-phosphor-dim bg-void-900/90 h-full select-none">
      {/* Sidebar Header */}
      <div className="p-3 border-b border-phosphor-dim/80 bg-void-950">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold tracking-widest text-phosphor-laser uppercase glow-text">
            INBOX QUEUE ({filteredPetitions.length})
          </span>
          <span className="text-[10px] text-phosphor-dim font-mono">
            PORT: VOID-22
          </span>
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap gap-1">
          {(["all", "pending", "sanctioned", "smited", "driven_mad"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterClick(filter)}
              type="button"
              className={`text-[10px] px-2 py-0.5 border font-mono uppercase transition-colors ${
                statusFilter === filter
                  ? "border-phosphor-base bg-phosphor-dim/40 text-phosphor-bright font-bold shadow-[0_0_6px_#00ff66]"
                  : "border-phosphor-dim/40 text-phosphor-dim hover:text-phosphor-base hover:border-phosphor-dim"
              }`}
            >
              {filter.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Petition List Scroll Area */}
      <div className="flex-1 overflow-y-auto divide-y divide-phosphor-dim/40">
        {filteredPetitions.length === 0 ? (
          <div className="p-6 text-center text-xs text-phosphor-dim font-mono">
            [NO PETITIONS MATCHING FILTER IN ABYSSAL QUEUE]
          </div>
        ) : (
          filteredPetitions.map((petition) => {
            const isSelected = petition._id === activePetitionId;
            const dangerStyle = getDangerBadge(petition.petitioner.dangerLevel);
            const statusInfo = getStatusBadge(petition.status);

            return (
              <button
                key={petition._id}
                onClick={() => handleSelect(petition)}
                type="button"
                className={`w-full text-left p-3 transition-all duration-150 flex flex-col gap-1.5 focus:outline-none ${
                  isSelected
                    ? "bg-phosphor-dim/30 border-l-4 border-l-phosphor-base shadow-inner"
                    : "hover:bg-void-850 border-l-4 border-l-transparent"
                }`}
              >
                {/* Header: Status and Danger Level */}
                <div className="flex items-center justify-between text-[10px] w-full">
                  <span
                    className={`px-1.5 py-0.5 border font-mono uppercase font-bold tracking-wider rounded-[2px] ${statusInfo.style}`}
                  >
                    {statusInfo.text}
                  </span>

                  <span
                    className={`px-1.5 py-0.5 border font-mono tracking-wider rounded-[2px] ${dangerStyle.border} ${dangerStyle.badge}`}
                  >
                    {petition.petitioner.dangerLevel}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className={`text-xs font-mono font-bold line-clamp-1 leading-snug ${
                    isSelected
                      ? "text-phosphor-laser glow-text"
                      : "text-phosphor-bright"
                  }`}
                >
                  {petition.title}
                </h3>

                {/* Petitioner and Realm */}
                <div className="flex items-center justify-between text-[11px] text-phosphor-dark font-mono">
                  <span className="truncate max-w-[140px]">
                    BY: {petition.petitioner.name}
                  </span>
                  <span className="text-[10px] text-eldritch-amber">
                    DRAIN: -{petition.sanityDrain} PSY
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Footer Diagnostic info */}
      <div className="p-2 border-t border-phosphor-dim/60 bg-void-950 text-[10px] text-phosphor-dim flex justify-between">
        <span>AWAITING OATHS</span>
        <span className="animate-pulse">PARSER: IDLE</span>
      </div>
    </aside>
  );
};
