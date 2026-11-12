import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, Row, Stack } from "../landing/shared";
import { ActionButton } from "./Interactive";
import styles from "./demo.module.css";

export { Icon, Row, Stack, styles };

/** Combines helper class names from the CSS module, e.g. t("s11 muted"). */
export function t(names: string) {
  return names
    .split(" ")
    .map((name) => styles[name])
    .filter(Boolean)
    .join(" ");
}

export function Tag({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "positive" | "caution" | "alert";
  children: ReactNode;
}) {
  return <span className={`${styles.tag} ${styles[tone]}`}>{children}</span>;
}

export function Action({
  icon,
  primary,
  children,
}: {
  icon?: string;
  primary?: boolean;
  children: ReactNode;
}) {
  return (
    <span className={`${styles.action} ${primary ? styles.actionPrimary : ""}`}>
      {icon && <Icon name={icon} size={16} />}
      {children}
    </span>
  );
}

const domains = [
  {
    title: "Psychological History",
    tags: ["Childhood adversity"],
    source: "Patient reported · 01 Sep 2026",
  },
  {
    title: "Current Psychological State",
    tags: ["Anxiety symptoms", "Perceived stress"],
    source: "Patient reported · 14 Oct 2026",
  },
  {
    title: "Somatic/Lifestyle Data",
    tags: ["Hypertension", "Atrial fibrillation", "Sleep disturbance", "Regular alcohol use"],
    source: "Clinical record + patient reported",
  },
];

const tabs = [
  { label: "Longitudinal dashboard", href: "/workspace/patients/demo-2048" },
  { label: "Clinical data", href: "/workspace/patients/demo-2048/clinical-data" },
  { label: "Documents", href: "/workspace/patients/demo-2048/documents" },
  { label: "Care plan", href: "/workspace/patients/demo-2048/care-plan" },
];

function PatientContext({ activeTab }: { activeTab: string }) {
  return (
    <Stack gap={22} className={styles.full}>
      <Row gap={8} className={t("s12")}>
        <Link href="/workspace/patients" className={t("muted")}>
          Patients
        </Link>
        <Icon name="clinician/chevron-right" size={12} />
        <span>Alex Morgan</span>
      </Row>
      <Row gap={16} className={`${styles.between} ${styles.patientRow}`}>
        <Row gap={16}>
          <div className={styles.patientAvatar}>AM</div>
          <Stack gap={3}>
            <Row gap={12} style={{ flexWrap: "wrap" }}>
              <h1 className={t("s26 w6")}>Alex Morgan</h1>
              <Tag>Fictional demo patient</Tag>
            </Row>
            <p className={t("s13 muted")}>
              58 years · Male · DOB 18 May 1968 · Patient ID DEMO-2048
            </p>
          </Stack>
        </Row>
        <Row gap={10} style={{ flexWrap: "wrap" }}>
          <ActionButton icon="clinician/file-text" dialog="clinical-record">
            Clinical record
          </ActionButton>
          <ActionButton icon="clinician/plus" primary dialog="review-note">
            Add review note
          </ActionButton>
        </Row>
      </Row>
      <div className={styles.domains}>
        {domains.map((domain) => (
          <Stack key={domain.title} gap={9} className={styles.domain}>
            <p className={t("s12 w6 full")}>{domain.title}</p>
            <div className={styles.tags}>
              {domain.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
            <p className={t("s11 muted full")}>{domain.source}</p>
          </Stack>
        ))}
      </div>
      <nav className={styles.tabs} aria-label="Patient views">
        {tabs.map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            className={`${styles.tab} ${tab.label === activeTab ? styles.tabActive : ""}`}
            aria-current={tab.label === activeTab ? "page" : undefined}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
    </Stack>
  );
}

/** Patient summary, tabs and footer note shared by the patient views (the workspace layout supplies the navigation). */
export function ClinicianShell({
  activeTab,
  children,
}: {
  activeTab: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.page} style={{ minHeight: 0 }}>
      <main>
        <Stack gap={24} className={styles.workspace}>
          <PatientContext activeTab={activeTab} />
          {children}
          <div className={styles.framing}>
            <p>CardioLink · Hypothetical clinical example · Not for clinical decision-making</p>
            <p>Data as of 14 Oct 2026, 08:42</p>
          </div>
        </Stack>
      </main>
    </div>
  );
}
