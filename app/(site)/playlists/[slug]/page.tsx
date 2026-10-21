import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlaylistDetail } from "@/components/PlaylistDetail";
import { Container, KickerIcon } from "@/components/ui";
import { getAvis, getVideos } from "@/lib/cms";
import {
  durationLabel,
  durationSeconds,
  findPlaylistBySlug,
  listingPlaylists,
  youtubeIdFromSrc,
} from "@/lib/playlists";
import { getYouTubeViewCounts } from "@/lib/youtube-stats";

type Params = { slug: string };
type Search = { [key: string]: string | string[] | undefined };

export async function generateStaticParams() {
  const videos = await getVideos();
  const slugs = new Set(listingPlaylists(videos).map((p) => p.id));
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const videos = await getVideos();
  const playlist = findPlaylistBySlug(videos, slug);
  if (!playlist) return { title: "Playlist" };
  return {
    title: playlist.titre,
    description: `${playlist.videos.length} vidéo${playlist.videos.length > 1 ? "s" : ""} — ${playlist.titre}. Playlist YouTube BDO Maroc.`,
  };
}

export default async function PlaylistDetailPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const videos = await getVideos();
  const playlist = findPlaylistBySlug(videos, slug);
  if (!playlist) notFound();

  const initialVideoId = typeof sp.video === "string" ? sp.video : undefined;
  const avis = await getAvis(playlist.titre);
  const total = playlist.videos.reduce((n, v) => n + durationSeconds(v.duree), 0);
  const ytIds = playlist.videos.map((v) => youtubeIdFromSrc(v.video)).filter(Boolean) as string[];
  const viewsByVideo = await getYouTubeViewCounts(ytIds);

  return (
    <>
      <section className="sem-hero pld-hero" aria-labelledby="pld-title">
        <Container className="sem-hero__inner pld-hero__inner">
          <nav className="sem-hero__crumbs" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <Link href="/playlists">Playlists</Link>
            <span aria-hidden="true">/</span>
            <span>{playlist.titre}</span>
          </nav>
          <p className="sem-hero__index">
            <span className="sem-hero__badge">
              <KickerIcon label="Playlist" bare />
              Playlist
            </span>
            {playlist.videos.length} vidéo{playlist.videos.length > 1 ? "s" : ""}
            {total > 0 ? ` · ${durationLabel(total)}` : ""}
          </p>
          <h1 id="pld-title" className="sem-hero__title pld-hero__title">
            {playlist.titre}
          </h1>
        </Container>
      </section>
      <PlaylistDetail
        playlist={playlist}
        initialVideoId={initialVideoId}
        avis={avis}
        viewsByVideo={viewsByVideo}
      />
    </>
  );
}
