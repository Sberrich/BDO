import type { Metadata } from "next";
import Link from "next/link";
import { Container, Kicker } from "@/components/ui";
import { BRAND, data } from "@/lib/content";
import { plain } from "@/lib/text";

export const metadata: Metadata = {
  title: "Conditions générales d’utilisation",
  description: "Conditions générales d’utilisation du site du certificat CFO 4.0 — ISCAE × BDO.",
};

export default function CguPage() {
  const email = plain(data.site.contact.email);
  return (
    <article className="bg-white py-[clamp(2.5rem,6vw,4.5rem)]">
      <Container className="max-w-3xl">
        <Kicker>Informations légales</Kicker>
        <h1 className="mt-2 text-[clamp(2rem,1.65rem+1.75vw,3.25rem)] font-bold">
          Conditions générales d’utilisation
        </h1>
        <p className="mt-4 text-lg text-muted">
          Les présentes conditions régissent l’accès et l’utilisation du site{" "}
          <a className="font-semibold text-blue hover:text-blue-dark" href={BRAND.url}>
            {BRAND.url.replace(/^https?:\/\//, "")}
          </a>
          , édité conjointement par le Groupe ISCAE et BDO Maroc dans le cadre du certificat{" "}
          {data.site.nom}.
        </p>

        <h2 className="mt-10 text-2xl font-bold">Objet du site</h2>
        <p className="mt-3 text-muted">
          Le site présente le certificat {data.site.sousTitreOfficiel}, permet de déposer une
          candidature, de demander un rappel ou d’obtenir les publications associées (brochure,
          Baromètre, livre blanc).
        </p>

        <h2 className="mt-10 text-2xl font-bold">Usage</h2>
        <p className="mt-3 text-muted">
          L’utilisateur s’engage à fournir des informations exactes dans les formulaires et à
          n’utiliser le site qu’à des fins légitimes liées au programme. Tout usage abusif,
          frauduleux ou contraire à la réglementation marocaine est interdit.
        </p>

        <h2 className="mt-10 text-2xl font-bold">Propriété intellectuelle</h2>
        <p className="mt-3 text-muted">
          Les contenus du site (textes, visuels, marques, documents téléchargeables) restent la
          propriété de leurs titulaires respectifs. Toute reproduction non autorisée est
          interdite.
        </p>

        <h2 className="mt-10 text-2xl font-bold">Données personnelles</h2>
        <p className="mt-3 text-muted">
          Le traitement des données personnelles est décrit dans la{" "}
          <Link className="font-semibold text-blue hover:text-blue-dark" href="/confidentialite">
            politique de confidentialité
          </Link>
          .
        </p>

        <h2 className="mt-10 text-2xl font-bold">Contact</h2>
        <p className="mt-3 text-muted">
          Pour toute question relative aux présentes CGU :{" "}
          <a className="font-semibold text-blue hover:text-blue-dark" href={`mailto:${email}`}>
            {email}
          </a>
          .
        </p>
      </Container>
    </article>
  );
}
