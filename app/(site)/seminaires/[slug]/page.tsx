import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink, Container, KickerIcon } from "@/components/ui";
import { PriceBand } from "@/components/PriceBand";
import { ProgrammeGrid } from "@/components/ProgrammeGrid";
import { getIntervenants } from "@/lib/cms";
import { allSessions, sessionBySlug, sessionHref } from "@/lib/content";
import {
  facultyHasPhoto,
  facultyPhotoSrc,
  facultyShowcase,
  type FacultyShowcasePerson,
} from "@/lib/faculty-roster";
import { plain, seminarImage, sessionCode, sessionLabel } from "@/lib/text";
import {
  IconArrowRight,
  IconCal,
  IconClock,
  IconMap,
} from "@/components/icons";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allSessions().flatMap((s) => {
    const slugs = [s.numero === 0 ? "conference-inaugurale" : String(s.numero)];
    if (s.slug && !slugs.includes(s.slug)) slugs.push(s.slug);
    return slugs.map((slug) => ({ slug }));
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = sessionBySlug(slug);
  if (!s) return { title: "Séminaire" };
  return { title: plain(s.titre), description: plain(s.sousTitre) };
}

export default async function SeminairePage({ params }: Props) {
  const { slug } = await params;
  const s = sessionBySlug(slug);
  if (!s) notFound();
  const seq = allSessions();
  const i = seq.findIndex((x) => x.numero === s.numero);
  const prev = i > 0 ? seq[i - 1] : null;
  const next = i < seq.length - 1 ? seq[i + 1] : null;
  const cmsPeople = await getIntervenants();
  const roster = facultyShowcase(cmsPeople);
  const speakerSlugs = ((s as { intervenants?: string[] }).intervenants ??
    []) as string[];
  const people = speakerSlugs
    .map((slug) => {
      const fromRoster = roster.find((p) => p.slug === slug);
      if (fromRoster) return fromRoster;
      const fromCms = cmsPeople.find((p) => p.slug === slug);
      if (!fromCms) return null;
      return {
        slug: fromCms.slug,
        nom: fromCms.nom,
        fonction: fromCms.fonction,
        institution: fromCms.institution,
        photo: fromCms.photo,
        linkedin: fromCms.linkedin,
        bio: fromCms.bio,
        initials: plain(fromCms.nom)
          .split(/\s+/)
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        tone: "slate" as const,
      };
    })
    .filter((p): p is FacultyShowcasePerson => Boolean(p));
  const inaug = s.numero === 0;
  const detail = s as {
    jour1?: { matin: string; apresMidi: string };
    jour2?: { matin: string; apresMidi: string };
    livrable?: string;
    actualisation?: string;
    objectif: string;
  };
  const cover = seminarImage(s.numero);
  const indexLabel = sessionLabel(s);
  const lieu = s.lieu ?? "Campus ISCAE Casablanca";

  return (
    <>
      <section className="sem-hero" aria-labelledby="sem-title">
        <Container className="sem-hero__inner">
          <nav className="sem-hero__crumbs" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <Link href="/programme">Le programme</Link>
            <span aria-hidden="true">/</span>
            <span>{plain(s.titre)}</span>
          </nav>

          <div className="sem-hero__grid-layout">
            <div className="sem-hero__copy">
              <p className="sem-hero__index">
                <span className="sem-hero__badge"><KickerIcon label={indexLabel} bare />{indexLabel}</span>
                {inaug ? "Ouverture du cycle" : `Séance ${i} sur ${seq.length - 1}`}
              </p>
              <h1 id="sem-title" className="sem-hero__title">
                {plain(s.titre)}
              </h1>
              <p className="sem-hero__lead">{plain(s.sousTitre)}</p>
              <nav className="sem-steps" aria-label="Toutes les séances">
                <ol>
                  {seq.map((x, xi) => {
                    const current = x.numero === s.numero;
                    return (
                      <li key={x.numero}>
                        <Link
                          href={sessionHref(x)}
                          className={`sem-steps__dot${current ? " is-current" : ""}${xi < i ? " is-past" : ""}`}
                          aria-current={current ? "page" : undefined}
                          title={plain(x.titre)}
                        >
                          {sessionCode(x)}
                          <span className="sr-only"> : {plain(x.titre)}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </nav>
              <ul className="sem-hero__meta" aria-label="Repères">
                <li>
                  <IconCal />
                  <span>{s.dates}</span>
                </li>
                <li>
                  <IconClock />
                  <span>
                    {[s.horaire, s.heures ? `${s.heures} h` : null]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </li>
                <li>
                  <IconMap />
                  <span>{lieu}</span>
                </li>
              </ul>
              <div className="sem-hero__ctas">
                <ButtonLink
                  href="/candidater"
                  className="sem-hero__cta-primary"
                >
                  Candidater
                  <IconArrowRight />
                </ButtonLink>
                <ButtonLink
                  href="/ressources/brochure"
                  variant="ghost"
                  className="sem-hero__cta-secondary"
                >
                  Recevoir la brochure
                </ButtonLink>
              </div>
            </div>

            <div className="sem-hero__aside" aria-hidden="true">
              <div className="sem-hero__card">
                <Image
                  className="sem-hero__card-img"
                  src={cover}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 32rem, 90vw"
                  priority
                />
                <span className="sem-hero__card-veil" />
                <span className="sem-hero__card-frame" />
                <span className="sem-hero__card-mark">
                  {sessionCode(s)}
                </span>
                <span className="sem-hero__card-caption">
                  {inaug ? "Ouverture" : `Séance ${i}`}
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="sem-body">
        <Container className="sem-body__layout">
          <div className="sem-body__main">
            <div className="sem-objectif">
              <p className="sem-kicker">Objectif</p>
              <p className="sem-objectif__text">{plain(detail.objectif)}</p>
            </div>

            {!inaug && detail.jour1 && detail.jour2 ? (
              <div className="sem-block">
                <h2 className="sem-block__title">Le déroulé de la séance</h2>
                <ol className="sem-parts">
                  {[
                    { n: "01", label: "Notions clés", day: detail.jour1 },
                    { n: "02", label: "Approfondissement", day: detail.jour2 },
                  ].map((part) => (
                    <li key={part.n} className="sem-part">
                      <p className="sem-part__head">
                        <span className="sem-part__num">{part.n}</span>
                        Partie {Number(part.n)} · {part.label}
                      </p>
                      <dl className="sem-part__steps">
                        <div>
                          <dt>Premier temps</dt>
                          <dd>{part.day.matin}</dd>
                        </div>
                        <div>
                          <dt>Second temps</dt>
                          <dd>{part.day.apresMidi}</dd>
                        </div>
                      </dl>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}

            {detail.livrable ? (
              <div className="sem-livrable">
                <p className="sem-livrable__kicker"><KickerIcon label="Ce que vous produisez" />Ce que vous produisez</p>
                <p className="sem-livrable__text">{detail.livrable}</p>
              </div>
            ) : null}

            {detail.actualisation ? (
              <p className="sem-note">{detail.actualisation}</p>
            ) : null}

            {people.length > 0 ? (
              <div className="sem-block" aria-labelledby="sem-faculty-title">
                <h2 id="sem-faculty-title" className="sem-block__title">
                  {people.length > 1 ? "Les intervenants" : "L’intervenant"}
                </h2>
                <ul className="sem-faculty__grid">
                  {people.map((p) => (
                    <SpeakerCard key={p.slug} person={p} />
                  ))}
                </ul>
              </div>
            ) : null}

            <nav className="sem-pager" aria-label="Séances adjacentes">
              {prev ? (
                <Link
                  href={sessionHref(prev)}
                  className="sem-pager__link is-prev"
                >
                  <span>← Séance précédente</span>
                  <strong>{plain(prev.titre)}</strong>
                  <em>
                    {sessionLabel(prev)}{" "}
                    · {prev.dates}
                  </em>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link
                  href={sessionHref(next)}
                  className="sem-pager__link is-next"
                >
                  <span>Séance suivante →</span>
                  <strong>{plain(next.titre)}</strong>
                  <em>
                    {sessionLabel(next)}{" "}
                    · {next.dates}
                  </em>
                </Link>
              ) : (
                <span />
              )}
            </nav>
          </div>

          <section className="sem-side" aria-label="En bref">
            <div className="sem-side__card">
              <p className="sem-side__title">En bref</p>
              <dl className="sem-side__facts">
                <div>
                  <dt>Date</dt>
                  <dd>{s.dates}</dd>
                </div>
                {s.horaire ? (
                  <div>
                    <dt>Horaire</dt>
                    <dd>{s.horaire}</dd>
                  </div>
                ) : null}
                {s.heures ? (
                  <div>
                    <dt>Durée</dt>
                    <dd>{s.heures}&nbsp;h</dd>
                  </div>
                ) : null}
                <div>
                  <dt>Lieu</dt>
                  <dd>{lieu}</dd>
                </div>
              </dl>
              {people.length ? (
                <ul className="sem-side__people" aria-label="Intervenants">
                  {people.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/intervenants#${p.slug}`}
                        className="sem-side__person"
                      >
                        {facultyHasPhoto(p) ? (
                          <Image
                            src={facultyPhotoSrc(p)}
                            alt=""
                            width={40}
                            height={40}
                            className="sem-side__avatar"
                          />
                        ) : (
                          <span
                            className="sem-side__avatar is-mono"
                            aria-hidden
                          >
                            {p.initials}
                          </span>
                        )}
                        <span>
                          <span className="sem-side__person-label">
                            Intervenant
                          </span>
                          <span className="sem-side__person-name">
                            {plain(p.nom)}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="sem-side__ctas">
                <ButtonLink href="/candidater" className="sem-side__primary">
                  Candidater
                  <IconArrowRight />
                </ButtonLink>
                <ButtonLink
                  href="/ressources/brochure"
                  variant="ghost"
                  className="sem-side__secondary"
                >
                  Recevoir la brochure
                </ButtonLink>
              </div>
              <p className="sem-side__note">
                Candidatures ouvertes jusqu’au 22 octobre 2026.
              </p>
            </div>
          </section>
        </Container>
      </section>

      <PriceBand />

      <section className="sem-others">
        <Container>
          <header className="sem-others__head">
            <p className="sem-kicker">Le programme</p>
            <h2 className="sem-others__title">Les autres séances</h2>
          </header>
          <div className="sem-others__grid">
            <ProgrammeGrid excludeNumero={s.numero} />
          </div>
        </Container>
      </section>
    </>
  );
}

function SpeakerCard({ person }: { person: FacultyShowcasePerson }) {
  const photo = facultyHasPhoto(person);
  return (
    <li className={`sem-speaker tone-${person.tone}`}>
      <div className="sem-speaker__media" aria-hidden={!photo}>
        {photo ? (
          <Image
            src={facultyPhotoSrc(person)}
            alt=""
            width={112}
            height={112}
            className="sem-speaker__img"
          />
        ) : (
          <span className="sem-speaker__mono">{person.initials}</span>
        )}
      </div>
      <div className="sem-speaker__body">
        <p className="sem-speaker__name">{plain(person.nom)}</p>
        <p className="sem-speaker__role">
          {plain(person.fonction)}
          {person.institution ? ` · ${plain(person.institution)}` : ""}
        </p>
        {person.bio ? (
          <p className="sem-speaker__bio">{plain(person.bio)}</p>
        ) : null}
        <div className="sem-speaker__links">
          <Link
            href={`/intervenants#${person.slug}`}
            className="sem-speaker__li"
          >
            Voir le profil
            <IconArrowRight />
          </Link>
          {person.linkedin ? (
            <a
              href={person.linkedin}
              className="sem-speaker__li"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
              <IconArrowRight />
            </a>
          ) : null}
        </div>
      </div>
    </li>
  );
}
