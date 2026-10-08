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
  { name: "Ordre des Experts Comptables", src: "/images/partenaires/oec.png", w: 368, h: 262, size: "is-oec" },
  { name: "Groupe ISCAE", src: "/images/logo-iscae-header.png", w: 351, h: 184, size: "is-iscae" },
  { name: "BDO Maroc", src: "/images/logo-bdo-header.png", w: 418, h: 161, size: "is-bdo" },
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
          <Container className="hero-cinematic__partners">
            <p className="hero-cinematic__partners-label">En partenariat avec</p>
            <ul className="hero-cinematic__logos">
              {PARTNERS.map((p) => (
                <li key={p.name} className={`hero-cinematic__logo ${p.size}`}>
                  <Image src={p.src} alt={p.name} width={p.w} height={p.h} />
                </li>
              ))}
            </ul>
          </Container>
        </div>
      </section>

      {SHOW.parcours ? <JourneyPanel /> : null}
    </>
  );
}
