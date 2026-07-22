import type { Metadata } from "next";
import { FileCheck2, FileClock, FileText, FolderOpen, Plus, Search, Upload } from "lucide-react";
import { documents } from "@/lib/data";
import { StatusPill } from "@/components/status-pill";

export const metadata: Metadata = { title: "Documents" };

export default function DocumentsPage() {
  return (
    <div className="page-stack">
      <div className="page-header"><div><p className="page-kicker">TRADE COMPLIANCE</p><h1>Documents</h1><p>Keep every trade document complete, current and shipment-ready.</p></div><div className="header-actions"><button className="secondary-button" type="button"><Upload size={16} /> Upload</button><button className="primary-button" type="button"><Plus size={16} /> Create document</button></div></div>
      <section className="document-overview"><article><span><FolderOpen /></span><div><small>TOTAL DOCUMENTS</small><strong>1,284</strong><p>Across 128 shipments</p></div></article><article><span className="green"><FileCheck2 /></span><div><small>APPROVED</small><strong>1,196</strong><p>93.1% completion</p></div></article><article><span className="amber"><FileClock /></span><div><small>NEEDS ATTENTION</small><strong>12</strong><p>5 expire this month</p></div></article></section>
      <section className="panel list-panel">
        <div className="list-toolbar"><div><p className="panel-eyebrow">DOCUMENT LIBRARY</p><h2>Recent documents</h2></div><label className="table-search"><Search size={16} /><input placeholder="Search documents" /></label></div>
        <div className="document-list">{documents.map((document) => <div className="document-row" key={document.name}><span className="file-icon"><FileText size={20} /></span><div className="document-title"><strong>{document.name}</strong><small>{document.type} · {document.owner}</small></div><span className="document-date"><small>UPDATED</small>{document.updated}</span><StatusPill status={document.status} /><button type="button" aria-label={`More actions for ${document.name}`}>•••</button></div>)}</div>
      </section>
    </div>
  );
}
