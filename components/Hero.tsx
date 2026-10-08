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

const STATS = [
  { value: "111", label: "heures de formation" },
  { value: "8", label: "séminaires + workshop" },
  { value: "9", label: "séances, d’octobre à décembre" },
  { value: "25", label: "places · promo 1" },
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
                <span className="hero-cinematic__badge">Certificat exécutif</span>
                Groupe ISCAE × BDO Maroc
              </p>

              <p className="hero-cinematic__brand">CFO 4.0</p>

              <TypeWrite
                as="h1"
                className="hero-cinematic__title"
                text="Pilotez la transformation de votre direction financière."
                speed={18}
                startDelay={420}
                startOnMount
              />

              <p className="hero-cinematic__lead">
                D’octobre à décembre 2026, un projet appliqué à votre
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
                  <dt>Lieux</dt>
                  <dd>Rabat · Casablanca</dd>
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
            <dl className="hero-cinematic__stats">
              {STATS.map(({ value, label }, i) => (
                <div
                  key={label}
                  className="hero-cinematic__stat"
                  style={{ animationDelay: `${0.4 + i * 0.06}s` }}
                >
                  <dt className="sr-only">{label}</dt>
                  <dd>
                    <p className="hero-cinematic__stat-value">{value}</p>
                    <p className="hero-cinematic__stat-label">{label}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </Container>
        </div>
      </section>

      {SHOW.parcours ? <JourneyPanel /> : null}
    </>
  );
}
