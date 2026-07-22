"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={menuOpen ? "workspace menu-open" : "workspace"}>
      <div className="mobile-backdrop" onClick={() => setMenuOpen(false)} aria-hidden="true" />
      <div className="sidebar-wrapper" onClick={() => setMenuOpen(false)}><Sidebar /></div>
      <div className="workspace-main">
        <Topbar onMenu={() => setMenuOpen((value) => !value)} />
        <main className="workspace-content">{children}</main>
      </div>
    </div>
  );
}
