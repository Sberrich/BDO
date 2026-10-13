import { NextRequest, NextResponse } from "next/server";
import { CMS_COOKIE, hasAdminSession, publicUrl } from "@/lib/cms-session";
import { FORM_TYPES, formTypeLabel, readableFields } from "@/lib/emails";
import { listSubmissions } from "@/lib/submissions";

function cell(v: string) {
  const isPhone = /^\+[\d\s().-]+$/.test(v);
  const safe = !isPhone && /^[=+\-@]/.test(v) ? `'${v}` : v;
  return /[";\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

/** Semicolon-separated CSV with BOM so Excel (French locale) opens it with accents and columns intact. */
export async function GET(request: NextRequest) {
  if (!(await hasAdminSession(request.cookies.get(CMS_COOKIE)?.value))) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }
  const type = request.nextUrl.searchParams.get("type") ?? "candidature";
  if (!(FORM_TYPES as readonly string[]).includes(type)) {
    return NextResponse.json({ error: "Unknown type." }, { status: 400 });
  }

  const site = publicUrl("/", request).origin;
  const rows = (await listSubmissions()).filter((s) => s.type === type);
  const fieldLabels = readableFields(type, {}).map((f) => f.label);
  const fileLabels = Array.from(new Set(rows.flatMap((s) => s.files.map((f) => f.label))));
  const header = ["Date", "Référence", ...fieldLabels, ...fileLabels];

  const lines = rows.map((s) => {
    const values = Object.fromEntries(readableFields(type, s.fields).map((f) => [f.label, f.value]));
    const files = Object.fromEntries(
      s.files.map((f) => [f.label, `${site}/api/admin/files/${s.id}/${encodeURIComponent(f.filename)}`]),
    );
    const date = new Date(s.createdAt).toLocaleString("fr-FR", { timeZone: "Africa/Casablanca" });
    return [date, s.id, ...fieldLabels.map((l) => values[l] ?? ""), ...fileLabels.map((l) => files[l] ?? "")];
  });

  const csv = "\uFEFF" + [header, ...lines].map((r) => r.map(cell).join(";")).join("\r\n");
  const stamp = new Date().toISOString().slice(0, 10);
  const name = `cfo40-${formTypeLabel(type).toLowerCase()}-${stamp}.csv`;
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${name}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
