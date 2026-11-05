import { Icon, Row, Section, Stack, styles, t } from "./shared";

const steps = [
  {
    number: "01",
    icon: "clipboard-list",
    title: "Build the care plan",
    body: "Your team chooses the readings, check-in schedule and review process that fit each patient.",
  },
  {
    number: "02",
    icon: "smartphone",
    title: "Connect from home",
    body: "Patients follow a simple routine to record measurements and share how they are feeling.",
  },
  {
    number: "03",
    icon: "stethoscope-1",
    title: "Review and follow up",
    body: "Care teams review trends and context, then decide when a conversation or next step is needed.",
  },
];

export function HowItWorks() {
  return (
    <Section id="how-it-works">
      <Stack gap={36}>
        <div className={styles.howIntro}>
          <Stack gap={16} className={styles.howHeading}>
            <p className={styles.eyebrow}>A shared rhythm of care</p>
            <h2 className={styles.heading}>From a daily reading to a care conversation.</h2>
          </Stack>
          <p className={`${t("s14 lh16 muted")} ${styles.howAside}`}>
            Your clinical protocols lead the way. CardioLink connects the steps.
          </p>
        </div>
        <div className={styles.steps}>
          {steps.map((step) => (
            <Stack key={step.number} gap={24} className={styles.grow}>
              <Row gap={20} className={styles.full}>
                <p className={t("s14 w6 teal")}>{step.number}</p>
                <div className={styles.connector} />
                <Icon name={step.icon} size={26} />
              </Row>
              <Stack gap={14} className={styles.full}>
                <h3 className={styles.cardTitle}>{step.title}</h3>
                <p className={styles.body}>{step.body}</p>
              </Stack>
            </Stack>
          ))}
        </div>
      </Stack>
    </Section>
  );
}
