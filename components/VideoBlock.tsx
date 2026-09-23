"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { data } from "@/lib/content";

/**
 * Home “En vidéo” block.
 * Drop the final file at `public/videos/presentation.mp4`, then set
 * `site.video.disponible` to true in `lib/payload/site.ts`.
 * Seminar hero clips (`/videos/seminaires/{n}.mp4`) are separate — leave them alone.
 */
export function VideoBlock() {
  const [open, setOpen] = useState(false);
  const v = data.site.video as {
    titre: string;
    texte: string;
    duree: string;
    fichier?: string;
    poster?: string;
    disponible?: boolean;
  };
  const src = v.fichier?.startsWith("/") ? v.fichier : "";
  const poster = v.poster?.startsWith("/") ? v.poster : "/images/people/zakaria-fahim.jpg";
  const ready = Boolean(v.disponible && src);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (ready) setOpen(true);
        }}
        className={`videoband__player${ready ? "" : " is-soon"}`}
        aria-label={
          ready
            ? "Lire la vidéo de présentation"
            : "Vidéo de présentation — bientôt disponible"
        }
        aria-disabled={!ready}
        disabled={!ready}
      >
        <span className="videoband__frame" aria-hidden="true" />
        <span className="videoband__poster">
          <Image
            src={poster}
            alt=""
            fill
            sizes="(min-width: 900px) 34rem, 100vw"
            className="videoband__img"
            priority={false}
          />
          <span className="videoband__veil" />
          <span className="videoband__scan" />
        </span>

        {ready ? (
          <span className="videoband__play" aria-hidden="true">
            <span className="videoband__play-ring" />
            <span className="videoband__play-core">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5.5v13l11-6.5L8 5.5z" />
              </svg>
            </span>
          </span>
        ) : (
          <span className="videoband__soon" aria-hidden="true">
            Bientôt
          </span>
        )}

        <span className="videoband__badge">
          <span className="videoband__live" aria-hidden="true" />
          {ready ? v.duree : "À venir"}
        </span>

        <span className="videoband__caption">
          <span className="videoband__caption-kicker">
            {ready ? "Présentation" : "Emplacement réservé"}
          </span>
          <span className="videoband__caption-title">Zakaria Fahim</span>
        </span>
      </button>

      {open && ready ? (
        <div
          className="nav-overlay videoband__modal"
          role="dialog"
          aria-modal="true"
          aria-label={v.titre}
          onClick={() => setOpen(false)}
        >
          <div
            className="videoband__dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="videoband__close"
              onClick={() => setOpen(false)}
            >
              Fermer
            </button>
            <div className="videoband__embed">
              <video
                className="h-full w-full bg-black"
                controls
                autoPlay
                playsInline
                poster={poster}
                src={src}
              >
                Votre navigateur ne lit pas la vidéo.
              </video>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
