/** Shared by the /demo form (client) and POST /api/demo-requests (server). */

export const ORG_SIZES = ["1-10", "11-50", "51-200", "200+"] as const;
export type OrgSize = (typeof ORG_SIZES)[number];

export const ORG_TYPES = [
  "Hospital or health system",
  "Cardiology practice",
  "Primary care or clinic",
  "Research or academic",
  "Other",
] as const;
export type OrgType = (typeof ORG_TYPES)[number];

export const CONTACT_METHODS = ["Email", "Phone", "Either"] as const;
export type ContactMethod = (typeof CONTACT_METHODS)[number];

export type DemoRequestInput = {
  fullName: string;
  workEmail: string;
  phone: string;
  organization: string;
  role: string;
  orgType: OrgType | "";
  orgSize: OrgSize | "";
  notes: string;
  contactMethod: ContactMethod;
};

export type DemoRequestErrors = Partial<Record<keyof DemoRequestInput, string>>;

export const EMPTY_DEMO_REQUEST: DemoRequestInput = {
  fullName: "",
  workEmail: "",
  phone: "",
  organization: "",
  role: "",
  orgType: "",
  orgSize: "",
  notes: "",
  contactMethod: "Email",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[+()\d\s.-]{7,}$/;

const MAX_LENGTH: Record<keyof DemoRequestInput, number> = {
  fullName: 120,
  workEmail: 200,
  phone: 40,
  organization: 160,
  role: 120,
  orgType: 40,
  orgSize: 10,
  notes: 2000,
  contactMethod: 10,
};

/** Trims every known field and drops anything else, so unexpected keys never reach storage. */
export function normalizeDemoRequest(raw: unknown): DemoRequestInput {
  const source = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const out = { ...EMPTY_DEMO_REQUEST };
  for (const key of Object.keys(EMPTY_DEMO_REQUEST) as (keyof DemoRequestInput)[]) {
    const value = source[key];
    if (typeof value === "string") (out as Record<string, string>)[key] = value.trim();
  }
  return out;
}

export function validateDemoRequest(input: DemoRequestInput): DemoRequestErrors {
  const errors: DemoRequestErrors = {};
  if (!input.fullName) errors.fullName = "Enter your full name.";
  if (!input.workEmail) errors.workEmail = "Enter your work email.";
  else if (!EMAIL.test(input.workEmail)) errors.workEmail = "Enter a valid email address, like name@hospital.org.";
  if (input.phone && !PHONE.test(input.phone)) errors.phone = "Enter a valid phone number, or leave it blank.";
  if (!input.organization) errors.organization = "Enter your company or organization.";
  if (!input.orgType) errors.orgType = "Choose your organization type.";
  else if (!ORG_TYPES.includes(input.orgType as OrgType)) errors.orgType = "Choose your organization type.";
  if (!CONTACT_METHODS.includes(input.contactMethod)) errors.contactMethod = "Choose how we should contact you.";
  else if (input.contactMethod !== "Email" && !input.phone && !errors.phone) {
    errors.phone = "Add a phone number so we can call you, or choose email.";
  }
  if (input.orgSize && !ORG_SIZES.includes(input.orgSize as OrgSize)) errors.orgSize = "Choose an organization size.";

  for (const key of Object.keys(MAX_LENGTH) as (keyof DemoRequestInput)[]) {
    if (!errors[key] && input[key].length > MAX_LENGTH[key]) {
      errors[key] = `Keep this under ${MAX_LENGTH[key]} characters.`;
    }
  }
  return errors;
}
