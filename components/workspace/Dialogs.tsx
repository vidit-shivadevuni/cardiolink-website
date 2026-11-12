"use client";

/**
 * Workspace dialogs (Figma 13–17): invite patient, add review note, schedule
 * assessment, clinical record and date range. One instance lives in the
 * workspace layout; any page opens one through useWorkspace().openDialog(name).
 */

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { DEFAULT_RANGE, useWorkspace } from "./WorkspaceProvider";
import { Button, Confirmation, Dialog, Field, styles } from "./ui";

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

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      <select className={styles.input} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

const CLINICIANS = ["Dr. Elena Lee", "Dr. Noah Wilson", "Nurse Mina Park"];

/* ------------------------------------------------------------------ */
/* 13 · Invite patient                                                 */
/* ------------------------------------------------------------------ */

function InviteDialog({ open, onClose }: Props) {
  const { state, submit, reset } = useSubmit();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [clinician, setClinician] = useState(CLINICIANS[0]);
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
    <Dialog open={open} onClose={close} title="Invite patient" context="Patients join only through a secure care-team invitation.">
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
          A secure invitation has been sent to {email}. The link expires after 7 days, and {name.trim()} will be linked to{" "}
          {clinician} once they create an account.
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
            hint="Check the address before sending."
          />
          <Select label="Assigned clinician" value={clinician} onChange={setClinician} options={CLINICIANS} />
          <p className={styles.muted11}>The invite expires after 7 days. No clinical information is included in the email.</p>
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

/* ------------------------------------------------------------------ */
/* 14 · Add review note                                                */
/* ------------------------------------------------------------------ */

const REVIEW_TYPES = ["BP trend review", "Medication–allergy review", "Alcohol-use review", "General note"];
const NOTE_LIMIT = 2000;

function ReviewNoteDialog({ open, onClose }: Props) {
  const { state, submit, reset } = useSubmit();
  const { markReviewed, reviews } = useWorkspace();
  const [type, setType] = useState(REVIEW_TYPES[0]);
  const [note, setNote] = useState("");
  const [visibility, setVisibility] = useState("Care team only");
  const [markBp, setMarkBp] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const close = () => {
    onClose();
    reset();
    setError("");
    setNote("");
    setMarkBp(false);
  };

  return (
    <Dialog open={open} onClose={close} title="Add review note" context="Alex Morgan · DEMO-2048 · Illustrative patient">
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
          Your note is recorded for Alex Morgan with {visibility.toLowerCase()} visibility. Recorded by Dr. Elena Lee.
          {markBp ? " BP trend rising is marked as reviewed." : ""}
        </Confirmation>
      ) : (
        <form
          className={styles.stack16}
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (!note.trim()) return setError("Enter a clinical review note before saving.");
            submit(() => {
              if (markBp) markReviewed("bp-trend", "Follow-up arranged", note.trim());
            });
          }}
        >
          <Select label="Review type" value={type} onChange={setType} options={REVIEW_TYPES} />
          <Field
            label="Clinical review note"
            multiline
            value={note}
            maxLength={NOTE_LIMIT}
            onChange={(e) => setNote((e.target as unknown as HTMLTextAreaElement).value)}
            error={error}
            hint={`${note.length.toLocaleString()} / ${NOTE_LIMIT.toLocaleString()} characters`}
            placeholder="BP trend reviewed alongside patient-reported context. Arrange follow-up to confirm readings and discuss the reported medication reaction."
          />
          <Select label="Visibility" value={visibility} onChange={setVisibility} options={["Care team only", "Shared with patient"]} />
          {!reviews["bp-trend"] && (
            <label className={styles.checkbox} style={{ border: 0, padding: 0 }}>
              <input type="checkbox" checked={markBp} onChange={(e) => setMarkBp(e.target.checked)} />
              <span>Mark BP trend rising as reviewed after saving</span>
            </label>
          )}
          <div className={styles.dialogActions}>
            <Button variant="secondary" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" disabled={state === "sending"}>
              {state === "sending" ? "Saving…" : "Save review note"}
            </Button>
          </div>
        </form>
      )}
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* 15 · Schedule assessment                                            */
/* ------------------------------------------------------------------ */

const ASSESSMENTS = ["PHQ-9 and GAD-7", "PHQ-9 only", "GAD-7 only"];

function ScheduleDialog({ open, onClose }: Props) {
  const { state, submit, reset } = useSubmit();
  const [assessment, setAssessment] = useState(ASSESSMENTS[0]);
  const [due, setDue] = useState("2026-10-16");
  const [reviewer, setReviewer] = useState(CLINICIANS[0]);
  const [notify, setNotify] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const close = () => {
    onClose();
    reset();
    setError("");
  };

  const plural = assessment.includes(" and ");
  const name = assessment.replace(" only", "");

  return (
    <Dialog open={open} onClose={close} title="Schedule assessment" context="Alex Morgan · Choose an assessment and due date.">
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
          {name} {plural ? "are" : "is"} due {formatDate(due)}.{" "}
          {notify ? "Alex Morgan has been notified in the patient portal." : "Alex Morgan was not notified."} {reviewer} will
          review the {plural ? "results" : "result"}.
        </Confirmation>
      ) : (
        <form
          className={styles.stack16}
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (!due) return setError("Choose a due date.");
            if (due < "2026-10-14") return setError("Choose a date from today onwards.");
            setError("");
            submit();
          }}
        >
          <Select label="Assessment" value={assessment} onChange={setAssessment} options={ASSESSMENTS} />
          <Field label="Due date" type="date" value={due} min="2026-10-14" onChange={(e) => setDue(e.target.value)} error={error} />
          <Select label="Assign reviewer" value={reviewer} onChange={setReviewer} options={CLINICIANS} />
          <label className={styles.checkbox} style={{ border: 0, padding: 0 }}>
            <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} />
            <span>Notify patient in the portal</span>
          </label>
          <p className={styles.muted11}>The patient can complete each questionnaire independently. A submission is not a diagnosis.</p>
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

/* ------------------------------------------------------------------ */
/* 16 · Clinical record                                                */
/* ------------------------------------------------------------------ */

function ClinicalRecordDialog({ open, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose} title="Clinical record" context="Alex Morgan · DEMO-2048 · Fictional patient / Illustrative record" wide>
      <div className={`${styles.cardFlat} ${styles.stack4}`}>
        <h3 className={styles.h3}>Cardiology visit summary</h3>
        <p className={styles.muted11}>12 Oct 2026 · Dr. Elena Lee · Record CR-DEMO-012</p>
        <p className={styles.muted11} style={{ color: "var(--blue)" }}>
          Clinical record · Read only
        </p>
      </div>
      <div className={styles.stack8}>
        <h3 className={styles.h3}>Reason for review</h3>
        <p style={{ fontSize: 13 }}>Review of home blood pressure trend and patient-reported symptoms.</p>
      </div>
      <div className={styles.stack8}>
        <h3 className={styles.h3}>Recorded history</h3>
        <p style={{ fontSize: 13 }}>
          Hypertension; atrial fibrillation. Patient-reported medication reaction remains unconfirmed and requires
          reconciliation.
        </p>
      </div>
      <div className={styles.stack8}>
        <h3 className={styles.h3}>Plan</h3>
        <p style={{ fontSize: 13 }}>
          Discuss home reading technique and review the reported reaction with the patient. No medication changes are
          specified in this illustrative record.
        </p>
      </div>
      <div className={styles.stack4}>
        <p className={styles.muted11}>Source: clinical record · Updated 12 Oct 2026</p>
        <p className={styles.muted11}>Access is logged. Record is not editable from this view.</p>
      </div>
      <div>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </div>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* 17 · Date range picker                                              */
/* ------------------------------------------------------------------ */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const LAST_DAY = DEFAULT_RANGE.end; // Data runs to 14 Oct 2026.

export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d} ${MONTHS[Number(m) - 1]} ${y}`;
}

function iso(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function minusDays(isoDate: string, days: number) {
  const d = new Date(`${isoDate}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

const PRESETS = [
  { label: "Last 7 days", short: "7 days", start: minusDays(LAST_DAY, 7) },
  { label: "Last 30 days", short: "30 days", start: minusDays(LAST_DAY, 30) },
  { label: "Last 6 weeks", short: "6 weeks", start: DEFAULT_RANGE.start },
];

function DateRangeDialog({ open, onClose }: Props) {
  const { dateRange, setDateRange } = useWorkspace();
  const [start, setStart] = useState(dateRange.start);
  const [end, setEnd] = useState<string | null>(dateRange.end);
  const [month, setMonth] = useState({ y: 2026, m: 9 }); // October 2026
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setStart(dateRange.start);
      setEnd(dateRange.end);
      setMonth({ y: 2026, m: 9 });
      setError("");
    }
  }, [open, dateRange]);

  const pick = (day: string) => {
    if (day > LAST_DAY) return;
    // First click starts a new range; second click closes it.
    if (!start || end) {
      setStart(day);
      setEnd(null);
    } else if (day < start) {
      setEnd(start);
      setStart(day);
    } else {
      setEnd(day);
    }
    setError("");
  };

  const apply = (e: FormEvent) => {
    e.preventDefault();
    if (!start || !end) return setError("Select an end date on the calendar.");
    const preset = PRESETS.find((p) => p.start === start && end === LAST_DAY);
    setDateRange({ label: preset?.short ?? "Custom", start, end });
    onClose();
  };

  const first = new Date(Date.UTC(month.y, month.m, 1));
  const offset = (first.getUTCDay() + 6) % 7; // Monday first
  const daysInMonth = new Date(Date.UTC(month.y, month.m + 1, 0)).getUTCDate();
  const cells: (number | null)[] = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const shift = (delta: number) =>
    setMonth(({ y, m }) => {
      const n = m + delta;
      return { y: y + Math.floor(n / 12), m: ((n % 12) + 12) % 12 };
    });

  return (
    <Dialog open={open} onClose={onClose} title="Date range" context="Longitudinal overview · Select the same window for readings and milestones." wide>
      <form className={styles.stack16} onSubmit={apply} noValidate>
        <div className={styles.twoCol}>
          <Field label="Start" value={formatDate(start)} readOnly />
          <Field label="End" value={end ? formatDate(end) : "Select end date"} readOnly />
        </div>

        <div className={styles.calendar}>
          <div className={styles.between}>
            <h3 className={styles.h3} aria-live="polite">
              {MONTH_NAMES[month.m]} {month.y}
            </h3>
            <div className={styles.row} style={{ gap: 4 }}>
              <button type="button" className={styles.calNav} onClick={() => shift(-1)} aria-label="Previous month">
                ‹
              </button>
              <button
                type="button"
                className={styles.calNav}
                onClick={() => shift(1)}
                aria-label="Next month"
                disabled={iso(month.y, month.m, 1) >= "2026-10-01"}
              >
                ›
              </button>
            </div>
          </div>
          <div className={styles.calGrid} role="grid" aria-label={`${MONTH_NAMES[month.m]} ${month.y}`}>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <span key={d} className={styles.calHead}>
                {d}
              </span>
            ))}
            {cells.map((d, i) => {
              if (d === null) return <span key={`e${i}`} />;
              const day = iso(month.y, month.m, d);
              const inRange = end ? day >= start && day <= end : day === start;
              const edge = day === start || day === end;
              return (
                <button
                  key={day}
                  type="button"
                  className={`${styles.calDay} ${inRange ? styles.calInRange : ""} ${edge ? styles.calEdge : ""}`}
                  disabled={day > LAST_DAY}
                  aria-pressed={edge}
                  aria-label={formatDate(day)}
                  onClick={() => pick(day)}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.row} style={{ gap: 16 }}>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              className={styles.textLink}
              onClick={() => {
                setStart(p.start);
                setEnd(LAST_DAY);
                setError("");
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.dialogActions} style={{ justifyContent: "flex-start" }}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Apply date range</Button>
        </div>
      </form>
    </Dialog>
  );
}
