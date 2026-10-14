"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type Slide = { src: string; alt: string };

/** One slide at a time, crossfading; autoplay pauses on hover, focus and reduced motion. */
export function FadeSlider({
  slides,
  label,
  interval = 4500,
  className = "",
}: {
  slides: Slide[];
  label: string;
  interval?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const go = useCallback((to: number) => setIndex(((to % count) + count) % count), [count]);

  useEffect(() => {
    if (paused || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => go(index + 1), interval);
    return () => window.clearTimeout(id);
  }, [index, paused, count, interval, go]);

  return (
    <div
      className={`fade-slider ${className}`}
      role="region"
      aria-roledescription="carrousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="fade-slider__track">
        {slides.map((s, i) => (
          <div
            key={s.src}
            className={`fade-slider__slide${i === index ? " is-active" : ""}`}
            role="group"
            aria-roledescription="diapositive"
            aria-label={`${i + 1} sur ${count}`}
            aria-hidden={i !== index}
          >
            <Image src={s.src} alt={s.alt} fill sizes="(min-width: 860px) 34rem, 100vw" priority={i === 0} />
          </div>
        ))}
      </div>

      {count > 1 ? (
        <div className="fade-slider__nav">
          <button type="button" className="fade-slider__arrow" onClick={() => go(index - 1)} aria-label="Diapositive précédente">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <div className="fade-slider__dots">
            {slides.map((s, i) => (
              <button
                key={s.src}
                type="button"
                className={`fade-slider__dot${i === index ? " is-active" : ""}`}
                onClick={() => go(i)}
                aria-label={`Afficher la diapositive ${i + 1}`}
                aria-current={i === index}
              />
            ))}
          </div>
          <button type="button" className="fade-slider__arrow" onClick={() => go(index + 1)} aria-label="Diapositive suivante">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}
