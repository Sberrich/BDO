import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PubCard } from "@/components/PubCard";
import { ButtonLink, Container } from "@/components/ui";
import { IconArrowRight, IconLayers } from "@/components/icons";
import { getInsightArticles } from "@/lib/cms";
import { RESOURCE_COVERS, RESOURCES_MENU } from "@/lib/content";

export const metadata: Metadata = {
  title: "Ressources",
  description: "Brochure, Baromètre BDO des DAF, livre blanc et Insights du certificat CFO 4.0.",
};

const TYPES: Record<string, string> = {
  brochure: "Brochure · PDF",
  barometre: "Enquête · PDF",
  livreblanc: "Livre blanc · PDF",
};

export default async function RessourcesPage() {
  const docs = RESOURCES_MENU.filter((r) => r.cover);
  const articles = (await getInsightArticles())
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  return (
    <>
      <section className="sem-hero" aria-labelledby="res-title">
        <Container className="sem-hero__inner">
          <nav className="sem-hero__crumbs" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span>Ressources</span>
          </nav>
          <div className="sem-hero__grid-layout">
            <div className="sem-hero__copy">
              <p className="sem-hero__index">
                <span className="sem-hero__badge">Ressources</span>
                {docs.length} documents · Insights
              </p>
              <h1 id="res-title" className="sem-hero__title">
                Les publications qui documentent le programme
              </h1>
              <p className="sem-hero__lead">
                Brochure, Baromètre, livre blanc et analyses — chaque document a sa page dédiée.
              </p>
              <div className="sem-hero__ctas">
                <ButtonLink href="/ressources/brochure" className="sem-hero__cta-primary">
                  Recevoir la brochure
                  <IconArrowRight />
                </ButtonLink>
                <ButtonLink href="/insights" variant="ghost" className="sem-hero__cta-secondary">
                  Lire les Insights
                </ButtonLink>
              </div>
            </div>
            <Link href="/ressources/brochure" className="res-hero__book" aria-label="La brochure du certificat">
              <span className="res-hero__glow" aria-hidden />
              <span className="res-hero__page">
                <Image
                  src={RESOURCE_COVERS.brochure}
                  alt=""
                  width={636}
                  height={900}
                  priority
                  sizes="(min-width: 960px) 16rem, 50vw"
                />
              </span>
              <span className="res-hero__tag">Brochure 2026 · PDF</span>
            </Link>
          </div>
        </Container>
      </section>

      <section className="res-list" aria-labelledby="res-list-title">
        <Container>
          <h2 id="res-list-title" className="sr-only">
            Les documents
          </h2>
          <ul className="res-list__grid">
            {docs.map((r) => (
              <li key={r.href}>
                <PubCard
                  href={r.href}
                  type={TYPES[r.icon] ?? "Publication"}
                  title={r.label}
                  text={r.desc}
                  action="Recevoir le document"
                  cover={r.cover}
                  landscape={r.icon === "barometre"}
                />
              </li>
            ))}
          </ul>

          <Link href="/insights" className="res-insights">
            <span className="res-insights__icon" aria-hidden>
              <IconLayers size={26} />
            </span>
            <span className="res-insights__copy">
              <span className="pub-card__type">Insights</span>
              <span className="res-insights__title">Analyses et lectures CFO 4.0</span>
              <span className="res-insights__go">
                Lire les analyses
                <IconArrowRight />
              </span>
            </span>
            {articles.length ? (
              <ul className="res-insights__list">
                {articles.map((a) => (
                  <li key={a.slug}>
                    <span className="res-insights__meta">
                      {a.category} · {a.dateLabel}
                    </span>
                    <span className="res-insights__name">{a.titre}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </Link>
        </Container>
      </section>

      <section className="cta-band" aria-labelledby="res-cta-title">
        <Container>
          <div className="cta-band__inner">
            <div>
              <p className="cta-band__kicker">Promotion 1 · rentrée le 30 octobre 2026</p>
              <h2 id="res-cta-title" className="cta-band__title">
                Une question sur le certificat ?
              </h2>
            </div>
            <div className="cta-band__actions">
              <ButtonLink href="/candidater" className="sem-hero__cta-primary">
                Candidater
                <IconArrowRight />
              </ButtonLink>
              <ButtonLink href="/faq" variant="ghost" className="sem-hero__cta-secondary">
                Consulter la FAQ
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
