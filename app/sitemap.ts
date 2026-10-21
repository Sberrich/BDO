import type { MetadataRoute } from "next";
import { getInsightArticles, getVideos } from "@/lib/cms";
import { BRAND } from "@/lib/content";
import { listingPlaylists } from "@/lib/playlists";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages = [
    "",
    "/programme",
    "/admissions",
    "/intervenants",
    "/playlists",
    "/ressources",
    "/ressources/brochure",
    "/ressources/barometre",
    "/ressources/livre-blanc",
    "/faq",
    "/candidater",
    "/a-propos",
    "/mentions-legales",
    "/cgu",
    "/confidentialite",
  ];
  const [insights, videos] = await Promise.all([getInsightArticles(), getVideos()]);
  const playlists = listingPlaylists(videos);
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
    ...playlists.map((p) => ({
      url: `${BRAND.url}/playlists/${p.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.65,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...playlists.map((p) => ({
      url: `${BRAND.url}/playlists/${p.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
  ];
}
