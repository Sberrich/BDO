import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink, Container, PageHero } from "@/components/ui";
import { data } from "@/lib/content";
import { personPhoto, plain } from "@/lib/text";

export const metadata: Metadata = {
  title: "Intervenants",
  description: "Les associés, professeurs et praticiens qui animent les séminaires.",
};

export default function IntervenantsPage() {
  return (
    <>
      <PageHero kicker="Les intervenants" title="Ils animent les séminaires" lead={data.intervenants.chapeau} />
      <section className="bg-cream py-[clamp(2.5rem,6vw,4.5rem)]">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.intervenants.intervenants.map((p) => (
              <article key={p.slug} id={p.slug} className="card-lift overflow-hidden rounded-md bg-white shadow-[var(--shadow)]">
                <div className="relative aspect-square bg-cream">
                  <Image src={personPhoto(p.photo, p.slug)} alt="" fill className="object-cover" sizes="33vw" />
                </div>
                <div className="p-5">
                  <p className="text-lg font-bold">{plain(p.nom)}</p>
                  <p className="text-sm text-muted">{plain(p.fonction)} · {plain(p.institution)}</p>
                  <p className="mt-3 text-sm text-muted">{plain(p.bio)}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-12 rounded-md border border-line bg-white p-8">
            <h2 className="mt-0 text-2xl font-bold">Le jury de soutenance</h2>
            <p className="mt-2 text-muted">La soutenance se tient devant le jury ISCAE × BDO, au second jour du séminaire 8, le 3 avril 2027.</p>
            <div className="mt-6">
              <ButtonLink href="/candidater">Candidater</ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
