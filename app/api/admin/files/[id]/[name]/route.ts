import { NextRequest, NextResponse } from "next/server";
import { CMS_COOKIE, hasAdminSession } from "@/lib/cms-session";
import { extensionOf } from "@/lib/candidature";
import { readSubmissionFile } from "@/lib/submissions";

const TYPES: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
};

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string; name: string }> }) {
  if (!(await hasAdminSession(request.cookies.get(CMS_COOKIE)?.value))) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }
  const { id, name } = await params;
  const found = await readSubmissionFile(id, decodeURIComponent(name));
  if (!found) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const ext = extensionOf(found.file.filename);
  const inline = ext === "pdf" || ext === "png" || ext === "jpg" || ext === "jpeg";
  return new NextResponse(new Uint8Array(found.content), {
    headers: {
      "Content-Type": TYPES[ext] ?? "application/octet-stream",
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${found.file.filename}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
