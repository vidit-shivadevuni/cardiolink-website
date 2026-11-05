import { Icon, Row, Stack, styles, t } from "./shared";

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Why CardioLink", href: "#who-we-support" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Clinical integration", href: "#clinical-integration" },
    ],
  },
  {
    title: "For you",
    links: [
      { label: "Care teams", href: "/demo/clinician" },
      { label: "Organizations", href: "#who-we-support" },
      { label: "Patients & families", href: "#for-patients" },
    ],
  },
  {
    title: "Get in touch",
    links: [
      { label: "Request a demo", href: "#request-a-demo" },
      { label: "Questions & answers", href: "#faqs" },
      { label: "Contact the team", href: "#request-a-demo" },
    ],
  },
];

export function Footer() {
  return (
    <footer className={styles.navySection}>
      <Stack gap={32} className={styles.footer}>
        <div className={styles.footerDivider} />
        <div className={styles.footerContent}>
          <Stack gap={18} className={styles.footerBrand}>
            <Row gap={10}>
              <Icon name="heart-pulse" size={32} />
              <p className={t("s25 w7 white")}>CardioLink</p>
            </Row>
            <p className={t("s14 lh16 white")}>Connected care. Beyond the clinic.</p>
            <p className={t("s12 white")}>Team 1 – Cardiology · Product concept</p>
          </Stack>
          {columns.map((column) => (
            <nav key={column.title} className={styles.footerNav} aria-label={column.title}>
              <p className={t("w6")}>{column.title}</p>
              {column.links.map((link) => (
                <a key={link.label} href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
          ))}
        </div>
        <Stack gap={18} className={t("full white")}>
          <p className={t("s12 lh16 full")}>
            Concept design only. All product screens and patient data are illustrative. Not a
            medical device claim, diagnostic service or emergency monitoring service.
          </p>
          <div className={styles.legalRow}>
            <p>© 2026 CardioLink · Team 1 – Cardiology</p>
            {/* These pages don't exist yet, so they stay as plain text rather than dead links. */}
            <Row gap={24}>
              <span>Privacy</span>
              <span>Terms</span>
              <span>Accessibility</span>
            </Row>
          </div>
        </Stack>
      </Stack>
    </footer>
  );
}
