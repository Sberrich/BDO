/**
 * Site content — sourced from the Django CMS API (`/api/v1/`).
 * Falls back to local `content/*.yaml` when the API is unreachable (local build/dev).
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { PlaylistVideo } from "@/lib/playlists";

export const INSIGHT_CATEGORIES = [
  "Tout",
  "Baromètre",
  "Livre blanc",
  "Méthode",
  "Pédagogie",
] as const;

export type InsightCategory = (typeof INSIGHT_CATEGORIES)[number];

export type InsightArticle = {
  slug: string;
  titre: string;
  category: Exclude<InsightCategory, "Tout">;
  kicker: string;
  date: string;
  dateLabel: string;
  lecture: string;
  resume: string;
  corps: string[];
  source: string;
  relatedDoc: "brochure" | "barometre" | "livreblanc";
};

export type Intervenant = {
  slug: string;
  nom: string;
  fonction: string;
  institution: string;
  photo: string;
  bio: string;
  linkedin: string;
  seminaires: number[];
};

const API = (process.env.DJANGO_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

function relatedDoc(v: string | null | undefined): InsightArticle["relatedDoc"] {
  if (v === "barometre" || v === "livreblanc" || v === "brochure") return v;
  return "brochure";
}

function categoryOf(v: string | null | undefined): InsightArticle["category"] {
  if (v === "Baromètre" || v === "Livre blanc" || v === "Méthode" || v === "Pédagogie") return v;
  return "Méthode";
}

async function apiGet<T>(pathname: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}${pathname}`, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

type Paginated<T> = { results: T[]; count: number };

/** Minimal YAML subset reader for local fallback (no Keystatic). */
function parseSimpleYaml(raw: string): Record<string, unknown> {
  // Prefer JSON-compatible documents; for complex YAML use the API.
  try {
    // Very small subset: key: value, multiline via >- blocks already flattened in our files often.
    const out: Record<string, unknown> = {};
    const lines = raw.split("\n");
    let i = 0;
    let listKey: string | null = null;
    const list: string[] = [];
    const flushList = () => {
      if (listKey) {
        out[listKey] = [...list];
        list.length = 0;
        listKey = null;
      }
    };
    while (i < lines.length) {
      const line = lines[i];
      if (!line.trim() || line.trim().startsWith("#")) {
        i++;
        continue;
      }
      const listItem = /^  - (.*)$/.exec(line) || /^- (.*)$/.exec(line);
      if (listItem && listKey) {
        let v = listItem[1];
        if (v === "|" || v === "|-" || v === ">" || v === ">-") {
          const parts: string[] = [];
          i++;
          while (i < lines.length && /^ {4}/.test(lines[i])) {
            parts.push(lines[i].replace(/^ {4}/, ""));
            i++;
          }
          list.push(parts.join("\n"));
          continue;
        }
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
          v = v.slice(1, -1);
        }
        list.push(v);
        i++;
        continue;
      }
      const m = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(line);
      if (!m) {
        i++;
        continue;
      }
      flushList();
      const key = m[1];
      let val = m[2];
      if (val === "" || val === "|" || val === "|-" || val === ">" || val === ">-") {
        // peek next for list or block
        if (i + 1 < lines.length && /^\s+- /.test(lines[i + 1])) {
          listKey = key;
          i++;
          continue;
        }
        const parts: string[] = [];
        i++;
        while (i < lines.length && (/^ {2}/.test(lines[i]) || lines[i].trim() === "")) {
          if (lines[i].trim()) parts.push(lines[i].replace(/^ {2}/, ""));
          i++;
        }
        out[key] = parts.join(" ").trim();
        continue;
      }
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      out[key] = val;
      i++;
    }
    flushList();
    return out;
  } catch {
    return {};
  }
}

async function readYamlDir(rel: string) {
  const dir = path.join(process.cwd(), "content", rel);
  const files = await readdir(dir).catch(() => [] as string[]);
  const out: { slug: string; data: Record<string, unknown> }[] = [];
  for (const file of files) {
    if (!file.endsWith(".yaml") && !file.endsWith(".yml")) continue;
    const raw = await readFile(path.join(dir, file), "utf8");
    out.push({ slug: file.replace(/\.ya?ml$/, ""), data: parseSimpleYaml(raw) });
  }
  return out;
}

async function readYamlFile(rel: string) {
  const raw = await readFile(path.join(process.cwd(), "content", rel), "utf8").catch(() => "");
  return raw ? parseSimpleYaml(raw) : {};
}

export async function getInsightsPage() {
  const fromApi = await apiGet<{ key: string; chapeau: string }>("/api/v1/page-intros/insights/");
  if (fromApi?.chapeau) return { chapeau: fromApi.chapeau };
  const page = await readYamlFile("insights-page.yaml");
  return {
    chapeau:
      String(page.chapeau || "") ||
      "Analyses et lectures sur la transformation de la fonction finance.",
  };
}

export async function getInsightArticles(): Promise<InsightArticle[]> {
  const page = await apiGet<Paginated<Record<string, unknown>>>("/api/v1/insights/?page_size=100");
  if (page?.results?.length) {
    return page.results.map((entry) => ({
      slug: String(entry.slug),
      titre: String(entry.titre || entry.slug),
      category: categoryOf(String(entry.category)),
      kicker: String(entry.kicker || ""),
      date: String(entry.date || ""),
      dateLabel: String(entry.dateLabel || entry.date || ""),
      lecture: String(entry.lecture || "5 min"),
      resume: String(entry.resume || ""),
      corps: Array.isArray(entry.corps) ? entry.corps.map(String) : [],
      source: String(entry.source || ""),
      relatedDoc: relatedDoc(String(entry.relatedDoc)),
    }));
  }
  const entries = await readYamlDir("insights");
  return entries.map(({ slug, data }) => ({
    slug,
    titre: String(data.titre || slug),
    category: categoryOf(String(data.category)),
    kicker: String(data.kicker || ""),
    date: String(data.date || ""),
    dateLabel: String(data.dateLabel || data.date || ""),
    lecture: String(data.lecture || "5 min"),
    resume: String(data.resume || ""),
    corps: Array.isArray(data.corps) ? data.corps.map(String) : [],
    source: String(data.source || ""),
    relatedDoc: relatedDoc(String(data.relatedDoc)),
  }));
}

export async function getInsightBySlug(slug: string) {
  const fromApi = await apiGet<Record<string, unknown>>(`/api/v1/insights/${encodeURIComponent(slug)}/`);
  if (fromApi?.slug) {
    return {
      slug: String(fromApi.slug),
      titre: String(fromApi.titre || slug),
      category: categoryOf(String(fromApi.category)),
      kicker: String(fromApi.kicker || ""),
      date: String(fromApi.date || ""),
      dateLabel: String(fromApi.dateLabel || fromApi.date || ""),
      lecture: String(fromApi.lecture || "5 min"),
      resume: String(fromApi.resume || ""),
      corps: Array.isArray(fromApi.corps) ? fromApi.corps.map(String) : [],
      source: String(fromApi.source || ""),
      relatedDoc: relatedDoc(String(fromApi.relatedDoc)),
    } satisfies InsightArticle;
  }
  const articles = await getInsightArticles();
  return articles.find((a) => a.slug === slug);
}

export async function getPlaylistsPage() {
  const fromApi = await apiGet<{ chapeau: string }>("/api/v1/page-intros/playlists/");
  if (fromApi?.chapeau) return { chapeau: fromApi.chapeau };
  const page = await readYamlFile("playlists-page.yaml");
  return {
    chapeau: String(page.chapeau || "") || "Toutes les vidéos du certificat CFO 4.0, réunies en playlists.",
  };
}

export async function getVideos(): Promise<PlaylistVideo[]> {
  const page = await apiGet<Paginated<Record<string, unknown>>>("/api/v1/videos/?page_size=100");
  if (page?.results?.length) {
    return page.results
      .filter((e) => e.fichier)
      .map((entry) => ({
        id: String(entry.slug),
        titre: String(entry.titre || entry.slug),
        playlist: String(entry.playlist || "Témoignages").trim() || "Témoignages",
        ordre: Number(entry.ordre ?? 1),
        sousTitre: entry.sousTitre ? String(entry.sousTitre) : undefined,
        tag: entry.etiquette ? String(entry.etiquette) : undefined,
        video: String(entry.fichier),
        poster: String(entry.poster || "/images/home/iscae-entrance.png"),
        duree: entry.duree ? String(entry.duree) : undefined,
        langue: String(entry.langue || "FR"),
        date: entry.date ? String(entry.date) : undefined,
        resume: entry.resume ? String(entry.resume) : undefined,
      }));
  }
  const entries = await readYamlDir("videos");
  return entries
    .filter(({ data }) => data.fichier)
    .map(({ slug, data }) => ({
      id: slug,
      titre: String(data.titre || slug),
      playlist: String(data.playlist || "Témoignages").trim() || "Témoignages",
      ordre: Number(data.ordre ?? 1),
      sousTitre: data.sousTitre ? String(data.sousTitre) : undefined,
      tag: data.etiquette ? String(data.etiquette) : undefined,
      video: String(data.fichier),
      poster: String(data.poster || "/images/home/iscae-entrance.png"),
      duree: data.duree ? String(data.duree) : undefined,
      langue: String(data.langue || "FR"),
      date: data.date ? String(data.date) : undefined,
      resume: data.resume ? String(data.resume) : undefined,
    }));
}

export async function getIntervenantsPage() {
  const fromApi = await apiGet<{ chapeau: string }>("/api/v1/page-intros/intervenants/");
  if (fromApi?.chapeau) return { chapeau: fromApi.chapeau };
  const page = await readYamlFile("intervenants-page.yaml");
  return {
    chapeau:
      String(page.chapeau || "") ||
      "Associés de BDO Maroc, professeurs du Groupe ISCAE et praticiens invités : chacun enseigne sur son terrain.",
  };
}

export async function getIntervenants(): Promise<Intervenant[]> {
  const page = await apiGet<Paginated<Record<string, unknown>>>("/api/v1/speakers/?page_size=100");
  if (page?.results?.length) {
    return page.results.map((entry) => ({
      slug: String(entry.slug),
      nom: String(entry.nom || entry.slug),
      fonction: String(entry.fonction || ""),
      institution: String(entry.institution || ""),
      photo: String(entry.photo || ""),
      bio: String(entry.bio || ""),
      linkedin: String(entry.linkedin || ""),
      seminaires: Array.isArray(entry.seminaires)
        ? entry.seminaires.filter((n): n is number => typeof n === "number")
        : [],
    }));
  }
  const entries = await readYamlDir("intervenants");
  return entries.map(({ slug, data }) => ({
    slug,
    nom: String(data.nom || slug),
    fonction: String(data.fonction || ""),
    institution: String(data.institution || ""),
    photo: String(data.photo || ""),
    bio: String(data.bio || ""),
    linkedin: String(data.linkedin || ""),
    seminaires: Array.isArray(data.seminaires)
      ? data.seminaires.map(Number).filter((n) => !Number.isNaN(n))
      : [],
  }));
}

export type PressMedia = {
  nom: string;
  titre: string;
  description: string;
  lien: string;
  logo: string;
  domaine: string;
  apercu: string;
};

export type PartnerItem = {
  nom: string;
  role: string;
  logo: string;
  lien: string;
};

export type FaqQuestion = {
  id: string;
  q: string;
  court: string;
  r: string;
  lien: { texte: string; href: string } | null;
  accueil: boolean;
  hidesIfTarif?: boolean;
};

export type FaqGroupData = {
  id: string;
  titre: string;
  questions: FaqQuestion[];
};

/** Revue de presse — API first, null if unreachable (caller keeps static fallback). */
export async function getPressItems(): Promise<PressMedia[] | null> {
  const page = await apiGet<Paginated<Record<string, unknown>>>("/api/v1/press/?page_size=100");
  if (!page?.results?.length) return null;
  return page.results.map((e) => ({
    nom: String(e.nom || ""),
    titre: String(e.titre || ""),
    description: String(e.description || ""),
    lien: String(e.lien || ""),
    logo: String(e.logo || ""),
    domaine: String(e.domaine || ""),
    apercu: String(e.apercu || ""),
  }));
}

export async function getPartners(): Promise<PartnerItem[] | null> {
  const page = await apiGet<Paginated<Record<string, unknown>>>("/api/v1/partners/?page_size=100");
  if (!page?.results?.length) return null;
  return page.results.map((e) => ({
    nom: String(e.nom || ""),
    role: String(e.role || ""),
    logo: String(e.logo || ""),
    lien: String(e.lien || ""),
  }));
}

export async function getFaqGroups(): Promise<FaqGroupData[] | null> {
  const page = await apiGet<Paginated<Record<string, unknown>>>("/api/v1/faq/?page_size=50");
  if (!page?.results?.length) return null;
  return page.results.map((g) => ({
    id: String(g.id || g.slug || ""),
    titre: String(g.titre || ""),
    questions: Array.isArray(g.questions)
      ? g.questions.map((q) => {
          const row = q as Record<string, unknown>;
          const lien = row.lien as { texte?: string; href?: string } | null | undefined;
          return {
            id: String(row.id || ""),
            q: String(row.q || ""),
            court: String(row.court || ""),
            r: String(row.r || ""),
            lien: lien?.texte || lien?.href ? { texte: String(lien.texte || ""), href: String(lien.href || "") } : null,
            accueil: Boolean(row.accueil),
            hidesIfTarif: Boolean(row.hidesIfTarif),
          };
        })
      : [],
  }));
}

/** Apply SHOW.tarif visibility (mirrors lib/content.ts PRICE_FAQ behaviour). */
export function filterFaqByTarif(groups: FaqGroupData[], showTarif: boolean): FaqGroupData[] {
  if (showTarif) return groups;
  return groups.map((g) => {
    if (g.id !== "tarif") {
      return {
        ...g,
        questions: g.questions.filter((q) => !q.hidesIfTarif),
      };
    }
    return {
      ...g,
      titre: "Le financement",
      questions: g.questions.filter((q) => !q.hidesIfTarif),
    };
  });
}

export type ResourceItem = {
  key: string;
  titre: string;
  description: string;
  fichier: string;
  cover: string;
  href: string;
  icon: string;
  poids: string;
};

export async function getResources(): Promise<ResourceItem[] | null> {
  const page = await apiGet<Paginated<Record<string, unknown>>>("/api/v1/resources/?page_size=50");
  if (!page?.results?.length) return null;
  return page.results.map((e) => ({
    key: String(e.key || ""),
    titre: String(e.titre || ""),
    description: String(e.description || ""),
    fichier: String(e.fichier || ""),
    cover: String(e.cover || ""),
    href: String(e.href || ""),
    icon: String(e.icon || ""),
    poids: String(e.poids || ""),
  }));
}

export async function getSiteSettings(): Promise<Record<string, unknown> | null> {
  return apiGet<Record<string, unknown>>("/api/v1/settings/");
}

export async function getHomepageCms(): Promise<Record<string, unknown> | null> {
  return apiGet<Record<string, unknown>>("/api/v1/homepage/");
}
