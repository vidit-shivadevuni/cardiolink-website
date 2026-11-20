import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { normalizeDemoRequest, validateDemoRequest, type DemoRequestInput } from "@/lib/demo-request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type StoredDemoRequest = DemoRequestInput & { id: string; submittedAt: string };

const DATA_DIR = path.join(process.cwd(), "dev-data");
const JSON_FILE = path.join(DATA_DIR, "demo-requests.json");
const MD_FILE = path.join(DATA_DIR, "demo-requests.md");

// Writes are chained so two requests arriving together can't overwrite each other's entry.
let queue: Promise<unknown> = Promise.resolve();

async function readAll(): Promise<StoredDemoRequest[]> {
  try {
    const parsed = JSON.parse(await readFile(JSON_FILE, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

/** Write to a temp file first so a crash mid-write can't leave a half-written file. */
async function writeAtomic(file: string, contents: string) {
  const tmp = `${file}.${process.pid}.tmp`;
  await writeFile(tmp, contents, "utf8");
  await rename(tmp, file);
}

function md(value: string) {
  return value ? value.replace(/\r?\n/g, " ").replace(/\|/g, "\\|") : "—";
}

function toMarkdown(entries: StoredDemoRequest[]) {
  const newestFirst = [...entries].reverse();
  const blocks = newestFirst.map((entry) =>
    [
      `## ${md(entry.fullName)} — ${md(entry.organization)}`,
      "",
      `| Field | Value |`,
      `| --- | --- |`,
      `| Submitted | ${entry.submittedAt} |`,
      `| ID | \`${entry.id}\` |`,
      `| Work email | ${md(entry.workEmail)} |`,
      `| Phone | ${md(entry.phone)} |`,
      `| Role | ${md(entry.role)} |`,
      `| Organization type | ${md(entry.orgType ?? "")} |`,
      `| Organization size | ${md(entry.orgSize)} |`,
      `| Preferred contact | ${md(entry.contactMethod ?? "")} |`,
      "",
      "**Notes**",
      "",
      entry.notes ? entry.notes.split(/\r?\n/).map((line) => `> ${line}`).join("\n") : "_None_",
    ].join("\n"),
  );
  return [
    "# Demo requests",
    "",
    `_Generated from \`demo-requests.json\` · ${entries.length} submission${entries.length === 1 ? "" : "s"} · newest first. Don't edit by hand; it's rewritten on every submission._`,
    "",
    blocks.join("\n\n---\n\n"),
    "",
  ].join("\n");
}

async function append(input: DemoRequestInput) {
  await mkdir(DATA_DIR, { recursive: true });
  const entries = await readAll();
  const entry: StoredDemoRequest = { id: randomUUID(), submittedAt: new Date().toISOString(), ...input };
  entries.push(entry);
  await writeAtomic(JSON_FILE, `${JSON.stringify(entries, null, 2)}\n`);
  await writeAtomic(MD_FILE, toMarkdown(entries));
  return entry;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "The request body must be valid JSON." }, { status: 400 });
  }

  const input = normalizeDemoRequest(body);
  const errors = validateDemoRequest(input);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Please fix the highlighted fields.", errors }, { status: 422 });
  }

  try {
    const job = queue.then(() => append(input));
    queue = job.catch(() => undefined);
    const entry = await job;
    return NextResponse.json({ id: entry.id, submittedAt: entry.submittedAt }, { status: 201 });
  } catch (error) {
    console.error("Failed to save demo request", error);
    return NextResponse.json({ error: "We couldn't save your request. Please try again." }, { status: 500 });
  }
}
