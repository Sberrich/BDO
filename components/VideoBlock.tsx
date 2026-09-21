"use client";

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
        className="group relative aspect-video w-full overflow-hidden rounded-md bg-[linear-gradient(135deg,#0062b8_0%,#4d94d4_100%)] text-left shadow-[var(--shadow-sm)] transition hover:shadow-[var(--shadow-md)]"
        aria-label="Lire la vidéo de présentation"
      >
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,.14),transparent_55%)]" />
        <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-blue shadow-md transition group-hover:scale-105">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M8 5.5v13l11-6.5L8 5.5z" />
          </svg>
        </span>
        <span className="absolute bottom-4 left-4 rounded-md bg-white/95 px-2.5 py-1 text-sm font-semibold text-ink">{v.duree}</span>
      </button>
      {open && (
        <div
          className="nav-overlay fixed inset-0 z-[80] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={v.titre}
          onClick={() => setOpen(false)}
        >
          <div className="relative w-full max-w-4xl overflow-hidden rounded-md bg-black shadow-[var(--shadow-lg)]" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="absolute right-3 top-3 z-10 rounded-md bg-white px-3 py-1.5 text-sm font-semibold transition hover:bg-cream"
              onClick={() => setOpen(false)}
            >
              Fermer
            </button>
            <div className="aspect-video">
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
      )}
    </>
  );
}
