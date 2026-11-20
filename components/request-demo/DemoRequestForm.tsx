"use client";

import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  CONTACT_METHODS,
  EMPTY_DEMO_REQUEST,
  ORG_SIZES,
  ORG_TYPES,
  validateDemoRequest,
  type DemoRequestErrors,
  type DemoRequestInput,
} from "@/lib/demo-request";
import { Field } from "../workspace/ui";
import ws from "../workspace/workspace.module.css";
import landing from "../landing/landing.module.css";
import styles from "./request-demo.module.css";

type Status = "idle" | "submitting" | "success";

function SelectField({
  label,
  name,
  value,
  onChange,
  error,
  children,
}: {
  label: string;
  name: keyof DemoRequestInput;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <div className={ws.field}>
      <label htmlFor={id} className={ws.label}>
        {label}
      </label>
      <select
        id={id}
        name={name}
        className={`${ws.input} ${styles.select} ${error ? ws.inputError : ""}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        {children}
      </select>
      {error && (
        <p id={`${id}-error`} className={ws.error}>
          {error}
        </p>
      )}
    </div>
  );
}

// Used to focus the first invalid field, in on-screen order.
const FIELD_ORDER: (keyof DemoRequestInput)[] = [
  "fullName",
  "workEmail",
  "phone",
  "role",
  "organization",
  "orgType",
  "orgSize",
  "notes",
  "contactMethod",
];

export function DemoRequestForm() {
  const [values, setValues] = useState<DemoRequestInput>(EMPTY_DEMO_REQUEST);
  const [errors, setErrors] = useState<DemoRequestErrors>({});
  const [formError, setFormError] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [reference, setReference] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  const set = (key: keyof DemoRequestInput) => (value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const focusFirstError = (next: DemoRequestErrors) => {
    const first = FIELD_ORDER.find((key) => next[key]);
    if (!first) return;
    requestAnimationFrame(() => {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    });
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    const trimmed = Object.fromEntries(
      Object.entries(values).map(([k, v]) => [k, v.trim()]),
    ) as DemoRequestInput;
    const next = validateDemoRequest(trimmed);
    setErrors(next);
    setFormError("");
    if (Object.keys(next).length > 0) {
      focusFirstError(next);
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/demo-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trimmed),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
          focusFirstError(data.errors);
        }
        setFormError(data.error ?? "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }
      setReference(data.id ?? "");
      setValues(EMPTY_DEMO_REQUEST);
      setStatus("success");
      requestAnimationFrame(() => successRef.current?.focus());
    } catch {
      setFormError("We couldn't reach the server. Check your connection and try again.");
      setStatus("idle");
    }
  };

  if (status === "success") {
    return (
      <div className={styles.success} role="status">
        <span className={styles.checkBadge} aria-hidden="true">
          ✓
        </span>
        <h2 ref={successRef} tabIndex={-1} className={landing.cardTitle}>
          Thanks, your request is in
        </h2>
        <p className={landing.body}>
          Our team will reach out within 24-48 hours to find a time for your personalized demo.
        </p>
        {reference && <p className={styles.reference}>Reference: {reference}</p>}
        <button
          type="button"
          className={`${landing.button} ${landing.secondary}`}
          onClick={() => {
            setStatus("idle");
            setReference("");
          }}
        >
          Submit another request
        </button>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <>
      <div className={ws.stack8}>
        <h2 className={landing.cardTitle}>Request a Demo</h2>
        <p className={`${landing.body} ${landing.muted}`} style={{ fontSize: 15 }}>
          Fill out the form below and our team will contact you to schedule a personalized demonstration.
        </p>
      </div>

      <form ref={formRef} className={ws.stack16} onSubmit={submit} noValidate aria-busy={submitting}>
        {formError && (
          <div className={styles.alert} role="alert">
            <span aria-hidden="true">!</span>
            <span>{formError}</span>
          </div>
        )}

        <div className={styles.fieldRow}>
          <Field
            label="Full name *"
            name="fullName"
            autoComplete="name"
            required
            value={values.fullName}
            onChange={(e) => set("fullName")(e.target.value)}
            error={errors.fullName}
          />
          <Field
            label="Work email *"
            name="workEmail"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            value={values.workEmail}
            onChange={(e) => set("workEmail")(e.target.value)}
            error={errors.workEmail}
          />
        </div>

        <div className={styles.fieldRow}>
          <Field
            label={values.contactMethod === "Email" ? "Phone number (optional)" : "Phone number *"}
            name="phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => set("phone")(e.target.value)}
            error={errors.phone}
          />
          <Field
            label="Role / job title (optional)"
            name="role"
            autoComplete="organization-title"
            value={values.role}
            onChange={(e) => set("role")(e.target.value)}
            error={errors.role}
          />
        </div>

        <Field
          label="Company / organization name *"
          name="organization"
          autoComplete="organization"
          required
          value={values.organization}
          onChange={(e) => set("organization")(e.target.value)}
          error={errors.organization}
        />

        <div className={styles.fieldRow}>
          <SelectField
            label="Organization type *"
            name="orgType"
            value={values.orgType}
            onChange={set("orgType")}
            error={errors.orgType}
          >
            <option value="">Select a type</option>
            {ORG_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="Organization size (optional)"
            name="orgSize"
            value={values.orgSize}
            onChange={set("orgSize")}
            error={errors.orgSize}
          >
            <option value="">Select a size</option>
            {ORG_SIZES.map((size) => (
              <option key={size} value={size}>
                {size} people
              </option>
            ))}
          </SelectField>
        </div>

        <Field
          label="What are you looking to solve? (optional)"
          name="notes"
          multiline
          placeholder="Tell us about your patients, workflow or the questions you'd like to cover."
          value={values.notes}
          onChange={(e) => set("notes")(e.target.value)}
          error={errors.notes}
        />

        <fieldset className={styles.choiceGroup}>
          <legend className={ws.label}>Preferred contact method</legend>
          <div className={styles.choices}>
            {CONTACT_METHODS.map((method) => (
              <label key={method} className={styles.choice}>
                <input
                  type="radio"
                  name="contactMethod"
                  value={method}
                  checked={values.contactMethod === method}
                  onChange={() => set("contactMethod")(method)}
                />
                {method}
              </label>
            ))}
          </div>
          {errors.contactMethod && <p className={ws.error}>{errors.contactMethod}</p>}
        </fieldset>

        <button type="submit" className={`${landing.button} ${landing.primary} ${styles.submit}`} disabled={submitting}>
          {submitting ? (
            <>
              <span className={styles.spinner} aria-hidden="true" />
              Submitting…
            </>
          ) : (
            "Request Demo"
          )}
        </button>
        <p className={ws.muted11}>
          <span className={styles.required}>*</span> Required. We&apos;ll only use your details to arrange your demo.
        </p>
      </form>
    </>
  );
}
