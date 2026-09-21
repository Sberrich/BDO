import type { Metadata } from "next";
import { Container, Kicker } from "@/components/ui";
import { data } from "@/lib/content";
import { plain } from "@/lib/text";

export const metadata: Metadata = {
  title: "Protection des données",
  description: "Politique de confidentialité du certificat ISCAE × BDO.",
};

export default function ConfidentialitePage() {
  const lg = data.site.conformite;
  const email = plain(data.site.contact.email);
  return (
    <article className="bg-white py-[clamp(2.5rem,6vw,4.5rem)]">
      <Container className="max-w-3xl">
        <Kicker>Informations légales</Kicker>
        <h1 className="mt-2 text-[clamp(2rem,1.65rem+1.75vw,3.25rem)] font-bold">Protection des données</h1>
        <p className="mt-4 text-lg text-muted">
          Le traitement des données opéré par ce site relève de la {lg.loi}.
        </p>
        <h2 className="mt-10 text-2xl font-bold">Données collectées</h2>
        <p className="mt-3 text-muted">
          Candidature, demande de rappel, session d’information et téléchargement de publications :
          identité, fonction, entreprise, e-mail professionnel, et selon le formulaire téléphone,
          projet de transformation et mode de financement.
        </p>
        <h2 className="mt-10 text-2xl font-bold">Vos droits</h2>
        <p className="mt-3 text-muted">
          Conformément à la loi 09-08, vous disposez d’un droit d’accès, de rectification et
          d’opposition. Contact :{" "}
          <a className="font-semibold text-blue hover:text-blue-dark" href={`mailto:${email}`}>{email}</a>.
        </p>
      </Container>
    </article>
  );
}
