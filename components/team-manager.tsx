"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Member = { id: string; fullName: string | null; email: string; role: string };

export function TeamManager({ members, canManage, currentRole }: { members: Member[]; canManage: boolean; currentRole: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const roles = currentRole === "OWNER" ? ["OWNER", "ADMIN", "MEMBER", "ANALYST", "VIEWER"] : ["ADMIN", "MEMBER", "ANALYST", "VIEWER"];

  async function changeRole(id: string, role: string) {
    setError("");
    const response = await fetch(`/api/settings/members/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role }) });
    if (!response.ok) {
      const result = await response.json().catch(() => null);
      setError(result?.error || "Role could not be updated.");
      return;
    }
    router.refresh();
  }

  return <>
    <div className="member-list">{members.map((member) => <div key={member.id}>
      <span className="avatar">{(member.fullName || member.email).slice(0, 2).toUpperCase()}</span>
      <span><strong>{member.fullName || "Unnamed user"}</strong><small>{member.email}</small></span>
      {canManage && !(currentRole !== "OWNER" && member.role === "OWNER")
        ? <select className="role-select" value={member.role} onChange={(event) => changeRole(member.id, event.target.value)}>{roles.map((role) => <option value={role} key={role}>{role}</option>)}</select>
        : <span className="role-badge">{member.role}</span>}
    </div>)}</div>
    {error && <div className="form-error team-error">{error}</div>}
  </>;
}
