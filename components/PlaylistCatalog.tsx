"use client";

import { useMemo, useState } from "react";
import { PubCard } from "@/components/PubCard";
import { IconSearch } from "@/components/icons";
import { Container } from "@/components/ui";
import type { PlaylistAvis } from "@/lib/cms";
import { formatViews } from "@/lib/format";
import {
  durationLabel,
  groupCategories,
  summarizePlaylist,
  videoCategory,
  type Playlist,
} from "@/lib/playlists";

const ALL = "all";

type AvisStat = { count: number; avg: number };

const LANG_FLAG: Record<string, string> = {
  FR: "🇫🇷",
  EN: "🇬🇧",
  AR: "🇲🇦",
};

function Stars({ value }: { value: number }) {
  const n = Math.round(Math.min(5, Math.max(0, value)));
  return (
    <span className="pub-card__stars" aria-hidden>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= n ? "is-on" : ""}>
          ★
        </span>
      ))}
    </span>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden>
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

export function PlaylistCatalog({
  playlists,
  initialCategory,
  avis = [],
  initialViews = {},
}: {
  playlists: Playlist[];
  initialCategory?: string;
  avis?: PlaylistAvis[];
  initialViews?: Record<string, number>;
}) {
  const summaries = useMemo(() => playlists.map(summarizePlaylist), [playlists]);
  const categories = useMemo(
    () => groupCategories(playlists.flatMap((p) => p.videos)),
    [playlists],
  );
  const avisByPlaylist = useMemo(() => {
    const map = new Map<string, AvisStat>();
    for (const p of summaries) {
      const related = avis.filter(
        (a) => !a.playlist || a.playlist.toLowerCase() === p.titre.toLowerCase(),
      );
      if (!related.length) {
        map.set(p.id, { count: 0, avg: 0 });
        continue;
      }
      const avg = related.reduce((s, a) => s + a.note, 0) / related.length;
      map.set(p.id, { count: related.length, avg });
    }
    return map;
  }, [avis, summaries]);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(() => {
    if (!initialCategory) return ALL;
    return categories.some((c) => c.id === initialCategory) ? initialCategory : ALL;
  });
  const views = initialViews;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const catTitre = category === ALL ? null : categories.find((c) => c.id === category)?.titre ?? null;
    return summaries.filter((p) => {
      if (catTitre && !p.videos.some((v) => videoCategory(v) === catTitre)) return false;
      if (!q) return true;
      const hay = [p.titre, p.blurb, ...p.categories, ...p.videos.flatMap((v) => [v.titre, v.sousTitre, v.tag, v.resume])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [summaries, query, category, categories]);

  return (
    <section id="videos" className="plc res-list" aria-labelledby="plc-title">
      <Container>
        <div className="plc__toolbar">
          <label className="plc__search">
            <IconSearch size={18} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une playlist…"
              aria-label="Rechercher une playlist"
              autoComplete="off"
            />
          </label>
          <label className="plc__filter">
            <span className="plc__filter-label">Catégorie</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value={ALL}>Toutes les catégories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.titre} ({c.videos.length})
                </option>
              ))}
            </select>
          </label>
        </div>

        <header className="plc__head">
          <h2 id="plc-title" className="plc__title">
            Les playlists
          </h2>
          <p className="plc__count">
            {filtered.length} playlist{filtered.length > 1 ? "s" : ""}
          </p>
        </header>

        {filtered.length === 0 ? (
          <div className="plc__empty">
            <p className="plc__empty-title">Aucune playlist ne correspond</p>
            <p className="plc__empty-lead">Modifiez la recherche ou la catégorie.</p>
            <button
              type="button"
              className="plc__empty-reset"
              onClick={() => {
                setQuery("");
                setCategory(ALL);
              }}
            >
              Réinitialiser
            </button>
          </div>
        ) : (
          <ul className="res-list__grid">
            {filtered.map((p) => {
              const badge =
                p.categories[0] && p.categories[0] !== p.titre
                  ? p.categories[0]
                  : p.videos[0]?.tag?.split("·")[0]?.trim() || "Playlist";
              const lang = p.languages[0] || p.videos[0]?.langue || "FR";
              const feedback = avisByPlaylist.get(p.id) ?? { count: 0, avg: 0 };
              const viewCount = views[p.id] ?? 0;
              return (
                <li key={p.id}>
                  <PubCard
                    href={`/playlists/${p.id}`}
                    title={p.titre}
                    text={p.blurb}
                    action="Voir la playlist"
                    cover={p.cover}
                    fill
                    className="pub-card--playlist"
                    overlay={
                      <>
                        <span className="pub-card__chip is-badge">{badge}</span>
                        <span className="pub-card__chip is-lang">
                          <span className="pub-card__flag" aria-hidden>
                            {LANG_FLAG[lang] || "🏳️"}
                          </span>
                          {lang}
                        </span>
                      </>
                    }
                  >
                    <span className="pub-card__stats">
                      <span className="pub-card__stat" title="Vues YouTube">
                        <EyeIcon />
                        {formatViews(viewCount)} vue{viewCount === 1 ? "" : "s"}
                      </span>
                      <span className="pub-card__stat" title="Avis">
                        <Stars value={feedback.avg || 0} />
                        {feedback.count > 0 ? (
                          <span>
                            {feedback.avg.toFixed(1).replace(".", ",")}
                            <span className="pub-card__stat-count">({feedback.count})</span>
                          </span>
                        ) : (
                          <span>Nouveaux avis</span>
                        )}
                      </span>
                      {p.totalSeconds > 0 ? (
                        <span className="pub-card__stat is-muted">{durationLabel(p.totalSeconds)}</span>
                      ) : null}
                    </span>
                  </PubCard>
                </li>
              );
            })}
          </ul>
        )}
      </Container>
    </section>
  );
}
