import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LeadForm } from "@/components/LeadForm";
import { ButtonLink, Container, KickerIcon } from "@/components/ui";
import { getIntervenants } from "@/lib/cms";
import { allSessions, BRAND, data, SHOW } from "@/lib/content";
import { facultyShowcase } from "@/lib/faculty-roster";
import { personLinkedIn, personPhoto, plain } from "@/lib/text";
import { IconArrowRight, IconArrowUpRight, IconBook, IconCert, IconGlobe, IconTrophy, IconMail, IconMap, IconPhone, IconWhatsApp } from "@/components/icons";

export const metadata: Metadata = {
  title: "À propos",
  description: "Le Groupe ISCAE, BDO Maroc et le dispositif du certificat CFO 4.0.",
};

const INST_LOGOS: Record<string, { src: string; alt: string; w: number; h: number; role: string }> = {
  "Groupe ISCAE": { src: "/images/logo-iscae-header.png", alt: "Groupe ISCAE", w: 351, h: 184, role: "Excellence académique" },
  "BDO Maroc": { src: "/images/logo-bdo-header.png", alt: "BDO", w: 418, h: 161, role: "Expertise terrain" },
};

/** Hero mosaic: each institution's logo (to its site), photos, key facts and a contact tile. */
const ABOUT_TILES: (
  | { src: string }
  | { logo: string; alt: string; href: string; w: number; h: number }
  | { icon: () => React.JSX.Element; num: string; unit: string; label: string; dark?: boolean }
)[] = [
  { logo: "/images/logo-iscae-header.png", alt: "Groupe ISCAE", href: "https://www.groupeiscae.ma", w: 351, h: 184 },
  { src: "/images/home/iscae-entrance.png" },
  { icon: IconBook, num: "1971", unit: "", label: "Groupe ISCAE, école pionnière" },
  { src: "/images/home/conference.png" },
  { icon: IconCert, num: "2", unit: "institutions", label: "une signature commune", dark: true },
  { src: "/images/home/about.png" },
  { icon: IconGlobe, num: "5e", unit: "réseau", label: "mondial d’audit · BDO" },
  { logo: "/images/logo-bdo-header.png", alt: "BDO Maroc", href: "https://www.bdo.ma", w: 418, h: 161 },
];

export default async function AProposPage() {
  const c = data.site.contact;
  const seminarCount = allSessions().filter((s) => s.numero > 0).length;
  const facts = [
    { value: String(seminarCount), label: "séminaires" },
    { value: String(facultyShowcase().length), label: "intervenants" },
    { value: "25", label: "places par promotion" },
    { value: "Oct → déc.", label: "calendrier 2026" },
    { value: "Casablanca", label: "lieu des séminaires · ouverture à Rabat" },
  ];
  const speakers = await getIntervenants();
  const zakaria =
    speakers.find((p) => p.slug === "zakaria-fahim") ||
    speakers.find((p) => /zakaria|fahim/i.test(p.nom));
  const linkedin = zakaria ? personLinkedIn(zakaria.linkedin) : "";
  const photo = zakaria
    ? personPhoto(zakaria.photo, zakaria.slug)
    : "/images/people/zakaria-fahim-grey.png";

  return (
    <>
      <section className="sem-hero about-hero2" aria-labelledby="about-title">
        <Container className="sem-hero__inner">
          <nav className="sem-hero__crumbs" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span>À propos</span>
          </nav>
          <div className="sem-hero__grid-layout">
            <div className="sem-hero__copy">
              <p className="sem-hero__index">
                <span className="sem-hero__badge"><KickerIcon label="À propos" bare />À propos</span>
                Groupe ISCAE × BDO Maroc
              </p>
              <h1 id="about-title" className="sem-hero__title">
                Deux institutions, une signature commune
              </h1>
              <p className="sem-hero__lead">{data.site.cosignature}.</p>
              <div className="sem-hero__ctas">
                <ButtonLink href="#contact" className="sem-hero__cta-primary">
                  Écrire à l’équipe
                  <IconArrowRight />
                </ButtonLink>
                <ButtonLink href="/programme" variant="ghost" className="sem-hero__cta-secondary">
                  Voir le programme
                </ButtonLink>
              </div>
            </div>

            <ul className="iv-faces is-admissions is-about" aria-label="Institutions cosignataires">
              {ABOUT_TILES.map((t, i) => (
                <li key={i} className={`iv-faces__item is-${i + 1}`} aria-hidden={"src" in t || undefined}>
                  {"src" in t ? (
                    <span className="iv-faces__link">
                      <Image src={t.src} alt="" fill sizes="180px" className="iv-faces__img" />
                    </span>
                  ) : "logo" in t ? (
                    <a
                      href={t.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="iv-faces__link iv-faces__logo"
                      aria-label={`${t.alt} (site officiel, nouvel onglet)`}
                    >
                      <Image src={t.logo} alt="" width={t.w} height={t.h} className="iv-faces__logo-img" />
                      <span className="iv-faces__logo-go" aria-hidden="true">
                        <IconArrowUpRight />
                      </span>
                    </a>
                  ) : (
                    <span className={`iv-faces__link iv-faces__stat${t.dark ? " is-dark" : ""}`}>
                      <span className="iv-faces__stat-icon" aria-hidden="true"><t.icon /></span>
                      <strong>
                        {t.num}
                        <small>{t.unit}</small>
                      </strong>
                      <span>{t.label}</span>
                    </span>
                  )}
                </li>
              ))}
              <li className="iv-faces__item">
                <a href="#contact" className="iv-faces__link iv-faces__more is-cta">
                  <IconMail />
                  <span className="iv-faces__more-label">Écrire à l’équipe</span>
                </a>
              </li>
            </ul>
          </div>
        </Container>
      </section>

      <section className="about-facts" aria-label="Le certificat en bref">
        <Container>
          <dl className="about-facts__list">
            {facts.map((f) => (
              <div key={f.label} className="about-facts__item">
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="about-inst" aria-labelledby="about-inst-title">
        <Container className="about-inst__inner">
          <header className="about-inst__head">
            <p className="about-inst__index"><KickerIcon label="Les institutions" />Les institutions</p>
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
                  {logo ? <p className="about-card__role">{logo.role}</p> : null}
                  <h3 className="about-card__title">{x.titre}</h3>
                  <p className="about-card__text">{x.texte}</p>
                  <ul className="about-card__points">
                    {x.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <a
                    href={x.lien}
                    className="about-card__link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="about-card__link-site" aria-hidden="true">
                      <IconGlobe />
                    </span>
                    {x.lienLibelle}
                    <span className="sr-only"> (nouvel onglet)</span>
                    <IconArrowUpRight />
                  </a>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <section id="trophee" className="about-trophee" aria-labelledby="trophee-title">
        <Container className="about-trophee__inner">
          <div className="about-trophee__panel">
            <p className="about-trophee__kicker"><KickerIcon label="Le dispositif BDO" />Le dispositif BDO</p>
            <h2 id="trophee-title" className="about-trophee__title">
              Le Trophée BDO des DAF
            </h2>
            <p className="about-trophee__text">
              Le rendez-vous annuel des directions financières marocaines. Ses lauréats
              bénéficient de conditions particulières pour le certificat.
            </p>
            <a
              href="https://www.tropheebdo.ma/"
              target="_blank"
              rel="noopener noreferrer"
              className="about-trophee__link"
            >
              Découvrir le Trophée
              <IconArrowRight />
            </a>
          </div>
          <section className="about-trophee__perk" aria-label="Avantage lauréats">
            <span className="about-trophee__icon">
              <IconTrophy />
            </span>
            <p className="about-trophee__perk-kicker">Lauréats du Trophée</p>
            <p className="about-trophee__perk-title">Conditions particulières pour le certificat</p>
            <Link href={SHOW.tarif ? "/admissions#tarif" : "/admissions#rappel"} className="about-trophee__perk-link">
              {SHOW.tarif ? "Voir le tarif" : "Nous contacter"}
              <IconArrowRight />
            </Link>
          </section>
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
              <p className="about-lead__kicker"><KickerIcon label="Signature pédagogique" />Signature pédagogique</p>
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
            <p className="about-contact__kicker"><KickerIcon label="Contact" />Contact</p>
            <h2 id="contact-title" className="about-contact__title">
              Écrire à l’équipe
            </h2>
            <p className="about-contact__lead">
              Une question sur le cycle, le tarif ou votre dossier ? Laissez vos
              coordonnées : rappel sous 24 h.
            </p>

            <ul className="about-contact__cards">
              <li>
                <a className="about-contact__card" href={`mailto:${plain(c.email)}`}>
                  <span className="about-contact__icon" aria-hidden>
                    <IconMail />
                  </span>
                  <span className="about-contact__card-body">
                    <span className="about-contact__label">E-mail</span>
                    <span className="about-contact__value">{plain(c.email)}</span>
                  </span>
                </a>
              </li>
              <li>
                <a className="about-contact__card" href={BRAND.phoneHref}>
                  <span className="about-contact__icon" aria-hidden>
                    <IconPhone />
                  </span>
                  <span className="about-contact__card-body">
                    <span className="about-contact__label">Téléphone</span>
                    <span className="about-contact__value">{plain(c.telephone)}</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  className="about-contact__card is-wa"
                  href={BRAND.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="about-contact__icon" aria-hidden>
                    <IconWhatsApp />
                  </span>
                  <span className="about-contact__card-body">
                    <span className="about-contact__label">WhatsApp</span>
                    <span className="about-contact__value">Écrire maintenant</span>
                  </span>
                </a>
              </li>
              <li>
                <div className="about-contact__card is-static">
                  <span className="about-contact__icon" aria-hidden>
                    <IconMap />
                  </span>
                  <span className="about-contact__card-body">
                    <span className="about-contact__label">Lieu & adresse</span>
                    <span className="about-contact__value">{plain(c.lieuFormation)}</span>
                    <span className="about-contact__sub">{c.adresseIscae}</span>
                  </span>
                </div>
              </li>
            </ul>
          </div>

          <div className="about-contact__form-wrap">
            <div className="about-contact__form-head">
              <p className="about-contact__form-kicker">Rappel</p>
              <h3 className="about-contact__form-title">Être rappelé sous 24 h</h3>
              <p className="about-contact__form-lead">
                Indiquez vos coordonnées : un membre de l’équipe vous joint rapidement.
              </p>
            </div>
            <div className="about-contact__form">
              <LeadForm kind="rappel" prefix="p" />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
