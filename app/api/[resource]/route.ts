import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getApiContext, writeAuditLog } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { createResource, isResourceName, listResource, ResourceError } from "@/lib/resources";
import { rejectCrossOrigin } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  const context = await getApiContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isResourceName(resource)) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  const data = await listResource(resource, context);
  return NextResponse.json({ data }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: Request, { params }: { params: Promise<{ resource: string }> }) {
  const originError = rejectCrossOrigin(request);
  if (originError) return originError;
  const { resource } = await params;
  const context = await getApiContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isResourceName(resource)) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  if (!hasPermission(context.role, "create", resource)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const body: unknown = await request.json();
    const data = await createResource(resource, body, context);
    const id = (data as { id: string }).id;
    await writeAuditLog(context, "CREATE", resource, id).catch(console.error);
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: "Validation failed", fields: error.flatten().fieldErrors }, { status: 422 });
    if (error instanceof ResourceError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error(error); return NextResponse.json({ error: "Unable to create record." }, { status: 500 });
  }
}
