import type { ResourceName } from "@/lib/permissions";

export type FieldDefinition = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "number" | "date" | "textarea" | "select";
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  optionSource?: "projects" | "clients";
  placeholder?: string;
  min?: number;
  max?: number;
  step?: string;
};

export type ResourceDefinition = {
  resource: ResourceName;
  eyebrow: string;
  title: string;
  description: string;
  singular: string;
  fields: FieldDefinition[];
  columns: Array<{ key: string; label: string; format?: "currency" | "date" | "status" | "score" }>;
};

const statusOptions = (values: string[]) => values.map((value) => ({ value, label: value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase()) }));

export const resourceDefinitions: Record<ResourceName, ResourceDefinition> = {
  projects: {
    resource: "projects", eyebrow: "DELIVERY PORTFOLIO", title: "Project Management", description: "Plan, fund and govern initiatives from concept through completion.", singular: "project",
    columns: [{ key: "code", label: "Code" }, { key: "name", label: "Project" }, { key: "sector", label: "Sector" }, { key: "status", label: "Status", format: "status" }, { key: "budget", label: "Budget", format: "currency" }, { key: "endDate", label: "Target date", format: "date" }],
    fields: [
      { name: "code", label: "Project code", type: "text", required: true, placeholder: "AFG-001" }, { name: "name", label: "Project name", type: "text", required: true },
      { name: "sector", label: "Sector", type: "text", required: true }, { name: "location", label: "Location", type: "text", required: true },
      { name: "status", label: "Status", type: "select", required: true, options: statusOptions(["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"]) },
      { name: "budget", label: "Budget", type: "number", required: true, min: 0, step: "0.01" }, { name: "clientId", label: "CRM client", type: "select", optionSource: "clients" },
      { name: "startDate", label: "Start date", type: "date" }, { name: "endDate", label: "Target end date", type: "date" },
      { name: "description", label: "Description", type: "textarea" },
    ],
  },
  feasibility: {
    resource: "feasibility", eyebrow: "DECISION INTELLIGENCE", title: "AI Feasibility Studies", description: "Structure evidence, score viability and produce auditable investment recommendations.", singular: "study",
    columns: [{ key: "title", label: "Study" }, { key: "projectName", label: "Project" }, { key: "status", label: "Status", format: "status" }, { key: "overallScore", label: "Overall", format: "score" }, { key: "updatedAt", label: "Updated", format: "date" }],
    fields: [
      { name: "title", label: "Study title", type: "text", required: true }, { name: "projectId", label: "Project", type: "select", optionSource: "projects", required: true },
      { name: "status", label: "Status", type: "select", required: true, options: statusOptions(["DRAFT", "IN_REVIEW", "APPROVED", "REJECTED"]) },
      { name: "executiveSummary", label: "Executive summary", type: "textarea", required: true },
      { name: "marketScore", label: "Market score (0–100)", type: "number", min: 0, max: 100 }, { name: "technicalScore", label: "Technical score (0–100)", type: "number", min: 0, max: 100 },
      { name: "financialScore", label: "Financial score (0–100)", type: "number", min: 0, max: 100 }, { name: "riskScore", label: "Risk score (0–100)", type: "number", min: 0, max: 100 },
      { name: "recommendation", label: "Recommendation", type: "textarea" },
    ],
  },
  financial: {
    resource: "financial", eyebrow: "FINANCIAL CONTROL", title: "Financial Module", description: "Control budgets, investments, revenue and expenditure against the project portfolio.", singular: "financial record",
    columns: [{ key: "transactionDate", label: "Date", format: "date" }, { key: "type", label: "Type", format: "status" }, { key: "category", label: "Category" }, { key: "description", label: "Description" }, { key: "projectName", label: "Project" }, { key: "amount", label: "Amount", format: "currency" }],
    fields: [
      { name: "type", label: "Record type", type: "select", required: true, options: statusOptions(["BUDGET", "REVENUE", "EXPENSE", "INVESTMENT"]) },
      { name: "category", label: "Category", type: "text", required: true }, { name: "description", label: "Description", type: "text", required: true },
      { name: "amount", label: "Amount", type: "number", required: true, min: 0, step: "0.01" }, { name: "currency", label: "Currency", type: "text", required: true, placeholder: "USD" },
      { name: "transactionDate", label: "Transaction date", type: "date", required: true }, { name: "projectId", label: "Project", type: "select", optionSource: "projects" },
    ],
  },
  crm: {
    resource: "crm", eyebrow: "RELATIONSHIPS", title: "CRM", description: "Manage the organizations and people that drive the opportunity pipeline.", singular: "client",
    columns: [{ key: "name", label: "Organization" }, { key: "contactName", label: "Contact" }, { key: "email", label: "Email" }, { key: "country", label: "Country" }, { key: "stage", label: "Stage", format: "status" }, { key: "estimatedValue", label: "Pipeline value", format: "currency" }],
    fields: [
      { name: "name", label: "Organization name", type: "text", required: true }, { name: "contactName", label: "Primary contact", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true }, { name: "phone", label: "Phone", type: "tel" }, { name: "country", label: "Country", type: "text", required: true },
      { name: "stage", label: "Stage", type: "select", required: true, options: statusOptions(["LEAD", "QUALIFIED", "PROPOSAL", "ACTIVE", "INACTIVE"]) },
      { name: "estimatedValue", label: "Estimated value", type: "number", min: 0, step: "0.01" }, { name: "notes", label: "Notes", type: "textarea" },
    ],
  },
  suppliers: {
    resource: "suppliers", eyebrow: "SUPPLY NETWORK", title: "Supplier Management", description: "Qualify, approve and monitor the partners required to deliver each project.", singular: "supplier",
    columns: [{ key: "name", label: "Supplier" }, { key: "category", label: "Category" }, { key: "contactName", label: "Contact" }, { key: "country", label: "Country" }, { key: "status", label: "Status", format: "status" }, { key: "rating", label: "Rating", format: "score" }],
    fields: [
      { name: "name", label: "Supplier name", type: "text", required: true }, { name: "category", label: "Category", type: "text", required: true },
      { name: "contactName", label: "Contact name", type: "text", required: true }, { name: "email", label: "Email", type: "email", required: true },
      { name: "phone", label: "Phone", type: "tel" }, { name: "country", label: "Country", type: "text", required: true },
      { name: "status", label: "Status", type: "select", required: true, options: statusOptions(["PROSPECT", "APPROVED", "ACTIVE", "SUSPENDED"]) },
      { name: "rating", label: "Rating (0–100)", type: "number", min: 0, max: 100 }, { name: "notes", label: "Notes", type: "textarea" },
    ],
  },
  investors: {
    resource: "investors", eyebrow: "CAPITAL NETWORK", title: "Investor Management", description: "Track investor relationships, mandates, engagement and commitment status.", singular: "investor",
    columns: [{ key: "name", label: "Investor" }, { key: "organizationName", label: "Organization" }, { key: "email", label: "Email" }, { key: "country", label: "Country" }, { key: "status", label: "Status", format: "status" }, { key: "investmentRange", label: "Investment range" }],
    fields: [
      { name: "name", label: "Investor name", type: "text", required: true }, { name: "organizationName", label: "Organization", type: "text" },
      { name: "email", label: "Email", type: "email", required: true }, { name: "phone", label: "Phone", type: "tel" }, { name: "country", label: "Country", type: "text", required: true },
      { name: "status", label: "Status", type: "select", required: true, options: statusOptions(["PROSPECT", "ENGAGED", "DUE_DILIGENCE", "COMMITTED", "INACTIVE"]) },
      { name: "investmentRange", label: "Investment range", type: "text", required: true, placeholder: "$500k–$2m" }, { name: "focusAreas", label: "Focus areas", type: "text", required: true },
      { name: "lastContactedAt", label: "Last contacted", type: "date" }, { name: "notes", label: "Notes", type: "textarea" },
    ],
  },
};
