"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NOTIFICATIONS } from "@/lib/demo-data";
import { Icon } from "../landing/shared";
import { useWorkspace } from "./WorkspaceProvider";
import styles from "./workspace.module.css";

const LINKS = [
  { label: "Patients", href: "/workspace/patients" },
  { label: "Follow-up", href: "/workspace/follow-up" },
  { label: "Care team", href: "/workspace/care-team" },
];

export function WorkspaceNav() {
  const pathname = usePathname();
  const [panelOpen, setPanelOpen] = useState(false);
  const { unreadCount, profileName } = useWorkspace();

  useEffect(() => setPanelOpen(false), [pathname]);

  return (
    <>
      <header className={styles.nav}>
        <Link href="/workspace/patients" className={styles.brand}>
          CardioLink
        </Link>
        <nav className={styles.navLinks} aria-label="Workspace">
          {LINKS.map((l) => {
            const active = pathname.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href} className={active ? styles.navActive : undefined} aria-current={active ? "page" : undefined}>
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className={styles.navTools}>
          <span className={styles.navNote}>Illustrative workspace</span>
          <Link href="/workspace/search" className={styles.navTool}>
            <Icon name="clinician/search" size={18} />
            Search
          </Link>
          <button
            type="button"
            className={styles.navTool}
            style={{ background: "none", border: 0, font: "inherit", cursor: "pointer" }}
            aria-expanded={panelOpen}
            aria-controls="notifications-panel"
            onClick={() => setPanelOpen((o) => !o)}
          >
            <Icon name="clinician/bell" size={18} />
            Notifications ({unreadCount})
          </button>
          <Link href="/workspace/settings" className={styles.navUser}>
            {profileName}
          </Link>
          <Link href="/" className={styles.exit}>
            Exit demo
          </Link>
        </div>
      </header>
      {panelOpen && <NotificationsPanel onClose={() => setPanelOpen(false)} />}
    </>
  );
}

function NotificationsPanel({ onClose }: { onClose: () => void }) {
  const { readIds, markRead, markAllRead, unreadCount } = useWorkspace();
  const router = useRouter();
  const recent = NOTIFICATIONS.filter((n) => n.unread);
  const earlier = NOTIFICATIONS.filter((n) => !n.unread);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const open = (id: string, href: string) => {
    markRead(id);
    onClose();
    router.push(href);
  };

  const item = (n: (typeof NOTIFICATIONS)[number]) => (
    <button
      key={n.id}
      type="button"
      className={styles.notification}
      style={{ background: "#fff", textAlign: "left", font: "inherit", cursor: "pointer" }}
      onClick={() => open(n.id, n.href)}
    >
      <span className={`${styles.unreadDot} ${readIds.has(n.id) ? styles.readDot : ""}`} aria-hidden="true" />
      <span className={styles.stack4}>
        <span style={{ fontWeight: 600, color: "var(--navy)" }}>{n.title}</span>
        <span className={styles.muted11}>{n.detail}</span>
      </span>
    </button>
  );

  return (
    <>
      <div className={styles.panelBackdrop} onClick={onClose} aria-hidden="true" />
      <section id="notifications-panel" className={styles.panel} aria-label="Notifications">
        <div className={styles.between}>
          <h2 className={styles.h3}>Notifications · {unreadCount} unread</h2>
          <span className={styles.row} style={{ gap: 8 }}>
            <button type="button" className={styles.textLink} onClick={markAllRead} disabled={unreadCount === 0}>
              Mark all as read
            </button>
            <span className={styles.muted12}>·</span>
            <button type="button" className={styles.textLink} onClick={onClose}>
              Close ×
            </button>
          </span>
        </div>
        {recent.map(item)}
        <p className={styles.muted11} style={{ marginTop: 6 }}>
          Earlier
        </p>
        {earlier.map(item)}
      </section>
    </>
  );
}
