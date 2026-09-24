import type { Metadata } from "next";
import Link from "next/link";
import { LegalDoc } from "@/components/LegalDoc";
import { BRAND, data } from "@/lib/content";
import { plain } from "@/lib/text";

export const metadata: Metadata = {
  title: "Conditions générales d’utilisation",
  description: "Conditions générales d’utilisation du site du certificat CFO 4.0 — ISCAE × BDO.",
};

export default function CguPage() {
  const email = plain(data.site.contact.email);
  const host = BRAND.url.replace(/^https?:\/\//, "");

  return (
    <LegalDoc
      currentPath="/cgu"
      title="Conditions générales d’utilisation"
      lead={
        <>
          Accès et usage du site{" "}
          <a href={BRAND.url}>{host}</a>, édité conjointement par le Groupe ISCAE et BDO Maroc.
        </>
      }
      sections={[
        {
          id: "objet",
          title: "Objet du site",
          body: (
            <p>
              Le site présente le certificat {data.site.sousTitreOfficiel}, permet de déposer une
              candidature, de demander un rappel ou d’obtenir les publications associées
              (brochure, Baromètre, livre blanc).
            </p>
          ),
        },
        {
          id: "usage",
          title: "Usage",
          body: (
            <p>
              L’utilisateur s’engage à fournir des informations exactes dans les formulaires et à
              n’utiliser le site qu’à des fins légitimes liées au programme. Tout usage abusif,
              frauduleux ou contraire à la réglementation marocaine est interdit.
            </p>
          ),
        },
        {
          id: "propriete",
          title: "Propriété intellectuelle",
          body: (
            <p>
              Les contenus du site (textes, visuels, marques, documents téléchargeables) restent la
              propriété de leurs titulaires respectifs. Toute reproduction non autorisée est
              interdite.
            </p>
          ),
        },
        {
          id: "donnees",
          title: "Données personnelles",
          body: (
            <p>
              Le traitement des données personnelles est décrit dans la{" "}
              <Link href="/confidentialite">politique de confidentialité</Link>.
            </p>
          ),
        },
        {
          id: "contact",
          title: "Contact",
          body: (
            <p>
              Pour toute question relative aux présentes CGU :{" "}
              <a href={`mailto:${email}`}>{email}</a>.
            </p>
          ),
        },
      ]}
    />
  );
}
