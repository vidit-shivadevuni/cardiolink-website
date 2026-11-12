"use client";

import { useState } from "react";
import { CLINICIAN } from "@/lib/demo-data";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { Button, Card, Field, PageHeader, TextLink, styles } from "@/components/workspace/ui";

export default function SettingsPage() {
  const { profileName, setProfileName, emailNotifications, setEmailNotifications } = useWorkspace();
  const [name, setName] = useState(profileName);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  return (
    <main className={styles.main}>
      <PageHeader title="Account settings" subtitle="Manage your profile, security and notification preferences." />
      <div className={styles.twoCol}>
        <Card>
          <form
            className={styles.stack16}
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim()) return setError("Enter your full name.");
              setError("");
              setProfileName(name.trim());
              setSaved(true);
            }}
          >
            <h2 className={styles.h2}>Profile</h2>
            <Field
              label="Full name"
              value={name}
              error={error}
              onChange={(e) => {
                setName(e.target.value);
                setSaved(false);
              }}
            />
            <Field label="Work email" value={CLINICIAN.email} readOnly hint="Contact your administrator to change your verified email." />
            <Field label="Role" value={CLINICIAN.role} readOnly hint="Managed by your organisation" />
            <div className={styles.row}>
              <Button type="submit" disabled={name.trim() === profileName}>
                Save changes
              </Button>
              {saved && (
                <span role="status" className={styles.muted12} style={{ color: "var(--teal-text)", fontWeight: 600 }}>
                  ✓ Changes saved
                </span>
              )}
            </div>
          </form>
        </Card>

        <Card className={styles.stack16}>
          <h2 className={styles.h2}>Security</h2>
          <div className={styles.cardFlat}>
            <div className={styles.stack4}>
              <h3 className={styles.h3}>Password</h3>
              <p className={styles.muted11}>Last changed 01 Oct 2026</p>
              <TextLink href="/account/reset-password">Change password</TextLink>
            </div>
          </div>
          <div className={styles.cardFlat}>
            <div className={styles.between}>
              <div className={styles.stack4}>
                <h3 className={styles.h3}>Email notifications · {emailNotifications ? "On" : "Off"}</h3>
                <p className={styles.muted11}>Review reminders and patient messages</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={emailNotifications}
                aria-label="Email notifications"
                className={`${styles.toggle} ${emailNotifications ? styles.toggleOn : ""}`}
                onClick={() => setEmailNotifications(!emailNotifications)}
              />
            </div>
          </div>
          <div className={styles.cardFlat}>
            <div className={styles.stack4}>
              <h3 className={styles.h3}>Session</h3>
              <p className={styles.muted11}>Signed in on this browser</p>
              <TextLink href="/account/signed-out">Sign out</TextLink>
            </div>
          </div>
          <p className={styles.muted11}>Changes affect your account, not your patients’ care plans.</p>
        </Card>
      </div>
    </main>
  );
}
