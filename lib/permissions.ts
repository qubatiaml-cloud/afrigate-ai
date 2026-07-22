import type { UserRole } from "@prisma/client";

export type ResourceName = "projects" | "feasibility" | "financial" | "crm" | "suppliers" | "investors";
export type PermissionAction = "read" | "create" | "update" | "delete" | "settings" | "documents";

const administrativeRoles: UserRole[] = ["OWNER", "ADMIN"];

export function hasPermission(role: UserRole, action: PermissionAction, resource?: ResourceName) {
  if (administrativeRoles.includes(role)) return true;
  if (action === "read") return true;
  if (role === "VIEWER") return false;
  if (action === "settings") return false;
  if (role === "ANALYST") return resource === "feasibility" || resource === "financial";
  return role === "MEMBER";
}
