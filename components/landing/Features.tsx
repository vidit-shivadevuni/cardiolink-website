import type { ReactNode } from "react";
import { Icon, Row, Section, SectionIntro, Stack, styles, t } from "./shared";

function FeatureCard(props: {
  preview: ReactNode;
  previewGap: number;
  icon: string;
  title: string;
  body: string;
}) {
  return (
    <Stack gap={24} className={`${styles.card} ${styles.grow}`}>
      <Stack gap={props.previewGap} className={`${styles.panel} ${styles.preview}`}>
        {props.preview}
      </Stack>
      <Stack gap={16} className={styles.full}>
        <Icon name={props.icon} size={26} />
        <h3 className={styles.cardTitle}>{props.title}</h3>
        <p className={styles.body}>{props.body}</p>
      </Stack>
    </Stack>
  );
}

export function Features() {
  return (
    <Section id="features">
      <Stack gap={32}>
        <SectionIntro
          eyebrow="Remote monitoring, thoughtfully connected"
          title={["The right signals.", "A clearer next step."]}
          lede="Less searching across disconnected information. More context for your team's clinical judgment."
        />
        <div className={styles.cols3}>
          <FeatureCard
            previewGap={18}
            preview={
              <>
                <Row gap={8}>
                  <Icon name="activity" size={16} />
                  <p className={t("s11 muted")}>LATEST BLOOD PRESSURE</p>
                </Row>
                <Row gap={8} className={styles.baseline}>
                  <p className={t("s32 w6 navy")}>124/78</p>
                  <p className={t("s12 muted")}>mmHg</p>
                </Row>
                <Row className={`${styles.between} ${styles.top}`}>
                  <p className={t("s11 muted")}>Today, 08:30</p>
                  <p className={t("s11 teal")}>Home reading</p>
                </Row>
              </>
            }
            icon="activity-1"
            title="Bring readings together"
            body="View blood pressure, heart rate, weight and supported device data in a shared patient record."
          />
          <FeatureCard
            previewGap={18}
            preview={
              <>
                <Row gap={8}>
                  <Icon name="circle-alert-1" size={16} />
                  <p className={t("s11 w6 red")}>READING FOR REVIEW</p>
                </Row>
                <p className={t("s14 w5 lh15 navy")}>
                  Outside the care team&apos;s configured range
                </p>
                <Row className={`${styles.between} ${styles.top}`}>
                  <p className={t("s11 muted")}>Assigned to care team</p>
                  <Icon name="arrow-up-right" size={16} />
                </Row>
              </>
            }
            icon="list-checks"
            title="Review with context"
            body="Organize readings for review using care-team-defined ranges, patient notes and recent trends."
          />
          <FeatureCard
            previewGap={16}
            preview={
              <>
                <p className={t("s14 w6 navy")}>How are you feeling today?</p>
                <Row gap={8} className={styles.full}>
                  <span className={`${styles.option} ${styles.optionSelected}`}>Well</span>
                  <span className={styles.option}>Tired</span>
                  <span className={styles.option}>Other</span>
                </Row>
                <p className={t("s11 teal")}>✓ Shared with your care team</p>
              </>
            }
            icon="messages-square"
            title="Hear the everyday story"
            body="Pair measurements with simple symptom check-ins and messages that add a human layer."
          />
        </div>
        <Row gap={10} className={`${styles.full} ${styles.top}`}>
          <Icon name="info" size={16} />
          <p className={t("s12 lh15 muted grow")}>
            Concept previews use illustrative data. CardioLink supports review; it does not
            diagnose conditions or replace clinical judgment.
          </p>
        </Row>
      </Stack>
    </Section>
  );
}
