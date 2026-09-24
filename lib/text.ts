export function plain(value: unknown) {
  return String(value ?? "")
    .replace(/\{\{\/?PROV\}\}/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function rich(value: unknown) {
  return String(value ?? "")
    .replace(/\{\{PROV\}\}/g, "")
    .replace(/\{\{\/PROV\}\}/g, "");
}

export function appHref(href: string) {
  if (/^(https?:|mailto:|tel:|#)/.test(href)) return href;
  const [path, hash] = href.split("#");
  let p = path.replace(/\.html$/, "");
  if (!p.startsWith("/")) p = `/${p}`;
  if (p === "/index") p = "/";
  return hash ? `${p}#${hash}` : p;
}

export function seminarImage(numero: number) {
  /** Prefer curated campus / professional stills over stock tech art. */
  const map: Record<number, string> = {
    0: "/images/seminaires/0.png",
    1: "/images/seminaires/1.png",
    2: "/images/seminaires/2.png",
    3: "/images/seminaires/3.png",
    4: "/images/seminaires/4.png",
    5: "/images/seminaires/5.png",
    6: "/images/seminaires/6.png",
    7: "/images/seminaires/7.png",
    8: "/images/seminaires/8.png",
  };
  return map[numero] ?? "/images/home/iscae-entrance.png";
}

/** Looping hero-card clip per séance — files in `/public/videos/seminaires/{n}.mp4`. */
export function seminarVideo(numero: number) {
  const n = Number.isFinite(numero) ? Math.max(0, Math.min(8, Math.trunc(numero))) : 0;
  return `/videos/seminaires/${n}.mp4`;
}

/**
 * Optional custom hero BG — unused for now (heroes stay solid BDO navy).
 * Drop files at `/public/images/seminaires/{n}.png` for card covers instead.
 */
export function seminarHeroBg(numero: number) {
  return seminarImage(numero);
}

export function seminarPath(s: { numero: number; slug?: string }) {
  return s.numero === 0 ? "/seminaires/conference-inaugurale" : `/seminaires/${s.numero}`;
}

/** LinkedIn profile URL, or empty if missing / placeholder homepage only. */
export function personLinkedIn(url?: string) {
  const href = plain(url);
  if (!href) return "";
  if (/^https?:\/\/([a-z]+\.)?linkedin\.com\/?$/i.test(href)) return "";
  if (!/^https?:\/\/([a-z]+\.)?linkedin\.com\//i.test(href)) return "";
  return href;
}

export function personPhoto(photo?: string, slug?: string) {
  if (photo?.startsWith("/")) return photo;
  if (slug === "zakaria-fahim" || photo?.toLowerCase().includes("zakaria") || photo?.toLowerCase().includes("fahim")) {
    return "/images/people/zakaria-fahim.jpg";
  }
  if (slug === "ismail-lahsini" || photo?.toLowerCase().includes("lahsini") || photo?.toLowerCase().includes("lahssini")) {
    return "/images/people/ismail-lahsini.jpeg";
  }
  if (slug === "antonio-gomes" || photo?.includes("antonio-gomes")) {
    return "/images/people/antonio-gomes.jpg";
  }
  if (slug === "hanaa-elmardi" || photo?.includes("hanaa")) {
    return "/images/people/hanaa-elmardi.jpg";
  }
  if (slug === "abdeljaouad-benhaddou" || photo?.includes("benhaddou")) {
    return "/images/people/abdeljaouad-benhaddou.png";
  }
  if (slug === "saad-belfakir" || photo?.includes("saad-belfakir")) {
    return "/images/people/saad-belfakir.jpg";
  }
  return "/images/people/portrait.svg";
}
