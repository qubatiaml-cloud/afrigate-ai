import type { Metadata } from "next";
import { ArrowDownRight, ArrowUpRight, BarChart3, CalendarDays, Download } from "lucide-react";

export const metadata: Metadata = { title: "Analytics" };

const lanes = [
  { lane: "Shenzhen → Mombasa", volume: 84, value: "$1.42M", onTime: "96.4%" },
  { lane: "Frankfurt → Nairobi", volume: 72, value: "$986K", onTime: "94.1%" },
  { lane: "Durban → Lusaka", volume: 58, value: "$742K", onTime: "88.6%" },
  { lane: "Kampala → Alexandria", volume: 47, value: "$638K", onTime: "92.7%" },
];

export default function AnalyticsPage() {
  return (
    <div className="page-stack">
      <div className="page-header"><div><p className="page-kicker">PERFORMANCE</p><h1>Analytics</h1><p>Understand network performance, cost and service quality over time.</p></div><div className="header-actions"><button className="secondary-button" type="button"><CalendarDays size={16} /> May 1 – Jul 22</button><button className="secondary-button" type="button"><Download size={16} /> Export report</button></div></div>
      <section className="analytics-kpis"><article><span>REVENUE</span><strong>$3.84M</strong><small className="good"><ArrowUpRight /> 12.8% vs prior period</small></article><article><span>GROSS MARGIN</span><strong>28.6%</strong><small className="good"><ArrowUpRight /> 2.1 pts improvement</small></article><article><span>COST / SHIPMENT</span><strong>$4,284</strong><small className="good"><ArrowDownRight /> 6.4% lower</small></article><article><span>CLAIM RATE</span><strong>0.82%</strong><small className="bad"><ArrowUpRight /> 0.14 pts higher</small></article></section>
      <section className="analytics-grid"><article className="panel revenue-chart-panel"><div className="panel-header"><div><p className="panel-eyebrow">COMMERCIAL PERFORMANCE</p><h2>Revenue and margin</h2></div><span className="chart-key"><i /> Revenue <i className="margin" /> Margin</span></div><div className="bar-chart">{[42,51,47,62,58,69,72,68,81,78,88,94].map((value, index) => <div key={index}><span style={{ height: `${value}%` }} /><i style={{ bottom: `${Math.max(28, value * .72)}%` }} /></div>)}</div><div className="month-labels"><span>May</span><span>June</span><span>July</span></div></article><article className="panel mode-panel"><div className="panel-header"><div><p className="panel-eyebrow">MODE MIX</p><h2>Shipments by mode</h2></div><BarChart3 size={19} /></div><div className="donut"><div><strong>624</strong><small>TOTAL</small></div></div><ul><li><span><i className="sea" /> Sea</span><strong>54%</strong></li><li><span><i className="road" /> Road</span><strong>27%</strong></li><li><span><i className="air" /> Air</span><strong>14%</strong></li><li><span><i className="rail" /> Rail</span><strong>5%</strong></li></ul></article></section>
      <section className="panel lane-panel"><div className="panel-header"><div><p className="panel-eyebrow">LANE PERFORMANCE</p><h2>Top trade corridors</h2></div></div><table className="data-table"><thead><tr><th>Trade lane</th><th>Relative volume</th><th>Shipments</th><th>Value</th><th>On-time</th></tr></thead><tbody>{lanes.map((lane, index) => <tr key={lane.lane}><td><strong>{lane.lane}</strong></td><td><span className="lane-bar"><i style={{ width: `${lane.volume}%` }} /></span></td><td>{Math.round(lane.volume * 1.72)}</td><td>{lane.value}</td><td><strong className={index === 2 ? "warning-text" : "good-text"}>{lane.onTime}</strong></td></tr>)}</tbody></table></section>
    </div>
  );
}
