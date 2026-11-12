import type { Metadata } from "next";
import { AccountShell } from "@/components/account/AccountShell";
import { ForgotPasswordForm } from "@/components/account/AccountForms";

export const metadata: Metadata = { title: "Forgot password – CardioLink" };

export default function ForgotPasswordPage() {
  return (
    <AccountShell>
      <ForgotPasswordForm />
    </AccountShell>
  );
}
