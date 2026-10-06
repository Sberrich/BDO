"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { data } from "@/lib/content";
import { Reveal } from "@/components/motion";

type Voice = (typeof data.site.temoignages)[number];

function seconds(duree: string) {
  const [m = 0, s = 0] = (duree.match(/\d+/g) ?? []).map(Number);
  return m * 60 + s;
}

function totalLabel(voices: readonly Voice[]) {
  const total = voices.reduce((acc, v) => acc + seconds(v.duree), 0);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return s ? `${m} min ${String(s).padStart(2, "0")}` : `${m} min`;
}

function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8 5.5v13l11-6.5L8 5.5z" />
    </svg>
  );
}

function Featured({ v, onPlay }: { v: Voice; onPlay: () => void }) {
  return (
    <button
      type="button"
      onClick={onPlay}
      className="voices-feature"
      aria-label={`Lire le témoignage de ${v.nom} (${v.duree})`}
    >
      <Image
        src={v.poster}
        alt=""
        fill
        loading="eager"
        sizes="(min-width: 960px) 44rem, 100vw"
        className="voices-feature__img"
      />
      <span className="voices-feature__veil" aria-hidden="true" />
      <span className="voices-feature__badge">
        <span className="voices-feature__dot" aria-hidden="true" />
        À la une
      </span>
      <span className="voices-feature__play" aria-hidden="true">
        <PlayIcon />
      </span>
      <span className="voices-feature__body">
        <span className="voices-feature__tag">{v.statut}</span>
        <strong className="voices-feature__name">{v.nom}</strong>
        <span className="voices-feature__role">
          {v.fonction} · {v.organisation}
        </span>
        <span className="voices-feature__cta">
          <PlayIcon className="voices-feature__cta-icon" />
          <span className="voices-feature__cta-label">Regarder le témoignage</span>
          <span className="voices-feature__cta-time">{v.duree}</span>
        </span>
      </span>
    </button>
  );
}

function Row({ v, index, onPlay }: { v: Voice; index: number; onPlay: () => void }) {
  return (
    <button
      type="button"
      onClick={onPlay}
      className="voices-row"
      aria-label={`Lire le témoignage de ${v.nom} (${v.duree})`}
    >
      <span className="voices-row__num" aria-hidden="true">
        {String(index).padStart(2, "0")}
      </span>
      <span className="voices-row__thumb">
        <Image
          src={v.poster}
          alt=""
          fill
          loading="eager"
          sizes="10rem"
          className="voices-row__img"
        />
        <span className="voices-row__play" aria-hidden="true">
          <PlayIcon />
        </span>
      </span>
      <span className="voices-row__body">
        <span className="voices-row__tag">{v.statut}</span>
        <strong className="voices-row__name">{v.nom}</strong>
        <span className="voices-row__role">
          {v.fonction} · {v.organisation}
        </span>
      </span>
      <span className="voices-row__time">{v.duree}</span>
    </button>
  );
}

export function VoicesVideos() {
  const voices = data.site.temoignages;
  const [index, setIndex] = useState<number | null>(null);
  const active = index === null ? null : voices[index];
  const next = index === null ? null : voices[(index + 1) % voices.length];

  const close = useCallback(() => setIndex(null), []);
  const go = useCallback(
    (step: number) =>
      setIndex((i) => (i === null ? i : (i + step + voices.length) % voices.length)),
    [voices.length],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [index, close, go]);

  const [featured, ...rest] = voices;
  if (!featured) return null;

  return (
    <>
      <Reveal className="voices-bar" delay={20}>
        <p className="voices-bar__meta">
          <strong>{voices.length} vidéos</strong>
          <span aria-hidden="true">·</span>
          {totalLabel(voices)} au total
        </p>
        <button type="button" className="voices-bar__all" onClick={() => setIndex(0)}>
          <PlayIcon className="voices-bar__all-icon" />
          Tout regarder
        </button>
      </Reveal>

      <div className="voices__stage">
        <Reveal className="voices__featured-video" delay={40}>
          <Featured v={featured} onPlay={() => setIndex(0)} />
        </Reveal>
        <Reveal className="voices-list" delay={120}>
          <p className="voices-list__title">À suivre</p>
          <ol className="voices-list__items">
            {rest.map((v, i) => (
              <li key={v.nom}>
                <Row v={v} index={i + 2} onPlay={() => setIndex(i + 1)} />
              </li>
            ))}
          </ol>
        </Reveal>
      </div>

      {active && index !== null ? (
        <div
          className="nav-overlay videoband__modal"
          role="dialog"
          aria-modal="true"
          aria-label={`Témoignage de ${active.nom}`}
          onClick={close}
        >
          <div className="videoband__dialog voices-player" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="videoband__close" onClick={close}>
              Fermer
            </button>
            <div className="videoband__embed">
              <video
                key={active.video}
                className="h-full w-full bg-black"
                controls
                autoPlay
                playsInline
                poster={active.poster}
                src={active.video}
                onEnded={() => {
                  if (index < voices.length - 1) go(1);
                }}
              >
                Votre navigateur ne lit pas la vidéo.
              </video>
            </div>
            <div className="voices-player__bar">
              <p className="voices-player__caption">
                <span className="voices-player__count">
                  {index + 1} / {voices.length}
                </span>
                <span>
                  <strong>{active.nom}</strong>
                  <span className="voices-player__role">
                    {active.fonction} · {active.organisation}
                  </span>
                </span>
              </p>
              <div className="voices-player__nav">
                <button
                  type="button"
                  className="voices-player__btn"
                  onClick={() => go(-1)}
                  aria-label="Témoignage précédent"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                    <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {next ? (
                  <button
                    type="button"
                    className="voices-player__next"
                    onClick={() => go(1)}
                    aria-label={`Témoignage suivant : ${next.nom}`}
                  >
                    <span className="voices-player__next-thumb">
                      <Image src={next.poster} alt="" fill sizes="5rem" className="object-cover" />
                    </span>
                    <span className="voices-player__next-text">
                      <span>Suivant</span>
                      <strong>{next.nom}</strong>
                    </span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
