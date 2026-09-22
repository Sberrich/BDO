"use client";

import { useMemo, useState } from "react";
import { data } from "@/lib/content";
import { appHref, plain, rich } from "@/lib/text";

type Q = {
  id: string;
  q: string;
  r: string;
  accueil?: boolean;
  lien?: { texte: string; href: string };
};

export function FaqList({ onlyHome }: { onlyHome?: boolean }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const groups = useMemo(() => {
    const q = query
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return data.faq.groupes
      .map((g) => ({
        ...g,
        questions: (g.questions as unknown as Q[]).filter((item) => {
          if (onlyHome && !item.accueil) return false;
          if (!q) return true;
          const hay = `${item.q} ${item.r}`
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
          return hay.includes(q);
        }),
      }))
      .filter((g) => g.questions.length);
  }, [query, onlyHome]);

  const total = useMemo(
    () => groups.reduce((n, g) => n + g.questions.length, 0),
    [groups],
  );

  function onQueryChange(value: string) {
    setQuery(value);
    setOpen(null);
  }

  return (
    <div className={`faq-explorer ${onlyHome ? "is-compact" : ""}`}>
      {!onlyHome && (
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
                className="faq-explorer__search-input"
                placeholder="tarif, entreprise, Ramadan…"
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
            {query.trim() ? " trouvée" + (total > 1 ? "s" : "") : ""}
          </p>
        </div>
      )}

      {groups.map((g, gi) => (
        <section key={g.id} id={g.id} className="faq-group">
          {!onlyHome && (
            <header className="faq-group__head">
              <span className="faq-group__index" aria-hidden="true">
                {String(gi + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="faq-group__title">{g.titre}</h2>
                <p className="faq-group__meta">
                  {g.questions.length} question{g.questions.length > 1 ? "s" : ""}
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
                    aria-hidden={!isOpen}
                  >
                    <div className="faq-panel__inner">
                      <div
                        className="faq-answer"
                        dangerouslySetInnerHTML={{ __html: rich(item.r) }}
                      />
                      {item.lien && (
                        <p className="faq-item__link">
                          <a href={appHref(item.lien.href)}>
                            {item.lien.texte}
                            <span aria-hidden="true"> →</span>
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
          Aucune question ne correspond à votre recherche.
        </p>
      )}
    </div>
  );
}
