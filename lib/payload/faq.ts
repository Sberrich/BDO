import raw from "@/content/faq.json";

export type FaqQuestion = {
  id: string;
  q: string;
  court: string;
  r: string;
  lien?: { texte: string; href: string };
  accueil: boolean;
};

const data = {
  groupes: raw.groupes.map((g) => ({
    id: g.id,
    titre: g.titre,
    questions: g.questions.map(
      (q): FaqQuestion => ({
        id: q.id,
        q: q.q,
        court: q.court,
        r: q.r,
        lien: q.lien.href.trim() ? q.lien : undefined,
        accueil: q.accueil,
      }),
    ),
  })),
  relance: raw.relance,
};
export default data;
