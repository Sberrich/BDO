import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink, Container } from "@/components/ui";
import { HeroDecor } from "@/components/HeroDecor";
import { ProgrammeGrid } from "@/components/ProgrammeGrid";
import { SeminarDaysSwitch } from "@/components/SeminarDaysSwitch";
import { getIntervenants } from "@/lib/cms";
import { allSessions, sessionBySlug, sessionHref } from "@/lib/content";
import {
  facultyHasPhoto,
  facultyPhotoSrc,
  facultyShowcase,
  type FacultyShowcasePerson,
} from "@/lib/faculty-roster";
import { plain, seminarImage, seminarVideo } from "@/lib/text";
import { IconArrowRight, IconCal, IconMap } from "@/components/icons";

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
  const speakerSlugs = ((s as { intervenants?: string[] }).intervenants ?? []) as string[];
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
        campus: "Casablanca" as const,
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
  const clip = seminarVideo(s.numero);
  const indexLabel = inaug
    ? "Conférence inaugurale"
    : `Séminaire ${String(s.numero).padStart(2, "0")}`;

  return (
    <>
      <section className="sem-hero" aria-labelledby="sem-title">
        <span className="sem-hero__glow" aria-hidden="true" />
        <span className="sem-hero__grid" aria-hidden="true" />
        <HeroDecor motif="mesh" />

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
              <p className="sem-hero__eyebrow">
                <span className="sem-hero__eyebrow-dot" aria-hidden="true" />
                Groupe ISCAE × BDO Maroc
              </p>
              <p className="sem-hero__index">
                {indexLabel}
                <span aria-hidden="true"> · </span>
                {s.dates}
              </p>
              <h1 id="sem-title" className="sem-hero__title">
                {plain(s.titre)}
              </h1>
              <p className="sem-hero__lead">{plain(s.sousTitre)}</p>
              <ul className="sem-hero__meta" aria-label="Repères">
                <li>
                  <IconCal />
                  <span>{inaug ? "1 jour" : "2 jours · ven.–sam."}</span>
                </li>
                <li>
                  <IconMap />
                  <span>Rabat · Casablanca</span>
                </li>
              </ul>
              <div className="sem-hero__ctas">
                <ButtonLink href="/candidater" className="sem-hero__cta-primary">
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
                <video
                  className="sem-hero__card-img"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={cover}
                >
                  <source src={clip} type="video/mp4" />
                </video>
                <span className="sem-hero__card-veil" />
                <span className="sem-hero__card-frame" />
                <span className="sem-hero__card-mark">
                  {inaug ? "IN" : String(s.numero).padStart(2, "0")}
                </span>
                <span className="sem-hero__card-caption">
                  {inaug ? "Ouverture" : `Séance ${s.numero}`}
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="sem-body">
        <Container className="sem-body__inner">
          <div className="sem-objectif">
            <div className="sem-objectif__head">
              <p className="sem-kicker">Objectif</p>
            </div>
            <p className="sem-objectif__text">{plain(detail.objectif)}</p>
          </div>

          {!inaug && detail.jour1 && detail.jour2 ? (
            <div className="sem-block">
              <header className="sem-block__head">
                <p className="sem-kicker">Le week-end</p>
                <h2 className="sem-block__title">
                  Deux jours, <em>un livrable</em>.
                </h2>
                <p className="sem-block__lead">
                  Vendredi et samedi — basculez entre les deux journées pour voir le déroulé.
                </p>
              </header>
              <SeminarDaysSwitch
                jour1={detail.jour1}
                jour2={detail.jour2}
                livrable={detail.livrable}
              />
            </div>
          ) : detail.livrable ? (
            <aside className="sem-livrable">
              <p className="sem-livrable__kicker">Livrable</p>
              <p className="sem-livrable__text">{detail.livrable}</p>
            </aside>
          ) : null}

          {detail.actualisation ? (
            <p className="sem-note">{detail.actualisation}</p>
          ) : null}

          <div className="sem-actions">
            <ButtonLink href="/ressources/brochure" variant="secondary" className="sem-actions__ghost">
              Recevoir la brochure
            </ButtonLink>
            <ButtonLink href="/candidater" className="sem-actions__primary">
              Candidater
              <IconArrowRight />
            </ButtonLink>
          </div>

          <nav className="sem-pager" aria-label="Séances adjacentes">
            {prev ? (
              <Link href={sessionHref(prev)} className="sem-pager__link is-prev">
                <span>Précédent</span>
                <strong>← {plain(prev.titre)}</strong>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={sessionHref(next)} className="sem-pager__link is-next">
                <span>Suivant</span>
                <strong>{plain(next.titre)} →</strong>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </Container>
      </section>

      {people.length > 0 ? (
        <section className="sem-faculty" aria-labelledby="sem-faculty-title">
          <Container>
            <header className="sem-faculty__head">
              <p className="sem-kicker">Intervenant{people.length > 1 ? "s" : ""}</p>
              <h2 id="sem-faculty-title" className="sem-faculty__title">
                Qui anime ce séminaire
              </h2>
            </header>
            <ul className="sem-faculty__grid">
              {people.map((p) => (
                <SpeakerCard key={p.slug} person={p} />
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      <section className="sem-calband" aria-labelledby="sem-calband-title">
        <Container className="sem-calband__inner">
          <div>
            <p className="sem-calband__index">07 — Calendrier et tarif</p>
            <h2 id="sem-calband-title" className="sem-calband__title">
              Dates, rythme et investissement.
            </h2>
            <p className="sem-calband__lead">
              Retrouvez le calendrier complet de la promotion 1 et le tarif du certificat.
            </p>
          </div>
          <div className="sem-calband__ctas">
            <Link href="/#calendrier" className="sem-calband__cta is-primary">
              Voir le calendrier
              <IconArrowRight />
            </Link>
            <Link href="/#tarif" className="sem-calband__cta">
              Voir le tarif
              <IconArrowRight />
            </Link>
          </div>
        </Container>
      </section>

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
          {plain(person.fonction)} · {plain(person.institution)}
        </p>
        {person.bio ? <p className="sem-speaker__bio">{plain(person.bio)}</p> : null}
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
    </li>
  );
}
