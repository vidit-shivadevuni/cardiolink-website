import type { Metadata } from "next";
import { CARE_TEAM } from "@/lib/demo-data";
import styles from "@/components/workspace/workspace.module.css";

export const metadata: Metadata = { title: "Care team – CardioLink" };

export default function CareTeamPage() {
  return (
    <main className={styles.main}>
      <div className={styles.pageHeader}>
        <div className={styles.stack8}>
          <h1 className={styles.h1}>Care team</h1>
          <p className={styles.muted13}>Members, responsibilities and access for your cardiology workspace.</p>
        </div>
      </div>
      <section className={styles.card} aria-label="Care team members">
        <ul>
          {CARE_TEAM.map((m) => (
            <li key={m.name} className={styles.teamRow}>
              <strong style={{ fontSize: 13 }}>{m.name}</strong>
              <span className={styles.teamRole}>{m.role}</span>
              <span className={styles.muted12}>{m.scope}</span>
            </li>
          ))}
        </ul>
      </section>
      <p className={styles.muted12} style={{ marginTop: 20 }}>
        Access is role-based and limited to assigned patients. Contact your organisation administrator to change a role.
      </p>
    </main>
  );
}
