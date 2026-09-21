import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { HomeSections } from "@/components/HomeSections";
import { data } from "@/lib/content";

export const metadata: Metadata = {
  title: `${data.site.nom} — ${data.site.sousTitreOfficiel} | ISCAE × BDO`,
  description: data.site.promesse.sousTitre,
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <HomeSections />
    </>
  );
}
