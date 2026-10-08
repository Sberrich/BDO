import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { InsightsExplorer } from "@/components/InsightsExplorer";
import { Container } from "@/components/ui";
import { IconArrowRight } from "@/components/icons";
import { getInsightArticles, getInsightsPage, INSIGHT_CATEGORIES } from "@/lib/cms";
import { RESOURCES_MENU } from "@/lib/content";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Analyses et lectures sur la transformation de la fonction finance — Baromètre BDO des DAF, livre blanc et méthode du certificat CFO 4.0.",
};

export default async function InsightsPage() {
  const [{ chapeau }, articles] = await Promise.all([getInsightsPage(), getInsightArticles()]);
  const sources = RESOURCES_MENU.filter(
    (r) => r.href === "/ressources/barometre" || r.href === "/ressources/livre-blanc",
  );

  return (
    <>
      <section className="sem-hero" aria-labelledby="insights-title">
        <Container className="sem-hero__inner">
          <nav className="sem-hero__crumbs" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span>Insights</span>
          </nav>
          <div className="sem-hero__grid-layout">
            <div className="sem-hero__copy">
              <p className="sem-hero__index">
                <span className="sem-hero__badge">Insights</span>
                {articles.length} analyses
              </p>
              <h1 id="insights-title" className="sem-hero__title">
                Insights & analyses
              </h1>
              {chapeau ? <p className="sem-hero__lead">{chapeau}</p> : null}
            </div>
            <aside className="ins-sources" aria-label="Les publications sources">
              <p className="ins-sources__title">Les publications sources</p>
              <ul>
                {sources.map((r) => (
                  <li key={r.href}>
                    <Link href={r.href} className="ins-source">
                      <span className="ins-source__cover" aria-hidden>
                        {r.cover ? (
                          <Image src={r.cover} alt="" fill sizes="80px" className="object-cover object-top" />
                        ) : null}
                      </span>
                      <span className="ins-source__body">
                        <span className="ins-source__label">{r.label}</span>
                        <span className="ins-source__desc">{r.desc}</span>
                      </span>
                      <IconArrowRight />
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </Container>
      </section>
      <InsightsExplorer categories={INSIGHT_CATEGORIES} articles={articles} />
    </>
  );
}
