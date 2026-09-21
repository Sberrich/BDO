import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/inscription`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/confidentialite`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
