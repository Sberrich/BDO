export type Option = { value: string; label: string };

export const SECTEURS: Option[] = [
  { value: "secteur-public", label: "Fonction publique & Administration" },
  { value: "btp-immobilier", label: "BTP & Immobilier" },
  { value: "energie-environnement", label: "Énergie & Environnement" },
  { value: "finance-comptabilite", label: "Finance & Comptabilité" },
  { value: "audit-conseil", label: "Audit & Conseil" },
  { value: "technologie-informatique", label: "Technologie & Informatique" },
  { value: "autre", label: "Autre" },
];

export const NIVEAUX: Option[] = [
  { value: "dg", label: "Directeur Général" },
  { value: "administrateur-finance", label: "Administrateur en charge de la finance" },
  { value: "daf", label: "Directeur Administratif et Financier" },
  { value: "directeur-central", label: "Directeur central et contrôleur de gestion" },
  { value: "autre", label: "Autre" },
];

export const PARTICIPATIONS: Option[] = [
  { value: "individuelle", label: "Participation Individuelle" },
  { value: "entreprise", label: "Participation Entreprise" },
];

export const DECOUVERTES: Option[] = [
  { value: "site-iscae-bdo", label: "Sur le site web de l’ISCAE ou de BDO" },
  { value: "reseaux-sociaux", label: "Via les réseaux sociaux (LinkedIn, Facebook, Instagram…)" },
  { value: "email-newsletter", label: "Par un e-mail ou une newsletter" },
  { value: "entourage", label: "Par un(e) ami(e) ou un(e) collègue" },
  { value: "recommandation", label: "Recommandation d’un enseignant ou d’un professionnel" },
  { value: "autre", label: "Autre" },
];

/** Select fields whose "autre" choice requires the `<name>_autre` text field. */
export const AUTRE_FIELDS = ["secteur", "niveau", "decouverte"] as const;

export function labelOf(options: Option[], value: string) {
  return options.find((o) => o.value === value)?.label ?? value;
}

export type UploadRule = {
  field: "cv" | "photo";
  label: string;
  required: boolean;
  maxBytes: number;
  accept: string;
  extensions: string[];
  hint: string;
};

const MB = 1024 * 1024;

export const UPLOADS: UploadRule[] = [
  {
    field: "photo",
    label: "Photo de profil",
    required: false,
    maxBytes: 5 * MB,
    accept: ".jpg,.jpeg,.png,image/jpeg,image/png",
    extensions: ["jpg", "jpeg", "png"],
    hint: "JPG ou PNG, 5 Mo maximum",
  },
  {
    field: "cv",
    label: "CV",
    required: true,
    maxBytes: 5 * MB,
    accept: ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    extensions: ["pdf", "doc", "docx"],
    hint: "PDF, DOC ou DOCX, 5 Mo maximum",
  },
];

/** Upper bound for a whole candidature request (fields + both files). */
export const MAX_REQUEST_BYTES = 12 * MB;

export function extensionOf(name: string) {
  const m = /\.([a-z0-9]+)$/i.exec(name);
  return m ? m[1].toLowerCase() : "";
}

/** Client-side check; the server re-checks size, extension and file signature. */
export function checkUpload(rule: UploadRule, file: { name: string; size: number }): string {
  if (!rule.extensions.includes(extensionOf(file.name))) {
    return `Format non accepté : ${rule.hint}.`;
  }
  if (file.size > rule.maxBytes) {
    return `Fichier trop volumineux (${rule.hint}).`;
  }
  if (file.size === 0) return "Le fichier est vide.";
  return "";
}

const SIGNATURES: Record<string, number[][]> = {
  pdf: [[0x25, 0x50, 0x44, 0x46]],
  doc: [[0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]],
  docx: [[0x50, 0x4b, 0x03, 0x04]],
  jpg: [[0xff, 0xd8, 0xff]],
  jpeg: [[0xff, 0xd8, 0xff]],
  png: [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
};

export function matchesSignature(ext: string, bytes: Uint8Array) {
  const sigs = SIGNATURES[ext];
  if (!sigs) return false;
  return sigs.some((sig) => sig.every((b, i) => bytes[i] === b));
}

export function safeFilename(name: string, fallback: string) {
  const ext = extensionOf(name);
  const base = name
    .replace(/\.[^.]*$/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${base || fallback}.${ext}`;
}
