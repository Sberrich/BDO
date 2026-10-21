"use client";

import { useEffect, useMemo, useState } from "react";
import type { PlaylistAvis as AvisItem } from "@/lib/cms";

const STORAGE_PREFIX = "cfo40-avis-stars:";

function Stars({
  value,
  interactive,
  onPick,
  size = "md",
  label,
}: {
  value: number;
  interactive?: boolean;
  onPick?: (n: number) => void;
  size?: "sm" | "md" | "lg";
  label?: string;
}) {
  const [hover, setHover] = useState(0);
  const n = Math.round(Math.min(5, Math.max(0, value)));
  const lit = interactive ? hover || n : n;

  if (interactive && onPick) {
    return (
      <div
        className={`pld-avis__stars is-${size} is-pick`}
        role="radiogroup"
        aria-label={label || "Votre note"}
        onMouseLeave={() => setHover(0)}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            className={i <= lit ? "is-on" : ""}
            role="radio"
            aria-checked={n === i}
            aria-label={`${i} sur 5`}
            onMouseEnter={() => setHover(i)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(0)}
            onClick={() => onPick(i)}
          >
            ★
          </button>
        ))}
      </div>
    );
  }
  return (
    <span className={`pld-avis__stars is-${size}`} aria-label={label || `${n} sur 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= n ? "is-on" : ""} aria-hidden>
          ★
        </span>
      ))}
    </span>
  );
}

export function PlaylistAvis({
  playlistId,
  initial,
}: {
  playlistId: string;
  playlistTitre?: string;
  initial: AvisItem[];
}) {
  const [mine, setMine] = useState(0);
  const [saved, setSaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + playlistId);
      const n = raw ? Number(raw) : 0;
      if (n >= 1 && n <= 5) {
        setMine(n);
        setSaved(true);
      } else {
        setMine(0);
        setSaved(false);
      }
    } catch {
      setMine(0);
      setSaved(false);
    }
    setHydrated(true);
  }, [playlistId]);

  const avg = useMemo(() => {
    const notes = initial.map((a) => a.note).filter((n) => n >= 1 && n <= 5);
    if (mine) notes.push(mine);
    if (!notes.length) return 0;
    return notes.reduce((s, n) => s + n, 0) / notes.length;
  }, [initial, mine]);

  const count = initial.length + (mine ? 1 : 0);

  function rate(n: number) {
    setMine(n);
    setSaved(true);
    try {
      localStorage.setItem(STORAGE_PREFIX + playlistId, String(n));
    } catch {
      /* ignore */
    }
  }

  return (
    <section className="pld-avis" aria-labelledby="pld-avis-title">
      <div className="pld-avis__row">
        <div className="pld-avis__copy">
          <p className="pld-avis__kicker">Avis</p>
          <h2 id="pld-avis-title" className="pld-avis__title">
            Notez cette playlist
          </h2>
          {count > 0 ? (
            <p className="pld-avis__summary">
              <Stars value={avg} size="md" label={`Moyenne ${avg.toFixed(1)} sur 5`} />
              <span>
                <strong>{avg.toFixed(1).replace(".", ",")}</strong> / 5
                <span aria-hidden="true"> · </span>
                {count} avis
              </span>
            </p>
          ) : (
            <p className="pld-avis__lead">Donnez une note de 1 à 5 étoiles.</p>
          )}
        </div>

        <div className="pld-avis__rate">
          <p className="pld-avis__rate-label">Votre note</p>
          {hydrated ? (
            <Stars value={mine || 0} interactive onPick={rate} size="lg" label="Choisir une note" />
          ) : (
            <Stars value={0} size="lg" label="Charger la note" />
          )}
          {saved && mine > 0 ? (
            <p className="pld-avis__thanks" role="status">
              Merci — note enregistrée ({mine}/5).
            </p>
          ) : (
            <p className="pld-avis__hint">Cliquez sur une étoile pour noter.</p>
          )}
        </div>
      </div>
    </section>
  );
}
