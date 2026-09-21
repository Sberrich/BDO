import { NextRequest, NextResponse } from "next/server";

const USER = process.env.KEYSTATIC_USER || "admin";
const PASS = process.env.KEYSTATIC_PASSWORD || "";

export function middleware(request: NextRequest) {
  if (!PASS) {
    if (process.env.NODE_ENV === "production") {
      return new NextResponse("CMS password not configured.", { status: 503 });
    }
    return NextResponse.next();
  }

  const header = request.headers.get("authorization");
  if (header?.startsWith("Basic ")) {
    try {
      const decoded = atob(header.slice(6));
      const i = decoded.indexOf(":");
      const user = decoded.slice(0, i);
      const pass = decoded.slice(i + 1);
      if (user === USER && pass === PASS) {
        return NextResponse.next();
      }
    } catch {
      /* fall through to challenge */
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="CFO 4.0 CMS"',
      "Cache-Control": "no-store",
    },
  });
}

export const config = {
  matcher: ["/keystatic", "/keystatic/:path*", "/api/keystatic/:path*"],
};
