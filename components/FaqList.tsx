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
    const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return data.faq.groupes
      .map((g) => ({
        ...g,
        questions: (g.questions as unknown as Q[]).filter((item) => {
          if (onlyHome && !item.accueil) return false;
          if (!q) return true;
          const hay = `${item.q} ${item.r}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          return hay.includes(q);
        }),
      }))
      .filter((g) => g.questions.length);
  }, [query, onlyHome]);

  function onQueryChange(value: string) {
    setQuery(value);
    setOpen(null);
  }

  return (
    <div>
      {!onlyHome && (
        <form className="mb-8 max-w-lg" onSubmit={(e) => e.preventDefault()}>
          <label className="block text-sm font-semibold" htmlFor="faq-q">
            Rechercher dans les questions
          </label>
          <div className="relative mt-1">
            <input
              id="faq-q"
              className="w-full rounded-md border border-line bg-white py-3 pl-3.5 pr-10 outline-none transition hover:border-muted focus:border-blue focus:ring-2 focus:ring-blue/20"
              placeholder="tarif, entreprise, Ramadan…"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
            </span>
          </div>
        </form>
      )}
      {groups.map((g) => (
        <section key={g.id} id={g.id} className="mb-10">
          {!onlyHome && <h2 className="mb-4 text-2xl font-bold">{g.titre}</h2>}
          <div className="overflow-hidden rounded-md border border-line bg-white">
            {g.questions.map((item, i) => {
              const isOpen = open === item.id;
              return (
                <div key={item.id} id={item.id} className={i === 0 ? "" : "border-t border-line"}>
                  <h3 className="m-0">
                    <button
                      type="button"
                      className={`flex min-h-12 w-full items-start justify-between gap-4 px-5 py-4 text-left font-semibold transition hover:bg-cream/70 hover:text-blue ${isOpen ? "bg-cream/50 text-blue" : ""}`}
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? null : item.id)}
                    >
                      {plain(item.q)}
                      <span
                        className={`relative mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-blue transition ${isOpen ? "rotate-45 bg-blue text-white" : "bg-[var(--wash)]"}`}
                        aria-hidden
                      >
                        <span className="absolute h-0.5 w-3 rounded-sm bg-current" />
                        <span className="absolute h-3 w-0.5 rounded-sm bg-current" />
                      </span>
                    </button>
                  </h3>
                  <div className={`faq-panel ${isOpen ? "is-open" : ""}`}>
                    <div>
                      <div className="faq-answer space-y-3 px-5 pb-5 text-muted" dangerouslySetInnerHTML={{ __html: rich(item.r) }} />
                      {item.lien && (
                        <p className="px-5 pb-5">
                          <a className="text-sm font-semibold text-blue hover:text-blue-dark" href={appHref(item.lien.href)}>
                            {item.lien.texte}
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
      {groups.length === 0 && <p className="text-muted">Aucune question ne correspond à votre recherche.</p>}
    </div>
  );
}
