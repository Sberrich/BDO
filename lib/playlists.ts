/** Videos shown per playlist before « Voir plus ». */
export const PLAYLIST_PREVIEW = 3;

export type PlaylistVideo = {
  id: string;
  titre: string;
  playlist: string;
  ordre: number;
  sousTitre?: string;
  tag?: string;
  video: string;
  poster: string;
  duree?: string;
  langue: string;
  date?: string;
  resume?: string;
};

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
