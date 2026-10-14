"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { IconArrowRight } from "@/components/icons";

const AUTOPLAY_MS = 2000;
const RESUME_AFTER_INTERACTION_MS = 4000;

type Props = {
  /** One element per slide; rendered twice for the endless loop (the copy is inert). */
  slides: ReactNode[];
  /** Accessible name of each slide, for the dots. */
  labels: string[];
  heading?: ReactNode;
  prevLabel: string;
  nextLabel: string;
  className?: string;
};

/** Swipe or arrows, autoplay one slide every 2 s, endless loop, dots. */
export function LoopCarousel({ slides, labels, heading, prevLabel, nextLabel, className = "" }: Props) {
  const trackRef = useRef<HTMLUListElement>(null);
  const interactedUntil = useRef(0);
  const [active, setActive] = useState(0);
  const n = slides.length;

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
    <div className={`press-carousel ${className}`}>
      <div className="press-carousel__head">
        <div className="press-carousel__heading">{heading}</div>
        <div className="press-carousel__nav">
          <button type="button" className="press-carousel__arrow is-prev" onClick={() => go(-1)} aria-label={prevLabel}>
            <IconArrowRight />
          </button>
          <button type="button" className="press-carousel__arrow" onClick={() => go(1)} aria-label={nextLabel}>
            <IconArrowRight />
          </button>
        </div>
      </div>

      <ul ref={trackRef} className="press-track">
        {slides.map((s, i) => (
          <li key={i} className="press-track__item">
            {s}
          </li>
        ))}
        {slides.map((s, i) => (
          <li key={`clone-${i}`} className="press-track__item" aria-hidden="true" inert>
            {s}
          </li>
        ))}
      </ul>

      <div className="press-carousel__dots">
        {labels.map((label, i) => (
          <button
            key={label}
            type="button"
            className={`press-carousel__dot${i === active ? " is-active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={label}
            aria-current={i === active || undefined}
          />
        ))}
      </div>
    </div>
  );
}
