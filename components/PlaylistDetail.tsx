"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PlaylistAvis } from "@/components/PlaylistAvis";
import { Button, Container } from "@/components/ui";
import type { PlaylistAvis as AvisItem } from "@/lib/cms";
import { formatViews } from "@/lib/format";
import {
  durationLabel,
  durationSeconds,
  youtubeEmbedUrl,
  youtubeIdFromSrc,
  type Playlist,
  type PlaylistVideo,
} from "@/lib/playlists";

const LANG_FLAG: Record<string, string> = {
  FR: "🇫🇷",
  EN: "🇬🇧",
  AR: "🇲🇦",
};

function PlayTriangle({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5.5v13l11-6.5L8 5.5z" />
    </svg>
  );
}

function EyeIcon({ size = 12 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden>
      <path
        d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.75" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function SideItem({
  v,
  index,
  active,
  views,
  onSelect,
}: {
  v: PlaylistVideo;
  index: number;
  active: boolean;
  views?: number;
  onSelect: () => void;
}) {
  const flag = LANG_FLAG[v.langue?.toUpperCase()] ?? null;
  const ytId = youtubeIdFromSrc(v.video);
  const viewCount = ytId && views != null ? views : undefined;

  return (
    <li>
      <button
        type="button"
        className={`pld-item${active ? " is-active" : ""}`}
        onClick={onSelect}
        aria-current={active ? "true" : undefined}
      >
        <span className="pld-item__index" aria-hidden>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="pld-item__thumb">
          <Image src={v.poster} alt="" fill sizes="7.5rem" className="object-cover" />
          {v.duree ? <span className="pld-item__dur">{v.duree}</span> : null}
          {active ? (
            <span className="pld-item__now" aria-hidden>
              <PlayTriangle size={14} />
            </span>
          ) : null}
        </span>
        <span className="pld-item__body">
          <strong className="pld-item__title">{v.titre}</strong>
          <span className="pld-item__meta">
            {active ? <span className="pld-item__live">En cours</span> : null}
            {flag ? (
              <span className="pld-item__lang" title={v.langue}>
                {flag} {v.langue}
              </span>
            ) : v.langue ? (
              <span className="pld-item__lang">{v.langue}</span>
            ) : null}
            {viewCount != null && viewCount > 0 ? (
              <span className="pld-item__views">
                <EyeIcon />
                {formatViews(viewCount)}
              </span>
            ) : null}
          </span>
        </span>
      </button>
    </li>
  );
}

export function PlaylistDetail({
  playlist,
  initialVideoId,
  avis = [],
  viewsByVideo = {},
}: {
  playlist: Playlist;
  initialVideoId?: string;
  avis?: AvisItem[];
  viewsByVideo?: Record<string, number>;
}) {
  const { videos, titre } = playlist;
  const listRef = useRef<HTMLUListElement>(null);
  const initialIndex = useMemo(() => {
    if (!initialVideoId) return 0;
    const i = videos.findIndex((v) => v.id === initialVideoId);
    return i >= 0 ? i : 0;
  }, [videos, initialVideoId]);
  const [index, setIndex] = useState(initialIndex);
  const [playing, setPlaying] = useState(Boolean(initialVideoId));
  const [error, setError] = useState(false);
  const active = videos[index];
  const ytId = active ? youtubeIdFromSrc(active.video) : null;
  const next = index < videos.length - 1 ? videos[index + 1] : null;
  const totalSec = useMemo(
    () => videos.reduce((n, v) => n + durationSeconds(v.duree), 0),
    [videos],
  );
  const activeFlag = active ? LANG_FLAG[active.langue?.toUpperCase()] : null;
  const activeViews = ytId ? viewsByVideo[ytId] : undefined;

  const select = useCallback((i: number, autoPlay = true) => {
    setError(false);
    setIndex(i);
    setPlaying(autoPlay);
  }, []);

  useEffect(() => {
    setIndex(initialIndex);
    setError(false);
    setPlaying(Boolean(initialVideoId));
  }, [initialIndex, initialVideoId, playlist.id]);

  useEffect(() => {
    const root = listRef.current;
    if (!root) return;
    const el = root.querySelector<HTMLElement>(".pld-item.is-active");
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [index]);

  if (!videos.length) {
    return (
      <section className="pld">
        <Container>
          <div className="plc__empty">
            <p className="plc__empty-title">Playlist vide</p>
            <p className="plc__empty-lead">Aucune vidéo n’est encore rattachée à « {titre} ».</p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="pld" aria-label={titre}>
      <Container className="pld__shell">
        <div className="pld__layout">
          <div className="pld__main">
            <div className="pld__stage">
              {error || !active?.video ? (
                <div className="pld__player-empty" role="alert">
                  <p>Impossible de charger cette vidéo.</p>
                  {index < videos.length - 1 ? (
                    <button type="button" className="pld__player-retry" onClick={() => select(index + 1)}>
                      Passer à la suivante
                    </button>
                  ) : null}
                </div>
              ) : !playing ? (
                <button
                  type="button"
                  className="pld__cover"
                  onClick={() => setPlaying(true)}
                  aria-label={`Lire ${active.titre}`}
                >
                  <Image
                    src={active.poster}
                    alt=""
                    fill
                    priority
                    sizes="(max-width: 960px) 100vw, 70vw"
                    className="object-cover"
                  />
                  <span className="pld__cover-veil" aria-hidden />
                  <span className="pld__cover-play" aria-hidden>
                    <span className="pld__cover-ring" />
                    <span className="pld__cover-core">
                      <PlayTriangle size={24} />
                    </span>
                  </span>
                </button>
              ) : ytId ? (
                <iframe
                  key={active.video}
                  className="pld__video pld__video--embed"
                  src={youtubeEmbedUrl(ytId, true)}
                  title={active.titre}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <video
                  key={active.video}
                  className="pld__video"
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  poster={active.poster}
                  src={active.video}
                  onError={() => setError(true)}
                  onEnded={() => {
                    if (index < videos.length - 1) select(index + 1);
                  }}
                >
                  Votre navigateur ne lit pas la vidéo.
                </video>
              )}
            </div>

            <div className="pld__meta">
              <div className="pld__chips">
                <span className="pld__chip">
                  {index + 1}/{videos.length}
                </span>
                {active?.duree ? <span className="pld__chip is-muted">{active.duree}</span> : null}
                {activeFlag || active?.langue ? (
                  <span className="pld__chip is-muted">
                    {activeFlag ? `${activeFlag} ` : ""}
                    {active?.langue}
                  </span>
                ) : null}
                {activeViews != null && activeViews > 0 ? (
                  <span className="pld__chip is-muted">
                    <EyeIcon size={13} />
                    {formatViews(activeViews)} vues
                  </span>
                ) : null}
              </div>
              <h2 className="pld__now-title">{active?.titre}</h2>
              {active?.sousTitre ? <p className="pld__now-sub">{active.sousTitre}</p> : null}
              {active?.resume ? <p className="pld__resume">{active.resume}</p> : null}

              <div className="pld__nav-row">
                <Button
                  type="button"
                  variant="ghost"
                  className="pld__nav-btn"
                  disabled={index <= 0}
                  onClick={() => select(index - 1)}
                >
                  ‹ Précédente
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  className="pld__nav-btn"
                  disabled={!next}
                  onClick={() => next && select(index + 1)}
                >
                  {next ? "Suivante ›" : "Fin de la playlist"}
                </Button>
              </div>
            </div>

            <PlaylistAvis playlistId={playlist.id} initial={avis} />
          </div>

          <aside className="pld__panel" aria-label="Liste des vidéos">
            <header className="pld__panel-head">
              <div>
                <h2 className="pld__panel-title">Liste des vidéos</h2>
                <p className="pld__panel-meta">
                  {videos.length} vidéo{videos.length > 1 ? "s" : ""}
                  {totalSec > 0 ? ` · ${durationLabel(totalSec)}` : ""}
                </p>
              </div>
              <span className="pld__panel-badge">
                {index + 1}/{videos.length}
              </span>
            </header>
            <ul className="pld__list" ref={listRef}>
              {videos.map((v, i) => {
                const id = youtubeIdFromSrc(v.video);
                return (
                  <SideItem
                    key={v.id}
                    v={v}
                    index={i}
                    active={i === index}
                    views={id ? viewsByVideo[id] : undefined}
                    onSelect={() => select(i)}
                  />
                );
              })}
            </ul>
          </aside>
        </div>
      </Container>
    </section>
  );
}
