import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClinicianShell } from "@/components/demo/shared";
import { CarePlan } from "@/components/workspace/PatientViews";
import { FEATURED_PATIENT_ID } from "@/lib/demo-data";

export const metadata: Metadata = { title: "Care plan – Alex Morgan – CardioLink" };

export default async function CarePlanPage({ params }: { params: Promise<{ id: string }> }) {
  if ((await params).id !== FEATURED_PATIENT_ID) notFound();
  return (
    <ClinicianShell activeTab="Care plan">
      <CarePlan />
    </ClinicianShell>
  );
}
