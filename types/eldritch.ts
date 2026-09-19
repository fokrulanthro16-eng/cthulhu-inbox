export type DangerLevel =
  | "Class-1 Infestation"
  | "Cataclysm"
  | "Total Reality Collapse";

export type PetitionStatus =
  | "pending"
  | "sanctioned"
  | "smited"
  | "driven_mad";

export type WorkflowAction = "sanction" | "smite" | "drive_mad";

export interface Petitioner {
  name: string;
  realm: string;
  dangerLevel: DangerLevel;
}

export interface EldritchPetition {
  _id: string;
  title: string;
  petitioner: Petitioner;
  plea: string;
  demandedSacrifice: string;
  sanityDrain: number; // 1 - 30
  status: PetitionStatus;
  reviewNotes?: string;
  createdAt?: string;
}

export interface BureaucracyStats {
  sanctionedCount: number;
  smitedCount: number;
  drivenMadCount: number;
  pendingCount: number;
  currentSanity: number;
}

export interface WorkflowHistoryEntry {
  _id: string;
  _type: "workflowHistory";
  _createdAt: string;
  petitionId: string;
  action: WorkflowAction;
  actionLabel: string;
  arbiterCite: number;
  sanityDrain: number;
  formattedEntry: string;
}
