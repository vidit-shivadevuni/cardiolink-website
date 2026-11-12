"use client";

/** Client pieces that connect the original dashboard screens to the workspace state and dialogs. */

import Link from "next/link";
import type { ReactNode } from "react";
import { SIGNALS } from "@/lib/demo-data";
import { useWorkspace, type DialogName } from "../workspace/WorkspaceProvider";
import { Icon, Row, Stack } from "../landing/shared";
import styles from "./demo.module.css";

const t = (names: string) =>
  names
    .split(" ")
    .map((n) => styles[n])
    .filter(Boolean)
    .join(" ");

function Tag({ tone, children }: { tone: "caution" | "positive"; children: ReactNode }) {
  return <span className={`${styles.tag} ${styles[tone]}`}>{children}</span>;
}

export function ActionButton({
  icon,
  primary,
  dialog,
  children,
}: {
  icon?: string;
  primary?: boolean;
  dialog: Exclude<DialogName, null>;
  children: ReactNode;
}) {
  const { openDialog } = useWorkspace();
  return (
    <button
      type="button"
      onClick={() => openDialog(dialog)}
      className={`${styles.action} ${primary ? styles.actionPrimary : ""}`}
      style={{ font: "inherit", cursor: "pointer" }}
    >
      {icon && <Icon name={icon} size={16} />}
      {children}
    </button>
  );
}

/** "Needs clinical review" card on the longitudinal dashboard; each signal opens its review detail. */
export function ReviewSignalsCard() {
  const { reviews, openSignals } = useWorkspace();
  return (
    <Stack gap={15} className={`${styles.card} ${styles.pad24} ${styles.reviewCard}`}>
      <Row className={`${styles.between} ${styles.alignTop}`}>
        <h3 className={t("s16 w6")}>Needs clinical review</h3>
        <Tag tone={openSignals ? "caution" : "positive"}>
          {openSignals ? `${openSignals} open signal${openSignals === 1 ? "" : "s"}` : "All reviewed"}
        </Tag>
      </Row>
      {SIGNALS.map((s) => {
        const done = reviews[s.id];
        return (
          <Link key={s.id} href={`/workspace/patients/demo-2048/review/${s.id}`} className={styles.full}>
            <Row gap={12} className={styles.full}>
              <Icon name={`clinician/${s.icon}`} size={19} />
              <Stack gap={2} className={styles.grow}>
                <p className={t("s13 w6 full")}>{s.title}</p>
                <p className={t("s11 muted full")}>{done ? `Reviewed · ${done.outcome} · ${done.at}` : s.dashboardSummary}</p>
              </Stack>
              <Icon name="clinician/chevron-right-1" size={16} />
            </Row>
          </Link>
        );
      })}
    </Stack>
  );
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function fmt(iso: string) {
  const [, m, d] = iso.split("-");
  return `${d} ${MONTHS[Number(m) - 1]}`;
}

export function DateRangeActions() {
  const { dateRange } = useWorkspace();
  return (
    <Row gap={8} style={{ flexWrap: "wrap" }}>
      <ActionButton icon="clinician/calendar-days" dialog="date-range">
        {fmt(dateRange.start)} – {fmt(dateRange.end)} 2026
      </ActionButton>
      <ActionButton dialog="date-range">{dateRange.label}</ActionButton>
    </Row>
  );
}
