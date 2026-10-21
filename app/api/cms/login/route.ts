import { NextResponse } from "next/server";
import { ADMIN_COOKIE, ADMIN_SESSION_SECONDS, djangoApiBase } from "@/lib/admin-session";

export async function POST(request: Request) {
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Requête invalide." }, { status: 400 });
  }

  const username = String(body.username || "").trim();
  const password = String(body.password || "");
  if (!username || !password) {
    return NextResponse.json({ ok: false, message: "Identifiant et mot de passe requis." }, { status: 400 });
  }

  const res = await fetch(`${djangoApiBase()}/api/v1/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return NextResponse.json(
      { ok: false, message: data.detail || "Identifiants invalides." },
      { status: res.status },
    );
  }

  const response = NextResponse.json({ ok: true, user: data.user });
  response.cookies.set(ADMIN_COOKIE, data.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_SECONDS,
  });
  return response;
}
