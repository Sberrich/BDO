"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BRAND } from "@/lib/content";

export function HeroVideo() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="hero-light__media hero-panel-enter"
        onClick={() => setOpen(true)}
        aria-label="Regarder la vidéo de présentation du certificat"
      >
        <Image
          src="/images/home/hero.png"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 34rem, 100vw"
          className="hero-light__photo"
        />
        <span className="hero-light__tint" aria-hidden="true" />
        <span className="hero-light__play" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5.5v13l11-6.5L8 5.5z" />
          </svg>
        </span>
      </button>

      {open ? (
        <div
          className="nav-overlay videoband__modal"
          role="dialog"
          aria-modal="true"
          aria-label="Vidéo de présentation du certificat"
          onClick={() => setOpen(false)}
        >
          <div className="videoband__dialog" onClick={(e) => e.stopPropagation()}>
            <button ref={closeRef} type="button" className="videoband__close" onClick={() => setOpen(false)}>
              Fermer
            </button>
            <div className="videoband__embed">
              <iframe
                src={`https://player.vimeo.com/video/${BRAND.vimeoId}?autoplay=1&title=0&byline=0&portrait=0&dnt=1`}
                title="Vidéo de présentation du certificat CFO 4.0"
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
