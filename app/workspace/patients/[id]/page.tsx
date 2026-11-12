import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LongitudinalDashboard } from "@/components/demo/LongitudinalDashboard";
import { ClinicianShell } from "@/components/demo/shared";
import { StatusText, TextLink } from "@/components/workspace/ui";
import styles from "@/components/workspace/workspace.module.css";
import { FEATURED_PATIENT_ID, findPatient, patientCode } from "@/lib/demo-data";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const patient = findPatient((await params).id);
  return { title: patient ? `${patient.name} – CardioLink` : "Patient – CardioLink" };
}

export default async function PatientPage({ params }: Props) {
  const { id } = await params;
  const patient = findPatient(id);
  if (!patient) notFound();

  if (patient.id === FEATURED_PATIENT_ID) {
    return (
      <ClinicianShell activeTab="Longitudinal dashboard">
        <LongitudinalDashboard />
      </ClinicianShell>
    );
  }

  // Other caseload patients only have summary data in this illustrative workspace.
  return (
    <main className={styles.main}>
      <p className={styles.muted12} style={{ marginBottom: 16 }}>
        <TextLink href="/workspace/patients">Patients</TextLink> / {patient.name}
      </p>
      <div className={styles.pageHeader}>
        <div className={styles.stack8}>
          <h1 className={styles.h1}>{patient.name}</h1>
          <p className={styles.muted13}>
            {patient.age} years · {patientCode(patient.id)} · Fictional patient / Illustrative data
          </p>
        </div>
      </div>
      <div className={styles.summaryGrid}>
        <section className={`${styles.card} ${styles.stack8}`}>
          <h2 className={styles.h3}>Status</h2>
          <p className={styles.bigValue}>
            <StatusText status={patient.status} />
          </p>
        </section>
        <section className={`${styles.card} ${styles.stack8}`}>
          <h2 className={styles.h3}>Latest home BP</h2>
          <p className={styles.bigValue}>{patient.bp}</p>
          <p className={styles.muted11}>Last check-in {patient.checkInLabel}</p>
        </section>
        <section className={`${styles.card} ${styles.stack8}`}>
          <h2 className={styles.h3}>Next review</h2>
          <p className={styles.bigValue} style={{ fontSize: 18 }}>
            {patient.nextReview}
          </p>
        </section>
      </div>
      <section className={`${styles.cardFlat} ${styles.stack8}`}>
        <h2 className={styles.h3}>Detailed record not included</h2>
        <p className={styles.muted12}>
          This illustrative workspace includes a full longitudinal record for Alex Morgan only.
        </p>
        <TextLink href="/workspace/patients/demo-2048">Open Alex Morgan’s record</TextLink>
      </section>
    </main>
  );
}
