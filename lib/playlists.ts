import { data, sessionBySlug } from "@/lib/content";
import { seminarImage, seminarPath, sessionLabel } from "@/lib/text";

/** Videos shown per playlist before « Voir plus ». */
export const PLAYLIST_PREVIEW = 3;

export type PlaylistVideo = {
  id: string;
  titre: string;
  sousTitre?: string;
  tag?: string;
  video: string;
  poster: string;
  duree?: string;
  lien?: string;
};

export type Playlist = {
  id: string;
  titre: string;
  description?: string;
  videos: PlaylistVideo[];
};

/**
 * Entry in `site.playlists`. Either a full video, or `seance` (session numero) to take the
 * title, label, date, poster and link from the programme.
 */
type RawVideo = {
  video: string;
  titre?: string;
  sousTitre?: string;
  tag?: string;
  poster?: string;
  duree?: string;
  lien?: string;
  seance?: number;
};

type RawPlaylist = {
  id: string;
  titre: string;
  description?: string;
  /** Fill the playlist from another list of the site instead of `videos`. */
  source?: "temoignages";
  videos: readonly RawVideo[];
};

const FALLBACK_POSTER = "/images/home/iscae-entrance.png";

function fromTemoignages(): PlaylistVideo[] {
  return data.site.temoignages.map((t) => ({
    id: t.video,
    titre: t.nom,
    sousTitre: `${t.fonction} · ${t.organisation}`,
    tag: t.statut,
    video: t.video,
    poster: t.poster,
    duree: t.duree,
  }));
}

function resolve(v: RawVideo): PlaylistVideo {
  const session = v.seance === undefined ? undefined : sessionBySlug(String(v.seance));
  return {
    id: v.video,
    titre: v.titre ?? session?.titre ?? "Vidéo",
    sousTitre: v.sousTitre ?? session?.dates,
    tag: v.tag ?? (session ? sessionLabel(session) : undefined),
    video: v.video,
    poster: v.poster ?? (session ? seminarImage(session.numero) : FALLBACK_POSTER),
    duree: v.duree,
    lien: v.lien ?? (session ? seminarPath(session) : undefined),
  };
}

export function allPlaylists(): Playlist[] {
  return (data.site.playlists as readonly RawPlaylist[])
    .map((p) => ({
      id: p.id,
      titre: p.titre,
      description: p.description,
      videos: p.source === "temoignages" ? fromTemoignages() : p.videos.map(resolve),
    }))
    .filter((p) => p.videos.length > 0);
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
