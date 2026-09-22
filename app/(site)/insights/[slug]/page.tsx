import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  IconArrowRight,
  IconCal,
  IconClock,
  IconBarChart,
  IconFileText,
  IconLayers,
  IconJuryMark,
} from "@/components/icons";
import { ButtonLink, Container } from "@/components/ui";
import { HeroDecor } from "@/components/HeroDecor";
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

function CategoryIcon({ category }: { category: string }) {
  switch (category) {
    case "Baromètre":
      return <IconBarChart size={14} />;
    case "Livre blanc":
      return <IconFileText size={14} />;
    case "Méthode":
      return <IconLayers size={14} />;
    case "Pédagogie":
      return <IconJuryMark size={14} />;
    default:
      return <IconLayers size={14} />;
  }
}

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

  const others = (await getInsightArticles())
    .filter((a) => a.slug !== slug)
    .slice(0, 3);
  const doc = article.relatedDoc;

  return (
    <>
      <header className="insight-hero" aria-labelledby="insight-title">
        <span className="insight-hero__glow" aria-hidden />
        <span className="insight-hero__grid" aria-hidden />
        <HeroDecor motif="nodes" />
        <Container className="insight-hero__inner">
          <nav className="insight-hero__crumbs" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden>/</span>
            <Link href="/insights">Insights</Link>
            <span aria-hidden>/</span>
            <span>{article.category}</span>
          </nav>

          <p className="insight-hero__kicker">
            <CategoryIcon category={article.category} />
            {article.kicker}
          </p>
          <h1 id="insight-title" className="insight-hero__title">
            {article.titre}
          </h1>
          <p className="insight-hero__lead">{article.resume}</p>
          <ul className="insight-hero__meta">
            <li>
              <IconCal />
              {article.dateLabel}
            </li>
            <li>
              <IconClock />
              {article.lecture} de lecture
            </li>
          </ul>
        </Container>
      </header>

      <article className="insight-body">
        <Container className="insight-body__grid">
          <div className="insight-prose">
            {article.corps.map((p, i) => (
              <p key={`${i}-${p.slice(0, 24)}`} className={i === 0 ? "is-lead" : undefined}>
                {p}
              </p>
            ))}
            <footer className="insight-prose__source">
              <span className="insight-prose__source-label">Source</span>
              {article.source}
            </footer>
          </div>

          <aside className="insight-aside">
            <div className="insight-aside__card">
              <p className="insight-aside__kicker">Aller plus loin</p>
              <p className="insight-aside__text">
                Téléchargez la publication liée à cette analyse, ou déposez votre
                candidature pour le prochain cycle.
              </p>
              <div className="insight-aside__actions">
                <ButtonLink href={DOC_HREF[doc]}>{DOC_LABEL[doc]}</ButtonLink>
                <ButtonLink href="/candidater" variant="secondary">
                  Candidater
                </ButtonLink>
              </div>
            </div>
            <Link href="/insights" className="insight-aside__back">
              ← Tous les insights
            </Link>
          </aside>
        </Container>
      </article>

      {others.length ? (
        <section className="insight-more" aria-labelledby="more-insights">
          <Container>
            <header className="insight-more__head">
              <p className="insight-more__kicker">Continuer</p>
              <h2 id="more-insights" className="insight-more__title">
                D’autres analyses
              </h2>
            </header>
            <ul className="insight-more__grid">
              {others.map((a) => (
                <li key={a.slug}>
                  <Link href={`/insights/${a.slug}`} className="insight-more__card">
                    <span className="insights-chip">
                      <CategoryIcon category={a.category} />
                      {a.category}
                    </span>
                    <span className="insight-more__card-title">{a.titre}</span>
                    <span className="insight-more__card-go">
                      Lire
                      <IconArrowRight />
                    </span>
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
