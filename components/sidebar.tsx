"use client";
import Link from "next/link"; import { usePathname } from "next/navigation"; import type { LucideIcon } from "lucide-react"; import { BrainCircuit, Building2, FileText, FolderKanban, Handshake, LayoutDashboard, Settings, Store, UsersRound, WalletCards } from "lucide-react"; import { Brand } from "@/components/brand";
const links: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: "/dashboard", label: "Executive overview", icon: LayoutDashboard }, { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/feasibility", label: "AI feasibility", icon: BrainCircuit }, { href: "/finance", label: "Finance", icon: WalletCards },
  { href: "/documents", label: "Document Center", icon: FileText }, { href: "/crm", label: "CRM", icon: UsersRound },
  { href: "/suppliers", label: "Suppliers", icon: Store }, { href: "/investors", label: "Investors", icon: Handshake },
];
export function Sidebar({ organization }: { organization: string }) { const pathname = usePathname(); return <aside className="sidebar"><div className="sidebar-brand"><Brand href="/dashboard" /></div><div className="organization-card"><span><Building2 /></span><div><small>WORKSPACE</small><strong>{organization}</strong></div></div><nav><p>OPERATING SYSTEM</p>{links.map(({ href, label, icon: Icon }) => <Link className={pathname === href ? "active" : ""} href={href} key={href}><Icon /><span>{label}</span></Link>)}</nav><div className="sidebar-footer"><Link className={pathname === "/settings" ? "active" : ""} href="/settings"><Settings /><span>Settings</span></Link><div><i /> Supabase connected</div></div></aside>; }
