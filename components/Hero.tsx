"use client";

import Image from "next/image";
import { ButtonLink, Container } from "@/components/ui";
import { JourneyPanel } from "@/components/JourneyPanel";
import { FinancialRoadmap } from "@/components/FinancialRoadmap";
import { IconArrowRight, IconCal, IconClock, IconDownload, IconMap, IconPhone, IconUsers, IconBook } from "@/components/icons";

/** Easy-to-edit hero facts — update these when dates lock in. */
const HERO_INFO = {
  rentree: "30 octobre 2026",
  candidaturesUntil: "16 octobre 2026",
  places: "25 places",
} as const;

const STATS = [
  { value: "20", label: "jours de formation", Icon: IconCal },
  { value: "8", label: "séminaires", Icon: IconBook },
  { value: "5", label: "mois · Rabat", Icon: IconMap },
  { value: "25", label: "places · promo 1", Icon: IconUsers },
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
          <span className="hero-cinematic__glow" />
        </div>

        <Container className="hero-cinematic__inner relative">
          <div className="hero-cinematic__grid">
            <div className="hero-enter hero-cinematic__copy">
              <header className="hero-cinematic__identity">
                <p className="hero-cinematic__eyebrow">
                  Certificat exécutif · Groupe ISCAE × BDO Maroc
                </p>
                <p className="hero-cinematic__brand">CFO 4.0</p>
              </header>

              <div className="hero-cinematic__message">
                <h1 className="hero-cinematic__title">
                  Pilotez la transformation de votre direction financière.
                </h1>
                <p className="hero-cinematic__lead">
                  20 jours sur 5 mois à Rabat. Un projet appliqué à votre entreprise, défendu devant
                  un jury ISCAE × BDO.
                </p>
              </div>

              <ul className="hero-cinematic__facts" aria-label="Informations clés">
                <li>
                  <IconCal />
                  <span>
                    Rentrée <strong>{HERO_INFO.rentree}</strong>
                  </span>
                </li>
                <li>
                  <IconClock />
                  <span>
                    Clôture <strong>{HERO_INFO.candidaturesUntil}</strong>
                  </span>
                </li>
                <li>
                  <IconUsers />
                  <span>
                    <strong>{HERO_INFO.places}</strong>
                  </span>
                </li>
              </ul>

              <div className="hero-cinematic__actions">
                <div className="hero-cinematic__ctas">
                  <ButtonLink href="/candidater" className="hero-cinematic__cta-primary">
                    <IconArrowRight />
                    Candidater
                  </ButtonLink>
                  <ButtonLink
                    href="/ressources#brochure"
                    variant="ghost"
                    className="hero-cinematic__cta-secondary"
                  >
                    <IconDownload />
                    Recevoir la brochure
                  </ButtonLink>
                </div>
                <a href="/admissions#rappel" className="hero-cinematic__rappel">
                  <IconPhone />
                  Être rappelé sous 48&nbsp;h
                </a>
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
              {STATS.map(({ value, label, Icon }, i) => (
                <div
                  key={label}
                  className="hero-cinematic__stat"
                  style={{ animationDelay: `${0.4 + i * 0.06}s` }}
                >
                  <dt className="sr-only">{label}</dt>
                  <dd>
                    <span className="hero-cinematic__stat-icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <p className="hero-cinematic__stat-value">{value}</p>
                    <p className="hero-cinematic__stat-label">{label}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </Container>
        </div>
      </section>

      <JourneyPanel />
    </>
  );
}
