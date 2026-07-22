import { WorkspaceShell } from "@/components/workspace-shell"; import { requireOrganization } from "@/lib/auth";
export const dynamic = "force-dynamic";
export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) { const context = await requireOrganization(); return <WorkspaceShell organization={context.organization.name} name={context.profile.fullName || context.email} role={context.role}>{children}</WorkspaceShell>; }
