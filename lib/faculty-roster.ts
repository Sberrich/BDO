import type { Intervenant } from "@/lib/cms";
import { personPhoto } from "@/lib/text";

export type FacultyShowcasePerson = {
  slug: string;
  nom: string;
  fonction: string;
  institution: string;
  photo?: string;
  linkedin?: string;
  bio?: string;
  initials: string;
  tone: "navy" | "blue" | "red" | "slate";
};

/** Featured on the homepage (exactly 3). */
export const HOME_FACULTY_SLUGS = ["zakaria-fahim", "abdeljaouad-benhaddou", "nasser-kettani"] as const;

/** Full roster, in the order of the « Intervenants BDO » document. */
const ROSTER: FacultyShowcasePerson[] = [
  {
    slug: "zakaria-fahim",
    nom: "Zakaria Fahim",
    fonction: "Président · Head of Global Advisory",
    institution: "BDO Maroc",
    linkedin: "https://www.linkedin.com/in/zakaria-fahim-97286928",
    photo: "/images/people/zakaria-fahim.jpg",
    bio: "Expert-comptable et commissaire aux comptes, spécialisé en systèmes d’information, en accompagnement des entreprises familiales et de croissance, en transformation digitale et en audit IT. Président de BDO Maroc et Head of Global Advisory, il conseille les organisations en conformité, contrôle interne, audit financier et stratégies de croissance. Il est le fondateur de Hub Africa.",
    initials: "ZF",
    tone: "red",
  },
  {
    slug: "abdeljaouad-benhaddou",
    nom: "Abdeljaouad Benhaddou",
    fonction: "Expert en transformation digitale",
    institution: "",
    photo: "/images/people/abdeljaouad-benhaddou-red.jpg",
    bio: "Consultant senior et docteur en informatique, il cumule plusieurs décennies d’expérience en transformation digitale, architecture des systèmes et systèmes intelligents. Directeur des systèmes d’information pendant plus de 25 ans, expert de la Banque mondiale et fondateur de startup technologique, il anime le workshop « Management digital, aspects entrepreneurial et éthique » et intervient au séminaire de clôture.",
    initials: "AB",
    tone: "slate",
  },
  {
    slug: "david-carvalho",
    nom: "David João Vieira Carvalho",
    fonction: "Fondateur, CEO et Chief Scientist",
    institution: "Naoris Protocol",
    photo: "/images/people/david-carvalho-blue-v2.jpg",
    bio: "Plus de 20 ans d’expérience en cybersécurité, innovation digitale et technologies de pointe. Il dirige le développement de Naoris Protocol, une plateforme de cybersécurité décentralisée fondée sur la blockchain et l’IA, et conseille des startups comme des organismes nationaux sur des enjeux critiques de sécurité numérique. Il intervient sur le séminaire « Cybersécurité décentralisée et souveraineté de la data » et au séminaire de clôture.",
    initials: "DC",
    tone: "navy",
  },
  {
    slug: "youssef-el-maddarsi",
    nom: "Youssef El Maddarsi",
    fonction: "Group CEO",
    institution: "Naoris Consulting",
    photo: "/images/people/youssef-el-maddarsi-red-v2.jpg",
    bio: "Plus de 10 ans d’expérience en développement stratégique, transformation digitale, cybersécurité et innovation technologique. Il pilote chez Naoris Consulting des projets de croissance internationale et de cybersécurité décentralisée, en s’appuyant sur la blockchain et l’architecture post-quantique. Il intervient sur le séminaire « Cybersécurité décentralisée et souveraineté de la data ».",
    initials: "YM",
    tone: "blue",
  },
  {
    slug: "zouheir-lakhdissi",
    nom: "Zouheir Lakhdissi",
    fonction: "Expert en intelligence artificielle",
    institution: "",
    photo: "/images/people/zouheir-lakhdissi-blue-v2.jpg",
    bio: "Plus de 24 ans d’expérience dans les technologies numériques, l’innovation, l’intelligence artificielle et la planification stratégique. Professeur d’université, entrepreneur et consultant international, il a accompagné l’IFC et la BERD sur des projets de transformation digitale, d’architecture d’entreprise et de stratégie IT. Il intervient sur les séminaires « Big data & data analytics » et « I.A : boîte à outils pour le leader financier ».",
    initials: "ZL",
    tone: "navy",
  },
  {
    slug: "zayed-fahim",
    nom: "Zayed Fahim",
    fonction: "Expert en transformation digitale",
    institution: "",
    photo: "/images/people/zayed-fahim-red.jpg",
    bio: "Spécialiste du big data et de l’analyse de données, certifié auditeur principal ISO 27001 et Data Protection Officer. Il a mené de nombreuses missions de contrôle interne, d’audit, de cartographie des risques, de déploiement GRC, CRM et ERP, ainsi que des projets de data warehouse et de Business Intelligence. Il intervient sur les séminaires Big data & data analytics, I.A et cash management.",
    initials: "ZF",
    tone: "slate",
  },
  {
    slug: "ismail-lahsini",
    nom: "Ismaïl Lahsini",
    fonction: "Expert en transformation digitale",
    institution: "",
    linkedin: "https://www.linkedin.com/in/lahsini",
    photo: "/images/people/ismail-lahsini.jpeg",
    bio: "Expert en entrepreneuriat, innovation et transformation digitale, avec plus de 20 années d’expérience terrain auprès de grands comptes publics et privés. Ancien Vice-Président d’ABA Technology, il a dirigé des projets d’innovation dans l’IoT en lien avec des directions financières. Il a formé et coaché plus de 1 500 entrepreneurs et dirigeants.",
    initials: "IL",
    tone: "blue",
  },
  {
    slug: "nasser-kettani",
    nom: "Nasser Kettani",
    fonction: "Expert cloud",
    institution: "",
    photo: "/images/people/nasser-kettani-blue-v2.jpg",
    bio: "Expert international avec plus de 35 ans d’expérience dans les technologies de l’information et la transformation digitale. Délégué à la protection des données certifié (RGPD), il a mené de nombreuses missions en cloud computing, sécurité de l’information, conformité et gouvernance IT, et a occupé des postes de direction dans de grands groupes internationaux. Il intervient sur le séminaire « Cloud et automatisation des tâches ».",
    initials: "NK",
    tone: "blue",
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

export function facultyPhotoSrc(p: FacultyShowcasePerson) {
  if (p.photo?.startsWith("/")) return p.photo;
  return personPhoto(p.photo, p.slug);
}

export function facultyHasPhoto(p: FacultyShowcasePerson) {
  const src = facultyPhotoSrc(p);
  return Boolean(src) && !src.includes("portrait.svg");
}
