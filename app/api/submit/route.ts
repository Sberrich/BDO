import { NextResponse } from "next/server";
import { Resend } from "resend";
import { site } from "@/content/site";

type Payload = {
  type?: string;
  nom?: string;
  email?: string;
  telephone?: string;
  entreprise?: string;
  participation?: string;
  secteur?: string;
  fonction?: string;
  decouverte?: string;
  message?: string;
  consentement?: boolean;
  _hp?: string;
  _ts?: number;
};

const hits = new Map<string, { n: number; t: number }>();

function ipOf(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local"
  );
}

function rateOk(ip: string) {
  const now = Date.now();
  const row = hits.get(ip);
  if (!row || now - row.t > 60 * 60 * 1000) {
    hits.set(ip, { n: 1, t: now });
    return true;
  }
  if (row.n >= 8) return false;
  row.n += 1;
  return true;
}

function clean(v: unknown, max = 200) {
  return String(v ?? "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "")
    .trim()
    .slice(0, max);
}

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, message: "Requête invalide." }, { status: 400 });
  }

  if (clean(body._hp)) {
    return NextResponse.json({ ok: true, message: "Merci, votre demande a bien été prise en compte." });
  }

  const ts = Number(body._ts || 0);
  if (ts > 0 && Date.now() / 1000 - ts < 3) {
    return NextResponse.json(
      { ok: false, message: "Votre envoi est parti un peu vite. Patientez quelques secondes." },
      { status: 429 },
    );
  }

  if (!rateOk(ipOf(req))) {
    return NextResponse.json(
      { ok: false, message: "Trop de demandes depuis cette connexion. Réessayez plus tard." },
      { status: 429 },
    );
  }

  const nom = clean(body.nom, 120);
  const email = clean(body.email, 160);
  const telephone = clean(body.telephone, 30);
  const entreprise = clean(body.entreprise, 140);
  const participation = clean(body.participation, 80);
  const secteur = clean(body.secteur, 80);
  const fonction = clean(body.fonction, 120);
  const decouverte = clean(body.decouverte, 160);
  const message = clean(body.message, 800);

  if (!nom || !email || !telephone || !entreprise || !participation || !secteur || !fonction || !decouverte) {
    return NextResponse.json(
      { ok: false, message: "Merci de renseigner tous les champs obligatoires." },
      { status: 422 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, message: "L’adresse e-mail n’est pas valide." }, { status: 422 });
  }
  if (!body.consentement) {
    return NextResponse.json(
      { ok: false, message: "Le consentement au traitement des données est obligatoire." },
      { status: 422 },
    );
  }

  const lines = [
    `Nom            : ${nom}`,
    `E-mail         : ${email}`,
    `Téléphone      : ${telephone}`,
    `Entreprise     : ${entreprise}`,
    `Participation  : ${participation}`,
    `Secteur        : ${secteur}`,
    `Fonction       : ${fonction}`,
    `Découverte     : ${decouverte}`,
    `Message        : ${message || "—"}`,
  ].join("\n");

  const notify = process.env.NOTIFY_EMAIL || site.email;
  const from = process.env.FROM_EMAIL || "BDO Certificat <onboarding@resend.dev>";
  const key = process.env.RESEND_API_KEY;

  if (key) {
    try {
      const resend = new Resend(key);
      await resend.emails.send({
        from,
        to: [notify],
        replyTo: email,
        subject: `[CFO 4.0] Inscription — ${nom}`,
        text: lines,
      });
      await resend.emails.send({
        from,
        to: [email],
        subject: "Votre demande d’inscription — certificat ISCAE × BDO",
        text:
          `Bonjour ${nom},\n\n` +
          "Votre demande d’inscription au certificat Transformation Digitale et Leadership Financier nous est bien parvenue.\n\n" +
          "L’équipe pédagogique ISCAE × BDO revient vers vous rapidement.\n\n" +
          `${site.url}\n`,
      });
    } catch (err) {
      console.error("[submit] resend", err);
      return NextResponse.json(
        { ok: false, message: "Nous n’avons pas pu envoyer le message. Écrivez-nous directement." },
        { status: 502 },
      );
    }
  } else {
    console.info("[submit] RESEND_API_KEY absent — demande journalisée\n", lines);
  }

  return NextResponse.json({
    ok: true,
    message: "Merci, votre demande d’inscription a bien été enregistrée.",
  });
}
