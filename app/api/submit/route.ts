import { NextResponse, after } from "next/server";
import nodemailer from "nodemailer";
import { Resend } from "resend";
import { BRAND } from "@/lib/content";
import {
  buildApplicantEmail,
  buildFormEmail,
  loadBrandLogoInlines,
  type AttachmentInfo,
  type InlineImage,
} from "@/lib/emails";
import {
  AUTRE_FIELDS,
  MAX_REQUEST_BYTES,
  UPLOADS,
  extensionOf,
  matchesSignature,
  safeFilename,
} from "@/lib/candidature";
import { publicUrl } from "@/lib/cms-session";
import { cleanName, nameError } from "@/lib/names";
import { PHONE_ERROR, normalizePhone } from "@/lib/phone";
import { pushToSheet } from "@/lib/sheets";
import { saveSubmission, type Submission } from "@/lib/submissions";

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
  document: ["prenom", "nom", "fonction", "email", "document"],
  session: ["prenom", "nom", "fonction", "email", "creneau"],
  rappel: ["prenom", "nom", "fonction", "email", "telephone", "moment"],
  candidature: [
    "prenom", "nom", "email", "telephone", "ville", "participation", "secteur",
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

type Upload = AttachmentInfo & { field: string; content: Buffer };

async function readUploads(form: FormData): Promise<{ files: Upload[]; error?: string; field?: string }> {
  const files: Upload[] = [];
  for (const rule of UPLOADS) {
    const entry = form.get(rule.field);
    const file = entry instanceof File && entry.size > 0 ? entry : null;
    const fail = (error: string) => ({ files, error, field: rule.field });
    if (!file) {
      if (rule.required) return fail(`Merci de joindre votre ${rule.label} (${rule.hint}).`);
      continue;
    }
    const ext = extensionOf(file.name);
    if (!rule.extensions.includes(ext) || file.size > rule.maxBytes) {
      return fail(`${rule.label} : ${rule.hint}.`);
    }
    const content = Buffer.from(await file.arrayBuffer());
    if (!matchesSignature(ext, content.subarray(0, 8))) {
      return fail(`${rule.label} : le fichier ne correspond pas à son format (${rule.hint}).`);
    }
    files.push({
      field: rule.field,
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
  to: string,
  replyTo: string | undefined,
  mail: { subject: string; text: string; html: string },
  files: Upload[] = [],
  inlines: InlineImage[] = [],
) {
  const resend = new Resend(key);
  const attachments = [
    ...files.map((f) => ({ filename: f.filename, content: f.content })),
    ...inlines.map((img) => ({
      filename: img.filename,
      content: img.content,
      contentId: img.cid,
      contentType: img.contentType,
    })),
  ];
  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
    attachments: attachments.length ? attachments : undefined,
  });
  if (error) {
    throw new Error(error.message || error.name || "resend_error");
  }
}

async function deliverViaSmtp(
  from: string,
  to: string,
  replyTo: string | undefined,
  mail: { subject: string; text: string; html: string },
  files: Upload[] = [],
  inlines: InlineImage[] = [],
) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  if (!host || !user || !pass) throw new Error("SMTP_HOST / SMTP_USER / SMTP_PASSWORD manquants");
  const port = Number(process.env.SMTP_PORT || 465);
  const transport = nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
    auth: { user, pass },
  });
  await transport.sendMail({
    from,
    to,
    replyTo,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
    attachments: [
      ...files.map((f) => ({ filename: f.filename, content: f.content })),
      ...inlines.map((img) => ({
        filename: img.filename,
        content: img.content,
        cid: img.cid,
        contentType: img.contentType,
        contentDisposition: "inline" as const,
      })),
    ],
  });
}

/** Receipt to the submitter. Skipped on FormSubmit (owner inbox only). */
async function deliverApplicantReceipt(
  provider: string,
  from: string,
  applicant: string,
  notify: string,
  key: string | undefined,
  mail: { subject: string; text: string; html: string },
) {
  if (provider === "formsubmit") {
    console.info("[submit] applicant receipt skipped: FormSubmit cannot mail the submitter");
    return;
  }
  const logos = await loadBrandLogoInlines();
  if (provider === "smtp") {
    await deliverViaSmtp(from, applicant, notify, mail, [], logos);
    return;
  }
  if (provider === "resend") {
    if (!key) throw new Error("RESEND_API_KEY manquante");
    await deliverViaResend(key, from, applicant, notify, mail, [], logos);
    return;
  }
}

export async function POST(req: Request) {
  const isMultipart = (req.headers.get("content-type") || "").includes("multipart/form-data");
  if (isMultipart && Number(req.headers.get("content-length") || 0) > MAX_REQUEST_BYTES) {
    return NextResponse.json({ ok: false, message: "Les fichiers envoyés sont trop volumineux (5 Mo maximum chacun).", field: "cv" }, { status: 413 });
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
    return NextResponse.json({ ok: false, message: "Votre envoi est parti un peu vite. Patientez quelques secondes, puis cliquez à nouveau." }, { status: 429 });
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
  for (const kind of ["prenom", "nom"] as const) {
    const message = nameError(kind, clean(body[kind], 200));
    if (message) return NextResponse.json({ ok: false, message }, { status: 422 });
    body[kind] = cleanName(clean(body[kind], 200));
  }
  if (clean(body.telephone, 40)) {
    const phone = normalizePhone(clean(body.telephone, 40));
    if (!phone) {
      return NextResponse.json({ ok: false, message: PHONE_ERROR }, { status: 422 });
    }
    body.telephone = phone;
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
      return NextResponse.json({ ok: false, message: "Merci de joindre votre CV.", field: "cv" }, { status: 422 });
    }
    const uploads = await readUploads(form);
    if (uploads.error) {
      return NextResponse.json({ ok: false, message: uploads.error, field: uploads.field }, { status: 422 });
    }
    files = uploads.files;
  }

  // smtp = own mailbox. formsubmit = any inbox (one-time activation email). resend = needs verified domain for third-party to:.
  const provider = (process.env.EMAIL_PROVIDER || "formsubmit").toLowerCase();
  const notify = process.env.NOTIFY_EMAIL || BRAND.email;
  const from =
    process.env.FROM_EMAIL ||
    (provider === "smtp" ? `CFO 4.0 <${process.env.SMTP_USER}>` : "BDO Certificat <onboarding@resend.dev>");
  const key = process.env.RESEND_API_KEY;
  const canAttach = provider === "resend" || provider === "smtp";
  const attachMeta = files.map(({ label, filename, size }) => ({ label, filename, size }));
  const mail = buildFormEmail(type, body, {
    attachments: attachMeta,
    attachmentsNotSent: files.length > 0 && !canAttach,
  });
  const receipt = buildApplicantEmail(type, body, { attachments: attachMeta });

  let saved: Submission | null = null;
  try {
    saved = await saveSubmission(type, body, files);
  } catch (err) {
    console.error("[submit] storage failed", { type, error: err instanceof Error ? err.message : String(err) });
  }
  if (saved) {
    const record = saved;
    const site = publicUrl("/", req).origin;
    after(() =>
      pushToSheet(record, site).catch((err) =>
        console.error("[submit] sheet sync failed", { id: record.id, error: err instanceof Error ? err.message : String(err) }),
      ),
    );
  }

  try {
    if (provider === "smtp") {
      await deliverViaSmtp(from, notify, email, mail, files);
    } else if (provider === "resend") {
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
      saved: saved?.id ?? null,
      error: err instanceof Error ? err.message : String(err),
    });
    // Already on disk and visible in /admin, so the visitor does not need to resend.
    if (saved) return successResponse(type, body);
    return NextResponse.json(
      {
        ok: false,
        message: `Votre demande n’a pas pu être envoyée. Merci de réessayer dans quelques minutes ou de nous écrire à ${BRAND.email}.`,
      },
      { status: 502 },
    );
  }

  // Best-effort receipt to the submitter — never fail the request if this secondary send fails.
  try {
    await deliverApplicantReceipt(provider, from, email, notify, key, receipt);
  } catch (err) {
    console.error("[submit] applicant receipt failed", {
      type,
      provider,
      error: err instanceof Error ? err.message : String(err),
    });
  }

  return successResponse(type, body);
}

function successResponse(type: string, body: Record<string, unknown>) {
  const extra: Record<string, string> = {};
  if (type === "document") extra.download = DOCS[clean(body.document, 20)] ?? DOCS.brochure;

  return NextResponse.json({
    ok: true,
    message: "Merci, votre demande a bien été enregistrée.",
    ...extra,
  });
}
