import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Paths to protect
  const studio = process.env.NEXT_PUBLIC_STUDIO_BASEPATH || "/studio";
  const admin  = process.env.ADMIN_PANEL_BASEPATH || "/owner-panel";

  // Never protect API or static assets
  if (pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname.startsWith("/favicon")) {
    return NextResponse.next();
  }

  // Only enforce basic auth on Studio and Owner Panel
  const needsAuth = pathname.startsWith(studio) || pathname.startsWith(admin);
  if (!needsAuth) return NextResponse.next();

  const user = process.env.ADMIN_USER || "";
  const pass = process.env.ADMIN_PASS || "";
  const authHeader = req.headers.get("authorization") || "";
  const expected = "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");

  if (authHeader !== expected) {
    return new NextResponse("Authentication required.", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Restricted"' },
    });
  }

  return NextResponse.next();
}

// Keep a broad matcher (env vars aren’t allowed in matcher), we filter inside.
export const config = { matcher: ["/:path*"] };