import Link from "next/link";
import { ButtonLink, Icon, styles } from "./shared";

// Section links are root-relative so they also work from other pages, such as /demo.
const navLinks = [
  { label: "Why CardioLink", href: "/#who-we-support" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "For patients", href: "/#for-patients" },
  { label: "FAQs", href: "/#faqs" },
  { label: "Sign in", href: "/account/sign-in" },
];

/** The marketing site's main navigation bar, shared by the landing page and /demo. */
export function SiteNav() {
  return (
    <div className={styles.navWrap}>
      <nav className={styles.nav} aria-label="Main">
        <Link href="/" id="top" className={styles.brand}>
          <Icon name="heart-pulse" size={32} />
          CardioLink
        </Link>
        <div className={styles.navLinks}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
        <ButtonLink href="/demo" variant="primary" icon="arrow-right">
          Request Demo
        </ButtonLink>
      </nav>
    </div>
  );
}
