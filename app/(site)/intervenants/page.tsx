import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { IconArrowRight } from "@/components/icons";
import { LinkedInButton, SpeakerProfile, type SpeakerSession } from "@/components/SpeakerProfile";
import { ButtonLink, Container, KickerIcon } from "@/components/ui";
import { allSessions, SHOW } from "@/lib/content";
import { getIntervenants, getIntervenantsPage } from "@/lib/cms";
import {
  facultyHasPhoto,
  facultyPhotoSrc,
  facultyShowcase,
} from "@/lib/faculty-roster";
import { personLinkedIn, plain, seminarImage, seminarPath, sessionCode, sessionLabel } from "@/lib/text";

const SECOND_SLUG = "ismail-lahsini";

function sessionsBySpeaker() {
  const map = new Map<string, SpeakerSession[]>();
  for (const s of allSessions()) {
    for (const slug of s.intervenants ?? []) {
      const code = sessionCode(s);
      const list = map.get(slug) ?? [];
      list.push({
        code: /^\d+$/.test(code) ? `S${Number(code)}` : code,
        titre: plain(s.titre),
        label: sessionLabel(s),
        when: [plain(s.dates), plain(s.horaire)].filter(Boolean).join(" · "),
        image: seminarImage(s.numero),
        href: seminarPath(s),
      });
      map.set(slug, list);
    }
  }
  return map;
}

export const metadata: Metadata = {
  title: "Intervenants",
  description: "Les associés, professeurs et praticiens qui animent les séminaires.",
};

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
  const bySpeaker = sessionsBySpeaker();
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
                <span className="sem-hero__badge"><KickerIcon label="Les intervenants" bare />Les intervenants</span>
                {intervenants.length} experts · {allSessions().length} séances
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
            <p className="iv-roster__index"><KickerIcon label="Le corps enseignant" />Le corps enseignant</p>
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
              const role = `${plain(p.fonction)}${p.institution ? ` · ${plain(p.institution)}` : ""}`;
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
                          sizes="(min-width: 900px) 24rem, 100vw"                        />
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
                      <p className="iv-card__role">{role}</p>
                      {p.bio ? <p className="iv-card__bio">{plain(p.bio)}</p> : null}
                      <div className="iv-card__actions">
                        <SpeakerProfile
                          person={{
                            slug: p.slug,
                            index: String(i + 1).padStart(2, "0"),
                            name,
                            fonction: plain(p.fonction),
                            institution: p.institution ? plain(p.institution) : "",
                            bio: p.bio ? plain(p.bio) : "",
                            photo: photo ? facultyPhotoSrc(p) : null,
                            initials: p.initials,
                            tone: String(p.tone),
                            linkedin: linkedin || null,
                            sessions: bySpeaker.get(p.slug) ?? [],
                          }}
                        />
                        {linkedin ? <LinkedInButton href={linkedin} name={name} /> : null}
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>

          {SHOW.soutenance ? (
          <section className="iv-jury" aria-labelledby="iv-jury-title">
            <div>
              <p className="iv-jury__kicker"><KickerIcon label="Soutenance" />Soutenance</p>
              <h2 id="iv-jury-title" className="iv-jury__title">
                Le jury de soutenance
              </h2>
              <p className="iv-jury__text">
                La soutenance se tient devant le jury ISCAE × BDO, lors du séminaire
                de clôture, le 26 décembre 2026.
              </p>
            </div>
            <ButtonLink href="/candidater">Candidater</ButtonLink>
          </section>
          ) : null}
        </Container>
      </section>

      <section className="cta-band" aria-labelledby="cta-band-title">
        <Container>
          <div className="cta-band__inner">
            <div>
              <p className="cta-band__kicker"><KickerIcon label="Promotion 1 · rentrée le 30 octobre 2026" />Promotion 1 · rentrée le 30 octobre 2026</p>
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
