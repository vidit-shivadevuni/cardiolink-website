import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClinicalData } from "@/components/demo/ClinicalData";
import { ClinicianShell } from "@/components/demo/shared";
import { FEATURED_PATIENT_ID } from "@/lib/demo-data";

export const metadata: Metadata = { title: "Clinical data – Alex Morgan – CardioLink" };

export default async function ClinicalDataPage({ params }: { params: Promise<{ id: string }> }) {
  if ((await params).id !== FEATURED_PATIENT_ID) notFound();
  return (
    <ClinicianShell activeTab="Clinical data">
      <ClinicalData />
    </ClinicianShell>
  );
}
