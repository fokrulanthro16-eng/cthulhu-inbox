import { createClient, type SanityClient } from "@sanity/client";
import {
  EldritchPetition,
  WorkflowAction,
  PetitionStatus,
  WorkflowHistoryEntry,
} from "@/types/eldritch";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN || "";
const apiVersion = "2024-03-01";

export const isSanityConfigured = Boolean(
  projectId && projectId.trim() !== "" && projectId !== "placeholder"
);

export const sanityClient: SanityClient | null = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token: token || undefined,
    })
  : null;

export const FALLBACK_PETITIONS: EldritchPetition[] = [
  {
    _id: "PID-1099-VOID",
    title: "Form 1099-VOID: Request to Replace Lunar Orb with Beating Geometrical Eye",
    petitioner: {
      name: "High Cultist Ephraim Waite",
      realm: "Innsmouth Municipal District 4",
      dangerLevel: "Cataclysm",
    },
    plea: "The existing lunar satellite fails to evoke adequate nocturnal dread across the populace. Replacing it with an unblinking, blood-weeping Euclidean iris will improve parishioner compliance by 34.7% and simplify tide-based high-priest convocations. Arkham zoning permits have already been bribed with eldritch doubloons.",
    demandedSacrifice: "3,000 barrels of brine-pickled herring, 12 non-Euclidean angles, and Arkham's Deputy Chief Town Clerk.",
    sanityDrain: 18,
    status: "pending",
    reviewNotes: "Pending review by the Slumbering Lord of R'lyeh. Smells faintly of salt marsh.",
    createdAt: "2026-09-19T08:14:00.000Z",
  },
  {
    _id: "PID-002-NOISE",
    title: "Inter-Dimensional Noise Citation: Azathoth's Flute Rehearsals Exceed 140dB",
    petitioner: {
      name: "Wilbur Whateley",
      realm: "Dunwich Back-Alley Sub-Spacetime",
      dangerLevel: "Class-1 Infestation",
    },
    plea: "Azathoth's blind idiot drummers have been practicing polyrhythmic blast beats in the nuclear chaos adjacent to our dimension between 2:00 AM and 5:30 AM. Dunwich livestock are dissolving into geometry prematurely. Requesting a formal Cease-and-Desist injunction or at least municipal acoustic damping basalt monoliths.",
    demandedSacrifice: "A 90-minute cassette tape of Gregorian chants played backward at 78 RPM and 400 litres of primordial sludge.",
    sanityDrain: 11,
    status: "pending",
    reviewNotes: "Complainant is known to harbor extra-dimensional half-brothers in the barn loft.",
    createdAt: "2026-09-19T09:30:00.000Z",
  },
  {
    _id: "PID-884-CARCOSA",
    title: "Emergency Infringement: The Yellow King Siphoned Our Dimensional Wi-Fi",
    petitioner: {
      name: "Archivist Barnabas Marsh",
      realm: "Carcosa Demilitarized Zone (Sub-ether)",
      dangerLevel: "Total Reality Collapse",
    },
    plea: "Hastur has erected an unauthorized repeater monolith behind the Great Library. He is parasitically siphoning 850 Tbps of cosmic bandwidth to broadcast four-dimensional theater productions of 'The King in Yellow' in uncompressed 16K HDR. Telepathic packet loss has surged to 89%.",
    demandedSacrifice: "The royal seal of Lake Hali, 9 metric tons of pallid silk, and the senior network engineer's astral spleen.",
    sanityDrain: 27,
    status: "pending",
    reviewNotes: "CRITICAL: Do not speak the king's name three times over the intercom system.",
    createdAt: "2026-09-19T10:02:00.000Z",
  },
  {
    _id: "PID-007-STAIRS",
    title: "Building Variance: Cyclopean Staircase with Inverted Temporal Incline",
    petitioner: {
      name: "Architect Zadok Allen",
      realm: "R'lyeh Deep Trench Ward 7",
      dangerLevel: "Class-1 Infestation",
    },
    plea: "Applying for retroactive variance regarding a grand staircase where each riser occupies two disparate centuries simultaneously and slopes recursively into the observer's childhood guilt. Several juvenile Shoggoths have sustained ankle sprains while descending in 4D space.",
    demandedSacrifice: "4 dozen fresh souls of certified OSHA safety auditors and one ceremonial jar of green ichor.",
    sanityDrain: 8,
    status: "pending",
    reviewNotes: "The masonry is undeniably basalt, but the angle of repose offends conventional trigonometry.",
    createdAt: "2026-09-19T10:45:00.000Z",
  },
];

export const FALLBACK_WORKFLOW_HISTORY: WorkflowHistoryEntry[] = [
  {
    _id: "wf-log-init-3",
    _type: "workflowHistory",
    _createdAt: "2026-09-19T07:45:12.000Z",
    petitionId: "PID-904-SHUB",
    action: "sanction",
    actionLabel: "Sanctioned Doom",
    arbiterCite: 3,
    sanityDrain: 22,
    formattedEntry: "[07:45:12] PID-904-SHUB: Sanctioned Doom by Arbiter [cite: 3]. Sanity Drain: -22.",
  },
  {
    _id: "wf-log-init-2",
    _type: "workflowHistory",
    _createdAt: "2026-09-19T06:12:44.000Z",
    petitionId: "PID-551-DAGON",
    action: "smite",
    actionLabel: "Smited into Ash",
    arbiterCite: 5,
    sanityDrain: 0,
    formattedEntry: "[06:12:44] PID-551-DAGON: Smited into Ash by Arbiter [cite: 5]. Sanity Drain: -0.",
  },
  {
    _id: "wf-log-init-1",
    _type: "workflowHistory",
    _createdAt: "2026-09-19T05:01:19.000Z",
    petitionId: "PID-332-NYARL",
    action: "drive_mad",
    actionLabel: "Inflicted Madness",
    arbiterCite: 9,
    sanityDrain: 0,
    formattedEntry: "[05:01:19] PID-332-NYARL: Inflicted Madness by Arbiter [cite: 9]. Sanity Drain: -0.",
  },
];

export const actionToStatusMap: Record<WorkflowAction, PetitionStatus> = {
  sanction: "sanctioned",
  smite: "smited",
  drive_mad: "driven_mad",
};

/**
 * Fetch the last 10 workflow logs from Sanity using GROQ ordered by _createdAt desc.
 */
export async function fetchWorkflowHistory(): Promise<WorkflowHistoryEntry[]> {
  if (sanityClient && isSanityConfigured) {
    try {
      const groqQuery = `*[_type == "workflowHistory"] | order(_createdAt desc)[0...10]`;
      const data = await sanityClient.fetch<WorkflowHistoryEntry[]>(groqQuery);
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn("[Sanity] GROQ query for workflowHistory failed, using local cache:", err);
    }
  }

  return JSON.parse(JSON.stringify(FALLBACK_WORKFLOW_HISTORY));
}

/**
 * Transition handler that applies optimistic status updates, creates a workflowHistory
 * entry in Sanity, and updates the local state in real time.
 */
export async function transitionPetitionWorkflow(
  id: string,
  action: WorkflowAction,
  sanityDrain: number = 0,
  customNotes?: string
): Promise<{
  success: boolean;
  targetStatus: PetitionStatus;
  updatedNotes: string;
  newWorkflowEntry: WorkflowHistoryEntry;
}> {
  const targetStatus = actionToStatusMap[action];
  const now = new Date();
  const timestampIso = now.toISOString();
  const timeFormatted = now.toTimeString().split(" ")[0]; // HH:MM:SS
  const citeNumber = Math.floor(Math.random() * 12) + 1;

  const actionLabels: Record<WorkflowAction, string> = {
    sanction: "Sanctioned Doom",
    smite: "Smited into Cinders",
    drive_mad: "Inflicted Non-Euclidean Madness",
  };

  const appliedDrain = action === "sanction" ? sanityDrain : 0;
  const actionLabel = actionLabels[action];

  // Exact required format:
  // [TIME] PID-1099-VOID: Sanctioned Doom by Arbiter [cite: 7]. Sanity Drain: -20.
  const formattedEntry = `[${timeFormatted}] ${id.toUpperCase()}: ${actionLabel} by Arbiter [cite: ${citeNumber}]. Sanity Drain: -${appliedDrain}.`;

  const newWorkflowEntry: WorkflowHistoryEntry = {
    _id: `wf-log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    _type: "workflowHistory",
    _createdAt: timestampIso,
    petitionId: id,
    action,
    actionLabel,
    arbiterCite: citeNumber,
    sanityDrain: appliedDrain,
    formattedEntry,
  };

  const actionMessages: Record<WorkflowAction, string> = {
    sanction: `[SANCTIONED - ${timestampIso}] By royal decree of the Abyssal Seat: The plea is ratified. The sacrifice is collected. Reality bends accordingly.`,
    smite: `[SMITED - ${timestampIso}] By thunderous rejection: Petitioner dissolved into radioactive ash. The plea is struck from the Great Ledger.`,
    drive_mad: `[MADNESS INFLICTED - ${timestampIso}] By eldritch irradiation: Petitioner's cognition shattered into crystalline fractals. They now babble in ancient Sumerian dialects.`,
  };

  const updatedNotes = customNotes || actionMessages[action];

  if (sanityClient && isSanityConfigured) {
    try {
      // 1. Patch the petition document in Sanity
      await sanityClient
        .patch(id)
        .set({
          status: targetStatus,
          reviewNotes: updatedNotes,
          reviewedAt: timestampIso,
        })
        .commit();

      // 2. Append new log to workflowHistory in Sanity
      await sanityClient.create({
        _type: "workflowHistory",
        petitionId: id,
        action,
        actionLabel,
        arbiterCite: citeNumber,
        sanityDrain: appliedDrain,
        formattedEntry,
        _createdAt: timestampIso,
      });

      return { success: true, targetStatus, updatedNotes, newWorkflowEntry };
    } catch (err) {
      console.warn(
        `[Sanity] Remote patch or workflowHistory commit failed for petition ${id}. Proceeding with local optimistic state:`,
        err
      );
      return { success: true, targetStatus, updatedNotes, newWorkflowEntry };
    }
  }

  // Graceful local fallback
  return { success: true, targetStatus, updatedNotes, newWorkflowEntry };
}

/**
 * Fetch petitions: Queries Sanity if configured, otherwise returns local fallback clone.
 */
export async function fetchPetitions(): Promise<EldritchPetition[]> {
  if (sanityClient && isSanityConfigured) {
    try {
      const query = `*[_type == "eldritchPetition"] | order(createdAt desc)`;
      const data = await sanityClient.fetch<EldritchPetition[]>(query);
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn("[Sanity] Remote query failed, falling back to local dataset:", err);
    }
  }

  return JSON.parse(JSON.stringify(FALLBACK_PETITIONS));
}
