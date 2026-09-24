import type { Intervenant } from "@/lib/cms";
import { personPhoto } from "@/lib/text";

export type Campus = "Rabat" | "Casablanca";

export type FacultyShowcasePerson = {
  slug: string;
  nom: string;
  fonction: string;
  institution: string;
  campus: Campus;
  photo?: string;
  linkedin?: string;
  bio?: string;
  initials: string;
  tone: "navy" | "blue" | "red" | "slate";
};

/** Featured on the homepage (exactly 3). */
export const HOME_FACULTY_SLUGS = ["zakaria-fahim", "ismail-lahsini", "antonio-gomes"] as const;

/** Full roster. Zouheir Lakhdissi intentionally omitted. */
const ROSTER: FacultyShowcasePerson[] = [
  {
    slug: "zakaria-fahim",
    nom: "Zakaria Fahim",
    fonction: "Managing Partner – Head of Advisory",
    institution: "BDO Maroc",
    campus: "Casablanca",
    linkedin: "https://www.linkedin.com/in/zakaria-fahim-97286928",
    photo: "/images/people/zakaria-fahim.jpg",
    bio: "Associé gérant de BDO Maroc, Zakaria Fahim accompagne les directions générales et financières sur leurs opérations de transformation. Il est à l’origine du Baromètre BDO des DAF et du Trophée BDO des CFOs, et intervient sur le workshop de management digital et sur le jury de soutenance.",
    initials: "ZF",
    tone: "red",
  },
  {
    slug: "ismail-lahsini",
    nom: "Ismaïl Lahsini",
    fonction: "Directeur général",
    institution: "Meducate",
    campus: "Rabat",
    linkedin: "https://www.linkedin.com/in/lahsini",
    photo: "/images/people/ismail-lahsini.jpeg",
    bio: "Ismaïl Lahsini dirige Meducate et intervient sur la transformation de la fonction finance. Membre du jury du Trophée BDO des CFOs, il contribue aux séminaires data et à la soutenance.",
    initials: "IL",
    tone: "blue",
  },
  {
    slug: "antonio-gomes",
    nom: "Antonio Gomes",
    fonction: "Expert en intelligence artificielle appliquée à la finance",
    institution: "Maltem Africa",
    campus: "Casablanca",
    linkedin: "https://www.linkedin.com/in/onchainantonio",
    initials: "AG",
    tone: "navy",
  },
  {
    slug: "abdeljaouad-benhaddou",
    nom: "Abdeljaouad Benhaddou",
    fonction: "Dirigeant de bSuccess · Chargé de mission auprès du DG",
    institution: "Lydec",
    campus: "Casablanca",
    photo: "/images/people/abdeljaouad-benhaddou.png",
    bio: "Abdeljaouad Benhaddou, dirigeant de bSuccess et chargé de mission auprès du DG de Lydec, est membre du jury du Trophée BDO des CFOs. Il contribue aux séminaires Blockchain et Crypto-actifs du certificat.",
    initials: "AB",
    tone: "slate",
  },
  {
    slug: "hanaa-elmardi",
    nom: "Hanaa El Mardi",
    fonction: "Fondatrice et dirigeante",
    institution: "ADLES",
    campus: "Casablanca",
    photo: "/images/people/hanaa-elmardi.jpg",
    bio: "Hanaa El Mardi, fondatrice et dirigeante d’ADLES, siège au jury du Trophée BDO des CFOs. Elle apporte au certificat une expertise de conduite du changement et de transformation digitale.",
    initials: "HE",
    tone: "blue",
  },
  {
    slug: "nasser-kettani",
    nom: "Nasser Kettani",
    fonction: "Associé · Cloud & automatisation financière",
    institution: "BDO Maroc",
    campus: "Casablanca",
    bio: "Nasser Kettani accompagne les directions financières sur la migration cloud, la planification budgétaire et la robotisation des reportings. Il intervient sur le séminaire Cloud du certificat.",
    initials: "NK",
    tone: "blue",
  },
  {
    slug: "saad-mohamed",
    nom: "Saad Mohamed",
    fonction: "Expert · Cash management & IoT",
    institution: "BDO Maroc",
    campus: "Casablanca",
    bio: "Saad Mohamed conseille les directions financières sur l’optimisation du cycle de trésorerie, les plateformes de cash management et l’apport de l’IoT au besoin en fonds de roulement.",
    initials: "SM",
    tone: "navy",
  },
  {
    slug: "jawad-benheddou",
    nom: "Jawad Benheddou",
    fonction: "Expert · Cybersécurité financière",
    institution: "Naoris",
    campus: "Casablanca",
    bio: "Jawad Benheddou intervient sur les menaces visant la fonction finance, la sécurisation des règlements et la construction de matrices de risques numériques. Il représente l’expertise Naoris au sein du certificat.",
    initials: "JB",
    tone: "red",
  },
];

function mergeCms(person: FacultyShowcasePerson, cms: Intervenant[]): FacultyShowcasePerson {
  const hit = cms.find((p) => p.slug === person.slug);
  if (!hit) return person;
  return {
    ...person,
    nom: hit.nom || person.nom,
    fonction: hit.fonction || person.fonction,
    institution: hit.institution || person.institution,
    linkedin: hit.linkedin || person.linkedin,
    photo: hit.photo || person.photo,
    bio: hit.bio || person.bio,
  };
}

export function facultyShowcase(cms: Intervenant[] = []): FacultyShowcasePerson[] {
  return ROSTER.map((p) => mergeCms(p, cms));
}

export function facultyHome(cms: Intervenant[] = []): FacultyShowcasePerson[] {
  const all = facultyShowcase(cms);
  return HOME_FACULTY_SLUGS.map((slug) => all.find((p) => p.slug === slug)).filter(
    (p): p is FacultyShowcasePerson => Boolean(p),
  );
}

export function campusLabel(campus: Campus) {
  return campus === "Rabat" ? "Campus ISCAE Rabat" : "Campus ISCAE Casablanca";
}

export function facultyPhotoSrc(p: FacultyShowcasePerson) {
  if (p.photo?.startsWith("/")) return p.photo;
  return personPhoto(p.photo, p.slug);
}

export function facultyHasPhoto(p: FacultyShowcasePerson) {
  const src = facultyPhotoSrc(p);
  return Boolean(src) && !src.includes("portrait.svg");
}
