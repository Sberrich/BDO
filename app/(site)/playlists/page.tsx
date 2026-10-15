import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { VideoCatalog } from "@/components/VideoCatalog";
import { Container, KickerIcon } from "@/components/ui";
import { IconArrowRight, IconClock, IconPlay, IconUsers } from "@/components/icons";
import { getVideos } from "@/lib/cms";
import {
  durationLabel,
  durationSeconds,
  groupCategories,
  groupPlaylists,
  playlistId,
  videoCategory,
  type PlaylistVideo,
} from "@/lib/playlists";

export const metadata: Metadata = {
  title: "Playlists",
  description:
    "Toutes les vidéos du certificat CFO 4.0 : témoignages de participants, de l’ISCAE, de BDO Maroc et des intervenants, réunis en playlists.",
};

const VOICE: Record<string, string> = {
  Participants: "aux participants",
  "Groupe ISCAE": "au Groupe ISCAE",
  "BDO Maroc": "à BDO Maroc",
  Intervenants: "aux intervenants",
};

function frenchList(items: string[]) {
  if (items.length < 2) return items.join("");
  return `${items.slice(0, -1).join(", ")} et ${items[items.length - 1]}`;
}

type Stat = { icon: () => React.JSX.Element; num: string; unit: string; label: string; dark?: boolean };
type Tile = { video: PlaylistVideo } | Stat;

function totalSeconds(videos: readonly PlaylistVideo[]) {
  return videos.reduce((acc, v) => acc + durationSeconds(v.duree), 0);
}

export default async function PlaylistsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [videos, params] = await Promise.all([getVideos(), searchParams]);
  const playlists = groupPlaylists(videos);
  const categories = groupCategories(videos);
  const initial = typeof params.playlist === "string" ? params.playlist : undefined;
  const initialCategory = typeof params.categorie === "string" ? params.categorie : undefined;
  const total = totalSeconds(videos);
  const voices = frenchList(categories.map((c) => VOICE[c.titre] ?? `à ${c.titre}`));
  const subtitle = videos.length
    ? `${voices ? `La parole ${voices}` : "Le certificat raconté par ceux qui le vivent"} : ${videos.length} vidéo${
        videos.length > 1 ? "s" : ""
      }${total ? `, ${durationLabel(total)}` : ""} pour découvrir le certificat CFO 4.0 de l’intérieur.`
    : "Les premières vidéos du certificat CFO 4.0 arrivent bientôt.";
  const minutes = Math.round(total / 60);
  const posters = [...videos].sort((a, b) => a.ordre - b.ordre).slice(0, 5);
  const stats: Stat[] = [
    { icon: IconPlay, num: String(videos.length), unit: videos.length > 1 ? "vidéos" : "vidéo", label: "en accès libre" },
    { icon: IconUsers, num: String(categories.length), unit: categories.length > 1 ? "catégories" : "catégorie", label: "de témoignages" },
    { icon: IconClock, num: String(minutes), unit: "min", label: "de vidéo au total", dark: true },
  ];
  const tiles: Tile[] = [
    posters[0],
    stats[0],
    posters[1],
    stats[1],
    posters[2],
    posters[3],
    posters[4],
    stats[2],
  ]
    .filter(Boolean)
    .map((t) => ("ordre" in t ? { video: t } : t));

  return (
    <>
      <section className="sem-hero" aria-labelledby="playlists-title">
        <Container className="sem-hero__inner">
          <nav className="sem-hero__crumbs" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span>Playlists</span>
          </nav>
          <div className="sem-hero__grid-layout">
            <div className="sem-hero__copy">
              <p className="sem-hero__index">
                <span className="sem-hero__badge">
                  <KickerIcon label="Vidéothèque" bare />
                  Vidéothèque
                </span>
                {videos.length} vidéo{videos.length > 1 ? "s" : ""}
                {categories.length > 1 ? ` · ${categories.length} catégories` : ""}
              </p>
              <h1 id="playlists-title" className="sem-hero__title">
                Playlists
              </h1>
              <p className="sem-hero__lead pl-hero__sub">{subtitle}</p>
            </div>
            <ul className="iv-faces is-playlists" aria-label="La vidéothèque en bref">
              {tiles.map((t, i) => (
                <li key={i} className={`iv-faces__item is-${i + 1}`}>
                  {"video" in t ? (
                    <Link
                      href={`/playlists?categorie=${playlistId(videoCategory(t.video))}#videos`}
                      className="iv-faces__link"
                      aria-label={`${t.video.titre} · ${videoCategory(t.video)}`}
                    >
                      <Image src={t.video.poster} alt="" fill sizes="180px" className="iv-faces__img" />
                      <span className="iv-faces__play" aria-hidden>
                        <svg viewBox="0 0 24 24">
                          <path d="M8 5.5v13l11-6.5L8 5.5z" />
                        </svg>
                      </span>
                      <span className="iv-faces__name" aria-hidden>
                        {t.video.titre}
                      </span>
                    </Link>
                  ) : (
                    <span className={`iv-faces__link iv-faces__stat${t.dark ? " is-dark" : ""}`}>
                      <span className="iv-faces__stat-icon" aria-hidden="true">
                        <t.icon />
                      </span>
                      <strong>
                        {t.num}
                        <small>{t.unit}</small>
                      </strong>
                      <span>{t.label}</span>
                    </span>
                  )}
                </li>
              ))}
              <li className="iv-faces__item">
                <a href="#videos" className="iv-faces__link iv-faces__more is-cta">
                  <IconArrowRight />
                  <span className="iv-faces__more-label">Voir les vidéos</span>
                </a>
              </li>
            </ul>
          </div>
        </Container>
      </section>
      <VideoCatalog
        key={initial ?? initialCategory ?? "all"}
        playlists={playlists}
        initialPlaylist={initial}
        initialCategory={initialCategory}
      />
    </>
  );
}
