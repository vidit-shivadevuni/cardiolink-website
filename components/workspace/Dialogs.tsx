"use client";

/**
 * Workspace dialogs: invite patient, add review note, schedule assessment,
 * clinical record and date range. One instance lives in the workspace layout;
 * any page opens one through useWorkspace().openDialog(name).
 */

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { DEFAULT_RANGE, useWorkspace } from "./WorkspaceProvider";
import { Button, Confirmation, Dialog, Field, styles } from "./ui";

const PATIENT_CONTEXT = "Alex Morgan · DEMO-2048 · Fictional patient";

export function WorkspaceDialogs() {
  const { dialog, closeDialog } = useWorkspace();
  return (
    <>
      <InviteDialog open={dialog === "invite"} onClose={closeDialog} />
      <ReviewNoteDialog open={dialog === "review-note"} onClose={closeDialog} />
      <ScheduleDialog open={dialog === "schedule"} onClose={closeDialog} />
      <ClinicalRecordDialog open={dialog === "clinical-record"} onClose={closeDialog} />
      <DateRangeDialog open={dialog === "date-range"} onClose={closeDialog} />
    </>
  );
}

type Props = { open: boolean; onClose: () => void };

/** Simulates a request so the submitting state is visible and double submits are blocked. */
function useSubmit() {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const submit = (after?: () => void) => {
    if (state === "sending") return;
    setState("sending");
    setTimeout(() => {
      setState("done");
      after?.();
    }, 500);
  };
  return { state, submit, reset: () => setState("idle") };
}

function InviteDialog({ open, onClose }: Props) {
  const { state, submit, reset } = useSubmit();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const close = () => {
    onClose();
    reset();
    setErrors({});
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Enter the patient’s full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address.";
    setErrors(next);
    if (Object.keys(next).length === 0) submit();
  };

  return (
    <Dialog open={open} onClose={close} title="Invite patient" context="Fictional patient · Illustrative data">
      {state === "done" ? (
        <Confirmation
          title="Invitation sent"
          action={
            <Button
              onClick={() => {
                close();
                router.push("/workspace/patients");
              }}
            >
              Back to patients
            </Button>
          }
        >
          A secure invitation has been sent to {email}. The link expires in 7 days. The patient creates their own
          password, and their account stays linked to your care team.
        </Confirmation>
      ) : (
        <form className={styles.stack16} onSubmit={onSubmit} noValidate>
          <Field label="Patient full name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} placeholder="Alex Morgan" />
          <Field
            label="Patient email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            placeholder="alex.morgan@example.test"
            hint="The invitation link is single-use."
          />
          <label className={styles.field}>
            <span className={styles.label}>Assigned clinician</span>
            <select className={styles.input} defaultValue="Dr. Elena Lee">
              <option>Dr. Elena Lee</option>
              <option>Dr. Noah Wilson</option>
              <option>Nurse Mina Park</option>
            </select>
          </label>
          <p className={styles.muted11}>Patient accounts are invite-only. Patients only see their own shared records.</p>
          <div className={styles.dialogActions}>
            <Button variant="secondary" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" disabled={state === "sending"}>
              {state === "sending" ? "Sending…" : "Send invitation"}
            </Button>
          </div>
        </form>
      )}
    </Dialog>
  );
}

function ReviewNoteDialog({ open, onClose }: Props) {
  const { state, submit, reset } = useSubmit();
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const close = () => {
    onClose();
    reset();
    setError("");
    setNote("");
  };

  return (
    <Dialog open={open} onClose={close} title="Add review note" context={PATIENT_CONTEXT}>
      {state === "done" ? (
        <Confirmation
          title="Review note saved"
          action={
            <Button
              onClick={() => {
                close();
                router.push("/workspace/patients/demo-2048");
              }}
            >
              Return to patient
            </Button>
          }
        >
          Your note is recorded for Alex Morgan with care-team-only visibility. It will not appear in the patient
          portal. Recorded by Dr. Elena Lee.
        </Confirmation>
      ) : (
        <form
          className={styles.stack16}
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (!note.trim()) return setError("Enter a review note before saving.");
            submit();
          }}
        >
          <Field
            label="Review note"
            multiline
            value={note}
            onChange={(e) => setNote((e.target as unknown as HTMLTextAreaElement).value)}
            error={error}
            placeholder="Confirm technique and discuss reported reaction."
          />
          <label className={styles.field}>
            <span className={styles.label}>Related item</span>
            <select className={styles.input} defaultValue="BP trend rising">
              <option>BP trend rising</option>
              <option>Possible medication–allergy conflict</option>
              <option>Alcohol-use pattern increasing</option>
              <option>General note</option>
            </select>
          </label>
          <p className={styles.muted11}>Visibility: care team only.</p>
          <div className={styles.dialogActions}>
            <Button variant="secondary" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" disabled={state === "sending"}>
              {state === "sending" ? "Saving…" : "Save note"}
            </Button>
          </div>
        </form>
      )}
    </Dialog>
  );
}

function ScheduleDialog({ open, onClose }: Props) {
  const { state, submit, reset } = useSubmit();
  const [phq, setPhq] = useState(true);
  const [gad, setGad] = useState(true);
  const [due, setDue] = useState("2026-10-16");
  const [error, setError] = useState("");
  const router = useRouter();

  const chosen = [phq && "PHQ-9", gad && "GAD-7"].filter(Boolean).join(" and ");
  const dueLabel = new Date(`${due}T12:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  const close = () => {
    onClose();
    reset();
    setError("");
  };

  return (
    <Dialog open={open} onClose={close} title="Schedule assessment" context={PATIENT_CONTEXT}>
      {state === "done" ? (
        <Confirmation
          title="Assessment scheduled"
          action={
            <Button
              onClick={() => {
                close();
                router.push("/workspace/follow-up");
              }}
            >
              View follow-up
            </Button>
          }
        >
          {chosen} {chosen.includes("and") ? "are" : "is"} due {dueLabel}. Alex Morgan has been notified in the patient
          portal.
        </Confirmation>
      ) : (
        <form
          className={styles.stack16}
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (!phq && !gad) return setError("Choose at least one questionnaire.");
            if (!due) return setError("Choose a due date.");
            submit();
          }}
        >
          <fieldset className={styles.stack8} style={{ border: 0, padding: 0, margin: 0 }}>
            <legend className={styles.label} style={{ marginBottom: 8 }}>
              Questionnaires
            </legend>
            <label className={styles.checkbox}>
              <input type="checkbox" checked={phq} onChange={(e) => setPhq(e.target.checked)} />
              <span>
                <strong>PHQ-9</strong> · 9 questions · Past 2 weeks
              </span>
            </label>
            <label className={styles.checkbox}>
              <input type="checkbox" checked={gad} onChange={(e) => setGad(e.target.checked)} />
              <span>
                <strong>GAD-7</strong> · 7 questions · Past 2 weeks
              </span>
            </label>
          </fieldset>
          <Field label="Due date" type="date" value={due} min="2026-10-14" onChange={(e) => setDue(e.target.value)} />
          {error && <p className={styles.error}>{error}</p>}
          <p className={styles.muted11}>Scores are screening information, not a diagnosis.</p>
          <div className={styles.dialogActions}>
            <Button variant="secondary" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" disabled={state === "sending"}>
              {state === "sending" ? "Scheduling…" : "Schedule"}
            </Button>
          </div>
        </form>
      )}
    </Dialog>
  );
}

function ClinicalRecordDialog({ open, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose} title="Clinical record" context={PATIENT_CONTEXT} wide>
      <dl className={styles.recordGrid}>
        <dt>Conditions</dt>
        <dd>Hypertension · Atrial fibrillation</dd>
        <dt>Medications</dt>
        <dd>Illustrative antihypertensive · Illustrative anticoagulant</dd>
        <dt>Allergies</dt>
        <dd>Penicillin (rash) · recorded 2019</dd>
        <dt>Lifestyle</dt>
        <dd>Regular alcohol use · Sleep disturbance (patient reported)</dd>
        <dt>Last visit</dt>
        <dd>Cardiology visit · 12 Oct 2026 · Dr. Elena Lee</dd>
        <dt>Source</dt>
        <dd>Clinical record DEMO-2048 · Updated 12 Oct 2026, 15:20</dd>
      </dl>
      <p className={styles.muted11}>
        Fictional record for illustration only. Medication names are placeholders and must not be used for clinical
        decisions.
      </p>
      <div className={styles.dialogActions}>
        <Button onClick={onClose}>Close</Button>
      </div>
    </Dialog>
  );
}

const PRESETS = [
  { label: "2 weeks", start: "2026-09-30" },
  { label: "6 weeks", start: "2026-09-02" },
  { label: "3 months", start: "2026-07-14" },
];

function DateRangeDialog({ open, onClose }: Props) {
  const { dateRange, setDateRange } = useWorkspace();
  const [start, setStart] = useState(dateRange.start);
  const [end, setEnd] = useState(dateRange.end);
  const [error, setError] = useState("");

  const apply = (e: FormEvent) => {
    e.preventDefault();
    if (!start || !end) return setError("Choose a start and end date.");
    if (start > end) return setError("The start date must be before the end date.");
    const preset = PRESETS.find((p) => p.start === start && end === DEFAULT_RANGE.end);
    setDateRange({ label: preset?.label ?? "Custom", start, end });
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} title="Date range" context="Alex Morgan · Longitudinal dashboard">
      <form className={styles.stack16} onSubmit={apply} noValidate>
        <div className={styles.row}>
          {PRESETS.map((p) => (
            <Button
              key={p.label}
              variant="chip"
              active={start === p.start && end === DEFAULT_RANGE.end}
              onClick={() => {
                setStart(p.start);
                setEnd(DEFAULT_RANGE.end);
              }}
            >
              {p.label}
            </Button>
          ))}
        </div>
        <div className={styles.twoCol}>
          <Field label="Start date" type="date" value={start} max={end} onChange={(e) => setStart(e.target.value)} />
          <Field label="End date" type="date" value={end} min={start} max="2026-10-14" onChange={(e) => setEnd(e.target.value)} />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <p className={styles.muted11}>All times shown in the clinic timezone.</p>
        <div className={styles.dialogActions}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Apply range</Button>
        </div>
      </form>
    </Dialog>
  );
}
