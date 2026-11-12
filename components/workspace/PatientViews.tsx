"use client";

import { useState } from "react";
import { CARE_PLAN_GOALS, DOCUMENTS } from "@/lib/demo-data";
import { useWorkspace } from "./WorkspaceProvider";
import { Button, Dialog, Field, TextLink, styles } from "./ui";

const DOC_PREVIEWS: Record<string, string[]> = {
  "bp-guidance": [
    "Sit quietly for 5 minutes before measuring, with your arm supported at heart level.",
    "Take two readings one minute apart, morning and evening, for 7 days before each review.",
    "Illustrative care instructions shared with the patient.",
  ],
  "medication-note": [
    "Patient reported a possible reaction after starting a new medication. Not yet confirmed.",
    "Reconcile with the allergy entry at the next review.",
    "Care-team-only note · never shown in the patient portal.",
  ],
};

/** Figma 11 · Patient documents */
export function DocumentsList() {
  const { openDialog } = useWorkspace();
  const [query, setQuery] = useState("");
  const [previewId, setPreviewId] = useState<string | null>(null);
  const q = query.trim().toLowerCase();
  const docs = DOCUMENTS.filter((d) => !q || `${d.title} ${d.meta}`.toLowerCase().includes(q));
  const preview = DOCUMENTS.find((d) => d.id === previewId);

  return (
    <section className={styles.stack16} style={{ width: "100%" }}>
      <div className={styles.stack4}>
        <h2 className={styles.h1} style={{ fontSize: 22 }}>
          Medical documents
        </h2>
        <p className={styles.muted13}>Shared records and patient-facing information.</p>
      </div>
      <Field label="Search documents" type="search" placeholder="Title or document type" value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className={styles.docList}>
        {docs.length === 0 ? (
          <p className={styles.muted13} style={{ padding: 18 }}>
            No documents match “{query}”.
          </p>
        ) : (
          docs.map((d) => (
            <div key={d.id} className={styles.docRow}>
              <h3 className={styles.h3}>{d.title}</h3>
              <p className={styles.muted11}>
                {d.date} · {d.meta}
              </p>
              <TextLink onClick={() => (d.action.opens === "clinical-record" ? openDialog("clinical-record") : setPreviewId(d.id))}>
                {d.action.label}
              </TextLink>
            </div>
          ))
        )}
      </div>
      <p className={styles.muted11}>Visibility is shown for each document. Care-team-only notes are never shown in the patient portal.</p>

      <Dialog
        open={Boolean(preview)}
        onClose={() => setPreviewId(null)}
        title={preview?.title ?? ""}
        context={preview ? `Alex Morgan · ${preview.date} · ${preview.meta}` : ""}
        wide
      >
        <div className={styles.stack8}>
          {(preview ? DOC_PREVIEWS[preview.id] ?? [] : []).map((line) => (
            <p key={line} style={{ fontSize: 13 }}>
              {line}
            </p>
          ))}
        </div>
        <p className={styles.muted11}>Downloads are not available in this illustrative workspace.</p>
        <div>
          <Button variant="secondary" onClick={() => setPreviewId(null)}>
            Close
          </Button>
        </div>
      </Dialog>
    </section>
  );
}

/** Figma 12 · Patient care plan */
export function CarePlan() {
  const { openDialog } = useWorkspace();
  return (
    <section className={styles.stack16} style={{ width: "100%" }}>
      <div className={styles.stack4}>
        <h2 className={styles.h1} style={{ fontSize: 22 }}>
          Care plan
        </h2>
        <p className={styles.muted13}>Last updated 12 Oct 2026 · Approved by Dr. Elena Lee</p>
      </div>
      <div className={styles.planLayout}>
        <div className={`${styles.card} ${styles.stack12}`} style={{ padding: 16 }}>
          {CARE_PLAN_GOALS.map((g) => (
            <div key={g.title} className={styles.cardFlat}>
              <div className={styles.stack4}>
                <h3 className={styles.h3}>{g.title}</h3>
                <p className={styles.muted11}>{g.detail}</p>
                <p className={styles.muted11} style={{ color: "var(--blue)" }}>
                  {g.status}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className={`${styles.card} ${styles.stack12}`}>
          <h3 className={styles.h3}>Next review</h3>
          <p className={styles.h2} style={{ fontSize: 22 }}>
            14 Oct 2026 · 14:30
          </p>
          <div className={styles.stack4}>
            <p className={styles.muted11}>Dr. Elena Lee</p>
            <p className={styles.muted11}>Discuss BP trend and patient-reported medication reaction.</p>
          </div>
          <div>
            <Button onClick={() => openDialog("review-note")}>Add review note</Button>
          </div>
          <p className={styles.muted11} style={{ color: "var(--amber)" }}>
            Do not change medication based on this illustrative care plan.
          </p>
        </div>
      </div>
    </section>
  );
}
