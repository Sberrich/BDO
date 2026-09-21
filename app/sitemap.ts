import type { MetadataRoute } from "next";
import { getInsightArticles } from "@/lib/cms";
import { BRAND } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
  const insights = await getInsightArticles();
  return [
    ...pages.map((p) => ({
      url: `${BRAND.url}${p || "/"}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.7,
    })),
    ...insights.map((a) => ({
      url: `${BRAND.url}/insights/${a.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
