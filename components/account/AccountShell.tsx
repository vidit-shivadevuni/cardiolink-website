import Link from "next/link";
import type { ReactNode } from "react";
import ws from "../workspace/workspace.module.css";
import styles from "./account.module.css";

/** Header, centered card and illustrative-data footer shared by the account screens. */
export function AccountShell({ children }: { children: ReactNode }) {
  return (
    <div className={ws.page}>
      <header className={styles.header}>
        <Link href="/" className={ws.brand}>
          CardioLink
        </Link>
        <p className={styles.tagline}>Connected care. Beyond the clinic.</p>
      </header>
      <main className={styles.main}>
        <section className={styles.card}>{children}</section>
      </main>
      <p className={ws.footerNote}>CardioLink · Fictional patients and illustrative data only · Not for clinical decision-making</p>
    </div>
  );
}
