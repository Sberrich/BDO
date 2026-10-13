import raw from "@/content/programme.json";
import type { Seminaire } from "@/lib/content";

type RawSession = (typeof raw)["inaugurale"];
type HalfDays = { matin: string; apresMidi: string };

const opt = (v: string | null | undefined) => v?.trim() || undefined;
const day = (d: HalfDays) => (d.matin.trim() || d.apresMidi.trim() ? d : undefined);

/** Keystatic writes every field; the site treats empty ones as absent. */
function session(s: RawSession): Seminaire {
  return {
    numero: s.numero,
    code: opt(s.code),
    slug: opt(s.slug),
    titre: s.titre,
    sousTitre: s.sousTitre,
    dates: s.dates,
    horaire: opt(s.horaire),
    heures: s.heures ?? undefined,
    lieu: opt(s.lieu),
    objectif: s.objectif,
    jour1: day(s.jour1),
    jour2: day(s.jour2),
    livrable: opt(s.livrable),
    actualisation: opt(s.actualisation),
    intervenants: s.intervenants,
  };
}

const data = {
  inaugurale: session(raw.inaugurale),
  seminaires: (raw.seminaires as RawSession[]).map(session),
};
export default data;
