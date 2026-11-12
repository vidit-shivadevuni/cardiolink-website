import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClinicianShell } from "@/components/demo/shared";
import { DocumentsList } from "@/components/workspace/PatientViews";
import { FEATURED_PATIENT_ID } from "@/lib/demo-data";

export const metadata: Metadata = { title: "Documents – Alex Morgan – CardioLink" };

export default async function DocumentsPage({ params }: { params: Promise<{ id: string }> }) {
  if ((await params).id !== FEATURED_PATIENT_ID) notFound();
  return (
    <ClinicianShell activeTab="Documents">
      <DocumentsList />
    </ClinicianShell>
  );
}
