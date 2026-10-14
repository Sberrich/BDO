import type { Metadata } from "next";
import { CandidatureForm } from "@/components/CandidatureForm";
import { Container, PageHero } from "@/components/ui";
import { IconChevronDown, IconFileText } from "@/components/icons";
import { data } from "@/lib/content";
import { plain } from "@/lib/text";

export const metadata: Metadata = {
  title: "Candidater",
  description: "Déposez votre dossier de candidature au certificat CFO 4.0.",
};

export default function CandidaterPage() {
  const a = data.site.admission;
  return (
    <>
      <PageHero
        kicker="Candidater"
        title="Votre dossier de candidature"
        lead={`Quatre étapes, ${a.dureeDossier} environ. Clôture le ${plain(a.dateLimite)}.`}
      />
      <section className="bg-cream pt-3 pb-[clamp(2.5rem,6vw,4.5rem)] sm:pt-4">
        <Container className="max-w-3xl">
          <details className="cand-prep mb-4 rounded-md border border-line bg-white">
            <summary className="cand-prep__summary">
              <span className="cand-prep__icon" aria-hidden>
                <IconFileText />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-bold">À préparer avant de commencer</span>
                <span className="block text-xs text-muted">{a.pieces.length} éléments à réunir</span>
              </span>
              <span className="cand-prep__chevron" aria-hidden>
                <IconChevronDown />
              </span>
            </summary>
            <ul className="cand-prep__list">
              {a.pieces.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </details>
          <div className="rounded-md border border-line bg-white p-6 sm:p-10">
            <CandidatureForm />
          </div>
        </Container>
      </section>
    </>
  );
}
