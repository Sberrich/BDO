import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, djangoApiBase } from "@/lib/admin-session";

export async function POST() {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (token) {
    await fetch(`${djangoApiBase()}/api/v1/auth/logout/`, {
      method: "POST",
      headers: { Authorization: `Token ${token}`, Accept: "application/json" },
    }).catch(() => null);
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
