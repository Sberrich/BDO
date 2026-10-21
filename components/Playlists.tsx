"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { IconArrowRight } from "@/components/icons";
import { LoopCarousel } from "@/components/LoopCarousel";
import { Button, ButtonLink } from "@/components/ui";
import { CAROUSEL_MAX } from "@/lib/carousel";
import { Reveal } from "@/components/motion";
import {
  durationLabel,
  durationSeconds,
  youtubeEmbedUrl,
  youtubeIdFromSrc,
  type Playlist,
  type PlaylistVideo,
} from "@/lib/playlists";

function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8 5.5v13l11-6.5L8 5.5z" />
    </svg>
  );
}

function Card({ v, index, onPlay }: { v: PlaylistVideo; index: number; onPlay: () => void }) {
  return (
    <button
      type="button"
      onClick={onPlay}
      className="playlist-card"
      aria-label={`Lire « ${v.titre} »${v.duree ? ` (${v.duree})` : ""}`}
    >
      <span className="playlist-card__thumb">
        <Image src={v.poster} alt="" fill sizes="(min-width: 960px) 22rem, (min-width: 640px) 45vw, 8rem" className="playlist-card__img" />
        <span className="playlist-card__num" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="playlist-card__play" aria-hidden="true">
          <PlayIcon />
        </span>
        {v.duree ? <span className="playlist-card__time">{v.duree}</span> : null}
      </span>
      <span className="playlist-card__body">
        {v.tag ? <span className="playlist-card__tag">{v.tag}</span> : null}
        <strong className="playlist-card__title">{v.titre}</strong>
        {v.sousTitre ? <span className="playlist-card__sub">{v.sousTitre}</span> : null}
      </span>
    </button>
  );
}

function PlaylistBlock({
  playlist,
  intro,
  onPlay,
}: {
  playlist: Playlist;
  intro?: ReactNode;
  onPlay: (index: number) => void;
}) {
  const { id, titre, videos } = playlist;
  const shown = videos.slice(0, CAROUSEL_MAX);
  const total = videos.reduce((acc, v) => acc + durationSeconds(v.duree), 0);

  const head = (
    <header className="playlist__head">
      <div className="playlist__intro">
        <h3 id={`playlist-${id}`} className="playlist__title">
          {titre}
        </h3>
      </div>
      <div className="playlist__actions">
        <p className="playlist__meta">
          <strong>
            {videos.length} vidéo{videos.length > 1 ? "s" : ""}
          </strong>
          {total ? (
            <>
              <span aria-hidden="true">·</span>
              {durationLabel(total)}
            </>
          ) : null}
        </p>
        <button type="button" className="playlist__all" onClick={() => onPlay(0)}>
          <PlayIcon className="playlist__all-icon" />
          Tout lire
        </button>
      </div>
    </header>
  );

  return (
    <Reveal className="playlist" delay={40}>
      <section aria-labelledby={`playlist-${id}`}>
        <LoopCarousel
          className="is-videos"
          centered
          heading={intro ?? head}
          subheading={intro ? head : undefined}
          slides={shown.map((v, i) => (
            <Card key={v.id} v={v} index={i} onPlay={() => onPlay(i)} />
          ))}
          labels={shown.map((v) => `Afficher « ${v.titre} »`)}
          prevLabel="Vidéo précédente"
          nextLabel="Vidéo suivante"
        />
        <div className="prog__all playlist__all-bottom">
          <Button type="button" variant="ghost" onClick={() => onPlay(0)}>
            <PlayIcon className="playlist__all-icon" />
            Tout lire
          </Button>
        </div>
        {videos.length > CAROUSEL_MAX ? (
          <div className="prog__all">
            <ButtonLink href={`/playlists/${id}`} variant="ghost" aria-label={`Voir la playlist : ${titre}`}>
              Voir la playlist
              <IconArrowRight />
            </ButtonLink>
          </div>
        ) : null}
      </section>
    </Reveal>
  );
}

export function PlaylistPlayer({
  playlist,
  index,
  onIndex,
  onClose,
}: {
  playlist: Playlist;
  index: number;
  onIndex: (index: number) => void;
  onClose: () => void;
}) {
  const { videos } = playlist;
  const active = videos[index];
  const next = videos.length > 1 ? videos[(index + 1) % videos.length] : null;
  const go = useCallback(
    (step: number) => onIndex((index + step + videos.length) % videos.length),
    [index, onIndex, videos.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [go, onClose]);

  if (!active) return null;

  return (
    <div
      className="nav-overlay videoband__modal"
      role="dialog"
      aria-modal="true"
      aria-label={`${playlist.titre} : ${active.titre}`}
      onClick={onClose}
    >
      <div className="videoband__dialog voices-player" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="videoband__close" onClick={onClose} aria-label="Fermer la vidéo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
        <div className="videoband__embed">
          {youtubeIdFromSrc(active.video) ? (
            <iframe
              key={active.video}
              className="h-full w-full bg-black"
              src={youtubeEmbedUrl(youtubeIdFromSrc(active.video)!, true)}
              title={active.titre}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <video
              key={active.video}
              className="h-full w-full bg-black"
              controls
              autoPlay
              playsInline
              preload="auto"
              src={active.video}
              onLoadedData={(e) => e.currentTarget.classList.add("is-ready")}
              onEnded={() => {
                if (index < videos.length - 1) go(1);
              }}
            >
              Votre navigateur ne lit pas la vidéo.
            </video>
          )}
        </div>
        <div className="voices-player__bar">
          <p className="voices-player__caption">
            <span className="voices-player__count">
              {index + 1} / {videos.length}
            </span>
            <span>
              <strong>{active.titre}</strong>
              <span className="voices-player__role">
                {[active.playlist, active.sousTitre].filter(Boolean).join(" · ")}
              </span>
            </span>
          </p>
          {next ? (
            <div className="voices-player__nav">
              <button type="button" className="voices-player__btn" onClick={() => go(-1)} aria-label="Vidéo précédente">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                  <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                className="voices-player__next"
                onClick={() => go(1)}
                aria-label={`Vidéo suivante : ${next.titre}`}
              >
                <span className="voices-player__next-thumb">
                  <Image src={next.poster} alt="" fill sizes="5rem" className="object-cover" />
                </span>
                <span className="voices-player__next-text">
                  <span>Suivant</span>
                  <strong>{next.titre}</strong>
                </span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** Every playlist of `site.playlists` as a looping carousel, one shared player. */
/** `intro` (the section heading) takes the first carousel's header, next to its arrows. */
export function Playlists({ playlists, intro }: { playlists: Playlist[]; intro?: ReactNode }) {
  const [playing, setPlaying] = useState<{ list: number; index: number } | null>(null);
  const close = useCallback(() => setPlaying(null), []);
  const setIndex = useCallback(
    (index: number) => setPlaying((p) => (p ? { ...p, index } : p)),
    [],
  );
  const current = playing ? playlists[playing.list] : undefined;

  return (
    <>
      <div className="playlists">
        {playlists.map((p, list) => (
          <PlaylistBlock
            key={p.id}
            playlist={p}
            intro={list === 0 ? intro : undefined}
            onPlay={(index) => setPlaying({ list, index })}
          />
        ))}
      </div>
      {current && playing ? (
        <PlaylistPlayer playlist={current} index={playing.index} onIndex={setIndex} onClose={close} />
      ) : null}
    </>
  );
}
