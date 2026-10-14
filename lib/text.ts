/** Keeps amounts and their units on one line: "1 200 DH HT", "24 000", "51 h", "80 %". */
export function nbsp(value: unknown) {
  return String(value ?? "")
    .replace(/(\d) (?=\d{3}\b)/g, "$1\u00a0")
    .replace(/(\d) (?=(DH|HT|h|%|Mo|min|s)\b)/g, "$1\u00a0")
    .replace(/DH HT/g, "DH\u00a0HT");
}

export function plain(value: unknown) {
  return nbsp(
    String(value ?? "")
      .replace(/\{\{\/?PROV\}\}/g, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
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

/** Programme images from certificat.bdo-info.ma, keyed by seminar number (266 × 250 source files). */
const SEMINAR_IMAGE: Record<number, string> = {
  0: "/images/home/hero.png",
  1: "/images/programme/big-data.png",
  2: "/images/programme/intelligence-artificielle.png",
  3: "/images/programme/cloud.png",
  9: "/images/home/about.png",
  4: "/images/programme/cash-management-iot.png",
  5: "/images/programme/blockchain.png",
  7: "/images/programme/cybersecurite.png",
  8: "/images/programme/projets-transformation.png",
};

export function seminarImage(numero: number) {
  return SEMINAR_IMAGE[numero] ?? "/images/home/iscae-entrance.png";
}

type SessionRef = { numero: number; slug?: string; code?: string };

/**
 * `numero` is the stable id behind URLs and media; `code` overrides what is displayed
 * (Cybersécurité keeps numero 7 but shows as 06, the workshop shows as WS, the closing as CL).
 */
export function sessionCode(s: SessionRef) {
  if (s.numero === 0) return "IN";
  return s.code ?? String(s.numero).padStart(2, "0");
}

export function sessionLabel(s: SessionRef) {
  if (s.numero === 0) return "Conférence inaugurale";
  if (s.code === "WS") return "Workshop";
  if (s.code === "CL") return "Clôture du cycle";
  return `Séminaire ${sessionCode(s)}`;
}

export function seminarPath(s: SessionRef) {
  if (s.numero === 0) return "/seminaires/conference-inaugurale";
  return s.code === "WS" && s.slug ? `/seminaires/${s.slug}` : `/seminaires/${s.numero}`;
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
    return "/images/people/zakaria-fahim-grey.png";
  }
  if (slug === "ismail-lahsini" || photo?.toLowerCase().includes("lahsini") || photo?.toLowerCase().includes("lahssini")) {
    return "/images/people/ismail-lahsini-grey.png";
  }
  if (slug === "antonio-gomes" || photo?.includes("antonio-gomes")) {
    return "/images/people/antonio-gomes.jpg";
  }
  if (slug === "abdeljaouad-benhaddou" || photo?.includes("benhaddou")) {
    return "/images/people/abdeljaouad-benhaddou-grey.png";
  }
  if (slug === "saad-belfakir" || photo?.includes("saad-belfakir")) {
    return "/images/temoignages/saad-belfakir-cover.jpg";
  }
  return "/images/people/portrait.svg";
}
