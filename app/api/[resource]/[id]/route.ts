import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getApiContext, writeAuditLog } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { deleteResource, isResourceName, ResourceError, updateResource } from "@/lib/resources";
import { rejectCrossOrigin } from "@/lib/security";

export async function PATCH(request: Request, { params }: { params: Promise<{ resource: string; id: string }> }) {
  const originError = rejectCrossOrigin(request);
  if (originError) return originError;
  const { resource, id } = await params; const context = await getApiContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isResourceName(resource)) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  if (!hasPermission(context.role, "update", resource)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try { const data = await updateResource(resource, id, await request.json(), context); await writeAuditLog(context, "UPDATE", resource, id).catch(console.error); return NextResponse.json({ data }); }
  catch (error) { if (error instanceof ZodError) return NextResponse.json({ error: "Validation failed", fields: error.flatten().fieldErrors }, { status: 422 }); if (error instanceof ResourceError) return NextResponse.json({ error: error.message }, { status: error.status }); console.error(error); return NextResponse.json({ error: "Unable to update record." }, { status: 500 }); }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ resource: string; id: string }> }) {
  const originError = rejectCrossOrigin(request);
  if (originError) return originError;
  const { resource, id } = await params; const context = await getApiContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isResourceName(resource)) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  if (!hasPermission(context.role, "delete", resource)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try { await deleteResource(resource, id, context); await writeAuditLog(context, "DELETE", resource, id).catch(console.error); return NextResponse.json({ success: true }); }
  catch (error) { if (error instanceof ZodError) return NextResponse.json({ error: "Invalid record identifier." }, { status: 422 }); if (error instanceof ResourceError) return NextResponse.json({ error: error.message }, { status: error.status }); console.error(error); return NextResponse.json({ error: "Unable to delete record." }, { status: 500 }); }
}
