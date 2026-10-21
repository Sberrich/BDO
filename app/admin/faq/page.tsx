"use client";

import { Fragment, useEffect, useState } from "react";
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
import { adminFetch, type FaqGroupRow, type Paginated } from "@/lib/admin-client";

const isPub = (g: FaqGroupRow) => g.isPublished !== false;

export default function AdminFaqPage() {
  const [groups, setGroups] = useState<FaqGroupRow[]>([]);
  const [error, setError] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const { query, setQuery, publish, setPublish } = useContentFilters();

  async function load() {
    setError("");
    try {
      const data = await adminFetch<Paginated<FaqGroupRow>>("faq?page_size=50");
      setGroups(data.results);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleGroup(g: FaqGroupRow) {
    await adminFetch(`faq/${g.id}`, {
      method: "PATCH",
      body: JSON.stringify({ isPublished: !isPub(g) }),
    });
    await load();
  }

  const counts = publishCounts(groups, isPub);
  const questions = groups.reduce((n, g) => n + (g.questions?.length ?? 0), 0);
  const visible = filterContentRows(
    groups,
    query,
    publish,
    isPub,
    (g) =>
      [g.titre, ...(g.questions || []).map((q) => q.q)]
        .filter(Boolean)
        .join(" "),
  );

  return (
    <AdminShell>
      <AdminPageHeader
        kicker="Contenu"
        title="FAQ"
        lead="Groupes et questions publiés sur /faq. Édition fine des réponses HTML via l’admin Django si besoin."
        crumbs={["CFO 4.0", "Administration", "FAQ"]}
        stats={[
          {
            num: counts.all,
            unit: counts.all === 1 ? "thème" : "thèmes",
            label: "groupes FAQ",
            dark: true,
          },
          { num: questions, unit: "Q&R", label: "questions" },
          { num: counts.published, unit: "en ligne", label: "publiés" },
        ]}
      />

      {error ? <p className="cms-alert">{error}</p> : null}

      <div className="cms-manage">
        <AdminListPanel title="Groupes FAQ">
          <AdminToolbar
            query={query}
            onQueryChange={setQuery}
            placeholder="Rechercher un thème ou une question…"
            publish={publish}
            onPublishChange={setPublish}
            counts={counts}
            resultLabel={`${visible.length} résultat${visible.length > 1 ? "s" : ""}`}
          />

          {groups.length === 0 ? (
            <EmptyState
              title="Aucun groupe FAQ"
              lead="Les groupes sont gérés via l’API ou Django admin."
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
                    <th>Thème</th>
                    <th>Questions</th>
                    <th>Statut</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {visible.map((g) => (
                    <Fragment key={g.id}>
                      <tr>
                        <td>{g.ordre}</td>
                        <td>{g.titre}</td>
                        <td>{g.questions?.length ?? 0}</td>
                        <td>
                          <PublishPill published={isPub(g)} />
                        </td>
                        <td className="cms-table__actions">
                          <button type="button" className="cms-card__btn" onClick={() => setOpen(open === g.id ? null : g.id)}>
                            {open === g.id ? "Masquer" : "Voir"}
                          </button>
                          <button type="button" className="cms-card__btn" onClick={() => toggleGroup(g)}>
                            {isPub(g) ? "Dépublier" : "Publier"}
                          </button>
                        </td>
                      </tr>
                      {open === g.id ? (
                        <tr>
                          <td colSpan={5}>
                            <div className="cms-faq-preview">
                              <ul>
                                {(g.questions || []).map((q) => (
                                  <li key={q.id}>
                                    <strong>{q.q}</strong>
                                    <span>
                                      {q.isPublished === false ? " · brouillon" : ""}
                                      {q.hidesIfTarif ? " · masqué si tarif caché" : ""}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
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
