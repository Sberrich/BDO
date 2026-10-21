import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, djangoApiBase } from "@/lib/admin-session";

type Ctx = { params: Promise<{ path: string[] }> };

async function proxy(request: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ detail: "Authentication required.", code: 401, errors: {} }, { status: 401 });
  }

  const base = `${djangoApiBase()}/api/v1/${path.join("/")}/`;
  const url = new URL(base);
  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  const headers: Record<string, string> = {
    Authorization: `Token ${token}`,
    Accept: "application/json",
  };
  const method = request.method.toUpperCase();
  let body: string | undefined;
  if (method !== "GET" && method !== "HEAD" && method !== "DELETE") {
    body = await request.text();
    headers["Content-Type"] = request.headers.get("content-type") || "application/json";
  }

  const upstream = await fetch(url.toString(), { method, headers, body, cache: "no-store" });
  const text = await upstream.text();
  return new NextResponse(text || null, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("content-type") || "application/json",
    },
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
