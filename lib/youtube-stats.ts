import { promises as fs } from "fs";
import path from "path";
import { youtubeIdFromSrc, type Playlist, type PlaylistVideo } from "@/lib/playlists";

const CACHE_FILE = path.join(process.cwd(), "data", "youtube-views-cache.json");
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

type CacheEntry = { views: number; at: number };
type CacheStore = Record<string, CacheEntry>;

async function readCache(): Promise<CacheStore> {
  try {
    const raw = await fs.readFile(CACHE_FILE, "utf8");
    const parsed = JSON.parse(raw) as CacheStore;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

async function writeCache(store: CacheStore) {
  try {
    await fs.mkdir(path.dirname(CACHE_FILE), { recursive: true });
    await fs.writeFile(CACHE_FILE, JSON.stringify(store, null, 2) + "\n", "utf8");
  } catch {
    /* ignore write failures in read-only envs */
  }
}

function isFresh(entry?: CacheEntry) {
  return Boolean(entry && Date.now() - entry.at < CACHE_TTL_MS);
}

async function fetchViaApi(ids: string[], key: string): Promise<Record<string, number>> {
  const out: Record<string, number> = {};
  for (let i = 0; i < ids.length; i += 50) {
    const chunk = ids.slice(i, i + 50);
    const url = new URL("https://www.googleapis.com/youtube/v3/videos");
    url.searchParams.set("part", "statistics");
    url.searchParams.set("id", chunk.join(","));
    url.searchParams.set("key", key);
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`YouTube API ${res.status}`);
    const data = (await res.json()) as {
      items?: { id?: string; statistics?: { viewCount?: string } }[];
    };
    for (const item of data.items ?? []) {
      if (!item.id) continue;
      out[item.id] = Number(item.statistics?.viewCount || 0) || 0;
    }
  }
  return out;
}

async function fetchViaWatchPage(id: string): Promise<number | null> {
  const res = await fetch(`https://www.youtube.com/watch?v=${id}`, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
    },
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  const html = await res.text();
  const m =
    html.match(/"viewCount":"(\d+)"/) ||
    html.match(/"viewCount"\s*:\s*"(\d+)"/) ||
    html.match(/\\"viewCount\\":\\"(\d+)\\"/);
  if (!m?.[1]) return null;
  return Number(m[1]) || 0;
}

/** View counts keyed by YouTube video id (cached). */
export async function getYouTubeViewCounts(ids: string[]): Promise<Record<string, number>> {
  const unique = [...new Set(ids.filter(Boolean))];
  if (!unique.length) return {};

  const cache = await readCache();
  const fresh: Record<string, number> = {};
  const missing: string[] = [];

  for (const id of unique) {
    if (isFresh(cache[id])) fresh[id] = cache[id].views;
    else missing.push(id);
  }

  if (!missing.length) return fresh;

  const key = process.env.YOUTUBE_API_KEY?.trim();
  let fetched: Record<string, number> = {};

  if (key) {
    try {
      fetched = await fetchViaApi(missing, key);
    } catch {
      fetched = {};
    }
  }

  const stillMissing = missing.filter((id) => fetched[id] == null);
  // Limit concurrency for watch-page fallback
  const queue = 4;
  for (let i = 0; i < stillMissing.length; i += queue) {
    const batch = stillMissing.slice(i, i + queue);
    const results = await Promise.all(
      batch.map(async (id) => {
        try {
          const n = await fetchViaWatchPage(id);
          return [id, n] as const;
        } catch {
          return [id, null] as const;
        }
      }),
    );
    for (const [id, n] of results) {
      if (n != null) fetched[id] = n;
    }
  }

  const now = Date.now();
  for (const [id, views] of Object.entries(fetched)) {
    fresh[id] = views;
    cache[id] = { views, at: now };
  }
  await writeCache(cache);
  return fresh;
}

/** Sum YouTube views for every video in a playlist. */
export async function getPlaylistYouTubeViews(
  playlists: readonly Playlist[],
): Promise<Record<string, number>> {
  const ids = playlists.flatMap((p) =>
    p.videos.map((v) => youtubeIdFromSrc(v.video)).filter((id): id is string => Boolean(id)),
  );
  const byVideo = await getYouTubeViewCounts(ids);
  const out: Record<string, number> = {};
  for (const p of playlists) {
    out[p.id] = p.videos.reduce((sum, v) => {
      const id = youtubeIdFromSrc(v.video);
      return sum + (id ? byVideo[id] ?? 0 : 0);
    }, 0);
  }
  return out;
}

export function videoYouTubeId(v: Pick<PlaylistVideo, "video">) {
  return youtubeIdFromSrc(v.video);
}
