"use client";

import { useState } from "react";
import { FOLLOW_UPS } from "@/lib/demo-data";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { Button, Card, PageHeader, TextLink, styles } from "@/components/workspace/ui";

type Filter = "all" | "mine" | "week";

export default function FollowUpPage() {
  const { openDialog } = useWorkspace();
  const [filter, setFilter] = useState<Filter>("all");

  const items = FOLLOW_UPS.filter((f) =>
    filter === "mine" ? f.owner === "Dr. Elena Lee" : filter === "week" ? f.inDays <= 7 : true,
  );
  const overdue = items.filter((f) => f.overdue);
  const upcoming = items.filter((f) => !f.overdue);

  return (
    <main className={styles.main}>
      <PageHeader title="Follow-up" subtitle="Keep upcoming reviews and overdue items in view." />
      <div className={styles.row} style={{ marginBottom: 16 }} role="group" aria-label="Filter follow-up">
        {(
          [
            ["all", "All reviews"],
            ["mine", "Assigned to me"],
            ["week", "Next 7 days"],
          ] as const
        ).map(([key, label]) => (
          <Button key={key} variant="chip" active={filter === key} aria-pressed={filter === key} onClick={() => setFilter(key)}>
            {label}
          </Button>
        ))}
      </div>

      <div className={styles.twoCol}>
        <Card className={styles.stack16}>
          <h2 className={`${styles.h2} ${styles.redTitle}`}>Overdue · {overdue.length}</h2>
          {overdue.length === 0 ? (
            <p className={styles.muted13}>Nothing overdue for this filter.</p>
          ) : (
            overdue.map((f) => (
              <div key={f.title} className={styles.cardFlat}>
                <div className={styles.stack4}>
                  <h3 className={styles.h3}>
                    {f.patient} · {f.title}
                  </h3>
                  <p className={styles.muted11}>
                    {f.when} · Assigned to {f.owner}
                  </p>
                  <p className={styles.muted11}>Illustrative patient · One day overdue</p>
                  <TextLink href={`/workspace/patients/${f.patientId}`}>Review patient</TextLink>
                </div>
              </div>
            ))
          )}
          <p className={styles.muted11}>Overdue items stay visible until a review is recorded or rescheduled.</p>
        </Card>

        <Card className={styles.stack16}>
          <h2 className={styles.h2}>Upcoming · {upcoming.length}</h2>
          {upcoming.length === 0 ? (
            <p className={styles.muted13}>No upcoming reviews for this filter.</p>
          ) : (
            upcoming.map((f) => (
              <div key={f.title} className={styles.cardFlat}>
                <div className={styles.stack4}>
                  <h3 className={styles.h3}>
                    {f.patient} · {f.title}
                  </h3>
                  <p className={styles.muted11}>
                    {f.when} · {f.owner}
                  </p>
                  <TextLink href={f.patientId === "demo-2048" ? "/workspace/patients/demo-2048/review/bp-trend" : `/workspace/patients/${f.patientId}`}>
                    View details
                  </TextLink>
                </div>
              </div>
            ))
          )}
          <div>
            <Button onClick={() => openDialog("schedule")}>Schedule assessment</Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
