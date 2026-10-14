"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { BRAND, data } from "@/lib/content";
import { NameInput } from "@/components/NameInput";
import { PhoneInput } from "@/components/PhoneInput";
import { SuccessDialog } from "@/components/SuccessDialog";
import { Button, fieldClass } from "@/components/ui";
import { safeDocPath } from "@/lib/confirmation";
import { collectErrors, fieldMessage, focusField, isField } from "@/lib/form-errors";
import { plain } from "@/lib/text";

type Kind = "rappel" | "session" | "document";

const docs = [
  { value: "brochure", label: "Brochure du certificat" },
  { value: "barometre", label: "Baromètre BDO des DAF 2024" },
  {
    value: "livreblanc",
    label: "Livre blanc : La Fonction Financière Augmentée",
  },
];

export function LeadForm({
  kind,
  document,
  prefix = "f",
  submitVariant = "primary",
}: {
  kind: Kind;
  document?: string;
  prefix?: string;
  submitVariant?: "primary" | "secondary";
}) {
  const [status, setStatus] = useState("");
  const [ok, setOk] = useState<boolean | null>(null);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<{ fichier: string | null } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const openedAt = useRef(0);
  const inFlight = useRef(false);

  useEffect(() => {
    openedAt.current = Math.floor(Date.now() / 1000);
  }, []);

  function revalidate(e: FormEvent<HTMLFormElement>) {
    const el = e.target;
    if (!isField(el) || !(el.name in errors)) return;
    setErrors((errs) => ({ ...errs, [el.name]: fieldMessage(el) }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current) return;
    const form = e.currentTarget;
    const { errors: found, first } = collectErrors(form);
    setErrors(found);
    if (first) {
      focusField(first);
      return;
    }
    inFlight.current = true;
    setSending(true);
    setStatus("");
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());
    payload._ts = String(openedAt.current || Math.floor(Date.now() / 1000));
    payload.type = kind;
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as {
        ok: boolean;
        message: string;
        download?: string;
      };
      if (!res.ok || !json.ok) {
        setOk(false);
        setStatus(json.message);
        setSending(false);
        inFlight.current = false;
        return;
      }
      // Start the PDF download in this user-gesture turn (before navigation).
      // Use window.document — the `document` prop shadows the DOM global.
      if (json.download && /^\/docs\/[A-Za-z0-9._-]+\.pdf$/.test(json.download)) {
        const a = window.document.createElement("a");
        a.href = json.download;
        a.download = json.download.split("/").pop() || "document.pdf";
        a.rel = "noopener";
        window.document.body.appendChild(a);
        a.click();
        a.remove();
      }
      setDone({ fichier: safeDocPath(json.download) });
    } catch {
      setOk(false);
      setStatus("L’envoi n’a pas abouti. Écrivez-nous à " + BRAND.email);
      setSending(false);
      inFlight.current = false;
    }
  }

  function closeDone() {
    formRef.current?.reset();
    setDone(null);
    setSending(false);
    inFlight.current = false;
  }

  const fieldError = (name: string) =>
    errors[name] ? (
      <span id={`${prefix}-${name}-error`} role="alert" className="field-error">
        {errors[name]}
      </span>
    ) : null;
  const errorProps = (name: string) =>
    errors[name]
      ? { "aria-invalid": true as const, "aria-describedby": `${prefix}-${name}-error` }
      : {};

  return (
    <form ref={formRef} onSubmit={onSubmit} onInput={revalidate} onChange={revalidate} className="space-y-4" noValidate>
      {done ? <SuccessDialog type={kind} fichier={done.fichier} onClose={closeDone} /> : null}
      <div className="honeypot" aria-hidden>
        <label htmlFor={`${prefix}-hp`}>Ne remplissez pas ce champ</label>
        <input
          id={`${prefix}-hp`}
          name="_hp"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <NameInput kind="prenom" required />
        <NameInput kind="nom" required />
      </div>
      <label className="block text-sm font-semibold">
        Fonction *
        <input
          className={fieldClass}
          required
          name="fonction"
          autoComplete="organization-title"
          placeholder="Ex. Directeur administratif et financier"
          maxLength={120}
          {...errorProps("fonction")}
        />
        {fieldError("fonction")}
      </label>
      <label className="block text-sm font-semibold">
        E-mail *
        <span className="mt-0.5 block text-xs font-normal text-muted">
          Nous n’utilisons cette adresse que pour répondre à votre demande.
        </span>
        <input
          className={fieldClass}
          required
          type="email"
          name="email"
          autoComplete="email"
          placeholder="nom@entreprise.ma"
          maxLength={160}
          pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
          {...errorProps("email")}
        />
        {fieldError("email")}
      </label>
      {kind === "rappel" && (
        <>
          <PhoneInput label="Téléphone" required />
          <label className="block text-sm font-semibold">
            Créneau souhaité *
            <select className={fieldClass} required name="moment" {...errorProps("moment")}>
              <option value="">Choisissez…</option>
              <option value="matin">Le matin, 9 h – 12 h</option>
              <option value="midi">Entre 12 h et 14 h</option>
              <option value="apres-midi">L’après-midi, 14 h – 18 h</option>
              <option value="soir">En fin de journée, après 18 h</option>
            </select>
            {fieldError("moment")}
          </label>
          <label className="block text-sm font-semibold">
            Votre question
            <textarea
              className={`${fieldClass} min-h-24`}
              name="sujet"
              placeholder="Ex. financement par l’entreprise, rythme, prérequis…"
              maxLength={600}
            />
          </label>
        </>
      )}
      {kind === "session" && (
        <label className="block text-sm font-semibold">
          Créneau choisi *
          <span className="mt-0.5 block text-xs font-normal text-muted">
            Une heure en ligne, en français. Un fichier calendrier vous est
            remis après l’inscription.
          </span>
          <select className={fieldClass} required name="creneau" {...errorProps("creneau")}>
            <option value="">Choisissez…</option>
            {data.site.sessionInfo.creneaux.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {plain(slot.libelle)}
              </option>
            ))}
          </select>
          {fieldError("creneau")}
        </label>
      )}
      {kind === "document" && (
        <input type="hidden" name="document" value={document ?? "brochure"} />
      )}
      <label className="flex items-start gap-3 text-sm leading-relaxed">
        <input
          type="checkbox"
          className="mt-1 h-[1.15rem] w-[1.15rem] shrink-0"
          name="prospection"
          value="oui"
        />
        <span>
          J’accepte de recevoir les publications et les invitations du
          certificat CFO 4.0, du Groupe ISCAE et de BDO Maroc. Ce consentement
          est distinct du traitement de ma demande et peut être retiré à tout
          moment.
        </span>
      </label>
      <Button
        type="submit"
        disabled={sending}
        variant={submitVariant}
        className="w-full"
      >
        {sending
          ? "Envoi en cours…"
          : kind === "rappel"
            ? data.site.cta.rappel.libelle
            : kind === "session"
              ? data.site.cta.session.libelle
              : document === "brochure" || !document
                ? "Recevoir la brochure"
                : "Recevoir le document"}
      </Button>
      {status && (
        <p className={`text-sm ${ok ? "text-navy" : "text-red"}`}>{status}</p>
      )}
      <p className="text-xs leading-relaxed text-muted">
        {data.site.conformite.mention}{" "}
        <a href="/confidentialite" className="font-semibold text-blue">
          Voir la politique de protection des données
        </a>
        .
      </p>
    </form>
  );
}

export { docs };
