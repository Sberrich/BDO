import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AdSlider } from "@/components/AdSlider";
import { LeadForm } from "@/components/LeadForm";
import { ButtonLink, Container, KickerIcon, SectionHeading } from "@/components/ui";
import { BRAND, data } from "@/lib/content";
import { plain } from "@/lib/text";
import { IconArrowRight, IconArrowUpRight, IconBook, IconCert, IconGlobe, IconMail, IconPhone, IconPin, IconWhatsApp } from "@/components/icons";

export const metadata: Metadata = {
  title: "À propos",
  description: "Le Groupe ISCAE, BDO Maroc et le dispositif du certificat CFO 4.0.",
};

const INST_LOGOS: Record<string, { src: string; alt: string; w: number; h: number; role: string }> = {
  "Groupe ISCAE": { src: "/images/logo-iscae-lockup.png", alt: "Groupe ISCAE", w: 110, h: 54, role: "Excellence académique" },
  "BDO Maroc": { src: "/images/logo-bdo-lockup.png", alt: "BDO", w: 418, h: 161, role: "Expertise terrain" },
};

/** Hero mosaic: each institution's logo (to its site), photos, key facts and a contact tile. */
const ABOUT_TILES: (
  | { src: string }
  | { logo: string; alt: string; href: string; w: number; h: number }
  | { icon: () => React.JSX.Element; num: string; unit: string; label: string; dark?: boolean }
)[] = [
  { logo: "/images/logo-iscae-lockup.png", alt: "Groupe ISCAE", href: "https://www.groupeiscae.ma", w: 110, h: 54 },
  { src: "/images/home/iscae-entrance.png" },
  { icon: IconBook, num: "1971", unit: "", label: "Groupe ISCAE, école pionnière" },
  { src: "/images/home/conference.png" },
  { icon: IconCert, num: "2", unit: "institutions", label: "une signature commune", dark: true },
  { src: "/images/home/about.png" },
  { icon: IconGlobe, num: "5e", unit: "réseau", label: "mondial d’audit · BDO" },
  { logo: "/images/logo-bdo-lockup.png", alt: "BDO Maroc", href: "https://www.bdo.ma", w: 418, h: 161 },
];

const TROPHY_SLIDES = [
  { src: "/images/trophee/01-laureats-2026.png", alt: "Découvrez les lauréats des 3 catégories du Trophée BDO Digital des CFO’s 2026" },
  { src: "/images/trophee/02-cfo-digital-annee.png", alt: "CFO Digital de l’année 2026 : Ibtissam Tirafi, Ora Technologies" },
  { src: "/images/trophee/03-cfo-digital-grande-entreprise.png", alt: "CFO Digital Grande Entreprise 2026 : Kenza Bennani et Ikram Gouri, CBI" },
  { src: "/images/trophee/04-coup-de-coeur-jury.png", alt: "CFO Digital Coup de cœur du jury 2026 : Sara Blouz, Procia (IT Global Services)" },
  { src: "/images/trophee/05-rendez-vous.png", alt: "À l’année prochaine pour écrire un nouveau chapitre" },
];

export default function AProposPage() {
  const c = data.site.contact;

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
        <Container>
          <div className="trophy-card">
            <div className="trophy-card__copy">
              <Image
                src="/images/logos/trophee-bdo-digital-cfos.png"
                alt="Trophée BDO Digital CFOs"
                width={160}
                height={44}
                className="trophy-card__logo"
              />
              <p className="about-trophee__kicker"><KickerIcon label="Le dispositif BDO" />Le dispositif BDO</p>
              <h2 id="trophee-title" className="trophy-card__title">
                Le Trophée BDO des DAF
              </h2>
              <p className="trophy-card__text">
                Le rendez-vous annuel des directions financières marocaines : il distingue les DAF
                qui portent la transformation digitale de leur organisation.
              </p>
              <a
                href="https://www.tropheebdo.ma/"
                target="_blank"
                rel="noopener noreferrer"
                className="about-card__link"
              >
                <span className="about-card__link-site" aria-hidden="true">
                  <IconGlobe />
                </span>
                Découvrir le Trophée
                <span className="sr-only"> (nouvel onglet)</span>
                <IconArrowUpRight />
              </a>
            </div>

            <AdSlider
              className="trophy-card__media"
              slides={TROPHY_SLIDES}
              label="Lauréats du Trophée BDO Digital des CFO’s 2026"
            />
          </div>
        </Container>
      </section>

      <section id="contact" className="rappel-band py-[clamp(2.5rem,6vw,4.5rem)]">
        <Container className="grid gap-10 md:grid-cols-2">
          <div className="rappel-band__intro">
            <SectionHeading
              kicker="Contact"
              title="Être rappelé sous 24 heures ouvrées"
            />
            <p className="rappel-band__lead">
              Une question sur le cycle, le tarif ou votre dossier ? Le financement,
              l’éligibilité, la compatibilité avec votre agenda : certaines questions se
              règlent mieux au téléphone.
            </p>
            <ul className="rappel-contacts">
              <li className="rappel-contacts__map">
                <div className="rappel-contact is-map">
                  <iframe
                    className="rappel-map"
                    title="Plan d’accès au campus ISCAE Casablanca"
                    src="https://maps.google.com/maps?q=Groupe%20ISCAE%20Casablanca&z=16&hl=fr&iwloc=near&output=embed"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="rappel-map__row">
                    <span className="rappel-contact__icon" aria-hidden="true"><IconPin /></span>
                    <span className="rappel-map__text">
                      <span className="rappel-contact__label">Campus</span>
                      <span className="rappel-contact__value">ISCAE Casablanca</span>
                      <span className="rappel-map__addr">Km 9,5 Route de Nouasseur, Casablanca</span>
                    </span>
                    <a
                      href="https://www.google.com/maps/dir/?api=1&destination=Groupe%20ISCAE%20Casablanca"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rappel-map__go"
                    >
                      Itinéraire
                      <IconArrowRight />
                    </a>
                  </div>
                </div>
              </li>
              <li>
                <a href={BRAND.phoneHref} className="rappel-contact is-row" aria-label={`Téléphone : ${BRAND.phone}`}>
                  <span className="rappel-contact__icon" aria-hidden="true"><IconPhone /></span>
                  <span className="rappel-contact__value">{BRAND.phone}</span>
                </a>
              </li>
              <li>
                <a href={BRAND.whatsapp} target="_blank" rel="noopener noreferrer" className="rappel-contact is-row" aria-label="WhatsApp : écrire un message (nouvel onglet)">
                  <span className="rappel-contact__icon is-wa" aria-hidden="true"><IconWhatsApp /></span>
                  <span className="rappel-contact__value">Écrire un message</span>
                </a>
              </li>
              <li className="rappel-contacts__wide">
                <a href={`mailto:${plain(c.email)}`} className="rappel-contact is-row" aria-label={`E-mail : ${plain(c.email)}`}>
                  <span className="rappel-contact__icon" aria-hidden="true"><IconMail /></span>
                  <span className="rappel-contact__value">
                    {plain(c.email).split("@")[0]}@<wbr />
                    {plain(c.email).split("@")[1]}
                  </span>
                </a>
              </li>
            </ul>
          </div>
          <div className="rappel-band__card rounded-md bg-white p-6 sm:p-8">
            <LeadForm kind="rappel" prefix="p" />
          </div>
        </Container>
      </section>
    </>
  );
}
