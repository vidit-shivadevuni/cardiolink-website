import { BenefitList, Icon, Lines, Row, Section, Stack, styles, t } from "./shared";

function PatientApp() {
  return (
    <Stack gap={22} className={`${styles.card} ${styles.app}`}>
      <Row className={styles.between}>
        <Row gap={7}>
          <Icon name="heart-pulse-1" size={20} />
          <p className={t("s14 w7 navy")}>CardioLink</p>
        </Row>
        <Icon name="menu" size={18} />
      </Row>
      <div className={styles.divider} />
      <Stack gap={8} className={styles.full}>
        <p className={t("s22 w6 navy")}>Good morning, Sam.</p>
        <p className={t("s13 lh16 ink")}>A small check-in for your heart today.</p>
      </Stack>
      <Stack gap={18} className={`${styles.panel} ${styles.dailyPlan}`}>
        <Row className={`${styles.between} ${styles.top}`}>
          <p className={t("s13 w6 navy")}>Your daily check-in</p>
          <p className={t("s11 teal")}>1 of 2</p>
        </Row>
        <Row gap={10}>
          <Icon name="circle-check-1" size={20} />
          <Stack gap={4}>
            <p className={t("s12 w6 navy")}>Blood pressure recorded</p>
            <p className={t("s11 muted")}>124/78 mmHg · 08:30</p>
          </Stack>
        </Row>
        <div className={styles.divider} />
        <Row gap={10}>
          <Icon name="circle" size={20} />
          <p className={t("s12 navy")}>Tell us how you&apos;re feeling</p>
        </Row>
        <div className={styles.checkin}>Continue check-in</div>
      </Stack>
      <Row gap={10} className={styles.full} style={{ padding: "6px 0" }}>
        <Icon name="message-circle" size={18} />
        <p className={t("s12 w5 blue")}>Message your care team</p>
      </Row>
      <p className={t("s10 muted center full")}>Illustrative patient experience</p>
    </Stack>
  );
}

export function PatientExperience() {
  return (
    <Section id="for-patients">
      <div className={styles.split} style={{ gap: 80 }}>
        <div className={styles.appPresentation}>
          <PatientApp />
        </div>
        <Stack gap={24} className={styles.grow}>
          <p className={styles.eyebrow}>For the person behind the readings</p>
          <h2 className={styles.heading}>
            <Lines lines={["A simple routine.", "A more connected day."]} />
          </h2>
          <p className={styles.lede}>
            Care shouldn&apos;t feel like another complicated task. CardioLink gives patients a
            clear place to check in, share a reading and find their care team&apos;s guidance.
          </p>
          <BenefitList
            items={[
              "A daily plan that's easy to follow",
              "Space to share symptoms in your own words",
              "A clear connection to your care team",
            ]}
          />
          <Stack gap={10} className={styles.emergency}>
            <Row gap={8}>
              <Icon name="circle-alert-2" size={17} />
              <h3 className={t("s13 w6 navy")}>Not for emergencies</h3>
            </Row>
            <p className={t("s13 lh16 ink")}>
              Readings and messages are not continuously monitored. For chest pain, severe shortness
              of breath or a medical emergency, call your local emergency number.
            </p>
          </Stack>
        </Stack>
      </div>
    </Section>
  );
}
