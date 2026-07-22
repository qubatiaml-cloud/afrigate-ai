import type { Metadata } from "next";
import { Download, Filter, Plus, Search, Ship } from "lucide-react";
import { ShipmentTable } from "@/components/shipment-table";
import { shipments } from "@/lib/data";

export const metadata: Metadata = { title: "Shipments" };

export default function ShipmentsPage() {
  const statusCounts = ["All", "In transit", "Customs", "Delayed", "Delivered"].map((status) => ({ status, count: status === "All" ? shipments.length : shipments.filter((item) => item.status === status).length }));
  return (
    <div className="page-stack">
      <div className="page-header"><div><p className="page-kicker">OPERATIONS</p><h1>Shipments</h1><p>Track every movement, milestone and exception in one place.</p></div><div className="header-actions"><button className="secondary-button" type="button"><Download size={16} /> Export</button><button className="primary-button" type="button"><Plus size={16} /> New shipment</button></div></div>
      <section className="shipment-stats">{statusCounts.map((item, index) => <div className={index === 0 ? "active" : ""} key={item.status}><span>{index === 0 && <Ship size={16} />}{item.status}</span><strong>{item.count}</strong></div>)}</section>
      <section className="panel list-panel">
        <div className="list-toolbar"><label className="table-search"><Search size={16} /><input placeholder="Search by reference, customer or route" /></label><div><button className="filter-button" type="button"><Filter size={15} /> Status</button><button className="filter-button" type="button"><Filter size={15} /> Mode</button><select aria-label="Sort shipments" defaultValue="updated"><option value="updated">Recently updated</option><option value="eta">ETA</option><option value="value">Value</option></select></div></div>
        <ShipmentTable />
        <div className="table-footer"><span>Showing 1–{shipments.length} of {shipments.length} shipments</span><div><button type="button" disabled>Previous</button><button type="button" disabled>Next</button></div></div>
      </section>
    </div>
  );
}
