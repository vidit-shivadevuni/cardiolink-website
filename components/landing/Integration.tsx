import { Fragment } from "react";
import { Icon, Row, Section, SectionIntro, Stack, styles, t } from "./shared";

const pathway = ["Home readings", "Team review", "Care record"];

const considerations = [
  {
    icon: "users-round",
    title: "Define team responsibilities",
    body: "Agree who reviews incoming readings and how follow-up is coordinated.",
  },
  {
    icon: "settings-2",
    title: "Align with local protocols",
    body: "Set patient-specific ranges, review schedules and escalation pathways.",
  },
  {
    icon: "unplug",
    title: "Assess your environment",
    body: "Discuss device compatibility, data access and record-sharing needs.",
  },
];

export function Integration() {
  return (
    <Section id="clinical-integration">
      <Stack gap={32}>
        <SectionIntro
          eyebrow="Built around your clinical workflow"
          title={["Connect the care, not just the devices."]}
          lede="A thoughtful rollout starts with your people, systems and protocols. Define the fit before you begin."
        />
        <div className={styles.integrationRow}>
          <Stack gap={28} className={styles.integrationCard}>
            <Row gap={14} className={styles.full}>
              <Icon name="workflow" size={28} />
              <h3 className={t("s22 w6 white")}>Clinical integration, considered.</h3>
            </Row>
            <p className={t("s16 lh16 white")}>
              Plan how home readings can sit alongside your existing care pathway, from enrollment
              to review and documentation.
            </p>
            <div className={styles.pathway}>
              {pathway.map((stage, index) => (
                <Fragment key={stage}>
                  <span>{stage}</span>
                  {index < pathway.length - 1 && <Icon name="arrow-right-3" size={18} />}
                </Fragment>
              ))}
            </div>
            <p className={t("s12 lh16 white")}>
              Device and EHR connections are subject to technical assessment and availability. No
              live integration is represented here.
            </p>
          </Stack>
          <Stack gap={24} className={`${styles.panel} ${styles.considerations}`}>
            {considerations.map((item, index) => (
              <Stack key={item.title} gap={20} className={styles.full}>
                {index > 0 && <div className={styles.divider} />}
                <Row gap={16} className={`${styles.full} ${styles.top}`}>
                  <Icon name={item.icon} size={22} />
                  <Stack gap={7} className={styles.grow}>
                    <h3 className={t("s16 w6 navy")}>{item.title}</h3>
                    <p className={t("s14 lh16 ink")}>{item.body}</p>
                  </Stack>
                </Row>
              </Stack>
            ))}
          </Stack>
        </div>
      </Stack>
    </Section>
  );
}
