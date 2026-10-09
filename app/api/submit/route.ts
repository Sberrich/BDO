import { NextResponse } from "next/server";
import { Resend } from "resend";
import { BRAND } from "@/lib/content";
import { buildFormEmail, type AttachmentInfo } from "@/lib/emails";
import {
  AUTRE_FIELDS,
  MAX_REQUEST_BYTES,
  UPLOADS,
  extensionOf,
  matchesSignature,
  safeFilename,
} from "@/lib/candidature";

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
  document: ["nom", "fonction", "email", "document"],
  session: ["nom", "fonction", "email", "creneau"],
  rappel: ["nom", "fonction", "email", "telephone", "moment"],
  candidature: [
    "nom", "email", "telephone", "ville", "participation", "secteur",
    "niveau", "diplome", "decouverte", "interet", "consentement",
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
      _captcha: "false",
      message: lines,
      email: replyTo,
      from_site: BRAND.url,
    }),
  });
  const text = await res.text().catch(() => "");
  if (!res.ok) {
    throw new Error(`FormSubmit ${res.status}: ${text.slice(0, 200)}`);
  }
  // First submission to a new address requires clicking FormSubmit's activation email.
  try {
    const json = JSON.parse(text) as { success?: string | boolean };
    const msg = String(json.success ?? "");
    if (/activate|confirm|check your email/i.test(msg)) {
      console.info("[submit] formsubmit activation required for", notify);
    }
  } catch {
    /* non-JSON ok */
  }
}

type Upload = AttachmentInfo & { content: Buffer };

async function readUploads(form: FormData): Promise<{ files: Upload[]; error?: string }> {
  const files: Upload[] = [];
  for (const rule of UPLOADS) {
    const entry = form.get(rule.field);
    const file = entry instanceof File && entry.size > 0 ? entry : null;
    if (!file) {
      if (rule.required) return { files, error: `Merci de joindre votre ${rule.label} (${rule.hint}).` };
      continue;
    }
    const ext = extensionOf(file.name);
    if (!rule.extensions.includes(ext) || file.size > rule.maxBytes) {
      return { files, error: `${rule.label} : ${rule.hint}.` };
    }
    const content = Buffer.from(await file.arrayBuffer());
    if (!matchesSignature(ext, content.subarray(0, 8))) {
      return { files, error: `${rule.label} : le fichier ne correspond pas à son format (${rule.hint}).` };
    }
    files.push({
      label: rule.label,
      filename: safeFilename(file.name, rule.field),
      size: file.size,
      content,
    });
  }
  return { files };
}

async function deliverViaResend(
  key: string,
  from: string,
  notify: string,
  replyTo: string,
  mail: { subject: string; text: string; html: string },
  files: Upload[],
) {
  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from,
    to: [notify],
    replyTo,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
    attachments: files.length
      ? files.map((f) => ({ filename: f.filename, content: f.content }))
      : undefined,
  });
  if (error) {
    throw new Error(error.message || error.name || "resend_error");
  }
}

export async function POST(req: Request) {
  const isMultipart = (req.headers.get("content-type") || "").includes("multipart/form-data");
  if (isMultipart && Number(req.headers.get("content-length") || 0) > MAX_REQUEST_BYTES) {
    return NextResponse.json({ ok: false, message: "Les fichiers envoyés sont trop volumineux (5 Mo maximum chacun)." }, { status: 413 });
  }

  let body: Record<string, unknown>;
  let form: FormData | null = null;
  try {
    if (isMultipart) {
      form = await req.formData();
      body = {};
      for (const [key, value] of form.entries()) {
        if (typeof value === "string") body[key] = value;
      }
    } else {
      body = (await req.json()) as Record<string, unknown>;
    }
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
  if (type === "candidature") {
    for (const name of AUTRE_FIELDS) {
      if (clean(body[name], 30) === "autre" && !clean(body[`${name}_autre`], 200)) {
        return NextResponse.json({ ok: false, message: "Merci de préciser votre réponse « Autre »." }, { status: 422 });
      }
    }
  }

  let files: Upload[] = [];
  if (type === "candidature") {
    if (!form) {
      return NextResponse.json({ ok: false, message: "Merci de joindre votre CV." }, { status: 422 });
    }
    const uploads = await readUploads(form);
    if (uploads.error) {
      return NextResponse.json({ ok: false, message: uploads.error }, { status: 422 });
    }
    files = uploads.files;
  }

  // formsubmit = any inbox (one-time activation email). resend = needs verified domain for third-party to:.
  const provider = (process.env.EMAIL_PROVIDER || "formsubmit").toLowerCase();
  const notify = process.env.NOTIFY_EMAIL || BRAND.email;
  const from = process.env.FROM_EMAIL || "BDO Certificat <onboarding@resend.dev>";
  const key = process.env.RESEND_API_KEY;
  const canAttach = provider === "resend";
  const mail = buildFormEmail(type, body, {
    attachments: files.map(({ label, filename, size }) => ({ label, filename, size })),
    attachmentsNotSent: files.length > 0 && !canAttach,
  });

  try {
    if (provider === "resend") {
      if (!key) throw new Error("RESEND_API_KEY manquante");
      await deliverViaResend(key, from, notify, email, mail, files);
    } else {
      if (files.length) console.warn("[submit] attachments not forwarded: provider has no attachment support", { provider });
      await deliverViaFormSubmit(notify, mail.subject, mail.text, email);
    }
  } catch (err) {
    console.error("[submit] delivery failed", {
      type,
      provider,
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      {
        ok: false,
        message: `Votre demande n’a pas pu être envoyée. Merci de réessayer dans quelques minutes ou de nous écrire à ${BRAND.email}.`,
      },
      { status: 502 },
    );
  }

  const extra: Record<string, string> = {};
  if (type === "document") extra.download = DOCS[clean(body.document, 20)] ?? DOCS.brochure;

  return NextResponse.json({
    ok: true,
    message: "Merci, votre demande a bien été enregistrée.",
    ...extra,
  });
}
