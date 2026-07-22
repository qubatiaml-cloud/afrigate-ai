import type { Metadata } from "next";
import { ArrowRight, Bot, CircleDollarSign, Clock3, Route, ShieldAlert, Sparkles, TrendingUp } from "lucide-react";
import { insights } from "@/lib/data";

export const metadata: Metadata = { title: "AI Insights" };
const icons = [Route, CircleDollarSign, ShieldAlert];

export default function InsightsPage() {
  return (
    <div className="page-stack">
      <div className="page-header"><div><p className="page-kicker purple-text"><Bot size={14} /> AFRIGATE INTELLIGENCE</p><h1>AI insights</h1><p>Prioritized recommendations grounded in your live operations data.</p></div><button className="primary-button ai-button" type="button"><Sparkles size={16} /> Ask AfriGate AI</button></div>
      <section className="ai-hero-panel"><div><span className="ai-orb"><Bot /></span><div><small>MORNING OPERATIONS BRIEF</small><h2>Your network is healthy, with two actions that could protect <em>$21,600</em> today.</h2><p>Analyzed 128 shipments, 1,284 documents and 48 customer accounts · Updated 2 minutes ago</p></div></div><button type="button">Play 90-second brief <ArrowRight size={15} /></button></section>
      <section className="insight-score-grid"><div><span><TrendingUp /></span><small>VALUE IDENTIFIED</small><strong>$62.4K</strong><p>this month</p></div><div><span className="blue"><Clock3 /></span><small>HOURS SAVED</small><strong>184</strong><p>through early action</p></div><div><span className="violet"><Sparkles /></span><small>ACCURACY</small><strong>91.6%</strong><p>30-day recommendations</p></div></section>
      <section className="insights-layout"><div className="insights-feed"><div className="feed-heading"><div><p className="panel-eyebrow">PRIORITY QUEUE</p><h2>Recommended actions</h2></div><span>3 open</span></div>{insights.map((insight, index) => { const Icon = icons[index]; return <article className={`insight-card ${insight.tone}`} key={insight.title}><div className="insight-card-top"><span className="insight-type"><Icon /></span><div><small>{insight.eyebrow}</small><h3>{insight.title}</h3></div><span className="confidence">{insight.confidence}% confidence</span></div><p>{insight.body}</p><div className="insight-card-bottom"><button className="primary-button" type="button">{insight.action} <ArrowRight size={14} /></button><button className="text-action" type="button">Dismiss</button><small><Clock3 size={12} /> Identified {index === 0 ? "12 min" : index === 1 ? "38 min" : "2 hr"} ago</small></div></article>})}</div><aside className="ai-side-panel"><div className="panel"><p className="panel-eyebrow purple"><Sparkles size={13} /> TREND SIGNAL</p><h3>East Africa port dwell time</h3><strong>−8.4%</strong><p>Average dwell time improved across Mombasa and Dar es Salaam over the last 30 days.</p><div className="micro-bars">{[45,56,50,64,62,72,68,81,76,88,84,92].map((value, index) => <i key={index} style={{ height: `${value}%` }} />)}</div></div><div className="panel"><p className="panel-eyebrow">HOW IT WORKS</p><h3>Intelligence you can audit</h3><p>Every recommendation includes its operational signal, confidence score and expected business impact.</p><a href="mailto:ai@afrigate.ai">Learn about our AI <ArrowRight size={14} /></a></div></aside></section>
    </div>
  );
}
