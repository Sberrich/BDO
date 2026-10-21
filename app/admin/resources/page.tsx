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
import { adminFetch, type Paginated, type ResourceRow } from "@/lib/admin-client";

const empty: Partial<ResourceRow> = {
  key: "",
  titre: "",
  description: "",
  fichier: "",
  cover: "",
  href: "",
  icon: "brochure",
  ordre: 1,
  isPublished: true,
};

const isPub = (r: ResourceRow) => r.isPublished !== false;

export default function AdminResourcesPage() {
  const [rows, setRows] = useState<ResourceRow[]>([]);
  const [editing, setEditing] = useState<Partial<ResourceRow> | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { query, setQuery, publish, setPublish } = useContentFilters();

  async function load() {
    setError("");
    try {
      const data = await adminFetch<Paginated<ResourceRow>>("resources?page_size=50");
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
    if (!editing?.key || !editing.titre) return;
    setSaving(true);
    setError("");
    try {
      const exists = rows.some((r) => r.key === editing.key);
      if (exists) {
        await adminFetch(`resources/${editing.key}`, { method: "PATCH", body: JSON.stringify(editing) });
      } else {
        await adminFetch("resources", { method: "POST", body: JSON.stringify(editing) });
      }
      setEditing(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enregistrement impossible");
    } finally {
      setSaving(false);
    }
  }

  async function remove(key: string) {
    if (!confirm("Supprimer cette ressource ?")) return;
    await adminFetch(`resources/${key}`, { method: "DELETE" });
    await load();
  }

  async function togglePublish(r: ResourceRow) {
    await adminFetch(`resources/${r.key}`, {
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
    (r) => [r.key, r.titre, r.description].filter(Boolean).join(" "),
  );
  const isEdit = Boolean(editing);

  return (
    <AdminShell>
      <AdminPageHeader
        kicker="Documents"
        title="Ressources"
        lead="Brochure, baromètre, livre blanc — listés sur /ressources."
        crumbs={["CFO 4.0", "Administration", "Ressources"]}
        actions={
          <Button type="button" onClick={() => setEditing({ ...empty })} className="!min-h-[44px]">
            Nouvelle ressource
          </Button>
        }
        stats={[
          {
            num: counts.all,
            unit: counts.all === 1 ? "doc" : "docs",
            label: "ressources",
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
                <h2>{rows.some((r) => r.key === editing.key) ? "Modifier" : "Nouvelle ressource"}</h2>
              </div>
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
                Fermer
              </Button>
            </header>
            <div className="cms-form__grid">
              <label>
                Clé
                <input
                  className={fieldClass}
                  value={editing.key || ""}
                  onChange={(e) => setEditing({ ...editing, key: e.target.value })}
                  required
                  disabled={rows.some((r) => r.key === editing.key && editing !== empty)}
                  placeholder="brochure"
                />
              </label>
              <label>
                Titre
                <input className={fieldClass} value={editing.titre || ""} onChange={(e) => setEditing({ ...editing, titre: e.target.value })} required />
              </label>
              <label className="cms-form__full">
                Description
                <input className={fieldClass} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </label>
              <label>
                Fichier
                <input className={fieldClass} value={editing.fichier || ""} onChange={(e) => setEditing({ ...editing, fichier: e.target.value })} />
              </label>
              <label>
                Couverture
                <input className={fieldClass} value={editing.cover || ""} onChange={(e) => setEditing({ ...editing, cover: e.target.value })} />
              </label>
              <label>
                Lien page
                <input className={fieldClass} value={editing.href || ""} onChange={(e) => setEditing({ ...editing, href: e.target.value })} placeholder="/ressources/brochure" />
              </label>
              <label>
                Icône
                <input className={fieldClass} value={editing.icon || ""} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} />
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

        <AdminListPanel title="Liste des ressources">
          <AdminToolbar
            query={query}
            onQueryChange={setQuery}
            placeholder="Rechercher une clé, titre, description…"
            publish={publish}
            onPublishChange={setPublish}
            counts={counts}
            resultLabel={`${visible.length} résultat${visible.length > 1 ? "s" : ""}`}
          />

          {rows.length === 0 ? (
            <EmptyState
              title="Aucune ressource"
              lead="Ajoutez le premier document téléchargeable."
              action={
                <Button type="button" onClick={() => setEditing({ ...empty })}>
                  Nouvelle ressource
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
                    <th>Clé</th>
                    <th>Titre</th>
                    <th>Statut</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {visible.map((r) => (
                    <tr key={r.key}>
                      <td>{r.ordre}</td>
                      <td>{r.key}</td>
                      <td>{r.titre}</td>
                      <td>
                        <PublishPill published={isPub(r)} />
                      </td>
                      <td className="cms-table__actions">
                        <button type="button" className="cms-card__btn" onClick={() => togglePublish(r)}>
                          {isPub(r) ? "Dépublier" : "Publier"}
                        </button>
                        <button type="button" className="cms-card__btn" onClick={() => setEditing(r)}>Modifier</button>
                        <button type="button" className="cms-card__btn is-danger" onClick={() => remove(r.key)}>Supprimer</button>
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
