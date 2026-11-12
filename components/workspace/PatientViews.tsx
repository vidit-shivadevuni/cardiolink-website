"use client";

import { useState } from "react";
import { CARE_PLAN_GOALS, DOCUMENTS } from "@/lib/demo-data";
import { useWorkspace } from "./WorkspaceProvider";
import { Button, Dialog, Field, TextLink, styles } from "./ui";

const DOC_PREVIEWS: Record<string, string[]> = {
  "visit-summary": [
    "Reason for visit: review of rising home blood pressure readings.",
    "Plan: continue home monitoring twice daily, weekly check-ins, follow-up 14 Oct 2026.",
    "Illustrative document · Not a real clinical letter.",
  ],
  "bp-guidance": [
    "Sit quietly for 5 minutes before measuring, with your arm supported at heart level.",
    "Take two readings one minute apart, morning and evening, for 7 days before each review.",
    "Illustrative care instructions shared with the patient.",
  ],
  "team-note": [
    "Handover: discuss reported reaction and sleep at today’s review.",
    "Care-team-only note · never shown in the patient portal.",
  ],
};

export function DocumentsList() {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const q = query.trim().toLowerCase();
  const docs = DOCUMENTS.filter((d) => !q || `${d.title} ${d.type}`.toLowerCase().includes(q));
  const open = DOCUMENTS.find((d) => d.id === openId);

  return (
    <section className={`${styles.card} ${styles.stack16}`} style={{ width: "100%" }}>
      <div className={styles.stack4}>
        <h2 className={styles.h2}>Medical documents</h2>
        <p className={styles.muted13}>Shared records and patient-facing information.</p>
      </div>
      <Field label="Search documents" type="search" placeholder="Title or type" value={query} onChange={(e) => setQuery(e.target.value)} />
      {docs.length === 0 ? (
        <p className={styles.muted13}>No documents match “{query}”.</p>
      ) : (
        docs.map((d) => (
          <div key={d.id} className={styles.cardFlat}>
            <div className={styles.between}>
              <div className={styles.stack4}>
                <h3 className={styles.h3}>{d.title}</h3>
                <p className={styles.muted11}>
                  {d.date} · {d.type}
                </p>
                <TextLink onClick={() => setOpenId(d.id)}>Open document</TextLink>
              </div>
              <span className={`${styles.tag} ${d.visibility === "Care team only" ? styles.tagReview : styles.tagNeutral}`}>
                {d.visibility}
              </span>
            </div>
          </div>
        ))
      )}
      <p className={styles.muted11}>
        Visibility is shown for each document. Care-team-only notes are never shown in the patient portal.
      </p>

      <Dialog open={Boolean(open)} onClose={() => setOpenId(null)} title={open?.title ?? ""} context={open ? `Alex Morgan · ${open.date} · ${open.type} · ${open.visibility}` : ""} wide>
        <div className={styles.stack8}>
          {(open ? DOC_PREVIEWS[open.id] : []).map((line) => (
            <p key={line} style={{ fontSize: 13 }}>
              {line}
            </p>
          ))}
        </div>
        <p className={styles.muted11}>PDF download is not available in this illustrative workspace.</p>
        <div className={styles.dialogActions}>
          <Button onClick={() => setOpenId(null)}>Close</Button>
        </div>
      </Dialog>
    </section>
  );
}

export function CarePlan() {
  const { openDialog } = useWorkspace();
  return (
    <section className={`${styles.card} ${styles.stack16}`} style={{ width: "100%" }}>
      <div className={styles.stack4}>
        <h2 className={styles.h2}>Care plan</h2>
        <p className={styles.muted13}>Last updated 12 Oct 2026 · Approved by Dr. Elena Lee</p>
      </div>
      <div className={styles.reviewLayout}>
        <div className={styles.stack12}>
          <h3 className={styles.h3}>Goals and actions</h3>
          {CARE_PLAN_GOALS.map((g) => (
            <div key={g.title} className={styles.cardFlat}>
              <div className={styles.stack4}>
                <h4 className={styles.h3}>{g.title}</h4>
                <p className={styles.muted11}>{g.detail}</p>
              </div>
            </div>
          ))}
        </div>
        <div className={`${styles.cardFlat} ${styles.stack12}`}>
          <h3 className={styles.h3}>Review and ownership</h3>
          <div className={styles.stack4}>
            <p className={styles.muted11}>Next review</p>
            <p className={styles.h3}>14 Oct 2026 · 14:30</p>
            <p className={styles.muted11}>Owner: Dr. Elena Lee · Coordinator: Nurse Mina Park</p>
          </div>
          <div>
            <Button variant="secondary" onClick={() => openDialog("review-note")}>
              Add review note
            </Button>
          </div>
          <p className={styles.muted11}>Do not change medication based on this illustrative care plan.</p>
        </div>
      </div>
    </section>
  );
}
