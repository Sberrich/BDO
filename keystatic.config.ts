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

export default config({
  storage: {
    kind: "local",
  },
  locale: "fr-FR",
  ui: {
    brand: { name: "CFO 4.0 · Éditeur", mark: BrandMark },
    navigation: {
      Contenu: ["videos", "insights", "intervenants"],
      "Textes de page": ["playlistsPage", "insightsPage", "intervenantsPage"],
    },
  },
  singletons: {
    playlistsPage: singleton({
      label: "Page Playlists — introduction",
      path: "content/playlists-page",
      schema: {
        chapeau: fields.text({
          label: "Chapeau",
          description: "Texte affiché sous le titre de la page /playlists.",
          multiline: true,
          validation: { length: { min: 1, max: 280 } },
        }),
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
    videos: collection({
      label: "Vidéos (playlists)",
      slugField: "titre",
      path: "content/videos/*",
      columns: ["playlist", "duree"],
      schema: {
        titre: fields.slug({
          name: {
            label: "Titre",
            description: "Titre de la vidéo ou nom de la personne. Ex. « Zakaria Fahim ».",
            validation: { length: { min: 1, max: 120 } },
          },
        }),
        playlist: fields.text({
          label: "Playlist",
          description:
            "Nom de la playlist. Ex. « Témoignages ». Un nouveau nom crée automatiquement une nouvelle playlist sur le site.",
          defaultValue: "Témoignages",
          validation: { length: { min: 1, max: 60 } },
        }),
        ordre: fields.integer({
          label: "Ordre dans la playlist",
          description: "1 = première vidéo. Les trois premières sont visibles avant « Voir plus ».",
          defaultValue: 1,
        }),
        sousTitre: fields.text({
          label: "Sous-titre",
          description: "Ex. « Managing Partner · BDO Maroc ».",
        }),
        etiquette: fields.text({
          label: "Étiquette",
          description: "Petit texte au-dessus du titre. Ex. « Participant · 2e cohorte ».",
        }),
        fichier: fields.text({
          label: "Fichier vidéo",
          description: "Chemin public du fichier .mp4. Ex. /videos/temoignages/zakaria-fahim.mp4",
          validation: { length: { min: 1 } },
        }),
        poster: fields.text({
          label: "Image de couverture",
          description: "Chemin public de l’image. Ex. /images/temoignages/mouad-laghiti-cover.jpg",
        }),
        duree: fields.text({ label: "Durée", description: "Ex. « 2 min 34 » ou « 45 s »." }),
        langue: fields.select({
          label: "Langue",
          options: [
            { label: "Français", value: "FR" },
            { label: "Anglais", value: "EN" },
            { label: "Arabe", value: "AR" },
          ],
          defaultValue: "FR",
        }),
        date: fields.date({
          label: "Date de publication",
          description: "Sert au tri « Plus récent » de la page Playlists.",
        }),
        resume: fields.text({
          label: "Résumé",
          description: "Une ou deux phrases, facultatif.",
          multiline: true,
          validation: { length: { max: 300 } },
        }),
      },
    }),
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
      columns: ["fonction", "institution"],
      schema: {
        nom: fields.slug({
          name: {
            label: "Nom",
            description:
              "Le slug doit correspondre à un intervenant existant du site (ex. zakaria-fahim) pour que la fiche soit mise à jour.",
            validation: { length: { min: 1 } },
          },
        }),
        fonction: fields.text({ label: "Fonction" }),
        institution: fields.text({ label: "Institution" }),
        photo: fields.text({
          label: "Photo",
          description: "Chemin public de l’image. Ex. /images/people/zakaria-fahim-grey.png (PNG détouré, fond transparent)",
        }),
        bio: fields.text({ label: "Biographie", multiline: true }),
        linkedin: fields.url({ label: "Profil LinkedIn" }),
        seminaires: fields.array(fields.integer({ label: "N° séminaire" }), {
          label: "Séminaires animés",
          itemLabel: (props) => (props.value != null ? `Séminaire ${props.value}` : "Séminaire"),
        }),
      },
    }),
  },
});
