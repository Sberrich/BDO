import type { Metadata } from "next";
import { InsightsExplorer } from "@/components/InsightsExplorer";
import { PageHero } from "@/components/ui";
import { data } from "@/lib/content";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Analyses et lectures sur la transformation de la fonction finance — Baromètre BDO des DAF, livre blanc et méthode du certificat CFO 4.0.",
};

export default function InsightsPage() {
  const { chapeau, categories, articles } = data.insights;
  return (
    <>
      <PageHero kicker="Insights" title="Insights & analyses" lead={chapeau} />
      <InsightsExplorer categories={categories} articles={articles} />
    </>
  );
}
