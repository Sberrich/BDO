"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { BRAND, data } from "@/lib/content";

export function VideoBlock() {
  const [open, setOpen] = useState(false);
  const v = data.site.video;

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
        onClick={() => setOpen(true)}
        className="videoband__player"
        aria-label="Lire la vidéo de présentation"
      >
        <span className="videoband__frame" aria-hidden="true" />
        <span className="videoband__poster">
          <Image
            src="/images/people/zakaria-fahim.jpg"
            alt=""
            fill
            sizes="(min-width: 900px) 34rem, 100vw"
            className="videoband__img"
            priority={false}
          />
          <span className="videoband__veil" />
          <span className="videoband__scan" />
        </span>

        <span className="videoband__play" aria-hidden="true">
          <span className="videoband__play-ring" />
          <span className="videoband__play-core">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5.5v13l11-6.5L8 5.5z" />
            </svg>
          </span>
        </span>

        <span className="videoband__badge">
          <span className="videoband__live" aria-hidden="true" />
          {v.duree}
        </span>

        <span className="videoband__caption">
          <span className="videoband__caption-kicker">Présentation</span>
          <span className="videoband__caption-title">Zakaria Fahim</span>
        </span>
      </button>

      {open ? (
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
              <iframe
                title={v.titre}
                src={`https://player.vimeo.com/video/${BRAND.vimeoId}?autoplay=1`}
                className="h-full w-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
