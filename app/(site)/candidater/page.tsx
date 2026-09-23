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
  return (
    <>
      <PageHero
        kicker="Candidater"
        title="Votre dossier de candidature"
        lead={`Quatre étapes, une vingtaine de minutes. Clôture le ${plain(data.site.admission.dateLimite)}.`}
      />
      <section className="bg-cream py-[clamp(2.5rem,6vw,4.5rem)]">
        <Container className="max-w-3xl">
          <div className="rounded-md bg-white p-6 shadow-[var(--shadow-md)] sm:p-10">
            <CandidatureForm />
          </div>
        </Container>
      </section>
    </>
  );
}
