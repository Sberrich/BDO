import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { VideoCatalog } from "@/components/VideoCatalog";
import { Container, KickerIcon } from "@/components/ui";
import { IconArrowRight } from "@/components/icons";
import { getVideos } from "@/lib/cms";
import {
  durationLabel,
  durationSeconds,
  groupCategories,
  groupPlaylists,
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
            {categories.length ? (
              <section className="ins-sources" aria-label="Les catégories">
                <p className="ins-sources__title">Les catégories</p>
                <ul>
                  {categories.map((c) => {
                    const secs = totalSeconds(c.videos);
                    return (
                      <li key={c.id}>
                        <Link href={`/playlists?categorie=${c.id}#videos`} className="ins-source">
                          <span className="ins-source__cover" aria-hidden>
                            <Image src={c.videos[0].poster} alt="" fill sizes="80px" className="object-cover" />
                          </span>
                          <span className="ins-source__body">
                            <span className="ins-source__label">{c.titre}</span>
                            <span className="ins-source__desc">
                              {c.videos.length} vidéo{c.videos.length > 1 ? "s" : ""}
                              {secs ? ` · ${durationLabel(secs)}` : ""}
                            </span>
                          </span>
                          <IconArrowRight />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ) : null}
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
