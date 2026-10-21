"use client";

import Image from "next/image";
import Link from "next/link";
import { type ComponentType, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusPill, TypePill } from "@/components/admin/AdminUi";
import {
  IconArrowRight,
  IconBook,
  IconCal,
  IconFileText,
  IconInbox,
  IconPhone,
  IconPlay,
  IconUsers,
} from "@/components/icons";
import { CountUp, Reveal } from "@/components/motion";
import { ButtonLink, KickerIcon } from "@/components/ui";
import { adminFetch, type AdminStats, type Lead, type Paginated } from "@/lib/admin-client";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    timeZone: "Africa/Casablanca",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const CONTENT: {
  href: string;
  label: string;
  tip: string;
  icon: ComponentType<{ size?: number }>;
  key: "seminars" | "videos" | "insights" | "speakers";
}[] = [
  {
    href: "/admin/seminars",
    label: "Séminaires",
    tip: "Programme du certificat",
    icon: IconCal as ComponentType<{ size?: number }>,
    key: "seminars",
  },
  {
    href: "/admin/videos",
    label: "Vidéos",
    tip: "Playlists & témoignages",
    icon: IconPlay as ComponentType<{ size?: number }>,
    key: "videos",
  },
  {
    href: "/admin/insights",
    label: "Insights",
    tip: "Articles & analyses",
    icon: IconBook as ComponentType<{ size?: number }>,
    key: "insights",
  },
  {
    href: "/admin/speakers",
    label: "Intervenants",
    tip: "Fiches professeurs",
    icon: IconUsers as ComponentType<{ size?: number }>,
    key: "speakers",
  },
];

type MosaicTile =
  | { kind: "photo"; src: string }
  | {
      kind: "stat";
      href: string;
      icon: ComponentType<{ size?: number }>;
      num: string | number;
      unit: string;
      label: string;
      dark?: boolean;
    }
  | { kind: "cta"; href: string; label: string };

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recent, setRecent] = useState<Lead[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      adminFetch<AdminStats>("dashboard/stats"),
      adminFetch<Paginated<Lead>>("leads?status=new&page_size=5&ordering=-created_at"),
    ])
      .then(([s, leads]) => {
        setStats(s);
        setRecent(leads.results);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Erreur"));
  }, []);

  const todo = stats?.new ?? 0;
  const ready = Boolean(stats);

  const mosaic: MosaicTile[] = [
    { kind: "photo", src: "/images/home/campus.png" },
    {
      kind: "stat",
      href: "/admin/leads?type=candidature",
      icon: IconUsers,
      num: ready ? stats!.candidature : "—",
      unit: "dossiers",
      label: "candidatures",
    },
    { kind: "photo", src: "/images/home/about.png" },
    {
      kind: "stat",
      href: "/admin/leads",
      icon: IconInbox,
      num: ready ? todo : "—",
      unit: todo === 1 ? "demande" : "demandes",
      label: "à traiter maintenant",
      dark: true,
    },
    { kind: "photo", src: "/images/home/conference.png" },
    {
      kind: "stat",
      href: "/admin/leads?type=rappel",
      icon: IconPhone,
      num: ready ? stats!.rappel : "—",
      unit: "rappels",
      label: "à rappeler",
    },
    {
      kind: "stat",
      href: "/admin/leads?type=document",
      icon: IconFileText,
      num: ready ? stats!.document : "—",
      unit: "docs",
      label: "brochure & PDF",
    },
    {
      kind: "stat",
      href: "/admin/leads",
      icon: IconCal,
      num: ready ? stats!.week : "—",
      unit: "reçus",
      label: "cette semaine",
      dark: true,
    },
    { kind: "cta", href: "/admin/leads", label: "Traiter" },
  ];

  return (
    <AdminShell>
      <section className="cms-hero sem-hero" aria-labelledby="cms-dash-title">
        <div className="cms-hero__inner sem-hero__inner">
          <p className="sem-hero__crumbs" aria-label="Fil d’Ariane">
            <span>CFO 4.0</span>
            <span aria-hidden="true">/</span>
            <span>Administration</span>
          </p>

          <div className="sem-hero__grid-layout cms-hero__grid">
            <div className="sem-hero__copy">
              <p className="sem-hero__index">
                <span className="sem-hero__badge">
                  <KickerIcon label="Pilotage" bare className="text-white" />
                  Pilotage
                </span>
                {ready
                  ? `${todo} nouvelle${todo > 1 ? "s" : ""} · ${stats!.week} cette semaine`
                  : "Chargement des indicateurs…"}
              </p>
              <h1 id="cms-dash-title" className="sem-hero__title">
                Tableau de bord
              </h1>
              <p className="sem-hero__lead">
                Ce qu’il faut traiter, et l’état du contenu géré ici — candidatures, rappels, documents et programme.
              </p>
              <ul className="sem-hero__meta" aria-label="Raccourcis">
                <li>
                  <IconInbox size={16} />
                  {ready ? todo : "—"} à traiter
                </li>
                <li>
                  <IconCal />
                  {ready ? stats!.week : "—"} reçus / 7 j
                </li>
              </ul>
              <div className="sem-hero__ctas">
                <ButtonLink href="/admin/leads" variant="ghost" className="sem-hero__cta-secondary">
                  <IconInbox size={18} />
                  Boîte entrante
                </ButtonLink>
                <ButtonLink href="/admin/leads" className="sem-hero__cta-primary">
                  Traiter les demandes
                  <IconArrowRight />
                </ButtonLink>
              </div>
            </div>

            <ul className="iv-faces is-admissions cms-hero__faces" aria-label="Indicateurs">
              {mosaic.map((tile, i) => {
                if (tile.kind === "photo") {
                  return (
                    <li key={`photo-${i}`} className={`iv-faces__item is-${i + 1}`} aria-hidden>
                      <span className="iv-faces__link">
                        <Image
                          src={tile.src}
                          alt=""
                          fill
                          sizes="160px"
                          className="iv-faces__img"
                        />
                      </span>
                    </li>
                  );
                }
                if (tile.kind === "cta") {
                  return (
                    <li key="cta" className="iv-faces__item">
                      <Link href={tile.href} className="iv-faces__link iv-faces__more is-cta">
                        <IconArrowRight />
                        <span className="iv-faces__more-label">{tile.label}</span>
                      </Link>
                    </li>
                  );
                }
                const Icon = tile.icon;
                return (
                  <li key={tile.label} className={`iv-faces__item is-${i + 1}`}>
                    <Link
                      href={tile.href}
                      className={`iv-faces__link iv-faces__stat${tile.dark ? " is-dark" : ""}`}
                    >
                      <span className="iv-faces__stat-icon" aria-hidden>
                        <Icon size={16} />
                      </span>
                      <strong>
                        {typeof tile.num === "number" ? <CountUp value={tile.num} /> : tile.num}
                        <small>{tile.unit}</small>
                      </strong>
                      <span>{tile.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {error ? <p className="cms-alert">{error}</p> : null}

      <div className="cms-dash-grid cms-dash-grid--below-hero">
        <Reveal as="section" className="cms-dash-panel">
          <header className="cms-dash-panel__head">
            <h2>Dernières demandes</h2>
            <Link href="/admin/leads">Tout voir</Link>
          </header>
          {recent.length === 0 ? (
            <p className="cms-dash-panel__empty">Pas de nouvelles demandes pour le moment.</p>
          ) : (
            <ul className="cms-dash-feed">
              {recent.map((lead) => (
                <li key={lead.id}>
                  <Link href={`/admin/leads?type=${lead.type}`} className="cms-dash-lead">
                    <span className="cms-dash-lead__meta">
                      <TypePill type={lead.type} />
                      <StatusPill status={lead.status} />
                    </span>
                    <strong className="cms-dash-lead__name">{lead.full_name || "Sans nom"}</strong>
                    <span className="cms-dash-lead__sub">
                      {lead.email}
                      <span aria-hidden="true"> · </span>
                      {formatDate(lead.created_at)}
                    </span>
                    <span className="cms-dash-lead__go" aria-hidden>
                      <IconArrowRight />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Reveal>

        <Reveal delay={80} as="section" className="cms-dash-panel">
          <header className="cms-dash-panel__head">
            <h2>Contenu</h2>
            <span className="cms-dash-panel__hint">Géré dans l’admin</span>
          </header>
          <ul className="cms-stats__content iv-faces is-admissions">
            {CONTENT.map((card) => {
              const Icon = card.icon;
              const value = stats ? stats[card.key] ?? 0 : "—";
              return (
                <li key={card.href} className="iv-faces__item">
                  <Link href={card.href} className="iv-faces__link iv-faces__stat">
                    <span className="iv-faces__stat-icon" aria-hidden>
                      <Icon size={16} />
                    </span>
                    <strong>
                      {typeof value === "number" ? <CountUp value={value} /> : value}
                      <small>{card.label.toLowerCase()}</small>
                    </strong>
                    <span>{card.tip}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </AdminShell>
  );
}
