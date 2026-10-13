import type { Intervenant } from "@/lib/cms";
import { personPhoto } from "@/lib/text";

export type FacultyShowcasePerson = {
  slug: string;
  nom: string;
  fonction: string;
  institution: string;
  photo?: string;
  linkedin?: string;
  bio?: string;
  initials: string;
  tone: "navy" | "blue" | "red" | "slate";
};

function initialsOf(nom: string) {
  return nom
    .split(/\s+/)
    .filter((w) => /^\p{Lu}/u.test(w))
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
}

/** Speakers come from the CMS (Keystatic > Intervenants), already sorted by « Ordre d’affichage ». */
export function facultyShowcase(cms: Intervenant[]): FacultyShowcasePerson[] {
  return cms.map((p) => ({
    slug: p.slug,
    nom: p.nom,
    fonction: p.fonction,
    institution: p.institution,
    photo: p.photo || undefined,
    linkedin: p.linkedin || undefined,
    bio: p.bio || undefined,
    initials: p.initials || initialsOf(p.nom),
    tone: p.tone,
  }));
}

export function facultyHome(cms: Intervenant[]): FacultyShowcasePerson[] {
  return facultyShowcase(cms.filter((p) => p.accueil));
}

export function facultyPhotoSrc(p: FacultyShowcasePerson) {
  if (p.photo?.startsWith("/")) return p.photo;
  return personPhoto(p.photo, p.slug);
}

export function facultyHasPhoto(p: FacultyShowcasePerson) {
  const src = facultyPhotoSrc(p);
  return Boolean(src) && !src.includes("portrait.svg");
}
