"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BRAND } from "@/lib/content";

const VIMEO_ORIGIN = "https://player.vimeo.com";
/** Reveal the player anyway if Vimeo never reports playback (autoplay blocked, slow network). */
const REVEAL_FALLBACK_MS = 4000;

export function HeroVideo() {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);

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

  useEffect(() => {
    if (!open) return;
    const send = (method: string, value?: string) =>
      frameRef.current?.contentWindow?.postMessage(JSON.stringify({ method, value }), VIMEO_ORIGIN);
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== VIMEO_ORIGIN) return;
      let msg: { event?: string };
      try {
        msg = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      if (msg.event === "ready") {
        send("addEventListener", "play");
        send("addEventListener", "timeupdate");
      } else if (msg.event === "play" || msg.event === "timeupdate") {
        setPlaying(true);
      }
    };
    window.addEventListener("message", onMessage);
    const fallback = window.setTimeout(() => setPlaying(true), REVEAL_FALLBACK_MS);
    return () => {
      window.removeEventListener("message", onMessage);
      window.clearTimeout(fallback);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    setPlaying(false);
  };

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
          onClick={close}
        >
          <div className="videoband__dialog" onClick={(e) => e.stopPropagation()}>
            <button ref={closeRef} type="button" className="videoband__close" onClick={close} aria-label="Fermer la vidéo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
            <div className={`videoband__embed${playing ? "" : " is-loading"}`}>
              <iframe
                ref={frameRef}
                src={`${VIMEO_ORIGIN}/video/${BRAND.vimeoId}?autoplay=1&title=0&byline=0&portrait=0&dnt=1`}
                title="Vidéo de présentation du certificat CFO 4.0"
                className={`h-full w-full${playing ? " is-ready" : ""}`}
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
