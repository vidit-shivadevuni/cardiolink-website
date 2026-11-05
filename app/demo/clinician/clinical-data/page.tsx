import type { Metadata } from "next";
import { ClinicalData } from "@/components/demo/ClinicalData";
import { ClinicianShell } from "@/components/demo/shared";

export const metadata: Metadata = {
  title: "Clinical data – Example screen",
  description: "An example clinical data view using a fictional demo patient.",
};

export default function ClinicalDataPage() {
  return (
    <ClinicianShell activeTab="Clinical data">
      <ClinicalData />
    </ClinicianShell>
  );
}
