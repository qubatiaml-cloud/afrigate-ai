import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getApiContext, writeAuditLog } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { createClient } from "@/lib/supabase/server";
import { rejectCrossOrigin } from "@/lib/security";

const updateSchema = z.object({ title: z.string().trim().min(2).max(180), category: z.string().trim().min(2).max(80), projectId: z.preprocess((value) => value === "" || value === null ? undefined : value, z.string().uuid().optional()) }).strict();

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const originError = rejectCrossOrigin(request);
  if (originError) return originError;
  const { id } = await params; const context = await getApiContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasPermission(context.role, "documents")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const input = updateSchema.parse(await request.json());
    const document = await prisma.document.findFirst({ where: { id, organizationId: context.organizationId } });
    if (!document) return NextResponse.json({ error: "Document not found." }, { status: 404 });
    if (input.projectId && !await prisma.project.count({ where: { id: input.projectId, organizationId: context.organizationId } })) return NextResponse.json({ error: "Selected project was not found." }, { status: 422 });
    const data = await prisma.document.update({ where: { id }, data: { ...input, projectId: input.projectId || null } });
    await writeAuditLog(context, "UPDATE", "documents", id).catch(console.error); return NextResponse.json({ data: JSON.parse(JSON.stringify(data)) });
  } catch (error) { if (error instanceof z.ZodError) return NextResponse.json({ error: "Invalid document metadata." }, { status: 422 }); console.error(error); return NextResponse.json({ error: "The document could not be updated." }, { status: 500 }); }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const originError = rejectCrossOrigin(request);
  if (originError) return originError;
  const { id } = await params; const context = await getApiContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasPermission(context.role, "documents")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const document = await prisma.document.findFirst({ where: { id, organizationId: context.organizationId } });
  if (!document) return NextResponse.json({ error: "Document not found." }, { status: 404 });
  const supabase = await createClient(); const { error } = await supabase.storage.from(document.storageBucket).remove([document.storagePath]);
  if (error) return NextResponse.json({ error: `Storage deletion failed: ${error.message}` }, { status: 502 });
  await prisma.document.delete({ where: { id } }); await writeAuditLog(context, "DELETE", "documents", id).catch(console.error);
  return NextResponse.json({ success: true });
}
