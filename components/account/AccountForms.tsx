"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { CLINICIAN } from "@/lib/demo-data";
import { Button, ButtonLink, Confirmation, Field } from "../workspace/ui";
import ws from "../workspace/workspace.module.css";
import styles from "./account.module.css";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** The patient portal (430 px designs) isn't built yet, so this card explains instead of linking. */
export function PatientSignInNote() {
  const [shown, setShown] = useState(false);
  return (
    <button
      type="button"
      className={styles.role}
      style={{ background: "#fff", textAlign: "left", font: "inherit", cursor: "pointer" }}
      onClick={() => setShown(true)}
      aria-expanded={shown}
    >
      <span className={ws.h3}>I’m a patient</span>
      <span className={ws.muted12}>Complete check-ins and stay connected to your team.</span>
      {shown ? (
        <span className={ws.muted12} role="status" style={{ color: "var(--navy)" }}>
          The patient portal isn’t available in this demo yet.
        </span>
      ) : (
        <span className={styles.link}>Patient sign in ›</span>
      )}
    </button>
  );
}

function useFakeRequest() {
  const [busy, setBusy] = useState(false);
  const run = (after: () => void) => {
    if (busy) return;
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      after();
    }, 500);
  };
  return { busy, run };
}

export function SignInForm({ next }: { next: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const fieldErrors: Record<string, string> = {};
    if (!EMAIL.test(email)) fieldErrors.email = "Enter a valid work email.";
    if (!password) fieldErrors.password = "Enter your password.";
    setErrors(fieldErrors);
    setFormError("");
    if (Object.keys(fieldErrors).length > 0) return;

    setBusy(true);
    try {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.replace(next);
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => ({}));
      setFormError(data.error ?? "Sign-in failed. Please try again.");
    } catch {
      setFormError("We couldn’t reach the server. Check your connection and try again.");
    }
    setBusy(false);
  };

  return (
    <form className={ws.stack16} onSubmit={submit} noValidate>
      {formError && (
        <p role="alert" className={ws.error} style={{ fontSize: 13 }}>
          {formError}
        </p>
      )}
      <Field label="Work email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
      <Field
        label="Password"
        type={show ? "text" : "password"}
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />
      <button type="button" className={styles.showPassword} onClick={() => setShow((s) => !s)} aria-pressed={show}>
        {show ? "Hide password" : "Show password"}
      </button>
      <Link href="/account/forgot-password" className={styles.link}>
        Forgot password?
      </Link>
      <Button type="submit" className={styles.full} disabled={busy}>
        {busy ? "Signing in…" : "Sign in"}
      </Button>
      <p className={ws.muted12}>
        Demo access is by invitation. Don’t have a login yet?{" "}
        <Link href="/demo" className={styles.link}>
          Request a demo
        </Link>{" "}
        and our team will set one up for you.
      </p>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState(CLINICIAN.email);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const { busy, run } = useFakeRequest();

  if (sent) {
    return (
      <Confirmation title="Check your email" action={<ButtonLink href="/account/sign-in">Back to sign in</ButtonLink>}>
        If an account exists for the entered email, you’ll receive a single-use reset link shortly. It expires after 30
        minutes. Check your spam folder too.
      </Confirmation>
    );
  }

  return (
    <>
      <h1 className={styles.title}>Forgot password</h1>
      <p className={ws.muted13}>Enter your work email and I’ll help you reset it.</p>
      <form
        className={ws.stack16}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (!EMAIL.test(email)) return setError("Enter a valid email address.");
          setError("");
          run(() => setSent(true));
        }}
      >
        <Field label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
        <Button type="submit" className={styles.full} disabled={busy}>
          {busy ? "Sending…" : "Send reset link"}
        </Button>
      </form>
      <p className={ws.muted11}>If an account exists, a reset link will arrive shortly. Check your spam folder too.</p>
      <Link href="/account/sign-in" className={styles.link}>
        Back to sign in
      </Link>
    </>
  );
}

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const { busy, run } = useFakeRequest();

  if (done) {
    return (
      <Confirmation title="Password updated" action={<ButtonLink href="/account/sign-in">Back to sign in</ButtonLink>}>
        You can now sign in using your new password. Existing sessions are signed out for security.
      </Confirmation>
    );
  }

  return (
    <>
      <h1 className={styles.title}>Reset your password</h1>
      <p className={ws.muted13}>Create a new password for your account.</p>
      <form
        className={ws.stack16}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const next: Record<string, string> = {};
          if (password.length < 12) next.password = "Use at least 12 characters.";
          if (confirm !== password) next.confirm = "Passwords don’t match.";
          setErrors(next);
          if (Object.keys(next).length === 0) run(() => setDone(true));
        }}
      >
        <Field
          label="New password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          hint="At least 12 characters."
        />
        <Field
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm}
        />
        <Button type="submit" className={styles.full} disabled={busy}>
          {busy ? "Updating…" : "Update password"}
        </Button>
      </form>
      <p className={ws.muted11}>Your reset link is single-use and expires after 30 minutes.</p>
    </>
  );
}
