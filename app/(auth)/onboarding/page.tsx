import { Building2 } from "lucide-react";
import { Brand } from "@/components/brand";
import { completeOnboarding } from "./actions";

export const dynamic = "force-dynamic";

export default async function OnboardingPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <main className="auth-page onboarding"><section className="auth-panel"><Brand /><div className="auth-copy"><span className="eyebrow">CREATE YOUR WORKSPACE</span><h1>Set up AfriGate AI</h1><p>Your first authenticated account becomes the workspace owner and can govern member roles from Settings.</p></div>{error && <div className="form-error">{error}</div>}<form action={completeOnboarding} className="auth-form"><label><span>Your full name</span><input name="fullName" required minLength={2} maxLength={100} /></label><label><span>Organization name</span><input name="organizationName" required minLength={2} maxLength={120} /></label><div className="form-row"><label><span>Country</span><input name="country" defaultValue="Kenya" required /></label><label><span>Currency</span><input name="currency" defaultValue="USD" required minLength={3} maxLength={3} /></label></div><button className="primary-button wide" type="submit"><Building2 size={16} /> Create workspace</button></form></section><aside className="auth-aside"><span><Building2 /></span><h2>Governed from the first project.</h2><p>Organization isolation, role-based access, audit logs and private document storage are enabled by default.</p></aside></main>;
}
