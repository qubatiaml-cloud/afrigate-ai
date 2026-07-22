import Link from "next/link";
import { ArrowRight, Bot, CheckCircle2, CirclePlay, Globe2, Route, ShieldCheck, Sparkles } from "lucide-react";
import { Brand } from "@/components/brand";

export default function Home() {
  return (
    <main className="landing">
      <nav className="landing-nav">
        <Brand />
        <div className="landing-links"><a href="#platform">Platform</a><a href="#network">Network</a><a href="#security">Security</a><a href="#company">Company</a></div>
        <div className="landing-actions"><Link className="text-button" href="/dashboard">Sign in</Link><Link className="button small" href="/dashboard">Open workspace <ArrowRight size={15} /></Link></div>
      </nav>
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-copy">
          <span className="eyebrow"><Sparkles size={14} /> AI-NATIVE TRADE OPERATIONS</span>
          <h1>Move goods across Africa.<br /><em>Without the blind spots.</em></h1>
          <p>One intelligent command center for shipments, customs, documents, customers and every decision in between.</p>
          <div className="hero-actions"><Link className="button" href="/dashboard">Explore live workspace <ArrowRight size={17} /></Link><a className="outline-button" href="#platform"><CirclePlay size={18} /> See how it works</a></div>
          <div className="hero-proof"><span><CheckCircle2 size={15} /> Set up in days</span><span><CheckCircle2 size={15} /> No card required</span><span><CheckCircle2 size={15} /> Enterprise ready</span></div>
        </div>
        <div className="hero-visual">
          <div className="visual-top"><span><i /> Live operations</span><small>22 JUL 2026 · 18:42 EAT</small></div>
          <div className="visual-metrics"><div><small>ACTIVE SHIPMENTS</small><strong>128</strong><span>+14.2%</span></div><div><small>ON-TIME RATE</small><strong>94.8%</strong><span>+2.6%</span></div><div><small>VALUE IN TRANSIT</small><strong>$4.82M</strong><span>Protected</span></div></div>
          <div className="visual-body">
            <div className="mini-map"><Globe2 /><span className="pulse p1" /><span className="pulse p2" /><span className="pulse p3" /><span className="mini-route r1" /><span className="mini-route r2" /></div>
            <div className="visual-list"><small>PRIORITY MOVEMENTS</small><div><i className="orange" />AFG-24854 <span>Delay risk</span></div><div><i className="green" />AFG-24891 <span>On schedule</span></div><div><i className="blue" />AFG-24876 <span>At customs</span></div></div>
          </div>
          <div className="ai-float"><span><Bot size={18} /></span><div><small>AFRIGATE INTELLIGENCE</small><strong>Alternative route found</strong><p>Save 18 hours via Kazungula border.</p></div><ArrowRight size={17} /></div>
        </div>
      </section>
      <section className="logo-strip"><span>Trusted across the trade corridor</span><strong>KIBO</strong><strong>SAVANNA</strong><strong>ATLAS</strong><strong>NILE AGRO</strong><strong>TERANGA</strong></section>
      <section className="landing-features" id="platform">
        <div className="section-heading"><span className="eyebrow">THE OPERATING LAYER FOR AFRICAN TRADE</span><h2>From fragmented updates to<br />one clear next move.</h2><p>AfriGate connects every shipment, document and partner—then turns that live context into action.</p></div>
        <div className="feature-grid">
          <article><span><Route /></span><small>01</small><h3>End-to-end visibility</h3><p>Track multimodal freight and exceptions across borders, carriers and customers from one live control tower.</p><a href="#network">Explore visibility <ArrowRight size={15} /></a></article>
          <article><span><Bot /></span><small>02</small><h3>Decisions, accelerated</h3><p>AI identifies delay risks, cost savings and compliance gaps early—then recommends the next best action.</p><a href="#network">Explore intelligence <ArrowRight size={15} /></a></article>
          <article id="security"><span><ShieldCheck /></span><small>03</small><h3>Compliance built in</h3><p>Keep trade documents complete, current and linked to the right shipment with structured approval workflows.</p><a href="#company">Explore compliance <ArrowRight size={15} /></a></article>
        </div>
      </section>
      <section className="landing-cta" id="network"><div><span className="eyebrow">YOUR NETWORK. ONE COMMAND CENTER.</span><h2>Ready to move trade forward?</h2><p>See how AfriGate can give your team the clarity to act sooner.</p></div><Link className="button light" href="/dashboard">Launch the demo <ArrowRight size={17} /></Link></section>
      <footer className="landing-footer" id="company"><Brand /><span>© 2026 AfriGate AI. Built for Africa&apos;s next era of trade.</span><div><a href="#security">Privacy</a><a href="#security">Security</a><a href="mailto:hello@afrigate.ai">Contact</a></div></footer>
    </main>
  );
}
