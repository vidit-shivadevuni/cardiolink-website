"use client";

import Link from "next/link";
import { useState } from "react";
import { REVIEW_OUTCOMES, SIGNALS, type SignalId } from "@/lib/demo-data";
import { useWorkspace } from "./WorkspaceProvider";
import { Button, ButtonLink, Field, TextLink, styles } from "./ui";

export function ReviewDetail({ signalId }: { signalId: SignalId }) {
  const { reviews, markReviewed, openSignals, openDialog } = useWorkspace();
  const signal = SIGNALS.find((s) => s.id === signalId)!;
  const record = reviews[signalId];
  const [outcome, setOutcome] = useState(signal.defaultOutcome);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  return (
    <main className={styles.main}>
      <nav className={styles.muted12} aria-label="Breadcrumb" style={{ marginBottom: 16, color: "var(--blue)" }}>
        <Link href="/workspace/patients">Patients</Link> / <Link href="/workspace/patients/demo-2048">Alex Morgan</Link> /{" "}
        <Link href="/workspace/patients/demo-2048">Longitudinal dashboard</Link>
      </nav>
      <h1 className={styles.h1} style={{ marginBottom: 24 }}>
        Needs clinical review
      </h1>

      <div className={styles.reviewLayout}>
        <section className={`${styles.card} ${styles.stack16}`}>
          <h2 className={styles.h2}>Home blood pressure</h2>
          <div className={`${styles.highlight} ${styles.stack8}`}>
            <p className={styles.h3}>02 Sep → 14 Oct 2026</p>
            <p className={styles.bigValue}>128/80 → 152/94</p>
            <p className={styles.muted11}>mmHg · 7 illustrative weekly home readings</p>
          </div>
          {SIGNALS.map((s) => {
            const done = reviews[s.id];
            const active = s.id === signalId;
            return (
              <div key={s.id} className={`${styles.signalCard} ${active ? styles.signalActive : ""}`}>
                <div className={styles.between}>
                  <h3 className={styles.h3}>{s.title}</h3>
                  {done && <span className={`${styles.tag} ${styles.tagDone}`}>Reviewed</span>}
                </div>
                <p className={styles.muted11}>{s.summary}</p>
                {active ? (
                  <span className={styles.muted11} style={{ fontWeight: 600 }}>
                    Showing detail
                  </span>
                ) : (
                  <TextLink href={`/workspace/patients/demo-2048/review/${s.id}`}>
                    {s.id === "bp-trend" ? "Open review detail" : done ? "View review" : "Needs clinical review"}
                  </TextLink>
                )}
              </div>
            );
          })}
          <p className={styles.muted11}>
            Temporal alignment is not causal evidence. Confirm readings, source and context with the patient.
          </p>
        </section>

        <section className={`${styles.card} ${styles.stack16}`} aria-live="polite">
          <h2 className={styles.h2}>{signal.title}</h2>
          <span className={`${styles.tag} ${record ? styles.tagDone : styles.tagReview}`}>{record ? "Reviewed" : "For review"}</span>
          <div style={{ fontSize: 12 }}>
            {signal.latest.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
          <div className={styles.stack8}>
            <h3 className={styles.h3}>Why this is shown</h3>
            <p className={styles.muted12}>{signal.why}</p>
          </div>
          <div className={styles.stack8}>
            <h3 className={styles.h3}>Related context</h3>
            <p className={styles.muted12}>{signal.context}</p>
          </div>

          {record ? (
            <>
              <div className={`${styles.recorded} ${styles.stack8}`} role="status">
                <h3 className={styles.h3}>Review recorded</h3>
                <p style={{ fontSize: 12 }}>
                  <strong>Outcome:</strong> {record.outcome}
                </p>
                <p style={{ fontSize: 12 }}>
                  <strong>Note:</strong> {record.note}
                </p>
                <p className={styles.muted11}>
                  {record.author} · {record.at} · Care team only
                </p>
              </div>
              <p className={styles.muted12}>
                {openSignals === 0
                  ? "All review items for Alex Morgan are resolved."
                  : `${openSignals} review item${openSignals === 1 ? "" : "s"} remain. Reviewing this item does not resolve the others.`}
              </p>
              <div>
                <ButtonLink href="/workspace/patients/demo-2048" variant="secondary">
                  Back to overview
                </ButtonLink>
              </div>
            </>
          ) : (
            <form
              className={styles.stack16}
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                if (!note.trim()) return setError("A review note is required before marking as reviewed.");
                setError("");
                markReviewed(signalId, outcome, note.trim());
              }}
            >
              <label className={styles.field}>
                <span className={styles.label}>Review outcome</span>
                <select className={styles.input} value={outcome} onChange={(e) => setOutcome(e.target.value)}>
                  {REVIEW_OUTCOMES.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </label>
              <Field
                label="Review note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={signal.noteHint}
                hint="A review note is required before marking as reviewed."
                error={error}
              />
              <div className={styles.stack12} style={{ alignItems: "flex-start" }}>
                <Button type="submit">Mark as reviewed</Button>
                <Button variant="secondary" onClick={() => openDialog("review-note")}>
                  Add review note
                </Button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
