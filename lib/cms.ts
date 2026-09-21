import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../keystatic.config";

export const reader = createReader(process.cwd(), keystaticConfig);

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

function relatedDoc(v: string | null | undefined): InsightArticle["relatedDoc"] {
  if (v === "barometre" || v === "livreblanc" || v === "brochure") return v;
  return "brochure";
}

function categoryOf(v: string | null | undefined): InsightArticle["category"] {
  if (v === "Baromètre" || v === "Livre blanc" || v === "Méthode" || v === "Pédagogie") return v;
  return "Méthode";
}

/** Keystatic slug fields may be `{ name, slug }` or a plain string in seeded YAML. */
function slugName(value: unknown, fallback: string): string {
  if (typeof value === "string" && value.trim()) return value;
  if (value && typeof value === "object" && "name" in value) {
    const name = (value as { name?: unknown }).name;
    if (typeof name === "string" && name.trim()) return name;
  }
  return fallback;
}

export async function getInsightsPage() {
  const page = await reader.singletons.insightsPage.read();
  return {
    chapeau:
      page?.chapeau ||
      "Analyses et lectures sur la transformation de la fonction finance.",
  };
}

export async function getInsightArticles(): Promise<InsightArticle[]> {
  const entries = await reader.collections.insights.all();
  return entries.map(({ slug, entry }) => ({
    slug,
    titre: slugName(entry.titre, slug),
    category: categoryOf(entry.category),
    kicker: entry.kicker || "",
    date: entry.date || "",
    dateLabel: entry.dateLabel || entry.date || "",
    lecture: entry.lecture || "5 min",
    resume: entry.resume || "",
    corps: (entry.corps || []).filter(Boolean),
    source: entry.source || "",
    relatedDoc: relatedDoc(entry.relatedDoc),
  }));
}

export async function getInsightBySlug(slug: string) {
  const articles = await getInsightArticles();
  return articles.find((a) => a.slug === slug);
}

export async function getIntervenantsPage() {
  const page = await reader.singletons.intervenantsPage.read();
  return {
    chapeau:
      page?.chapeau ||
      "Les séminaires sont animés par des associés de BDO Maroc, des professeurs du Groupe ISCAE et des praticiens invités.",
  };
}

export async function getIntervenants(): Promise<Intervenant[]> {
  const entries = await reader.collections.intervenants.all();
  return entries.map(({ slug, entry }) => ({
    slug,
    nom: slugName(entry.nom, slug),
    fonction: entry.fonction || "",
    institution: entry.institution || "",
    photo: entry.photo || "",
    bio: entry.bio || "",
    linkedin: entry.linkedin || "",
    seminaires: (entry.seminaires || []).filter((n): n is number => typeof n === "number"),
  }));
}
