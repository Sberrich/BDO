"use client";

import { WireframeGlobe } from "@/components/WireframeGlobe";

export type HeroMotif = "globe" | "mesh" | "rings" | "nodes" | "none";

type Props = {
  motif?: HeroMotif;
};

/** Decorative hero motifs — trophee-inspired, unique per section. */
export function HeroDecor({ motif = "globe" }: Props) {
  if (motif === "none") return null;

  if (motif === "globe") {
    return (
      <div className="hero-decor hero-decor--globe" aria-hidden="true">
        <span className="hero-decor__orb is-a">
          <WireframeGlobe size={440} intensity={0.95} />
        </span>
        <span className="hero-decor__orb is-b">
          <WireframeGlobe size={280} reverse intensity={0.7} />
        </span>
      </div>
    );
  }

  if (motif === "mesh") {
    return (
      <div className="hero-decor hero-decor--mesh" aria-hidden="true">
        <span className="hero-decor__mesh" />
        <span className="hero-decor__scan" />
      </div>
    );
  }

  if (motif === "rings") {
    return (
      <div className="hero-decor hero-decor--rings" aria-hidden="true">
        <span className="hero-decor__ring is-1" />
        <span className="hero-decor__ring is-2" />
        <span className="hero-decor__ring is-3" />
        <span className="hero-decor__core" />
      </div>
    );
  }

  return (
    <div className="hero-decor hero-decor--nodes" aria-hidden="true">
      <svg className="hero-decor__svg" viewBox="0 0 600 320" fill="none">
        <g className="hero-decor__links" stroke="rgba(227,6,19,0.35)" strokeWidth="1">
          <path d="M80 220 L180 120 L320 160 L420 80 L520 140" />
          <path d="M140 260 L260 200 L380 240 L480 180" />
          <path d="M200 80 L280 140 L360 100 L460 200" />
        </g>
        {[
          [80, 220],
          [180, 120],
          [320, 160],
          [420, 80],
          [520, 140],
          [140, 260],
          [260, 200],
          [380, 240],
          [480, 180],
          [200, 80],
          [280, 140],
          [360, 100],
          [460, 200],
        ].map(([x, y], i) => (
          <circle
            key={`${x}-${y}`}
            className="hero-decor__node"
            cx={x}
            cy={y}
            r={i % 3 === 0 ? 4.5 : 3}
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </svg>
    </div>
  );
}
