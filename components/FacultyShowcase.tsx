import Image from "next/image";
import Link from "next/link";
import type { Intervenant } from "@/lib/cms";
import { Reveal } from "@/components/motion";
import { Container } from "@/components/ui";
import { IconLinkedIn } from "@/components/icons";
import {
  campusLabel,
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

function PersonCard({
  person,
  featured = false,
  delay = 0,
}: {
  person: FacultyShowcasePerson;
  featured?: boolean;
  delay?: number;
}) {
  const name = plain(person.nom);
  const linkedin = personLinkedIn(person.linkedin);
  const photo = facultyHasPhoto(person);

  return (
    <Reveal
      as="li"
      delay={delay}
      id={person.slug}
      className={`faculty-card ${featured ? "is-featured" : ""} tone-${person.tone}`}
    >
      <div className="faculty-card__media" aria-hidden={!photo}>
        {photo ? (
          <Image
            src={facultyPhotoSrc(person)}
            alt=""
            fill
            className="object-cover"
            sizes={featured ? "(max-width: 900px) 100vw, 50vw" : "(max-width: 900px) 50vw, 25vw"}
          />
        ) : (
          <span className="faculty-card__mono">{person.initials}</span>
        )}
        <span className="faculty-card__veil" />
      </div>
      <div className="faculty-card__body">
        <span className="faculty-card__campus">{campusLabel(person.campus)}</span>
        <p className="faculty-card__name">{name}</p>
        <p className="faculty-card__role">
          {plain(person.fonction)}
          <span aria-hidden="true"> · </span>
          {plain(person.institution)}
        </p>
        {linkedin ? (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="faculty-card__li"
            aria-label={`Profil LinkedIn de ${name}`}
          >
            <IconLinkedIn size={15} />
            LinkedIn
          </a>
        ) : null}
      </div>
    </Reveal>
  );
}

export function FacultyShowcase({ speakers, lead }: Props) {
  const people = facultyHome(speakers);
  const total = facultyShowcase(speakers).length;

  return (
    <section id="intervenants" className="faculty" aria-labelledby="intervenants-title">
      <span className="faculty__glow" aria-hidden="true" />
      <span className="faculty__grid" aria-hidden="true" />
      <Container className="faculty__inner">
        <header className="faculty__head">
          <div>
            <p className="faculty__index">05 — Les intervenants</p>
            <h2 id="intervenants-title" className="faculty__title">
              La chaire vivante du certificat
            </h2>
          </div>
          <p className="faculty__lead">
            {lead ||
              "Les séminaires sont animés par des associés de BDO Maroc, des professeurs du Groupe ISCAE et des praticiens invités."}
          </p>
        </header>

        <ul className="faculty-home">
          {people.map((p, i) => (
            <PersonCard key={p.slug} person={p} featured={i === 0} delay={i * 70} />
          ))}
        </ul>

        <Link href="/intervenants" className="faculty__link">
          Tous les intervenants ({total}) <span aria-hidden="true">→</span>
        </Link>
      </Container>
    </section>
  );
}
