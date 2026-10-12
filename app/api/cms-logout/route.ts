import { NextRequest, NextResponse } from "next/server";
import { CMS_COOKIE, publicUrl } from "@/lib/cms-session";

function logout(request: NextRequest) {
  const res = NextResponse.redirect(publicUrl("/cms-login?out=1", request), 303);
  res.cookies.set(CMS_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}

export const GET = logout;
export const POST = logout;
