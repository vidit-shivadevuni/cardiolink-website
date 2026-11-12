import type { Metadata } from "next";
import Link from "next/link";
import { AccountShell } from "@/components/account/AccountShell";
import { PatientSignInNote } from "@/components/account/AccountForms";
import styles from "@/components/account/account.module.css";
import ws from "@/components/workspace/workspace.module.css";

export const metadata: Metadata = { title: "Welcome – CardioLink" };

export default function ChooseAccountPage() {
  return (
    <AccountShell>
      <h1 className={styles.title}>Welcome to CardioLink</h1>
      <p className={ws.muted13}>Choose how you want to sign in.</p>
      <Link href="/account/sign-in" className={styles.role}>
        <h2 className={ws.h3}>I’m a clinician</h2>
        <p className={ws.muted12}>Review patients, assess trends and coordinate care.</p>
        <span className={styles.link}>Clinician sign in ›</span>
      </Link>
      <PatientSignInNote />
      <p className={ws.muted12}>Patient accounts are invite-only. Ask your clinician for an invitation.</p>
      <a href="mailto:support@example.test" className={styles.link}>
        Need help? Contact your care organisation
      </a>
    </AccountShell>
  );
}
