import type { Metadata } from "next";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { Brand } from "@/components/brand";
import { login } from "./actions";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const params = await searchParams;
  return (
    <main className="auth-page">
      <section className="auth-panel">
        <Brand />
        <div className="auth-copy"><span className="eyebrow">SECURE WORKSPACE ACCESS</span><h1>Welcome back</h1><p>Sign in to manage projects, feasibility studies, finance, partners and investment activity.</p></div>
        {params.error && <div className="form-error" role="alert">{params.error}</div>}
        <form action={login} className="auth-form">
          <input type="hidden" name="next" value={params.next || "/dashboard"} />
          <label><span>Email address</span><input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@company.com" /></label>
          <label><span>Password</span><input name="password" type="password" autoComplete="current-password" required minLength={8} maxLength={128} /></label>
          <button className="primary-button wide" type="submit">Sign in <ArrowRight size={16} /></button>
        </form>
        <div className="auth-security"><ShieldCheck size={16} /><span><strong>Protected by Supabase Auth</strong><small>Secure cookie sessions and server-verified identity.</small></span></div>
      </section>
      <aside className="auth-aside"><span><LockKeyhole /></span><h2>One operating system for project delivery and investment decisions.</h2><p>AfriGate AI keeps every decision connected to governed data, accountable owners and auditable actions.</p></aside>
    </main>
  );
}
