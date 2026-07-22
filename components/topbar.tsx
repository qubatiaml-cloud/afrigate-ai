"use client";

import { Bell, Command, Menu, Search } from "lucide-react";

export function Topbar({ onMenu }: { onMenu?: () => void }) {
  return (
    <header className="topbar">
      <button className="icon-button menu-button" type="button" aria-label="Open menu" onClick={onMenu}>
        <Menu size={20} />
      </button>
      <label className="global-search">
        <Search size={17} />
        <input aria-label="Search AfriGate" placeholder="Search shipments, customers, documents..." />
        <span><Command size={12} /> K</span>
      </label>
      <div className="topbar-actions">
        <span className="live-indicator"><i /> All systems operational</span>
        <button className="icon-button notification-button" type="button" aria-label="Notifications">
          <Bell size={19} />
          <span />
        </button>
        <span className="topbar-avatar">AY</span>
      </div>
    </header>
  );
}
