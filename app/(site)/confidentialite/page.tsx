import type { Metadata } from "next";
import { LegalDoc } from "@/components/LegalDoc";
import { BRAND, data } from "@/lib/content";
import { plain } from "@/lib/text";

export const metadata: Metadata = {
  title: "Confidentialité",
  description: "Politique de confidentialité du certificat ISCAE × BDO.",
};

export default function ConfidentialitePage() {
  const lg = data.site.conformite;
  const email = plain(data.site.contact.email);

  return (
    <LegalDoc
      currentPath="/confidentialite"
      title="Politique de confidentialité"
      lead={`Le traitement des données opéré par ce site relève de la ${lg.loi}.`}
      sections={[
        {
          id: "cadre",
          title: "Cadre juridique",
          body: (
            <>
              <p>
                Les traitements sont opérés conformément à la {lg.loi} ({lg.dahir}, publié au{" "}
                {lg.bo}).
              </p>
              <p>{plain(lg.declaration)}</p>
              <p>
                Responsable de traitement : {plain(lg.responsable)}.
              </p>
            </>
          ),
        },
        {
          id: "collecte",
          title: "Données collectées",
          body: (
            <p>
              Candidature, demande de rappel, session d’information et téléchargement de
              publications : identité, fonction, entreprise, e-mail professionnel, et selon le
              formulaire téléphone, projet de transformation et mode de financement.
            </p>
          ),
        },
        {
          id: "finalites",
          title: "Finalités",
          body: (
            <p>{lg.mention}</p>
          ),
        },
        {
          id: "conservation",
          title: "Durée de conservation",
          body: (
            <p>
              Les données sont conservées {lg.conservation}, sauf obligation légale contraire.
            </p>
          ),
        },
        {
          id: "droits",
          title: "Vos droits",
          body: (
            <p>
              Conformément à la loi 09-08, vous disposez d’un droit d’accès, de rectification et
              d’opposition. Pour l’exercer :{" "}
              <a href={`mailto:${email}`}>{email}</a>
              {" · "}
              <a href={BRAND.phoneHref}>{BRAND.phone}</a>.
            </p>
          ),
        },
      ]}
    />
  );
}
