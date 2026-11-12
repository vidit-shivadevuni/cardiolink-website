import type { Metadata } from "next";
import { AccountShell } from "@/components/account/AccountShell";
import { ResetPasswordForm } from "@/components/account/AccountForms";

export const metadata: Metadata = { title: "Reset password – CardioLink" };

export default function ResetPasswordPage() {
  return (
    <AccountShell>
      <ResetPasswordForm />
    </AccountShell>
  );
}
