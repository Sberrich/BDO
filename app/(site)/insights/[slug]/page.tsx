import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink, Container, PageHero } from "@/components/ui";
import { getInsightArticles, getInsightBySlug } from "@/lib/cms";

type Props = { params: Promise<{ slug: string }> };

const DOC_HREF = {
  brochure: "/ressources/brochure",
  barometre: "/ressources/barometre",
  livreblanc: "/ressources/livre-blanc",
} as const;

const DOC_LABEL = {
  brochure: "Recevoir la brochure",
  barometre: "Recevoir le Baromètre",
  livreblanc: "Recevoir le livre blanc",
} as const;

export async function generateStaticParams() {
  const articles = await getInsightArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getInsightBySlug(slug);
  if (!article) return { title: "Insight" };
  return {
    title: article.titre,
    description: article.resume,
  };
}

export default async function InsightArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getInsightBySlug(slug);
  if (!article) notFound();

  const others = (await getInsightArticles()).filter((a) => a.slug !== slug).slice(0, 3);
  const doc = article.relatedDoc;

  return (
    <>
      <PageHero kicker={article.kicker} title={article.titre} lead={article.resume}>
        <p className="mt-5 text-sm text-white/55">
          {article.dateLabel} · {article.lecture} de lecture
        </p>
      </PageHero>

      <article className="bg-cream py-[clamp(2.5rem,6vw,4.5rem)]">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,42rem)_1fr] lg:gap-16">
          <div className="space-y-6 text-lg leading-relaxed text-ink">
            {article.corps.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
            <p className="border-t border-line pt-6 text-sm text-muted">{article.source}</p>
          </div>

          <aside className="lg:pt-1">
            <div className="sticky top-28 space-y-6">
              <div className="rounded-md border border-line bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue">Aller plus loin</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Téléchargez la publication liée à cette analyse, ou déposez votre candidature pour le prochain cycle.
                </p>
                <div className="mt-5 flex flex-col gap-3">
                  <ButtonLink href={DOC_HREF[doc]}>{DOC_LABEL[doc]}</ButtonLink>
                  <ButtonLink href="/candidater" variant="secondary">
                    Candidater
                  </ButtonLink>
                </div>
              </div>
              <Link href="/insights" className="inline-flex text-sm font-bold text-blue hover:text-blue-dark">
                ← Tous les insights
              </Link>
            </div>
          </aside>
        </Container>
      </article>

      {others.length ? (
        <section className="bg-white py-[clamp(2.5rem,6vw,4rem)]" aria-labelledby="more-insights">
          <Container>
            <h2 id="more-insights" className="text-xl font-bold text-ink sm:text-2xl">
              Continuer la lecture
            </h2>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {others.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/insights/${a.slug}`}
                    className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                  >
                    <span className="font-bold text-ink transition group-hover:text-blue">{a.titre}</span>
                    <span className="shrink-0 text-sm text-muted">{a.kicker}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}
    </>
  );
}
