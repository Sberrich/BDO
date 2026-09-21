import type { Metadata } from "next";
import { FaqList } from "@/components/FaqList";
import { ButtonLink, Container, PageHero } from "@/components/ui";
import { data } from "@/lib/content";
import { plain } from "@/lib/text";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Les réponses aux questions sur le certificat CFO 4.0.",
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        kicker="FAQ"
        title="Les questions que vous vous posez"
        lead="Vingt-cinq réponses, regroupées par thème."
      />
      <section className="bg-cream py-[clamp(2.5rem,6vw,4.5rem)]">
        <Container>
          <FaqList />
          <div className="mt-12 rounded-md border border-line bg-white p-8">
            <h2 className="text-2xl font-bold">Vous avez la réponse qu’il vous fallait ?</h2>
            <p className="mt-2 text-muted">
              La promotion 1 ouvre le 30 octobre 2026. Clôture le {plain(data.site.admission.dateLimite)}.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/candidater">Candidater</ButtonLink>
              <ButtonLink href="/admissions#rappel" variant="ghost">Être rappelé</ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
