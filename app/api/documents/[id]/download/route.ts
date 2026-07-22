import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getApiContext } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const context = await getApiContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const document = await prisma.document.findFirst({ where: { id, organizationId: context.organizationId } });
  if (!document) return NextResponse.json({ error: "Document not found." }, { status: 404 });
  const supabase = await createClient(); const { data, error } = await supabase.storage.from(document.storageBucket).createSignedUrl(document.storagePath, 60, { download: true });
  if (error || !data) return NextResponse.json({ error: "A secure download link could not be created." }, { status: 502 });
  return NextResponse.redirect(new URL(data.signedUrl, request.url));
}
