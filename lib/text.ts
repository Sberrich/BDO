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
  const map: Record<number, string> = {
    0: "/images/home/hero.png",
    1: "/images/team/team-1.png",
    2: "/images/team/team-2.png",
    3: "/images/team/team-3.png",
    4: "/images/team/team-4.png",
    5: "/images/team/team-5.png",
    6: "/images/team/team-6.png",
    7: "/images/team/team-7.png",
    8: "/images/team/team-8.png",
  };
  return map[numero] ?? "/images/home/about.png";
}

export function seminarPath(s: { numero: number; slug?: string }) {
  return s.numero === 0 ? "/seminaires/conference-inaugurale" : `/seminaires/${s.numero}`;
}

export function personPhoto(photo?: string, slug?: string) {
  if (slug === "zakaria-fahim" || photo?.toLowerCase().includes("zakaria") || photo?.toLowerCase().includes("fahim")) {
    return "/images/people/Zakaria-Fahim.jpeg";
  }
  if (slug === "ismail-lahsini" || photo?.toLowerCase().includes("lahsini") || photo?.toLowerCase().includes("lahssini")) {
    return "/images/people/ismail-lahsini.jpeg";
  }
  if (slug === "antonio-gomes" || photo?.includes("antonio-gomes")) {
    return "/images/people/antonio-gomes.jpg";
  }
  if (slug === "saad-belfakir" || photo?.includes("saad-belfakir")) {
    return "/images/people/saad-belfakir.jpg";
  }
  return "/images/people/portrait.svg";
}
