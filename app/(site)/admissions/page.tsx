import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarTable } from "@/components/CalendarTable";
import { DeadlineCountdown } from "@/components/DeadlineCountdown";
import { FaqList } from "@/components/FaqList";
import { LeadForm } from "@/components/LeadForm";
import { PricingBlock } from "@/components/PricingBlock";
import { ButtonLink, Container, KickerIcon, SectionHeading } from "@/components/ui";
import { IconArrowRight, IconBook, IconChart, IconClock, IconGauge, IconUsers } from "@/components/icons";
import { data, SHOW } from "@/lib/content";
import { plain } from "@/lib/text";

export const metadata: Metadata = {
  title: "Admissions",
  description: SHOW.tarif
    ? "Tarif, éligibilité, financement et processus d’admission du certificat CFO 4.0."
    : "Éligibilité, financement et processus d’admission du certificat CFO 4.0.",
};

const PROFILE_ICONS = [IconUsers, IconChart, IconGauge, IconBook];

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
              <div className="sem-hero__ctas">
                <ButtonLink href="/candidater" className="sem-hero__cta-primary">
                  Déposer ma candidature
                  <IconArrowRight />
                </ButtonLink>
                <ButtonLink href="#rappel" variant="ghost" className="sem-hero__cta-secondary">
                  Être rappelé sous 24 h
                </ButtonLink>
              </div>
            </div>

            <section className="adm-facts" aria-label="L’essentiel">
              <p className="adm-facts__title">L’essentiel</p>
              <dl className="adm-facts__grid">
                <div className="adm-fact">
                  <dt>
                    <span className="adm-fact__icon" aria-hidden="true"><IconUsers /></span>
                    Places
                  </dt>
                  <dd>
                    <strong>25</strong>
                    <span>participants par promotion</span>
                  </dd>
                </div>
                <div className="adm-fact">
                  <dt>
                    <span className="adm-fact__icon" aria-hidden="true"><IconClock /></span>
                    Réponse
                  </dt>
                  <dd>
                    <strong>{a.delaiReponse}</strong>
                    <span>après réception du dossier complet</span>
                  </dd>
                </div>
                {SHOW.tarif ? (
                  <div className="adm-fact is-wide">
                    <dt>Tarif</dt>
                    <dd>
                      <a href="#tarif">Détail et conditions ci-dessous</a>
                    </dd>
                  </div>
                ) : null}
              </dl>
              <DeadlineCountdown className="adm-facts__countdown" />
            </section>
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
          <p className="adm-prereq">
            <span className="adm-prereq__label">À préparer</span>
            {a.pieces.join(" ; ")}.
          </p>
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
            <div className="adm-faq__ctas">
              <ButtonLink href="/faq" variant="ghost" className="adm-faq__all">
                Voir toutes les questions
                <IconArrowRight />
              </ButtonLink>
              <a href="#rappel" className="adm-faq__rappel">
                Une autre question ? Être rappelé
              </a>
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
            <div className="rappel-band__media">
              <Image
                src="/images/home/hero.png"
                alt="Participants du certificat CFO 4.0 échangeant autour d’un ordinateur"
                fill
                sizes="(min-width: 768px) 34rem, 100vw"
                className="object-cover object-center"
              />
            </div>
            <div className="rappel-band__text">
              <p className="max-w-2xl text-lg leading-relaxed text-muted">
                Le financement, l’éligibilité, la compatibilité avec votre agenda : certaines questions se
                règlent mieux au téléphone.
              </p>
              <p className="mt-4 text-sm">
                Vous pouvez aussi écrire à{" "}
                <a className="font-semibold text-blue" href={`mailto:${plain(c.email)}`}>{plain(c.email)}</a>.
              </p>
            </div>
          </div>
          <div className="rappel-band__card rounded-md bg-white p-6 sm:p-8">
            <LeadForm kind="rappel" prefix="r" />
          </div>
        </Container>
      </section>
    </>
  );
}
