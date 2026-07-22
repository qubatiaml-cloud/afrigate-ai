import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getApiContext, writeAuditLog } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { rejectCrossOrigin } from "@/lib/security";

const roleSchema = z.object({ role: z.enum(["OWNER", "ADMIN", "MEMBER", "ANALYST", "VIEWER"]) }).strict();
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const originError = rejectCrossOrigin(request);
  if (originError) return originError;
  const { id } = await params; const context = await getApiContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasPermission(context.role, "settings")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const { role } = roleSchema.parse(await request.json());
    const target = await prisma.profile.findFirst({ where: { id, organizationId: context.organizationId } });
    if (!target) return NextResponse.json({ error: "Team member not found." }, { status: 404 });
    if (context.role !== "OWNER" && (target.role === "OWNER" || role === "OWNER")) return NextResponse.json({ error: "Only an owner can change owner access." }, { status: 403 });
    if (target.role === "OWNER" && role !== "OWNER" && await prisma.profile.count({ where: { organizationId: context.organizationId, role: "OWNER" } }) <= 1) return NextResponse.json({ error: "A workspace must retain at least one owner." }, { status: 409 });
    const data = await prisma.profile.update({ where: { id }, data: { role } });
    await writeAuditLog(context, "UPDATE_ROLE", "profiles", id, { role }).catch(console.error);
    return NextResponse.json({ data });
  } catch (error) { if (error instanceof z.ZodError) return NextResponse.json({ error: "Invalid role." }, { status: 422 }); console.error(error); return NextResponse.json({ error: "Role could not be updated." }, { status: 500 }); }
}
