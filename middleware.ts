import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin-session";

/**
 * Protect /admin (except login). Legacy Keystatic URLs redirect into this admin.
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/keystatic") || pathname.startsWith("/cms-login") || pathname.startsWith("/api/keystatic")) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname + search);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/keystatic",
    "/keystatic/:path*",
    "/api/keystatic/:path*",
    "/cms-login",
    "/cms-login/:path*",
  ],
};
