/* eslint-disable @next/next/no-img-element */
import { Action, Icon, Row, Stack, Tag, styles, t } from "./shared";

const alerts = [
  {
    icon: "triangle-alert",
    title: "BP trend rising",
    detail: "Home reading · 14 Oct · +24 mmHg systolic since 02 Sep",
  },
  {
    icon: "shield-alert",
    title: "Possible medication-allergy conflict",
    detail: "Clinical record + patient reported · reconcile rash / allergy entry",
  },
  {
    icon: "triangle-alert",
    title: "Alcohol-use pattern increasing",
    detail: "Patient reported · 16 Sep · confirm pattern at follow-up",
  },
];

const risks = [
  { title: "5-year cardiovascular risk", value: "18" },
  { title: "Depression trajectory risk", value: "21" },
];

const gridLevels = [
  { label: "80", top: 230 },
  { label: "100", top: 178 },
  { label: "120", top: 126 },
  { label: "140", top: 74 },
  { label: "160", top: 22 },
];

const guides = [
  { key: "A", left: 280, color: "var(--amber)" },
  { key: "B", left: 506, color: "var(--red)" },
  { key: "C", left: 619, color: "var(--amber)" },
];

// Positions come directly from the Figma frame so the values line up with the trend lines.
const readings = [
  { left: 44, date: "02 Sep", sys: 128, sysTop: 109.2, dia: 80, diaTop: 234 },
  { left: 157, date: "09 Sep", sys: 132, sysTop: 98.8, dia: 82, diaTop: 228.8 },
  { left: 270, date: "16 Sep", sys: 136, sysTop: 88.4, dia: 84, diaTop: 223.6 },
  { left: 383, date: "23 Sep", sys: 138, sysTop: 83.2, dia: 86, diaTop: 218.4 },
  { left: 496, date: "30 Sep", sys: 142, sysTop: 72.8, dia: 88, diaTop: 213.2 },
  { left: 609, date: "07 Oct", sys: 148, sysTop: 57.2, dia: 90, diaTop: 208 },
  { left: 722, date: "14 Oct", sys: 152, sysTop: 46.8, dia: 94, diaTop: 197.6 },
];

const milestones = [
  {
    key: "A",
    tone: "caution" as const,
    date: "16 Sep 2026 · Patient reported",
    title: "Alcohol use changed",
    body: "Reported increase from 1–2 to 3–4 drinking days/week.",
    tag: "Moderate · increasing",
  },
  {
    key: "B",
    tone: "alert" as const,
    date: "30 Sep 2026 · Patient reported",
    title: "Adverse effect reported",
    body: "Itchy rash after medication dose; allergy reconciliation pending.",
    tag: "Moderate · adverse effect",
  },
  {
    key: "C",
    tone: "caution" as const,
    date: "07 Oct 2026 · Patient reported",
    title: "Sleep worsened",
    body: "Reported 5–6 h/night with frequent waking, previously 7 h.",
    tag: "Moderate · worsening",
  },
];

function BloodPressurePlot() {
  return (
    <div className={styles.scroll}>
      <div
        className={styles.plot}
        role="img"
        aria-label="Illustrative home blood pressure from 2 September to 14 October 2026. Systolic rises from 128 to 152 and diastolic from 80 to 94 mmHg."
      >
        {gridLevels.map((level) => (
          <div key={level.label} className={styles.gridLevel} style={{ top: level.top }}>
            <span className={styles.gridLabel}>{level.label}</span>
            <span className={styles.gridLine} />
          </div>
        ))}
        {guides.map((guide) => (
          <div key={guide.key} className={styles.guide} style={{ left: guide.left }}>
            <span className={styles.marker} style={{ color: guide.color }}>
              {guide.key}
            </span>
            <span className={styles.guideLine} />
          </div>
        ))}
        <div className={styles.trend} style={{ top: 50.8, height: 62.4 }}>
          <div className={styles.layer} style={{ top: "-2.39%", bottom: "-2.39%", left: 0, right: 0 }}>
            <img src="/figma/clinician/systolic-trend.svg" alt="" />
          </div>
        </div>
        <div className={styles.trend} style={{ top: 201.6, height: 36.4 }}>
          <div className={styles.layer} style={{ top: "-4.1%", bottom: "-4.12%", left: 0, right: 0 }}>
            <img src="/figma/clinician/diastolic-trend.svg" alt="" />
          </div>
        </div>
        {readings.map((reading) => (
          <div key={reading.date} className={styles.reading} style={{ left: reading.left }}>
            <img
              src="/figma/clinician/systolic-reading.svg"
              width={8}
              height={8}
              alt=""
              style={{ left: 17, top: reading.sysTop }}
            />
            <span
              className={t("s12 w6 green")}
              style={{ left: 5, top: reading.sysTop - 21 }}
            >
              {reading.sys}
            </span>
            <img
              src="/figma/clinician/diastolic-reading.svg"
              width={8}
              height={8}
              alt=""
              style={{ left: 17, top: reading.diaTop }}
            />
            <span className={t("s11")} style={{ left: 10, top: reading.diaTop + 14, color: "var(--blue)" }}>
              {reading.dia}
            </span>
            <span className={t("s11 muted")} style={{ left: 0, top: 303, whiteSpace: "nowrap" }}>
              {reading.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LongitudinalDashboard() {
  return (
    <>
      <Row gap={12} className={`${styles.between} ${styles.wrap}`}>
        <Stack gap={3}>
          <h2 className={t("s22 w6")}>From snapshot to a trajectory</h2>
          <p className={t("s13 muted")}>
            Physical and psychological health, viewed together over time.
          </p>
        </Stack>
        <p className={t("s12 muted")}>Review date · 14 Oct 2026</p>
      </Row>

      <div className={styles.reviewRow}>
        <Stack gap={15} className={`${styles.card} ${styles.pad24} ${styles.reviewCard}`}>
          <Row className={`${styles.between} ${styles.alignTop}`}>
            <h3 className={t("s16 w6")}>Needs clinical review</h3>
            <Tag tone="caution">3 open signals</Tag>
          </Row>
          {alerts.map((alert) => (
            <Row key={alert.title} gap={12} className={styles.full}>
              <Icon name={`clinician/${alert.icon}`} size={19} />
              <Stack gap={2} className={styles.grow}>
                <p className={t("s13 w6 full")}>{alert.title}</p>
                <p className={t("s11 muted full")}>{alert.detail}</p>
              </Stack>
              <Icon name="clinician/chevron-right-1" size={16} />
            </Row>
          ))}
        </Stack>
        {risks.map((risk) => (
          <Stack key={risk.title} gap={12} className={`${styles.card} ${styles.pad24} ${styles.riskCard}`}>
            <Row className={styles.between}>
              <Icon name="clinician/chart-no-axes-combined" size={20} />
              <Tag tone="caution">Illustrative</Tag>
            </Row>
            <h3 className={t("s14 w6")}>{risk.title}</h3>
            <Row gap={4} className={styles.baseline}>
              <span className={t("s44 w6")}>{risk.value}</span>
              <span className={t("s22 muted")}>%</span>
            </Row>
            <p className={t("s11 muted")}>Hypothetical value · not a validated clinical prediction</p>
          </Stack>
        ))}
      </div>

      <Stack gap={22} className={`${styles.card} ${styles.pad24} ${styles.full}`}>
        <Row className={`${styles.between} ${styles.wrap}`}>
          <Stack gap={3}>
            <h3 className={t("s18 w6")}>Longitudinal overview</h3>
            <p className={t("s12 muted")}>Readings and life events share one time window.</p>
          </Stack>
          <Row gap={8} style={{ flexWrap: "wrap" }}>
            <Action icon="clinician/calendar-days">02 Sep – 14 Oct 2026</Action>
            <Action>6 weeks</Action>
          </Row>
        </Row>
        <div className={styles.divider} />
        <div className={styles.trajectory}>
          <Stack gap={18} className={styles.chartColumn}>
            <Row className={`${styles.between} ${styles.wrap}`}>
              <Stack gap={3}>
                <h4 className={t("s16 w6")}>Home blood pressure</h4>
                <p className={t("s12 muted")}>mmHg · 7 illustrative weekly readings</p>
              </Stack>
              <Tag tone="caution">128/80 → 152/94</Tag>
            </Row>
            <Row gap={20} className={t("s12")} style={{ flexWrap: "wrap" }}>
              <Row gap={6}>
                <span className={styles.legendSwatch} style={{ background: "var(--teal)" }} />
                Systolic
              </Row>
              <Row gap={6}>
                <span className={styles.legendSwatch} style={{ background: "var(--blue)" }} />
                Diastolic
              </Row>
              <span className={t("muted")}>Source: home reading</span>
            </Row>
            <BloodPressurePlot />
            <Row className={`${styles.between} ${styles.wrap} ${t("s11 muted")}`}>
              <span>02 Sep – 14 Oct 2026</span>
              <span>A–C link patient-reported events to the same dates</span>
            </Row>
          </Stack>
          <Stack gap={18} className={styles.grow}>
            <h4 className={t("s16 w6 full")}>Patient-reported milestones</h4>
            {milestones.map((milestone) => (
              <Row key={milestone.key} gap={12} className={`${styles.full} ${styles.alignTop}`}>
                <span className={`${styles.eventKey} ${styles[milestone.tone]}`}>{milestone.key}</span>
                <Stack gap={5} className={styles.grow}>
                  <p className={t("s11 muted")}>{milestone.date}</p>
                  <p className={t("s14 w6")}>{milestone.title}</p>
                  <p className={t("s12 muted")}>{milestone.body}</p>
                  <Tag tone={milestone.tone}>{milestone.tag}</Tag>
                </Stack>
              </Row>
            ))}
          </Stack>
        </div>
        <Row gap={10} className={styles.note} style={{ padding: 13 }}>
          <Icon name="clinician/info" size={16} />
          <p className={t("s12 muted grow")}>
            Temporal alignment supports review, not causal inference. Aligned trends do not
            establish causation; confirm source data and context with the patient.
          </p>
        </Row>
      </Stack>
    </>
  );
}
