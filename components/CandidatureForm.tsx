"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BRAND, data } from "@/lib/content";
import { CguLink } from "@/components/CguDialog";
import { NameInput } from "@/components/NameInput";
import { PhoneInput } from "@/components/PhoneInput";
import { SuccessDialog } from "@/components/SuccessDialog";
import { IconArrowRight, IconSend, IconTick } from "@/components/icons";
import { Button, fieldClass } from "@/components/ui";
import { plain } from "@/lib/text";
import { collectErrors, fieldMessage, focusField, isField } from "@/lib/form-errors";
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
type Choices = { participation: string; secteur: string; niveau: string; decouverte: string };
const EMPTY: Choices = { participation: "", secteur: "", niveau: "", decouverte: "" };

const fileClass = `${fieldClass} cursor-pointer text-sm file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-blue file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white max-sm:file:px-4 max-sm:file:py-2.5 max-sm:file:text-base`;

export function CandidatureForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const [choices, setChoices] = useState<Choices>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusName, setFocusName] = useState<{ name: string } | null>(null);
  const [done, setDone] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const openedAt = useRef(0);
  const inFlight = useRef(false);

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

  useEffect(() => {
    const el = focusName && formRef.current?.elements.namedItem(focusName.name);
    const field = el instanceof RadioNodeList ? el[0] : el;
    if (isField(field)) focusField(field);
  }, [focusName]);

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
    revalidate(e);
    persist(e.currentTarget);
  }

  function revalidate(e: FormEvent<HTMLFormElement>) {
    const el = e.target;
    if (!isField(el) || !(el.name in errors)) return;
    const message = el.type === "radio" ? "" : fieldMessage(el);
    setErrors((errs) => ({ ...errs, [el.name]: message }));
  }

  function acceptCgu() {
    const form = formRef.current;
    const box = form?.elements.namedItem("consentement");
    if (!form || !(box instanceof HTMLInputElement)) return;
    box.checked = true;
    setErrors((errs) => ({ ...errs, consentement: "" }));
    persist(form);
  }

  function onFile(rule: UploadRule) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const input = e.currentTarget;
      const file = input.files?.[0];
      input.setCustomValidity(file ? checkUpload(rule, file) : "");
      setErrors((errs) => ({ ...errs, [rule.field]: fieldMessage(input) }));
    };
  }

  function next(e: FormEvent) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const { errors: found, first } = collectErrors(form);
    setErrors(found);
    if (first) {
      focusField(first);
      return;
    }
    setStatus("");
    const nextStep = Math.min(step + 1, steps.length - 1);
    persist(form, nextStep);
    setStep(nextStep);
  }

  /** Opens the step holding `name` and focuses that field once it is visible. */
  function showField(form: HTMLFormElement, name: string) {
    const el = form.elements.namedItem(name);
    const field = el instanceof RadioNodeList ? el[0] : el;
    const fieldset = field instanceof Element ? field.closest("fieldset") : null;
    const target = fieldset ? Array.from(form.querySelectorAll("fieldset")).indexOf(fieldset) : -1;
    if (target < 0) return;
    setStep(target);
    setFocusName({ name });
    if (target !== step) setStatus(`Il manque une information à l’étape « ${steps[target]} ».`);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step < steps.length - 1) return next(e);
    if (inFlight.current) return;
    const form = e.currentTarget;
    const { errors: found, first } = collectErrors(form, { includeHidden: true });
    setErrors(found);
    if (first) {
      showField(form, first.name);
      return;
    }
    const fd = new FormData(form);
    inFlight.current = true;
    setSending(true);
    setStatus("");
    const photo = fd.get("photo");
    if (photo instanceof File && photo.size === 0) fd.delete("photo");
    fd.set("type", "candidature");
    fd.set("_ts", String(openedAt.current || Math.floor(Date.now() / 1000)));
    fd.set("consentement", fd.get("consentement") ? "oui" : "");
    try {
      const res = await fetch("/api/submit", { method: "POST", body: fd });
      const json = (await res.json()) as { ok: boolean; message: string; field?: string };
      if (!res.ok || !json.ok) {
        setStatus(json.message);
        const upload = UPLOADS.find((rule) => rule.field === json.field);
        if (upload) {
          setErrors((errs) => ({ ...errs, [upload.field]: json.message }));
          showField(form, upload.field);
        }
        setSending(false);
        inFlight.current = false;
        return;
      }
      try {
        localStorage.removeItem(KEY);
      } catch {}
      setDone(true);
    } catch {
      setStatus("L’envoi n’a pas abouti. Écrivez-nous à " + BRAND.email);
      setSending(false);
      inFlight.current = false;
    }
  }

  const err = (name: string) =>
    errors[name] ? (
      <span id={`cand-${name}-error`} role="alert" className="field-error">
        {errors[name]}
      </span>
    ) : null;
  const errProps = (name: string) =>
    errors[name] ? { "aria-invalid": true as const, "aria-describedby": `cand-${name}-error` } : {};

  const cards = (name: keyof Choices, s: number, question: string, options: Option[]) => (
    <div role="radiogroup" aria-label={question} {...errProps(name)}>
      <p className="text-sm font-semibold">{question} *</p>
      <div className="mt-2 grid gap-2">
        {options.map((o) => {
          const checked = choices[name] === o.value;
          return (
            <label
              key={o.value}
              className={`cand-choice flex cursor-pointer items-center gap-3 rounded-[10px] border bg-white transition hover:border-muted ${
                checked ? "border-blue ring-2 ring-blue/20" : errors[name] ? "border-red" : "border-line"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={o.value}
                required
                className="h-4 w-4 shrink-0 accent-blue"
              />
              {o.label}
            </label>
          );
        })}
      </div>
      {err(name)}
    </div>
  );

  const autre = (name: keyof Choices, s: number, label: string) =>
    choices[name] === "autre" ? (
      <label className="block text-sm font-semibold">
        {label} *
        <input
          className={fieldClass}
          required
          name={`${name}_autre`}
          placeholder="Votre réponse"
          maxLength={200}
          {...errProps(`${name}_autre`)}
        />
        {err(`${name}_autre`)}
      </label>
    ) : null;

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      onChange={onFormChange}
      noValidate
      encType="multipart/form-data"
      className="cand-form space-y-6"
    >
      <div>
        <ol className="cand-steps text-[0.8125rem]">
          {steps.map((label, i) => (
            <li
              key={label}
              aria-current={i === step ? "step" : undefined}
              className={`cand-steps__item${i < step ? " is-done" : ""}`}
            >
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                className={`group flex items-center gap-2 ${
                  i === step ? "font-bold text-ink" : i < step ? "font-semibold text-ink" : "text-muted"
                } ${i < step ? "" : "cursor-default"}`}
              >
                <span
                  aria-hidden
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition ${
                    i <= step ? "bg-blue text-white" : "bg-cream text-muted"
                  } ${i === step ? "ring-2 ring-blue/25 ring-offset-2" : ""} ${i < step ? "group-hover:bg-blue-dark" : ""}`}
                >
                  {i < step ? <IconTick size={15} /> : i + 1}
                </span>
                <span className="sr-only">Étape {i + 1} : </span>
                <span className="sr-only md:not-sr-only">{label}</span>
              </button>
              {i < steps.length - 1 ? <span className="cand-steps__line" aria-hidden /> : null}
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs text-muted">
          Brouillon conservé dans ce navigateur, sur cet appareil uniquement. Vous pouvez
          reprendre plus tard ; les fichiers (CV, photo) sont à joindre à nouveau.
        </p>
      </div>

      <div className="honeypot" aria-hidden>
        <input name="_hp" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset className="grid gap-4 sm:grid-cols-2" hidden={step !== 0}>
        <NameInput kind="prenom" required />
        <NameInput kind="nom" required />
        <label className="block text-sm font-semibold">
          E-mail *
          <input
            className={fieldClass}
            required
            type="email"
            name="email"
            autoComplete="email"
            placeholder="nom@entreprise.ma"
            pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
            {...errProps("email")}
          />
          {err("email")}
        </label>
        <PhoneInput label="GSM" required />
        <label className="block text-sm font-semibold sm:col-span-2">
          Ville *
          <input
            className={fieldClass}
            required
            name="ville"
            autoComplete="address-level2"
            placeholder="Ex. Casablanca"
            {...errProps("ville")}
          />
          {err("ville")}
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
              required={rule.required}
              onChange={onFile(rule)}
              aria-invalid={errors[rule.field] ? true : undefined}
              aria-describedby={`cand-${rule.field}-error`}
            />
            <span
              id={`cand-${rule.field}-error`}
              role={errors[rule.field] ? "alert" : undefined}
              className={errors[rule.field] ? "field-error" : "mt-1 block text-xs font-normal text-muted"}
            >
              {errors[rule.field] || `Fichiers acceptés : ${rule.hint}`}
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
            required
            maxLength={800}
            name="diplome"
            placeholder="Ex. Master en finance, ISCAE Casablanca, 2015"
            {...errProps("diplome")}
          />
          {err("diplome")}
        </label>
        <label className="block text-sm font-semibold">
          Études complémentaires non sanctionnées par un diplôme
          <textarea
            className={`${fieldClass} min-h-28`}
            maxLength={800}
            name="etudes"
            placeholder="Ex. formation continue en data analytics, MOOC, séminaires"
          />
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
            required
            maxLength={1500}
            name="interet"
            placeholder="Vos objectifs, le projet de transformation que vous souhaitez mener dans votre entreprise…"
            {...errProps("interet")}
          />
          {err("interet")}
        </label>
        <div>
          <label
            className={`flex items-start gap-3 rounded-[10px] border bg-cream px-4 py-3 text-sm ${
              errors.consentement ? "border-red" : "border-transparent"
            }`}
          >
            <input
              type="checkbox"
              required
              name="consentement"
              value="oui"
              className="mt-0.5 h-4 w-4 accent-blue"
              {...errProps("consentement")}
            />
            <span>
              J’accepte les <CguLink onAccept={acceptCgu} /> avant de soumettre ma candidature. *
            </span>
          </label>
          {err("consentement")}
        </div>
      </fieldset>

      <div className="flex flex-wrap justify-between gap-3">
        {step > 0 ? (
          <Button type="button" variant="ghost" onClick={() => setStep((s) => s - 1)}>
            <span className="inline-flex -scale-x-100">
              <IconArrowRight />
            </span>
            Retour
          </Button>
        ) : (
          <span />
        )}
        <Button type="submit" disabled={sending}>
          {sending ? (
            "Envoi…"
          ) : step === steps.length - 1 ? (
            <>
              Envoyer
              <IconSend size={17} />
            </>
          ) : (
            <>
              Suivant
              <IconArrowRight />
            </>
          )}
        </Button>
      </div>
      {status && <p className="text-sm text-red">{status}</p>}
      <p className="text-xs text-muted">
        Clôture des candidatures le {plain(data.site.admission.dateLimite)}.
      </p>
      {done ? (
        <SuccessDialog type="candidature" closeLabel="Retour à l’accueil" onClose={() => router.push("/")} />
      ) : null}
    </form>
  );
}
