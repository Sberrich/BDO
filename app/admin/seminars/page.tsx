"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  AdminListPanel,
  AdminPageHeader,
  AdminToolbar,
  Button,
  EmptyState,
  PublishPill,
  filterContentRows,
  publishCounts,
  useContentFilters,
} from "@/components/admin/AdminUi";
import { IconCal } from "@/components/icons";
import { fieldClass } from "@/components/ui";
import { adminFetch, type Paginated, type SeminarRow } from "@/lib/admin-client";

const empty: Partial<SeminarRow> = {
  numero: 1,
  titre: "",
  slug: "",
  sousTitre: "",
  objectif: "",
  dates: "",
  horaire: "",
  heures: 6,
  lieu: "Campus ISCAE Rabat",
  jour1Matin: "",
  jour1ApresMidi: "",
  jour2Matin: "",
  jour2ApresMidi: "",
  livrable: "",
  actualisation: "",
  intervenants: [],
  isPublished: true,
};

function toForm(s: SeminarRow): Partial<SeminarRow> {
  return {
    ...s,
    jour1Matin: s.jour1Matin || s.jour1?.matin || "",
    jour1ApresMidi: s.jour1ApresMidi || s.jour1?.apresMidi || "",
    jour2Matin: s.jour2Matin || s.jour2?.matin || "",
    jour2ApresMidi: s.jour2ApresMidi || s.jour2?.apresMidi || "",
    intervenants: s.intervenants || [],
  };
}

const isPub = (r: SeminarRow) => r.isPublished !== false;

export default function AdminSeminarsPage() {
  const [rows, setRows] = useState<SeminarRow[]>([]);
  const [editing, setEditing] = useState<Partial<SeminarRow> | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { query, setQuery, publish, setPublish } = useContentFilters();

  async function load() {
    setError("");
    try {
      const data = await adminFetch<Paginated<SeminarRow>>("seminars?page_size=50&ordering=numero");
      setRows(data.results);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!editing?.titre || editing.numero == null) return;
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...editing,
        intervenants: Array.isArray(editing.intervenants)
          ? editing.intervenants
          : String(editing.intervenants || "")
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
      };
      if (editing.slug && rows.some((r) => r.slug === editing.slug)) {
        await adminFetch(`seminars/${editing.slug}`, { method: "PATCH", body: JSON.stringify(payload) });
      } else {
        await adminFetch("seminars", { method: "POST", body: JSON.stringify(payload) });
      }
      setEditing(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enregistrement impossible");
    } finally {
      setSaving(false);
    }
  }

  async function remove(slug: string) {
    if (!confirm("Supprimer ce séminaire du programme ?")) return;
    await adminFetch(`seminars/${slug}`, { method: "DELETE" });
    await load();
  }

  async function togglePublish(s: SeminarRow) {
    await adminFetch(`seminars/${s.slug}`, {
      method: "PATCH",
      body: JSON.stringify({ isPublished: !isPub(s) }),
    });
    await load();
  }

  const counts = publishCounts(rows, isPub);
  const visible = filterContentRows(
    rows,
    query,
    publish,
    isPub,
    (r) => [r.titre, r.slug, r.code, r.dates, r.lieu].filter(Boolean).join(" "),
  );
  const isEdit = Boolean(editing);

  return (
    <AdminShell>
      <AdminPageHeader
        kicker="Programme"
        title="Séminaires"
        lead="Conférence inaugurale, séminaires, workshop et clôture du certificat."
        crumbs={["CFO 4.0", "Administration", "Séminaires"]}
        actions={
          <Button type="button" onClick={() => setEditing({ ...empty })} className="!min-h-[44px]">
            Nouveau séminaire
          </Button>
        }
        stats={[
          {
            num: counts.all,
            unit: counts.all === 1 ? "module" : "modules",
            label: "programme",
            dark: true,
            icon: IconCal,
          },
          { num: counts.published, unit: "en ligne", label: "publiés" },
          { num: counts.draft, unit: "brouillons", label: "hors ligne" },
        ]}
      />

      {error ? <p className="cms-alert">{error}</p> : null}

      <div className={`cms-manage${isEdit ? " has-editor" : ""}`}>
        {editing ? (
          <form className="cms-form cms-form--editor" onSubmit={save}>
            <header className="cms-form__head">
              <div>
                <h2>{editing.slug && rows.some((r) => r.slug === editing.slug) ? "Modifier" : "Nouveau"} séminaire</h2>
                <p>Les champs jour 1 / jour 2 alimentent le détail de séance sur le site.</p>
              </div>
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
                Fermer
              </Button>
            </header>
          <div className="cms-form__grid">
            <label>
              N°
              <input
                className={fieldClass}
                type="number"
                value={editing.numero ?? 0}
                onChange={(e) => setEditing({ ...editing, numero: Number(e.target.value) })}
                required
              />
            </label>
            <label>
              Code (ex. WS, CL)
              <input className={fieldClass} value={editing.code || ""} onChange={(e) => setEditing({ ...editing, code: e.target.value })} />
            </label>
            <label className="cms-form__full">
              Titre
              <input className={fieldClass} value={editing.titre || ""} onChange={(e) => setEditing({ ...editing, titre: e.target.value })} required />
            </label>
            <label className="cms-form__full">
              Slug
              <input
                className={fieldClass}
                value={editing.slug || ""}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                pattern="[a-z0-9\-]+"
                placeholder="big-data-data-analytics"
                required
              />
            </label>
            <label className="cms-form__full">
              Sous-titre
              <input className={fieldClass} value={editing.sousTitre || ""} onChange={(e) => setEditing({ ...editing, sousTitre: e.target.value })} />
            </label>
            <label>
              Dates
              <input className={fieldClass} value={editing.dates || ""} onChange={(e) => setEditing({ ...editing, dates: e.target.value })} />
            </label>
            <label>
              Horaire
              <input className={fieldClass} value={editing.horaire || ""} onChange={(e) => setEditing({ ...editing, horaire: e.target.value })} />
            </label>
            <label>
              Heures
              <input className={fieldClass} type="number" value={editing.heures ?? 6} onChange={(e) => setEditing({ ...editing, heures: Number(e.target.value) })} />
            </label>
            <label>
              Lieu
              <input className={fieldClass} value={editing.lieu || ""} onChange={(e) => setEditing({ ...editing, lieu: e.target.value })} />
            </label>
            <label className="cms-form__full">
              Objectif
              <textarea className={fieldClass} value={editing.objectif || ""} onChange={(e) => setEditing({ ...editing, objectif: e.target.value })} rows={4} />
            </label>
            <label className="cms-form__full">
              Jour 1 — matin
              <textarea className={fieldClass} value={editing.jour1Matin || ""} onChange={(e) => setEditing({ ...editing, jour1Matin: e.target.value })} rows={3} />
            </label>
            <label className="cms-form__full">
              Jour 1 — après-midi
              <textarea className={fieldClass} value={editing.jour1ApresMidi || ""} onChange={(e) => setEditing({ ...editing, jour1ApresMidi: e.target.value })} rows={3} />
            </label>
            <label className="cms-form__full">
              Jour 2 — matin
              <textarea className={fieldClass} value={editing.jour2Matin || ""} onChange={(e) => setEditing({ ...editing, jour2Matin: e.target.value })} rows={3} />
            </label>
            <label className="cms-form__full">
              Jour 2 — après-midi
              <textarea className={fieldClass} value={editing.jour2ApresMidi || ""} onChange={(e) => setEditing({ ...editing, jour2ApresMidi: e.target.value })} rows={3} />
            </label>
            <label className="cms-form__full">
              Livrable
              <textarea className={fieldClass} value={editing.livrable || ""} onChange={(e) => setEditing({ ...editing, livrable: e.target.value })} rows={2} />
            </label>
            <label className="cms-form__full">
              Actualisation
              <textarea className={fieldClass} value={editing.actualisation || ""} onChange={(e) => setEditing({ ...editing, actualisation: e.target.value })} rows={2} />
            </label>
            <label className="cms-form__full">
              Intervenants (slugs, séparés par des virgules)
              <input
                className={fieldClass}
                value={Array.isArray(editing.intervenants) ? editing.intervenants.join(", ") : ""}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    intervenants: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  })
                }
                placeholder="zakaria-fahim, nasser-kettani"
              />
            </label>
            <label className="cms-form__check">
              <input
                type="checkbox"
                checked={editing.isPublished !== false}
                onChange={(e) => setEditing({ ...editing, isPublished: e.target.checked })}
              />
              Publié sur le site
            </label>
          </div>
          <div className="cms-form__actions">
            <Button type="submit" disabled={saving}>{saving ? "Enregistrement…" : "Enregistrer"}</Button>
            <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Annuler</Button>
          </div>
          </form>
        ) : null}

        <AdminListPanel title="Liste des séminaires">
          <AdminToolbar
            query={query}
            onQueryChange={setQuery}
            placeholder="Rechercher un titre, slug, code, dates, lieu…"
            publish={publish}
            onPublishChange={setPublish}
            counts={counts}
            resultLabel={`${visible.length} résultat${visible.length > 1 ? "s" : ""}`}
          />

          {rows.length === 0 ? (
            <EmptyState
              title="Aucun séminaire"
              lead="Créez le premier module du programme certificat."
              action={
                <Button type="button" onClick={() => setEditing({ ...empty })}>
                  Nouveau séminaire
                </Button>
              }
            />
          ) : visible.length === 0 ? (
            <EmptyState
              title="Aucun résultat"
              lead="Modifiez la recherche ou le filtre de publication."
              action={
                <Button type="button" variant="ghost" onClick={() => { setQuery(""); setPublish("all"); }}>
                  Réinitialiser
                </Button>
              }
            />
          ) : (
            <ul className="cms-cards">
              {visible.map((s) => (
                <li key={s.slug} className={`cms-card${isPub(s) ? "" : " is-draft"}`}>
                  <div className="cms-card__main">
                    <div className="cms-card__top">
                      <p className="cms-card__kicker">
                        {s.numero === 0 ? "Inaugurale" : `Séance ${s.code || s.numero}`} · {s.dates || "Date —"}
                      </p>
                      <PublishPill published={isPub(s)} />
                    </div>
                    <h3 className="cms-card__title">{s.titre}</h3>
                    <p className="cms-card__meta">
                      {s.horaire || "Horaire —"}
                      {s.heures ? ` · ${s.heures} h` : ""}
                      {s.lieu ? ` · ${s.lieu}` : ""}
                    </p>
                  </div>
                  <div className="cms-card__actions">
                    <button type="button" className="cms-card__btn" onClick={() => togglePublish(s)}>
                      {isPub(s) ? "Dépublier" : "Publier"}
                    </button>
                    <button type="button" className="cms-card__btn" onClick={() => setEditing(toForm(s))}>
                      Modifier
                    </button>
                    <button type="button" className="cms-card__btn is-danger" onClick={() => remove(s.slug)}>
                      Supprimer
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </AdminListPanel>
      </div>
    </AdminShell>
  );
}
