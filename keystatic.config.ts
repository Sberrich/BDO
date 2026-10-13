import { createElement } from "react";
import { config, fields, collection, singleton } from "@keystatic/core";

function BrandMark({ colorScheme }: { colorScheme: "light" | "dark" }) {
  return createElement(
    "svg",
    { width: 28, height: 28, viewBox: "0 0 28 28", "aria-hidden": true },
    createElement("rect", {
      width: 28,
      height: 28,
      rx: 7,
      fill: colorScheme === "dark" ? "#e30613" : "#00264a",
    }),
    createElement(
      "text",
      {
        x: 14,
        y: 18.5,
        textAnchor: "middle",
        fontSize: 11,
        fontWeight: 800,
        fontFamily: "system-ui, sans-serif",
        fill: "#fff",
      },
      "4.0",
    ),
  );
}

const halfDay = (label: string) =>
  fields.object(
    {
      matin: fields.text({ label: "Matin", multiline: true }),
      apresMidi: fields.text({ label: "Après-midi", multiline: true }),
    },
    { label },
  );

function sessionSchema() {
  return {
    numero: fields.integer({
      label: "Numéro",
      description: "0 pour la conférence inaugurale. Sert à l’ordre et au code affiché (01, 02…).",
      validation: { isRequired: true, min: 0 },
    }),
    code: fields.text({
      label: "Code affiché",
      description:
        "Laisser vide pour afficher le numéro (01, 02…). « WS » = workshop, « CL » = séance de clôture, ou un code libre (ex. 06).",
      validation: { length: { max: 3 } },
    }),
    slug: fields.text({
      label: "Adresse de la page",
      description: "Ex. big-data-data-analytics → /seminaires/big-data-data-analytics. Ne pas modifier après publication.",
      validation: { length: { min: 1 } },
    }),
    titre: fields.text({ label: "Titre", validation: { length: { min: 1 } } }),
    sousTitre: fields.text({ label: "Sous-titre" }),
    dates: fields.text({ label: "Date", description: "Ex. « Samedi 31 octobre 2026 »." }),
    horaire: fields.text({ label: "Horaire", description: "Ex. « 9 h – 16 h »." }),
    heures: fields.integer({ label: "Durée (heures)" }),
    lieu: fields.text({
      label: "Lieu",
      description: "Laisser vide pour « Campus ISCAE Casablanca ».",
    }),
    objectif: fields.text({ label: "Objectif", multiline: true }),
    jour1: halfDay("Notions clés"),
    jour2: halfDay("Approfondissement"),
    livrable: fields.text({
      label: "Livrable",
      description: "La pièce du projet produite pendant la séance.",
      multiline: true,
    }),
    actualisation: fields.text({ label: "Note d’actualisation", multiline: true }),
    intervenants: fields.array(
      fields.relationship({ label: "Intervenant", collection: "intervenants" }),
      {
        label: "Intervenants",
        itemLabel: (props) => props.value ?? "Choisir un intervenant",
      },
    ),
  };
}

/** NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO="owner/repo" saves edits as Git commits instead of local files. */
const githubRepo = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO as `${string}/${string}` | undefined;

export default config({
  storage: githubRepo ? { kind: "github", repo: githubRepo } : { kind: "local" },
  locale: "fr-FR",
  ui: {
    brand: { name: "CFO 4.0 · Éditeur", mark: BrandMark },
    navigation: {
      Programme: ["programme"],
      Intervenants: ["intervenants", "intervenantsPage"],
      Insights: ["insights", "insightsPage"],
      FAQ: ["faq"],
    },
  },
  singletons: {
    programme: singleton({
      label: "Programme et séminaires",
      path: "content/programme",
      format: { data: "json" },
      schema: {
        inaugurale: fields.object(sessionSchema(), { label: "Conférence inaugurale" }),
        seminaires: fields.array(fields.object(sessionSchema()), {
          label: "Séances",
          description: "Dans l’ordre du calendrier.",
          itemLabel: (props) => {
            const { numero, code, titre } = props.fields;
            const prefix = code.value || String(numero.value ?? "").padStart(2, "0");
            return `${prefix} · ${titre.value || "Nouvelle séance"}`;
          },
        }),
      },
    }),
    faq: singleton({
      label: "Questions fréquentes",
      path: "content/faq",
      format: { data: "json" },
      schema: {
        groupes: fields.array(
          fields.object({
            id: fields.text({ label: "Identifiant", description: "Ex. programme. Sans espace ni accent." }),
            titre: fields.text({ label: "Thème", validation: { length: { min: 1 } } }),
            questions: fields.array(
              fields.object({
                id: fields.text({
                  label: "Identifiant",
                  description: "Sert de lien direct (/faq#identifiant). Ne pas modifier après publication.",
                }),
                q: fields.text({ label: "Question", validation: { length: { min: 1 } } }),
                court: fields.text({
                  label: "Réponse courte",
                  description: "Une à deux phrases, affichées en premier.",
                  multiline: true,
                }),
                r: fields.text({
                  label: "Réponse détaillée",
                  description:
                    "Chaque paragraphe entre <p> et </p>. Gras : <strong>…</strong>. Ne pas utiliser d’autres balises.",
                  multiline: true,
                }),
                lien: fields.object(
                  {
                    texte: fields.text({ label: "Texte du lien" }),
                    href: fields.text({ label: "Adresse", description: "Ex. programme.html#projet" }),
                  },
                  { label: "Lien en bas de réponse (facultatif)" },
                ),
                accueil: fields.checkbox({
                  label: "Afficher sur la page d’accueil",
                  defaultValue: false,
                }),
              }),
              {
                label: "Questions",
                itemLabel: (props) => props.fields.q.value || "Nouvelle question",
              },
            ),
          }),
          {
            label: "Thèmes",
            itemLabel: (props) =>
              `${props.fields.titre.value || "Nouveau thème"} (${props.fields.questions.elements.length})`,
          },
        ),
        relance: fields.object(
          {
            titre: fields.text({ label: "Titre" }),
            texte: fields.text({ label: "Texte", multiline: true }),
          },
          { label: "Encadré « Votre question n’est pas là ? »" },
        ),
      },
    }),
    insightsPage: singleton({
      label: "Page Insights — introduction",
      path: "content/insights-page",
      schema: {
        chapeau: fields.text({
          label: "Chapeau",
          description: "Texte affiché sous le titre de la page /insights.",
          multiline: true,
          validation: { length: { min: 1, max: 280 } },
        }),
      },
    }),
    intervenantsPage: singleton({
      label: "Page Intervenants — introduction",
      path: "content/intervenants-page",
      schema: {
        chapeau: fields.text({
          label: "Chapeau",
          description: "Texte affiché sous le titre de la page /intervenants.",
          multiline: true,
          validation: { length: { min: 1, max: 280 } },
        }),
      },
    }),
  },
  collections: {
    insights: collection({
      label: "Articles Insights",
      slugField: "titre",
      path: "content/insights/*",
      columns: ["category", "date"],
      schema: {
        titre: fields.slug({
          name: {
            label: "Titre",
            description: "Titre de l’article. L’adresse de la page (slug) en est dérivée.",
            validation: { length: { min: 1, max: 120 } },
          },
        }),
        category: fields.select({
          label: "Catégorie",
          description: "Sert aux filtres de la page Insights.",
          options: [
            { label: "Baromètre", value: "Baromètre" },
            { label: "Livre blanc", value: "Livre blanc" },
            { label: "Méthode", value: "Méthode" },
            { label: "Pédagogie", value: "Pédagogie" },
          ],
          defaultValue: "Méthode",
        }),
        kicker: fields.text({
          label: "Surtitre",
          description: "Petit texte au-dessus du titre. Ex. « Baromètre BDO des DAF ».",
        }),
        date: fields.date({
          label: "Date de publication",
          description: "L’article le plus récent est mis « À la une ».",
          validation: { isRequired: true },
        }),
        dateLabel: fields.text({
          label: "Date affichée",
          description: "Format lisible. Ex. « 12 nov. 2026 ».",
        }),
        lecture: fields.text({ label: "Temps de lecture", defaultValue: "5 min" }),
        resume: fields.text({
          label: "Résumé",
          description: "2 à 3 phrases, affichées sur les cartes et en tête d’article.",
          multiline: true,
          validation: { length: { min: 1, max: 400 } },
        }),
        corps: fields.array(fields.text({ label: "Paragraphe", multiline: true }), {
          label: "Corps de l’article",
          description: "Un élément par paragraphe.",
          itemLabel: (props) => props.value?.slice(0, 60) || "Paragraphe",
        }),
        source: fields.text({
          label: "Source",
          description: "Référence citée en bas de l’article.",
          multiline: true,
        }),
        relatedDoc: fields.select({
          label: "Document lié",
          description: "Document proposé en fin d’article.",
          options: [
            { label: "Brochure", value: "brochure" },
            { label: "Baromètre", value: "barometre" },
            { label: "Livre blanc", value: "livreblanc" },
          ],
          defaultValue: "brochure",
        }),
      },
    }),
    intervenants: collection({
      label: "Intervenants",
      slugField: "nom",
      path: "content/intervenants/*",
      columns: ["fonction", "institution", "ordre"],
      schema: {
        nom: fields.slug({
          name: {
            label: "Nom",
            description: "L’identifiant (slug) sert aux liens avec les séminaires : ne pas le modifier après publication.",
            validation: { length: { min: 1 } },
          },
        }),
        fonction: fields.text({ label: "Fonction" }),
        institution: fields.text({ label: "Institution" }),
        photo: fields.text({
          label: "Photo",
          description: "Chemin public de l’image. Ex. /images/people/zakaria-fahim.jpg",
        }),
        bio: fields.text({ label: "Biographie", multiline: true }),
        linkedin: fields.url({ label: "Profil LinkedIn" }),
        initials: fields.text({
          label: "Initiales",
          description: "Affichées à la place de la photo si elle manque. Ex. ZF.",
          validation: { length: { min: 1, max: 3 } },
        }),
        tone: fields.select({
          label: "Couleur de la carte",
          options: [
            { label: "Bleu nuit", value: "navy" },
            { label: "Bleu ISCAE", value: "blue" },
            { label: "Rouge BDO", value: "red" },
            { label: "Ardoise", value: "slate" },
          ],
          defaultValue: "navy",
        }),
        ordre: fields.integer({
          label: "Ordre d’affichage",
          description: "1 = en premier.",
          validation: { isRequired: true, min: 1 },
        }),
        accueil: fields.checkbox({
          label: "Afficher sur la page d’accueil",
          description: "Trois intervenants recommandés.",
          defaultValue: false,
        }),
      },
    }),
  },
});
