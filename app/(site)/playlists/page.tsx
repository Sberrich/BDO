import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PlaylistCatalog } from "@/components/PlaylistCatalog";
import { ButtonLink, Container, KickerIcon } from "@/components/ui";
import {
  IconArrowRight,
  IconClock,
  IconDownload,
  IconPlay,
  IconUsers,
} from "@/components/icons";
import { getAvis, getPlaylistsPage, getVideos } from "@/lib/cms";
import {
  durationLabel,
  durationSeconds,
  groupCategories,
  listingPlaylists,
  type PlaylistVideo,
} from "@/lib/playlists";
import { getPlaylistYouTubeViews } from "@/lib/youtube-stats";

export const metadata: Metadata = {
  title: "Playlists",
  description:
    "Playlists YouTube BDO Maroc : conférence sur les enjeux de la transformation digitale pour les leaders financiers.",
};

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
  const [videos, page, params, avis] = await Promise.all([
    getVideos(),
    getPlaylistsPage(),
    searchParams,
    getAvis(),
  ]);
  const playlists = listingPlaylists(videos);
  const initialViews = await getPlaylistYouTubeViews(playlists);
  const categories = groupCategories(videos);
  const initialCategory = typeof params.categorie === "string" ? params.categorie : undefined;
  const total = totalSeconds(videos);
  const minutes = Math.round(total / 60);
  const lead =
    page.chapeau ||
    (videos.length
      ? `Le certificat raconté par ceux qui le vivent : ${videos.length} vidéo${
          videos.length > 1 ? "s" : ""
        }${total ? `, ${durationLabel(total)}` : ""} pour découvrir le CFO 4.0 de l’intérieur.`
      : "Les premières vidéos du certificat CFO 4.0 arrivent bientôt.");
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
                {playlists.length} playlist{playlists.length > 1 ? "s" : ""}
                {videos.length ? ` · ${videos.length} vidéo${videos.length > 1 ? "s" : ""}` : ""}
              </p>
              <h1 id="playlists-title" className="sem-hero__title">
                Le certificat, raconté en vidéo
              </h1>
              <p className="sem-hero__lead">{lead}</p>
              <div className="sem-hero__ctas">
                <ButtonLink href="/ressources/brochure" variant="ghost" className="sem-hero__cta-secondary">
                  <IconDownload />
                  Recevoir la brochure
                </ButtonLink>
                <ButtonLink href="/candidater" className="sem-hero__cta-primary">
                  Candidater
                  <IconArrowRight />
                </ButtonLink>
              </div>
            </div>
            <ul className="iv-faces is-playlists" aria-label="La vidéothèque en bref">
              {tiles.map((t, i) => (
                <li key={i} className={`iv-faces__item is-${i + 1}`}>
                  {"video" in t ? (
                    <Link
                      href={`/playlists/${
                        playlists.find((p) => p.videos.some((v) => v.id === t.video.id))?.id ?? ""
                      }?video=${t.video.id}`}
                      className="iv-faces__link"
                      aria-label={`${t.video.titre} · ${t.video.playlist}`}
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
                  <span className="iv-faces__more-label">Voir les playlists</span>
                </a>
              </li>
            </ul>
          </div>
        </Container>
      </section>
      <PlaylistCatalog
        key={initialCategory ?? "all"}
        playlists={playlists}
        initialCategory={initialCategory}
        avis={avis}
        initialViews={initialViews}
      />
    </>
  );
}
