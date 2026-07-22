import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { AuthContext } from "@/lib/auth";
import type { ResourceName } from "@/lib/permissions";

const text = (min = 1, max = 240) => z.string().trim().min(min).max(max);
const optionalText = (max = 2000) => z.string().trim().max(max).optional().nullable();
const optionalUuid = z.preprocess((value) => value === "" || value === null ? undefined : value, z.string().uuid().optional());
const optionalDate = z.preprocess((value) => value === "" || value === null ? undefined : value, z.string().date().optional());
const optionalScore = z.preprocess((value) => value === "" || value === null ? undefined : value, z.coerce.number().int().min(0).max(100).optional());

const projectSchema = z.object({
  code: text(2, 30).regex(/^[A-Za-z0-9_-]+$/), name: text(2, 160), description: optionalText(3000), sector: text(2, 100), location: text(2, 160),
  status: z.enum(["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"]), budget: z.coerce.number().nonnegative().max(1_000_000_000_000),
  startDate: optionalDate, endDate: optionalDate, clientId: optionalUuid,
}).strict();
const feasibilitySchema = z.object({
  title: text(2, 180), projectId: z.string().uuid(), status: z.enum(["DRAFT", "IN_REVIEW", "APPROVED", "REJECTED"]), executiveSummary: text(20, 6000),
  marketScore: optionalScore, technicalScore: optionalScore, financialScore: optionalScore, riskScore: optionalScore, recommendation: optionalText(4000),
}).strict();
const financialSchema = z.object({
  type: z.enum(["BUDGET", "REVENUE", "EXPENSE", "INVESTMENT"]), category: text(2, 100), description: text(2, 500), amount: z.coerce.number().nonnegative().max(1_000_000_000_000),
  currency: z.string().trim().length(3).transform((value) => value.toUpperCase()), transactionDate: z.string().date(), projectId: optionalUuid,
}).strict();
const crmSchema = z.object({
  name: text(2, 160), contactName: text(2, 120), email: z.string().email().max(254), phone: optionalText(40), country: text(2, 80),
  stage: z.enum(["LEAD", "QUALIFIED", "PROPOSAL", "ACTIVE", "INACTIVE"]), estimatedValue: z.coerce.number().nonnegative().max(1_000_000_000_000).default(0), notes: optionalText(3000),
}).strict();
const supplierSchema = z.object({
  name: text(2, 160), category: text(2, 100), contactName: text(2, 120), email: z.string().email().max(254), phone: optionalText(40), country: text(2, 80),
  status: z.enum(["PROSPECT", "APPROVED", "ACTIVE", "SUSPENDED"]), rating: z.coerce.number().int().min(0).max(100).default(0), notes: optionalText(3000),
}).strict();
const investorSchema = z.object({
  name: text(2, 140), organizationName: optionalText(160), email: z.string().email().max(254), phone: optionalText(40), country: text(2, 80),
  status: z.enum(["PROSPECT", "ENGAGED", "DUE_DILIGENCE", "COMMITTED", "INACTIVE"]), investmentRange: text(2, 100), focusAreas: text(2, 500), lastContactedAt: optionalDate, notes: optionalText(3000),
}).strict();

const schemas = { projects: projectSchema, feasibility: feasibilitySchema, financial: financialSchema, crm: crmSchema, suppliers: supplierSchema, investors: investorSchema };
export const resourceNames = Object.keys(schemas) as ResourceName[];
export const isResourceName = (value: string): value is ResourceName => resourceNames.includes(value as ResourceName);

const dateOrNull = (value?: string) => value ? new Date(`${value}T00:00:00.000Z`) : null;
const serialize = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

async function assertProject(id: string | undefined, organizationId: string) {
  if (!id) return;
  const count = await prisma.project.count({ where: { id, organizationId } });
  if (!count) throw new ResourceError("Selected project was not found.", 422);
}

async function assertClient(id: string | undefined, organizationId: string) {
  if (!id) return;
  const count = await prisma.client.count({ where: { id, organizationId } });
  if (!count) throw new ResourceError("Selected client was not found.", 422);
}

export class ResourceError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

export async function listResource(resource: ResourceName, context: AuthContext) {
  const organizationId = context.organizationId;
  switch (resource) {
    case "projects": return serialize(await prisma.project.findMany({ where: { organizationId }, orderBy: { updatedAt: "desc" } }));
    case "feasibility": return serialize((await prisma.feasibilityStudy.findMany({ where: { organizationId }, include: { project: { select: { name: true } } }, orderBy: { updatedAt: "desc" } })).map((row) => ({ ...row, projectName: row.project.name, project: undefined })));
    case "financial": return serialize((await prisma.financialRecord.findMany({ where: { organizationId }, include: { project: { select: { name: true } } }, orderBy: { transactionDate: "desc" } })).map((row) => ({ ...row, projectName: row.project?.name || "Organization", project: undefined })));
    case "crm": return serialize(await prisma.client.findMany({ where: { organizationId }, orderBy: { updatedAt: "desc" } }));
    case "suppliers": return serialize(await prisma.supplier.findMany({ where: { organizationId }, orderBy: { updatedAt: "desc" } }));
    case "investors": return serialize(await prisma.investor.findMany({ where: { organizationId }, orderBy: { updatedAt: "desc" } }));
  }
}

export async function getResourceOptions(context: AuthContext) {
  const [projects, clients] = await Promise.all([
    prisma.project.findMany({ where: { organizationId: context.organizationId }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.client.findMany({ where: { organizationId: context.organizationId }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  return { projects: projects.map(({ id, name }) => ({ value: id, label: name })), clients: clients.map(({ id, name }) => ({ value: id, label: name })) };
}

export async function createResource(resource: ResourceName, input: unknown, context: AuthContext) {
  const org = context.organizationId;
  switch (resource) {
    case "projects": { const data = projectSchema.parse(input); await assertClient(data.clientId, org); return serialize(await prisma.project.create({ data: { ...data, clientId: data.clientId || null, description: data.description || null, startDate: dateOrNull(data.startDate), endDate: dateOrNull(data.endDate), organizationId: org, createdBy: context.userId } })); }
    case "feasibility": { const data = feasibilitySchema.parse(input); await assertProject(data.projectId, org); return serialize(await prisma.feasibilityStudy.create({ data: { ...data, recommendation: data.recommendation || null, organizationId: org, createdBy: context.userId } })); }
    case "financial": { const data = financialSchema.parse(input); await assertProject(data.projectId, org); return serialize(await prisma.financialRecord.create({ data: { ...data, projectId: data.projectId || null, transactionDate: dateOrNull(data.transactionDate)!, organizationId: org, createdBy: context.userId } })); }
    case "crm": { const data = crmSchema.parse(input); return serialize(await prisma.client.create({ data: { ...data, phone: data.phone || null, notes: data.notes || null, organizationId: org, createdBy: context.userId } })); }
    case "suppliers": { const data = supplierSchema.parse(input); return serialize(await prisma.supplier.create({ data: { ...data, phone: data.phone || null, notes: data.notes || null, organizationId: org, createdBy: context.userId } })); }
    case "investors": { const data = investorSchema.parse(input); return serialize(await prisma.investor.create({ data: { ...data, organizationName: data.organizationName || null, phone: data.phone || null, notes: data.notes || null, lastContactedAt: dateOrNull(data.lastContactedAt), organizationId: org, createdBy: context.userId } })); }
  }
}

export async function updateResource(resource: ResourceName, id: string, input: unknown, context: AuthContext) {
  z.string().uuid().parse(id);
  const org = context.organizationId;
  const exists = await resourceCount(resource, id, org);
  if (!exists) throw new ResourceError("Record not found.", 404);
  switch (resource) {
    case "projects": { const data = projectSchema.partial().strict().parse(input); await assertClient(data.clientId, org); return serialize(await prisma.project.update({ where: { id }, data: { ...data, ...(data.clientId !== undefined && { clientId: data.clientId || null }), ...(data.startDate !== undefined && { startDate: dateOrNull(data.startDate) }), ...(data.endDate !== undefined && { endDate: dateOrNull(data.endDate) }) } })); }
    case "feasibility": { const data = feasibilitySchema.partial().strict().parse(input); await assertProject(data.projectId, org); return serialize(await prisma.feasibilityStudy.update({ where: { id }, data })); }
    case "financial": { const data = financialSchema.partial().strict().parse(input); await assertProject(data.projectId, org); return serialize(await prisma.financialRecord.update({ where: { id }, data: { ...data, ...(data.projectId !== undefined && { projectId: data.projectId || null }), ...(data.transactionDate !== undefined && { transactionDate: dateOrNull(data.transactionDate)! }) } })); }
    case "crm": { const data = crmSchema.partial().strict().parse(input); return serialize(await prisma.client.update({ where: { id }, data })); }
    case "suppliers": { const data = supplierSchema.partial().strict().parse(input); return serialize(await prisma.supplier.update({ where: { id }, data })); }
    case "investors": { const data = investorSchema.partial().strict().parse(input); return serialize(await prisma.investor.update({ where: { id }, data: { ...data, ...(data.lastContactedAt !== undefined && { lastContactedAt: dateOrNull(data.lastContactedAt) }) } })); }
  }
}

async function resourceCount(resource: ResourceName, id: string, organizationId: string) {
  switch (resource) {
    case "projects": return prisma.project.count({ where: { id, organizationId } }); case "feasibility": return prisma.feasibilityStudy.count({ where: { id, organizationId } });
    case "financial": return prisma.financialRecord.count({ where: { id, organizationId } }); case "crm": return prisma.client.count({ where: { id, organizationId } });
    case "suppliers": return prisma.supplier.count({ where: { id, organizationId } }); case "investors": return prisma.investor.count({ where: { id, organizationId } });
  }
}

export async function deleteResource(resource: ResourceName, id: string, context: AuthContext) {
  z.string().uuid().parse(id);
  if (!await resourceCount(resource, id, context.organizationId)) throw new ResourceError("Record not found.", 404);
  switch (resource) {
    case "projects": return prisma.project.delete({ where: { id } }); case "feasibility": return prisma.feasibilityStudy.delete({ where: { id } });
    case "financial": return prisma.financialRecord.delete({ where: { id } }); case "crm": return prisma.client.delete({ where: { id } });
    case "suppliers": return prisma.supplier.delete({ where: { id } }); case "investors": return prisma.investor.delete({ where: { id } });
  }
}
