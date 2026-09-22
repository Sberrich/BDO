import type { Metadata } from "next";
import Image from "next/image";
import { IconLinkedIn, IconPin } from "@/components/icons";
import { IntervenantsHero } from "@/components/IntervenantsHero";
import { ButtonLink, Container } from "@/components/ui";
import { getIntervenants, getIntervenantsPage } from "@/lib/cms";
import {
  campusLabel,
  facultyHasPhoto,
  facultyPhotoSrc,
  facultyShowcase,
} from "@/lib/faculty-roster";
import { personLinkedIn, plain } from "@/lib/text";

export const metadata: Metadata = {
  title: "Intervenants",
  description: "Les associés, professeurs et praticiens qui animent les séminaires.",
};

export default async function IntervenantsPage() {
  const [{ chapeau }, cms] = await Promise.all([
    getIntervenantsPage(),
    getIntervenants(),
  ]);
  const intervenants = facultyShowcase(cms);

  return (
    <>
      <IntervenantsHero
        title="Ils animent les séminaires"
        lead={chapeau}
      />

      <section className="iv-roster" aria-labelledby="iv-roster-title">
        <Container className="iv-roster__inner">
          <header className="iv-roster__head">
            <p className="iv-roster__index">Le corps enseignant</p>
            <h2 id="iv-roster-title" className="iv-roster__title">
              Une équipe plurielle
            </h2>
            <p className="iv-roster__lead">
              Associés BDO, praticiens et partenaires — les profils publics croisent
              aussi le jury du Trophée BDO des CFOs.
            </p>
          </header>

          <ul className="iv-grid">
            {intervenants.map((p, i) => {
              const linkedin = personLinkedIn(p.linkedin);
              const name = plain(p.nom);
              const photo = facultyHasPhoto(p);
              return (
                <li key={p.slug}>
                  <article id={p.slug} className="iv-card">
                    <div className={`iv-card__media ${photo ? "has-photo" : ""}`}>
                      {photo ? (
                        <Image
                          src={facultyPhotoSrc(p)}
                          alt=""
                          fill
                          className="iv-card__img"
                          sizes="(min-width: 900px) 20rem, 50vw"
                        />
                      ) : (
                        <span
                          className={`faculty-mono tone-${p.tone} iv-card__mono`}
                          aria-hidden
                        >
                          {p.initials}
                        </span>
                      )}
                      <span className="iv-card__num" aria-hidden>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="iv-card__body">
                      <p className="iv-card__campus">
                        <IconPin />
                        {campusLabel(p.campus)}
                      </p>
                      <h3 className="iv-card__name">{name}</h3>
                      <p className="iv-card__role">
                        {plain(p.fonction)}
                        {p.institution ? ` · ${plain(p.institution)}` : ""}
                      </p>
                      {p.bio ? (
                        <p className="iv-card__bio">{plain(p.bio)}</p>
                      ) : null}
                      {linkedin ? (
                        <a
                          href={linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="iv-card__li"
                          aria-label={`Profil LinkedIn de ${name}`}
                        >
                          <IconLinkedIn size={16} />
                          LinkedIn
                        </a>
                      ) : null}
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>

          <aside className="iv-jury" aria-labelledby="iv-jury-title">
            <div>
              <p className="iv-jury__kicker">Soutenance</p>
              <h2 id="iv-jury-title" className="iv-jury__title">
                Le jury de soutenance
              </h2>
              <p className="iv-jury__text">
                La soutenance se tient devant le jury ISCAE × BDO, au second jour du
                séminaire 8, le 3 avril 2027.
              </p>
            </div>
            <ButtonLink href="/candidater">Candidater</ButtonLink>
          </aside>
        </Container>
      </section>
    </>
  );
}
