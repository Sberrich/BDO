export const ADMIN_COOKIE = "cfo_admin_token";
export const ADMIN_SESSION_SECONDS = 60 * 60 * 12;

export function djangoApiBase() {
  return (process.env.DJANGO_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
}
