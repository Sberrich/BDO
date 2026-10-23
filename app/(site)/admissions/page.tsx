import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarTable } from "@/components/CalendarTable";
import { DeadlineCountdown } from "@/components/DeadlineCountdown";
import { FaqList } from "@/components/FaqList";
import { LeadForm } from "@/components/LeadForm";
import { PricingBlock } from "@/components/PricingBlock";
import { ButtonLink, Container, KickerIcon, SectionHeading } from "@/components/ui";
import {
  IconArrowRight,
  IconBook,
  IconCal,
  IconChart,
  IconClock,
  IconGauge,
  IconMail,
  IconPhone,
  IconPin,
  IconUsers,
  IconWhatsApp,
} from "@/components/icons";
import { BRAND, data, SHOW } from "@/lib/content";
import { plain } from "@/lib/text";

export const metadata: Metadata = {
  title: "Admissions",
  description: SHOW.tarif
    ? "Tarif, éligibilité, financement et processus d’admission du certificat CFO 4.0."
    : "Éligibilité, financement et processus d’admission du certificat CFO 4.0.",
};

const PROFILE_ICONS = [IconUsers, IconChart, IconGauge, IconBook];

/** Hero mosaic: photos alternate with the key facts; a « Candidater » tile closes the grid. */
const ADM_TILES: (
  | { src: string }
  | { icon: () => React.JSX.Element; num: string; unit: string; label: string; dark?: boolean }
)[] = [
  { src: "/images/home/campus.png" },
  { icon: IconUsers, num: "25", unit: "places", label: "par promotion" },
  { src: "/images/home/about.png" },
  { icon: IconClock, num: "2", unit: "jours ouvrés", label: "pour la réponse" },
  { src: "/images/home/hero.png" },
  { src: "/images/home/conference.png" },
  { src: "/images/home/objectives.png" },
  { icon: IconCal, num: "22", unit: "oct.", label: "fin des candidatures", dark: true },
];

/** The tarif section above already answers this one. */
const ADM_FAQ_EXCLUDE = ["faq-tarif-montant"];

export default function AdmissionsPage() {
  const a = data.site.admission;
  const c = data.site.contact;
  const tarif = data.site.tarif;
  const jump = [
    ...(SHOW.tarif ? [["#tarif", "Le tarif"]] : []),
    ...(SHOW.calendrier ? [["#calendrier", "Le calendrier"]] : []),
    ["#profil", "L’éligibilité"],
    ["#processus", "Le processus"],
    ["#rappel", "Être rappelé"],
  ];

  return (
    <>
      <section className="sem-hero adm-hero" aria-labelledby="adm-title">
        <Container className="sem-hero__inner">
          <nav className="sem-hero__crumbs" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span>Admissions</span>
          </nav>

          <div className="sem-hero__grid-layout">
            <div className="sem-hero__copy">
              <p className="sem-hero__index">
                <span className="sem-hero__badge"><KickerIcon label="Promotion 1" bare />Promotion 1</span>
                Candidatures ouvertes jusqu’au {plain(a.dateLimite)}
              </p>
              <h1 id="adm-title" className="sem-hero__title">
                Rejoindre le certificat CFO 4.0
              </h1>
              <p className="sem-hero__lead">
                {SHOW.tarif
                  ? "Le tarif, l’éligibilité, le financement et le processus d’admission, en une page."
                  : "L’éligibilité, le financement et le processus d’admission, en une page."}
              </p>
              <nav className="adm-jump" aria-label="Sur cette page">
                {jump.map(([href, label]) => (
                  <a key={href} href={href}>
                    {label}
                  </a>
                ))}
              </nav>
              <DeadlineCountdown className="prog-hero__countdown" />
              <div className="sem-hero__ctas">
                <ButtonLink href="#rappel" variant="ghost" className="sem-hero__cta-secondary">
                  <IconPhone />
                  Être rappelé
                </ButtonLink>
                <ButtonLink href="/candidater" className="sem-hero__cta-primary">
                  Déposer ma candidature
                  <IconArrowRight />
                </ButtonLink>
              </div>
            </div>

            <ul className="iv-faces is-admissions" aria-label="L’essentiel">
              {ADM_TILES.map((t, i) => (
                <li key={i} className={`iv-faces__item is-${i + 1}`} aria-hidden={"src" in t || undefined}>
                  {"src" in t ? (
                    <span className="iv-faces__link">
                      <Image src={t.src} alt="" fill sizes="180px" className="iv-faces__img" />
                    </span>
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
                <Link href="/candidater" className="iv-faces__link iv-faces__more is-cta">
                  <IconArrowRight />
                  <span className="iv-faces__more-label">Candidater</span>
                </Link>
              </li>
            </ul>
          </div>
        </Container>
      </section>

      {SHOW.tarif ? (
      <section id="tarif" className="bg-cream py-[clamp(2.5rem,6vw,4.5rem)]">
        <Container>
          <SectionHeading kicker="Investissement" title="Le tarif" />
          <div className="mt-8">
            <PricingBlock />
          </div>
          <ul className="adm-conds">
            {tarif.conditions.map((cond, i) => (
              <li key={cond.titre} className="adm-cond">
                <span className="adm-cond__num">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="adm-cond__title">{cond.titre}</h3>
                <p className="adm-cond__text">{plain(cond.texte)}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      ) : null}
      {SHOW.calendrier ? (
        <section id="calendrier" className="bg-white py-[clamp(2.5rem,6vw,4.5rem)]">
          <Container>
            <SectionHeading kicker="Calendrier" title={data.calendrier.intitule} lead={data.calendrier.chapeau} />
            <div className="mt-8"><CalendarTable /></div>
          </Container>
        </section>
      ) : null}
      <section id="profil" className="adm-profil" aria-labelledby="adm-profil-title">
        <Container>
          <header className="adm-head">
            <p className="sem-kicker">L’éligibilité</p>
            <h2 id="adm-profil-title" className="adm-head__title">
              {data.site.profil.titre}
            </h2>
            <p className="adm-head__lead">{data.site.profil.chapeau}</p>
          </header>
          <ul className="adm-profiles">
            {data.site.profil.profils.map((p, i) => {
              const Icon = PROFILE_ICONS[i % PROFILE_ICONS.length];
              return (
                <li key={p.titre} className="adm-profile">
                  <span className="adm-profile__icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <h3 className="adm-profile__title">{p.titre}</h3>
                  <p className="adm-profile__text">{p.texte}</p>
                </li>
              );
            })}
          </ul>
          <p className="adm-prereq">
            <span className="adm-prereq__label">Prérequis</span>
            {data.site.profil.prerequis}
          </p>
        </Container>
      </section>

      <section id="processus" className="adm-process" aria-labelledby="adm-process-title">
        <Container>
          <header className="adm-head">
            <p className="sem-kicker">Le processus</p>
            <h2 id="adm-process-title" className="adm-head__title">
              Trois étapes jusqu’à l’inscription
            </h2>
            <p className="adm-head__lead">Réponse sous {a.delaiReponse} après réception du dossier complet.</p>
          </header>
          <ol className="adm-steps">
            {a.etapes.map((x, i) => (
              <li key={x.titre} className="adm-step">
                <span className="adm-step__num">{i + 1}</span>
                <h3 className="adm-step__title">{x.titre}</h3>
                <p className="adm-step__text">{x.texte}</p>
              </li>
            ))}
          </ol>
          <div className="adm-process__cta">
            <ButtonLink href="/candidater" className="sem-hero__cta-primary">
              Commencer mon dossier
              <IconArrowRight />
            </ButtonLink>
            <span>Clôture le {plain(a.dateLimite)}.</span>
          </div>
        </Container>
      </section>

      <section className="adm-faq" aria-labelledby="adm-faq-title">
        <Container className="adm-faq__inner">
          <header className="adm-faq__head">
            <p className="sem-kicker">FAQ</p>
            <h2 id="adm-faq-title" className="adm-head__title">
              Les questions fréquentes
            </h2>
            <p className="adm-head__lead">
              Les réponses aux questions que l’on nous pose le plus sur l’admission et le financement.
            </p>
            <div className="adm-faq__help">
              <span className="rappel-contact__icon" aria-hidden="true">
                <IconPhone />
              </span>
              <p className="adm-faq__help-title">Une autre question ?</p>
              <p className="adm-faq__help-text">
                Un conseiller vous rappelle sous 24 h ouvrées pour en parler, sans engagement.
              </p>
              <div className="adm-faq__help-ctas">
                <ButtonLink href="/faq" variant="ghost">
                  <IconBook />
                  Toutes les questions
                </ButtonLink>
                <ButtonLink href="#rappel">
                  Être rappelé
                  <IconArrowRight />
                </ButtonLink>
              </div>
            </div>
          </header>
          <FaqList onlyHome exclude={ADM_FAQ_EXCLUDE} />
        </Container>
      </section>
      <section id="rappel" className="rappel-band py-[clamp(2.5rem,6vw,4.5rem)]">
        <Container className="grid gap-10 md:grid-cols-2">
          <div className="rappel-band__intro">
            <SectionHeading
              kicker="Parler à quelqu’un"
              title="Être rappelé sous 24 heures ouvrées"
            />
            <p className="rappel-band__lead">
              Le financement, l’éligibilité, la compatibilité avec votre agenda : certaines questions se
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
            <LeadForm kind="rappel" prefix="r" />
          </div>
        </Container>
      </section>
    </>
  );
}
