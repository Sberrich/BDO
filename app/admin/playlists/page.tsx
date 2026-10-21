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
import { IconPlay } from "@/components/icons";
import { fieldClass } from "@/components/ui";
import { adminFetch, type Paginated } from "@/lib/admin-client";

type PlaylistRow = {
  slug: string;
  titre: string;
  description?: string;
  ordre: number;
  isPublished?: boolean;
  videoCount?: number;
};

const empty: Partial<PlaylistRow> = {
  titre: "",
  description: "",
  ordre: 1,
  isPublished: true,
};

const isPub = (r: PlaylistRow) => r.isPublished !== false;

export default function AdminPlaylistsPage() {
  const [rows, setRows] = useState<PlaylistRow[]>([]);
  const [editing, setEditing] = useState<Partial<PlaylistRow> | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { query, setQuery, publish, setPublish } = useContentFilters();

  async function load() {
    setError("");
    try {
      const data = await adminFetch<Paginated<PlaylistRow>>("playlists?page_size=50");
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
    if (!editing?.titre) return;
    setSaving(true);
    setError("");
    try {
      if (editing.slug) {
        await adminFetch(`playlists/${editing.slug}`, { method: "PATCH", body: JSON.stringify(editing) });
      } else {
        await adminFetch("playlists", { method: "POST", body: JSON.stringify(editing) });
      }
      setEditing(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enregistrement impossible");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(r: PlaylistRow) {
    await adminFetch(`playlists/${r.slug}`, {
      method: "PATCH",
      body: JSON.stringify({ isPublished: !isPub(r) }),
    });
    await load();
  }

  const counts = publishCounts(rows, isPub);
  const videoTotal = rows.reduce((n, r) => n + (r.videoCount ?? 0), 0);
  const visible = filterContentRows(
    rows,
    query,
    publish,
    isPub,
    (r) => [r.titre, r.slug, r.description].filter(Boolean).join(" "),
  );
  const isEdit = Boolean(editing);

  return (
    <AdminShell>
      <AdminPageHeader
        kicker="Vidéos"
        title="Playlists"
        lead="Groupes de vidéos. L’accueil affiche les 3 premières par ordre (« Voir plus » pour le reste)."
        crumbs={["CFO 4.0", "Administration", "Playlists"]}
        actions={
          <Button type="button" onClick={() => setEditing({ ...empty })} className="!min-h-[44px]">
            Nouvelle playlist
          </Button>
        }
        stats={[
          {
            num: counts.all,
            unit: counts.all === 1 ? "groupe" : "groupes",
            label: "playlists",
            dark: true,
            icon: IconPlay,
          },
          { num: counts.published, unit: "en ligne", label: "publiées" },
          { num: videoTotal, unit: "vidéos", label: "rattachées" },
        ]}
      />

      {error ? <p className="cms-alert">{error}</p> : null}

      <div className={`cms-manage${isEdit ? " has-editor is-split" : ""}`}>
        {editing ? (
          <form className="cms-form cms-form--editor" onSubmit={save}>
            <header className="cms-form__head">
              <div>
                <h2>{editing.slug ? "Modifier" : "Nouvelle playlist"}</h2>
              </div>
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
                Fermer
              </Button>
            </header>
            <div className="cms-form__grid">
              <label>
                Titre
                <input className={fieldClass} value={editing.titre || ""} onChange={(e) => setEditing({ ...editing, titre: e.target.value })} required />
              </label>
              <label>
                Ordre
                <input className={fieldClass} type="number" value={editing.ordre ?? 1} onChange={(e) => setEditing({ ...editing, ordre: Number(e.target.value) })} />
              </label>
              <label className="cms-form__full">
                Description
                <textarea className={fieldClass} rows={2} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
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

        <AdminListPanel title="Liste des playlists">
          <AdminToolbar
            query={query}
            onQueryChange={setQuery}
            placeholder="Rechercher un titre, slug, description…"
            publish={publish}
            onPublishChange={setPublish}
            counts={counts}
            resultLabel={`${visible.length} résultat${visible.length > 1 ? "s" : ""}`}
          />

          {rows.length === 0 ? (
            <EmptyState
              title="Aucune playlist"
              lead="Créez le premier groupe de vidéos."
              action={
                <Button type="button" onClick={() => setEditing({ ...empty })}>
                  Nouvelle playlist
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
                    <th>Titre</th>
                    <th>Vidéos</th>
                    <th>Statut</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {visible.map((r) => (
                    <tr key={r.slug}>
                      <td>{r.ordre}</td>
                      <td>{r.titre}</td>
                      <td>{r.videoCount ?? 0}</td>
                      <td>
                        <PublishPill published={isPub(r)} />
                      </td>
                      <td className="cms-table__actions">
                        <button type="button" className="cms-card__btn" onClick={() => togglePublish(r)}>
                          {isPub(r) ? "Dépublier" : "Publier"}
                        </button>
                        <button type="button" className="cms-card__btn" onClick={() => setEditing(r)}>Modifier</button>
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
