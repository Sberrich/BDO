import Image from "next/image";
import { ButtonLink, Container } from "@/components/ui";
import { JourneyPanel } from "@/components/JourneyPanel";
import { SHOW } from "@/lib/content";
import { IconArrowRight, IconCal, IconDownload, IconPin, IconUsers } from "@/components/icons";

/** Easy-to-edit hero facts — update these when dates lock in. */
const HERO_INFO = {
  cloture: "22 octobre",
  rentree: "30 octobre 2026",
  lieu: "Casablanca",
  places: "25 places",
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
      <section id="hero" className="hero-light">
        <Container className="hero-light__inner">
          <div className="hero-light__copy hero-enter">
            <p className="hero-light__badge">
              <span className="hero-light__dot" aria-hidden="true" />
              Candidatures ouvertes jusqu’au {HERO_INFO.cloture}
            </p>

            <p className="hero-light__brand">
              CFO <span>4.0</span>
            </p>
            <h1 className="hero-light__title">
              Pilotez la transformation de votre direction financière.
            </h1>
            <p className="hero-light__lead">
              Le certificat exécutif du Groupe ISCAE et de BDO Maroc : trois mois pour
              conduire un projet appliqué à votre entreprise, du diagnostic à la mise en œuvre.
            </p>

            <div className="hero-light__actions">
              <ButtonLink href="/candidater" className="hero-light__cta">
                Candidater
                <IconArrowRight />
              </ButtonLink>
              <ButtonLink href="/ressources/brochure" variant="ghost" className="hero-light__cta is-ghost">
                <IconDownload />
                Recevoir la brochure
              </ButtonLink>
            </div>

            <ul className="hero-light__facts">
              <li>
                <IconCal />
                Rentrée le {HERO_INFO.rentree}
              </li>
              <li>
                <IconPin />
                {HERO_INFO.lieu}
              </li>
              <li>
                <IconUsers />
                {HERO_INFO.places}
              </li>
            </ul>
          </div>

          <div className="hero-light__media hero-panel-enter" aria-hidden="true">
            <Image
              src="/images/home/iscae-entrance.png"
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 34rem, 0px"
              className="hero-light__photo"
            />
          </div>
        </Container>

        <Container className="hero-light__proof">
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
                    <Image src={p.src} alt={p.name} width={p.w} height={p.h} sizes="100px" />
                  </span>
                  <span className="hero-cosign__role">{p.role}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {SHOW.parcours ? <JourneyPanel /> : null}
    </>
  );
}
