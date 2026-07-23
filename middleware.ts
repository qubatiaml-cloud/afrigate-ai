import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const publicPaths = ["/", "/login", "/auth/callback", "/api/health", "/api/inquiries"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublic = publicPaths.some((publicPath) => path === publicPath || path.startsWith(`${publicPath}/`));

  try {
    const { response, user } = await updateSession(request);

    if (!user && !isPublic) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", `${path}${request.nextUrl.search}`);
      return NextResponse.redirect(url);
    }

    if (user && path === "/login") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return response;
  } catch {
    if (!isPublic) {
      const url = new URL("/login", request.url);
      url.searchParams.set("error", "Supabase is not configured.");
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
