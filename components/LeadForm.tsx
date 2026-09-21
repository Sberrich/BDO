"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BRAND, data } from "@/lib/content";
import { Button, fieldClass } from "@/components/ui";
import { plain } from "@/lib/text";

type Kind = "rappel" | "session" | "document";

const docs = [
  { value: "brochure", label: "Brochure du certificat" },
  { value: "barometre", label: "Baromètre BDO des DAF 2024" },
  { value: "livreblanc", label: "Livre blanc — La Fonction Financière Augmentée" },
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
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [ok, setOk] = useState<boolean | null>(null);
  const [sending, setSending] = useState(false);
  const openedAt = useRef(0);

  useEffect(() => {
    openedAt.current = Math.floor(Date.now() / 1000);
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setStatus("");
    const form = e.currentTarget;
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
      const json = (await res.json()) as { ok: boolean; message: string; download?: string };
      if (!res.ok || !json.ok) {
        setOk(false);
        setStatus(json.message);
        setSending(false);
        return;
      }
      const q = new URLSearchParams({ type: kind });
      if (json.download) q.set("fichier", json.download);
      router.push(`/merci?${q.toString()}`);
    } catch {
      setOk(false);
      setStatus("L’envoi n’a pas abouti. Écrivez-nous à " + BRAND.email);
      setSending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="honeypot" aria-hidden>
        <label htmlFor={`${prefix}-hp`}>Ne remplissez pas ce champ</label>
        <input id={`${prefix}-hp`} name="_hp" tabIndex={-1} autoComplete="off" />
      </div>
      <label className="block text-sm font-semibold">
        Nom et prénom *
        <input className={fieldClass} required name="nom" autoComplete="name" maxLength={120} />
      </label>
      <label className="block text-sm font-semibold">
        Fonction *
        <input className={fieldClass} required name="fonction" autoComplete="organization-title" maxLength={120} />
      </label>
      <label className="block text-sm font-semibold">
        Entreprise *
        <input className={fieldClass} required name="entreprise" autoComplete="organization" maxLength={140} />
      </label>
      <label className="block text-sm font-semibold">
        E-mail professionnel *
        <span className="mt-0.5 block text-xs font-normal text-muted">Nous n’utilisons cette adresse que pour répondre à votre demande.</span>
        <input className={fieldClass} required type="email" name="email" autoComplete="email" maxLength={160} />
      </label>
      {kind === "rappel" && (
        <>
          <label className="block text-sm font-semibold">
            Téléphone *
            <input className={fieldClass} required type="tel" name="telephone" autoComplete="tel" />
          </label>
          <label className="block text-sm font-semibold">
            Créneau souhaité *
            <select className={fieldClass} required name="moment">
              <option value="">Choisissez…</option>
              <option value="matin">Le matin, 9 h – 12 h</option>
              <option value="midi">Entre 12 h et 14 h</option>
              <option value="apres-midi">L’après-midi, 14 h – 18 h</option>
              <option value="soir">En fin de journée, après 18 h</option>
            </select>
          </label>
          <label className="block text-sm font-semibold">
            Votre question
            <textarea className={`${fieldClass} min-h-24`} name="sujet" maxLength={600} />
          </label>
        </>
      )}
      {kind === "session" && (
        <label className="block text-sm font-semibold">
          Créneau choisi *
          <span className="mt-0.5 block text-xs font-normal text-muted">Une heure en ligne, en français. Un fichier calendrier vous est remis après l’inscription.</span>
          <select className={fieldClass} required name="creneau">
            <option value="">Choisissez…</option>
            {data.site.sessionInfo.creneaux.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {plain(slot.libelle)}
              </option>
            ))}
          </select>
        </label>
      )}
      {kind === "document" && <input type="hidden" name="document" value={document ?? "brochure"} />}
      <label className="flex items-start gap-3 text-sm leading-relaxed">
          <input type="checkbox" className="mt-1 h-[1.15rem] w-[1.15rem] shrink-0" name="prospection" value="oui" />
        <span>J’accepte de recevoir les publications et les invitations du certificat CFO 4.0, du Groupe ISCAE et de BDO Maroc. Ce consentement est distinct du traitement de ma demande et peut être retiré à tout moment.</span>
      </label>
      <Button type="submit" disabled={sending} variant={submitVariant} className="w-full">
        {sending
          ? "Envoi en cours…"
          : kind === "rappel"
            ? data.site.cta.rappel.libelle
            : kind === "session"
              ? data.site.cta.session.libelle
              : "Recevoir le document"}
      </Button>
      {status && <p className={`text-sm ${ok ? "text-navy" : "text-red"}`}>{status}</p>}
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
