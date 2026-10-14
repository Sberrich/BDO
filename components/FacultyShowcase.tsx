import Image from "next/image";
import type { Intervenant } from "@/lib/cms";
import { LoopCarousel } from "@/components/LoopCarousel";
import { CAROUSEL_MAX } from "@/lib/carousel";
import { ButtonLink, Container, KickerIcon } from "@/components/ui";
import { IconArrowRight, IconLinkedIn } from "@/components/icons";
import {
  facultyHasPhoto,
  facultyHome,
  facultyPhotoSrc,
  facultyShowcase,
  type FacultyShowcasePerson,
} from "@/lib/faculty-roster";
import { personLinkedIn, plain } from "@/lib/text";

type Props = {
  speakers: Intervenant[];
  lead?: string;
};

function PersonCard({ person }: { person: FacultyShowcasePerson }) {
  const name = plain(person.nom);
  const linkedin = personLinkedIn(person.linkedin);
  const photo = facultyHasPhoto(person);

  return (
    <article className={`faculty-card tone-${person.tone}`}>
      <div className="faculty-card__media" aria-hidden={!photo}>
        {photo ? (
          <Image
            src={facultyPhotoSrc(person)}
            alt=""
            fill
            className="object-cover object-top"
            sizes="(max-width: 640px) 82vw, (max-width: 1024px) 33vw, 18rem"
          />
        ) : (
          <span className="faculty-card__mono">{person.initials}</span>
        )}
      </div>
      <div className="faculty-card__body">
        <p className="faculty-card__name">{name}</p>
        <p className="faculty-card__role">
          {plain(person.fonction)}
          {person.institution ? (
            <>
              <span aria-hidden="true"> · </span>
              {plain(person.institution)}
            </>
          ) : null}
        </p>
        {linkedin ? (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="li-icon faculty-card__li"
            aria-label={`Profil LinkedIn de ${name}`}
            title="LinkedIn"
          >
            <IconLinkedIn size={16} />
          </a>
        ) : null}
      </div>
    </article>
  );
}

/** Home: every speaker in the same carousel as the press section, home picks first. */
export function FacultyShowcase({ speakers, lead }: Props) {
  const all = facultyShowcase(speakers);
  const first = facultyHome(speakers);
  const people = [...first, ...all.filter((p) => !first.some((f) => f.slug === p.slug))].slice(0, CAROUSEL_MAX);

  return (
    <section id="intervenants" className="faculty" aria-labelledby="intervenants-title">
      <Container className="faculty__inner">
        <LoopCarousel
          className="is-faculty"
          centered
          heading={
            <header className="faculty__head">
              <div>
                <p className="faculty__index"><KickerIcon label="Les intervenants" />05 · Les intervenants</p>
                <h2 id="intervenants-title" className="faculty__title">
                  La chaire vivante du certificat
                </h2>
              </div>
              <p className="faculty__lead">
                {lead ||
                  "Associés de BDO Maroc, professeurs du Groupe ISCAE et praticiens invités : chacun enseigne sur son terrain."}
              </p>
            </header>
          }
          slides={people.map((p) => (
            <PersonCard key={p.slug} person={p} />
          ))}
          labels={people.map((p) => `Afficher ${plain(p.nom)}`)}
          prevLabel="Intervenant précédent"
          nextLabel="Intervenant suivant"
        />

        <div className="faculty__more">
          <ButtonLink href="/intervenants" variant="ghost" aria-label="Voir tous les intervenants">
            Voir tout
            <IconArrowRight />
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
