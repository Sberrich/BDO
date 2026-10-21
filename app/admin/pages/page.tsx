"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPageHeader, Button, EmptyState } from "@/components/admin/AdminUi";
import { fieldClass } from "@/components/ui";
import { adminFetch, type PageIntro, type Paginated } from "@/lib/admin-client";

const META: Record<string, { label: string; tip: string }> = {
  playlists: {
    label: "Page Playlists",
    tip: "Texte d’introduction sous le titre",
  },
  insights: {
    label: "Page Insights",
    tip: "Introduction de la liste d’articles",
  },
  intervenants: {
    label: "Page Intervenants",
    tip: "Chapeau de la page faculté",
  },
};

function ChapeauField({ defaultValue }: { defaultValue: string }) {
  const [len, setLen] = useState(defaultValue.length);
  return (
    <>
      <textarea
        className={fieldClass}
        name="chapeau"
        defaultValue={defaultValue}
        maxLength={280}
        rows={4}
        required
        onChange={(e) => setLen(e.target.value.length)}
      />
      <p className="cms-form__hint">{len} / 280 caractères</p>
    </>
  );
}

export default function AdminPagesPage() {
  const [rows, setRows] = useState<PageIntro[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState<string | null>(null);

  async function load() {
    try {
      const data = await adminFetch<Paginated<PageIntro>>("page-intros?page_size=20");
      setRows(data.results);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save(e: FormEvent, key: string, chapeau: string) {
    e.preventDefault();
    setSaving(key);
    setError("");
    try {
      await adminFetch(`page-intros/${key}`, {
        method: "PATCH",
        body: JSON.stringify({ chapeau }),
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enregistrement impossible");
    } finally {
      setSaving(null);
    }
  }

  return (
    <AdminShell>
      <AdminPageHeader
        kicker="Micro-copy"
        title="Textes de page"
        lead="Courts chapeaux sous les titres — 280 caractères maximum."
        crumbs={["CFO 4.0", "Administration", "Textes"]}
        stats={[
          {
            num: rows.length,
            unit: rows.length === 1 ? "page" : "pages",
            label: "chapeaux",
            dark: true,
          },
          { num: 280, unit: "car.", label: "limite max" },
          {
            num: rows.filter((r) => (r.chapeau || "").trim().length > 0).length,
            unit: "remplis",
            label: "rédigés",
          },
        ]}
      />
      {error ? <p className="cms-alert">{error}</p> : null}

      {rows.length === 0 ? (
        <EmptyState title="Aucun texte de page" lead="Aucun chapeau n’est disponible pour le moment." />
      ) : (
        <>
          <nav className="cms-section-nav" aria-label="Sections">
            {rows.map((row) => {
              const meta = META[row.key] || { label: row.key, tip: "" };
              return (
                <a key={row.key} href={`#page-${row.key}`}>
                  {meta.label}
                </a>
              );
            })}
          </nav>

          <div className="cms-pages-stack">
            {rows.map((row) => {
              const meta = META[row.key] || { label: row.key, tip: "" };
              return (
                <form
                  key={row.key}
                  id={`page-${row.key}`}
                  className="cms-form"
                  onSubmit={(e) => {
                    const fd = new FormData(e.currentTarget);
                    save(e, row.key, String(fd.get("chapeau") || ""));
                  }}
                >
                  <header className="cms-form__head">
                    <div>
                      <h2>{meta.label}</h2>
                      <p>{meta.tip}</p>
                    </div>
                  </header>
                  <label className="cms-form__full">
                    Chapeau
                    <ChapeauField defaultValue={row.chapeau} />
                  </label>
                  <div className="cms-form__actions">
                    <Button type="submit" disabled={saving === row.key}>
                      {saving === row.key ? "Enregistrement…" : "Enregistrer"}
                    </Button>
                  </div>
                </form>
              );
            })}
          </div>
        </>
      )}
    </AdminShell>
  );
}
