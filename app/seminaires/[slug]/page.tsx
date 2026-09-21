import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink, Container, Kicker, SectionHeading } from "@/components/ui";
import { ProgrammeGrid } from "@/components/ProgrammeGrid";
import { allSessions, data, sessionBySlug, sessionHref } from "@/lib/content";
import { plain } from "@/lib/text";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allSessions().flatMap((s) => {
    const slugs = [s.numero === 0 ? "conference-inaugurale" : String(s.numero)];
    if (s.slug && !slugs.includes(s.slug)) slugs.push(s.slug);
    return slugs.map((slug) => ({ slug }));
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = sessionBySlug(slug);
  if (!s) return { title: "Séminaire" };
  return { title: plain(s.titre), description: plain(s.sousTitre) };
}

export default async function SeminairePage({ params }: Props) {
  const { slug } = await params;
  const s = sessionBySlug(slug);
  if (!s) notFound();
  const seq = allSessions();
  const i = seq.findIndex((x) => x.numero === s.numero);
  const prev = i > 0 ? seq[i - 1] : null;
  const next = i < seq.length - 1 ? seq[i + 1] : null;
  const people = data.intervenants.intervenants.filter((p) =>
    (s as { intervenants?: string[] }).intervenants?.includes(p.slug),
  );
  const inaug = s.numero === 0;
  const detail = s as {
    jour1?: { matin: string; apresMidi: string };
    jour2?: { matin: string; apresMidi: string };
    livrable?: string;
    actualisation?: string;
    objectif: string;
  };

  return (
    <>
      <section className="border-b border-line bg-white py-12 md:py-16">
        <Container className="max-w-[760px]">
          <nav className="text-sm text-muted">
            <Link href="/" className="hover:text-blue">Accueil</Link>
            {" · "}
            <Link href="/programme" className="hover:text-blue">Le programme</Link>
            {" · "}
            {plain(s.titre)}
          </nav>
          <div className="mt-5">
            <Kicker>
              {inaug ? "Conférence inaugurale" : `Séminaire ${s.numero}`} · {s.dates}
            </Kicker>
          </div>
          <h1 className="mt-3 text-[clamp(2rem,1.55rem+2vw,3.1rem)] font-bold leading-[1.12]">{plain(s.titre)}</h1>
          <p className="mt-4 text-lg text-muted">{plain(s.sousTitre)}</p>
        </Container>
      </section>
      <section className="bg-white py-12 md:py-16">
        <Container className="max-w-[760px]">
          <h2 className="text-xl font-bold">Objectif</h2>
          <p className="mt-3 text-muted">{plain(detail.objectif)}</p>
          {!inaug && detail.jour1 && detail.jour2 && (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-md bg-cream p-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted">Jour 1 · vendredi</h3>
                <p className="mt-3 text-sm"><strong>Matin.</strong> {detail.jour1.matin}</p>
                <p className="mt-2 text-sm"><strong>Après-midi.</strong> {detail.jour1.apresMidi}</p>
              </div>
              <div className="rounded-md bg-cream p-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted">Jour 2 · samedi</h3>
                <p className="mt-3 text-sm"><strong>Matin.</strong> {detail.jour2.matin}</p>
                <p className="mt-2 text-sm"><strong>Après-midi.</strong> {detail.jour2.apresMidi}</p>
              </div>
            </div>
          )}
          {detail.livrable && (
            <p className="mt-6 rounded-md border border-line bg-cream p-5">
              <span className="text-xs font-bold uppercase tracking-wider text-muted">Livrable</span>
              <span className="mt-1 block font-semibold">{detail.livrable}</span>
            </p>
          )}
          {detail.actualisation && (
            <p className="mt-4 text-sm text-muted">{detail.actualisation}</p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/ressources/brochure" variant="secondary">Recevoir la brochure</ButtonLink>
            <ButtonLink href="/candidater">Candidater</ButtonLink>
          </div>
          <div className="mt-8 flex justify-between gap-4 text-sm font-bold text-blue">
            {prev ? <Link href={sessionHref(prev)}>← {plain(prev.titre)}</Link> : <span />}
            {next ? <Link href={sessionHref(next)} className="text-right">{plain(next.titre)} →</Link> : <span />}
          </div>
        </Container>
      </section>
      {people.length > 0 && (
        <section className="bg-cream py-16">
          <Container>
            <SectionHeading kicker="Intervenant" title="Qui anime ce séminaire" />
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {people.map((p) => (
                <article key={p.slug} className="rounded-md bg-white p-6">
                  <p className="text-lg font-bold">{plain(p.nom)}</p>
                  <p className="text-sm text-muted">{plain(p.fonction)} · {plain(p.institution)}</p>
                  <p className="mt-3 text-sm text-muted">{plain(p.bio)}</p>
                </article>
              ))}
            </div>
          </Container>
        </section>
      )}
      <section className="bg-white py-16">
        <Container>
          <SectionHeading kicker="Le programme" title="Les autres séances" />
          <div className="mt-8">
            <ProgrammeGrid />
          </div>
        </Container>
      </section>
    </>
  );
}
