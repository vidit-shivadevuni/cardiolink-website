import type { CSSProperties, ReactNode } from "react";
import styles from "./landing.module.css";

export { styles };

/** Combines helper class names from the CSS module, e.g. t("s11 muted"). */
export function t(names: string) {
  return names
    .split(" ")
    .map((name) => styles[name])
    .filter(Boolean)
    .join(" ");
}

/** Renders an icon exported from Figma, stored in public/figma. */
export function Icon({ name, size }: { name: string; size: number }) {
  // Figma's SVGs are served as-is, so next/image optimization isn't needed.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/figma/${name}.svg`} width={size} height={size} alt="" />;
}

type BoxProps = {
  gap?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

export function Stack({ gap = 0, className = "", style, children }: BoxProps) {
  return (
    <div className={`${styles.stack} ${className}`} style={{ gap, ...style }}>
      {children}
    </div>
  );
}

export function Row({ gap = 0, className = "", style, children }: BoxProps) {
  return (
    <div className={`${styles.row} ${className}`} style={{ gap, ...style }}>
      {children}
    </div>
  );
}

export function Section({
  id,
  padding,
  children,
}: {
  id?: string;
  padding?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={styles.section}>
      <div className={styles.inner} style={padding ? { padding } : undefined}>
        {children}
      </div>
    </section>
  );
}

/** One heading line per array item, matching the line breaks in the design. */
export function Lines({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((line) => (
        <span key={line} className={styles.line}>
          {line}
        </span>
      ))}
    </>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string[];
  lede: string;
}) {
  return (
    <div className={styles.intro}>
      <Stack gap={16} className={styles.introHeading}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2 className={styles.heading}>
          <Lines lines={title} />
        </h2>
      </Stack>
      <p className={`${styles.lede} ${styles.grow}`}>{lede}</p>
    </div>
  );
}

export function ButtonLink({
  href,
  variant,
  icon,
  children,
}: {
  href: string;
  variant: "primary" | "secondary" | "inverse";
  icon: string;
  children: ReactNode;
}) {
  return (
    <a href={href} className={`${styles.button} ${styles[variant]}`}>
      {children}
      <Icon name={icon} size={17} />
    </a>
  );
}

export function BenefitList({ items }: { items: string[] }) {
  return (
    <ul className={`${styles.stack} ${styles.full}`} style={{ gap: 16 }}>
      {items.map((item) => (
        <li key={item} className={`${styles.row} ${styles.top} ${styles.full}`} style={{ gap: 12 }}>
          <Icon name="circle-check-1" size={20} />
          <span className={`${styles.body} ${styles.grow}`}>{item}</span>
        </li>
      ))}
    </ul>
  );
}
