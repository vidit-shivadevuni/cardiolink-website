import { BenefitList, Icon, Lines, Row, Section, Stack, styles, t } from "./shared";

const gridLines = [
  { label: "160", top: 28 },
  { label: "130", top: 83 },
  { label: "100", top: 138 },
  { label: "70", top: 193 },
];

const dates = ["06 Oct", "09 Oct", "12 Oct", "15 Oct", "19 Oct"];

function Trend(props: {
  name: string;
  top: number;
  height: number;
  insetTop: string;
  insetBottom: string;
}) {
  return (
    <div className={styles.trend} style={{ top: props.top, height: props.height }}>
      <div className={styles.fill} style={{ top: props.insetTop, bottom: props.insetBottom }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/figma/${props.name}.svg`} alt="" />
      </div>
    </div>
  );
}

function LegendItem({ label, color }: { label: string; color: string }) {
  return (
    <Row gap={6}>
      <div className={styles.legendSwatch} style={{ background: color }} />
      <p className={t("s10 muted")}>{label}</p>
    </Row>
  );
}

function TrendMockup() {
  return (
    <Stack gap={24} className={`${styles.card} ${styles.insightMockup}`}>
      <Row gap={12} className={styles.between}>
        <Stack gap={7}>
          <p className={t("s18 w6 navy")}>Sam Lee · Patient trends</p>
          <p className={t("s11 muted")}>Illustrative patient record</p>
        </Stack>
        <div className={styles.selector}>
          Last 14 days
          <Icon name="chevron-down" size={14} />
        </div>
      </Row>
      <div className={styles.divider} />
      <Row className={styles.between}>
        <p className={t("s14 w6 navy")}>Blood pressure</p>
        <Row gap={16}>
          <LegendItem label="Systolic" color="var(--teal)" />
          <LegendItem label="Diastolic" color="var(--blue)" />
        </Row>
      </Row>
      <div className={styles.chartScroll}>
        <div
          className={styles.chart}
          role="img"
          aria-label="Illustrative chart of systolic and diastolic blood pressure from 6 to 19 October."
        >
          <p style={{ position: "absolute", left: 0, top: 0 }}>mmHg</p>
          {gridLines.map((line) => (
            <div key={line.label} className={styles.gridLine} style={{ top: line.top }}>
              <p className={styles.gridLabel}>{line.label}</p>
              <div className={styles.connector} />
            </div>
          ))}
          <Trend name="systolic-trend" top={39} height={85} insetTop="-2.2%" insetBottom="-2.11%" />
          <Trend
            name="diastolic-trend"
            top={149}
            height={50}
            insetTop="-3.15%"
            insetBottom="-2.76%"
          />
          <div className={styles.dates}>
            {dates.map((date) => (
              <p key={date}>{date}</p>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.note}>
        <Icon name="message-square" size={18} />
        <Stack gap={6} className={t("grow s12")}>
          <p className={t("w6 navy")}>Patient check-in · 15 Oct</p>
          <p className={t("ink")}>“Took my reading after breakfast today.”</p>
        </Stack>
        <p className={t("s10 muted")}>Example note</p>
      </div>
    </Stack>
  );
}

export function Insight() {
  return (
    <Section id="patient-insight">
      <div className={styles.split} style={{ gap: 64 }}>
        <Stack gap={24} className={styles.insightMessage}>
          <p className={styles.eyebrow}>The story over time</p>
          <h2 className={styles.heading}>
            <Lines lines={["One reading is a moment.", "A trend adds context."]} />
          </h2>
          <p className={styles.lede}>
            See daily measurements alongside symptoms and notes. Prepare for a more informed
            conversation, not just the next data point.
          </p>
          <BenefitList
            items={[
              "Explore readings across days and weeks",
              "Bring patient-reported context into view",
              "Keep follow-up notes close to the data",
            ]}
          />
          <p className={t("s12 lh16 muted")}>
            Trends are illustrative, not evidence of a treatment effect. Interpretation and care
            decisions remain with the clinical team.
          </p>
        </Stack>
        <TrendMockup />
      </div>
    </Section>
  );
}
