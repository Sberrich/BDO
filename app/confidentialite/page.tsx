import type { Metadata } from "next";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Confidentialité",
  description:
    "Déclaration de confidentialité du certificat Transformation Digitale et Leadership Financier ISCAE × BDO.",
  alternates: { canonical: "/confidentialite" },
};

export default function ConfidentialitePage() {
  return (
    <article className="bg-white py-16">
      <div className="prose mx-auto w-full max-w-3xl px-5">
        <h1 className="font-display text-4xl font-bold text-ink">Confidentialité</h1>

        <h2 className="mt-10 font-display text-2xl font-bold">Introduction</h2>
        <p className="mt-4 leading-relaxed text-muted">
          Le Groupe ISCAE, en collaboration avec BDO Maroc, membre de BDO International Ltd, une
          société britannique limitée par garantie, constitue une alliance dans le domaine de la
          formation des dirigeants. Ensemble, nous formons une partie d’un réseau mondial
          d’entités indépendantes, chacune offrant des services professionnels sous le nom de BDO
          et ISCAE.
        </p>
        <p className="mt-4 leading-relaxed text-muted">
          BDO est un réseau international de cabinets indépendants d’expertise comptable, de
          fiscalité et de conseil, tandis que le Groupe ISCAE se spécialise dans l’éducation
          supérieure et la recherche en gestion. Les deux entités collaborent pour fournir un
          certificat enrichi et des services professionnels sous le nom de BDO-ISCAE.
        </p>
        <p className="mt-4 leading-relaxed text-muted">
          Cette déclaration de confidentialité s’applique au site Web {site.url} et intègre les
          aspects spécifiques du Groupe ISCAE. Elle vise à informer nos utilisateurs, étudiants,
          clients et partenaires sur la manière dont nous collectons, utilisons et protégeons les
          informations personnelles.
        </p>

        <h2 className="mt-10 font-display text-2xl font-bold">
          Collecte et utilisation des informations personnelles
        </h2>
        <p className="mt-4 leading-relaxed text-muted">
          Nous recueillons des informations personnelles dans diverses circonstances telles que
          l’inscription à des cours, des événements, des newsletters, ou lors de la demande de
          renseignements ou de services. Les informations recueillies peuvent inclure des
          coordonnées, des informations académiques et professionnelles, et d’autres détails
          nécessaires pour fournir nos services et formations.
        </p>

        <h2 className="mt-10 font-display text-2xl font-bold">
          Sécurité et confidentialité des données
        </h2>
        <p className="mt-4 leading-relaxed text-muted">
          Nous nous engageons à protéger la confidentialité et la sécurité de vos informations.
          Des mesures appropriées sont mises en place pour empêcher l’accès non autorisé,
          l’utilisation, la modification ou la divulgation de vos données personnelles.
        </p>

        <h2 className="mt-10 font-display text-2xl font-bold">Partage d’informations</h2>
        <p className="mt-4 leading-relaxed text-muted">
          Nous ne partageons vos informations avec des tiers que dans le cadre de nos opérations
          conjointes ou lorsque cela est nécessaire pour fournir les services ou formations
          demandés. Toute divulgation est effectuée dans le respect de la législation en vigueur,
          notamment la loi n° 09-08.
        </p>

        <h2 className="mt-10 font-display text-2xl font-bold">Vos droits</h2>
        <p className="mt-4 leading-relaxed text-muted">
          Conformément à la législation locale, vous disposez de droits sur vos données
          personnelles, tels que le droit d’accès, de rectification, de suppression ou de
          limitation de leur traitement. Vous pouvez exercer ces droits en nous contactant à{" "}
          <a className="font-semibold text-navy" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          .
        </p>

        <h2 className="mt-10 font-display text-2xl font-bold">Modifications de la déclaration</h2>
        <p className="mt-4 leading-relaxed text-muted">
          Cette déclaration de confidentialité peut être mise à jour périodiquement. Les
          modifications seront effectives dès leur publication sur notre site Web.
        </p>

        <h2 className="mt-10 font-display text-2xl font-bold">Contact</h2>
        <p className="mt-4 leading-relaxed text-muted">
          Pour toute question ou préoccupation concernant cette déclaration ou le traitement de
          vos données personnelles, veuillez nous contacter à {site.email} ou via notre{" "}
          <a className="font-semibold text-navy" href="/#contact">
            section Contact
          </a>
          .
        </p>
      </div>
    </article>
  );
}
