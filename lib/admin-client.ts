/** Browser client for the Next → Django CMS proxy. */

export type Paginated<T> = { count: number; next: string | null; previous: string | null; results: T[] };

export async function adminFetch<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/cms/${path.replace(/^\//, "")}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
    cache: "no-store",
  });
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      typeof data.detail === "string"
        ? data.detail
        : data.message || `Erreur ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}

export type AdminStats = {
  total: number;
  week: number;
  candidature: number;
  document: number;
  session: number;
  rappel: number;
  new: number;
  videos: number;
  insights: number;
  speakers: number;
  seminars: number;
  press?: number;
  partners?: number;
  faq?: number;
  resources?: number;
};

export type Lead = {
  id: string;
  type: string;
  status: string;
  fields: Record<string, string>;
  notes: string;
  email: string;
  full_name: string;
  created_at: string;
  files: { id: number; field: string; label: string; original_name: string; size: number }[];
};

export type VideoRow = {
  slug: string;
  titre: string;
  playlist: string;
  ordre: number;
  sousTitre?: string;
  etiquette?: string;
  fichier: string;
  poster?: string;
  duree?: string;
  langue: string;
  date?: string | null;
  resume?: string;
  isPublished?: boolean;
};

export type InsightRow = {
  slug: string;
  titre: string;
  category: string;
  kicker?: string;
  date: string;
  dateLabel?: string;
  lecture?: string;
  resume: string;
  corps: string[];
  source?: string;
  relatedDoc: string;
  isPublished?: boolean;
};

export type SpeakerRow = {
  slug: string;
  nom: string;
  fonction: string;
  institution: string;
  photo: string;
  bio: string;
  linkedin: string;
  seminaires: number[];
  ordre: number;
  isPublished?: boolean;
};

export type PageIntro = { key: string; chapeau: string };

export type SeminarRow = {
  numero: number;
  slug: string;
  code?: string;
  titre: string;
  sousTitre?: string;
  objectif?: string;
  dates?: string;
  horaire?: string;
  heures?: number;
  lieu?: string;
  jour1?: { matin: string; apresMidi: string } | null;
  jour2?: { matin: string; apresMidi: string } | null;
  jour1Matin?: string;
  jour1ApresMidi?: string;
  jour2Matin?: string;
  jour2ApresMidi?: string;
  livrable?: string;
  actualisation?: string;
  intervenants?: string[];
  isPublished?: boolean;
};

export type PressRow = {
  id?: number;
  nom: string;
  titre: string;
  description?: string;
  lien: string;
  logo?: string;
  domaine?: string;
  apercu?: string;
  ordre: number;
  isPublished?: boolean;
};

export type PartnerRow = {
  id?: number;
  nom: string;
  role?: string;
  logo?: string;
  lien?: string;
  ordre: number;
  isPublished?: boolean;
};

export type ResourceRow = {
  key: string;
  titre: string;
  description?: string;
  fichier?: string;
  cover?: string;
  href?: string;
  icon?: string;
  poids?: string;
  ordre: number;
  isPublished?: boolean;
};

export type FaqQuestionRow = {
  id: string;
  q: string;
  court?: string;
  r: string;
  lien?: { texte: string; href: string } | null;
  accueil?: boolean;
  hidesIfTarif?: boolean;
  ordre?: number;
  isPublished?: boolean;
};

export type FaqGroupRow = {
  id: string;
  titre: string;
  ordre: number;
  isPublished?: boolean;
  questions: FaqQuestionRow[];
};

export type SiteSettingsRow = {
  nom: string;
  sousTitreOfficiel?: string;
  cosignature?: string;
  domaine?: string;
  baseUrl?: string;
  promesse?: { titre: string; sousTitre: string };
  contact?: {
    nom: string;
    fonction: string;
    email: string;
    telephone: string;
    linkedin: string;
    adresseIscae: string;
    lieuFormation: string;
  };
  seoTitleTemplate?: string;
  seoDescriptionDefault?: string;
  showFlags?: Record<string, boolean>;
  promesse_titre?: string;
  promesse_sous_titre?: string;
  contact_nom?: string;
  contact_fonction?: string;
  contact_email?: string;
  contact_telephone?: string;
  contact_linkedin?: string;
  adresse_iscae?: string;
  lieu_formation?: string;
};
