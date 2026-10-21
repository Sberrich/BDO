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
import { IconUsers } from "@/components/icons";
import { fieldClass } from "@/components/ui";
import { adminFetch, type Paginated, type SpeakerRow } from "@/lib/admin-client";

const empty: Partial<SpeakerRow> = {
  nom: "",
  slug: "",
  fonction: "",
  institution: "",
  photo: "",
  bio: "",
  linkedin: "",
  seminaires: [],
  ordre: 100,
  isPublished: true,
};

const isPub = (r: SpeakerRow) => r.isPublished !== false;

export default function AdminSpeakersPage() {
  const [rows, setRows] = useState<SpeakerRow[]>([]);
  const [editing, setEditing] = useState<Partial<SpeakerRow> | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { query, setQuery, publish, setPublish } = useContentFilters();

  async function load() {
    try {
      const data = await adminFetch<Paginated<SpeakerRow>>("speakers?page_size=100");
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
    if (!editing?.nom || !editing.slug) return;
    setSaving(true);
    setError("");
    try {
      const payload = { ...editing };
      const exists = rows.some((r) => r.slug === editing.slug);
      if (exists) {
        await adminFetch(`speakers/${editing.slug}`, { method: "PATCH", body: JSON.stringify(payload) });
      } else {
        await adminFetch("speakers", { method: "POST", body: JSON.stringify(payload) });
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
    if (!confirm("Supprimer cet intervenant ?")) return;
    await adminFetch(`speakers/${slug}`, { method: "DELETE" });
    await load();
  }

  async function togglePublish(s: SpeakerRow) {
    await adminFetch(`speakers/${s.slug}`, {
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
    (r) => [r.nom, r.fonction, r.institution, r.slug].filter(Boolean).join(" "),
  );
  const isEdit = Boolean(editing);

  return (
    <AdminShell>
      <AdminPageHeader
        kicker="Faculté"
        title="Intervenants"
        lead="Fiches intervenants. Le slug doit rester stable pour les liens internes."
        crumbs={["CFO 4.0", "Administration", "Intervenants"]}
        actions={
          <Button type="button" onClick={() => setEditing({ ...empty })} className="!min-h-[44px]">
            Nouvel intervenant
          </Button>
        }
        stats={[
          {
            num: counts.all,
            unit: counts.all === 1 ? "fiche" : "fiches",
            label: "intervenants",
            dark: true,
            icon: IconUsers,
          },
          { num: counts.published, unit: "en ligne", label: "publiés" },
          { num: counts.draft, unit: "brouillons", label: "hors ligne" },
        ]}
      />
      {error ? <p className="cms-alert">{error}</p> : null}

      <div className={`cms-manage${isEdit ? " has-editor is-split" : ""}`}>
        {editing ? (
          <form className="cms-form cms-form--editor" onSubmit={save}>
            <header className="cms-form__head">
              <div>
                <h2>{rows.some((r) => r.slug === editing.slug) ? "Modifier" : "Nouvel intervenant"}</h2>
                <p>Les champs visibles sur la fiche publique.</p>
              </div>
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
                Fermer
              </Button>
            </header>
            <div className="cms-form__grid">
              <label>
                Nom
                <input className={fieldClass} value={editing.nom || ""} onChange={(e) => setEditing({ ...editing, nom: e.target.value })} required />
              </label>
              <label>
                Slug
                <input className={fieldClass} value={editing.slug || ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} required pattern="[a-z0-9\-]+" />
              </label>
              <label>
                Fonction
                <input className={fieldClass} value={editing.fonction || ""} onChange={(e) => setEditing({ ...editing, fonction: e.target.value })} />
              </label>
              <label>
                Institution
                <input className={fieldClass} value={editing.institution || ""} onChange={(e) => setEditing({ ...editing, institution: e.target.value })} />
              </label>
              <label className="cms-form__full">
                Photo
                <input className={fieldClass} value={editing.photo || ""} onChange={(e) => setEditing({ ...editing, photo: e.target.value })} placeholder="/images/people/nom-grey.png" />
              </label>
              <label className="cms-form__full">
                Bio
                <textarea className={fieldClass} value={editing.bio || ""} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} rows={5} />
              </label>
              <label className="cms-form__full">
                LinkedIn
                <input className={fieldClass} value={editing.linkedin || ""} onChange={(e) => setEditing({ ...editing, linkedin: e.target.value })} />
              </label>
              <label className="cms-form__check">
                <input type="checkbox" checked={editing.isPublished !== false} onChange={(e) => setEditing({ ...editing, isPublished: e.target.checked })} />
                Publié sur le site
              </label>
            </div>
            <div className="cms-form__actions">
              <Button type="submit" disabled={saving}>{saving ? "Enregistrement…" : "Enregistrer"}</Button>
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Annuler</Button>
            </div>
          </form>
        ) : null}

        <AdminListPanel title="Liste des intervenants">
          <AdminToolbar
            query={query}
            onQueryChange={setQuery}
            placeholder="Rechercher un nom, une fonction, une institution…"
            publish={publish}
            onPublishChange={setPublish}
            counts={counts}
            resultLabel={`${visible.length} résultat${visible.length > 1 ? "s" : ""}`}
          />

          {rows.length === 0 ? (
            <EmptyState
              title="Aucun intervenant"
              lead="Créez la première fiche pour alimenter la page Faculté."
              action={
                <Button type="button" onClick={() => setEditing({ ...empty })}>
                  Nouvel intervenant
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
                      <p className="cms-card__kicker">{s.institution || "Intervenant"}</p>
                      <PublishPill published={isPub(s)} />
                    </div>
                    <h3 className="cms-card__title">{s.nom}</h3>
                    <p className="cms-card__meta">
                      {s.fonction || "Fonction —"}
                      <span aria-hidden="true"> · </span>
                      <code>{s.slug}</code>
                    </p>
                  </div>
                  <div className="cms-card__actions">
                    <button type="button" className="cms-card__btn" onClick={() => togglePublish(s)}>
                      {isPub(s) ? "Dépublier" : "Publier"}
                    </button>
                    <button type="button" className="cms-card__btn" onClick={() => setEditing(s)}>Modifier</button>
                    <button type="button" className="cms-card__btn is-danger" onClick={() => remove(s.slug)}>Supprimer</button>
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
