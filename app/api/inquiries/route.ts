import { createHash, randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const inquirySchema = z
  .object({
    requestType: z.enum(["QUOTE", "CONSULTATION"]),
    language: z.enum(["ar", "en"]),
    sector: z.enum(["investment", "industry", "trade", "logistics"]),
    volume: z.string().trim().min(2).max(200),
    fullName: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
    phone: z.string().trim().max(40).optional(),
    company: z.string().trim().max(150).optional(),
    origin: z.string().trim().max(80).optional(),
    destination: z.string().trim().max(80).optional(),
    transportMode: z.enum(["sea", "air", "road"]).optional(),
    message: z.string().trim().max(2000).optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.requestType === "QUOTE" && (!value.origin || !value.destination || !value.transportMode)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Route details are required for quotation requests.",
        path: ["origin"],
      });
    }
  });

type RateEntry = { count: number; resetAt: number };
const globalRateLimit = globalThis as typeof globalThis & {
  inquiryRateLimit?: Map<string, RateEntry>;
};
const rateLimit = globalRateLimit.inquiryRateLimit ?? new Map<string, RateEntry>();
if (process.env.NODE_ENV !== "production") globalRateLimit.inquiryRateLimit = rateLimit;

function clientAddress(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function checkRateLimit(key: string) {
  const now = Date.now();
  const current = rateLimit.get(key);
  if (!current || current.resetAt <= now) {
    rateLimit.set(key, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return true;
  }
  if (current.count >= 5) return false;
  current.count += 1;
  return true;
}

function makeReference() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const token = randomBytes(3).toString("hex").toUpperCase();
  return `AG-${date}-${token}`;
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: "Origin not allowed." }, { status: 403 });
  }

  const contentType = request.headers.get("content-type") || "";
  const contentLength = Number(request.headers.get("content-length") || "0");
  if (!contentType.includes("application/json") || contentLength > 20_000) {
    return NextResponse.json({ error: "Invalid request format." }, { status: 415 });
  }

  const address = clientAddress(request);
  const salt = process.env.INQUIRY_HASH_SALT || "afrigate-public-inquiries";
  const ipHash = createHash("sha256").update(`${salt}:${address}`).digest("hex");
  if (!checkRateLimit(ipHash)) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = inquirySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid inquiry data.", fields: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const data = parsed.data;
  try {
    const inquiry = await prisma.publicInquiry.create({
      data: {
        reference: makeReference(),
        type: data.requestType,
        language: data.language,
        sector: data.sector,
        volume: data.volume,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        origin: data.origin || null,
        destination: data.destination || null,
        transportMode: data.transportMode || null,
        message: data.message || null,
        ipHash,
        userAgent: request.headers.get("user-agent")?.slice(0, 300) || null,
      },
      select: { reference: true },
    });

    return NextResponse.json({ reference: inquiry.reference }, { status: 201 });
  } catch (error) {
    console.error("Unable to create public inquiry", error);
    return NextResponse.json({ error: "Inquiry service is unavailable." }, { status: 503 });
  }
}
