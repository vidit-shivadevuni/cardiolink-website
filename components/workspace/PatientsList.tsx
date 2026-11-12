"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PATIENTS, TODAY, patientCode, type Patient } from "@/lib/demo-data";
import { useWorkspace } from "./WorkspaceProvider";
import { Button, Card, Field, PageHeader, StatusText, TextLink, styles } from "./ui";

type Filter = "all" | "review" | "ok";
type Sort = "review" | "name" | "checkin" | "status";

const SORTS: { key: Sort; label: string; short: string }[] = [
  { key: "review", label: "Review due · Soonest", short: "Review due" },
  { key: "name", label: "Name · A to Z", short: "Name" },
  { key: "checkin", label: "Latest check-in", short: "Latest check-in" },
  { key: "status", label: "Status", short: "Status" },
];

const PAGE_SIZE = 5;

function sortPatients(list: Patient[], sort: Sort) {
  const copy = [...list];
  switch (sort) {
    case "name":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case "checkin":
      return copy.sort((a, b) => b.checkIn.localeCompare(a.checkIn));
    case "status":
      return copy.sort((a, b) => (a.status === b.status ? a.reviewInDays - b.reviewInDays : a.status === "For review" ? -1 : 1));
    default:
      return copy.sort((a, b) => a.reviewInDays - b.reviewInDays);
  }
}

export function PatientsList() {
  const { openDialog } = useWorkspace();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("review");
  const [menuOpen, setMenuOpen] = useState(false);
  const [page, setPage] = useState(1);
  const menuRef = useRef<HTMLDivElement>(null);

  const forReview = PATIENTS.filter((p) => p.status === "For review").length;

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = PATIENTS.filter((p) =>
      filter === "review" ? p.status === "For review" : filter === "ok" ? p.status === "On track" : true,
    ).filter((p) => !q || p.name.toLowerCase().includes(q) || p.id.includes(q.replace(/\s/g, "")));
    // The first page of the design keeps its hand-picked order; other sorts reorder.
    return sort === "review" && !q && filter === "all" ? filtered : sortPatients(filtered, sort);
  }, [filter, query, sort]);

  useEffect(() => setPage(1), [filter, query, sort]);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const visible = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const sortLabel = SORTS.find((s) => s.key === sort)!.short;

  return (
    <main className={styles.main}>
      <PageHeader
        title="Patients"
        subtitle={`Your caseload · ${TODAY}`}
        action={<Button onClick={() => openDialog("invite")}>Invite patient</Button>}
      />

      <div className={styles.summaryGrid}>
        <Card className={styles.stack12}>
          <h2 className={styles.h3}>Active patients</h2>
          <p className={styles.summaryValue}>{PATIENTS.length}</p>
          <p className={styles.muted11}>Across your care team</p>
        </Card>
        <Card className={styles.stack12}>
          <h2 className={styles.h3}>For review</h2>
          <p className={styles.summaryValue}>{forReview}</p>
          <p className={styles.muted11}>Requires clinician review</p>
        </Card>
        <Card className={styles.stack12}>
          <h2 className={styles.h3}>On track</h2>
          <p className={styles.summaryValue}>{PATIENTS.length - forReview}</p>
          <p className={styles.muted11}>No open review items</p>
        </Card>
      </div>

      <div className={styles.toolbar}>
        <Field
          label="Search patients"
          type="search"
          placeholder="Name or patient ID"
          hint="Search your assigned caseload"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className={styles.filters} role="group" aria-label="Filter and sort patients">
          <Button variant="chip" active={filter === "all"} aria-pressed={filter === "all"} onClick={() => setFilter("all")}>
            All patients
          </Button>
          <Button variant="chip" active={filter === "review"} aria-pressed={filter === "review"} onClick={() => setFilter("review")}>
            For review
          </Button>
          <Button variant="chip" active={filter === "ok"} aria-pressed={filter === "ok"} onClick={() => setFilter("ok")}>
            On track
          </Button>
          <div ref={menuRef} style={{ position: "relative" }}>
            <Button variant="chip" aria-haspopup="menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((o) => !o)}>
              Sort: {sortLabel}
            </Button>
            {menuOpen && (
              <div className={styles.menu} role="menu" aria-label="Sort patients" style={{ top: 44, right: "auto", left: 0 }}>
                <p className={styles.label}>Sort patients</p>
                {SORTS.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    role="menuitemradio"
                    aria-checked={sort === s.key}
                    className={styles.menuItem}
                    onClick={() => {
                      setSort(s.key);
                      setMenuOpen(false);
                    }}
                  >
                    {sort === s.key ? "● " : ""}
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Patient</th>
              <th scope="col">Status</th>
              <th scope="col">Latest home BP</th>
              <th scope="col">Last check-in</th>
              <th scope="col">Next review</th>
              <th scope="col">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.muted13}>
                  No patients match “{query}”. Check the spelling or search by patient ID.
                </td>
              </tr>
            ) : (
              visible.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div>{p.name}</div>
                    <div>{patientCode(p.id)}</div>
                  </td>
                  <td>
                    <StatusText status={p.status} />
                  </td>
                  <td>{p.bp}</td>
                  <td>{p.checkInLabel}</td>
                  <td>{p.nextReview}</td>
                  <td>
                    <TextLink href={`/workspace/patients/${p.id}`}>Open patient</TextLink>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <nav className={styles.pager} aria-label="Pagination">
        <span>
          Showing {visible.length} of {rows.length} illustrative patients
        </span>
        <span aria-hidden="true">·</span>
        <button type="button" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Previous
        </button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            className={n === page ? styles.pageCurrent : undefined}
            aria-current={n === page ? "page" : undefined}
            onClick={() => setPage(n)}
          >
            {n}
          </button>
        ))}
        <button type="button" disabled={page === pages} onClick={() => setPage((p) => p + 1)}>
          Next
        </button>
      </nav>
    </main>
  );
}
