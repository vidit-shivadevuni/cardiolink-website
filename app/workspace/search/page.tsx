"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { DOCUMENTS, PATIENTS, patientCode } from "@/lib/demo-data";
import { Button, Field, PageHeader, TextLink, styles } from "@/components/workspace/ui";

type Kind = "all" | "patients" | "documents";

/** Only Alex Morgan has documents in this illustrative workspace. */
const DOC_OWNER = "Alex Morgan";

function SearchResults() {
  const params = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(params.get("q") ?? "Alex Morgan");
  const [kind, setKind] = useState<Kind>("all");

  const q = query.trim().toLowerCase();
  const patients = useMemo(
    () => (q ? PATIENTS.filter((p) => p.name.toLowerCase().includes(q) || p.id.includes(q.replace(/\s/g, ""))) : []),
    [q],
  );
  const documents = useMemo(
    () =>
      q
        ? DOCUMENTS.filter(
            (d) =>
              d.visibility !== "Care team only" &&
              (d.title.toLowerCase().includes(q) || DOC_OWNER.toLowerCase().includes(q) || "demo-2048".includes(q)),
          )
        : [],
    [q],
  );
  const total = patients.length + documents.length;

  return (
    <main className={styles.main}>
      <PageHeader title="Search results" subtitle="Results within your assigned patients and shared records." />
      <form
        role="search"
        className={styles.stack16}
        onSubmit={(e) => {
          e.preventDefault();
          router.replace(`/workspace/search?q=${encodeURIComponent(query)}`);
        }}
      >
        <Field
          label="Search workspace"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          hint={`${total} result${total === 1 ? "" : "s"} · Search uses name, patient ID and document title`}
          autoFocus
        />
      </form>

      <div className={styles.row} style={{ margin: "20px 0" }} role="group" aria-label="Filter results">
        <Button variant="chip" active={kind === "all"} aria-pressed={kind === "all"} onClick={() => setKind("all")}>
          All results ({total})
        </Button>
        <Button variant="chip" active={kind === "patients"} aria-pressed={kind === "patients"} onClick={() => setKind("patients")}>
          Patients ({patients.length})
        </Button>
        <Button variant="chip" active={kind === "documents"} aria-pressed={kind === "documents"} onClick={() => setKind("documents")}>
          Documents ({documents.length})
        </Button>
      </div>

      <div className={styles.stack16}>
        {total === 0 && (
          <p className={styles.muted13}>{q ? `No results for “${query}”.` : "Enter a name, patient ID or document title."}</p>
        )}
        {kind !== "documents" &&
          patients.map((p) => (
            <div key={p.id} className={styles.cardFlat}>
              <div className={styles.stack4}>
                <h2 className={styles.h3}>
                  {p.name} · {patientCode(p.id)}
                </h2>
                <p className={styles.muted11}>
                  Fictional patient · {p.age} years · {p.status}
                </p>
                <TextLink href={`/workspace/patients/${p.id}`}>Open patient</TextLink>
              </div>
            </div>
          ))}
        {kind !== "patients" &&
          documents.map((d) => (
            <div key={d.id} className={styles.cardFlat}>
              <div className={styles.stack4}>
                <h2 className={styles.h3}>{d.title}</h2>
                <p className={styles.muted11}>
                  {DOC_OWNER} · {d.date} · {d.type}
                </p>
                <TextLink href="/workspace/patients/demo-2048/documents">Open document</TextLink>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  );
}
