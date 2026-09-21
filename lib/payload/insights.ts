const data = {
  chapeau:
    "Analyses, points de vue et lectures pour les directions financières — issues du Baromètre BDO des DAF, du livre blanc et de la méthode du certificat CFO 4.0.",
  trust: [
    { label: "Sources BDO × ISCAE", done: true },
    { label: "Chiffres du Baromètre", done: true },
    { label: "Méthode du certificat", done: true },
  ],
  categories: ["Tout", "Baromètre", "Livre blanc", "Méthode", "Pédagogie"] as const,
  articles: [
    {
      slug: "ecart-feuille-de-route",
      titre: "78 % se transforment. 32 % ont une feuille de route.",
      category: "Baromètre",
      kicker: "Baromètre BDO des DAF",
      date: "2024-11-12",
      dateLabel: "12 nov. 2024",
      lecture: "6 min",
      resume:
        "L’intention de transformation est générale dans les directions financières marocaines. Ce qui manque, ce n’est pas la volonté : c’est une trajectoire chiffrée, défendable devant un comité de direction.",
      corps: [
        "Le Baromètre BDO des DAF 2024, mené auprès de 94 répondants, dessine un paysage paradoxal. Près de huit directions financières sur dix se déclarent engagées dans une transformation. À peine un tiers dispose d’une feuille de route formalisée.",
        "Cet écart n’est pas un détail de méthode. Sans feuille de route, les investissements numériques restent fragmentés : un outil ici, un tableau de bord là, une initiative d’automatisation ailleurs. Le comité de direction ne voit pas de trajectoire ; il voit des projets.",
        "Le certificat CFO 4.0 est conçu exactement pour cet écart. Chaque séminaire produit une brique de la feuille de route — données, IA, cloud, blockchain, trésorerie, cybersécurité — construite sur le cas de votre propre entreprise, puis assemblée et soutenue devant le jury ISCAE × BDO.",
      ],
      source: "Baromètre BDO des DAF et des leaders financiers, 2024, 94 répondants.",
      relatedDoc: "barometre" as const,
    },
    {
      slug: "fonction-financiere-augmentee",
      titre: "La fonction financière augmentée : de l’intention au dossier d’investissement",
      category: "Livre blanc",
      kicker: "Livre blanc",
      date: "2025-03-04",
      dateLabel: "4 mars 2025",
      lecture: "8 min",
      resume:
        "Le livre blanc BDO × Maltem Africa pose le diagnostic : les indicateurs classiques ne suffisent plus. La transformation exige un dossier d’investissement — pas seulement une ambition stratégique.",
      corps: [
        "« La Fonction Financière Augmentée » documente ce que les DAF observent déjà : 97 % estiment les indicateurs classiques insuffisants, 67 % jugent leurs outils inadaptés au pilotage prédictif.",
        "Augmenter la fonction finance, ce n’est pas empiler des technologies. C’est articuler données, cas d’usage d’intelligence artificielle, architecture cloud, gouvernance des risques numériques et conduite du changement — dans un ordre qui tient devant un jury et un budget.",
        "C’est pourquoi le certificat ne délivre pas seulement un diplôme. Il produit un dossier d’investissement : chiffrage, retour attendu, indicateurs de suivi, plan de conduite du changement. La soutenance du séminaire 8 en est l’épreuve.",
      ],
      source: "La Fonction Financière Augmentée, livre blanc BDO × Maltem Africa, 2025.",
      relatedDoc: "livreblanc" as const,
    },
    {
      slug: "ce-que-produit-un-seminaire",
      titre: "Ce que produit un séminaire : une brique, pas une slide",
      category: "Méthode",
      kicker: "Méthode",
      date: "2026-01-20",
      dateLabel: "20 janv. 2026",
      lecture: "5 min",
      resume:
        "Chaque séminaire du certificat CFO 4.0 laisse une trace opératoire sur votre direction financière. Pas un polycopié : une cartographie, un cas d’usage, un schéma cible, une matrice de risques.",
      corps: [
        "Le programme compte huit séminaires plus la conférence inaugurale, répartis sur cinq mois à Rabat. La logique n’est pas encyclopédique. Elle est cumulative.",
        "Séminaire données : cartographie et indicateurs. Séminaire IA : cas d’usage et gouvernance des modèles. Cloud : schéma cible du SI finance. Blockchain, crypto-actifs, cash management, cybersécurité : chacun ajoute une couche. Le séminaire 8 assemble la feuille de route et la fait soutenir.",
        "À l’issue du cycle, le participant n’emporte pas seulement un certificat cosigné ISCAE × BDO. Il emporte un artefact utilisable en comité de direction — construit sur son propre périmètre, pas sur un cas générique.",
      ],
      source: "Programme CFO 4.0 — ISCAE × BDO, session 2026–2027.",
      relatedDoc: "brochure" as const,
    },
    {
      slug: "pourquoi-un-jury",
      titre: "Pourquoi un jury, et pas seulement une attestation de présence",
      category: "Pédagogie",
      kicker: "Pédagogie",
      date: "2026-02-10",
      dateLabel: "10 févr. 2026",
      lecture: "4 min",
      resume:
        "La soutenance devant le jury ISCAE × BDO force la clarté : chiffrage, retour attendu, plan de changement. C’est la différence entre une formation suivie et une transformation engagée.",
      corps: [
        "Un certificat exécutif peut se contenter de l’assiduité. CFO 4.0 exige davantage : au moins 80 % de présence, les évaluations de mi-parcours et de fin de cycle, et une soutenance.",
        "Le jury n’est pas un formalisme. Il simule la situation réelle du DAF : défendre un dossier d’investissement devant des interlocuteurs qui connaissent la finance, le digital et le terrain marocain.",
        "Cette exigence explique aussi le profil attendu : dirigeants et cadres qui décident des moyens de la fonction finance, avec au moins cinq ans d’expérience. Le certificat suppose que vous puissiez porter un chantier dans votre organisation.",
      ],
      source: "Règlement pédagogique du certificat CFO 4.0.",
      relatedDoc: "brochure" as const,
    },
  ],
} as const;

export default data;

export type InsightArticle = (typeof data.articles)[number];
export type InsightCategory = (typeof data.categories)[number];
