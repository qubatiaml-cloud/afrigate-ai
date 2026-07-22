"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bot,
  Boxes,
  ChevronsUpDown,
  CircleHelp,
  FileText,
  LayoutDashboard,
  Settings,
  Ship,
  UsersRound,
} from "lucide-react";
import { Brand } from "@/components/brand";

const navigation: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/shipments", label: "Shipments", icon: Ship },
  { href: "/customers", label: "Customers", icon: UsersRound },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/insights", label: "AI insights", icon: Bot },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand"><Brand compact /></div>
      <button className="workspace-switcher" type="button">
        <span className="workspace-icon"><Boxes size={17} /></span>
        <span><small>WORKSPACE</small>AfriGate Demo</span>
        <ChevronsUpDown size={15} />
      </button>
      <nav className="sidebar-nav" aria-label="Workspace navigation">
        <p className="nav-label">OPERATIONS</p>
        {navigation.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link className={active ? "nav-link active" : "nav-link"} href={href} key={href}>
              <Icon size={18} strokeWidth={active ? 2.3 : 1.8} />
              <span>{label}</span>
              {label === "AI insights" && <span className="nav-count">3</span>}
            </Link>
          );
        })}
      </nav>
      <div className="sidebar-bottom">
        <Link className={pathname === "/settings" ? "nav-link active" : "nav-link"} href="/settings">
          <Settings size={18} /> <span>Settings</span>
        </Link>
        <a className="nav-link" href="mailto:support@afrigate.ai">
          <CircleHelp size={18} /> <span>Help & support</span>
        </a>
        <div className="profile-card">
          <span className="avatar">AY</span>
          <span><strong>Amina Yusuf</strong><small>Workspace owner</small></span>
          <ChevronsUpDown size={14} />
        </div>
      </div>
    </aside>
  );
}
