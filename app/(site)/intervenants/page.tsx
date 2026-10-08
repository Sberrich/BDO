import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { IconArrowRight, IconLinkedIn } from "@/components/icons";
import { ButtonLink, Container } from "@/components/ui";
import { data, SHOW } from "@/lib/content";
import { getIntervenants, getIntervenantsPage } from "@/lib/cms";
import {
  facultyHasPhoto,
  facultyPhotoSrc,
  facultyShowcase,
} from "@/lib/faculty-roster";
import { personLinkedIn, plain } from "@/lib/text";

const SECOND_SLUG = "ismail-lahsini";

export const metadata: Metadata = {
  title: "Intervenants",
  description: "Les associés, professeurs et praticiens qui animent les séminaires.",
};

function seminarsBySpeaker() {
  const map = new Map<string, { numero: number; titre: string }[]>();
  for (const s of data.seminaires.seminaires) {
    for (const slug of s.intervenants as readonly string[]) {
      const list = map.get(slug) ?? [];
      list.push({ numero: s.numero, titre: plain(s.titre) });
      map.set(slug, list);
    }
  }
  return map;
}

export default async function IntervenantsPage() {
  const [{ chapeau }, cms] = await Promise.all([
    getIntervenantsPage(),
    getIntervenants(),
  ]);
  const roster = facultyShowcase(cms);
  const featured = roster.find((p) => p.slug === SECOND_SLUG);
  const intervenants = featured
    ? [...roster.filter((p) => p !== featured).slice(0, 1), featured, ...roster.filter((p) => p !== featured).slice(1)]
    : roster;
  const bySpeaker = seminarsBySpeaker();
  const withPhoto = intervenants.filter((p) => facultyHasPhoto(p));
  const faces = withPhoto.slice(0, 8);
  const hidden = intervenants.length - faces.length;

  return (
    <>
      <section className="sem-hero iv-hero2" aria-labelledby="iv-title">
        <Container className="sem-hero__inner">
          <nav className="sem-hero__crumbs" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span>Intervenants</span>
          </nav>
          <div className="sem-hero__grid-layout">
            <div className="sem-hero__copy">
              <p className="sem-hero__index">
                <span className="sem-hero__badge">Les intervenants</span>
                {intervenants.length} experts · 8 séminaires
              </p>
              <h1 id="iv-title" className="sem-hero__title">
                Ils animent les séminaires
              </h1>
              {chapeau ? <p className="sem-hero__lead">{chapeau}</p> : null}
              <div className="sem-hero__ctas">
                <ButtonLink href="#equipe" className="sem-hero__cta-primary">
                  Découvrir l’équipe
                  <IconArrowRight />
                </ButtonLink>
                <ButtonLink href="/programme" variant="ghost" className="sem-hero__cta-secondary">
                  Voir le programme
                </ButtonLink>
              </div>
            </div>
            <ul className="iv-faces" aria-label="Quelques intervenants">
              {faces.map((p, i) => (
                <li key={p.slug} className={`iv-faces__item is-${i + 1}`}>
                  <a href={`#${p.slug}`} className="iv-faces__link" aria-label={plain(p.nom)}>
                    <Image src={facultyPhotoSrc(p)} alt="" fill sizes="180px" className="iv-faces__img" />
                    <span className="iv-faces__name" aria-hidden>
                      {plain(p.nom)}
                    </span>
                  </a>
                </li>
              ))}
              <li className="iv-faces__item">
                <a href="#equipe" className="iv-faces__link iv-faces__more">
                  <span className="iv-faces__more-n">{hidden > 0 ? `+${hidden}` : intervenants.length}</span>
                  <span className="iv-faces__more-label">
                    {hidden > 0 ? "Voir toute l’équipe" : "Toute l’équipe"}
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </Container>
      </section>

      <section id="equipe" className="iv-roster" aria-labelledby="iv-roster-title">
        <Container className="iv-roster__inner">
          <header className="iv-roster__head">
            <p className="iv-roster__index">Le corps enseignant</p>
            <h2 id="iv-roster-title" className="iv-roster__title">
              Une équipe plurielle
            </h2>
            <p className="iv-roster__lead">Associés BDO, praticiens et partenaires.</p>
          </header>

          <ul className="iv-grid">
            {intervenants.map((p, i) => {
              const linkedin = personLinkedIn(p.linkedin);
              const name = plain(p.nom);
              const photo = facultyHasPhoto(p);
              const teaches = bySpeaker.get(p.slug) ?? [];
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
                      <h3 className="iv-card__name">{name}</h3>
                      <p className="iv-card__role">
                        {plain(p.fonction)}
                        {p.institution ? ` · ${plain(p.institution)}` : ""}
                      </p>
                      {teaches.length ? (
                        <div className="iv-card__teaches">
                          <span className="iv-card__teaches-label">Intervient sur</span>
                          <ul>
                            {teaches.map((t) => (
                              <li key={t.numero}>
                                <Link href={`/seminaires/${t.numero}`} className="iv-card__sem">
                                  <span>S{t.numero}</span>
                                  {t.titre}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      {p.bio ? (
                        <details className="iv-bio">
                          <summary>
                            <span className="iv-card__bio">{plain(p.bio)}</span>
                            <span className="iv-bio__toggle" aria-hidden="true" />
                          </summary>
                        </details>
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

          {SHOW.soutenance ? (
          <aside className="iv-jury" aria-labelledby="iv-jury-title">
            <div>
              <p className="iv-jury__kicker">Soutenance</p>
              <h2 id="iv-jury-title" className="iv-jury__title">
                Le jury de soutenance
              </h2>
              <p className="iv-jury__text">
                La soutenance se tient devant le jury ISCAE × BDO, au second jour du
                séminaire 8, le 26 décembre 2026.
              </p>
            </div>
            <ButtonLink href="/candidater">Candidater</ButtonLink>
          </aside>
          ) : null}
        </Container>
      </section>

      <section className="cta-band" aria-labelledby="cta-band-title">
        <Container>
          <div className="cta-band__inner">
            <div>
              <p className="cta-band__kicker">Promotion 1 · rentrée le 30 octobre 2026</p>
              <h2 id="cta-band-title" className="cta-band__title">
                Travaillez votre projet avec eux, séminaire après séminaire.
              </h2>
            </div>
            <div className="cta-band__actions">
              <ButtonLink href="/candidater" className="sem-hero__cta-primary">
                Candidater
                <IconArrowRight />
              </ButtonLink>
              <ButtonLink href="/programme" variant="ghost" className="sem-hero__cta-secondary">
                Voir le programme
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
