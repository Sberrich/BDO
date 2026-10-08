import { NextRequest, NextResponse } from "next/server";
import { CMS_COOKIE, cmsCredentials, verifySession } from "@/lib/cms-session";

export async function middleware(request: NextRequest) {
  if (!cmsCredentials().pass) {
    if (process.env.NODE_ENV === "production") {
      return new NextResponse("CMS password not configured.", { status: 503 });
    }
    return NextResponse.next();
  }

  if (await verifySession(request.cookies.get(CMS_COOKIE)?.value)) {
    return NextResponse.next();
  }

  const { pathname, search } = request.nextUrl;
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const url = request.nextUrl.clone();
  url.pathname = "/cms-login";
  url.search = `?next=${encodeURIComponent(pathname + search)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/keystatic", "/keystatic/:path*", "/api/keystatic/:path*"],
};
