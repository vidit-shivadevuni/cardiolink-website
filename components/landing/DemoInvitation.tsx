import { ButtonLink, Stack, styles, t } from "./shared";

export function DemoInvitation() {
  return (
    <section id="request-a-demo" className={styles.navySection}>
      <div className={styles.demo}>
        <Stack gap={20} className={styles.demoMessage}>
          <h2 className={t("w7 lh116 white")} style={{ fontSize: "clamp(30px, 5vw, 40px)" }}>
            Let&apos;s connect the next chapter of cardiac care.
          </h2>
          <p className={t("s18 lh16 white")}>
            Explore the CardioLink concept with your team. Start with your patients, your workflow
            and the questions that matter.
          </p>
        </Stack>
        <Stack gap={16} className={styles.demoAction}>
          {/* The design doesn't specify a destination; replace this href with a form or email link. */}
          <ButtonLink href="#request-a-demo" variant="inverse" icon="arrow-right-1">
            Request a demo
          </ButtonLink>
          <p className={t("s12 white")}>A conversation, not a commitment.</p>
        </Stack>
      </div>
    </section>
  );
}
