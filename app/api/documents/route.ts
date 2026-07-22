import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getApiContext, writeAuditLog } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { createClient } from "@/lib/supabase/server";
import { storageBucket } from "@/lib/env";
import { rejectCrossOrigin } from "@/lib/security";

export const dynamic = "force-dynamic";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const allowedTypes = new Set(["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "image/png", "image/jpeg"]);
const metadataSchema = z.object({ title: z.string().trim().min(2).max(180), category: z.string().trim().min(2).max(80), projectId: z.preprocess((value) => value === "" ? undefined : value, z.string().uuid().optional()) }).strict();

export async function GET() {
  const context = await getApiContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await prisma.document.findMany({ where: { organizationId: context.organizationId }, include: { project: { select: { name: true } } }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data: JSON.parse(JSON.stringify(data)) }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: Request) {
  const originError = rejectCrossOrigin(request);
  if (originError) return originError;
  const context = await getApiContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasPermission(context.role, "documents")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "A document file is required." }, { status: 422 });
    if (file.size < 1 || file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "Files must be between 1 byte and 10 MB." }, { status: 422 });
    if (!allowedTypes.has(file.type)) return NextResponse.json({ error: "Only PDF, DOCX, XLSX, PNG and JPEG files are allowed." }, { status: 422 });
    const metadata = metadataSchema.parse({ title: formData.get("title"), category: formData.get("category"), projectId: formData.get("projectId") });
    if (metadata.projectId && !await prisma.project.count({ where: { id: metadata.projectId, organizationId: context.organizationId } })) return NextResponse.json({ error: "Selected project was not found." }, { status: 422 });

    const safeName = file.name.replace(/[^A-Za-z0-9._-]/g, "-").slice(-120);
    const path = `${context.organizationId}/${metadata.projectId || "general"}/${randomUUID()}-${safeName}`;
    const bucket = storageBucket();
    const supabase = await createClient();
    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, { contentType: file.type, upsert: false, cacheControl: "3600" });
    if (uploadError) return NextResponse.json({ error: `Storage upload failed: ${uploadError.message}` }, { status: 502 });

    try {
      const data = await prisma.document.create({ data: { ...metadata, projectId: metadata.projectId || null, storageBucket: bucket, storagePath: path, mimeType: file.type, sizeBytes: file.size, organizationId: context.organizationId, uploadedBy: context.userId } });
      await writeAuditLog(context, "UPLOAD", "documents", data.id, { title: data.title }).catch(console.error);
      return NextResponse.json({ data: JSON.parse(JSON.stringify(data)) }, { status: 201 });
    } catch (databaseError) {
      await supabase.storage.from(bucket).remove([path]);
      throw databaseError;
    }
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Document metadata is invalid.", fields: error.flatten().fieldErrors }, { status: 422 });
    console.error(error); return NextResponse.json({ error: "The document could not be uploaded." }, { status: 500 });
  }
}
