import { formTypeLabel, readableFields } from "@/lib/emails";
import type { Submission } from "@/lib/submissions";

/**
 * Appends the submission to the Google Sheet through the Apps Script web app
 * (scripts/google-sheet.gs). One tab per form type; headers are created on first row.
 */
export async function pushToSheet(sub: Submission, siteUrl: string) {
  const url = process.env.SHEETS_WEBHOOK_URL?.trim();
  if (!url) return;

  const date = new Date(sub.createdAt).toLocaleString("fr-FR", { timeZone: "Africa/Casablanca" });
  const row: Record<string, string> = { Date: date, Référence: sub.id };
  for (const f of readableFields(sub.type, sub.fields)) row[f.label] = f.value;
  for (const f of sub.files) {
    row[f.label] = `${siteUrl}/api/admin/files/${sub.id}/${encodeURIComponent(f.filename)}`;
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret: process.env.SHEETS_WEBHOOK_SECRET || "", sheet: formTypeLabel(sub.type), row }),
    redirect: "follow",
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`sheet_http_${res.status}`);
  const json = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
  if (json && json.ok === false) throw new Error(json.error || "sheet_error");
}
