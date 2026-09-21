import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { HomeSections } from "@/components/HomeSections";
import { getIntervenants, getIntervenantsPage } from "@/lib/cms";
import { data } from "@/lib/content";

export const metadata: Metadata = {
  title: `${data.site.nom} — ${data.site.sousTitreOfficiel} | ISCAE × BDO`,
  description: data.site.promesse.sousTitre,
};

export default async function HomePage() {
  const [{ chapeau }, intervenants] = await Promise.all([getIntervenantsPage(), getIntervenants()]);

  return (
    <>
      <Hero />
      <HomeSections speakers={intervenants} speakersLead={chapeau} />
    </>
  );
}
