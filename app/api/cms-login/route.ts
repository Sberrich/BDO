import { NextRequest, NextResponse } from "next/server";
import {
  CMS_COOKIE,
  CMS_SESSION_SECONDS,
  cmsCredentials,
  createSession,
  publicUrl,
  safeEqual,
  safeNext,
} from "@/lib/cms-session";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const user = String(form.get("user") ?? "");
  const pass = String(form.get("password") ?? "");
  const next = safeNext(String(form.get("next") ?? ""));
  const creds = cmsCredentials();

  const ok = Boolean(creds.pass) && safeEqual(user, creds.user) && safeEqual(pass, creds.pass);
  if (!ok) {
    await new Promise((r) => setTimeout(r, 800));
    const url = publicUrl("/cms-login", request);
    url.searchParams.set("error", "1");
    url.searchParams.set("next", next);
    return NextResponse.redirect(url, 303);
  }

  const res = NextResponse.redirect(publicUrl(next, request), 303);
  res.cookies.set(CMS_COOKIE, await createSession(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CMS_SESSION_SECONDS,
  });
  return res;
}
