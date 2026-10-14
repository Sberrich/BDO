"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { IconArrowRight, IconArrowUpRight } from "@/components/icons";
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
const RESUME_AFTER_INTERACTION_MS = 4000;

function PressCard({ m, clone }: { m: MediaItem; clone: boolean }) {
  return (
    <li className="press-track__item" aria-hidden={clone || undefined}>
      <a
        href={m.lien}
        target="_blank"
        rel="noopener noreferrer"
        className="press-card"
        aria-label={`${plain(m.nom)} : ${plain(m.titre)} (nouvel onglet)`}
        tabIndex={clone ? -1 : undefined}
      >
        <span className="press-card__logo">
          <Image src={m.logo} alt="" width={240} height={64} className="press-card__img" />
        </span>
        <span className="press-card__title">{plain(m.titre)}</span>
        <span className="press-card__foot">
          <span className="press-card__src">
            <span className="press-card__name">{plain(m.nom)}</span>
            <span className="press-card__host">{m.domaine}</span>
          </span>
          <span className="press-card__go" aria-hidden="true">
            <IconArrowUpRight />
          </span>
        </span>
      </a>
    </li>
  );
}

/** Press carousel: swipe or arrows, autoplay one card every 2 s, endless loop (the list is rendered twice). */
export function MediaPressStrip({ items, children }: { items: readonly MediaItem[]; children?: ReactNode }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const interactedUntil = useRef(0);
  const [active, setActive] = useState(0);
  const n = items.length;

  const metrics = useCallback(() => {
    const track = trackRef.current;
    const cards = track?.querySelectorAll<HTMLElement>(".press-track__item");
    if (!track || !cards || cards.length < 2) return null;
    const step = cards[1].offsetLeft - cards[0].offsetLeft;
    const loop = cards.length > n ? cards[n].offsetLeft - cards[0].offsetLeft : 0;
    return { track, step, loop };
  }, [n]);

  const go = useCallback(
    (dir: 1 | -1) => {
      const m = metrics();
      if (!m) return;
      interactedUntil.current = Date.now() + RESUME_AFTER_INTERACTION_MS;
      if (dir < 0 && m.track.scrollLeft < 2 && m.loop) {
        m.track.scrollTo({ left: m.loop, behavior: "instant" });
      }
      m.track.scrollBy({ left: dir * m.step, behavior: "smooth" });
    },
    [metrics],
  );

  const goTo = useCallback(
    (i: number) => {
      const m = metrics();
      if (!m) return;
      interactedUntil.current = Date.now() + RESUME_AFTER_INTERACTION_MS;
      m.track.scrollTo({ left: i * m.step, behavior: "smooth" });
    },
    [metrics],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let settle = 0;
    let frame = 0;

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const m = metrics();
        if (m?.step) setActive(Math.round(track.scrollLeft / m.step) % n);
      });
      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        const m = metrics();
        if (m?.loop && track.scrollLeft >= m.loop - 2) {
          track.scrollTo({ left: track.scrollLeft - m.loop, behavior: "instant" });
        }
      }, 120);
    };
    track.addEventListener("scroll", onScroll, { passive: true });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => track.removeEventListener("scroll", onScroll);
    }

    let visible = false;
    let hovered = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.4 });
    io.observe(track);
    const timer = window.setInterval(() => {
      if (!visible || hovered || document.hidden || Date.now() < interactedUntil.current) return;
      const m = metrics();
      if (m) track.scrollBy({ left: m.step, behavior: "smooth" });
    }, AUTOPLAY_MS);

    const pause = () => (hovered = true);
    const resume = () => (hovered = false);
    const touched = () => (interactedUntil.current = Date.now() + RESUME_AFTER_INTERACTION_MS);
    track.addEventListener("pointerenter", pause);
    track.addEventListener("pointerleave", resume);
    track.addEventListener("focusin", pause);
    track.addEventListener("focusout", resume);
    track.addEventListener("touchstart", touched, { passive: true });
    track.addEventListener("wheel", touched, { passive: true });

    return () => {
      window.clearInterval(timer);
      window.clearTimeout(settle);
      cancelAnimationFrame(frame);
      io.disconnect();
      track.removeEventListener("scroll", onScroll);
      track.removeEventListener("pointerenter", pause);
      track.removeEventListener("pointerleave", resume);
      track.removeEventListener("focusin", pause);
      track.removeEventListener("focusout", resume);
      track.removeEventListener("touchstart", touched);
      track.removeEventListener("wheel", touched);
    };
  }, [metrics, n]);

  return (
    <div className="press-carousel">
      <div className="press-carousel__head">
        <div className="press-carousel__heading">{children}</div>
        <div className="press-carousel__nav">
          <button type="button" className="press-carousel__arrow is-prev" onClick={() => go(-1)} aria-label="Média précédent">
            <IconArrowRight />
          </button>
          <button type="button" className="press-carousel__arrow" onClick={() => go(1)} aria-label="Média suivant">
            <IconArrowRight />
          </button>
        </div>
      </div>

      <ul ref={trackRef} className="press-track">
        {items.map((m) => (
          <PressCard key={m.nom} m={m} clone={false} />
        ))}
        {items.map((m) => (
          <PressCard key={`${m.nom}-clone`} m={m} clone />
        ))}
      </ul>

      <div className="press-carousel__dots">
        {items.map((m, i) => (
          <button
            key={m.nom}
            type="button"
            className={`press-carousel__dot${i === active ? " is-active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Afficher ${plain(m.nom)}`}
            aria-current={i === active || undefined}
          />
        ))}
      </div>
    </div>
  );
}
