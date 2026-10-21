import { NextResponse } from "next/server";
import { getPlaylistViews, incrementPlaylistView } from "@/lib/playlist-views";

export async function GET() {
  const views = await getPlaylistViews();
  return NextResponse.json({ views });
}

export async function POST(req: Request) {
  let id = "";
  try {
    const body = (await req.json()) as { id?: string };
    id = String(body?.id ?? "").trim();
  } catch {
    return NextResponse.json({ ok: false, message: "Requête invalide." }, { status: 400 });
  }
  if (!id || id.length > 80) {
    return NextResponse.json({ ok: false, message: "Identifiant manquant." }, { status: 400 });
  }
  const count = await incrementPlaylistView(id);
  return NextResponse.json({ ok: true, id, count });
}
