"use client";

import { FormEvent, useState } from "react";
import { site } from "@/content/site";

const initial = {
  nom: "",
  email: "",
  telephone: "",
  entreprise: "",
  participation: "",
  secteur: "",
  fonction: "",
  decouverte: "",
  message: "",
  consentement: false,
  _hp: "",
};

export function InscriptionForm() {
  const [values, setValues] = useState(initial);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");
  const [openedAt] = useState(() => Math.floor(Date.now() / 1000));

  function update<K extends keyof typeof initial>(key: K, value: (typeof initial)[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...values, _ts: openedAt, type: "inscription" }),
      });
      const data = (await res.json()) as { ok: boolean; message: string };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.message || "L’envoi n’a pas abouti.");
        return;
      }
      setStatus("ok");
      setMessage(data.message);
      setValues(initial);
    } catch {
      setStatus("error");
      setMessage("L’envoi n’a pas abouti. Vérifiez votre connexion, ou écrivez-nous directement.");
    }
  }

  const field =
    "mt-1 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none focus:border-navy";

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Ne pas remplir</label>
        <input
          id="website"
          name="_hp"
          tabIndex={-1}
          autoComplete="off"
          value={values._hp}
          onChange={(e) => update("_hp", e.target.value)}
        />
      </div>

      <p className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          Nom et prénom <span aria-hidden>*</span>
          <input
            className={field}
            required
            name="nom"
            autoComplete="name"
            value={values.nom}
            onChange={(e) => update("nom", e.target.value)}
          />
        </label>
        <label className="block text-sm font-semibold">
          E-mail professionnel <span aria-hidden>*</span>
          <input
            className={field}
            required
            type="email"
            name="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </label>
        <label className="block text-sm font-semibold">
          Téléphone <span aria-hidden>*</span>
          <input
            className={field}
            required
            type="tel"
            name="telephone"
            autoComplete="tel"
            placeholder="+212 6 00 00 00 00"
            value={values.telephone}
            onChange={(e) => update("telephone", e.target.value)}
          />
        </label>
        <label className="block text-sm font-semibold">
          Entreprise <span aria-hidden>*</span>
          <input
            className={field}
            required
            name="entreprise"
            autoComplete="organization"
            value={values.entreprise}
            onChange={(e) => update("entreprise", e.target.value)}
          />
        </label>
      </p>

      <fieldset>
        <legend className="text-sm font-semibold">
          Demande d’inscription formulée pour <span aria-hidden>*</span>
        </legend>
        <div className="mt-3 flex flex-wrap gap-4">
          {["Participation individuelle", "Participation entreprise"].map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="participation"
                required
                value={opt}
                checked={values.participation === opt}
                onChange={(e) => update("participation", e.target.value)}
              />
              {opt}
            </label>
          ))}
        </div>
      </fieldset>

      <p className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          Secteur d’activité <span aria-hidden>*</span>
          <select
            className={field}
            required
            value={values.secteur}
            onChange={(e) => update("secteur", e.target.value)}
          >
            <option value="">Choisissez…</option>
            {site.secteurs.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Quelle est votre fonction ? <span aria-hidden>*</span>
          <select
            className={field}
            required
            value={values.fonction}
            onChange={(e) => update("fonction", e.target.value)}
          >
            <option value="">Choisissez…</option>
            {site.fonctions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </p>

      <label className="block text-sm font-semibold">
        Comment avez-vous découvert le certificat BDO ISCAE ? <span aria-hidden>*</span>
        <select
          className={field}
          required
          value={values.decouverte}
          onChange={(e) => update("decouverte", e.target.value)}
        >
          <option value="">Choisissez…</option>
          {site.decouvertes.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-semibold">
        Votre message <span className="font-normal text-muted">(facultatif)</span>
        <textarea
          className={`${field} min-h-28`}
          maxLength={800}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
        />
      </label>

      <label className="flex items-start gap-3 text-sm leading-relaxed">
        <input
          type="checkbox"
          className="mt-1"
          required
          checked={values.consentement}
          onChange={(e) => update("consentement", e.target.checked)}
        />
        <span>
          J’accepte que les informations de ce formulaire soient traitées par le Groupe ISCAE et
          BDO Maroc pour instruire ma demande d’inscription.{" "}
          <a href="/confidentialite" className="font-semibold text-navy">
            Politique de confidentialité
          </a>
          .
        </span>
      </label>

      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-navy px-8 py-3 text-sm font-semibold text-white hover:bg-navy-dark disabled:opacity-60"
      >
        {status === "sending" ? "Envoi en cours…" : "Envoyer ma demande"}
      </button>

      {message && (
        <p
          className={status === "ok" ? "text-sm font-medium text-navy" : "text-sm font-medium text-red-700"}
          role="status"
        >
          {message}
        </p>
      )}
    </form>
  );
}
