import type { Metadata } from "next";
import { CalendarTable } from "@/components/CalendarTable";
import { LeadForm } from "@/components/LeadForm";
import { ProgrammeGrid } from "@/components/ProgrammeGrid";
import { ButtonLink, Container, PageHero, SectionHeading } from "@/components/ui";
import { IconBook, IconPhone, IconPlay } from "@/components/icons";
import { data } from "@/lib/content";

export const metadata: Metadata = {
  title: "Le programme",
  description: "Huit séminaires, une conférence inaugurale et un projet de transformation mené sur votre entreprise.",
};

export default function ProgrammePage() {
  return (
    <>
      <PageHero
        kicker="Le programme"
        title="Huit séminaires, un projet mené sur votre entreprise"
        lead="Vingt jours sur cinq mois, à Rabat. Une conférence inaugurale, huit séminaires de deux jours le vendredi et le samedi, un week-end sur deux, et trois journées de coaching des équipes projet."
      >
          <div className="mt-8 flex flex-wrap items-start gap-x-6 gap-y-5">
            <span className="grid justify-items-start gap-1.5">
              <ButtonLink href="#session-information" className="px-6 py-3">
                <IconPlay />
                Réserver ma place
              </ButtonLink>
              <span className="text-xs text-white/55">Une heure en ligne, questions en direct.</span>
            </span>
            <span className="grid justify-items-start gap-1.5">
              <ButtonLink
                href="/ressources#brochure"
                variant="ghost"
                className="border-white/35 bg-transparent px-6 py-3 text-white hover:border-white hover:bg-white hover:text-navy"
              >
                <IconBook />
                Recevoir la brochure 2026
              </ButtonLink>
              <span className="text-xs text-white/55">Le programme daté, le tarif et le processus, en PDF.</span>
            </span>
          </div>
          <p className="mt-4">
            <a
              href="/admissions#rappel"
              className="btn-icon -ml-3 inline-flex min-h-11 items-center gap-2 rounded-md px-3 py-2 font-bold text-white/80 hover:bg-white/10 hover:text-white"
            >
              <IconPhone />
              Être rappelé sous 48 h
            </a>
          </p>
      </PageHero>
      <section className="bg-cream py-[clamp(2.5rem,6vw,4.5rem)]">
        <Container>
          <h2 className="text-[clamp(1.625rem,1.45rem+0.87vw,2.25rem)] font-bold leading-[1.2]">Les séances</h2>
          <div className="mt-8">
            <ProgrammeGrid />
          </div>
        </Container>
      </section>
      <section id="fil-rouge" className="bg-white py-[clamp(2.5rem,6vw,4.5rem)]">
        <Container>
          <SectionHeading kicker="Le fil rouge" title="De la candidature au jury" />
          <ol className="mt-8 grid gap-4 md:grid-cols-2">
            {data.site.filRouge.map((s, i) => (
              <li key={s.etape} className="card-lift flex gap-4 rounded-md border border-line bg-white p-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream text-sm font-bold text-blue">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-bold">{s.etape}</h3>
                  <p className="mt-1 text-sm text-muted">{s.texte}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>
      <section className="bg-cream py-[clamp(2.5rem,6vw,4.5rem)]">
        <Container>
          <SectionHeading kicker="Calendrier" title={data.calendrier.intitule} lead={data.calendrier.chapeau} />
          <div className="mt-8">
            <CalendarTable />
          </div>
        </Container>
      </section>
      <section id="session-information" className="bg-white py-[clamp(2.5rem,6vw,4.5rem)]">
        <Container className="grid gap-10 md:grid-cols-2">
          <div>
            <SectionHeading kicker="Session d’information" title={data.site.sessionInfo.titre} lead={data.site.sessionInfo.texte} />
          </div>
          <div className="rounded-md bg-cream p-6 sm:p-8">
            <LeadForm kind="session" prefix="ps" submitVariant="secondary" />
          </div>
        </Container>
      </section>
    </>
  );
}
