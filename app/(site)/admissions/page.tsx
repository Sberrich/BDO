import type { Metadata } from "next";
import { CalendarTable } from "@/components/CalendarTable";
import { FaqList } from "@/components/FaqList";
import { LeadForm } from "@/components/LeadForm";
import { PricingBlock, PricingConditions } from "@/components/PricingBlock";
import { ButtonLink, Container, PageHero, SectionHeading } from "@/components/ui";
import { data } from "@/lib/content";
import { plain } from "@/lib/text";

export const metadata: Metadata = {
  title: "Admissions",
  description: "Tarif, calendrier, éligibilité et processus d’admission du certificat CFO 4.0.",
};

export default function AdmissionsPage() {
  const a = data.site.admission;
  const c = data.site.contact;
  return (
    <>
      <PageHero
        motif="rings"
        kicker="Admissions"
        title="Le prix, le calendrier, l’éligibilité, le financement, le processus"
        lead={`Candidatures pour la promotion 1 closes le ${plain(a.dateLimite)}.`}
      >
          <ul className="mt-6 flex flex-wrap gap-2">
            {[
              ["#tarif", "Le tarif"],
              ["#calendrier", "Le calendrier"],
              ["#profil", "L’éligibilité"],
              ["#processus", "Le processus"],
              ["#rappel", "Être rappelé"],
            ].map(([href, label]) => (
              <li key={href}>
                <a
                  className="inline-flex rounded-md border border-white/25 bg-white/5 px-3 py-1.5 text-sm font-semibold text-white/85 transition hover:border-white/50 hover:bg-white/10 hover:text-white"
                  href={href}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/candidater">Déposer ma candidature</ButtonLink>
            <ButtonLink
              href="#rappel"
              variant="ghost"
              className="border-white/35 bg-transparent text-white hover:border-white hover:bg-white hover:text-navy"
            >
              Être rappelé sous 24 h
            </ButtonLink>
          </div>
      </PageHero>
      <section id="tarif" className="bg-cream py-[clamp(2.5rem,6vw,4.5rem)]">
        <Container>
          <h2 className="text-[clamp(1.625rem,1.45rem+0.87vw,2.25rem)] font-bold leading-[1.2]">Le tarif</h2>
          <div className="mt-8">
            <PricingBlock />
          </div>
          <PricingConditions />
        </Container>
      </section>
      <section id="calendrier" className="bg-white py-[clamp(2.5rem,6vw,4.5rem)]">
        <Container>
          <SectionHeading kicker="Calendrier" title={data.calendrier.intitule} lead={data.calendrier.chapeau} />
          <div className="mt-8"><CalendarTable /></div>
        </Container>
      </section>
      <section id="profil" className="bg-cream py-[clamp(2.5rem,6vw,4.5rem)]">
        <Container>
          <SectionHeading kicker="L’éligibilité" title={data.site.profil.titre} lead={data.site.profil.chapeau} />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {data.site.profil.profils.map((p, i) => (
              <article key={p.titre} className="rounded-md bg-white p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted">0{i + 1}</p>
                <h3 className="mt-2 text-lg font-bold">{p.titre}</h3>
                <p className="mt-2 text-sm text-muted">{p.texte}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 font-medium"><strong>Prérequis.</strong> {data.site.profil.prerequis}</p>
        </Container>
      </section>
      <section id="processus" className="bg-white py-[clamp(2.5rem,6vw,4.5rem)]">
        <Container>
          <SectionHeading kicker="Le processus" title="Le processus d’admission" lead={`Quatre étapes. Réponse sous ${a.delaiReponse} après l’entretien.`} />
          <ol className="mt-10 space-y-4">
            {a.etapes.map((x, i) => (
              <li key={x.titre} className="card-lift flex gap-4 rounded-md border border-line bg-white p-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream text-sm font-bold text-blue">{i + 1}</span>
                <div>
                  <h3 className="font-bold">{x.titre}</h3>
                  <p className="mt-1 text-sm text-muted">{x.texte}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>
      <section className="bg-cream py-[clamp(2.5rem,6vw,4.5rem)]">
        <Container>
          <SectionHeading kicker="FAQ" title="Les questions fréquentes" />
          <div className="mt-8"><FaqList onlyHome /></div>
          <div className="mt-8"><ButtonLink href="/faq" variant="secondary">Voir toutes les questions</ButtonLink></div>
        </Container>
      </section>
      <section id="rappel" className="bg-white py-[clamp(2.5rem,6vw,4.5rem)]">
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
          <div className="rounded-md bg-cream p-6 sm:p-8">
            <LeadForm kind="rappel" prefix="r" submitVariant="secondary" />
          </div>
        </Container>
      </section>
    </>
  );
}
