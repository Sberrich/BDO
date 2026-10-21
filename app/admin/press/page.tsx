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
import { IconFileText } from "@/components/icons";
import { fieldClass } from "@/components/ui";
import { adminFetch, type Paginated, type PressRow } from "@/lib/admin-client";

const empty: Partial<PressRow> = {
  nom: "",
  titre: "",
  description: "",
  lien: "",
  logo: "",
  domaine: "",
  apercu: "",
  ordre: 1,
  isPublished: true,
};

const isPub = (r: PressRow) => r.isPublished !== false;

export default function AdminPressPage() {
  const [rows, setRows] = useState<PressRow[]>([]);
  const [editing, setEditing] = useState<Partial<PressRow> | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { query, setQuery, publish, setPublish } = useContentFilters();

  async function load() {
    setError("");
    try {
      const data = await adminFetch<Paginated<PressRow>>("press?page_size=100");
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
    if (!editing?.nom || !editing.titre || !editing.lien) return;
    setSaving(true);
    setError("");
    try {
      if (editing.id) {
        await adminFetch(`press/${editing.id}`, { method: "PATCH", body: JSON.stringify(editing) });
      } else {
        await adminFetch("press", { method: "POST", body: JSON.stringify(editing) });
      }
      setEditing(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enregistrement impossible");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Supprimer cet article de presse ?")) return;
    await adminFetch(`press/${id}`, { method: "DELETE" });
    await load();
  }

  async function togglePublish(r: PressRow) {
    if (!r.id) return;
    await adminFetch(`press/${r.id}`, {
      method: "PATCH",
      body: JSON.stringify({ isPublished: !isPub(r) }),
    });
    await load();
  }

  const counts = publishCounts(rows, isPub);
  const visible = filterContentRows(
    rows,
    query,
    publish,
    isPub,
    (r) => [r.nom, r.titre, r.domaine].filter(Boolean).join(" "),
  );
  const isEdit = Boolean(editing);

  return (
    <AdminShell>
      <AdminPageHeader
        kicker="Accueil"
        title="Revue de presse"
        lead="Médias affichés sur la page d’accueil."
        crumbs={["CFO 4.0", "Administration", "Presse"]}
        actions={
          <Button type="button" onClick={() => setEditing({ ...empty })} className="!min-h-[44px]">
            Nouvel article
          </Button>
        }
        stats={[
          {
            num: counts.all,
            unit: counts.all === 1 ? "média" : "médias",
            label: "revue de presse",
            dark: true,
            icon: IconFileText,
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
                <h2>{editing.id ? "Modifier" : "Nouvel article"}</h2>
              </div>
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
                Fermer
              </Button>
            </header>
            <div className="cms-form__grid">
              <label>
                Média
                <input className={fieldClass} value={editing.nom || ""} onChange={(e) => setEditing({ ...editing, nom: e.target.value })} required />
              </label>
              <label>
                Domaine
                <input className={fieldClass} value={editing.domaine || ""} onChange={(e) => setEditing({ ...editing, domaine: e.target.value })} />
              </label>
              <label className="cms-form__full">
                Titre
                <input className={fieldClass} value={editing.titre || ""} onChange={(e) => setEditing({ ...editing, titre: e.target.value })} required />
              </label>
              <label className="cms-form__full">
                Description
                <textarea className={fieldClass} rows={3} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </label>
              <label className="cms-form__full">
                Lien
                <input className={fieldClass} type="url" value={editing.lien || ""} onChange={(e) => setEditing({ ...editing, lien: e.target.value })} required />
              </label>
              <label>
                Logo
                <input className={fieldClass} value={editing.logo || ""} onChange={(e) => setEditing({ ...editing, logo: e.target.value })} placeholder="/images/medias/…" />
              </label>
              <label>
                Aperçu
                <input className={fieldClass} value={editing.apercu || ""} onChange={(e) => setEditing({ ...editing, apercu: e.target.value })} />
              </label>
              <label>
                Ordre
                <input className={fieldClass} type="number" value={editing.ordre ?? 1} onChange={(e) => setEditing({ ...editing, ordre: Number(e.target.value) })} />
              </label>
              <label className="cms-form__check">
                <input type="checkbox" checked={editing.isPublished !== false} onChange={(e) => setEditing({ ...editing, isPublished: e.target.checked })} />
                Publié
              </label>
            </div>
            <div className="cms-form__actions">
              <Button type="submit" disabled={saving}>{saving ? "Enregistrement…" : "Enregistrer"}</Button>
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Annuler</Button>
            </div>
          </form>
        ) : null}

        <AdminListPanel title="Liste des articles">
          <AdminToolbar
            query={query}
            onQueryChange={setQuery}
            placeholder="Rechercher un média, titre, domaine…"
            publish={publish}
            onPublishChange={setPublish}
            counts={counts}
            resultLabel={`${visible.length} résultat${visible.length > 1 ? "s" : ""}`}
          />

          {rows.length === 0 ? (
            <EmptyState
              title="Aucun article"
              lead="Ajoutez le premier média à la revue de presse."
              action={
                <Button type="button" onClick={() => setEditing({ ...empty })}>
                  Nouvel article
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
            <div className="cms-table-wrap">
              <table className="cms-table">
                <thead>
                  <tr>
                    <th>Ordre</th>
                    <th>Média</th>
                    <th>Titre</th>
                    <th>Statut</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {visible.map((r) => (
                    <tr key={r.id}>
                      <td>{r.ordre}</td>
                      <td>{r.nom}</td>
                      <td>{r.titre}</td>
                      <td>
                        <PublishPill published={isPub(r)} />
                      </td>
                      <td className="cms-table__actions">
                        <button type="button" className="cms-card__btn" onClick={() => togglePublish(r)}>
                          {isPub(r) ? "Dépublier" : "Publier"}
                        </button>
                        <button type="button" className="cms-card__btn" onClick={() => setEditing(r)}>Modifier</button>
                        <button type="button" className="cms-card__btn is-danger" onClick={() => r.id && remove(r.id)}>Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </AdminListPanel>
      </div>
    </AdminShell>
  );
}
