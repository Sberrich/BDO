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
import { adminFetch, type Paginated, type VideoRow } from "@/lib/admin-client";

const empty: Partial<VideoRow> = {
  titre: "",
  playlist: "Témoignages",
  ordre: 1,
  fichier: "",
  langue: "FR",
  isPublished: true,
};

const isPub = (r: VideoRow) => r.isPublished !== false;

export default function AdminVideosPage() {
  const [rows, setRows] = useState<VideoRow[]>([]);
  const [editing, setEditing] = useState<Partial<VideoRow> | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { query, setQuery, publish, setPublish } = useContentFilters();

  async function load() {
    setError("");
    try {
      const data = await adminFetch<Paginated<VideoRow>>("videos?page_size=100");
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
    if (!editing?.titre || !editing.fichier) return;
    setSaving(true);
    setError("");
    try {
      const payload = { ...editing };
      if (editing.slug) {
        await adminFetch(`videos/${editing.slug}`, { method: "PATCH", body: JSON.stringify(payload) });
      } else {
        await adminFetch("videos", { method: "POST", body: JSON.stringify(payload) });
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
    if (!confirm("Supprimer cette vidéo du site ?")) return;
    await adminFetch(`videos/${slug}`, { method: "DELETE" });
    await load();
  }

  async function togglePublish(v: VideoRow) {
    await adminFetch(`videos/${v.slug}`, {
      method: "PATCH",
      body: JSON.stringify({ isPublished: !isPub(v) }),
    });
    await load();
  }

  const counts = publishCounts(rows, isPub);
  const playlistCount = new Set(rows.map((r) => r.playlist).filter(Boolean)).size;
  const visible = filterContentRows(
    rows,
    query,
    publish,
    isPub,
    (r) => [r.titre, r.playlist, r.slug, r.duree].filter(Boolean).join(" "),
  );
  const isEdit = Boolean(editing);

  return (
    <AdminShell>
      <AdminPageHeader
        kicker="Playlists"
        title="Vidéos"
        lead="Playlists et témoignages. Décochez « Publié » pour un brouillon."
        crumbs={["CFO 4.0", "Administration", "Vidéos"]}
        actions={
          <Button type="button" onClick={() => setEditing({ ...empty })} className="!min-h-[44px]">
            Nouvelle vidéo
          </Button>
        }
        stats={[
          {
            num: counts.all,
            unit: counts.all === 1 ? "vidéo" : "vidéos",
            label: "médiathèque",
            dark: true,
            icon: IconPlay,
          },
          { num: counts.published, unit: "en ligne", label: "publiées" },
          { num: playlistCount, unit: playlistCount === 1 ? "groupe" : "groupes", label: "playlists" },
        ]}
      />

      {error ? <p className="cms-alert">{error}</p> : null}

      <div className={`cms-manage${isEdit ? " has-editor is-split" : ""}`}>
        {editing ? (
          <form className="cms-form cms-form--editor" onSubmit={save}>
            <header className="cms-form__head">
              <div>
                <h2>{editing.slug ? "Modifier la vidéo" : "Nouvelle vidéo"}</h2>
                <p>Chemins publics : /videos/… et /images/…</p>
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
                Playlist
                <input className={fieldClass} value={editing.playlist || ""} onChange={(e) => setEditing({ ...editing, playlist: e.target.value })} />
              </label>
              <label>
                Ordre
                <input className={fieldClass} type="number" value={editing.ordre ?? 1} onChange={(e) => setEditing({ ...editing, ordre: Number(e.target.value) })} />
              </label>
              <label>
                Durée
                <input className={fieldClass} value={editing.duree || ""} onChange={(e) => setEditing({ ...editing, duree: e.target.value })} placeholder="2 min 11" />
              </label>
              <label className="cms-form__full">
                Fichier vidéo
                <input className={fieldClass} value={editing.fichier || ""} onChange={(e) => setEditing({ ...editing, fichier: e.target.value })} required placeholder="/videos/temoignages/nom.mp4" />
              </label>
              <label className="cms-form__full">
                Image de couverture
                <input className={fieldClass} value={editing.poster || ""} onChange={(e) => setEditing({ ...editing, poster: e.target.value })} placeholder="/images/temoignages/nom-cover.jpg" />
              </label>
              <label className="cms-form__full">
                Sous-titre
                <input className={fieldClass} value={editing.sousTitre || ""} onChange={(e) => setEditing({ ...editing, sousTitre: e.target.value })} />
              </label>
              <label className="cms-form__check">
                <input type="checkbox" checked={editing.isPublished !== false} onChange={(e) => setEditing({ ...editing, isPublished: e.target.checked })} />
                Publié sur le site
              </label>
            </div>
            <div className="cms-form__actions">
              <Button type="submit" disabled={saving}>{saving ? "Enregistrement…" : "Enregistrer"}</Button>
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
                Annuler
              </Button>
            </div>
          </form>
        ) : null}

        <AdminListPanel title="Liste des vidéos">
          <AdminToolbar
            query={query}
            onQueryChange={setQuery}
            placeholder="Rechercher un titre, playlist, slug, durée…"
            publish={publish}
            onPublishChange={setPublish}
            counts={counts}
            resultLabel={`${visible.length} résultat${visible.length > 1 ? "s" : ""}`}
          />

          {rows.length === 0 ? (
            <EmptyState
              title="Aucune vidéo"
              lead="Ajoutez la première vidéo à la médiathèque."
              action={
                <Button type="button" onClick={() => setEditing({ ...empty })}>
                  Nouvelle vidéo
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
              {visible.map((v) => (
                <li key={v.slug} className={`cms-card${isPub(v) ? "" : " is-draft"}`}>
                  <div className="cms-card__main">
                    <div className="cms-card__top">
                      <p className="cms-card__kicker">{v.playlist} · n°{v.ordre}</p>
                      <PublishPill published={isPub(v)} />
                    </div>
                    <h3 className="cms-card__title">{v.titre}</h3>
                    <p className="cms-card__meta">{v.duree || "Durée —"}</p>
                  </div>
                  <div className="cms-card__actions">
                    <button type="button" className="cms-card__btn" onClick={() => togglePublish(v)}>
                      {isPub(v) ? "Dépublier" : "Publier"}
                    </button>
                    <button type="button" className="cms-card__btn" onClick={() => setEditing(v)}>
                      Modifier
                    </button>
                    <button type="button" className="cms-card__btn is-danger" onClick={() => remove(v.slug)}>
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
