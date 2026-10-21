/** Videos shown per playlist before « Voir plus ». */
export const PLAYLIST_PREVIEW = 3;

export type PlaylistVideo = {
  id: string;
  titre: string;
  playlist: string;
  ordre: number;
  sousTitre?: string;
  tag?: string;
  /** Local `/videos/….mp4` path or YouTube watch/embed URL. */
  video: string;
  poster: string;
  duree?: string;
  langue: string;
  date?: string;
  resume?: string;
};

/** Extract a YouTube video id from a URL, `youtube:ID`, or bare 11-char id. */
export function youtubeIdFromSrc(src?: string): string | null {
  if (!src) return null;
  const trimmed = src.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const prefixed = trimmed.match(/^youtube:([A-Za-z0-9_-]{11})$/i);
  if (prefixed) return prefixed[1];
  const m = trimmed.match(
    /(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  return m?.[1] ?? null;
}

export function isYouTubeVideo(v: Pick<PlaylistVideo, "video">) {
  return Boolean(youtubeIdFromSrc(v.video));
}

export function youtubeEmbedUrl(id: string, autoplay = false) {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });
  if (autoplay) params.set("autoplay", "1");
  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}

export function youtubePoster(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export type Playlist = {
  id: string;
  titre: string;
  videos: PlaylistVideo[];
};

export function playlistId(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** One playlist per distinct `playlist` name, videos in their `ordre`. */
export function groupPlaylists(videos: readonly PlaylistVideo[]): Playlist[] {
  const byName = new Map<string, PlaylistVideo[]>();
  for (const v of videos) {
    const list = byName.get(v.playlist) ?? [];
    list.push(v);
    byName.set(v.playlist, list);
  }
  return [...byName.entries()]
    .sort(([a], [b]) => a.localeCompare(b, "fr"))
    .map(([titre, list]) => ({
      id: playlistId(titre),
      titre,
      videos: [...list].sort((a, b) => a.ordre - b.ordre || a.titre.localeCompare(b.titre, "fr")),
    }));
}

/** Seconds from « 1 min 03 », « 2 min » or « 15 s ». */
export function durationSeconds(duree?: string) {
  if (!duree) return 0;
  const n = (duree.match(/\d+/g) ?? []).map(Number);
  if (/min/.test(duree)) return (n[0] ?? 0) * 60 + (n[1] ?? 0);
  return n[0] ?? 0;
}

export function durationLabel(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  if (!m) return `${s} s`;
  return s ? `${m} min ${String(s).padStart(2, "0")}` : `${m} min`;
}

export type VideoCategory = { id: string; titre: string; videos: PlaylistVideo[] };

const CATEGORY_ORDER = ["Participants", "Groupe ISCAE", "BDO Maroc", "Intervenants"];

/** « Participant · 2e cohorte » → « Participants », « Intervenant » → « Intervenants ». */
export function videoCategory(v: PlaylistVideo) {
  const head = (v.tag ?? "").split("·")[0].trim();
  if (!head) return "Autres";
  if (/^participant/i.test(head)) return "Participants";
  if (/^intervenant/i.test(head)) return "Intervenants";
  return head;
}

export function groupCategories(videos: readonly PlaylistVideo[]): VideoCategory[] {
  const byName = new Map<string, PlaylistVideo[]>();
  for (const v of videos) {
    const name = videoCategory(v);
    byName.set(name, [...(byName.get(name) ?? []), v]);
  }
  const rank = (name: string) => {
    const i = CATEGORY_ORDER.indexOf(name);
    return i === -1 ? CATEGORY_ORDER.length : i;
  };
  return [...byName.entries()]
    .sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b, "fr"))
    .map(([titre, list]) => ({ id: playlistId(titre), titre, videos: list }));
}

export type PlaylistSummary = Playlist & {
  cover: string;
  totalSeconds: number;
  languages: string[];
  categories: string[];
  blurb: string;
};

/**
 * Units shown as cards on `/playlists`.
 * When CMS only defines one playlist name but several voice categories exist,
 * list by category so the grid stays useful.
 */
export function listingPlaylists(videos: readonly PlaylistVideo[]): Playlist[] {
  const playlists = groupPlaylists(videos);
  const categories = groupCategories(videos);
  if (playlists.length <= 1 && categories.length > 1) {
    return categories.map((c) => ({
      id: c.id,
      titre: c.titre,
      videos: [...c.videos].sort((a, b) => a.ordre - b.ordre || a.titre.localeCompare(b.titre, "fr")),
    }));
  }
  return playlists;
}

/** Resolve a `/playlists/[slug]` page from playlist name or category id. */
export function findPlaylistBySlug(videos: readonly PlaylistVideo[], slug: string): Playlist | undefined {
  const fromListing = listingPlaylists(videos).find((p) => p.id === slug);
  if (fromListing) return fromListing;
  return groupPlaylists(videos).find((p) => p.id === slug);
}

/** Listing card data derived from a playlist (no invented metrics). */
export function summarizePlaylist(p: Playlist): PlaylistSummary {
  const totalSeconds = p.videos.reduce((n, v) => n + durationSeconds(v.duree), 0);
  const languages = [...new Set(p.videos.map((v) => v.langue).filter(Boolean))];
  const categories = [...new Set(p.videos.map(videoCategory))];
  const fromResume = p.videos.map((v) => v.resume).find((r) => r?.trim());
  const fromSub = p.videos.map((v) => v.sousTitre).find((s) => s?.trim());
  const count = `${p.videos.length} vidéo${p.videos.length > 1 ? "s" : ""}`;
  const blurb =
    fromSub?.trim() ||
    fromResume?.trim() ||
    `${count}${totalSeconds ? ` · ${durationLabel(totalSeconds)}` : ""} pour découvrir le certificat CFO 4.0.`;

  return {
    ...p,
    cover: p.videos[0]?.poster || "/images/home/iscae-entrance.png",
    totalSeconds,
    languages,
    categories,
    blurb,
  };
}
