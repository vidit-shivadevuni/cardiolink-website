/**
 * Invite-only demo access. The team creates accounts after a demo call
 * (npm run demo-account -- add <email> "<name>"), and signing in sets a signed session cookie
 * that proxy.ts checks before serving /workspace or /demo/clinician.
 *
 * Accounts live in dev-data/demo-accounts.json (git-ignored). This is a demo gate, not
 * production auth: once the site is hosted, move accounts to a database.
 */
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

export const SESSION_COOKIE = "cl_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const DATA_DIR = path.join(process.cwd(), "dev-data");
const ACCOUNTS_FILE = path.join(DATA_DIR, "demo-accounts.json");
const SECRET_FILE = path.join(DATA_DIR, ".session-secret");

export type DemoAccount = {
  email: string;
  name: string;
  salt: string;
  passwordHash: string;
  createdAt: string;
};

export type Session = { email: string; name: string; exp: number };

let cachedSecret: string | undefined;

/** DEMO_SESSION_SECRET in production; in development a random secret is generated once and kept in dev-data/. */
function secret() {
  if (cachedSecret) return cachedSecret;
  if (process.env.DEMO_SESSION_SECRET) return (cachedSecret = process.env.DEMO_SESSION_SECRET);
  if (process.env.NODE_ENV === "production") {
    throw new Error("Set DEMO_SESSION_SECRET to enable demo sign-in.");
  }
  if (!existsSync(SECRET_FILE)) {
    mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(SECRET_FILE, randomBytes(32).toString("hex"), { mode: 0o600 });
  }
  return (cachedSecret = readFileSync(SECRET_FILE, "utf8").trim());
}

export function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  return { salt, passwordHash: scryptSync(password, salt, 64).toString("hex") };
}

export function readAccounts(): DemoAccount[] {
  try {
    const parsed = JSON.parse(readFileSync(ACCOUNTS_FILE, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function verifyCredentials(email: string, password: string): DemoAccount | null {
  const account = readAccounts().find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
  // Hash even when the account doesn't exist, so response time doesn't reveal which emails are registered.
  const { passwordHash } = hashPassword(password, account?.salt ?? "0".repeat(32));
  if (!account) return null;
  const a = Buffer.from(passwordHash, "hex");
  const b = Buffer.from(account.passwordHash, "hex");
  return a.length === b.length && timingSafeEqual(a, b) ? account : null;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createSessionToken(account: Pick<DemoAccount, "email" | "name">) {
  const session: Session = { email: account.email, name: account.name, exp: Date.now() + SESSION_MAX_AGE * 1000 };
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function readSessionToken(token: string | undefined): Session | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Session;
    return session.exp > Date.now() ? session : null;
  } catch {
    return null;
  }
}

/** Only allow same-site paths after sign-in, never another origin. */
export function safeNextPath(next: string | null | undefined) {
  return next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : "/workspace/patients";
}
