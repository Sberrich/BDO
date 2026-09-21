import { NextResponse } from "next/server";
import { Resend } from "resend";
import { BRAND } from "@/lib/content";
import { buildFormEmail } from "@/lib/emails";

const DOCS: Record<string, string> = {
  brochure: "/docs/CFO-4-0-brochure.pdf",
  barometre: "/docs/Barometre-BDO-des-DAF-2024.pdf",
  // Official livre blanc file is still a stub (789 B). Serve the BDO×ISCAE presentation until replaced.
  livreblanc: "/docs/presentation-BDO-ISCAE.pdf",
};

const hits = new Map<string, { n: number; t: number }>();

function ipOf(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
}

function rateOk(ip: string) {
  const now = Date.now();
  const row = hits.get(ip);
  if (!row || now - row.t > 60 * 60 * 1000) {
    hits.set(ip, { n: 1, t: now });
    return true;
  }
  if (row.n >= 12) return false;
  row.n += 1;
  return true;
}

function clean(v: unknown, max = 200) {
  return String(v ?? "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "")
    .trim()
    .slice(0, max);
}

const required: Record<string, string[]> = {
  document: ["nom", "fonction", "entreprise", "email", "document"],
  session: ["nom", "fonction", "entreprise", "email", "creneau"],
  rappel: ["nom", "fonction", "entreprise", "email", "telephone", "moment"],
  candidature: [
    "nom", "fonction", "entreprise", "email", "telephone", "secteur", "effectif",
    "experience", "diplome", "rattachement", "equipe", "projet", "attente",
    "financement", "disponibilite", "consentement",
  ],
};

async function deliverViaFormSubmit(notify: string, subject: string, lines: string, replyTo: string) {
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(notify)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      _subject: subject,
      _replyto: replyTo,
      _template: "table",
      message: lines,
      email: replyTo,
      from_site: BRAND.url,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`FormSubmit ${res.status}: ${text.slice(0, 200)}`);
  }
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, message: "Requête invalide." }, { status: 400 });
  }

  if (clean(body._hp)) {
    return NextResponse.json({ ok: true, message: "Merci, votre demande a bien été prise en compte." });
  }
  const ts = Number(body._ts || 0);
  if (ts > 0 && Date.now() / 1000 - ts < 3) {
    return NextResponse.json({ ok: false, message: "Votre envoi est parti un peu vite." }, { status: 429 });
  }
  if (!rateOk(ipOf(req))) {
    return NextResponse.json({ ok: false, message: "Trop de demandes. Réessayez plus tard." }, { status: 429 });
  }

  const type = clean(body.type, 30);
  const fields = required[type];
  if (!fields) {
    return NextResponse.json({ ok: false, message: "Ce formulaire n’est pas reconnu." }, { status: 400 });
  }
  for (const name of fields) {
    if (!clean(body[name], 800)) {
      return NextResponse.json({ ok: false, message: "Merci de renseigner tous les champs obligatoires." }, { status: 422 });
    }
  }
  const email = clean(body.email, 160);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, message: "L’adresse e-mail n’est pas valide." }, { status: 422 });
  }
  if (type === "candidature" && Number(body.experience) < 5) {
    return NextResponse.json({ ok: false, message: "Cinq ans d’expérience professionnelle au minimum." }, { status: 422 });
  }

  const notify = process.env.NOTIFY_EMAIL || BRAND.email;
  const from = process.env.FROM_EMAIL || "BDO Certificat <onboarding@resend.dev>";
  const key = process.env.RESEND_API_KEY;
  const mail = buildFormEmail(type, body);

  try {
    if (key) {
      const resend = new Resend(key);
      const { error } = await resend.emails.send({
        from,
        to: [notify],
        replyTo: email,
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
      });
      if (error) {
        console.error("[submit] resend", error);
        return NextResponse.json(
          { ok: false, message: "Nous n’avons pas pu envoyer le message." },
          { status: 502 },
        );
      }
    } else {
      console.info("[submit] no RESEND_API_KEY — FormSubmit fallback", mail.text);
      await deliverViaFormSubmit(notify, mail.subject, mail.text, email);
    }
  } catch (err) {
    console.error("[submit] delivery", err);
    return NextResponse.json({ ok: false, message: "Nous n’avons pas pu envoyer le message." }, { status: 502 });
  }

  const extra: Record<string, string> = {};
  if (type === "document") extra.download = DOCS[clean(body.document, 20)] ?? DOCS.brochure;

  return NextResponse.json({
    ok: true,
    message: "Merci, votre demande a bien été enregistrée.",
    ...extra,
  });
}
