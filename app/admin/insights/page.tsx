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
import { IconBook } from "@/components/icons";
import { fieldClass } from "@/components/ui";
import { adminFetch, type InsightRow, type Paginated } from "@/lib/admin-client";

const empty: Partial<InsightRow> = {
  titre: "",
  category: "Méthode",
  date: new Date().toISOString().slice(0, 10),
  resume: "",
  corps: [""],
  relatedDoc: "brochure",
  lecture: "5 min",
  isPublished: true,
};

const isPub = (r: InsightRow) => r.isPublished !== false;

export default function AdminInsightsPage() {
  const [rows, setRows] = useState<InsightRow[]>([]);
  const [editing, setEditing] = useState<Partial<InsightRow> | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { query, setQuery, publish, setPublish } = useContentFilters();

  async function load() {
    try {
      const data = await adminFetch<Paginated<InsightRow>>("insights?page_size=100");
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
    if (!editing?.titre || !editing.resume || !editing.date) return;
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...editing,
        corps: (editing.corps || []).map(String).filter((p) => p.trim()),
      };
      if (editing.slug) {
        await adminFetch(`insights/${editing.slug}`, { method: "PATCH", body: JSON.stringify(payload) });
      } else {
        await adminFetch("insights", { method: "POST", body: JSON.stringify(payload) });
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
    if (!confirm("Supprimer cet article ?")) return;
    await adminFetch(`insights/${slug}`, { method: "DELETE" });
    await load();
  }

  async function togglePublish(a: InsightRow) {
    await adminFetch(`insights/${a.slug}`, {
      method: "PATCH",
      body: JSON.stringify({ isPublished: !isPub(a) }),
    });
    await load();
  }

  const counts = publishCounts(rows, isPub);
  const visible = filterContentRows(
    rows,
    query,
    publish,
    isPub,
    (r) => [r.titre, r.category, r.resume, r.slug].filter(Boolean).join(" "),
  );
  const isEdit = Boolean(editing);

  return (
    <AdminShell>
      <AdminPageHeader
        kicker="Éditorial"
        title="Insights"
        lead="Articles Insights. Un paragraphe par bloc dans le corps."
        crumbs={["CFO 4.0", "Administration", "Insights"]}
        actions={
          <Button type="button" onClick={() => setEditing({ ...empty })} className="!min-h-[44px]">
            Nouvel article
          </Button>
        }
        stats={[
          {
            num: counts.all,
            unit: counts.all === 1 ? "article" : "articles",
            label: "insights",
            dark: true,
            icon: IconBook,
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
                <h2>{editing.slug ? "Modifier l’article" : "Nouvel article"}</h2>
              </div>
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
                Fermer
              </Button>
            </header>
            <div className="cms-form__grid">
              <label className="cms-form__full">
                Titre
                <input className={fieldClass} value={editing.titre || ""} onChange={(e) => setEditing({ ...editing, titre: e.target.value })} required />
              </label>
              <label>
                Catégorie
                <select className={fieldClass} value={editing.category || "Méthode"} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                  {["Baromètre", "Livre blanc", "Méthode", "Pédagogie"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label>
                Date
                <input className={fieldClass} type="date" value={editing.date || ""} onChange={(e) => setEditing({ ...editing, date: e.target.value })} required />
              </label>
              <label className="cms-form__full">
                Résumé
                <textarea className={fieldClass} value={editing.resume || ""} onChange={(e) => setEditing({ ...editing, resume: e.target.value })} required rows={3} />
              </label>
              <label className="cms-form__full">
                Corps (séparez les paragraphes par une ligne vide)
                <textarea
                  className={fieldClass}
                  value={(editing.corps || []).join("\n\n")}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      corps: e.target.value.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
                    })
                  }
                  rows={8}
                />
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

        <AdminListPanel title="Liste des articles">
          <AdminToolbar
            query={query}
            onQueryChange={setQuery}
            placeholder="Rechercher un titre, catégorie, résumé, slug…"
            publish={publish}
            onPublishChange={setPublish}
            counts={counts}
            resultLabel={`${visible.length} résultat${visible.length > 1 ? "s" : ""}`}
          />

          {rows.length === 0 ? (
            <EmptyState
              title="Aucun article"
              lead="Publiez le premier insight éditorial."
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
            <ul className="cms-cards">
              {visible.map((a) => (
                <li key={a.slug} className={`cms-card${isPub(a) ? "" : " is-draft"}`}>
                  <div className="cms-card__main">
                    <div className="cms-card__top">
                      <p className="cms-card__kicker">{a.category} · {a.date}</p>
                      <PublishPill published={isPub(a)} />
                    </div>
                    <h3 className="cms-card__title">{a.titre}</h3>
                    <p className="cms-card__meta line-clamp-2">{a.resume}</p>
                  </div>
                  <div className="cms-card__actions">
                    <button type="button" className="cms-card__btn" onClick={() => togglePublish(a)}>
                      {isPub(a) ? "Dépublier" : "Publier"}
                    </button>
                    <button type="button" className="cms-card__btn" onClick={() => setEditing(a)}>Modifier</button>
                    <button type="button" className="cms-card__btn is-danger" onClick={() => remove(a.slug)}>Supprimer</button>
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
