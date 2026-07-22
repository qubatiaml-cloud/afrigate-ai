import { NextResponse } from "next/server";
import { shipments } from "@/lib/data";

export async function GET() {
  return NextResponse.json({ data: shipments, meta: { total: shipments.length } });
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "A valid JSON object is required." }, { status: 400 });
  }
  const candidate = body as Record<string, unknown>;
  const required = ["customer", "cargo", "origin", "destination", "mode"];
  const missing = required.filter((key) => typeof candidate[key] !== "string" || !candidate[key]);
  if (missing.length > 0) {
    return NextResponse.json({ error: "Missing required fields.", fields: missing }, { status: 422 });
  }
  return NextResponse.json({
    data: {
      ...candidate,
      reference: `AFG-${Math.floor(10000 + Math.random() * 89999)}`,
      status: "Booking",
      progress: 0,
      createdAt: new Date().toISOString(),
    },
  }, { status: 201 });
}
