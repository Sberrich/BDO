"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import {
  IconArrowRight,
  IconBarChart,
  IconCal,
  IconClock,
  IconFileText,
  IconGrid,
  IconInbox,
  IconJuryMark,
  IconLayers,
  IconSearch,
  IconSort,
} from "@/components/icons";
import { ButtonLink, Container } from "@/components/ui";
import type { InsightArticle, InsightCategory } from "@/lib/cms";

type Props = {
  categories: readonly InsightCategory[];
  articles: readonly InsightArticle[];
};

function categoryIcon(category: string, size = 14): ReactNode {
  switch (category) {
    case "Baromètre":
      return <IconBarChart size={size} />;
    case "Livre blanc":
      return <IconFileText size={size} />;
    case "Méthode":
      return <IconLayers size={size} />;
    case "Pédagogie":
      return <IconJuryMark size={size} />;
    default:
      return <IconGrid size={size} />;
  }
}

export function InsightsExplorer({ categories, articles }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<InsightCategory>("Tout");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = articles.filter((a) => {
      if (category !== "Tout" && a.category !== category) return false;
      if (!q) return true;
      return (
        a.titre.toLowerCase().includes(q) ||
        a.resume.toLowerCase().includes(q) ||
        a.kicker.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      );
    });
    list = [...list].sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return sort === "newest" ? db - da : da - db;
    });
    return list;
  }, [articles, category, query, sort]);

  const featured = !query.trim() && category === "Tout" ? filtered[0] : null;
  const rest = featured ? filtered.slice(1) : filtered;

  return (
    <>
      <section id="explorer" className="insights-explorer" aria-labelledby="insights-list-title">
        <Container className="insights-explorer__inner">
          <div className="insights-toolbar">
            <label className="insights-search">
              <span className="sr-only">Rechercher</span>
              <span className="insights-search__icon" aria-hidden>
                <IconSearch size={17} />
              </span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher une analyse…"
                className="insights-search__input"
              />
            </label>
            <label className="insights-sort">
              <span className="insights-sort__label">
                <IconSort size={14} />
                Trier par
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as "newest" | "oldest")}
                className="insights-sort__select"
              >
                <option value="newest">Plus récent</option>
                <option value="oldest">Plus ancien</option>
              </select>
            </label>
          </div>

          <div className="insights-head">
            <div>
              <h2 id="insights-list-title" className="insights-head__title">
                Toutes les analyses
              </h2>
              <p className="insights-head__count" aria-live="polite">
                {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
              </p>
            </div>
            <div
              role="radiogroup"
              aria-label="Filtrer par catégorie"
              className="insights-filters"
            >
              {categories.map((c) => {
                const active = category === c;
                return (
                  <button
                    key={c}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setCategory(c)}
                    className={`insights-filter ${active ? "is-active" : ""}`}
                  >
                    <span className="insights-filter__icon" aria-hidden>
                      {categoryIcon(c)}
                    </span>
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="insights-empty">
              <div className="insights-empty__icon" aria-hidden>
                <IconInbox />
              </div>
              <p className="insights-empty__title">Aucun insight trouvé</p>
              <p className="insights-empty__text">
                Essayez un autre mot-clé ou réinitialisez les filtres. Vous pouvez
                aussi consulter les publications du programme.
              </p>
              <div className="insights-empty__actions">
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setCategory("Tout");
                  }}
                  className="insights-empty__reset"
                >
                  Réinitialiser
                </button>
                <ButtonLink href="/ressources">Voir les ressources</ButtonLink>
              </div>
            </div>
          ) : (
            <div className="insights-results">
              {featured ? (
                <Link
                  href={`/insights/${featured.slug}`}
                  className="insights-feature"
                >
                  <span className="insights-feature__glow" aria-hidden />
                  <span className="insights-feature__meta">
                    <span className="insights-chip">
                      {categoryIcon(featured.category)}
                      {featured.category}
                    </span>
                    <span className="insights-meta">
                      <IconClock />
                      {featured.lecture}
                    </span>
                    <span className="insights-meta">
                      <IconCal />
                      {featured.dateLabel}
                    </span>
                  </span>
                  <span className="insights-feature__kicker">À la une</span>
                  <h3 className="insights-feature__title">{featured.titre}</h3>
                  <p className="insights-feature__resume">{featured.resume}</p>
                  <span className="insights-feature__go">
                    Lire l’analyse
                    <IconArrowRight />
                  </span>
                </Link>
              ) : null}

              {rest.length ? (
                <ul className="insights-grid">
                  {rest.map((a, i) => (
                    <li key={a.slug}>
                      <Link href={`/insights/${a.slug}`} className="insights-card">
                        <span className="insights-card__top">
                          <span className="insights-chip">
                            {categoryIcon(a.category)}
                            {a.category}
                          </span>
                          <span className="insights-card__index" aria-hidden>
                            {String(i + (featured ? 2 : 1)).padStart(2, "0")}
                          </span>
                        </span>
                        <h3 className="insights-card__title">{a.titre}</h3>
                        <p className="insights-card__resume">{a.resume}</p>
                        <span className="insights-card__foot">
                          <span className="insights-meta">
                            <IconCal />
                            {a.dateLabel}
                          </span>
                          <span className="insights-meta">
                            <IconClock />
                            {a.lecture}
                          </span>
                          <span className="insights-card__go">
                            Lire
                            <IconArrowRight />
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          )}
        </Container>
      </section>

      <section className="insights-band" aria-labelledby="insights-band-title">
        <Container className="insights-band__inner">
          <div>
            <p className="insights-band__kicker">Suite du parcours</p>
            <h2 id="insights-band-title" className="insights-band__title">
              Restez informé
            </h2>
            <p className="insights-band__lead">
              Une question sur nos analyses ou sur le prochain cycle CFO 4.0 ?
              Écrivez-nous ou déposez votre candidature.
            </p>
          </div>
          <div className="insights-band__actions">
            <ButtonLink href="/a-propos#contact">Nous contacter</ButtonLink>
            <ButtonLink href="/candidater" variant="secondary">
              Candidater
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
