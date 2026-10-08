"use client";

import Image from "next/image";
import { ButtonLink, Container } from "@/components/ui";
import { JourneyPanel } from "@/components/JourneyPanel";
import { FinancialRoadmap } from "@/components/FinancialRoadmap";
import { SHOW } from "@/lib/content";
import { TypeWrite } from "@/components/motion";
import { IconArrowRight, IconDownload } from "@/components/icons";

/** Easy-to-edit hero facts — update these when dates lock in. */
const HERO_INFO = {
  rentree: "30 octobre 2026",
  candidaturesUntil: "26 décembre 2026",
} as const;

const PARTNERS = [
  {
    name: "Groupe ISCAE",
    role: "Cosignataire académique",
    src: "/images/logo-iscae-header.png",
    w: 351,
    h: 184,
    size: "is-iscae",
  },
  {
    name: "BDO Maroc",
    role: "Cosignataire professionnel",
    src: "/images/logo-bdo-header.png",
    w: 418,
    h: 161,
    size: "is-bdo",
  },
  {
    name: "Ordre des Experts Comptables",
    role: "Partenaire institutionnel",
    src: "/images/partenaires/oec.png",
    w: 368,
    h: 262,
    size: "is-oec",
  },
] as const;

export function Hero() {
  return (
    <>
      <section id="hero" className="hero-cinematic relative overflow-hidden text-white">
        <div className="hero-cinematic__atmosphere" aria-hidden="true">
          <Image
            src="/images/home/iscae-entrance.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="hero-cinematic__photo"
          />
          <span className="hero-cinematic__smoke" />
        </div>

        <Container className="hero-cinematic__inner relative">
          <div className="hero-cinematic__grid">
            <div className="hero-enter hero-cinematic__copy">
              <p className="hero-cinematic__eyebrow">
                <span className="hero-cinematic__badge">
                  <span className="hero-cinematic__badge-dot" aria-hidden="true" />
                  Candidatures ouvertes
                </span>
                Certificat exécutif · Groupe ISCAE × BDO Maroc
              </p>

              <p className="hero-cinematic__brand">
                CFO <span>4.0</span>
              </p>

              <TypeWrite
                as="h1"
                className="hero-cinematic__title"
                text="Pilotez la transformation de votre direction financière."
                speed={18}
                startDelay={420}
                startOnMount
              />

              <p className="hero-cinematic__lead">
                D’octobre à décembre 2026, à <strong>Rabat</strong> et{" "}
                <strong>Casablanca</strong>&nbsp;: un projet appliqué à votre
                entreprise, du diagnostic à la mise en œuvre.
              </p>

              <dl className="hero-cinematic__facts">
                <div>
                  <dt>Rentrée</dt>
                  <dd>{HERO_INFO.rentree}</dd>
                </div>
                <div>
                  <dt>Clôture</dt>
                  <dd>{HERO_INFO.candidaturesUntil}</dd>
                </div>
                <div>
                  <dt>Format</dt>
                  <dd>111&nbsp;h · 9 séances</dd>
                </div>
              </dl>

              <div className="hero-cinematic__actions">
                <ButtonLink href="/candidater" className="hero-cinematic__cta-primary">
                  Candidater
                  <IconArrowRight />
                </ButtonLink>
                <ButtonLink
                  href="/ressources/brochure"
                  variant="ghost"
                  className="hero-cinematic__cta-secondary"
                >
                  <IconDownload />
                  Recevoir la brochure
                </ButtonLink>
              </div>

            </div>

            <div className="hero-panel-enter relative max-lg:hidden">
              <FinancialRoadmap />
            </div>
          </div>
        </Container>

        <div className="hero-cinematic__proof">
          <Container>
            <div className="hero-cosign">
              <div className="hero-cosign__intro">
                <p className="hero-cosign__kicker">Un certificat cosigné</p>
                <p className="hero-cosign__text">
                  Délivré par le Groupe ISCAE et BDO Maroc, en partenariat avec
                  l’Ordre des Experts Comptables.
                </p>
              </div>
              <ul className="hero-cosign__logos">
                {PARTNERS.map((p, i) => (
                  <li key={p.name} className="hero-cosign__item">
                    {i === 1 ? (
                      <span className="hero-cosign__x" aria-hidden="true">
                        ×
                      </span>
                    ) : null}
                    <span className={`hero-cosign__logo ${p.size}`}>
                      <Image src={p.src} alt={p.name} width={p.w} height={p.h} />
                    </span>
                    <span className="hero-cosign__role">{p.role}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </div>
      </section>

      {SHOW.parcours ? <JourneyPanel /> : null}
    </>
  );
}
