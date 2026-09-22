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
        motif="nodes"
        kicker="FAQ"
        title="Les questions que vous vous posez"
        lead="Vingt-cinq réponses, regroupées par thème — du programme au tarif."
      />
      <section className="faq-page">
        <Container className="faq-page__inner">
          <FaqList />
          <aside className="faq-page__cta" aria-labelledby="faq-cta-title">
            <div className="faq-page__cta-copy">
              <p className="faq-page__cta-kicker">Prêt à avancer</p>
              <h2 id="faq-cta-title" className="faq-page__cta-title">
                Vous avez la réponse qu’il vous fallait ?
              </h2>
              <p className="faq-page__cta-lead">
                La promotion 1 ouvre le 30 octobre 2026. Clôture le{" "}
                {plain(data.site.admission.dateLimite)}.
              </p>
            </div>
            <div className="faq-page__cta-actions">
              <ButtonLink href="/candidater">Candidater</ButtonLink>
              <ButtonLink href="/admissions#rappel" variant="ghost">
                Être rappelé
              </ButtonLink>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
