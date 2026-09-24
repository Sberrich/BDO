import type { Metadata } from "next";
import Link from "next/link";
import { LegalDoc } from "@/components/LegalDoc";
import { BRAND, data } from "@/lib/content";
import { plain } from "@/lib/text";

export const metadata: Metadata = { title: "Mentions légales" };

export default function MentionsPage() {
  const c = data.site.contact;
  const lg = data.site.conformite;
  const email = plain(c.email);

  return (
    <LegalDoc
      currentPath="/mentions-legales"
      title="Mentions légales"
      lead="Éditeur, hébergement et cadre juridique du site du certificat CFO 4.0 — Groupe ISCAE × BDO Maroc."
      sections={[
        {
          id: "editeur",
          title: "Éditeur du site",
          body: (
            <>
              <p>
                Site édité conjointement par le <strong>Groupe ISCAE</strong> et{" "}
                <strong>BDO Maroc</strong>, dans le cadre du certificat {data.site.nom} —{" "}
                {data.site.sousTitreOfficiel}.
              </p>
              <p>{c.adresseIscae}</p>
              <p>
                Contact :{" "}
                <a href={`mailto:${email}`}>{email}</a>
                {" · "}
                <a href={BRAND.phoneHref}>{plain(c.telephone)}</a>
              </p>
            </>
          ),
        },
        {
          id: "objet",
          title: "Objet du site",
          body: (
            <p>
              Le site présente le programme, le calendrier, les admissions et les publications
              associées au certificat. Il permet de candidater, de demander un rappel ou de
              télécharger la brochure et les documents BDO.
            </p>
          ),
        },
        {
          id: "donnees",
          title: "Données personnelles",
          body: (
            <p>
              Le traitement relève de la {lg.loi}. {plain(lg.declaration)} Consultez la{" "}
              <Link href="/confidentialite">politique de protection des données</Link>.
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
      ]}
    />
  );
}
