import type { Metadata } from "next";
import { InsightsExplorer } from "@/components/InsightsExplorer";
import { PageHero } from "@/components/ui";
import { getInsightArticles, getInsightsPage, INSIGHT_CATEGORIES } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Analyses et lectures sur la transformation de la fonction finance — Baromètre BDO des DAF, livre blanc et méthode du certificat CFO 4.0.",
};

export default async function InsightsPage() {
  const [{ chapeau }, articles] = await Promise.all([getInsightsPage(), getInsightArticles()]);

  return (
    <>
      <PageHero kicker="Insights" title="Insights & analyses" lead={chapeau} />
      <InsightsExplorer categories={INSIGHT_CATEGORIES} articles={articles} />
    </>
  );
}
