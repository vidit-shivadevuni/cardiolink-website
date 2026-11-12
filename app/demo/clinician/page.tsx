import { redirect } from "next/navigation";

/** The clinician demo now lives inside the connected workspace. */
export default function ClinicianDemoRedirect() {
  redirect("/workspace/patients/demo-2048");
}
