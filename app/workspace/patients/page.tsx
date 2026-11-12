import type { Metadata } from "next";
import { PatientsList } from "@/components/workspace/PatientsList";

export const metadata: Metadata = { title: "Patients – CardioLink" };

export default function PatientsPage() {
  return <PatientsList />;
}
