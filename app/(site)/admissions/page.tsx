import type { Metadata } from "next";
import Link from "next/link";
import { CalendarTable } from "@/components/CalendarTable";
import { DeadlineCountdown } from "@/components/DeadlineCountdown";
import { FaqList } from "@/components/FaqList";
import { LeadForm } from "@/components/LeadForm";
import { PricingBlock } from "@/components/PricingBlock";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";
import { IconArrowRight, IconChart, IconGauge, IconUsers } from "@/components/icons";
import { data, SHOW } from "@/lib/content";
import { plain } from "@/lib/text";

export const metadata: Metadata = {
  title: "Admissions",
  description: "Tarif, éligibilité, financement et processus d’admission du certificat CFO 4.0.",
};

const PROFILE_ICONS = [IconUsers, IconChart, IconGauge];

export default function AdmissionsPage() {
  const a = data.site.admission;
  const c = data.site.contact;
  const tarif = data.site.tarif;
  const jump = [
    ["#tarif", "Le tarif"],
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
                <span className="sem-hero__badge">Promotion 1</span>
                Candidatures ouvertes jusqu’au {plain(a.dateLimite)}
              </p>
              <h1 id="adm-title" className="sem-hero__title">
                Rejoindre le certificat CFO 4.0
              </h1>
              <p className="sem-hero__lead">
                Le tarif, l’éligibilité, le financement et le processus d’admission, en une page.
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

            <aside className="adm-facts" aria-label="L’essentiel">
              <p className="adm-facts__title">L’essentiel</p>
              <dl className="adm-facts__list">
                {tarif.formules.map((f) => (
                  <div key={f.id}>
                    <dt>{f.titre}</dt>
                    <dd>
                      {f.montant} <span>{tarif.devisePhrase}</span>
                    </dd>
                  </div>
                ))}
                <div>
                  <dt>{tarif.fraisInscription.label}</dt>
                  <dd>
                    {tarif.fraisInscription.montant} <span>{tarif.devisePhrase}</span>
                  </dd>
                </div>
                <div>
                  <dt>Places</dt>
                  <dd>25</dd>
                </div>
                <div>
                  <dt>Réponse</dt>
                  <dd className="is-text">sous {a.delaiReponse} après l’entretien</dd>
                </div>
              </dl>
              <DeadlineCountdown className="adm-facts__countdown" />
            </aside>
          </div>
        </Container>
      </section>

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
              Quatre étapes jusqu’à l’inscription
            </h2>
            <p className="adm-head__lead">Réponse sous {a.delaiReponse} après l’entretien.</p>
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

      <section className="bg-white py-[clamp(2.5rem,6vw,4.5rem)]">
        <Container>
          <SectionHeading kicker="FAQ" title="Les questions fréquentes" />
          <div className="mt-8"><FaqList onlyHome /></div>
          <div className="mt-8"><ButtonLink href="/faq" variant="secondary">Voir toutes les questions</ButtonLink></div>
        </Container>
      </section>
      <section id="rappel" className="rappel-band py-[clamp(2.5rem,6vw,4.5rem)]">
        <Container className="grid gap-10 md:grid-cols-2">
          <div>
            <SectionHeading
              kicker="Parler à quelqu’un"
              title="Être rappelé sous 24 heures ouvrées"
              lead="Le financement, l’éligibilité, la compatibilité avec votre agenda : certaines questions se règlent mieux au téléphone."
            />
            <p className="mt-4 text-sm">
              Vous pouvez aussi écrire à{" "}
              <a className="font-semibold text-blue" href={`mailto:${plain(c.email)}`}>{plain(c.email)}</a>.
            </p>
          </div>
          <div className="rappel-band__card rounded-md bg-white p-6 sm:p-8">
            <LeadForm kind="rappel" prefix="r" submitVariant="secondary" />
          </div>
        </Container>
      </section>
    </>
  );
}
