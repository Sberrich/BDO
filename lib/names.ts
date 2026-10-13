/** Shared by the forms (browser) and /api/submit (server). */

export type NameKind = "prenom" | "nom";

export const NAME_MAX = 60;

const LABEL: Record<NameKind, string> = { prenom: "prénom", nom: "nom" };

/** Letters of any alphabet (with accents), joined by spaces, apostrophes, hyphens or dots. */
const NAME_RE = /^[\p{L}\p{M}]+(?:[ '’.-]+[\p{L}\p{M}]+)*\.?$/u;

export function cleanName(raw: string) {
  return raw.replace(/\s+/g, " ").trim();
}

/** Empty string when valid, otherwise the message to show. */
export function nameError(kind: NameKind, raw: string) {
  const v = cleanName(raw);
  const label = LABEL[kind];
  if (!v) return `Merci d’indiquer votre ${label}.`;
  if (v.length > NAME_MAX) return `Votre ${label} ne doit pas dépasser ${NAME_MAX} caractères.`;
  if (!NAME_RE.test(v)) {
    return "Lettres, espaces, apostrophes ou traits d’union uniquement.";
  }
  return "";
}

export function fullName(fields: Record<string, unknown>) {
  return cleanName(`${fields.prenom ?? ""} ${fields.nom ?? ""}`);
}
