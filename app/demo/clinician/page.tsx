import type { Metadata } from "next";
import { LongitudinalDashboard } from "@/components/demo/LongitudinalDashboard";
import { ClinicianShell } from "@/components/demo/shared";

export const metadata: Metadata = {
  title: "Clinician dashboard – Example screen",
  description: "An example clinician dashboard using a fictional demo patient.",
};

export default function ClinicianDashboardPage() {
  return (
    <ClinicianShell activeTab="Longitudinal dashboard">
      <LongitudinalDashboard />
    </ClinicianShell>
  );
}
