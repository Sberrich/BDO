"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BRAND, data } from "@/lib/content";
import { Button, fieldClass } from "@/components/ui";
import { plain } from "@/lib/text";
import {
  DECOUVERTES,
  NIVEAUX,
  PARTICIPATIONS,
  SECTEURS,
  UPLOADS,
  checkUpload,
  type Option,
  type UploadRule,
} from "@/lib/candidature";

const steps = ["Coordonnées", "Inscription", "Fonction et parcours", "Motivation"];
const KEY = "cfo40-candidature";
const CV_STEP = 0;

type Choices = { participation: string; secteur: string; niveau: string; decouverte: string };
const EMPTY: Choices = { participation: "", secteur: "", niveau: "", decouverte: "" };

const fileClass = `${fieldClass} cursor-pointer text-sm file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-blue file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white`;

export function CandidatureForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const [choices, setChoices] = useState<Choices>(EMPTY);
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({});
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
        if (el instanceof RadioNodeList) {
          el.value = value;
        } else if (el instanceof HTMLInputElement) {
          if (el.type === "file") return;
          if (el.type === "checkbox") el.checked = value === "oui";
          else el.value = value;
        } else if (el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) {
          el.value = value;
        }
      });
      const restored = Object.fromEntries(
        Object.keys(EMPTY).map((k) => [k, saved[k] || ""]),
      ) as Choices;
      const next = saved._step ? Math.min(Number(saved._step) || 0, steps.length - 1) : 0;
      queueMicrotask(() => {
        setChoices(restored);
        if (next) setStep(next);
      });
    } catch {}
  }, []);

  function persist(form: HTMLFormElement, nextStep = step) {
    const payload: Record<string, string> = {};
    new FormData(form).forEach((value, key) => {
      if (typeof value === "string") payload[key] = value;
    });
    payload._step = String(nextStep);
    try {
      localStorage.setItem(KEY, JSON.stringify(payload));
    } catch {}
  }

  function onFormChange(e: FormEvent<HTMLFormElement>) {
    const target = e.target as HTMLElement;
    if (target instanceof HTMLInputElement && target.type === "radio" && target.name in choices) {
      setChoices((c) => ({ ...c, [target.name]: target.value }));
    }
    persist(e.currentTarget);
  }

  function onFile(rule: UploadRule) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const input = e.currentTarget;
      const file = input.files?.[0];
      const message = file ? checkUpload(rule, file) : "";
      input.setCustomValidity(message);
      setFileErrors((errs) => ({ ...errs, [rule.field]: message }));
    };
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
    const form = e.currentTarget;
    const fd = new FormData(form);
    const cv = fd.get("cv");
    if (!(cv instanceof File) || cv.size === 0) {
      setStep(CV_STEP);
      setStatus(`Merci de joindre votre CV à l’étape « ${steps[CV_STEP]} ».`);
      return;
    }
    setSending(true);
    setStatus("");
    const photo = fd.get("photo");
    if (photo instanceof File && photo.size === 0) fd.delete("photo");
    fd.set("type", "candidature");
    fd.set("_ts", String(openedAt.current || Math.floor(Date.now() / 1000)));
    fd.set("consentement", fd.get("consentement") ? "oui" : "");
    try {
      const res = await fetch("/api/submit", { method: "POST", body: fd });
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

  const cards = (name: keyof Choices, s: number, question: string, options: Option[]) => (
    <div role="radiogroup" aria-label={question}>
      <p className="text-sm font-semibold">{question} *</p>
      <div className="mt-2 grid gap-2">
        {options.map((o) => {
          const checked = choices[name] === o.value;
          return (
            <label
              key={o.value}
              className={`flex cursor-pointer items-center gap-3 rounded-[10px] border bg-white px-4 py-3 text-sm transition hover:border-muted ${
                checked ? "border-blue ring-2 ring-blue/20" : "border-line"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={o.value}
                required={step === s}
                className="h-4 w-4 shrink-0 accent-blue"
              />
              {o.label}
            </label>
          );
        })}
      </div>
    </div>
  );

  const autre = (name: keyof Choices, s: number, label: string) =>
    choices[name] === "autre" ? (
      <label className="block text-sm font-semibold">
        {label} *
        <input className={fieldClass} required={step === s} name={`${name}_autre`} maxLength={200} />
      </label>
    ) : null;

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      onChange={onFormChange}
      encType="multipart/form-data"
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
          Brouillon conservé sur cet appareil. Vous pouvez reprendre plus tard ; les fichiers
          (CV, photo) sont à joindre à nouveau.
        </p>
      </div>

      <div className="honeypot" aria-hidden>
        <input name="_hp" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset className="grid gap-4 sm:grid-cols-2" hidden={step !== 0}>
        <label className="block text-sm font-semibold sm:col-span-2">
          Nom et prénom *
          <input className={fieldClass} required={step === 0} name="nom" autoComplete="name" />
        </label>
        <label className="block text-sm font-semibold">
          E-mail *
          <input
            className={fieldClass}
            required={step === 0}
            type="email"
            name="email"
            autoComplete="email"
          />
        </label>
        <label className="block text-sm font-semibold">
          GSM *
          <input
            className={fieldClass}
            required={step === 0}
            type="tel"
            name="telephone"
            autoComplete="tel"
          />
        </label>
        <label className="block text-sm font-semibold sm:col-span-2">
          Ville *
          <input
            className={fieldClass}
            required={step === 0}
            name="ville"
            autoComplete="address-level2"
          />
        </label>
        {UPLOADS.map((rule) => (
          <label key={rule.field} className="block text-sm font-semibold">
            {rule.label}
            {rule.required ? " *" : " (facultatif)"}
            <input
              className={fileClass}
              type="file"
              name={rule.field}
              accept={rule.accept}
              required={rule.required && step === 0}
              onChange={onFile(rule)}
            />
            <span
              className={`mt-1 block text-xs font-normal ${fileErrors[rule.field] ? "text-red" : "text-muted"}`}
            >
              {fileErrors[rule.field] || `Fichiers acceptés : ${rule.hint}`}
            </span>
          </label>
        ))}
      </fieldset>

      <fieldset className="space-y-5" hidden={step !== 1}>
        {cards("participation", 1, "Demande d’inscription formulée pour :", PARTICIPATIONS)}
        {cards("secteur", 1, "Dans quel secteur d’activité travaillez-vous ?", SECTEURS)}
        {autre("secteur", 1, "Précisez votre secteur")}
      </fieldset>

      <fieldset className="space-y-5" hidden={step !== 2}>
        {cards("niveau", 2, "Quelle est votre fonction ?", NIVEAUX)}
        {autre("niveau", 2, "Précisez votre fonction")}
        <label className="block text-sm font-semibold">
          Diplômes obtenus *
          <textarea
            className={`${fieldClass} min-h-28`}
            required={step === 2}
            maxLength={800}
            name="diplome"
          />
        </label>
        <label className="block text-sm font-semibold">
          Études complémentaires non sanctionnées par un diplôme
          <textarea className={`${fieldClass} min-h-28`} maxLength={800} name="etudes" />
        </label>
      </fieldset>

      <fieldset className="space-y-5" hidden={step !== 3}>
        {cards("decouverte", 3, "Comment avez-vous découvert le certificat BDO ISCAE ?", DECOUVERTES)}
        {autre("decouverte", 3, "Précisez")}
        <label className="block text-sm font-semibold">
          En quelques lignes, merci d’expliquer l’intérêt pour la formation objet de cette
          demande *
          <textarea
            className={`${fieldClass} min-h-32`}
            required={step === 3}
            maxLength={1500}
            name="interet"
          />
        </label>
        <label className="flex items-start gap-3 rounded-[10px] bg-cream px-4 py-3 text-sm">
          <input
            type="checkbox"
            required={step === 3}
            name="consentement"
            value="oui"
            className="mt-0.5 h-4 w-4 accent-blue"
          />
          <span>
            J’accepte les{" "}
            <Link href="/cgu" target="_blank" className="font-semibold text-blue underline">
              conditions générales
            </Link>{" "}
            avant de soumettre ma candidature. *
          </span>
        </label>
      </fieldset>

      <div className="flex flex-wrap justify-between gap-3">
        {step > 0 ? (
          <Button type="button" variant="ghost" onClick={() => setStep((s) => s - 1)}>
            Retour
          </Button>
        ) : (
          <span />
        )}
        <Button type="submit" disabled={sending}>
          {sending ? "Envoi…" : step === steps.length - 1 ? "Envoyer" : "Suivant"}
        </Button>
      </div>
      {status && <p className="text-sm text-red">{status}</p>}
      <p className="text-xs text-muted">
        Clôture des candidatures le {plain(data.site.admission.dateLimite)}.
      </p>
    </form>
  );
}
