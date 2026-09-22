"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
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
    note: "jury & indicateurs",
    detail: "Mesurer, défendre et ancrer les gains devant le jury.",
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
  const step = STEPS[active];
  const progress = ((active + 1) / STEPS.length) * 100;

  const goTo = useCallback((index: number) => {
    setActive(((index % STEPS.length) + STEPS.length) % STEPS.length);
  }, []);

  useEffect(() => {
    setReduce(prefersReducedMotion());
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

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      goTo(active + 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      goTo(active - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      goTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      goTo(STEPS.length - 1);
    }
  };

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
      onKeyDown={onKeyDown}
    >
      <div className="hero-parcours__head">
        <div>
          <p id={labelId} className="hero-parcours__title">
            Votre parcours
          </p>
          <p className="hero-parcours__subtitle">En 4 étapes</p>
        </div>
        <a href="#programme" className="hero-parcours__cta">
          Programme
          <span aria-hidden="true">→</span>
        </a>
      </div>

      <div
        className="hero-parcours__track"
        role="tablist"
        aria-label="Étapes du parcours"
      >
        <span className="hero-parcours__line" aria-hidden="true">
          <span
            className="hero-parcours__line-fill"
            style={{ width: `${(active / (STEPS.length - 1)) * 100}%` }}
          />
        </span>
        {STEPS.map((s, i) => {
          const selected = i === active;
          const done = i < active;
          return (
            <button
              key={s.label}
              type="button"
              role="tab"
              id={`hero-step-tab-${i}`}
              aria-selected={selected}
              aria-controls="hero-step-panel"
              tabIndex={selected ? 0 : -1}
              className={`hero-parcours__node ${selected ? "is-active" : ""} ${done ? "is-done" : ""}`}
              onClick={() => goTo(i)}
            >
              <span className="hero-parcours__node-ring" aria-hidden="true" />
              <span className="hero-parcours__node-core">
                {String(i + 1).padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </div>

      <div
        className="hero-parcours__stage"
        role="tabpanel"
        id="hero-step-panel"
        aria-labelledby={`hero-step-tab-${active}`}
        key={step.label}
      >
        <div className="hero-parcours__stage-top">
          <p className="hero-parcours__stage-index">
            Étape {active + 1}
            <span> / {STEPS.length}</span>
          </p>
          <span className="hero-parcours__stage-mark" aria-hidden="true">
            {String(active + 1).padStart(2, "0")}
          </span>
        </div>
        <p className="hero-parcours__stage-label">{step.label}</p>
        <p className="hero-parcours__stage-note">{step.note}</p>
        <p className="hero-parcours__stage-detail">{step.detail}</p>
      </div>

      <div className="hero-parcours__footer" aria-hidden="true">
        <div className="hero-parcours__meter">
          <span
            className="hero-parcours__meter-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="hero-parcours__hint">
          {paused ? "En pause" : "Défile automatiquement"}
        </p>
      </div>
    </div>
  );
}
