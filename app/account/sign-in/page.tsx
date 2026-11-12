import type { Metadata } from "next";
import { AccountShell } from "@/components/account/AccountShell";
import { SignInForm } from "@/components/account/AccountForms";
import styles from "@/components/account/account.module.css";
import ws from "@/components/workspace/workspace.module.css";

export const metadata: Metadata = { title: "Clinician sign in – CardioLink" };

export default function SignInPage() {
  return (
    <AccountShell>
      <h1 className={styles.title}>Clinician sign in</h1>
      <p className={ws.muted13}>Your care workspace, securely in one place.</p>
      <SignInForm />
    </AccountShell>
  );
}
