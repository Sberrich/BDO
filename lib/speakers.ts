import type { SpeakerSession } from "@/components/SpeakerProfile";
import { allSessions } from "@/lib/content";
import { plain, seminarImage, seminarPath, sessionCode, sessionLabel } from "@/lib/text";

export function sessionsBySpeaker() {
  const map = new Map<string, SpeakerSession[]>();
  for (const s of allSessions()) {
    for (const slug of s.intervenants ?? []) {
      const code = sessionCode(s);
      const list = map.get(slug) ?? [];
      list.push({
        code: /^\d+$/.test(code) ? `S${Number(code)}` : code,
        titre: plain(s.titre),
        label: sessionLabel(s),
        when: [plain(s.dates), plain(s.horaire)].filter(Boolean).join(" · "),
        image: seminarImage(s.numero),
        href: seminarPath(s),
      });
      map.set(slug, list);
    }
  }
  return map;
}
