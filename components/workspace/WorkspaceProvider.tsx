"use client";

/**
 * In-memory state for the illustrative clinician workspace.
 * It lives in the /workspace layout, so it survives navigation between pages
 * and resets on a full reload. Nothing is sent to a server.
 */

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { NOTIFICATIONS, type SignalId } from "@/lib/demo-data";

export type ReviewRecord = { outcome: string; note: string; author: string; at: string };
export type DialogName = "invite" | "review-note" | "schedule" | "clinical-record" | "date-range" | null;
export type DateRange = { label: string; start: string; end: string };

type WorkspaceState = {
  reviews: Partial<Record<SignalId, ReviewRecord>>;
  markReviewed: (id: SignalId, outcome: string, note: string) => void;
  openSignals: number;

  readIds: Set<string>;
  markRead: (id: string) => void;
  markAllRead: () => void;
  unreadCount: number;

  dialog: DialogName;
  openDialog: (name: Exclude<DialogName, null>) => void;
  closeDialog: () => void;

  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;

  profileName: string;
  setProfileName: (name: string) => void;
  emailNotifications: boolean;
  setEmailNotifications: (on: boolean) => void;
};

const Ctx = createContext<WorkspaceState | null>(null);

export const DEFAULT_RANGE: DateRange = { label: "6 weeks", start: "2026-09-02", end: "2026-10-14" };

export function nowStamp() {
  return "14 Oct 2026 · " + new Date().toTimeString().slice(0, 5);
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<WorkspaceState["reviews"]>({});
  const [readIds, setReadIds] = useState<Set<string>>(
    () => new Set(NOTIFICATIONS.filter((n) => !n.unread).map((n) => n.id)),
  );
  const [dialog, setDialog] = useState<DialogName>(null);
  const [dateRange, setDateRange] = useState<DateRange>(DEFAULT_RANGE);
  const [profileName, setProfileName] = useState("Dr. Elena Lee");
  const [emailNotifications, setEmailNotifications] = useState(true);

  const markReviewed = useCallback((id: SignalId, outcome: string, note: string) => {
    setReviews((prev) => ({ ...prev, [id]: { outcome, note, author: "Dr. Elena Lee", at: nowStamp() } }));
  }, []);
  const markRead = useCallback((id: string) => setReadIds((prev) => new Set(prev).add(id)), []);
  const markAllRead = useCallback(() => setReadIds(new Set(NOTIFICATIONS.map((n) => n.id))), []);

  const value = useMemo<WorkspaceState>(
    () => ({
      reviews,
      markReviewed,
      openSignals: 3 - Object.keys(reviews).length,
      readIds,
      markRead,
      markAllRead,
      unreadCount: NOTIFICATIONS.filter((n) => !readIds.has(n.id)).length,
      dialog,
      openDialog: setDialog,
      closeDialog: () => setDialog(null),
      dateRange,
      setDateRange,
      profileName,
      setProfileName,
      emailNotifications,
      setEmailNotifications,
    }),
    [reviews, markReviewed, readIds, markRead, markAllRead, dialog, dateRange, profileName, emailNotifications],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWorkspace() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWorkspace must be used inside WorkspaceProvider");
  return ctx;
}
