import { BRAND, data } from "@/lib/content";
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
  livreblanc: "Livre blanc — La Fonction Financière Augmentée",
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
  return other ? `${label} — ${other}` : label;
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
        row("Nom et prénom", v("nom")),
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

function niveauOf(body: FormPayload) {
  return withAutre(labelOf(NIVEAUX, val(body, "niveau")), val(body, "niveau_autre"));
}

function subtitleOf(type: string, body: FormPayload) {
  return type === "candidature" ? niveauOf(body) : val(body, "fonction");
}

function textFor(type: string, body: FormPayload, extras?: EmailExtras) {
  const meta = META[type] ?? META.rappel;
  const v = (k: string, max?: number) => val(body, k, max);
  const lines = [`${meta.title}`, `—`, `Nom : ${v("nom")}`, `Fonction : ${subtitleOf(type, body)}`, `E-mail : ${v("email")}`];

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
      lines.push("Attention : fichiers non joints à cet e-mail — à demander au candidat.");
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
  const nom = val(body, "nom").replace(/\s+/g, " ") || "Prospect";
  const email = val(body, "email");
  const when = new Date().toLocaleString("fr-MA", {
    timeZone: "Africa/Casablanca",
    dateStyle: "full",
    timeStyle: "short",
  });

  const subject = `[CFO 4.0] ${meta.subject} — ${nom}`;

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
                Certificat exécutif CFO 4.0 — Transformation Digitale et Leadership Financier
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
