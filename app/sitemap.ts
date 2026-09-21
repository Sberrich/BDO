import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = [
    "",
    "/programme",
    "/admissions",
    "/intervenants",
    "/insights",
    "/ressources",
    "/ressources/brochure",
    "/ressources/barometre",
    "/ressources/livre-blanc",
    "/faq",
    "/candidater",
    "/a-propos",
    "/confidentialite",
  ];
  const insightSlugs = [
    "ecart-feuille-de-route",
    "fonction-financiere-augmentee",
    "ce-que-produit-un-seminaire",
    "pourquoi-un-jury",
  ];
  return [
    ...pages.map((p) => ({
      url: `${BRAND.url}${p || "/"}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.7,
    })),
    ...insightSlugs.map((slug) => ({
      url: `${BRAND.url}/insights/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
