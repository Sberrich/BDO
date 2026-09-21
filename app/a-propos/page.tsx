import type { Metadata } from "next";
import { LeadForm } from "@/components/LeadForm";
import { Container, PageHero, SectionHeading } from "@/components/ui";
import { data } from "@/lib/content";
import { plain } from "@/lib/text";

export const metadata: Metadata = {
  title: "À propos",
  description: "Le Groupe ISCAE, BDO Maroc et le dispositif du certificat CFO 4.0.",
};

export default function AProposPage() {
  const c = data.site.contact;
  return (
    <>
      <PageHero kicker="À propos" title="Deux institutions, une signature commune" lead={`${data.site.cosignature}.`} />
      <section className="bg-cream py-[clamp(2.5rem,6vw,4.5rem)]">
        <Container>
          <div className="grid gap-5 md:grid-cols-2">
            {data.site.institutions.map((x) => (
              <article key={x.nom} className="rounded-md border border-line bg-white p-8">
                <h2 className="text-2xl font-bold">{x.nom}</h2>
                <p className="mt-4 text-muted">{x.texte}</p>
              </article>
            ))}
          </div>
          <div id="trophee" className="mt-8 rounded-md border border-line bg-white p-8">
            <h2 className="text-2xl font-bold">Le Trophée BDO des DAF</h2>
            <p className="mt-3 text-muted">
              La rencontre annuelle de la place financière marocaine, qui distingue les directions financières les plus
              engagées dans leur transformation. Les lauréats bénéficient de conditions particulières pour le certificat.
            </p>
          </div>
        </Container>
      </section>
      <section id="contact" className="bg-white py-[clamp(2.5rem,6vw,4.5rem)]">
        <Container className="grid items-start gap-10 md:grid-cols-2">
          <div>
            <SectionHeading kicker="Contact" title="Votre interlocuteur" />
            <p className="mt-4 font-semibold">{plain(c.nom)}<br />{plain(c.fonction)}</p>
            <ul className="mt-4 space-y-2 text-muted">
              <li><a className="text-blue hover:text-blue-dark" href={`mailto:${plain(c.email)}`}>{plain(c.email)}</a></li>
              <li><a className="text-blue hover:text-blue-dark" href={`tel:${plain(c.telephone).replace(/\s/g, "")}`}>{plain(c.telephone)}</a></li>
              <li>{plain(c.lieuFormation)}</li>
              <li>{c.adresseIscae}</li>
            </ul>
          </div>
          <div className="rounded-md bg-cream p-6 sm:p-8">
            <LeadForm kind="rappel" prefix="p" />
          </div>
        </Container>
      </section>
    </>
  );
}
