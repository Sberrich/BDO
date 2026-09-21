import type { Metadata } from "next";
import Image from "next/image";
import { IconLinkedIn } from "@/components/icons";
import { ButtonLink, Container, PageHero } from "@/components/ui";
import { getIntervenants, getIntervenantsPage } from "@/lib/cms";
import { personLinkedIn, personPhoto, plain } from "@/lib/text";

export const metadata: Metadata = {
  title: "Intervenants",
  description: "Les associés, professeurs et praticiens qui animent les séminaires.",
};

export default async function IntervenantsPage() {
  const [{ chapeau }, intervenants] = await Promise.all([getIntervenantsPage(), getIntervenants()]);

  return (
    <>
      <PageHero kicker="Les intervenants" title="Ils animent les séminaires" lead={chapeau} />
      <section className="bg-cream py-[clamp(2.5rem,6vw,4.5rem)]">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {intervenants.map((p) => {
              const linkedin = personLinkedIn(p.linkedin);
              const name = plain(p.nom);
              return (
                <article key={p.slug} id={p.slug} className="card-lift overflow-hidden rounded-md bg-white shadow-[var(--shadow)]">
                  <div className="relative aspect-square bg-cream">
                    <Image src={personPhoto(p.photo, p.slug)} alt="" fill className="object-cover" sizes="33vw" />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-lg font-bold text-ink">{name}</p>
                    <p className="text-sm text-muted">
                      {plain(p.fonction)} · {plain(p.institution)}
                    </p>
                    <p className="mt-3 flex-1 text-sm text-muted">{plain(p.bio)}</p>
                    {linkedin ? (
                      <a
                        href={linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex w-fit items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-bold text-[#0A66C2] transition hover:border-[#0A66C2] hover:bg-[#0A66C2]/10"
                        aria-label={`Profil LinkedIn de ${name}`}
                      >
                        <IconLinkedIn size={16} />
                        LinkedIn
                      </a>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
          <div className="mt-12 rounded-md border border-line bg-white p-8">
            <h2 className="mt-0 text-2xl font-bold">Le jury de soutenance</h2>
            <p className="mt-2 text-muted">
              La soutenance se tient devant le jury ISCAE × BDO, au second jour du séminaire 8, le 3 avril 2027.
            </p>
            <div className="mt-6">
              <ButtonLink href="/candidater">Candidater</ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
