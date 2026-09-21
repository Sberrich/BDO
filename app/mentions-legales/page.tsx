import type { Metadata } from "next";
import { Container, Kicker } from "@/components/ui";
import { data } from "@/lib/content";
import { plain } from "@/lib/text";

export const metadata: Metadata = { title: "Mentions légales" };

export default function MentionsPage() {
  const c = data.site.contact;
  const lg = data.site.conformite;
  const email = plain(c.email);
  return (
    <article className="bg-white py-[clamp(2.5rem,6vw,4.5rem)]">
      <Container className="max-w-3xl">
        <Kicker>Informations légales</Kicker>
        <h1 className="mt-2 text-[clamp(2rem,1.65rem+1.75vw,3.25rem)] font-bold">Mentions légales</h1>
        <h2 className="mt-10 text-2xl font-bold">Éditeur du site</h2>
        <p className="mt-3 text-muted">
          Site édité conjointement par le Groupe ISCAE et BDO Maroc, dans le cadre du certificat{" "}
          {data.site.nom} — {data.site.sousTitreOfficiel}.
        </p>
        <p className="mt-3 text-muted">
          {c.adresseIscae}
          <br />
          Contact : <a className="font-semibold text-blue hover:text-blue-dark" href={`mailto:${email}`}>{email}</a>
        </p>
        <h2 className="mt-10 text-2xl font-bold">Données personnelles</h2>
        <p className="mt-3 text-muted">
          Le traitement relève de la {lg.loi}. {plain(lg.declaration)} Voir la{" "}
          <a className="font-semibold text-blue hover:text-blue-dark" href="/confidentialite">politique de protection des données</a>.
        </p>
      </Container>
    </article>
  );
}
