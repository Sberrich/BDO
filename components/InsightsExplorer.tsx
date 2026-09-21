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
import type { InsightArticle, InsightCategory } from "@/lib/payload/insights";

type Props = {
  categories: readonly InsightCategory[];
  articles: readonly InsightArticle[];
};

function categoryIcon(category: string): ReactNode {
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
      return <IconGrid size={14} />;
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

  return (
    <>
      <section id="explorer" className="scroll-mt-28 bg-cream py-[clamp(2.5rem,6vw,4.5rem)]">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative block min-w-0 flex-1 max-w-xl">
              <span className="sr-only">Rechercher</span>
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden>
                <IconSearch size={17} />
              </span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher…"
                className="w-full rounded-md border border-line bg-white py-[0.7rem] pl-10 pr-3.5 text-ink outline-none transition placeholder:text-muted hover:border-muted focus:border-blue focus:ring-2 focus:ring-blue/20"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-[0.1em] text-[0.6875rem]">
                <IconSort size={14} />
                Trier par
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as "newest" | "oldest")}
                className="rounded-md border border-line bg-white px-3 py-2.5 font-semibold text-ink outline-none focus:border-blue focus:ring-2 focus:ring-blue/20"
              >
                <option value="newest">Plus récent</option>
                <option value="oldest">Plus ancien</option>
              </select>
            </label>
          </div>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-ink sm:text-3xl">Toutes les analyses</h2>
              <p className="mt-1 text-sm text-muted">
                {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
              </p>
            </div>
            <div role="radiogroup" aria-label="Filtrer par catégorie" className="flex flex-wrap gap-2">
              {categories.map((c) => {
                const active = category === c;
                return (
                  <button
                    key={c}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setCategory(c)}
                    className={`inline-flex items-center gap-1.5 rounded-md border px-3.5 py-2 text-sm font-bold transition ${
                      active
                        ? "border-navy bg-navy text-white"
                        : "border-line bg-white text-muted hover:border-blue hover:text-blue"
                    }`}
                  >
                    <span className={active ? "text-white" : "text-blue"}>{categoryIcon(c)}</span>
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="mt-10 rounded-md border border-line bg-white px-6 py-14 text-center">
              <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-md bg-cream text-blue">
                <IconInbox />
              </div>
              <p className="text-lg font-bold text-ink">Aucun insight trouvé</p>
              <p className="mx-auto mt-2 max-w-md text-muted">
                Essayez un autre mot-clé ou réinitialisez les filtres. Vous pouvez aussi consulter les publications du
                programme.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setCategory("Tout");
                  }}
                  className="inline-flex min-h-11 items-center rounded-md border border-line bg-white px-4 text-sm font-extrabold text-navy hover:border-blue"
                >
                  Réinitialiser
                </button>
                <ButtonLink href="/ressources">Voir les ressources</ButtonLink>
              </div>
            </div>
          ) : (
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/insights/${a.slug}`}
                    className="group flex h-full flex-col rounded-md border border-line bg-white p-5 shadow-[var(--shadow-xs)] transition hover:-translate-y-0.5 hover:border-blue/35 hover:shadow-[var(--shadow-md)]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-1.5 rounded bg-blue/10 px-2 py-1 text-[0.6875rem] font-extrabold uppercase tracking-[0.1em] text-blue">
                        {categoryIcon(a.category)}
                        {a.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted">
                        <IconClock />
                        {a.lecture}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-extrabold leading-snug tracking-[-0.02em] text-ink transition group-hover:text-blue">
                      {a.titre}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted line-clamp-3">{a.resume}</p>
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted">
                        <IconCal />
                        {a.dateLabel}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-extrabold text-blue opacity-0 transition group-hover:opacity-100">
                        Lire
                        <IconArrowRight />
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>

      <section className="border-t border-line bg-white py-[clamp(2.5rem,5vw,3.75rem)]">
        <Container className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-ink">Restez informé</h2>
            <p className="mt-2 max-w-xl text-muted">
              Une question sur nos analyses ou sur le prochain cycle CFO 4.0 ? Écrivez-nous ou déposez votre candidature.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
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
