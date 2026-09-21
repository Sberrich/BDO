"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BRAND, data } from "@/lib/content";
import { Button, fieldClass } from "@/components/ui";
import { plain } from "@/lib/text";

const steps = ["Identité et fonction", "Parcours", "Projet", "Financement"];
const KEY = "cfo40-candidature";

export function CandidatureForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const openedAt = useRef(0);

  useEffect(() => {
    openedAt.current = Math.floor(Date.now() / 1000);
  }, []);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as Record<string, string>;
      Object.entries(saved).forEach(([key, value]) => {
        if (key === "_step") return;
        const el = form.elements.namedItem(key);
        if (
          el instanceof HTMLInputElement ||
          el instanceof HTMLSelectElement ||
          el instanceof HTMLTextAreaElement
        ) {
          if (el.type === "checkbox") {
            (el as HTMLInputElement).checked = value === "oui";
          } else {
            el.value = value;
          }
        }
      });
      if (saved._step) {
        const next = Math.min(Number(saved._step) || 0, steps.length - 1);
        queueMicrotask(() => setStep(next));
      }
    } catch {}
  }, []);

  function persist(form: HTMLFormElement, nextStep = step) {
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries()) as Record<string, string>;
    payload._step = String(nextStep);
    try {
      localStorage.setItem(KEY, JSON.stringify(payload));
    } catch {}
  }

  function next(e: FormEvent) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const nextStep = Math.min(step + 1, steps.length - 1);
    persist(form, nextStep);
    setStep(nextStep);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step < steps.length - 1) return next(e);
    setSending(true);
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    payload.type = "candidature";
    payload._ts = String(openedAt.current || Math.floor(Date.now() / 1000));
    payload.consentement = fd.get("consentement") ? "oui" : "";
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { ok: boolean; message: string };
      if (!res.ok || !json.ok) {
        setStatus(json.message);
        setSending(false);
        return;
      }
      try {
        localStorage.removeItem(KEY);
      } catch {}
      router.push("/merci?type=candidature");
    } catch {
      setStatus("L’envoi n’a pas abouti. Écrivez-nous à " + BRAND.email);
      setSending(false);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      onChange={(e) => persist(e.currentTarget)}
      className="space-y-6"
    >
      <div>
        <ol className="flex flex-wrap gap-x-5 gap-y-2 text-[0.8125rem]">
          {steps.map((label, i) => (
            <li
              key={label}
              className={`flex items-center gap-2 ${i === step ? "font-bold text-ink" : i < step ? "font-semibold text-ink" : "text-muted"}`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[0.75rem] font-bold ${
                  i <= step ? "bg-blue text-white" : "bg-cream text-muted"
                }`}
              >
                {i + 1}
              </span>
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                className={i < step ? "hover:text-blue" : "cursor-default"}
              >
                {label}
              </button>
            </li>
          ))}
        </ol>
        <div className="mt-3 h-1.5 overflow-hidden rounded-sm bg-cream">
          <div
            className="h-full bg-blue transition-all"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted">
          Brouillon conservé sur cet appareil. Vous pouvez reprendre plus tard.
        </p>
      </div>

      <div className="honeypot" aria-hidden>
        <input name="_hp" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset className="grid gap-4 sm:grid-cols-2" hidden={step !== 0}>
        <label className="block text-sm font-semibold">
          Nom et prénom *
          <input
            className={fieldClass}
            required={step === 0}
            name="nom"
            autoComplete="name"
          />
        </label>
        <label className="block text-sm font-semibold">
          Fonction exacte *
          <input className={fieldClass} required={step === 0} name="fonction" />
        </label>
        <label className="block text-sm font-semibold">
          Entreprise *
          <input
            className={fieldClass}
            required={step === 0}
            name="entreprise"
          />
        </label>
        <label className="block text-sm font-semibold">
          Secteur *
          <select className={fieldClass} required={step === 0} name="secteur">
            <option value="">Choisissez…</option>
            <option value="banque-assurance">Banque, assurance, finance</option>
            <option value="industrie">Industrie</option>
            <option value="distribution">Distribution, commerce</option>
            <option value="services">Services</option>
            <option value="btp-immobilier">BTP, immobilier</option>
            <option value="telecoms-tech">Télécoms, technologies</option>
            <option value="energie-mines">Énergie, mines</option>
            <option value="transport-logistique">Transport, logistique</option>
            <option value="secteur-public">Secteur public</option>
            <option value="autre">Autre</option>
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Effectif *
          <select className={fieldClass} required={step === 0} name="effectif">
            <option value="">Choisissez…</option>
            <option value="moins-50">Moins de 50</option>
            <option value="50-199">50 à 199</option>
            <option value="200-999">200 à 999</option>
            <option value="1000-plus">1 000 et plus</option>
          </select>
        </label>
        <label className="block text-sm font-semibold">
          E-mail professionnel *
          <input
            className={fieldClass}
            required={step === 0}
            type="email"
            name="email"
          />
        </label>
        <label className="block text-sm font-semibold">
          Téléphone *
          <input
            className={fieldClass}
            required={step === 0}
            type="tel"
            name="telephone"
          />
        </label>
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2" hidden={step !== 1}>
        <label className="block text-sm font-semibold">
          Années d’expérience en finance *
          <input
            className={fieldClass}
            required={step === 1}
            type="number"
            min={5}
            name="experience"
          />
        </label>
        <label className="block text-sm font-semibold">
          Dernier diplôme *
          <input className={fieldClass} required={step === 1} name="diplome" />
        </label>
        <label className="block text-sm font-semibold">
          Rattachement hiérarchique *
          <input
            className={fieldClass}
            required={step === 1}
            name="rattachement"
          />
        </label>
        <label className="block text-sm font-semibold">
          Équipe encadrée *
          <select className={fieldClass} required={step === 1} name="equipe">
            <option value="">Choisissez…</option>
            <option value="0">Aucune</option>
            <option value="1-5">1 à 5</option>
            <option value="6-20">6 à 20</option>
            <option value="21-plus">Plus de 20</option>
          </select>
        </label>
      </fieldset>

      <fieldset className="space-y-4" hidden={step !== 2}>
        <p className="text-sm text-muted">
          Ces réponses servent à constituer les sous-groupes dès la conférence
          inaugurale.
        </p>
        <label className="block text-sm font-semibold">
          Le chantier de transformation visé *
          <textarea
            className={`${fieldClass} min-h-32`}
            required={step === 2}
            maxLength={800}
            name="projet"
          />
        </label>
        <label className="block text-sm font-semibold">
          Ce que votre entreprise attend *
          <textarea
            className={`${fieldClass} min-h-32`}
            required={step === 2}
            maxLength={800}
            name="attente"
          />
        </label>
      </fieldset>

      <fieldset className="space-y-4" hidden={step !== 3}>
        <label className="block text-sm font-semibold">
          Mode de financement *
          <select
            className={fieldClass}
            required={step === 3}
            name="financement"
          >
            <option value="">Choisissez…</option>
            <option value="entreprise">Prise en charge entreprise</option>
            <option value="personnel">Financement personnel</option>
            <option value="mixte">Mixte</option>
            <option value="indecis">À déterminer</option>
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Contact RH (facultatif)
          <input className={fieldClass} name="contact_rh" />
        </label>
        <label className="block text-sm font-semibold">
          Disponibilité *
          <select
            className={fieldClass}
            required={step === 3}
            name="disponibilite"
          >
            <option value="">Choisissez…</option>
            <option value="oui">Oui, sur l’ensemble du calendrier</option>
            <option value="partiel">
              Oui, avec une ou deux indisponibilités
            </option>
            <option value="non">Non, je souhaite en discuter</option>
          </select>
        </label>
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            required={step === 3}
            name="consentement"
            value="oui"
            className="mt-1"
          />
          <span>
            J’accepte que ce dossier soit traité par le Groupe ISCAE et BDO
            Maroc pour instruire ma candidature. *
          </span>
        </label>
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="prospection"
            value="oui"
            className="mt-1"
          />
          <span>J’accepte de recevoir les publications du programme.</span>
        </label>
      </fieldset>

      <div className="flex flex-wrap justify-between gap-3">
        {step > 0 ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep((s) => s - 1)}
          >
            Étape précédente
          </Button>
        ) : (
          <span />
        )}
        <Button type="submit" disabled={sending}>
          {sending
            ? "Envoi…"
            : step === steps.length - 1
              ? "Envoyer ma candidature"
              : "Étape suivante"}
        </Button>
      </div>
      {status && <p className="text-sm text-red">{status}</p>}
      <p className="text-xs text-muted">
        Clôture des candidatures le {plain(data.site.admission.dateLimite)}.
      </p>
    </form>
  );
}
