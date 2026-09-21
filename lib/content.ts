import calendrier from "@/lib/payload/calendrier";
import faq from "@/lib/payload/faq";
import intervenants from "@/lib/payload/intervenants";
import seminaires from "@/lib/payload/seminaires";
import site from "@/lib/payload/site";
import { seminarPath } from "@/lib/text";

export const data = { site, seminaires, faq, calendrier, intervenants };

export const NAV = [
  { href: "/programme", label: "Le programme" },
  { href: "/admissions", label: "Admissions" },
  { href: "/intervenants", label: "Intervenants" },
  { href: "/ressources", label: "Ressources" },
  { href: "/faq", label: "FAQ" },
] as const;

const WA_TEXT = encodeURIComponent(
  "Bonjour, je souhaite des informations sur le certificat CFO 4.0 (ISCAE × BDO).",
);

export const BRAND = {
  url: "https://certificat.bdo-info.ma",
  email: "certificat@bdo-info.ma",
  phone: "+212 661 448 496",
  phoneHref: "tel:+212661448496",
  whatsapp: `https://wa.me/212661448496?text=${WA_TEXT}`,
  vimeoId: "899489038",
  brochure: "/docs/CFO-4-0-brochure.pdf",
  iscae: "https://www.groupeiscae.ma/",
  bdo: "https://bdo.ma/",
};

export type Seminaire = {
  numero: number;
  slug?: string;
  titre: string;
  sousTitre: string;
  dates: string;
  jours?: number;
  objectif: string;
  jour1?: { matin: string; apresMidi: string };
  jour2?: { matin: string; apresMidi: string };
  livrable?: string;
  actualisation?: string;
  intervenants?: readonly string[] | string[];
};

export function allSessions(): Seminaire[] {
  return [seminaires.inaugurale, ...seminaires.seminaires] as Seminaire[];
}

export function sessionBySlug(slug: string) {
  if (slug === "conference-inaugurale" || slug === "0") {
    return seminaires.inaugurale as Seminaire;
  }
  const n = Number(slug);
  return seminaires.seminaires.find((s) => s.numero === n || s.slug === slug) as
    | Seminaire
    | undefined;
}

export function sessionHref(s: Seminaire) {
  return seminarPath(s);
}

export type CalendarRow = {
  seance: string;
  dates: string;
  contenu: string;
  jours: number;
  lien?: string;
  pause?: boolean;
};
