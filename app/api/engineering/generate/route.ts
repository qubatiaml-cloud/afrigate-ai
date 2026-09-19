import { NextResponse } from "next/server";
import { getApiContext } from "@/lib/auth";
import { rejectCrossOrigin } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const originError = rejectCrossOrigin(request);
  if (originError) return originError;
  const context = await getApiContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.DEEPSEEK_API_KEY) return NextResponse.json({ error: "AI generation is not configured. Add DEEPSEEK_API_KEY in Vercel." }, { status: 503 });

  const body = await request.json().catch(() => null) as { prompt?: unknown; sources?: unknown } | null;
  const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
  if (prompt.length < 3 || prompt.length > 12000) return NextResponse.json({ error: "Enter a prompt between 3 and 12000 characters." }, { status: 422 });
  const sources = Array.isArray(body?.sources) ? body.sources.slice(0, 10) : [];
  const sourceText = sources.map((source) => typeof source === "object" && source && "title" in source && "url" in source ? `${String(source.title)} — ${String(source.url)}` : "").filter(Boolean).join("\n");

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}` },
    body: JSON.stringify({ model: process.env.DEEPSEEK_MODEL || "deepseek-chat", temperature: 0.2, messages: [
      { role: "system", content: "You are an engineering-office assistant. Produce structured, cautious outputs for tenders, BOQ, schedules, HSE and QA/QC. Cite supplied sources. Clearly mark assumptions and require licensed professional review for designs and safety-critical decisions." },
      { role: "user", content: `${prompt}\n\nResearch sources:\n${sourceText || "No sources supplied."}` },
    ] }),
    cache: "no-store",
  });
  if (!response.ok) return NextResponse.json({ error: "The AI provider returned an error." }, { status: 502 });
  const result = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  return NextResponse.json({ answer: result.choices?.[0]?.message?.content ?? "No answer returned." });
}
