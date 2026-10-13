"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

const STEPS = [
  {
    label: "Diagnostic",
    note: "données & maturité",
    detail: "Cartographier la maturité digitale de la direction financière.",
  },
  {
    label: "Stratégie",
    note: "priorités & business case",
    detail: "Prioriser les chantiers et construire le business case.",
  },
  {
    label: "Transformation",
    note: "pilote & conduite",
    detail: "Piloter le déploiement et la conduite du changement.",
  },
  {
    label: "Performance",
    note: "indicateurs & gains",
    detail: "Mesurer et ancrer durablement les gains de la transformation.",
  },
] as const;

const INTERVAL_MS = 3800;

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Clean BDO-style parcours switcher — one étape at a time. */
export function FinancialRoadmap() {
  const labelId = useId();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduce, setReduce] = useState(false);
  const timerRef = useRef<number | null>(null);

  const goTo = useCallback((index: number) => {
    setActive(((index % STEPS.length) + STEPS.length) % STEPS.length);
  }, []);

  useEffect(() => {
    queueMicrotask(() => setReduce(prefersReducedMotion()));
  }, []);

  useEffect(() => {
    if (paused || reduce) return;
    timerRef.current = window.setInterval(() => {
      setActive((i) => (i + 1) % STEPS.length);
    }, INTERVAL_MS);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [paused, reduce, active]);

  return (
    <div
      className="hero-parcours"
      role="region"
      aria-labelledby={labelId}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div className="hero-parcours__head">
        <p id={labelId} className="hero-parcours__title">
          Votre parcours en 4 étapes
        </p>
        <a href="#programme" className="hero-parcours__cta">
          Programme
          <span aria-hidden="true">→</span>
        </a>
      </div>

      <ol
        className="hero-parcours__list"
        aria-label="Étapes du parcours"
      >
        {STEPS.map((s, i) => {
          const selected = i === active;
          return (
            <li
              key={s.label}
              className={`hero-parcours__item${selected ? " is-active" : ""}${i < active ? " is-done" : ""}`}
            >
              <button
                type="button"
                aria-expanded={selected}
                aria-controls={selected ? `hero-step-panel-${i}` : undefined}
                className="hero-parcours__step"
                onClick={() => goTo(i)}
              >
                <span className="hero-parcours__num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="hero-parcours__label">{s.label}</span>
                <span className="hero-parcours__note">{s.note}</span>
              </button>
              {selected ? (
                <div
                  className="hero-parcours__panel"
                  id={`hero-step-panel-${i}`}
                >
                  <p className="hero-parcours__detail">{s.detail}</p>
                  {!reduce ? (
                    <span
                      className={`hero-parcours__timer${paused ? " is-paused" : ""}`}
                      style={{ animationDuration: `${INTERVAL_MS}ms` }}
                      aria-hidden="true"
                    />
                  ) : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
