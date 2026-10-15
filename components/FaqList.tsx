"use client";

import { useEffect, useMemo, useState } from "react";
import { IconArrowRight } from "@/components/icons";
import { data } from "@/lib/content";
import { appHref, plain, rich } from "@/lib/text";

type Q = {
  id: string;
  q: string;
  court: string;
  r: string;
  accueil?: boolean;
  lien?: { texte: string; href: string };
};

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const searchable = (html: string) =>
  norm(
    html
      .replace(/\{\{\/?PROV\}\}/g, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&amp;/g, "&"),
  ).replace(/[^a-z0-9%]+/g, " ");

/** Everyday words visitors type that the answers phrase differently. */
const SYNONYMS: Record<string, string[]> = {
  prix: ["tarif", "dh"],
  cout: ["tarif", "dh"],
  couts: ["tarif", "dh"],
  montant: ["tarif", "dh"],
  frais: ["tarif", "frais"],
  payer: ["paiement", "tarif"],
  financement: ["prise en charge", "tarif", "paiement"],
  horaire: ["15 h", "9 h"],
  horaires: ["15 h", "9 h"],
  heures: ["heures", " h "],
  adresse: ["campus"],
  lieu: ["campus", "deroulent"],
  ligne: ["distance", "visioconference"],
  inscription: ["inscription", "candidature"],
  inscrire: ["inscription", "candidature"],
  diplome: ["diplomant"],
  attestation: ["attestation", "certificat"],
  rgpd: ["donnees"],
};

/** Matches from the start of a word, so “li” finds “lieu” but not “publications”. */
function matches(hay: string, token: string) {
  return [token, ...(SYNONYMS[token] ?? [])].some((t) => hay.includes(` ${t}`));
}

export function FaqList({ onlyHome, exclude = [] }: { onlyHome?: boolean; exclude?: string[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const { groups, approx } = useMemo(() => {
    const tokens = norm(query)
      .replace(/[^a-z0-9%]+/g, " ")
      .split(" ")
      .filter((t) => t.length > 1 || /\d/.test(t));
    const run = (every: boolean) =>
      data.faq.groupes
        .map((g) => ({
          ...g,
          questions: (g.questions as unknown as Q[]).filter((item) => {
            if (onlyHome && !item.accueil) return false;
            if (exclude.includes(item.id)) return false;
            if (!tokens.length) return true;
            const hay = ` ${searchable(`${g.titre} ${item.q} ${item.court} ${item.r}`)} `;
            return every
              ? tokens.every((t) => matches(hay, t))
              : tokens.some((t) => matches(hay, t));
          }),
        }))
        .filter((g) => g.questions.length);
    const exact = run(true);
    if (exact.length || tokens.length < 2) return { groups: exact, approx: false };
    return { groups: run(false), approx: true };
  }, [query, onlyHome, exclude]);

  const sections = useMemo(
    () =>
      onlyHome
        ? [
            {
              ...groups[0],
              id: "faq-essentiel",
              questions: groups.flatMap((g) => g.questions),
            },
          ]
        : groups,
    [groups, onlyHome],
  );

  const total = useMemo(
    () => groups.reduce((n, g) => n + g.questions.length, 0),
    [groups],
  );

  useEffect(() => {
    const openFromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const exists = data.faq.groupes.some((g) => g.questions.some((item) => item.id === id));
      if (exists) setOpen(id);
    };
    queueMicrotask(openFromHash);
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  function onQueryChange(value: string) {
    setQuery(value);
    setOpen(null);
  }

  return (
    <div className={`faq-explorer ${onlyHome ? "is-compact" : "has-side"}`}>
      {!onlyHome && (
        <div className="faq-explorer__side">
          <div className="faq-explorer__toolbar">
            <form
              className="faq-explorer__search"
              onSubmit={(e) => e.preventDefault()}
            >
              <label className="faq-explorer__search-label" htmlFor="faq-q">
                Rechercher dans les questions
              </label>
              <div className="faq-explorer__search-field">
                <input
                  id="faq-q"
                  type="search"
                  autoComplete="off"
                  className="faq-explorer__search-input"
                  placeholder="financement, calendrier, admission…"
                  value={query}
                  onChange={(e) => onQueryChange(e.target.value)}
                />
                <span className="faq-explorer__search-icon" aria-hidden>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20l-3.5-3.5" />
                  </svg>
                </span>
              </div>
            </form>
            <p className="faq-explorer__count" aria-live="polite">
              {total} question{total > 1 ? "s" : ""}
              {query.trim() ? (approx ? " proche" : " trouvée") + (total > 1 ? "s" : "") : ""}
            </p>
          </div>
          {groups.length ? (
            <nav className="faq-explorer__nav" aria-label="Thèmes">
              <p className="faq-explorer__nav-title">Thèmes</p>
              <ol>
                {groups.map((g, gi) => (
                  <li key={g.id}>
                    <a href={`#${g.id}`} className="faq-explorer__nav-link">
                      <span className="faq-explorer__nav-n">
                        {String(gi + 1).padStart(2, "0")}
                      </span>
                      <span className="faq-explorer__nav-label">{g.titre}</span>
                      <span className="faq-explorer__nav-count">
                        {g.questions.length}
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}
        </div>
      )}

      <div className="faq-explorer__main">
        {sections.map((g, gi) => (
          <section key={g.id} id={g.id} className="faq-group">
            {!onlyHome && (
              <header className="faq-group__head">
                <span className="faq-group__index" aria-hidden="true">
                  {String(gi + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="faq-group__title">{g.titre}</h2>
                  <p className="faq-group__meta">
                    {g.questions.length} question
                    {g.questions.length > 1 ? "s" : ""}
                  </p>
                </div>
              </header>
            )}

            <div className="faq-accordion">
              {g.questions.map((item) => {
                const isOpen = open === item.id;
                return (
                  <div
                    key={item.id}
                    id={item.id}
                    className={`faq-item ${isOpen ? "is-open" : ""}`}
                  >
                    <h3 className="faq-item__heading">
                      <button
                        type="button"
                        className="faq-item__trigger"
                        aria-expanded={isOpen}
                        aria-controls={`${item.id}-panel`}
                        onClick={() => setOpen(isOpen ? null : item.id)}
                      >
                        <span className="faq-item__q">{plain(item.q)}</span>
                        <span className="faq-item__icon" aria-hidden="true">
                          <span className="faq-item__icon-h" />
                          <span className="faq-item__icon-v" />
                        </span>
                      </button>
                    </h3>
                    <div
                      id={`${item.id}-panel`}
                      role="region"
                      className="faq-panel"
                      inert={!isOpen}
                    >
                      <div className="faq-panel__inner">
                        <p
                          className="faq-answer faq-answer__short"
                          dangerouslySetInnerHTML={{ __html: rich(item.court) }}
                        />
                        <details className="faq-detail">
                          <summary className="faq-detail__toggle">
                            <span className="faq-detail__more">Voir le détail</span>
                            <span className="faq-detail__less">Masquer le détail</span>
                          </summary>
                          <div
                            className="faq-answer faq-detail__body"
                            dangerouslySetInnerHTML={{ __html: rich(item.r) }}
                          />
                        </details>
                        {item.lien && (
                          <p className="faq-item__link">
                            <a href={appHref(item.lien.href)}>
                              {item.lien.texte}
                              <IconArrowRight />
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {groups.length === 0 && (
          <p className="faq-explorer__empty">
            Aucune question ne correspond à « {query.trim()} ».{" "}
            <a href="/admissions#rappel">Posez-la à l’équipe, qui vous rappelle sous 24 h</a>, ou{" "}
            <button type="button" className="faq-explorer__reset" onClick={() => onQueryChange("")}>
              effacez la recherche
            </button>
            .
          </p>
        )}
      </div>
    </div>
  );
}
