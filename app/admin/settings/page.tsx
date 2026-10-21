"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPageHeader, Button } from "@/components/admin/AdminUi";
import { fieldClass } from "@/components/ui";
import { adminFetch, type SiteSettingsRow } from "@/lib/admin-client";

export default function AdminSettingsPage() {
  const [form, setForm] = useState<Partial<SiteSettingsRow> | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    adminFetch<SiteSettingsRow>("settings")
      .then((data) => {
        setForm({
          nom: data.nom,
          sousTitreOfficiel: data.sousTitreOfficiel,
          cosignature: data.cosignature,
          domaine: data.domaine,
          baseUrl: data.baseUrl,
          seoTitleTemplate: data.seoTitleTemplate,
          seoDescriptionDefault: data.seoDescriptionDefault,
          promesse_titre: data.promesse?.titre || "",
          promesse_sous_titre: data.promesse?.sousTitre || "",
          contact_nom: data.contact?.nom || "",
          contact_fonction: data.contact?.fonction || "",
          contact_email: data.contact?.email || "",
          contact_telephone: data.contact?.telephone || "",
          contact_linkedin: data.contact?.linkedin || "",
          adresse_iscae: data.contact?.adresseIscae || "",
          lieu_formation: data.contact?.lieuFormation || "",
        });
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Erreur"));
  }, []);

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError("");
    setOk(false);
    try {
      await adminFetch("settings", { method: "PATCH", body: JSON.stringify(form) });
      setOk(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enregistrement impossible");
    } finally {
      setSaving(false);
    }
  }

  const settingsStats = [
    {
      num: 4,
      unit: "sections",
      label: "identité · promesse · contact · SEO",
      dark: true as const,
    },
    {
      num: form?.domaine ? 1 : 0,
      unit: "domaine",
      label: form?.domaine ? "configuré" : "à renseigner",
    },
    {
      num: form?.contact_email ? 1 : 0,
      unit: "e-mail",
      label: form?.contact_email ? "contact OK" : "manquant",
    },
  ];

  if (!form) {
    return (
      <AdminShell>
        <AdminPageHeader
          kicker="Site"
          title="Paramètres"
          lead="Chargement…"
          crumbs={["CFO 4.0", "Administration", "Paramètres"]}
        />
        {error ? <p className="cms-alert">{error}</p> : null}
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <AdminPageHeader
        kicker="Site"
        title="Paramètres"
        lead="Marque, contact et SEO. Les flags d’affichage restent aussi dans le frontend (SHOW)."
        crumbs={["CFO 4.0", "Administration", "Paramètres"]}
        stats={settingsStats}
      />

      {error ? <p className="cms-alert">{error}</p> : null}
      {ok ? <p className="cms-alert is-ok">Paramètres enregistrés.</p> : null}

      <nav className="cms-section-nav" aria-label="Sections paramètres">
        <a href="#set-identite">Identité</a>
        <a href="#set-promesse">Promesse</a>
        <a href="#set-contact">Contact</a>
        <a href="#set-seo">SEO</a>
      </nav>

      <div className="cms-settings-stack">
        <form className="cms-form" onSubmit={save}>
          <header className="cms-form__head" id="set-identite">
            <h2>Identité</h2>
          </header>
          <div className="cms-form__grid">
            <label>
              Nom
              <input className={fieldClass} value={form.nom || ""} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
            </label>
            <label>
              Sous-titre officiel
              <input className={fieldClass} value={form.sousTitreOfficiel || ""} onChange={(e) => setForm({ ...form, sousTitreOfficiel: e.target.value })} />
            </label>
            <label className="cms-form__full">
              Cosignature
              <input className={fieldClass} value={form.cosignature || ""} onChange={(e) => setForm({ ...form, cosignature: e.target.value })} />
            </label>
            <label>
              Domaine
              <input className={fieldClass} value={form.domaine || ""} onChange={(e) => setForm({ ...form, domaine: e.target.value })} />
            </label>
            <label>
              URL de base
              <input className={fieldClass} type="url" value={form.baseUrl || ""} onChange={(e) => setForm({ ...form, baseUrl: e.target.value })} />
            </label>
          </div>

          <header className="cms-form__head" id="set-promesse">
            <h2>Promesse</h2>
          </header>
          <div className="cms-form__grid">
            <label className="cms-form__full">
              Titre
              <textarea className={fieldClass} rows={2} value={form.promesse_titre || ""} onChange={(e) => setForm({ ...form, promesse_titre: e.target.value })} />
            </label>
            <label className="cms-form__full">
              Sous-titre
              <textarea className={fieldClass} rows={3} value={form.promesse_sous_titre || ""} onChange={(e) => setForm({ ...form, promesse_sous_titre: e.target.value })} />
            </label>
          </div>

          <header className="cms-form__head" id="set-contact">
            <h2>Contact</h2>
          </header>
          <div className="cms-form__grid">
            <label>
              Nom
              <input className={fieldClass} value={form.contact_nom || ""} onChange={(e) => setForm({ ...form, contact_nom: e.target.value })} />
            </label>
            <label>
              Fonction
              <input className={fieldClass} value={form.contact_fonction || ""} onChange={(e) => setForm({ ...form, contact_fonction: e.target.value })} />
            </label>
            <label>
              E-mail
              <input className={fieldClass} type="email" value={form.contact_email || ""} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} />
            </label>
            <label>
              Téléphone
              <input className={fieldClass} value={form.contact_telephone || ""} onChange={(e) => setForm({ ...form, contact_telephone: e.target.value })} />
            </label>
            <label className="cms-form__full">
              Adresse ISCAE
              <textarea className={fieldClass} rows={2} value={form.adresse_iscae || ""} onChange={(e) => setForm({ ...form, adresse_iscae: e.target.value })} />
            </label>
            <label className="cms-form__full">
              Lieu de formation
              <textarea className={fieldClass} rows={2} value={form.lieu_formation || ""} onChange={(e) => setForm({ ...form, lieu_formation: e.target.value })} />
            </label>
          </div>

          <header className="cms-form__head" id="set-seo">
            <h2>SEO</h2>
          </header>
          <div className="cms-form__grid">
            <label className="cms-form__full">
              Modèle de titre
              <input className={fieldClass} value={form.seoTitleTemplate || ""} onChange={(e) => setForm({ ...form, seoTitleTemplate: e.target.value })} />
            </label>
            <label className="cms-form__full">
              Description par défaut
              <textarea className={fieldClass} rows={3} value={form.seoDescriptionDefault || ""} onChange={(e) => setForm({ ...form, seoDescriptionDefault: e.target.value })} />
            </label>
          </div>

          <div className="cms-form__actions cms-form__actions--sticky">
            <Button type="submit" disabled={saving}>{saving ? "Enregistrement…" : "Enregistrer"}</Button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
