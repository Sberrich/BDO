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
import { adminFetch, type Paginated, type PartnerRow } from "@/lib/admin-client";

const empty: Partial<PartnerRow> = {
  nom: "",
  role: "",
  logo: "",
  lien: "",
  ordre: 1,
  isPublished: true,
};

const isPub = (r: PartnerRow) => r.isPublished !== false;

export default function AdminPartnersPage() {
  const [rows, setRows] = useState<PartnerRow[]>([]);
  const [editing, setEditing] = useState<Partial<PartnerRow> | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { query, setQuery, publish, setPublish } = useContentFilters();

  async function load() {
    setError("");
    try {
      const data = await adminFetch<Paginated<PartnerRow>>("partners?page_size=100");
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
    if (!editing?.nom) return;
    setSaving(true);
    setError("");
    try {
      if (editing.id) {
        await adminFetch(`partners/${editing.id}`, { method: "PATCH", body: JSON.stringify(editing) });
      } else {
        await adminFetch("partners", { method: "POST", body: JSON.stringify(editing) });
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
    if (!confirm("Supprimer ce partenaire ?")) return;
    await adminFetch(`partners/${id}`, { method: "DELETE" });
    await load();
  }

  async function togglePublish(r: PartnerRow) {
    if (!r.id) return;
    await adminFetch(`partners/${r.id}`, {
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
    (r) => [r.nom, r.role].filter(Boolean).join(" "),
  );
  const isEdit = Boolean(editing);

  return (
    <AdminShell>
      <AdminPageHeader
        kicker="Accueil"
        title="Partenaires"
        lead="Logos et rôles (section partenaires du site)."
        crumbs={["CFO 4.0", "Administration", "Partenaires"]}
        actions={
          <Button type="button" onClick={() => setEditing({ ...empty })} className="!min-h-[44px]">
            Nouveau partenaire
          </Button>
        }
        stats={[
          {
            num: counts.all,
            unit: counts.all === 1 ? "logo" : "logos",
            label: "partenaires",
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
                <h2>{editing.id ? "Modifier" : "Nouveau partenaire"}</h2>
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
                Rôle
                <input className={fieldClass} value={editing.role || ""} onChange={(e) => setEditing({ ...editing, role: e.target.value })} />
              </label>
              <label>
                Logo
                <input className={fieldClass} value={editing.logo || ""} onChange={(e) => setEditing({ ...editing, logo: e.target.value })} placeholder="/images/partenaires/…" />
              </label>
              <label>
                Lien
                <input className={fieldClass} type="url" value={editing.lien || ""} onChange={(e) => setEditing({ ...editing, lien: e.target.value })} />
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

        <AdminListPanel title="Liste des partenaires">
          <AdminToolbar
            query={query}
            onQueryChange={setQuery}
            placeholder="Rechercher un nom, rôle…"
            publish={publish}
            onPublishChange={setPublish}
            counts={counts}
            resultLabel={`${visible.length} résultat${visible.length > 1 ? "s" : ""}`}
          />

          {rows.length === 0 ? (
            <EmptyState
              title="Aucun partenaire"
              lead="Ajoutez le premier logo partenaire."
              action={
                <Button type="button" onClick={() => setEditing({ ...empty })}>
                  Nouveau partenaire
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
                    <th>Nom</th>
                    <th>Rôle</th>
                    <th>Statut</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {visible.map((r) => (
                    <tr key={r.id}>
                      <td>{r.ordre}</td>
                      <td>{r.nom}</td>
                      <td>{r.role}</td>
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
