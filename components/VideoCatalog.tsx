"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { IconGrid, IconInbox, IconPlay, IconSearch, IconSort, IconUsers } from "@/components/icons";
import { PlaylistPlayer } from "@/components/Playlists";
import { ButtonLink, Container } from "@/components/ui";
import {
  durationLabel,
  durationSeconds,
  groupCategories,
  videoCategory,
  type Playlist,
  type PlaylistVideo,
} from "@/lib/playlists";

/** Cards shown at first, and added by each « Afficher plus ». */
const PAGE_SIZE = 9;
const ALL = "all";

type Option = { key: string; titre: string; count: number; kind: "all" | "playlist" | "category" };

type Sort = "playlist" | "newest" | "shortest";

function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8 5.5v13l11-6.5L8 5.5z" />
    </svg>
  );
}

function VideoCard({ v, onPlay }: { v: PlaylistVideo; onPlay: () => void }) {
  return (
    <article className="vcat-card">
      <button type="button" className="vcat-card__thumb" onClick={onPlay} aria-label={`Lire « ${v.titre} »`}>
        <Image src={v.poster} alt="" fill sizes="(min-width: 960px) 22rem, (min-width: 640px) 45vw, 100vw" className="vcat-card__img" />
        <span className="vcat-card__play" aria-hidden="true">
          <PlayIcon />
        </span>
        {v.duree ? <span className="vcat-card__time">{v.duree}</span> : null}
      </button>
      <div className="vcat-card__body">
        <p className="vcat-card__chips">
          <span className="vcat-chip is-playlist">{v.playlist}</span>
          <span className="vcat-chip">{v.langue}</span>
        </p>
        <h3 className="vcat-card__title">{v.titre}</h3>
        {v.sousTitre ? <p className="vcat-card__sub">{v.sousTitre}</p> : null}
        {v.tag ? <p className="vcat-card__tag">{v.tag}</p> : null}
        <button type="button" className="vcat-card__cta" onClick={onPlay} tabIndex={-1} aria-hidden="true">
          <PlayIcon className="vcat-card__cta-icon" />
          Regarder la vidéo
        </button>
      </div>
    </article>
  );
}

export function VideoCatalog({
  playlists,
  initialPlaylist,
  initialCategory,
}: {
  playlists: Playlist[];
  initialPlaylist?: string;
  initialCategory?: string;
}) {
  const videos = useMemo(() => playlists.flatMap((p) => p.videos), [playlists]);
  const options = useMemo<Option[]>(() => {
    const cats = groupCategories(videos);
    return [
      { key: ALL, titre: "Toutes", count: videos.length, kind: "all" },
      ...(playlists.length > 1
        ? playlists.map((p) => ({ key: `p:${p.titre}`, titre: p.titre, count: p.videos.length, kind: "playlist" as const }))
        : []),
      ...(cats.length > 1
        ? cats.map((c) => ({ key: `c:${c.titre}`, titre: c.titre, count: c.videos.length, kind: "category" as const }))
        : []),
    ];
  }, [videos, playlists]);
  const [filter, setFilter] = useState(() => {
    const p = playlists.find((x) => x.id === initialPlaylist);
    if (p) return `p:${p.titre}`;
    const c = groupCategories(videos).find((x) => x.id === initialCategory);
    return c ? `c:${c.titre}` : ALL;
  });
  const current = options.find((o) => o.key === filter) ?? options[0];
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("playlist");
  const [shown, setShown] = useState(PAGE_SIZE);
  const [playing, setPlaying] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = videos.filter((v) => {
      if (filter.startsWith("p:") && v.playlist !== filter.slice(2)) return false;
      if (filter.startsWith("c:") && videoCategory(v) !== filter.slice(2)) return false;
      if (!q) return true;
      return [v.titre, v.sousTitre, v.tag, v.playlist, v.resume].some((s) => s?.toLowerCase().includes(q));
    });
    if (sort === "newest") return [...list].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
    if (sort === "shortest") return [...list].sort((a, b) => durationSeconds(a.duree) - durationSeconds(b.duree));
    return list;
  }, [videos, filter, query, sort]);

  const visible = filtered.slice(0, shown);
  const total = filtered.reduce((acc, v) => acc + durationSeconds(v.duree), 0);
  const choose = (key: string) => {
    setFilter(key);
    setShown(PAGE_SIZE);
  };

  return (
    <section id="videos" className="insights-explorer" aria-labelledby="videos-title">
      <Container className="insights-explorer__inner">
        <div className="insights-toolbar">
          <label className="insights-search">
            <span className="sr-only">Rechercher</span>
            <span className="insights-search__icon" aria-hidden>
              <IconSearch size={17} />
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShown(PAGE_SIZE);
              }}
              placeholder="Rechercher une vidéo, une personne…"
              className="insights-search__input"
            />
          </label>
          <label className="insights-sort">
            <span className="insights-sort__label">
              <IconSort size={14} />
              Trier par
            </span>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="insights-sort__select">
              <option value="playlist">Ordre des playlists</option>
              <option value="newest">Plus récent</option>
              <option value="shortest">Plus court</option>
            </select>
          </label>
        </div>

        <div className="insights-head">
          <div>
            <h2 id="videos-title" className="insights-head__title">
              {current.kind === "all" ? "Toutes les vidéos" : current.titre}
            </h2>
            <p className="insights-head__count" aria-live="polite">
              {filtered.length} vidéo{filtered.length > 1 ? "s" : ""}
              {total ? ` · ${durationLabel(total)}` : ""}
            </p>
          </div>
          <div role="radiogroup" aria-label="Filtrer par catégorie" className="insights-filters">
            {options.map((o) => {
              const active = filter === o.key;
              return (
                <button
                  key={o.key}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => choose(o.key)}
                  className={`insights-filter ${active ? "is-active" : ""}`}
                >
                  <span className="insights-filter__icon" aria-hidden>
                    {o.kind === "all" ? <IconGrid size={14} /> : o.kind === "playlist" ? <IconPlay /> : <IconUsers />}
                  </span>
                  {o.titre}
                  <span className="vcat-count">{o.count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="insights-empty">
            <div className="insights-empty__icon" aria-hidden>
              <IconInbox />
            </div>
            <p className="insights-empty__title">Aucune vidéo trouvée</p>
            <p className="insights-empty__text">Essayez un autre mot-clé ou affichez toutes les playlists.</p>
            <div className="insights-empty__actions">
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  choose(ALL);
                }}
                className="insights-empty__reset"
              >
                Réinitialiser
              </button>
              <ButtonLink href="/ressources">Voir les ressources</ButtonLink>
            </div>
          </div>
        ) : (
          <>
            <ul className="vcat-grid">
              {visible.map((v, i) => (
                <li key={v.id}>
                  <VideoCard v={v} onPlay={() => setPlaying(i)} />
                </li>
              ))}
            </ul>
            {filtered.length > shown ? (
              <div className="playlist__foot">
                <button type="button" className="playlist__more" onClick={() => setShown((n) => n + PAGE_SIZE)}>
                  Afficher plus ({filtered.length - shown})
                </button>
              </div>
            ) : null}
          </>
        )}
      </Container>

      {playing !== null ? (
        <PlaylistPlayer
          playlist={{ id: "catalogue", titre: current.kind === "all" ? "Playlists" : current.titre, videos: filtered }}
          index={playing}
          onIndex={setPlaying}
          onClose={() => setPlaying(null)}
        />
      ) : null}
    </section>
  );
}
