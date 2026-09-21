import { config, fields, collection, singleton } from "@keystatic/core";

export default config({
  storage: {
    kind: "local",
  },
  ui: {
    brand: { name: "CFO 4.0 CMS" },
  },
  singletons: {
    insightsPage: singleton({
      label: "Insights — page",
      path: "content/insights-page",
      schema: {
        chapeau: fields.text({
          label: "Chapeau",
          multiline: true,
        }),
      },
    }),
    intervenantsPage: singleton({
      label: "Intervenants — page",
      path: "content/intervenants-page",
      schema: {
        chapeau: fields.text({
          label: "Chapeau",
          multiline: true,
        }),
      },
    }),
  },
  collections: {
    insights: collection({
      label: "Insights",
      slugField: "titre",
      path: "content/insights/*",
      schema: {
        titre: fields.slug({ name: { label: "Titre" } }),
        category: fields.select({
          label: "Catégorie",
          options: [
            { label: "Baromètre", value: "Baromètre" },
            { label: "Livre blanc", value: "Livre blanc" },
            { label: "Méthode", value: "Méthode" },
            { label: "Pédagogie", value: "Pédagogie" },
          ],
          defaultValue: "Méthode",
        }),
        kicker: fields.text({ label: "Kicker" }),
        date: fields.date({ label: "Date" }),
        dateLabel: fields.text({ label: "Date affichée" }),
        lecture: fields.text({ label: "Temps de lecture", defaultValue: "5 min" }),
        resume: fields.text({ label: "Résumé", multiline: true }),
        corps: fields.array(fields.text({ label: "Paragraphe", multiline: true }), {
          label: "Corps",
          itemLabel: (props) => props.value?.slice(0, 48) || "Paragraphe",
        }),
        source: fields.text({ label: "Source", multiline: true }),
        relatedDoc: fields.select({
          label: "Document lié",
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
      schema: {
        nom: fields.slug({ name: { label: "Nom" } }),
        fonction: fields.text({ label: "Fonction" }),
        institution: fields.text({ label: "Institution" }),
        photo: fields.text({
          label: "Photo (chemin public ou slug)",
          description: "Ex. assets/img/zakaria-fahim.jpeg — résolu via personPhoto()",
        }),
        bio: fields.text({ label: "Biographie", multiline: true }),
        linkedin: fields.url({ label: "LinkedIn" }),
        seminaires: fields.array(fields.integer({ label: "N° séminaire" }), {
          label: "Séminaires",
          itemLabel: (props) => (props.value != null ? `Séminaire ${props.value}` : "Séminaire"),
        }),
      },
    }),
  },
});
