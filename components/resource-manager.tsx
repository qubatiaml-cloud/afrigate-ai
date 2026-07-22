"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BrainCircuit, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import type { ResourceDefinition } from "@/lib/resource-definitions";

type Row = Record<string, unknown> & { id: string };

function displayValue(value: unknown, format?: string, currency = "USD") {
  if (value === null || value === undefined || value === "") return "—";
  if (format === "currency") return new Intl.NumberFormat("en", { style: "currency", currency, maximumFractionDigits: 0 }).format(Number(value));
  if (format === "date") return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(String(value)));
  if (format === "status") return <span className={`status-pill ${String(value).toLowerCase()}`}>{String(value).replaceAll("_", " ")}</span>;
  if (format === "score") return value === null ? "Not scored" : `${value}/100`;
  return String(value);
}

export function ResourceManager({ definition, rows, canManage, currency }: { definition: ResourceDefinition; rows: Row[]; canManage: boolean; currency: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Row | null>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const filtered = useMemo(() => rows.filter((row) => JSON.stringify(row).toLowerCase().includes(query.toLowerCase())), [rows, query]);

  const openCreate = () => { setEditing(null); setError(""); setOpen(true); };
  const openEdit = (row: Row) => { setEditing(row); setError(""); setOpen(true); };

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const body = Object.fromEntries(new FormData(event.currentTarget));
    const url = editing ? `/api/${definition.resource}/${editing.id}` : `/api/${definition.resource}`;
    const response = await fetch(url, { method: editing ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const result = await response.json().catch(() => ({ error: "Unexpected server response." }));
    setBusy(false);
    if (!response.ok) { setError(result.error || "The record could not be saved."); return; }
    setOpen(false); setEditing(null); router.refresh();
  }

  async function remove(row: Row) {
    if (!window.confirm(`Delete this ${definition.singular}? This action cannot be undone.`)) return;
    setBusy(true); const response = await fetch(`/api/${definition.resource}/${row.id}`, { method: "DELETE" }); setBusy(false);
    if (!response.ok) { const result = await response.json().catch(() => null); setError(result?.error || "The record could not be deleted."); return; }
    router.refresh();
  }

  async function analyze(row: Row) {
    setBusy(true); setError(""); const response = await fetch(`/api/feasibility/${row.id}/analyze`, { method: "POST" }); const result = await response.json().catch(() => null); setBusy(false);
    if (!response.ok) { setError(result?.error || "The assessment could not be analyzed."); return; } router.refresh();
  }

  return (
    <div className="page-stack">
      <header className="page-header"><div><p className="page-kicker">{definition.eyebrow}</p><h1>{definition.title}</h1><p>{definition.description}</p></div>{canManage && <button className="primary-button" onClick={openCreate} type="button"><Plus size={16} /> Add {definition.singular}</button>}</header>
      <section className="module-summary"><div><strong>{rows.length}</strong><span>Total records</span></div><div><strong>{rows.filter((row) => !["COMPLETED", "INACTIVE", "CANCELLED", "REJECTED"].includes(String(row.status || row.stage))).length}</strong><span>Active or open</span></div><div><strong>{canManage ? "Editor" : "Read only"}</strong><span>Your access</span></div></section>
      <section className="panel resource-panel">
        <div className="resource-toolbar"><label><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${definition.title.toLowerCase()}`} /></label><span>{filtered.length} result{filtered.length === 1 ? "" : "s"}</span></div>
        {error && <div className="inline-error" role="alert">{error}</div>}
        <div className="table-scroll"><table className="data-table"><thead><tr>{definition.columns.map((column) => <th key={column.key}>{column.label}</th>)}{canManage && <th>Actions</th>}</tr></thead><tbody>
          {filtered.map((row) => <tr key={row.id}>{definition.columns.map((column) => <td key={column.key}>{displayValue(row[column.key], column.format, currency)}</td>)}{canManage && <td><div className="row-actions">{definition.resource === "feasibility" && <button title="Run structured analysis" onClick={() => analyze(row)} disabled={busy}><BrainCircuit size={15} /></button>}<button title="Edit" onClick={() => openEdit(row)} disabled={busy}><Pencil size={15} /></button><button title="Delete" onClick={() => remove(row)} disabled={busy}><Trash2 size={15} /></button></div></td>}</tr>)}
          {!filtered.length && <tr><td colSpan={definition.columns.length + (canManage ? 1 : 0)}><div className="empty-state"><strong>No records found</strong><span>Create the first {definition.singular} or adjust your search.</span></div></td></tr>}
        </tbody></table></div>
      </section>
      {open && <div className="modal-backdrop" role="presentation"><section className="modal" role="dialog" aria-modal="true" aria-label={`${editing ? "Edit" : "Create"} ${definition.singular}`}><header><div><p className="page-kicker">{editing ? "UPDATE RECORD" : "NEW RECORD"}</p><h2>{editing ? `Edit ${definition.singular}` : `Add ${definition.singular}`}</h2></div><button onClick={() => setOpen(false)} type="button" aria-label="Close"><X /></button></header><form onSubmit={submit} className="crud-form">
        {definition.fields.map((field) => <label className={field.type === "textarea" ? "wide-field" : ""} key={field.name}><span>{field.label}</span>{field.type === "textarea" ? <textarea name={field.name} required={field.required} maxLength={6000} defaultValue={String(editing?.[field.name] || "")} /> : field.type === "select" ? <select name={field.name} required={field.required} defaultValue={String(editing?.[field.name] || "")}><option value="">Select…</option>{field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select> : <input name={field.name} type={field.type} required={field.required} min={field.min} max={field.max} step={field.step} placeholder={field.placeholder} defaultValue={field.type === "date" && editing?.[field.name] ? String(editing[field.name]).slice(0, 10) : String(editing?.[field.name] ?? "")} />}</label>)}
        {error && <div className="form-error wide-field">{error}</div>}<footer className="wide-field"><button className="secondary-button" type="button" onClick={() => setOpen(false)}>Cancel</button><button className="primary-button" disabled={busy} type="submit">{busy ? "Saving…" : "Save record"}</button></footer>
      </form></section></div>}
    </div>
  );
}
