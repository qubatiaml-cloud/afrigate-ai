import Link from "next/link";
import { ArrowRight, Bot, CircleDollarSign, Clock3, PackageCheck, Plus, Ship, Sparkles, TimerOff } from "lucide-react";
import { MetricCard } from "@/components/metric-card";
import { NetworkMap } from "@/components/network-map";
import { ShipmentTable } from "@/components/shipment-table";
import { VolumeChart } from "@/components/volume-chart";
import { insights } from "@/lib/data";

export default function DashboardPage() {
  return (
    <div className="page-stack">
      <div className="page-header">
        <div><p className="page-kicker">WEDNESDAY, 22 JULY</p><h1>Good evening, Amina.</h1><p>Here&apos;s what&apos;s moving across your network right now.</p></div>
        <div className="header-actions"><button className="secondary-button" type="button"><Sparkles size={16} /> Ask AfriGate AI</button><Link className="primary-button" href="/shipments"><Plus size={16} /> New shipment</Link></div>
      </div>
      <section className="metrics-grid">
        <MetricCard label="Active shipments" value="128" change="+14.2%" note="16 added this month" icon={Ship} />
        <MetricCard label="On-time delivery" value="94.8%" change="+2.6%" note="Across all active lanes" icon={PackageCheck} tone="blue" />
        <MetricCard label="Value in transit" value="$4.82M" change="+8.4%" note="100% cargo insured" icon={CircleDollarSign} tone="violet" />
        <MetricCard label="At-risk shipments" value="7" change="−3" note="2 require attention" icon={TimerOff} tone="amber" inverse />
      </section>
      <section className="dashboard-grid main-grid">
        <article className="panel volume-panel">
          <div className="panel-header"><div><p className="panel-eyebrow">NETWORK ACTIVITY</p><h2>Shipment volume</h2></div><div className="panel-actions"><span><i className="legend-current" /> This period</span><select aria-label="Chart period" defaultValue="12"><option value="12">Last 12 weeks</option><option value="6">Last 6 weeks</option></select></div></div>
          <div className="chart-summary"><strong>624</strong><span className="change positive">+18.6%</span><small>total movements</small></div>
          <VolumeChart />
        </article>
        <article className="panel ai-panel">
          <div className="panel-header"><div><p className="panel-eyebrow purple"><Bot size={13} /> AFRIGATE INTELLIGENCE</p><h2>What needs your attention</h2></div><Link href="/insights">View all <ArrowRight size={14} /></Link></div>
          <div className="insight-list">
            {insights.map((insight) => <div className={`mini-insight ${insight.tone}`} key={insight.title}><span className="insight-spark"><Sparkles size={15} /></span><div><small>{insight.eyebrow}</small><strong>{insight.title}</strong><p>{insight.body}</p><Link href="/insights">{insight.action} <ArrowRight size={13} /></Link></div></div>)}
          </div>
        </article>
      </section>
      <section className="panel shipments-panel">
        <div className="panel-header"><div><p className="panel-eyebrow">LIVE OPERATIONS</p><h2>Priority shipments</h2></div><Link className="view-link" href="/shipments">View all shipments <ArrowRight size={14} /></Link></div>
        <ShipmentTable limit={5} />
      </section>
      <section className="dashboard-grid lower-grid">
        <article className="panel network-panel"><div className="panel-header"><div><p className="panel-eyebrow">TRADE NETWORK</p><h2>Active corridors</h2></div><button className="ghost-select" type="button">Live view <i /></button></div><NetworkMap /></article>
        <article className="panel activity-panel"><div className="panel-header"><div><p className="panel-eyebrow">RECENT ACTIVITY</p><h2>Operations timeline</h2></div><button type="button" className="more-button">•••</button></div><div className="timeline">
          <div><span className="timeline-icon green"><PackageCheck size={15} /></span><p><strong>Shipment delivered</strong><span>AFG-24819 reached Dakar distribution center.</span><small><Clock3 size={12} /> 24 minutes ago</small></p></div>
          <div><span className="timeline-icon blue"><Ship size={15} /></span><p><strong>Customs clearance started</strong><span>Documents accepted for AFG-24876 in Nairobi.</span><small><Clock3 size={12} /> 42 minutes ago</small></p></div>
          <div><span className="timeline-icon purple"><Bot size={15} /></span><p><strong>Cost opportunity identified</strong><span>Two August bookings are eligible for consolidation.</span><small><Clock3 size={12} /> 1 hour ago</small></p></div>
        </div></article>
      </section>
    </div>
  );
}
