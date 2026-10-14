import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { VideoCatalog } from "@/components/VideoCatalog";
import { Container, KickerIcon } from "@/components/ui";
import { IconArrowRight } from "@/components/icons";
import { getPlaylistsPage, getVideos } from "@/lib/cms";
import { durationLabel, durationSeconds, groupPlaylists } from "@/lib/playlists";

export const metadata: Metadata = {
  title: "Playlists",
  description:
    "Toutes les vidéos du certificat CFO 4.0 : témoignages de participants, de l’ISCAE, de BDO Maroc et des intervenants, réunis en playlists.",
};

export default async function PlaylistsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [{ chapeau }, videos, params] = await Promise.all([getPlaylistsPage(), getVideos(), searchParams]);
  const playlists = groupPlaylists(videos);
  const initial = typeof params.playlist === "string" ? params.playlist : undefined;

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
                  <KickerIcon label="Playlists" bare />
                  Playlists
                </span>
                {videos.length} vidéo{videos.length > 1 ? "s" : ""}
              </p>
              <h1 id="playlists-title" className="sem-hero__title">
                Le certificat en vidéo
              </h1>
              <p className="sem-hero__lead">{chapeau}</p>
            </div>
            <section className="ins-sources" aria-label="Les playlists">
              <p className="ins-sources__title">Les playlists</p>
              <ul>
                {playlists.map((p) => {
                  const total = p.videos.reduce((acc, v) => acc + durationSeconds(v.duree), 0);
                  return (
                    <li key={p.id}>
                      <Link href={`/playlists?playlist=${p.id}#videos`} className="ins-source">
                        <span className="ins-source__cover" aria-hidden>
                          <Image src={p.videos[0].poster} alt="" fill sizes="80px" className="object-cover" />
                        </span>
                        <span className="ins-source__body">
                          <span className="ins-source__label">{p.titre}</span>
                          <span className="ins-source__desc">
                            {p.videos.length} vidéo{p.videos.length > 1 ? "s" : ""}
                            {total ? ` · ${durationLabel(total)}` : ""}
                          </span>
                        </span>
                        <IconArrowRight />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>
        </Container>
      </section>
      <VideoCatalog key={initial ?? "all"} playlists={playlists} initialPlaylist={initial} />
    </>
  );
}
