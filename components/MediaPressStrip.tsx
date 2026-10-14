"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { plain } from "@/lib/text";

export type MediaItem = {
  nom: string;
  lien: string;
  logo: string;
  domaine: string;
  titre: string;
  description: string;
  apercu: string;
};

const AUTOPLAY_MS = 2000;
const RESUME_AFTER_TOUCH_MS = 4000;

function PressCard({ m, clone }: { m: MediaItem; clone: boolean }) {
  return (
    <li className="press-logos__item" aria-hidden={clone || undefined}>
      <a
        href={m.lien}
        target="_blank"
        rel="noopener noreferrer"
        className="press-logo"
        aria-label={`${plain(m.nom)} : ${plain(m.titre)}`}
        tabIndex={clone ? -1 : undefined}
      >
        <span className="press-logo__mark">
          <Image src={m.logo} alt="" width={240} height={64} className="press-logo__img" />
        </span>
        <span className="press-logo__meta">
          <span className="press-logo__name">{plain(m.nom)}</span>
          <span className="press-logo__host">{m.domaine}</span>
        </span>

        <span className="press-preview" aria-hidden="true">
          <span className="press-preview__chrome">
            <span className="press-preview__dots" />
            <span className="press-preview__url">{m.domaine}</span>
          </span>
          <span className="press-preview__shot">
            <Image
              src={m.apercu}
              alt=""
              width={640}
              height={360}
              sizes="320px"
              className="press-preview__img"
            />
          </span>
          <span className="press-preview__body">
            <span className="press-preview__title">{plain(m.titre)}</span>
            <span className="press-preview__desc">{plain(m.description)}</span>
          </span>
        </span>
      </a>
    </li>
  );
}

/** Swipeable strip that advances one card every 2 s and loops (the list is rendered twice). */
export function MediaPressStrip({ items }: { items: readonly MediaItem[] }) {
  const trackRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let visible = false;
    let hovered = false;
    let touchedUntil = 0;
    let settle = 0;

    const cards = () => track.querySelectorAll<HTMLElement>(".press-logos__item");
    const loopWidth = () => {
      const all = cards();
      return all.length > items.length ? all[items.length].offsetLeft - all[0].offsetLeft : 0;
    };
    const step = () => {
      const all = cards();
      return all.length > 1 ? all[1].offsetLeft - all[0].offsetLeft : 0;
    };

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.4 });
    io.observe(track);

    const timer = window.setInterval(() => {
      if (!visible || hovered || document.hidden || Date.now() < touchedUntil) return;
      track.scrollBy({ left: step(), behavior: "smooth" });
    }, AUTOPLAY_MS);

    const onScroll = () => {
      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        const w = loopWidth();
        if (w && track.scrollLeft >= w - 2) {
          track.scrollTo({ left: track.scrollLeft - w, behavior: "instant" });
        }
      }, 120);
    };
    const pause = () => (hovered = true);
    const resume = () => (hovered = false);
    const touched = () => (touchedUntil = Date.now() + RESUME_AFTER_TOUCH_MS);

    track.addEventListener("scroll", onScroll, { passive: true });
    track.addEventListener("pointerenter", pause);
    track.addEventListener("pointerleave", resume);
    track.addEventListener("focusin", pause);
    track.addEventListener("focusout", resume);
    track.addEventListener("touchstart", touched, { passive: true });
    track.addEventListener("wheel", touched, { passive: true });

    return () => {
      window.clearInterval(timer);
      window.clearTimeout(settle);
      io.disconnect();
      track.removeEventListener("scroll", onScroll);
      track.removeEventListener("pointerenter", pause);
      track.removeEventListener("pointerleave", resume);
      track.removeEventListener("focusin", pause);
      track.removeEventListener("focusout", resume);
      track.removeEventListener("touchstart", touched);
      track.removeEventListener("wheel", touched);
    };
  }, [items.length]);

  return (
    <ul ref={trackRef} className="press-logos">
      {items.map((m) => (
        <PressCard key={m.nom} m={m} clone={false} />
      ))}
      {items.map((m) => (
        <PressCard key={`${m.nom}-clone`} m={m} clone />
      ))}
    </ul>
  );
}
