import type { Metadata } from "next";
import { AccountShell } from "@/components/account/AccountShell";
import { ButtonLink } from "@/components/workspace/ui";
import styles from "@/components/account/account.module.css";
import ws from "@/components/workspace/workspace.module.css";

export const metadata: Metadata = { title: "Signed out – CardioLink" };

export default function SignedOutPage() {
  return (
    <AccountShell>
      <h1 className={styles.title}>You’re signed out</h1>
      <p className={ws.muted13}>Your session has ended securely.</p>
      <p className={ws.muted13}>Sign in again when you’re ready to continue.</p>
      <ButtonLink href="/account/sign-in">Sign in again</ButtonLink>
      <ButtonLink href="/" variant="secondary">
        Back to CardioLink home
      </ButtonLink>
    </AccountShell>
  );
}
