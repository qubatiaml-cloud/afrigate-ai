-- CreateEnum
CREATE TYPE "InquiryType" AS ENUM ('QUOTE', 'CONSULTATION');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'CLOSED', 'SPAM');

-- CreateTable
CREATE TABLE "PublicInquiry" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "reference" VARCHAR(32) NOT NULL,
    "type" "InquiryType" NOT NULL,
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "language" VARCHAR(2) NOT NULL DEFAULT 'ar',
    "sector" TEXT NOT NULL,
    "volume" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "origin" TEXT,
    "destination" TEXT,
    "transportMode" TEXT,
    "message" TEXT,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublicInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PublicInquiry_reference_key" ON "PublicInquiry"("reference");

-- CreateIndex
CREATE INDEX "PublicInquiry_status_createdAt_idx" ON "PublicInquiry"("status", "createdAt");

-- CreateIndex
CREATE INDEX "PublicInquiry_email_idx" ON "PublicInquiry"("email");

-- Keep public submissions behind the server API. No browser policy is intentionally created.
ALTER TABLE "PublicInquiry" ENABLE ROW LEVEL SECURITY;
