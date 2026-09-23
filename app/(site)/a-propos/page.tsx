import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LeadForm } from "@/components/LeadForm";
import { ButtonLink, Container } from "@/components/ui";
import { getIntervenants } from "@/lib/cms";
import { data } from "@/lib/content";
import { personLinkedIn, personPhoto, plain } from "@/lib/text";
import { IconArrowRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "À propos",
  description: "Le Groupe ISCAE, BDO Maroc et le dispositif du certificat CFO 4.0.",
};

const INST_LOGOS: Record<string, { src: string; alt: string; w: number; h: number }> = {
  "Groupe ISCAE": { src: "/images/logo-iscae.png", alt: "Groupe ISCAE", w: 160, h: 50 },
  "BDO Maroc": { src: "/images/logo-bdo.png", alt: "BDO", w: 120, h: 42 },
};

export default async function AProposPage() {
  const c = data.site.contact;
  const speakers = await getIntervenants();
  const zakaria =
    speakers.find((p) => p.slug === "zakaria-fahim") ||
    speakers.find((p) => /zakaria|fahim/i.test(p.nom));
  const linkedin = zakaria ? personLinkedIn(zakaria.linkedin) : "";
  const photo = zakaria
    ? personPhoto(zakaria.photo, zakaria.slug)
    : "/images/people/zakaria-fahim.jpg";

  return (
    <>
      <header className="about-hero" aria-labelledby="about-title">
        <span className="about-hero__glow" aria-hidden />
        <span className="about-hero__grid" aria-hidden />
        <Container className="about-hero__inner">
          <p className="about-hero__kicker">À propos</p>
          <h1 id="about-title" className="about-hero__title">
            Deux institutions,{" "}
            <em>une signature commune</em>
          </h1>
          <p className="about-hero__lead">{data.site.cosignature}.</p>
          <div className="about-hero__marks" aria-hidden>
            <Image src="/images/logo-iscae.png" alt="" width={140} height={44} className="about-hero__logo is-iscae" />
            <span className="about-hero__x">×</span>
            <Image src="/images/logo-bdo.png" alt="" width={110} height={38} className="about-hero__logo is-bdo" />
          </div>
        </Container>
      </header>

      <section className="about-inst" aria-labelledby="about-inst-title">
        <Container className="about-inst__inner">
          <header className="about-inst__head">
            <p className="about-inst__index">01 — Les institutions</p>
            <h2 id="about-inst-title" className="about-inst__title">
              Qui porte le certificat
            </h2>
          </header>
          <div className="about-inst__grid">
            {data.site.institutions.map((x, i) => {
              const logo = INST_LOGOS[x.nom];
              return (
                <article key={x.nom} className={`about-card is-${i + 1}`}>
                  <span className="about-card__index" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {logo ? (
                    <div className="about-card__logo">
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        width={logo.w}
                        height={logo.h}
                      />
                    </div>
                  ) : null}
                  <h3 className="about-card__title">{x.nom}</h3>
                  <p className="about-card__text">{x.texte}</p>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <section id="trophee" className="about-trophee" aria-labelledby="trophee-title">
        <Container className="about-trophee__inner">
          <div className="about-trophee__panel">
            <p className="about-trophee__kicker">Le dispositif BDO</p>
            <h2 id="trophee-title" className="about-trophee__title">
              Le Trophée BDO des DAF
            </h2>
            <p className="about-trophee__text">
              La rencontre annuelle de la place financière marocaine, qui distingue
              les directions financières les plus engagées dans leur transformation.
              Les lauréats bénéficient de conditions particulières pour le certificat.
            </p>
            <Link href="/ressources/barometre" className="about-trophee__link">
              Découvrir le Baromètre BDO des DAF
              <IconArrowRight />
            </Link>
          </div>
        </Container>
      </section>

      {zakaria ? (
        <section className="about-lead" aria-labelledby="about-lead-title">
          <Container className="about-lead__inner">
            <div className="about-lead__media">
              <Image
                src={photo}
                alt={zakaria.nom}
                fill
                sizes="(min-width: 800px) 22rem, 80vw"
                className="about-lead__img"
                priority
              />
              <span className="about-lead__frame" aria-hidden />
            </div>
            <div className="about-lead__copy">
              <p className="about-lead__kicker">Signature pédagogique</p>
              <h2 id="about-lead-title" className="about-lead__name">
                {zakaria.nom}
              </h2>
              <p className="about-lead__role">
                {zakaria.fonction}
                {zakaria.institution ? ` · ${zakaria.institution}` : ""}
              </p>
              <p className="about-lead__bio">{zakaria.bio}</p>
              <div className="about-lead__actions">
                {linkedin ? (
                  <a
                    href={linkedin}
                    className="about-lead__li"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Profil LinkedIn
                  </a>
                ) : null}
                <ButtonLink href="/intervenants" variant="secondary">
                  Voir les intervenants
                </ButtonLink>
              </div>
            </div>
          </Container>
        </section>
      ) : null}

      <section id="contact" className="about-contact" aria-labelledby="contact-title">
        <Container className="about-contact__inner">
          <div className="about-contact__info">
            <p className="about-contact__kicker">Contact</p>
            <h2 id="contact-title" className="about-contact__title">
              Écrire à l’équipe
            </h2>
            <p className="about-contact__lead">
              Une question sur le cycle, le tarif ou votre dossier ? Laissez vos
              coordonnées — rappel sous 24 h.
            </p>
            <ul className="about-contact__list">
              <li>
                <span className="about-contact__label">E-mail</span>
                <span>{plain(c.email)}</span>
              </li>
              <li>
                <span className="about-contact__label">Téléphone</span>
                <span>{plain(c.telephone)}</span>
              </li>
              <li>
                <span className="about-contact__label">Lieu</span>
                <span>{plain(c.lieuFormation)}</span>
              </li>
              <li>
                <span className="about-contact__label">Adresse</span>
                <span>{c.adresseIscae}</span>
              </li>
            </ul>
            <p className="about-contact__note">
              Coordonnées provisoires — à confirmer avant l’ouverture des candidatures.
            </p>
          </div>
          <div className="about-contact__form">
            <LeadForm kind="rappel" prefix="p" />
          </div>
        </Container>
      </section>
    </>
  );
}
