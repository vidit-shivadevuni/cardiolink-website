/**
 * Fictional, illustrative data for the clinician workspace demo.
 * Nothing here describes a real person, device or clinical record.
 */

export const TODAY = "Wednesday, 14 October 2026";
export const CLINICIAN = { name: "Dr. Elena Lee", initials: "EL", email: "elena.lee@example.test", role: "Clinician · Cardiology" };

/** The one patient with a full illustrative record. */
export const FEATURED_PATIENT_ID = "demo-2048";

export type PatientStatus = "For review" | "On track";

export type Patient = {
  id: string;
  name: string;
  status: PatientStatus;
  bp: string;
  /** Sortable check-in time (ISO) and its display label. */
  checkIn: string;
  checkInLabel: string;
  /** Days from today until the next review (negative = overdue). */
  reviewInDays: number;
  nextReview: string;
  age: number;
};

const P = (
  n: number,
  name: string,
  status: PatientStatus,
  bp: string,
  checkIn: string,
  checkInLabel: string,
  reviewInDays: number,
  nextReview: string,
  age: number,
): Patient => ({ id: `demo-${n}`, name, status, bp, checkIn, checkInLabel, reviewInDays, nextReview, age });

export const PATIENTS: Patient[] = [
  P(2048, "Alex Morgan", "For review", "152 / 94 mmHg", "2026-10-14T09:42", "14 Oct · 09:42", 0, "Today · Dr. Elena Lee", 58),
  P(2051, "Jamie Patel", "For review", "146 / 90 mmHg", "2026-10-13T18:15", "13 Oct · 18:15", -1, "Overdue · 13 Oct", 63),
  P(2063, "Taylor Brooks", "On track", "124 / 78 mmHg", "2026-10-14T08:20", "14 Oct · 08:20", 7, "21 Oct · Nurse Park", 51),
  P(2070, "Sam Rivera", "On track", "128 / 82 mmHg", "2026-10-14T07:55", "14 Oct · 07:55", 8, "22 Oct · Dr. Elena Lee", 47),
  P(2082, "Robin Chen", "For review", "138 / 86 mmHg", "2026-10-12T16:10", "12 Oct · 16:10", 0, "Today · Nurse Park", 69),
  P(2087, "Jordan Ellis", "On track", "121 / 77 mmHg", "2026-10-14T07:30", "14 Oct · 07:30", 9, "23 Oct · Dr. Noah Wilson", 55),
  P(2090, "Casey Nguyen", "On track", "126 / 80 mmHg", "2026-10-13T20:05", "13 Oct · 20:05", 10, "24 Oct · Nurse Park", 61),
  P(2094, "Morgan Blake", "On track", "130 / 84 mmHg", "2026-10-13T08:45", "13 Oct · 08:45", 13, "27 Oct · Dr. Elena Lee", 66),
  P(2101, "Riley Adams", "On track", "119 / 75 mmHg", "2026-10-14T06:58", "14 Oct · 06:58", 14, "28 Oct · Dr. Noah Wilson", 44),
  P(2105, "Avery Santos", "On track", "127 / 81 mmHg", "2026-10-12T19:20", "12 Oct · 19:20", 15, "29 Oct · Nurse Park", 59),
  P(2112, "Quinn Harper", "On track", "123 / 79 mmHg", "2026-10-14T08:02", "14 Oct · 08:02", 16, "30 Oct · Dr. Elena Lee", 72),
  P(2118, "Drew Kim", "On track", "129 / 83 mmHg", "2026-10-13T07:40", "13 Oct · 07:40", 20, "03 Nov · Dr. Noah Wilson", 53),
  P(2123, "Parker Reed", "On track", "125 / 80 mmHg", "2026-10-11T18:35", "11 Oct · 18:35", 21, "04 Nov · Nurse Park", 64),
  P(2127, "Hayden Cole", "On track", "122 / 78 mmHg", "2026-10-14T07:12", "14 Oct · 07:12", 22, "05 Nov · Dr. Elena Lee", 49),
  P(2130, "Rowan Price", "On track", "131 / 85 mmHg", "2026-10-13T21:10", "13 Oct · 21:10", 23, "06 Nov · Dr. Noah Wilson", 70),
  P(2136, "Emerson Fox", "On track", "120 / 76 mmHg", "2026-10-12T08:25", "12 Oct · 08:25", 24, "07 Nov · Nurse Park", 57),
  P(2141, "Sage Turner", "On track", "126 / 82 mmHg", "2026-10-14T09:05", "14 Oct · 09:05", 27, "10 Nov · Dr. Elena Lee", 62),
  P(2147, "Reese Morales", "On track", "124 / 79 mmHg", "2026-10-13T17:50", "13 Oct · 17:50", 28, "11 Nov · Dr. Noah Wilson", 68),
  P(2152, "Logan Hayes", "On track", "128 / 81 mmHg", "2026-10-11T07:15", "11 Oct · 07:15", 29, "12 Nov · Nurse Park", 45),
  P(2158, "Finley Ward", "On track", "121 / 77 mmHg", "2026-10-14T06:40", "14 Oct · 06:40", 30, "13 Nov · Dr. Elena Lee", 52),
  P(2163, "Blair Jensen", "On track", "127 / 80 mmHg", "2026-10-12T20:30", "12 Oct · 20:30", 31, "14 Nov · Dr. Noah Wilson", 60),
  P(2169, "Kendall Shaw", "On track", "123 / 78 mmHg", "2026-10-13T09:55", "13 Oct · 09:55", 34, "17 Nov · Nurse Park", 67),
  P(2174, "Ashton Gray", "On track", "125 / 81 mmHg", "2026-10-14T08:48", "14 Oct · 08:48", 35, "18 Nov · Dr. Elena Lee", 56),
  P(2180, "Peyton Lane", "On track", "129 / 84 mmHg", "2026-10-12T07:05", "12 Oct · 07:05", 36, "19 Nov · Dr. Noah Wilson", 71),
];

export function findPatient(id: string) {
  return PATIENTS.find((p) => p.id === id.toLowerCase());
}

export function patientCode(id: string) {
  return id.toUpperCase();
}

/* ------------------------------------------------------------------ */
/* Review signals (Needs clinical review)                              */
/* ------------------------------------------------------------------ */

export type SignalId = "bp-trend" | "medication-allergy" | "alcohol-use";

export type Signal = {
  id: SignalId;
  title: string;
  icon: "triangle-alert" | "shield-alert";
  summary: string;
  /** Wording used on the original longitudinal dashboard card. */
  dashboardSummary: string;
  latest: string[];
  why: string;
  context: string;
  defaultOutcome: string;
  noteHint: string;
};

export const SIGNALS: Signal[] = [
  {
    id: "bp-trend",
    title: "BP trend rising",
    icon: "triangle-alert",
    summary: "Home reading · 14 Oct · +24 mmHg systolic since 02 Sep",
    dashboardSummary: "Home reading · 14 Oct · +24 mmHg systolic since 02 Sep",
    latest: ["Latest reading: 152/94 mmHg", "14 Oct 2026 · 09:42 · Home reading", "Baseline: 128/80 mmHg · 02 Sep 2026"],
    why: "A rising sequence of reported readings was flagged for clinician review. This is not an automated diagnosis.",
    context:
      "Patient reported reduced sleep and a possible medication reaction. These reports have not been clinically verified.",
    defaultOutcome: "Follow-up arranged",
    noteHint: "Confirm technique and discuss reported reaction.",
  },
  {
    id: "medication-allergy",
    title: "Possible medication–allergy conflict",
    icon: "shield-alert",
    summary: "Clinical record + patient reported · Reaction unconfirmed",
    dashboardSummary: "Clinical record + patient reported · reconcile rash / allergy entry",
    latest: [
      "Record: penicillin allergy (rash) · 2019",
      "14 Oct 2026 · Patient reported a rash after a new medication",
      "Reaction unconfirmed · source: patient check-in",
    ],
    why: "A patient-reported reaction overlaps with an allergy entry in the clinical record. It was flagged so the record can be reconciled. This is not an automated diagnosis.",
    context:
      "The reaction is self-reported and has not been examined. Medication names and dates should be confirmed with the patient and the prescribing record.",
    defaultOutcome: "Reconcile at follow-up",
    noteHint: "Confirm medication, timing and reaction; update allergy entry if needed.",
  },
  {
    id: "alcohol-use",
    title: "Alcohol-use pattern increasing",
    icon: "triangle-alert",
    summary: "Patient reported · 16 Sep · Confirm at follow-up",
    dashboardSummary: "Patient reported · 16 Sep · confirm pattern at follow-up",
    latest: [
      "Reported: 10–12 units / week",
      "16 Sep 2026 · Patient check-in",
      "Previously: 4–6 units / week · 01 Sep 2026",
    ],
    why: "Weekly check-ins show an increase in reported alcohol use. It was flagged for a supportive conversation at follow-up. This is not an automated diagnosis.",
    context:
      "The increase coincides with reported reduced sleep and stress. Timing alone does not show cause; confirm the pattern with the patient.",
    defaultOutcome: "Discuss at follow-up",
    noteHint: "Discuss pattern, offer support resources and recheck at next review.",
  },
];

export const REVIEW_OUTCOMES = [
  "Follow-up arranged",
  "Reconcile at follow-up",
  "Discuss at follow-up",
  "No action needed",
  "Escalated to care team",
];

/* ------------------------------------------------------------------ */
/* Follow-up                                                           */
/* ------------------------------------------------------------------ */

export type FollowUpItem = {
  patientId: string;
  patient: string;
  title: string;
  when: string;
  owner: string;
  inDays: number;
  overdue?: boolean;
};

export const FOLLOW_UPS: FollowUpItem[] = [
  { patientId: "demo-2051", patient: "Jamie Patel", title: "Medication follow-up", when: "Due 13 Oct", owner: "Dr. Elena Lee", inDays: -1, overdue: true },
  { patientId: "demo-2048", patient: "Alex Morgan", title: "BP trend review", when: "Today, 14 Oct · 14:30", owner: "Dr. Elena Lee", inDays: 0 },
  { patientId: "demo-2082", patient: "Robin Chen", title: "Check-in review", when: "Today, 14 Oct · 16:00", owner: "Nurse Park", inDays: 0 },
  { patientId: "demo-2063", patient: "Taylor Brooks", title: "Routine follow-up", when: "21 Oct · 10:00", owner: "Nurse Park", inDays: 7 },
];

/* ------------------------------------------------------------------ */
/* Care team                                                           */
/* ------------------------------------------------------------------ */

export const CARE_TEAM = [
  { name: "Dr. Elena Lee", role: "Lead clinician", scope: "Clinical review, assessment scheduling and care-plan approval" },
  { name: "Nurse Mina Park", role: "Care coordinator", scope: "Check-in follow-up, patient invitations and team messaging" },
  { name: "Dr. Noah Wilson", role: "Clinician", scope: "Clinical review and care-plan updates" },
  { name: "Avery Quinn", role: "Administrator", scope: "Workspace membership only; no routine clinical review" },
];

/* ------------------------------------------------------------------ */
/* Documents and care plan                                             */
/* ------------------------------------------------------------------ */

export const DOCUMENTS = [
  { id: "visit-summary", title: "Cardiology visit summary", date: "12 Oct 2026", type: "PDF", visibility: "Shared with patient" },
  { id: "bp-guidance", title: "Home BP guidance", date: "02 Sep 2026", type: "Care instructions", visibility: "Shared with patient" },
  { id: "team-note", title: "Care team handover note", date: "14 Oct 2026", type: "Note", visibility: "Care team only" },
];

export const CARE_PLAN_GOALS = [
  { title: "Home blood pressure", detail: "Measure twice daily for 7 days before each review · Target below 135/85 mmHg" },
  { title: "Weekly check-in", detail: "Mood, sleep, symptoms and alcohol use · Every Monday" },
  { title: "Follow-up conversation", detail: "Discuss sleep, reported reaction and alcohol use · 14 Oct 2026" },
];

/* ------------------------------------------------------------------ */
/* Notifications                                                       */
/* ------------------------------------------------------------------ */

export const NOTIFICATIONS = [
  { id: "n1", title: "Alex Morgan · BP trend rising", detail: "New home reading flagged for review · Today 09:42", href: "/workspace/patients/demo-2048/review/bp-trend", unread: true },
  { id: "n2", title: "Jamie Patel · Follow-up overdue", detail: "Medication follow-up was due 13 Oct", href: "/workspace/follow-up", unread: true },
  { id: "n3", title: "Robin Chen · Check-in submitted", detail: "Weekly check-in ready for review · 12 Oct 16:10", href: "/workspace/patients/demo-2082", unread: true },
  { id: "n4", title: "Taylor Brooks · Check-in submitted", detail: "Weekly check-in · On track · 14 Oct 08:20", href: "/workspace/patients/demo-2063", unread: false },
];
