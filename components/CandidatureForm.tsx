"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BRAND, data } from "@/lib/content";
import { CguLink } from "@/components/CguDialog";
import { FileField } from "@/components/FileField";
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
  verifyUpload,
  type Option,
  type UploadRule,
} from "@/lib/candidature";
import {
  clearDraftFiles,
  loadDraftFiles,
  removeDraftFile,
  saveDraftFile,
} from "@/lib/candidature-draft-files";

const steps = ["Coordonnées", "Inscription", "Fonction et parcours", "Motivation"];
const KEY = "cfo40-candidature";
type Choices = { participation: string; secteur: string; niveau: string; decouverte: string };
const EMPTY: Choices = { participation: "", secteur: "", niveau: "", decouverte: "" };


export function CandidatureForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const [choices, setChoices] = useState<Choices>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusName, setFocusName] = useState<{ name: string } | null>(null);
  const [done, setDone] = useState(false);
  /** Files rehydrated once from IndexedDB (`undefined` = still loading). */
  const [restoredUploads, setRestoredUploads] = useState<Partial<Record<"cv" | "photo", File>> | undefined>(undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const openedAt = useRef(0);
  const inFlight = useRef(false);

  useEffect(() => {
    openedAt.current = Math.floor(Date.now() / 1000);
  }, []);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    let cancelled = false;
    (async () => {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) {
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
          if (!cancelled) {
            setChoices(restored);
            if (next) setStep(next);
          }
        }
      } catch {
        /* ignore corrupt draft */
      }
      try {
        const files = await loadDraftFiles(UPLOADS.map((u) => u.field));
        if (!cancelled) setRestoredUploads(files);
      } catch {
        if (!cancelled) setRestoredUploads({});
      }
    })();
    return () => {
      cancelled = true;
    };
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

  async function applyUploadCheck(rule: UploadRule, input: HTMLInputElement, file: File | undefined) {
    if (!file) {
      input.setCustomValidity("");
      setErrors((errs) => ({ ...errs, [rule.field]: "" }));
      void removeDraftFile(rule.field);
      return "";
    }
    const message = await verifyUpload(rule, file);
    if (input.files?.[0] !== file) return null;
    input.setCustomValidity(message);
    setErrors((errs) => ({ ...errs, [rule.field]: message }));
    if (!message) void saveDraftFile(rule.field, file);
    else void removeDraftFile(rule.field);
    return message;
  }

  function onFile(rule: UploadRule) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const input = e.currentTarget;
      const file = input.files?.[0];
      void applyUploadCheck(rule, input, file);
    };
  }

  /** Re-check CV/photo signatures on the current step so a bad file cannot reach the last step. */
  async function verifyVisibleUploads(form: HTMLFormElement) {
    const uploadErrors: Record<string, string> = {};
    let firstBad: HTMLInputElement | null = null;
    for (const rule of UPLOADS) {
      const el = form.elements.namedItem(rule.field);
      if (!(el instanceof HTMLInputElement) || el.closest("fieldset[hidden]")) continue;
      const file = el.files?.[0];
      if (!file) continue;
      const message = await applyUploadCheck(rule, el, file);
      if (message) {
        uploadErrors[rule.field] = message;
        firstBad ??= el;
      }
    }
    return { uploadErrors, firstBad };
  }

  async function next(e: FormEvent) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const { uploadErrors, firstBad } = await verifyVisibleUploads(form);
    const { errors: found, first } = collectErrors(form);
    const merged = { ...found, ...uploadErrors };
    setErrors(merged);
    const focus = firstBad ?? first;
    if (focus) {
      focusField(focus);
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
    if (step < steps.length - 1) {
      await next(e);
      return;
    }
    if (inFlight.current) return;
    const form = e.currentTarget;
    // Final pass: validate every step, including file signatures, before sending.
    for (const rule of UPLOADS) {
      const el = form.elements.namedItem(rule.field);
      if (!(el instanceof HTMLInputElement)) continue;
      const file = el.files?.[0];
      if (!file) {
        if (rule.required) el.setCustomValidity(`Merci de joindre votre ${rule.label}.`);
        else el.setCustomValidity("");
        continue;
      }
      el.setCustomValidity(await verifyUpload(rule, file));
    }
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
      void clearDraftFiles();
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
              className={`cand-choice flex cursor-pointer items-center gap-3 rounded-[10px] border-2 bg-white transition hover:border-muted ${
                checked ? "border-blue" : errors[name] ? "border-red" : "border-line"
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
          Brouillon conservé dans ce navigateur, sur cet appareil uniquement — y compris le CV
          et la photo. Vous pouvez fermer l’onglet et reprendre plus tard.
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
          <FileField
            key={rule.field}
            rule={rule}
            error={errors[rule.field]}
            restoredFile={restoredUploads ? restoredUploads[rule.field] ?? null : undefined}
            onFileChange={onFile(rule)}
          />
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

      {status ? <p className="text-sm text-red">{status}</p> : null}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <p className="m-0 text-xs leading-none text-muted">
          Clôture des candidatures le {plain(data.site.admission.dateLimite)}.
        </p>
        <div className="ml-auto flex flex-wrap items-center gap-3">
          {step > 0 ? (
            <Button type="button" variant="ghost" onClick={() => setStep((s) => s - 1)}>
              <span className="inline-flex -scale-x-100">
                <IconArrowRight />
              </span>
              Retour
            </Button>
          ) : null}
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
      </div>
      {done ? (
        <SuccessDialog type="candidature" closeLabel="Retour à l’accueil" onClose={() => router.push("/")} />
      ) : null}
    </form>
  );
}
