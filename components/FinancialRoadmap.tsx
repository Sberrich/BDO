"use client";

const STEPS = [
  { label: "Diagnostic", note: "données & maturité" },
  { label: "Stratégie", note: "priorités & business case" },
  { label: "Transformation", note: "pilote & conduite" },
  { label: "Performance", note: "jury & indicateurs" },
] as const;

/** Compact parcours card — links to the programme section. */
export function FinancialRoadmap() {
  return (
    <a href="#programme" className="hero-parcours" aria-label="Votre parcours en 4 étapes — voir le programme">
      <p className="hero-parcours__title">Votre parcours en 4 étapes</p>
      <ol className="hero-parcours__steps">
        {STEPS.map((step, i) => (
          <li key={step.label} className="hero-parcours__step">
            <span className="hero-parcours__num" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="hero-parcours__body">
              <span className="hero-parcours__label">{step.label}</span>
              <span className="hero-parcours__note">{step.note}</span>
            </span>
          </li>
        ))}
      </ol>
    </a>
  );
}
