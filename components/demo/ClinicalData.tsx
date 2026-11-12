/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";
import { Icon, Row, Stack, Tag, styles, t } from "./shared";
import { ActionButton } from "./Interactive";

type Assessment = {
  code: string;
  name: string;
  domain: string;
  reference: string;
  status: string;
  pending?: boolean;
};

const assessments: Assessment[][] = [
  [
    {
      code: "ACE",
      name: "Adverse Childhood Experiences",
      domain: "Psychological history · adversity",
      reference: "Reference: Before age 18 · retrospective",
      status: "Not scheduled · discuss consent",
    },
    {
      code: "CTQ",
      name: "Childhood Trauma Questionnaire",
      domain: "Psychological history · trauma",
      reference: "Reference: Childhood / adolescence · retrospective",
      status: "Not scheduled · sensitive content",
    },
  ],
  [
    {
      code: "PSS",
      name: "Perceived Stress Scale",
      domain: "Current state · perceived stress",
      reference: "Reference: Past month",
      status: "No questionnaire administered",
    },
    {
      code: "DASS",
      name: "Depression Anxiety Stress Scales",
      domain: "Current state · emotional distress",
      reference: "Reference: Past week",
      status: "Version to be selected by clinician",
    },
  ],
  [
    {
      code: "PHQ-9",
      name: "Patient Health Questionnaire-9",
      domain: "Current state · depressive symptoms",
      reference: "Reference: Past 2 weeks",
      status: "Scheduled 16 Oct 2026 · patient portal",
      pending: true,
    },
    {
      code: "GAD-7",
      name: "Generalized Anxiety Disorder-7",
      domain: "Current state · anxiety symptoms",
      reference: "Reference: Past 2 weeks",
      status: "Scheduled 16 Oct 2026 · patient portal",
      pending: true,
    },
  ],
];

const radarLayers = [
  { name: "radar-grid", left: 112, top: 46, width: 296, height: 256 },
  { name: "somatic-context-shape", left: 260, top: 70, width: 119, height: 104 },
  { name: "current-psychological-context-shape", left: 260, top: 174, width: 112, height: 97 },
  { name: "psychological-history-context-shape", left: 171, top: 142, width: 89, height: 71 },
];

const radarLabels: { text: string; color: string; style: CSSProperties }[] = [
  {
    text: "Blood pressure",
    color: "var(--teal-text)",
    style: { left: 200, top: 15, width: 120, textAlign: "center" },
  },
  { text: "Heart rhythm", color: "var(--teal-text)", style: { left: 411, top: 93, width: 100 } },
  { text: "Anxiety", color: "var(--blue)", style: { left: 411, top: 235, width: 100 } },
  {
    text: "Perceived stress",
    color: "var(--blue)",
    style: { left: 200, top: 319, width: 120, textAlign: "center" },
  },
  {
    text: "Childhood adversity",
    color: "var(--navy)",
    style: { left: 2, top: 230, width: 100, textAlign: "right" },
  },
  {
    text: "Early environment",
    color: "var(--navy)",
    style: { left: 0, top: 88, width: 100, textAlign: "right" },
  },
];

const profileDomains = [
  { color: "var(--teal)", title: "Somatic status", source: "Clinical record + home readings" },
  { color: "var(--navy)", title: "Psychological past", source: "Patient-reported history" },
  {
    color: "var(--blue)",
    title: "Current psychological status",
    source: "Patient-reported symptoms",
  },
];

const sources = [
  {
    title: "Clinical record",
    body: "01 Sep 2026 · Hypertension, atrial fibrillation; allergy list requires review.",
  },
  {
    title: "Home reading",
    body: "02 Sep – 14 Oct 2026 · Weekly BP entries; patient-entered values.",
  },
  {
    title: "Patient reported",
    body: "01 Sep – 14 Oct 2026 · History, stress, sleep and dated life events.",
  },
];

function AssessmentCard({ assessment }: { assessment: Assessment }) {
  return (
    <Stack gap={12} className={`${styles.card} ${styles.pad18} ${styles.assessment}`}>
      <Row className={styles.between}>
        <h4 className={t("s20 w6")}>{assessment.code}</h4>
        <Tag tone={assessment.pending ? "positive" : "neutral"}>
          {assessment.pending ? "Pending" : "Not assessed"}
        </Tag>
      </Row>
      <p className={t("s13 w6 full")}>{assessment.name}</p>
      <Stack gap={5} className={styles.full}>
        <p className={t("s11 muted full")}>{assessment.domain}</p>
        <p className={t("s12 full")}>{assessment.reference}</p>
      </Stack>
      <div className={styles.divider} />
      <Row gap={8} className={styles.full}>
        <Icon name={`clinical/${assessment.pending ? "calendar-days" : "circle-minus"}`} size={14} />
        <p className={t("s11 muted grow")}>{assessment.status}</p>
      </Row>
    </Stack>
  );
}

function ConceptualRadar() {
  return (
    <div className={styles.scroll}>
      <div
        className={styles.radar}
        role="img"
        aria-label="Conceptual radar map of somatic status, psychological past and current psychological status. Illustrative only, not validated scores."
      >
        {radarLayers.map((layer) => (
          <div
            key={layer.name}
            className={styles.layer}
            style={{ left: layer.left, top: layer.top, width: layer.width, height: layer.height }}
          >
            <img src={`/figma/clinical/${layer.name}.svg`} alt="" />
          </div>
        ))}
        {radarLabels.map((label) => (
          <span
            key={label.text}
            className={styles.radarLabel}
            style={{ color: label.color, ...label.style }}
          >
            {label.text}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ClinicalData() {
  return (
    <>
      <Row gap={12} className={`${styles.between} ${styles.wrap}`}>
        <Stack gap={3}>
          <h2 className={t("s22 w6")}>From data to a profile</h2>
          <p className={t("s13 muted")}>
            Keep measured results, reported experience and conceptual context distinct.
          </p>
        </Stack>
        <ActionButton icon="clinical/calendar-plus" dialog="schedule">
          Schedule assessment
        </ActionButton>
      </Row>

      <div className={styles.dataLayout}>
        <Stack gap={16} className={styles.grow} style={{ flexBasis: "auto" }}>
          <Row className={styles.between}>
            <h3 className={t("s16 w6")}>Standardized assessments</h3>
            <p className={t("s12 muted")}>0 of 6 assessed</p>
          </Row>
          {assessments.map((row) => (
            <div key={row[0].code} className={styles.assessmentRow}>
              {row.map((assessment) => (
                <AssessmentCard key={assessment.code} assessment={assessment} />
              ))}
            </div>
          ))}
          <Row
            gap={10}
            className={`${styles.note} ${styles.noteGreen} ${styles.alignTop}`}
            style={{ padding: 14 }}
          >
            <Icon name="clinical/info" size={18} />
            <p className={t("s12 green grow")}>
              Scheduled, repeated standardized assessments are separate from daily or event-based
              self-reports. No results are inferred from check-ins.
            </p>
          </Row>
        </Stack>

        <Stack gap={18} className={`${styles.card} ${styles.pad24} ${styles.profile}`}>
          <Row className={styles.between}>
            <h3 className={t("s18 w6")}>Holistic profile</h3>
            <Tag tone="positive">Conceptual · illustrative</Tag>
          </Row>
          <p className={t("s12 muted")}>Three domains of context, not a single clinical score.</p>
          <ConceptualRadar />
          <Stack gap={9} className={styles.full}>
            {profileDomains.map((domain) => (
              <Row key={domain.title} gap={9} className={styles.full}>
                <span className={styles.domainKey} style={{ background: domain.color }} />
                <Stack gap={1} className={styles.grow}>
                  <p className={t("s12 w6 full")}>{domain.title}</p>
                  <p className={t("s11 muted full")}>{domain.source}</p>
                </Stack>
              </Row>
            ))}
          </Stack>
          <Stack gap={5} className={styles.note} style={{ padding: 13 }}>
            <p className={t("s12 w6 full")}>Read as a conceptual map only</p>
            <p className={t("s11 muted full")}>
              Shape and distance are illustrative, not comparable validated scores. Not calculated
              from the pending assessments; no causal direction is assumed.
            </p>
          </Stack>
        </Stack>
      </div>

      <Stack gap={12} className={`${styles.card} ${styles.pad18} ${styles.full}`}>
        <Row gap={12} className={`${styles.between} ${styles.alignTop}`}>
          <h3 className={t("s14 w6")}>Source provenance &amp; time context</h3>
          <p className={t("s11 muted")}>Updated 14 Oct 2026</p>
        </Row>
        <div className={styles.sources}>
          {sources.map((source) => (
            <Stack key={source.title} gap={5} className={styles.grow}>
              <p className={t("s12 w6 full")}>{source.title}</p>
              <p className={t("s11 muted full")}>{source.body}</p>
            </Stack>
          ))}
        </div>
      </Stack>
    </>
  );
}
