import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "/programme", "/admissions", "/intervenants", "/ressources", "/faq", "/candidater", "/a-propos", "/confidentialite"];
  return pages.map((p) => ({
    url: `${BRAND.url}${p || "/"}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.7,
  }));
}
