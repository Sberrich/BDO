export const CMS_COOKIE = "cms_session";
export const CMS_SESSION_SECONDS = 60 * 60 * 8;

export function cmsCredentials() {
  return {
    user: process.env.KEYSTATIC_USER || "admin",
    pass: process.env.KEYSTATIC_PASSWORD || "",
  };
}

function secret() {
  return process.env.KEYSTATIC_SECRET || `cms:${cmsCredentials().pass}`;
}

async function hmac(value: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(value));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

export function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSession(user: string) {
  const exp = Math.floor(Date.now() / 1000) + CMS_SESSION_SECONDS;
  const payload = `${encodeURIComponent(user)}.${exp}`;
  return `${payload}.${await hmac(payload)}`;
}

export async function verifySession(token: string | undefined) {
  if (!token) return false;
  const i = token.lastIndexOf(".");
  if (i < 0) return false;
  const payload = token.slice(0, i);
  const sig = token.slice(i + 1);
  const exp = Number(payload.split(".")[1]);
  if (!Number.isFinite(exp) || exp < Date.now() / 1000) return false;
  return safeEqual(sig, await hmac(payload));
}

/** Only allow redirects back into the CMS. */
export function safeNext(next: string | null | undefined) {
  return next && next.startsWith("/keystatic") && !next.startsWith("//") ? next : "/keystatic";
}
