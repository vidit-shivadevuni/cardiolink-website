"use client";

import Link from "next/link";
import { useEffect, useId, useRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from "react";
import styles from "./workspace.module.css";

export { styles };

type Variant = "primary" | "secondary" | "chip";

export function Button({
  variant = "primary",
  active,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; active?: boolean }) {
  return (
    <button
      type="button"
      {...props}
      className={`${styles.button} ${styles[variant]} ${active ? styles.chipActive : ""} ${className}`}
    />
  );
}

export function ButtonLink({ href, variant = "primary", children }: { href: string; variant?: Variant; children: ReactNode }) {
  return (
    <Link href={href} className={`${styles.button} ${styles[variant]}`}>
      {children}
    </Link>
  );
}

/** Blue text link with a trailing chevron, e.g. "Open patient ›". */
export function TextLink({ href, onClick, children }: { href?: string; onClick?: () => void; children: ReactNode }) {
  if (href) {
    return (
      <Link href={href} className={styles.textLink}>
        {children} <span aria-hidden="true">›</span>
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={styles.textLink}>
      {children} <span aria-hidden="true">›</span>
    </button>
  );
}

export function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return <section className={`${styles.card} ${className}`}>{children}</section>;
}

export function Field({
  label,
  hint,
  error,
  multiline,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; error?: string; multiline?: boolean }) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          className={`${styles.input} ${styles.textarea} ${error ? styles.inputError : ""}`}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          {...(props as unknown as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={id}
          className={`${styles.input} ${error ? styles.inputError : ""}`}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          {...props}
        />
      )}
      {error ? (
        <p id={`${id}-error`} className={styles.error}>
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className={styles.hint}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: ReactNode; action?: ReactNode }) {
  return (
    <div className={styles.pageHeader}>
      <div className={styles.stack8}>
        <h1 className={styles.h1}>{title}</h1>
        {subtitle && <p className={styles.muted13}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatusText({ status }: { status: string }) {
  return <span className={status === "For review" ? styles.statusReview : styles.statusOk}>{status}</span>;
}

/**
 * Accessible modal built on <dialog>: traps focus, Escape closes,
 * focuses the heading on open and returns focus to the opener on close.
 */
export function Dialog({
  open,
  onClose,
  title,
  context,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  context?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const opener = useRef<Element | null>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      opener.current = document.activeElement;
      dialog.showModal();
      headingRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
      (opener.current as HTMLElement | null)?.focus?.();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={`${styles.dialog} ${wide ? styles.dialogWide : ""}`}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onMouseDown={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      {open && (
        <div className={styles.dialogBody}>
          <div className={styles.dialogHead}>
            <div className={styles.stack4}>
              <h2 id={titleId} ref={headingRef} tabIndex={-1} className={styles.h2}>
                {title}
              </h2>
              {context && <p className={styles.muted12}>{context}</p>}
            </div>
            <button type="button" className={styles.close} onClick={onClose} aria-label="Close dialog">
              ×
            </button>
          </div>
          {children}
          <p className={styles.muted11}>Fictional patient · Illustrative data only</p>
        </div>
      )}
    </dialog>
  );
}

/** Success state shared by confirmations (invite sent, note saved, etc.). */
export function Confirmation({ title, children, action }: { title: string; children: ReactNode; action: ReactNode }) {
  return (
    <div className={styles.confirmation} role="status">
      <span className={styles.checkBadge} aria-hidden="true">
        ✓
      </span>
      <h2 className={styles.h2}>{title}</h2>
      <p className={styles.muted13}>{children}</p>
      {action}
    </div>
  );
}
