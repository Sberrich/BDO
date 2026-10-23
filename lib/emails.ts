import { BRAND, data } from "@/lib/content";
import { fullName } from "@/lib/names";
import { plain } from "@/lib/text";
import { DECOUVERTES, NIVEAUX, PARTICIPATIONS, SECTEURS, labelOf } from "@/lib/candidature";

export type FormPayload = Record<string, unknown>;

export type AttachmentInfo = { label: string; filename: string; size: number };

export type EmailExtras = {
  attachments?: AttachmentInfo[];
  /** Set when the delivery provider cannot carry the files. */
  attachmentsNotSent?: boolean;
};

const NAVY = "#00264a";
const RED = "#e30613";
const BLUE = "#003768";
const MUTED = "#5a6b7d";
const LINE = "#e7eef4";
const WASH = "#f2f5f8";

const DOC_LABELS: Record<string, string> = {
  brochure: "Brochure du certificat CFO 4.0",
  barometre: "Baromètre BDO des DAF 2024",
  livreblanc: "Livre blanc : La Fonction Financière Augmentée",
};

const MOMENT_LABELS: Record<string, string> = {
  matin: "Le matin, 9 h – 12 h",
  midi: "Entre 12 h et 14 h",
  "apres-midi": "L’après-midi, 14 h – 18 h",
  soir: "En fin de journée, après 18 h",
};

const META: Record<
  string,
  { badge: string; title: string; subject: string; accent: string; intro: string }
> = {
  rappel: {
    badge: "Rappel",
    title: "Demande de rappel",
    subject: "Demande de rappel",
    accent: RED,
    intro: "Un prospect souhaite être rappelé. Répondez-lui sous 24 h.",
  },
  session: {
    badge: "Session",
    title: "Inscription à une session d’information",
    subject: "Session d’information",
    accent: "#003768",
    intro: "Inscription à une session d’information en ligne.",
  },
  document: {
    badge: "Document",
    title: "Téléchargement de document",
    subject: "Téléchargement",
    accent: BLUE,
    intro: "Une personne a demandé un document du certificat.",
  },
  candidature: {
    badge: "Candidature",
    title: "Nouvelle candidature CFO 4.0",
    subject: "Nouvelle candidature CFO 4.0",
    accent: RED,
    intro: "Un dossier de candidature vient d’être déposé. À instruire.",
  },
};

function esc(v: unknown) {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function val(body: FormPayload, key: string, max = 800) {
  return String(body[key] ?? "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "")
    .trim()
    .slice(0, max);
}

function labelMap(map: Record<string, string>, key: string) {
  return map[key] || key;
}

function slotLabel(id: string) {
  const slot = data.site.sessionInfo.creneaux.find((c) => c.id === id);
  return slot ? plain(slot.libelle) : id;
}

function row(label: string, value: string, opts?: { href?: string; mono?: boolean }) {
  if (!value) return "";
  const content = opts?.href
    ? `<a href="${esc(opts.href)}" style="color:${NAVY};font-weight:700;text-decoration:none;">${esc(value)}</a>`
    : esc(value);
  return `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid ${LINE};width:38%;vertical-align:top;font:700 12px/1.4 Mulish,Segoe UI,Arial,sans-serif;color:${MUTED};text-transform:uppercase;letter-spacing:0.06em;">
        ${esc(label)}
      </td>
      <td style="padding:12px 0;border-bottom:1px solid ${LINE};vertical-align:top;font:${opts?.mono ? "600 14px/1.5 ui-monospace,Menlo,monospace" : "600 15px/1.5 Mulish,Segoe UI,Arial,sans-serif"};color:${NAVY};">
        ${content}
      </td>
    </tr>`;
}

function section(title: string, rowsHtml: string) {
  if (!rowsHtml.trim()) return "";
  return `
    <tr>
      <td style="padding:28px 32px 8px;">
        <p style="margin:0 0 8px;font:800 11px/1 Mulish,Segoe UI,Arial,sans-serif;letter-spacing:0.14em;text-transform:uppercase;color:${BLUE};">
          ${esc(title)}
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          ${rowsHtml}
        </table>
      </td>
    </tr>`;
}

function withAutre(label: string, other: string) {
  return other ? `${label} : ${other}` : label;
}

function formatSize(bytes: number) {
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} Mo` : `${Math.max(1, Math.round(bytes / 1024))} Ko`;
}

function attachmentsSection(extras?: EmailExtras) {
  const files = extras?.attachments ?? [];
  if (!files.length) return "";
  const rows = files.map((f) => row(f.label, `${f.filename} (${formatSize(f.size)})`)).join("");
  const note = extras?.attachmentsNotSent
    ? row("Attention", "Fichiers reçus mais non joints à cet e-mail (fournisseur d’envoi sans pièces jointes). Demandez-les au candidat.")
    : "";
  return section("Pièces jointes", rows + note);
}

function fieldsFor(type: string, body: FormPayload, extras?: EmailExtras): string {
  const v = (k: string, max?: number) => val(body, k, max);
  const yesNo = (k: string) => (v(k) === "oui" ? "Oui" : "Non");

  if (type === "rappel") {
    return (
      section(
        "Coordonnées",
        [
          row("Prénom", v("prenom")),
          row("Nom", v("nom")),
          row("Fonction", v("fonction")),
          row("Entreprise", v("entreprise")),
          row("E-mail", v("email"), { href: `mailto:${v("email")}` }),
          row("Téléphone", v("telephone"), { href: `tel:${v("telephone").replace(/\s/g, "")}` }),
        ].join(""),
      ) +
      section(
        "Demande",
        [
          row("Créneau", labelMap(MOMENT_LABELS, v("moment"))),
          row("Question", v("sujet", 600)),
          row("Prospection", yesNo("prospection")),
        ].join(""),
      )
    );
  }

  if (type === "session") {
    return (
      section(
        "Coordonnées",
        [
          row("Prénom", v("prenom")),
          row("Nom", v("nom")),
          row("Fonction", v("fonction")),
          row("Entreprise", v("entreprise")),
          row("E-mail", v("email"), { href: `mailto:${v("email")}` }),
        ].join(""),
      ) +
      section(
        "Session",
        [
          row("Créneau", slotLabel(v("creneau"))),
          row("Prospection", yesNo("prospection")),
        ].join(""),
      )
    );
  }

  if (type === "document") {
    return (
      section(
        "Coordonnées",
        [
          row("Prénom", v("prenom")),
          row("Nom", v("nom")),
          row("Fonction", v("fonction")),
          row("Entreprise", v("entreprise")),
          row("E-mail", v("email"), { href: `mailto:${v("email")}` }),
        ].join(""),
      ) +
      section(
        "Document",
        [
          row("Fichier demandé", labelMap(DOC_LABELS, v("document"))),
          row("Prospection", yesNo("prospection")),
        ].join(""),
      )
    );
  }

  // candidature
  return (
    section(
      "Coordonnées",
      [
        row("Prénom", v("prenom")),
        row("Nom", v("nom")),
        row("E-mail", v("email"), { href: `mailto:${v("email")}` }),
        row("GSM", v("telephone"), { href: `tel:${v("telephone").replace(/\s/g, "")}` }),
        row("Ville", v("ville")),
      ].join(""),
    ) +
    attachmentsSection(extras) +
    section(
      "Inscription",
      [
        row("Demande formulée pour", labelOf(PARTICIPATIONS, v("participation"))),
        row("Secteur d’activité", withAutre(labelOf(SECTEURS, v("secteur")), v("secteur_autre"))),
      ].join(""),
    ) +
    section(
      "Fonction et parcours",
      [
        row("Fonction", niveauOf(body)),
        row("Diplômes obtenus", v("diplome", 800)),
        row("Études complémentaires", v("etudes", 800)),
      ].join(""),
    ) +
    section(
      "Motivation",
      [
        row("A découvert le certificat", withAutre(labelOf(DECOUVERTES, v("decouverte")), v("decouverte_autre"))),
        row("Intérêt pour la formation", v("interet", 1500)),
        row("Conditions générales", v("consentement") === "oui" ? "Acceptées" : "Non acceptées"),
      ].join(""),
    )
  );
}

export const FORM_TYPES = ["candidature", "rappel", "session", "document"] as const;

export function formTypeLabel(type: string) {
  return META[type]?.badge ?? type;
}

export type ReadableField = { key: string; label: string; value: string };

/** Submission fields in display order, with option codes turned into their labels. */
export function readableFields(type: string, body: FormPayload): ReadableField[] {
  const v = (k: string, max = 2000) => val(body, k, max);
  const yesNo = (k: string) => (v(k) === "oui" ? "Oui" : "Non");
  const contact = [
    { key: "prenom", label: "Prénom", value: v("prenom") },
    { key: "nom", label: "Nom", value: v("nom") },
    { key: "email", label: "E-mail", value: v("email") },
    { key: "telephone", label: type === "candidature" ? "GSM" : "Téléphone", value: v("telephone") },
  ];

  if (type === "candidature") {
    return [
      ...contact,
      { key: "ville", label: "Ville", value: v("ville") },
      { key: "participation", label: "Participation", value: labelOf(PARTICIPATIONS, v("participation")) },
      { key: "secteur", label: "Secteur d’activité", value: withAutre(labelOf(SECTEURS, v("secteur")), v("secteur_autre")) },
      { key: "niveau", label: "Fonction", value: niveauOf(body) },
      { key: "diplome", label: "Diplômes obtenus", value: v("diplome") },
      { key: "etudes", label: "Études complémentaires", value: v("etudes") },
      { key: "decouverte", label: "A découvert le certificat", value: withAutre(labelOf(DECOUVERTES, v("decouverte")), v("decouverte_autre")) },
      { key: "interet", label: "Intérêt pour la formation", value: v("interet") },
      { key: "consentement", label: "Conditions générales", value: v("consentement") === "oui" ? "Acceptées" : "Non acceptées" },
    ];
  }

  const base = [
    ...contact,
    { key: "fonction", label: "Fonction", value: v("fonction") },
    { key: "entreprise", label: "Entreprise", value: v("entreprise") },
  ];
  const detail =
    type === "rappel"
      ? [
          { key: "moment", label: "Créneau de rappel", value: labelMap(MOMENT_LABELS, v("moment")) },
          { key: "sujet", label: "Question", value: v("sujet") },
        ]
      : type === "session"
        ? [{ key: "creneau", label: "Session choisie", value: v("creneau") ? slotLabel(v("creneau")) : "" }]
        : [{ key: "document", label: "Document demandé", value: labelMap(DOC_LABELS, v("document")) }];
  return [...base, ...detail, { key: "prospection", label: "Accepte la prospection", value: yesNo("prospection") }];
}

function niveauOf(body: FormPayload) {
  return withAutre(labelOf(NIVEAUX, val(body, "niveau")), val(body, "niveau_autre"));
}

function subtitleOf(type: string, body: FormPayload) {
  return type === "candidature" ? niveauOf(body) : val(body, "fonction");
}

function textFor(type: string, body: FormPayload, extras?: EmailExtras) {
  const meta = META[type] ?? META.rappel;
  const v = (k: string, max?: number) => val(body, k, max);
  const lines = [`${meta.title}`, `----`, `Nom : ${fullName(body)}`, `Fonction : ${subtitleOf(type, body)}`, `E-mail : ${v("email")}`];

  if (type === "rappel") {
    lines.push(`Téléphone : ${v("telephone")}`, `Créneau : ${labelMap(MOMENT_LABELS, v("moment"))}`, `Question : ${v("sujet", 600)}`);
  } else if (type === "session") {
    lines.push(`Créneau : ${slotLabel(v("creneau"))}`);
  } else if (type === "document") {
    lines.push(`Document : ${labelMap(DOC_LABELS, v("document"))}`);
  } else if (type === "candidature") {
    lines.push(
      `GSM : ${v("telephone")}`,
      `Ville : ${v("ville")}`,
      `Demande formulée pour : ${labelOf(PARTICIPATIONS, v("participation"))}`,
      `Secteur : ${withAutre(labelOf(SECTEURS, v("secteur")), v("secteur_autre"))}`,
      `Diplômes : ${v("diplome", 800)}`,
      `Études complémentaires : ${v("etudes", 800)}`,
      `A découvert le certificat : ${withAutre(labelOf(DECOUVERTES, v("decouverte")), v("decouverte_autre"))}`,
      `Intérêt : ${v("interet", 1500)}`,
    );
    for (const f of extras?.attachments ?? []) {
      lines.push(`${f.label} : ${f.filename} (${formatSize(f.size)})`);
    }
    if (extras?.attachmentsNotSent && extras.attachments?.length) {
      lines.push("Attention : fichiers non joints à cet e-mail, à demander au candidat.");
    }
  }

  lines.push("", `Répondre : ${v("email")}`, BRAND.url);
  return lines.filter(Boolean).join("\n");
}

export function buildFormEmail(type: string, body: FormPayload, extras?: EmailExtras) {
  const meta = META[type] ?? {
    badge: type,
    title: type,
    subject: type,
    accent: NAVY,
    intro: "Nouvelle soumission de formulaire.",
  };
  const nom = fullName(body) || "Prospect";
  const email = val(body, "email");
  const when = new Date().toLocaleString("fr-MA", {
    timeZone: "Africa/Casablanca",
    dateStyle: "full",
    timeStyle: "short",
  });

  const subject = `[CFO 4.0] ${meta.subject} · ${nom}`;

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${WASH};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${WASH};padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-collapse:collapse;">
          <tr>
            <td style="background:${NAVY};padding:28px 32px 24px;">
              <p style="margin:0 0 10px;font:800 11px/1 Mulish,Segoe UI,Arial,sans-serif;letter-spacing:0.16em;text-transform:uppercase;color:${BLUE};">
                CFO 4.0 · Groupe ISCAE × BDO Maroc
              </p>
              <p style="margin:0 0 14px;">
                <span style="display:inline-block;padding:6px 12px;background:${meta.accent};color:#fff;font:800 11px/1 Mulish,Segoe UI,Arial,sans-serif;letter-spacing:0.08em;text-transform:uppercase;">
                  ${esc(meta.badge)}
                </span>
              </p>
              <h1 style="margin:0;font:800 26px/1.2 Mulish,Segoe UI,Arial,sans-serif;color:#ffffff;letter-spacing:-0.02em;">
                ${esc(meta.title)}
              </h1>
              <p style="margin:12px 0 0;font:400 15px/1.5 Mulish,Segoe UI,Arial,sans-serif;color:rgba(255,255,255,0.78);">
                ${esc(meta.intro)}
              </p>
            </td>
          </tr>
          <tr>
            <td style="height:4px;background:${meta.accent};font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:24px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${WASH};border-collapse:collapse;">
                <tr>
                  <td style="padding:18px 20px;">
                    <p style="margin:0;font:800 18px/1.3 Mulish,Segoe UI,Arial,sans-serif;color:${NAVY};">${esc(nom)}</p>
                    <p style="margin:6px 0 0;font:600 14px/1.4 Mulish,Segoe UI,Arial,sans-serif;color:${MUTED};">
                      ${esc(subtitleOf(type, body))}${val(body, "entreprise") ? ` · ${esc(val(body, "entreprise"))}` : ""}
                    </p>
                    <p style="margin:14px 0 0;">
                      <a href="mailto:${esc(email)}" style="display:inline-block;padding:11px 18px;background:${RED};color:#ffffff;font:800 13px/1 Mulish,Segoe UI,Arial,sans-serif;text-decoration:none;">
                        Répondre à ${esc(nom.split(" ")[0] || "ce contact")}
                      </a>
                      ${
                        val(body, "telephone")
                          ? `<a href="tel:${esc(val(body, "telephone").replace(/\s/g, ""))}" style="display:inline-block;margin-left:8px;padding:11px 18px;background:#ffffff;color:${NAVY};font:800 13px/1 Mulish,Segoe UI,Arial,sans-serif;text-decoration:none;border:1px solid ${LINE};">
                        Appeler
                      </a>`
                          : ""
                      }
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ${fieldsFor(type, body, extras)}
          <tr>
            <td style="padding:20px 32px 28px;">
              <p style="margin:0;font:400 12px/1.5 Mulish,Segoe UI,Arial,sans-serif;color:${MUTED};">
                Reçu le ${esc(when)} (heure de Rabat) · ${esc(BRAND.url)}
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:${NAVY};padding:18px 32px;">
              <p style="margin:0;font:600 12px/1.5 Mulish,Segoe UI,Arial,sans-serif;color:rgba(255,255,255,0.7);">
                Certificat exécutif CFO 4.0 · Transformation Digitale et Leadership Financier
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    subject,
    html,
    text: textFor(type, body, extras),
  };
}

export type InlineImage = {
  cid: string;
  filename: string;
  content: Buffer;
  contentType: string;
};

function emailAsset(path: string) {
  const base = BRAND.url.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Load brand logos from /public for CID inline embedding (reliable in Gmail/Outlook). */
export async function loadBrandLogoInlines(): Promise<InlineImage[]> {
  const { readFile } = await import("fs/promises");
  const { join } = await import("path");
  const root = join(process.cwd(), "public", "images");
  const files: { cid: string; file: string }[] = [
    { cid: "logo-iscae", file: "logo-iscae-lockup.png" },
    { cid: "logo-bdo", file: "logo-bdo-lockup.png" },
  ];
  const out: InlineImage[] = [];
  for (const f of files) {
    try {
      out.push({
        cid: f.cid,
        filename: f.file,
        content: await readFile(join(root, f.file)),
        contentType: "image/png",
      });
    } catch {
      /* missing asset — HTML falls back to hosted URL */
    }
  }
  return out;
}

/** Shared branded shell: logo lockup + navy hero + body + footer. */
function applicantEmailShell(opts: {
  subject: string;
  badge: string;
  title: string;
  lead: string;
  bodyHtml: string;
  hello: string;
}) {
  const site = BRAND.url.replace(/\/$/, "");
  // Prefer CID (attached inline); hosted URL is the fallback if CID is stripped.
  const logoIscae = "cid:logo-iscae";
  const logoBdo = "cid:logo-bdo";
  const logoIscaeHttp = emailAsset("/images/logo-iscae-lockup.png");
  const logoBdoHttp = emailAsset("/images/logo-bdo-lockup.png");

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${esc(opts.subject)}</title>
  <!--[if mso]><style>body,table,td{font-family:Arial,sans-serif!important;}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background:${WASH};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${WASH};padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-collapse:collapse;border-radius:16px;overflow:hidden;">
          <!-- Logo bar -->
          <tr>
            <td style="background:#ffffff;padding:22px 28px 18px;border-bottom:1px solid ${LINE};">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                <tr>
                  <td style="vertical-align:middle;">
                    <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                      <tr>
                        <td style="vertical-align:middle;padding-right:14px;">
                          <a href="${esc(BRAND.iscae)}" style="text-decoration:none;">
                            <img src="${logoIscae}" width="100" height="49" alt="Groupe ISCAE" style="display:block;width:100px;height:auto;border:0;outline:none;" />
                          </a>
                        </td>
                        <td style="width:1px;height:36px;background:${LINE};font-size:0;line-height:0;">&nbsp;</td>
                        <td style="vertical-align:middle;padding-left:14px;">
                          <a href="${esc(BRAND.bdo)}" style="text-decoration:none;">
                            <img src="${logoBdo}" width="86" height="33" alt="BDO Maroc" style="display:block;width:86px;height:auto;border:0;outline:none;" />
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" style="vertical-align:middle;font:800 11px/1 Mulish,Segoe UI,Arial,sans-serif;letter-spacing:0.12em;text-transform:uppercase;color:${MUTED};">
                    CFO&nbsp;4.0
                  </td>
                </tr>
              </table>
              <!-- Hosted fallback for clients that ignore CID -->
              <div style="display:none;max-height:0;overflow:hidden;">
                <img src="${esc(logoIscaeHttp)}" width="1" height="1" alt="" />
                <img src="${esc(logoBdoHttp)}" width="1" height="1" alt="" />
              </div>
            </td>
          </tr>
          <!-- Hero -->
          <tr>
            <td style="background:${NAVY};padding:0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:${NAVY};">
                <tr>
                  <td style="padding:30px 32px 10px;">
                    <span style="display:inline-block;padding:7px 12px;background:${RED};color:#ffffff;font:800 11px/1 Mulish,Segoe UI,Arial,sans-serif;letter-spacing:0.1em;text-transform:uppercase;border-radius:999px;">
                      ${esc(opts.badge)}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 32px 12px;">
                    <h1 style="margin:0;font:800 28px/1.18 Mulish,Segoe UI,Arial,sans-serif;color:#ffffff;letter-spacing:-0.03em;">
                      ${esc(opts.title)}
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 32px 30px;">
                    <p style="margin:0;max-width:460px;font:400 15px/1.55 Mulish,Segoe UI,Arial,sans-serif;color:#d7e3ef;">
                      ${esc(opts.lead)}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="height:4px;background:${RED};font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 32px 8px;font:400 16px/1.65 Mulish,Segoe UI,Arial,sans-serif;color:${NAVY};">
              <p style="margin:0 0 18px;font:800 20px/1.3 Mulish,Segoe UI,Arial,sans-serif;color:${NAVY};">
                Bonjour ${esc(opts.hello)}
              </p>
              ${opts.bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${WASH};border-collapse:collapse;border-radius:12px;">
                <tr>
                  <td style="padding:16px 18px;font:400 13px/1.55 Mulish,Segoe UI,Arial,sans-serif;color:${MUTED};">
                    <a href="${esc(site)}" style="color:${BLUE};font-weight:700;text-decoration:none;">${esc(site.replace(/^https?:\/\//, ""))}</a>
                    &nbsp;·&nbsp;
                    <a href="mailto:${esc(BRAND.email)}" style="color:${BLUE};font-weight:700;text-decoration:none;">${esc(BRAND.email)}</a>
                    &nbsp;·&nbsp;
                    <a href="tel:${esc(BRAND.phone.replace(/\s/g, ""))}" style="color:${BLUE};font-weight:700;text-decoration:none;">${esc(BRAND.phone)}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:${NAVY};padding:18px 32px;">
              <p style="margin:0;font:600 12px/1.5 Mulish,Segoe UI,Arial,sans-serif;color:rgba(255,255,255,0.72);">
                Certificat exécutif CFO 4.0 · Transformation Digitale et Leadership Financier
              </p>
              <p style="margin:6px 0 0;font:600 11px/1.4 Mulish,Segoe UI,Arial,sans-serif;color:rgba(255,255,255,0.45);">
                Groupe ISCAE × BDO Maroc
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Confirmation sent to the person who submitted the form (not the admin notify). */
export function buildApplicantEmail(type: string, body: FormPayload, extras?: EmailExtras) {
  const prenom = val(body, "prenom");
  const nom = val(body, "nom");
  const hello = prenom || nom || "Madame, Monsieur";
  const cert = plain(data.site.sousTitreOfficiel);
  const hasPhoto = (extras?.attachments ?? []).some((f) => /photo/i.test(f.label) || /photo/i.test(f.filename));
  const hasCv = (extras?.attachments ?? []).some((f) => /^cv$/i.test(f.label) || /^cv\b/i.test(f.filename));
  const site = BRAND.url.replace(/\/$/, "");

  if (type === "candidature") {
    const subject = `Réception de votre candidature · ${cert}`;
    const docsLine = hasCv
      ? hasPhoto
        ? "Nous avons bien reçu votre dossier, y compris votre <strong>CV</strong> et votre <strong>photo</strong>."
        : "Nous avons bien reçu votre dossier, y compris votre <strong>CV</strong>. Si vous le souhaitez, vous pouvez encore nous transmettre une <strong>photo numérique</strong> en répondant à cet e-mail."
      : "Afin de finaliser votre dossier, merci de nous transmettre <strong>votre CV</strong> ainsi qu’une <strong>photo numérique</strong> en répondant à cet e-mail.";

    const text = [
      `Bonjour ${hello},`,
      "",
      `Nous avons le plaisir de vous confirmer la réception de votre candidature au ${cert}.`,
      "",
      hasCv
        ? hasPhoto
          ? "Nous avons bien reçu votre dossier, y compris votre CV et votre photo."
          : "Nous avons bien reçu votre dossier, y compris votre CV. Si vous le souhaitez, vous pouvez encore nous transmettre une photo numérique en répondant à cet e-mail."
        : "Afin de finaliser votre dossier, merci de nous transmettre votre CV ainsi qu’une photo numérique en répondant à cet e-mail.",
      "",
      "Une fois le dossier complet, notre équipe étudie votre éligibilité. La réponse vous est communiquée sous deux jours ouvrés.",
      "",
      "Un membre de notre équipe vous contactera prochainement par téléphone pour confirmer votre inscription et répondre à vos éventuelles questions.",
      "",
      "Nous restons à votre disposition pour toute information complémentaire.",
      "",
      "Cordialement,",
      "Groupe ISCAE & BDO Maroc",
      site,
    ].join("\n");

    const bodyHtml = `
              <p style="margin:0 0 16px;">
                Nous avons le plaisir de vous confirmer la réception de votre candidature au
                <strong>${esc(cert)}</strong>.
              </p>
              <p style="margin:0 0 16px;">
                ${docsLine}
              </p>
              <p style="margin:0 0 16px;">
                Une fois le dossier complet, notre équipe étudie votre éligibilité.
                La réponse vous est communiquée sous <strong>deux jours ouvrés</strong>.
              </p>
              <p style="margin:0 0 16px;">
                Un membre de notre équipe vous <strong>contactera</strong> prochainement par
                <strong>téléphone pour confirmer votre inscription</strong> et répondre à vos éventuelles questions.
              </p>
              <p style="margin:0 0 28px;">
                Nous restons à votre disposition pour toute <strong>information complémentaire</strong>.
              </p>
              <p style="margin:0;line-height:1.55;">
                Cordialement,<br />
                <strong>Groupe ISCAE &amp; BDO Maroc</strong>
              </p>`;

    const html = applicantEmailShell({
      subject,
      badge: "Confirmation",
      title: "Candidature bien reçue",
      lead: "Votre dossier est entre les mains de l’équipe pédagogique ISCAE × BDO.",
      bodyHtml,
      hello,
    });

    return { subject, html, text };
  }

  // Shorter receipts for lead forms
  const titles: Record<string, { subject: string; title: string; body: string; badge: string; lead: string }> = {
    rappel: {
      subject: "Votre demande de rappel est enregistrée",
      title: "Demande de rappel reçue",
      badge: "Rappel",
      lead: "Nous vous rappelons sous 24 heures ouvrées.",
      body: "Un membre de l’équipe vous appelle sous 24 heures ouvrées pour répondre à votre question.",
    },
    session: {
      subject: "Votre place à la session d’information est réservée",
      title: "Inscription confirmée",
      badge: "Session",
      lead: "Votre place à la session d’information est réservée.",
      body: "Le lien de connexion vous sera envoyé la veille de la session.",
    },
    document: {
      subject: "Votre document CFO 4.0",
      title: "Document demandé",
      badge: "Document",
      lead: "Votre demande de document a bien été enregistrée.",
      body: "Le document demandé est disponible depuis la page de confirmation. Pour toute question, répondez à cet e-mail.",
    },
  };
  const copy = titles[type] ?? {
    subject: "Votre demande est enregistrée",
    title: "Demande reçue",
    badge: "CFO 4.0",
    lead: "Nous avons bien reçu votre message.",
    body: "Nous revenons vers vous rapidement.",
  };
  const subject = `[CFO 4.0] ${copy.subject}`;
  const text = [
    `Bonjour ${hello},`,
    "",
    copy.body,
    "",
    "Cordialement,",
    "Groupe ISCAE & BDO Maroc",
    site,
  ].join("\n");
  const bodyHtml = `
              <p style="margin:0 0 24px;">${esc(copy.body)}</p>
              <p style="margin:0;">Cordialement,<br /><strong>Groupe ISCAE &amp; BDO Maroc</strong></p>`;
  const html = applicantEmailShell({
    subject,
    badge: copy.badge,
    title: copy.title,
    lead: copy.lead,
    bodyHtml,
    hello,
  });
  return { subject, html, text };
}
