import type { Metadata } from "next";
import { CandidatureForm } from "@/components/CandidatureForm";
import { Container, PageHero } from "@/components/ui";
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
      <section className="bg-cream py-[clamp(2.5rem,6vw,4.5rem)]">
        <Container className="max-w-3xl">
          <div className="mb-6 rounded-md border border-line bg-white p-5 sm:px-8">
            <p className="text-sm font-bold">À préparer avant de commencer</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
              {a.pieces.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-md border border-line bg-white p-6 sm:p-10">
            <CandidatureForm />
          </div>
        </Container>
      </section>
    </>
  );
}
