import Image from "next/image";
import { LinkedInButton, SpeakerProfile, type SpeakerSession } from "@/components/SpeakerProfile";
import {
  facultyHasPhoto,
  facultyPhotoSrc,
  type FacultyShowcasePerson,
} from "@/lib/faculty-roster";
import { personLinkedIn, plain } from "@/lib/text";

export function SpeakerCard({
  person: p,
  index,
  sessions,
}: {
  person: FacultyShowcasePerson;
  index: number;
  sessions: SpeakerSession[];
}) {
  const linkedin = personLinkedIn(p.linkedin);
  const name = plain(p.nom);
  const photo = facultyHasPhoto(p);
  const role = `${plain(p.fonction)}${p.institution ? ` · ${plain(p.institution)}` : ""}`;
  const num = String(index + 1).padStart(2, "0");
  return (
    <article id={p.slug} className="iv-card">
      <div className={`iv-card__media ${photo ? "has-photo" : ""}`}>
        {photo ? (
          <Image
            src={facultyPhotoSrc(p)}
            alt=""
            fill
            className="iv-card__img"
            sizes="(min-width: 900px) 24rem, 100vw"
          />
        ) : (
          <span className={`faculty-mono tone-${p.tone} iv-card__mono`} aria-hidden>
            {p.initials}
          </span>
        )}
        <span className="iv-card__num" aria-hidden>
          {num}
        </span>
      </div>
      <div className="iv-card__body">
        <h3 className="iv-card__name">{name}</h3>
        <p className="iv-card__role">{role}</p>
        {p.bio ? <p className="iv-card__bio">{plain(p.bio)}</p> : null}
        <div className="iv-card__actions">
          {linkedin ? <LinkedInButton href={linkedin} name={name} /> : null}
          <SpeakerProfile
            person={{
              slug: p.slug,
              index: num,
              name,
              fonction: plain(p.fonction),
              institution: p.institution ? plain(p.institution) : "",
              bio: p.bio ? plain(p.bio) : "",
              photo: photo ? facultyPhotoSrc(p) : null,
              initials: p.initials,
              tone: String(p.tone),
              linkedin: linkedin || null,
              sessions,
            }}
          />
        </div>
      </div>
    </article>
  );
}
