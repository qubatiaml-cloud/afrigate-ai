import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getApiContext, writeAuditLog } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { rejectCrossOrigin } from "@/lib/security";

const settingsSchema = z.object({ name: z.string().trim().min(2).max(120), country: z.string().trim().min(2).max(80), currency: z.string().trim().length(3).transform((value) => value.toUpperCase()), fiscalYearStart: z.coerce.number().int().min(1).max(12) }).strict();
export async function GET() { const context = await getApiContext(); if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); return NextResponse.json({ data: context.organization }, { headers: { "Cache-Control": "private, no-store" } }); }
export async function PATCH(request: Request) { const originError = rejectCrossOrigin(request); if (originError) return originError; const context = await getApiContext(); if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); if (!hasPermission(context.role, "settings")) return NextResponse.json({ error: "Forbidden" }, { status: 403 }); try { const data = settingsSchema.parse(await request.json()); const organization = await prisma.organization.update({ where: { id: context.organizationId }, data }); await writeAuditLog(context, "UPDATE", "settings", organization.id).catch(console.error); return NextResponse.json({ data: organization }); } catch (error) { if (error instanceof z.ZodError) return NextResponse.json({ error: "Organization settings are invalid.", fields: error.flatten().fieldErrors }, { status: 422 }); console.error(error); return NextResponse.json({ error: "Settings could not be updated." }, { status: 500 }); } }
