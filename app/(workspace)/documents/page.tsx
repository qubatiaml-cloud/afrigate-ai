import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireOrganization } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { DocumentManager } from "@/components/document-manager";
export const metadata: Metadata = { title: "Document Center" }; export const dynamic = "force-dynamic";
export default async function DocumentsPage() { const context = await requireOrganization(); const [documents, projects] = await Promise.all([prisma.document.findMany({ where: { organizationId: context.organizationId }, include: { project: { select: { name: true } } }, orderBy: { createdAt: "desc" } }), prisma.project.findMany({ where: { organizationId: context.organizationId }, select: { id: true, name: true }, orderBy: { name: "asc" } })]); return <DocumentManager rows={JSON.parse(JSON.stringify(documents))} projects={projects.map((project) => ({ value: project.id, label: project.name }))} canManage={hasPermission(context.role, "documents")} />; }
