"use client";

import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useCallback, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPageHeader, StatusPill, TypePill } from "@/components/admin/AdminUi";
import { Button, ButtonLink, fieldClass } from "@/components/ui";
import {
  IconArrowRight,
  IconFileText,
  IconInbox,
  IconPhone,
  IconSearch,
  IconUsers,
  IconCal,
} from "@/components/icons";
import { adminFetch, type Lead, type Paginated } from "@/lib/admin-client";

const TYPES = [
  { id: "candidature", label: "Candidatures", hint: "Dossiers complets" },
  { id: "document", label: "Documents", hint: "Brochure & PDF" },
  { id: "session", label: "Sessions", hint: "Info en ligne" },
  { id: "rappel", label: "Rappels", hint: "À rappeler" },
] as const;

const STATUSES = [
  { id: "new", label: "Nouveau" },
  { id: "in_progress", label: "En cours" },
  { id: "accepted", label: "Accepté" },
  { id: "rejected", label: "Refusé" },
  { id: "archived", label: "Archivé" },
];

const FIELD_LABELS: Record<string, string> = {
  prenom: "Prénom",
  nom: "Nom",
  email: "E-mail",
  telephone: "Téléphone",
  fonction: "Fonction",
  entreprise: "Entreprise",
  ville: "Ville",
  participation: "Participation",
  secteur: "Secteur",
  niveau: "Niveau",
  diplome: "Diplôme",
  decouverte: "Découverte",
  interet: "Intérêt",
  moment: "Créneau",
  creneau: "Créneau",
  document: "Document",
  consentement: "Consentement",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    timeZone: "Africa/Casablanca",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function LeadsInner() {
  const params = useSearchParams();
  const type = TYPES.some((t) => t.id === params.get("type")) ? params.get("type")! : "candidature";
  const [q, setQ] = useState(params.get("q") || "");
  const [rows, setRows] = useState<Lead[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [selectedId, setSelectedId] = useState<string | null>(params.get("id"));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const qs = new URLSearchParams({ type, page_size: "100" });
      if (q.trim()) qs.set("search", q.trim());
      const data = await adminFetch<Paginated<Lead>>(`leads?${qs}`);
      setRows(data.results);
      const all = await adminFetch<Paginated<Lead>>("leads?page_size=200");
      const c: Record<string, number> = {};
      for (const t of TYPES) c[t.id] = all.results.filter((r) => r.type === t.id).length;
      setCounts(c);

      setSelectedId((prev) => {
        if (prev && data.results.some((r) => r.id === prev)) return prev;
        return data.results[0]?.id ?? null;
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [type, q]);

  useEffect(() => {
    load();
  }, [load]);

  const selected = rows.find((r) => r.id === selectedId) ?? null;

  useEffect(() => {
    setNotes(selected?.notes || "");
  }, [selected?.id, selected?.notes]);

  async function setStatus(id: string, status: string) {
    setSaving(true);
    try {
      await adminFetch(`leads/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function saveNotes() {
    if (!selected) return;
    setSaving(true);
    try {
      await adminFetch(`leads/${selected.id}`, {
        method: "PATCH",
        body: JSON.stringify({ notes }),
      });
      await load();
    } finally {
      setSaving(false);
    }
  }

  function onSearch(e: FormEvent) {
    e.preventDefault();
    load();
  }

  const current = TYPES.find((t) => t.id === type)!;
  const totalInbox = Object.values(counts).reduce((n, v) => n + (v || 0), 0);
  const n = (id: string) => (loading ? "—" : (counts[id] ?? 0));

  return (
    <AdminShell>
      <AdminPageHeader
        kicker="Boîte entrante"
        title="Inscriptions et demandes"
        lead={
          totalInbox === 0 && !loading
            ? "Aucune demande enregistrée pour le moment. Chaque formulaire du site arrivera ici."
            : `Chaque formulaire du site arrive ici. ${loading ? "…" : `${counts[type] ?? 0} ${current.label.toLowerCase()} affichée${(counts[type] ?? 0) > 1 ? "s" : ""}.`}`
        }
        crumbs={["CFO 4.0", "Administration", "Boîte entrante"]}
        actions={
          <ButtonLink href="/admin" variant="ghost" className="!min-h-[48px]">
            Tableau de bord
          </ButtonLink>
        }
        stats={[
          {
            num: loading ? "—" : totalInbox,
            unit: totalInbox === 1 ? "demande" : "demandes",
            label: "boîte entrante",
            dark: true,
            icon: IconInbox,
            href: "/admin/leads",
          },
          {
            num: n("candidature"),
            unit: "dossiers",
            label: "candidatures",
            icon: IconUsers,
            href: "/admin/leads?type=candidature",
            active: type === "candidature",
          },
          {
            num: n("document"),
            unit: "docs",
            label: "brochure & PDF",
            icon: IconFileText,
            href: "/admin/leads?type=document",
            active: type === "document",
          },
          {
            num: n("session"),
            unit: "sessions",
            label: "info en ligne",
            icon: IconCal,
            href: "/admin/leads?type=session",
            active: type === "session",
          },
          {
            num: n("rappel"),
            unit: "rappels",
            label: "à rappeler",
            icon: IconPhone,
            href: "/admin/leads?type=rappel",
            active: type === "rappel",
          },
        ]}
      />

      <form className="cms-search cms-search--wide" onSubmit={onSearch}>
        <IconSearch size={18} />
        <input
          className={fieldClass}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Rechercher dans ${current.label.toLowerCase()}…`}
        />
        <Button type="submit" className="!min-h-[46px] !px-5">
          Rechercher
        </Button>
      </form>

      {error ? <p className="cms-alert">{error}</p> : null}

      <div className="cms-leads-split">
        <section className="cms-leads-list" aria-label={current.label}>
          <header className="cms-leads-list__head">
            <h2>{current.label}</h2>
            <span>{loading ? "…" : `${rows.length} résultat${rows.length > 1 ? "s" : ""}`}</span>
          </header>

          {loading ? <p className="cms-dash-panel__empty">Chargement des demandes…</p> : null}
          {!loading && !error && rows.length === 0 ? (
            <div className="cms-empty">
              <p className="cms-empty__title">Aucune {current.label.toLowerCase()} pour l’instant</p>
              <p className="cms-empty__lead">Les envois du site apparaîtront automatiquement ici.</p>
            </div>
          ) : null}

          <ul className="cms-dash-feed">
            {rows.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  className={`cms-dash-lead cms-leads-row${selectedId === s.id ? " is-active" : ""}`}
                  onClick={() => setSelectedId(s.id)}
                >
                  <span className="cms-dash-lead__meta">
                    <TypePill type={s.type} />
                    <StatusPill status={s.status} />
                  </span>
                  <strong className="cms-dash-lead__name">{s.full_name || "Sans nom"}</strong>
                  <span className="cms-dash-lead__sub">
                    {s.email}
                    <span aria-hidden="true"> · </span>
                    {formatDate(s.created_at)}
                  </span>
                  <span className="cms-dash-lead__go" aria-hidden>
                    <IconArrowRight />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <aside className="cms-leads-detail" aria-live="polite">
          {!selected ? (
            <div className="cms-leads-detail__empty">
              <span className="cms-leads-detail__icon" aria-hidden>
                <IconInbox size={28} />
              </span>
              <p className="cms-leads-detail__title">Sélectionnez une demande</p>
              <p className="cms-leads-detail__lead">
                Les détails, pièces et le statut s’affichent ici pour remplir toute la largeur de l’écran.
              </p>
            </div>
          ) : (
            <>
              <header className="cms-leads-detail__head">
                <div>
                  <div className="cms-dash-lead__meta" style={{ marginBottom: "0.65rem" }}>
                    <TypePill type={selected.type} />
                    <StatusPill status={selected.status} />
                  </div>
                  <h2 className="cms-leads-detail__name">{selected.full_name || "Sans nom"}</h2>
                  <p className="cms-leads-detail__when">{formatDate(selected.created_at)}</p>
                </div>
                <p className="cms-leads-detail__ref">Réf. {selected.id}</p>
              </header>

              <dl className="cms-leads-fields">
                {Object.entries(selected.fields).map(([k, v]) => (
                  <div key={k} className="cms-leads-fields__row">
                    <dt>{FIELD_LABELS[k] || k}</dt>
                    <dd>
                      {k === "email" ? (
                        <a href={`mailto:${v}`}>{v}</a>
                      ) : k === "telephone" ? (
                        <a href={`tel:${String(v).replace(/\s/g, "")}`}>{v}</a>
                      ) : (
                        v
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              {selected.files?.length ? (
                <div className="cms-leads-files">
                  <h3>Fichiers</h3>
                  <ul>
                    {selected.files.map((f) => (
                      <li key={f.id}>
                        <span>{f.label || f.field}</span>
                        <strong>{f.original_name}</strong>
                        <span>{Math.round(f.size / 1024)} Ko</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <label className="cms-leads-detail__status">
                Faire évoluer le statut
                <select
                  className={fieldClass}
                  value={selected.status}
                  disabled={saving}
                  onChange={(e) => setStatus(selected.id, e.target.value)}
                >
                  {STATUSES.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="cms-leads-detail__notes">
                Notes internes
                <textarea
                  className={fieldClass}
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Suivi, relance, décision…"
                />
              </label>
              <div className="cms-leads-detail__actions">
                <Button type="button" onClick={saveNotes} disabled={saving}>
                  {saving ? "Enregistrement…" : "Enregistrer les notes"}
                </Button>
                {selected.email ? (
                  <a className="btn-icon cms-leads-mail" href={`mailto:${selected.email}`}>
                    Écrire un e-mail
                    <IconArrowRight />
                  </a>
                ) : null}
              </div>
            </>
          )}
        </aside>
      </div>
    </AdminShell>
  );
}

export default function AdminLeadsPage() {
  return (
    <Suspense
      fallback={
        <AdminShell>
          <p className="cms-dash-panel__empty">Chargement…</p>
        </AdminShell>
      }
    >
      <LeadsInner />
    </Suspense>
  );
}
