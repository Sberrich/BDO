import type { Metadata } from "next";
import { LeadForm } from "@/components/LeadForm";
import { Container, PageHero, SectionHeading } from "@/components/ui";
import { data } from "@/lib/content";

export const metadata: Metadata = {
  title: "Ressources",
  description: "Brochure, Baromètre BDO des DAF et livre blanc du certificat CFO 4.0.",
};

export default function RessourcesPage() {
  const d = data.site.docs;
  return (
    <>
      <PageHero kicker="Ressources" title="Les publications qui documentent le programme" />
      <section id="brochure" className="bg-cream py-[clamp(2.5rem,6vw,4.5rem)]">
        <Container className="grid items-start gap-10 md:grid-cols-2">
          <div>
            <SectionHeading kicker="Brochure 2026" title={d.brochure.titre} lead="Le programme, les huit séminaires, le calendrier, le tarif et le processus d’admission." />
          </div>
          <div className="rounded-md bg-white p-6 shadow-[var(--shadow-md)] sm:p-8"><LeadForm kind="document" document="brochure" prefix="b" /></div>
        </Container>
      </section>
      <section id="barometre" className="bg-white py-[clamp(2.5rem,6vw,4.5rem)]">
        <Container className="grid items-start gap-10 md:grid-cols-2">
          <div>
            <SectionHeading kicker="Enquête" title={d.barometre.titre} lead="L’enquête annuelle de BDO Maroc. Édition 2024, 94 répondants." />
          </div>
          <div className="rounded-md bg-cream p-6 sm:p-8"><LeadForm kind="document" document="barometre" prefix="a" /></div>
        </Container>
      </section>
      <section id="livre-blanc" className="bg-cream py-[clamp(2.5rem,6vw,4.5rem)]">
        <Container className="grid items-start gap-10 md:grid-cols-2">
          <div>
            <SectionHeading kicker="Publication" title={d.livreBlanc.titre} lead="Le livre blanc BDO × Maltem Africa sur la transformation de la fonction finance." />
          </div>
          <div className="rounded-md bg-white p-6 shadow-[var(--shadow-md)] sm:p-8"><LeadForm kind="document" document="livreblanc" prefix="l" /></div>
        </Container>
      </section>
    </>
  );
}
