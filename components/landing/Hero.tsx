import Link from "next/link";
import { ButtonLink, Icon, Lines, Row, Stack, styles, t } from "./shared";

const navLinks = [
  { label: "Why CardioLink", href: "#who-we-support" },
  { label: "How it works", href: "#how-it-works" },
  { label: "For patients", href: "#for-patients" },
  { label: "FAQs", href: "#faqs" },
  { label: "Patient demo", href: "/demo/clinician" },
];

const metrics = [
  { value: "24", label: "Enrolled patients", color: "navy" },
  { value: "18", label: "Check-ins received", color: "teal" },
  { value: "03", label: "For review", color: "red" },
];

function Metric({ value, label, color }: (typeof metrics)[number]) {
  return (
    <Stack gap={7} className={`${styles.panel} ${styles.metric}`}>
      <p className={t(`s27 w6 ${color}`)}>{value}</p>
      <p className={t("s11 muted")}>{label}</p>
    </Stack>
  );
}

function PatientRow(props: {
  initials: string;
  name: string;
  detail: string;
  reading: string;
  statusIcon: string;
  status: string;
  statusColor: string;
}) {
  return (
    <div className={styles.patientRow}>
      <div className={styles.initials}>{props.initials}</div>
      <Stack gap={5} className={styles.grow}>
        <p className={t("s13 w6 navy")}>{props.name}</p>
        <p className={t("s11 muted")}>{props.detail}</p>
      </Stack>
      <p className={t("s13 w5 navy")} style={{ width: 94 }}>
        {props.reading}
      </p>
      <Row gap={6} style={{ width: 108 }}>
        <Icon name={props.statusIcon} size={14} />
        <p className={t(`s11 w5 ${props.statusColor}`)}>{props.status}</p>
      </Row>
    </div>
  );
}

function Dashboard() {
  return (
    <div className={`${styles.card} ${styles.dashboard}`} style={{ padding: 0 }}>
      <Row className={`${styles.between} ${styles.toolbar}`}>
        <Row gap={8}>
          <Icon name="heart-pulse-1" size={20} />
          <p className={t("s14 w7 navy")}>CardioLink</p>
          <p className={t("s11 muted")}>/ Care team</p>
        </Row>
        <Row gap={16}>
          <Icon name="bell" size={17} />
          <p className={t("s11 w5 navy")}>Dr. Morgan</p>
        </Row>
      </Row>
      <div className={styles.divider} />
      <Stack gap={20} className={styles.dashboardBody} style={{ padding: 32 }}>
        <Row className={styles.between}>
          <Stack gap={5}>
            <p className={t("s22 w6 navy")}>Your patient overview</p>
            <p className={t("s11 muted")}>Monday, 19 October · Last synced 09:41</p>
          </Stack>
          <Icon name="sliders-horizontal" size={18} />
        </Row>
        <Row gap={12} className={t("full top")} style={{ alignItems: "stretch" }}>
          {metrics.map((metric) => (
            <Metric key={metric.label} {...metric} />
          ))}
        </Row>
        <Stack className={styles.full}>
          <Row className={`${styles.between} ${styles.top}`}>
            <p className={t("s12 w6 navy")}>Recent readings</p>
            <Link href="/demo/clinician" className={t("s11 blue")}>
              View patients ↗
            </Link>
          </Row>
          <PatientRow
            initials="AJ"
            name="Alex Johnson"
            detail="Blood pressure · 09:38"
            reading="148/92 mmHg"
            statusIcon="circle-alert"
            status="For review"
            statusColor="red"
          />
          <div className={styles.divider} />
          <PatientRow
            initials="SL"
            name="Sam Lee"
            detail="Heart rate · 09:32"
            reading="72 bpm"
            statusIcon="circle-check"
            status="On track"
            statusColor="teal"
          />
        </Stack>
        <Stack gap={10} className={`${styles.panel} ${styles.full}`} style={{ padding: 16 }}>
          <Row gap={12} className={`${styles.between} ${styles.top}`}>
            <p className={t("s12 w6 navy")}>ECG snapshot</p>
            <p className={t("s10 muted")}>Illustrative waveform · 25 mm/s</p>
          </Row>
          <div className={styles.ecg}>
            <div className={styles.fill} style={{ top: "-0.43%", bottom: "-0.47%" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/figma/illustrative-ecg-waveform.svg" alt="Illustrative ECG waveform" />
            </div>
          </div>
        </Stack>
        <p className={t("s10 muted full")}>
          Illustrative data only. Names, readings and waveforms are fictional.
        </p>
      </Stack>
    </div>
  );
}

export function Hero() {
  return (
    <header className={styles.heroSection}>
      <div className={styles.navWrap}>
        <nav className={styles.nav} aria-label="Main">
          <a href="#top" id="top" className={styles.brand}>
            <Icon name="heart-pulse" size={32} />
            CardioLink
          </a>
          <div className={styles.navLinks}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
          <ButtonLink href="#request-a-demo" variant="primary" icon="arrow-right">
            Request a demo
          </ButtonLink>
        </nav>
      </div>

      <div className={styles.hero}>
        <Stack gap={28} className={styles.heroMessage}>
          <h1 className={styles.heroTitle}>
            <Lines lines={["Connected care.", "Beyond the clinic."]} />
          </h1>
          <p className={styles.lede}>
            A clearer connection between visits. Bring home readings, patient check-ins and
            care-team review into one thoughtful cardiology workspace.
          </p>
          <div className={styles.heroActions}>
            <ButtonLink href="#request-a-demo" variant="primary" icon="arrow-right">
              Request a demo
            </ButtonLink>
            <ButtonLink href="#how-it-works" variant="secondary" icon="arrow-right-1">
              See how it works
            </ButtonLink>
          </div>
          <Row gap={12}>
            <Icon name="heart-handshake" size={20} />
            <p className={t("s13 muted")}>Built around people. Guided by your care team.</p>
          </Row>
        </Stack>
        <Dashboard />
      </div>

      <div className={styles.context}>
        <p className={t("s12 muted")}>
          A remote patient monitoring concept for more connected cardiac care.
        </p>
        <div className={styles.workflow}>
          <span>At home</span>
          <Icon name="arrow-right-2" size={14} />
          <span>With your team</span>
          <Icon name="arrow-right-2" size={14} />
          <span>Between visits</span>
        </div>
      </div>
    </header>
  );
}
