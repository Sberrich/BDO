/**
 * Absolute URL on the public origin. Behind a reverse proxy `request.url` is the
 * internal address (http://localhost:3000), so prefer SITE_URL, then forwarded headers.
 */
export function publicUrl(path: string, request: Request) {
  const site = process.env.SITE_URL?.trim();
  if (site) return new URL(path, site);

  const h = request.headers;
  const host = h.get("x-forwarded-host")?.split(",")[0].trim() || h.get("host");
  if (host) {
    const proto =
      h.get("x-forwarded-proto")?.split(",")[0].trim() || new URL(request.url).protocol.replace(":", "");
    return new URL(path, `${proto}://${host}`);
  }
  return new URL(path, request.url);
}
