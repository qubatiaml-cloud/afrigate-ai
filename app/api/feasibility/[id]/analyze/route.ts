import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getApiContext, writeAuditLog } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { rejectCrossOrigin } from "@/lib/security";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const originError = rejectCrossOrigin(request);
  if (originError) return originError;
  const { id } = await params; const context = await getApiContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasPermission(context.role, "update", "feasibility")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!z.string().uuid().safeParse(id).success) return NextResponse.json({ error: "Invalid study identifier." }, { status: 422 });
  const study = await prisma.feasibilityStudy.findFirst({ where: { id, organizationId: context.organizationId } });
  if (!study) return NextResponse.json({ error: "Study not found." }, { status: 404 });
  const scores = [study.marketScore, study.technicalScore, study.financialScore, study.riskScore];
  if (scores.some((score) => score === null)) return NextResponse.json({ error: "Complete all four assessment scores before analysis." }, { status: 422 });
  const overallScore = Math.round(study.marketScore! * .3 + study.technicalScore! * .25 + study.financialScore! * .3 + (100 - study.riskScore!) * .15);
  const recommendation = overallScore >= 75 ? "Proceed to investment committee with standard due diligence." : overallScore >= 55 ? "Proceed conditionally after resolving the highest-scoring risk factors." : "Do not proceed until the commercial, technical and financial assumptions are reworked.";
  const data = await prisma.feasibilityStudy.update({ where: { id }, data: { overallScore, recommendation, status: "IN_REVIEW" } });
  await writeAuditLog(context, "ANALYZE", "feasibility", id, { overallScore }).catch(console.error);
  return NextResponse.json({ data: JSON.parse(JSON.stringify(data)) });
}
