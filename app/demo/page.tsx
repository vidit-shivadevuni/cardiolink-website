import { existsSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { Footer } from "@/components/landing/Footer";
import { SiteNav } from "@/components/landing/SiteNav";
import { Icon, Stack, styles as landing, t } from "@/components/landing/shared";
import { DemoRequestForm } from "@/components/request-demo/DemoRequestForm";
import styles from "@/components/request-demo/request-demo.module.css";

export const metadata: Metadata = {
  title: "Request a demo – CardioLink",
  description:
    "Schedule a personalized CardioLink demo and see how home readings, check-ins and care-team review come together.",
};

const expectations = [
  {
    icon: "clinical/calendar-plus",
    title: "Quick Response",
    body: "We'll reach out within 24-48 hours to schedule your demo at a time that works for you.",
  },
  {
    icon: "list-checks",
    title: "Personalized Demo",
    body: "See features tailored to your organization's specific needs and workflows.",
  },
  {
    icon: "messages-square",
    title: "Expert Guidance",
    body: "Get answers to all your questions from our product specialists.",
  },
];

// Drop the narrated walkthrough here (and an optional poster frame) and the player appears automatically.
const INTRO_VIDEO = "/videos/cardiolink-intro.mp4";
const INTRO_POSTER = "/videos/cardiolink-intro-poster.jpg";

function IntroVideo() {
  const publicFile = (src: string) => existsSync(path.join(process.cwd(), "public", src));
  if (!publicFile(INTRO_VIDEO)) {
    return (
      <div className={styles.videoPlaceholder} role="img" aria-label="Intro video coming soon">
        <span className={styles.playBadge} aria-hidden="true">
          ▶
        </span>
        <p className={t("s16 w6 white")}>A 2-minute tour of the clinician workspace</p>
        <p className={t("s13 white")}>Intro video coming soon</p>
      </div>
    );
  }
  return (
    <video
      className={styles.video}
      controls
      preload="metadata"
      playsInline
      poster={publicFile(INTRO_POSTER) ? INTRO_POSTER : undefined}
    >
      <source src={INTRO_VIDEO} type="video/mp4" />
      Your browser can&apos;t play this video.
    </video>
  );
}

const stats = [
  { value: "24-48h", label: "Average Response Time" },
  { value: "30 min", label: "Demo Duration" },
];

export default function RequestDemoPage() {
  return (
    <div className={styles.page}>
      <header className={landing.heroSection}>
        <SiteNav />
      </header>

      <main className={styles.layout}>
        <div className={styles.info}>
          <Stack gap={20}>
            <p className={landing.eyebrow}>Request a demo</p>
            <h1 className={styles.title}>See CardioLink in Action</h1>
            <p className={landing.lede}>
              Schedule a personalized demo to discover how our platform can bring home readings,
              patient check-ins and care-team review into one connected cardiology workspace.
            </p>
          </Stack>

          <Stack gap={12} className={landing.full}>
            <IntroVideo />
            <p className={t("s13 muted")}>
              A short look at the clinician homepage. The full interactive workspace is shared after your demo.
            </p>
          </Stack>

          <Stack gap={24} className={landing.full}>
            <h2 className={landing.cardTitle}>What to Expect</h2>
            <ul className={`${landing.stack} ${landing.full}`} style={{ gap: 24 }}>
              {expectations.map((item) => (
                <li key={item.title} className={styles.expectItem}>
                  <span className={styles.iconTile}>
                    <Icon name={item.icon} size={24} />
                  </span>
                  <Stack gap={6} className={landing.grow}>
                    <h3 className={t("s16 w6 navy")}>{item.title}</h3>
                    <p className={landing.body}>{item.body}</p>
                  </Stack>
                </li>
              ))}
            </ul>
          </Stack>

          <div className={styles.stats}>
            {stats.map((stat) => (
              <div key={stat.label} className={`${landing.card} ${styles.stat}`}>
                <p className={styles.statValue}>{stat.value}</p>
                <p className={t("s13 muted")}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <section className={`${landing.card} ${styles.formCard}`} aria-label="Demo request form">
          <DemoRequestForm />
        </section>
      </main>

      <Footer />
    </div>
  );
}
