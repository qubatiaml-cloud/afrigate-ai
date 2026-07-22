-- AfriGate AI PostgreSQL foundation for Supabase.
CREATE TYPE "UserRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER', 'ANALYST', 'VIEWER');
CREATE TYPE "ProjectStatus" AS ENUM ('PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED');
CREATE TYPE "StudyStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'APPROVED', 'REJECTED');
CREATE TYPE "FinancialType" AS ENUM ('BUDGET', 'REVENUE', 'EXPENSE', 'INVESTMENT');
CREATE TYPE "ClientStage" AS ENUM ('LEAD', 'QUALIFIED', 'PROPOSAL', 'ACTIVE', 'INACTIVE');
CREATE TYPE "SupplierStatus" AS ENUM ('PROSPECT', 'APPROVED', 'ACTIVE', 'SUSPENDED');
CREATE TYPE "InvestorStatus" AS ENUM ('PROSPECT', 'ENGAGED', 'DUE_DILIGENCE', 'COMMITTED', 'INACTIVE');

CREATE TABLE "Organization" (
  "id" UUID NOT NULL, "name" TEXT NOT NULL, "slug" TEXT NOT NULL, "country" TEXT NOT NULL DEFAULT 'Kenya',
  "currency" VARCHAR(3) NOT NULL DEFAULT 'USD', "fiscalYearStart" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Profile" (
  "id" UUID NOT NULL, "email" TEXT NOT NULL, "fullName" TEXT, "role" "UserRole" NOT NULL DEFAULT 'MEMBER', "organizationId" UUID,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Project" (
  "id" UUID NOT NULL, "code" TEXT NOT NULL, "name" TEXT NOT NULL, "description" TEXT, "sector" TEXT NOT NULL, "location" TEXT NOT NULL,
  "status" "ProjectStatus" NOT NULL DEFAULT 'PLANNING', "budget" DECIMAL(18,2) NOT NULL DEFAULT 0, "startDate" DATE, "endDate" DATE,
  "clientId" UUID, "organizationId" UUID NOT NULL, "createdBy" UUID NOT NULL,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "FeasibilityStudy" (
  "id" UUID NOT NULL, "title" TEXT NOT NULL, "projectId" UUID NOT NULL, "status" "StudyStatus" NOT NULL DEFAULT 'DRAFT',
  "executiveSummary" TEXT NOT NULL, "marketScore" INTEGER, "technicalScore" INTEGER, "financialScore" INTEGER, "riskScore" INTEGER,
  "overallScore" INTEGER, "recommendation" TEXT, "organizationId" UUID NOT NULL, "createdBy" UUID NOT NULL,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "FeasibilityStudy_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "FinancialRecord" (
  "id" UUID NOT NULL, "type" "FinancialType" NOT NULL, "category" TEXT NOT NULL, "description" TEXT NOT NULL,
  "amount" DECIMAL(18,2) NOT NULL, "currency" VARCHAR(3) NOT NULL, "transactionDate" DATE NOT NULL, "projectId" UUID,
  "organizationId" UUID NOT NULL, "createdBy" UUID NOT NULL, "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL, CONSTRAINT "FinancialRecord_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Client" (
  "id" UUID NOT NULL, "name" TEXT NOT NULL, "contactName" TEXT NOT NULL, "email" TEXT NOT NULL, "phone" TEXT, "country" TEXT NOT NULL,
  "stage" "ClientStage" NOT NULL DEFAULT 'LEAD', "estimatedValue" DECIMAL(18,2) NOT NULL DEFAULT 0, "notes" TEXT,
  "organizationId" UUID NOT NULL, "createdBy" UUID NOT NULL, "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL, CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Supplier" (
  "id" UUID NOT NULL, "name" TEXT NOT NULL, "category" TEXT NOT NULL, "contactName" TEXT NOT NULL, "email" TEXT NOT NULL,
  "phone" TEXT, "country" TEXT NOT NULL, "status" "SupplierStatus" NOT NULL DEFAULT 'PROSPECT', "rating" INTEGER NOT NULL DEFAULT 0,
  "notes" TEXT, "organizationId" UUID NOT NULL, "createdBy" UUID NOT NULL,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Investor" (
  "id" UUID NOT NULL, "name" TEXT NOT NULL, "organizationName" TEXT, "email" TEXT NOT NULL, "phone" TEXT, "country" TEXT NOT NULL,
  "status" "InvestorStatus" NOT NULL DEFAULT 'PROSPECT', "investmentRange" TEXT NOT NULL, "focusAreas" TEXT NOT NULL,
  "lastContactedAt" DATE, "notes" TEXT, "organizationId" UUID NOT NULL, "createdBy" UUID NOT NULL,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "Investor_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Document" (
  "id" UUID NOT NULL, "title" TEXT NOT NULL, "category" TEXT NOT NULL, "storageBucket" TEXT NOT NULL, "storagePath" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL, "sizeBytes" INTEGER NOT NULL, "projectId" UUID, "organizationId" UUID NOT NULL, "uploadedBy" UUID NOT NULL,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "AuditLog" (
  "id" UUID NOT NULL, "action" TEXT NOT NULL, "resource" TEXT NOT NULL, "resourceId" UUID NOT NULL, "actorId" UUID NOT NULL,
  "metadata" JSONB, "organizationId" UUID NOT NULL, "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");
CREATE UNIQUE INDEX "Profile_email_key" ON "Profile"("email");
CREATE INDEX "Profile_organizationId_idx" ON "Profile"("organizationId");
CREATE INDEX "Project_organizationId_status_idx" ON "Project"("organizationId", "status");
CREATE INDEX "Project_clientId_idx" ON "Project"("clientId");
CREATE UNIQUE INDEX "Project_organizationId_code_key" ON "Project"("organizationId", "code");
CREATE INDEX "FeasibilityStudy_organizationId_status_idx" ON "FeasibilityStudy"("organizationId", "status");
CREATE INDEX "FeasibilityStudy_projectId_idx" ON "FeasibilityStudy"("projectId");
CREATE INDEX "FinancialRecord_organizationId_type_idx" ON "FinancialRecord"("organizationId", "type");
CREATE INDEX "FinancialRecord_projectId_idx" ON "FinancialRecord"("projectId");
CREATE INDEX "FinancialRecord_transactionDate_idx" ON "FinancialRecord"("transactionDate");
CREATE INDEX "Client_organizationId_stage_idx" ON "Client"("organizationId", "stage");
CREATE INDEX "Client_email_idx" ON "Client"("email");
CREATE INDEX "Supplier_organizationId_status_idx" ON "Supplier"("organizationId", "status");
CREATE INDEX "Investor_organizationId_status_idx" ON "Investor"("organizationId", "status");
CREATE UNIQUE INDEX "Document_storagePath_key" ON "Document"("storagePath");
CREATE INDEX "Document_organizationId_category_idx" ON "Document"("organizationId", "category");
CREATE INDEX "Document_projectId_idx" ON "Document"("projectId");
CREATE INDEX "AuditLog_organizationId_createdAt_idx" ON "AuditLog"("organizationId", "createdAt");
CREATE INDEX "AuditLog_resource_resourceId_idx" ON "AuditLog"("resource", "resourceId");

ALTER TABLE "Profile" ADD CONSTRAINT "Profile_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_id_auth_user_fkey" FOREIGN KEY ("id") REFERENCES auth.users("id") ON DELETE CASCADE;
ALTER TABLE "Project" ADD CONSTRAINT "Project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Project" ADD CONSTRAINT "Project_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FeasibilityStudy" ADD CONSTRAINT "FeasibilityStudy_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FeasibilityStudy" ADD CONSTRAINT "FeasibilityStudy_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FinancialRecord" ADD CONSTRAINT "FinancialRecord_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "FinancialRecord" ADD CONSTRAINT "FinancialRecord_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Client" ADD CONSTRAINT "Client_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Supplier" ADD CONSTRAINT "Supplier_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Investor" ADD CONSTRAINT "Investor_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Document" ADD CONSTRAINT "Document_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Document" ADD CONSTRAINT "Document_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Supabase Auth creates a profile for every newly provisioned user.
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  INSERT INTO public."Profile" ("id", "email", "fullName", "createdAt", "updatedAt")
  VALUES (NEW.id, COALESCE(NEW.email, ''), NEW.raw_user_meta_data ->> 'full_name', NOW(), NOW())
  ON CONFLICT ("id") DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_auth_user();

CREATE OR REPLACE FUNCTION public.current_organization_id()
RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT "organizationId" FROM public."Profile" WHERE "id" = auth.uid();
$$;
REVOKE ALL ON FUNCTION public.current_organization_id() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_organization_id() TO authenticated;

-- Defense in depth if the Supabase Data API remains enabled. Application writes use the server-side Prisma role.
ALTER TABLE "Organization" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Project" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FeasibilityStudy" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FinancialRecord" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Client" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Supplier" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Investor" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Document" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "organization_read" ON "Organization" FOR SELECT TO authenticated USING ("id" = public.current_organization_id());
CREATE POLICY "profile_read" ON "Profile" FOR SELECT TO authenticated USING ("id" = auth.uid() OR "organizationId" = public.current_organization_id());
CREATE POLICY "project_tenant_read" ON "Project" FOR SELECT TO authenticated USING ("organizationId" = public.current_organization_id());
CREATE POLICY "feasibility_tenant_read" ON "FeasibilityStudy" FOR SELECT TO authenticated USING ("organizationId" = public.current_organization_id());
CREATE POLICY "financial_tenant_read" ON "FinancialRecord" FOR SELECT TO authenticated USING ("organizationId" = public.current_organization_id());
CREATE POLICY "client_tenant_read" ON "Client" FOR SELECT TO authenticated USING ("organizationId" = public.current_organization_id());
CREATE POLICY "supplier_tenant_read" ON "Supplier" FOR SELECT TO authenticated USING ("organizationId" = public.current_organization_id());
CREATE POLICY "investor_tenant_read" ON "Investor" FOR SELECT TO authenticated USING ("organizationId" = public.current_organization_id());
CREATE POLICY "document_tenant_read" ON "Document" FOR SELECT TO authenticated USING ("organizationId" = public.current_organization_id());
CREATE POLICY "audit_tenant_read" ON "AuditLog" FOR SELECT TO authenticated USING ("organizationId" = public.current_organization_id());

-- Private project documents with organization-scoped object paths and strict upload limits.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('project-documents', 'project-documents', false, 10485760, ARRAY[
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/png', 'image/jpeg'
])
ON CONFLICT (id) DO UPDATE SET public = false, file_size_limit = EXCLUDED.file_size_limit, allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY "organization_document_read" ON storage.objects FOR SELECT TO authenticated USING (
  bucket_id = 'project-documents' AND (storage.foldername(name))[1] = public.current_organization_id()::text
);
CREATE POLICY "organization_document_insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'project-documents' AND (storage.foldername(name))[1] = public.current_organization_id()::text
);
CREATE POLICY "organization_document_update" ON storage.objects FOR UPDATE TO authenticated USING (
  bucket_id = 'project-documents' AND (storage.foldername(name))[1] = public.current_organization_id()::text
) WITH CHECK (
  bucket_id = 'project-documents' AND (storage.foldername(name))[1] = public.current_organization_id()::text
);
CREATE POLICY "organization_document_delete" ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'project-documents' AND (storage.foldername(name))[1] = public.current_organization_id()::text
);
