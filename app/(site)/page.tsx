import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { HomeSections } from "@/components/HomeSections";
import { getIntervenants, getIntervenantsPage, getVideos } from "@/lib/cms";
import { data } from "@/lib/content";
import { groupPlaylists } from "@/lib/playlists";

export const metadata: Metadata = {
  title: { absolute: `${data.site.nom} · ${data.site.sousTitreOfficiel} | ISCAE × BDO` },
  description: data.site.promesse.sousTitre,
};

export default async function HomePage() {
  const [{ chapeau }, intervenants, videos] = await Promise.all([
    getIntervenantsPage(),
    getIntervenants(),
    getVideos(),
  ]);

  return (
    <>
      <Hero />
      <HomeSections speakers={intervenants} speakersLead={chapeau} playlists={groupPlaylists(videos)} />
    </>
  );
}
