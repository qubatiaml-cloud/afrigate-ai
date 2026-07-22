import type { Metadata } from "next";
import { ArrowUpRight, Building2, Plus, Search, UsersRound } from "lucide-react";
import { customers } from "@/lib/data";

export const metadata: Metadata = { title: "Customers" };

export default function CustomersPage() {
  return (
    <div className="page-stack">
      <div className="page-header"><div><p className="page-kicker">RELATIONSHIPS</p><h1>Customers</h1><p>Commercial performance and service health across your customer portfolio.</p></div><button className="primary-button" type="button"><Plus size={16} /> Add customer</button></div>
      <section className="metrics-grid compact-metrics">
        <article className="summary-card"><span><UsersRound /></span><div><small>ACTIVE CUSTOMERS</small><strong>48</strong><p>Across 17 markets</p></div></article>
        <article className="summary-card"><span className="blue"><Building2 /></span><div><small>PORTFOLIO VALUE</small><strong>$8.6M</strong><p>+11.4% this quarter</p></div></article>
        <article className="summary-card"><span className="violet"><ArrowUpRight /></span><div><small>AVG. HEALTH SCORE</small><strong>89</strong><p>Top quartile</p></div></article>
      </section>
      <section className="panel list-panel">
        <div className="list-toolbar"><div><p className="panel-eyebrow">CUSTOMER PORTFOLIO</p><h2>All customers</h2></div><label className="table-search"><Search size={16} /><input placeholder="Search customers" /></label></div>
        <div className="customer-grid">{customers.map((customer) => <article className="customer-card" key={customer.code}><div className="customer-card-head"><span className="customer-logo">{customer.code}</span><button type="button">•••</button></div><h3>{customer.name}</h3><p>{customer.country}</p><div className="health-row"><span>Relationship health</span><strong>{customer.health}/100</strong></div><div className="health-bar"><i style={{ width: `${customer.health}%` }} /></div><div className="customer-card-stats"><div><small>SHIPMENTS</small><strong>{customer.shipments}</strong></div><div><small>YTD VALUE</small><strong>{customer.value}</strong></div><div><small>GROWTH</small><strong className={customer.trend.startsWith("+") ? "good" : "bad"}>{customer.trend}</strong></div></div><a href={`mailto:operations@${customer.code.toLowerCase()}.example`}>Open account <ArrowUpRight size={14} /></a></article>)}</div>
      </section>
    </div>
  );
}
