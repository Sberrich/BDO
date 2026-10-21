"use client";

import Link from "next/link";
import { type ComponentType, type FormEvent, type ReactNode, useState } from "react";
import { IconSearch } from "@/components/icons";
import { CountUp } from "@/components/motion";
import { Button, ButtonLink, fieldClass, KickerIcon } from "@/components/ui";

export type CmsHeroStat = {
  num: string | number;
  unit: string;
  label: string;
  dark?: boolean;
  active?: boolean;
  href?: string;
  icon?: ComponentType<{ size?: number }>;
};

export type PublishFilter = "all" | "published" | "draft";

export function AdminPageHeader({
  kicker,
  title,
  lead,
  actions,
  crumbs = ["CFO 4.0", "Administration"],
  stats,
}: {
  kicker: string;
  title: string;
  lead?: ReactNode;
  actions?: ReactNode;
  crumbs?: string[];
  stats?: CmsHeroStat[];
}) {
  const hasStats = Boolean(stats?.length);

  return (
    <section className={`cms-page-hero${hasStats ? " has-stats" : ""}`} aria-labelledby="cms-page-title">
      <div className="cms-page-hero__grid">
        <div className="cms-page-hero__copy">
          {crumbs.length ? (
            <p className="cms-page-hero__crumbs" aria-label="Fil d’Ariane">
              {crumbs.map((c, i) => (
                <span key={`${c}-${i}`}>
                  {i > 0 ? <span aria-hidden="true"> / </span> : null}
                  {c}
                </span>
              ))}
            </p>
          ) : null}
          <p className="cms-page-hero__badge">
            <KickerIcon label={kicker} bare />
            {kicker}
          </p>
          <h1 id="cms-page-title" className="cms-page-hero__title">
            {title}
          </h1>
          {lead ? <p className="cms-page-hero__lead">{lead}</p> : null}
          {actions ? <div className="cms-page-hero__ctas">{actions}</div> : null}
        </div>

        {hasStats ? (
          <ul className="cms-page-hero__faces iv-faces is-admissions" aria-label="Indicateurs">
            {stats!.map((s, i) => {
              const Icon = s.icon;
              const inner = (
                <>
                  {Icon ? (
                    <span className="iv-faces__stat-icon" aria-hidden>
                      <Icon size={16} />
                    </span>
                  ) : null}
                  <strong>
                    {typeof s.num === "number" ? <CountUp value={s.num} /> : s.num}
                    <small>{s.unit}</small>
                  </strong>
                  <span>{s.label}</span>
                </>
              );
              const cls = `iv-faces__link iv-faces__stat${s.dark ? " is-dark" : ""}${s.active ? " is-active" : ""}`;
              return (
                <li key={`${s.label}-${i}`} className={`iv-faces__item is-${i + 1}`}>
                  {s.href ? (
                    <Link href={s.href} className={cls} aria-current={s.active ? "page" : undefined}>
                      {inner}
                    </Link>
                  ) : (
                    <span className={cls}>{inner}</span>
                  )}
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: "Nouveau",
    in_progress: "En cours",
    accepted: "Accepté",
    rejected: "Refusé",
    archived: "Archivé",
  };
  return <span className={`adm-pill adm-pill--${status}`}>{map[status] || status}</span>;
}

export function TypePill({ type }: { type: string }) {
  const map: Record<string, string> = {
    candidature: "Candidature",
    document: "Document",
    session: "Session",
    rappel: "Rappel",
  };
  return <span className={`adm-chip adm-chip--${type}`}>{map[type] || type}</span>;
}

export function PublishPill({ published }: { published: boolean }) {
  return (
    <span className={`adm-pill adm-pill--${published ? "published" : "draft"}`}>
      {published ? "Publié" : "Brouillon"}
    </span>
  );
}

export function EmptyState({
  title,
  lead,
  action,
}: {
  title: string;
  lead?: string;
  action?: ReactNode;
}) {
  return (
    <div className="cms-empty">
      <p className="cms-empty__title">{title}</p>
      {lead ? <p className="cms-empty__lead">{lead}</p> : null}
      {action ? <div className="cms-empty__action">{action}</div> : null}
    </div>
  );
}

export function AdminToolbar({
  query,
  onQueryChange,
  placeholder = "Rechercher…",
  publish,
  onPublishChange,
  counts,
  resultLabel,
}: {
  query: string;
  onQueryChange: (q: string) => void;
  placeholder?: string;
  publish?: PublishFilter;
  onPublishChange?: (f: PublishFilter) => void;
  counts?: { all: number; published: number; draft: number };
  resultLabel?: string;
}) {
  function onSubmit(e: FormEvent) {
    e.preventDefault();
  }

  return (
    <div className="cms-manage-bar">
      <form className="cms-search cms-search--bar" onSubmit={onSubmit} role="search">
        <IconSearch size={18} />
        <input
          className={fieldClass}
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
        />
      </form>

      {onPublishChange && counts ? (
        <div className="cms-filters" role="group" aria-label="Filtrer par statut">
          {(
            [
              { id: "all", label: "Tous", n: counts.all },
              { id: "published", label: "Publiés", n: counts.published },
              { id: "draft", label: "Brouillons", n: counts.draft },
            ] as const
          ).map((f) => (
            <button
              key={f.id}
              type="button"
              className={`cms-filters__chip${publish === f.id ? " is-active" : ""}`}
              onClick={() => onPublishChange(f.id)}
            >
              {f.label}
              <strong>{f.n}</strong>
            </button>
          ))}
        </div>
      ) : null}

      {resultLabel ? <p className="cms-manage-bar__meta">{resultLabel}</p> : null}
    </div>
  );
}

export function AdminListPanel({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`cms-list-panel ${className}`.trim()} aria-label={title || "Liste"}>
      {title ? (
        <header className="cms-list-panel__head">
          <h2>{title}</h2>
        </header>
      ) : null}
      {children}
    </section>
  );
}

/** Shared list-filter state for content CRUD pages. */
export function useContentFilters() {
  const [query, setQuery] = useState("");
  const [publish, setPublish] = useState<PublishFilter>("all");
  return { query, setQuery, publish, setPublish };
}

export function publishCounts<T>(rows: T[], getPublished: (row: T) => boolean) {
  const published = rows.filter(getPublished).length;
  return { all: rows.length, published, draft: rows.length - published };
}

export function filterContentRows<T>(
  rows: T[],
  query: string,
  publish: PublishFilter,
  getPublished: (row: T) => boolean,
  getSearchText: (row: T) => string,
): T[] {
  const q = query.trim().toLowerCase();
  return rows.filter((row) => {
    const pub = getPublished(row);
    if (publish === "published" && !pub) return false;
    if (publish === "draft" && pub) return false;
    if (!q) return true;
    return getSearchText(row).toLowerCase().includes(q);
  });
}

export { Button, ButtonLink };
