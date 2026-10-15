import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink, Container, KickerIcon } from "@/components/ui";
import { PriceBand } from "@/components/PriceBand";
import { SpeakerCard } from "@/components/SpeakerCard";
import { ProgrammeGrid } from "@/components/ProgrammeGrid";
import { getIntervenants } from "@/lib/cms";
import { sessionsBySpeaker } from "@/lib/speakers";
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
  IconDownload,
  IconGauge,
  IconGrid,
  IconMap,
  IconPin,
} from "@/components/icons";

type Props = { params: Promise<{ slug: string }> };
type PictureTile = { src: string; name: string; code?: string; href?: string; face?: boolean };
type StatTile = {
  icon: (props: { size?: number }) => React.JSX.Element;
  num: string;
  unit: string;
  label: string;
  dark?: boolean;
  text?: boolean;
};

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
  const bySpeaker = sessionsBySpeaker();
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
  const total = seq.length - 1;
  const day = /^(\p{L}+)\s+(\d{1,2})\s+(\p{L}+)/u.exec(plain(s.dates));
  const month = day ? (day[3].length > 4 ? `${day[3].slice(0, 3)}.` : day[3]) : "";
  const city = lieu.split(/\s+/).pop() ?? lieu;
  const faces: PictureTile[] = people
    .filter((p) => facultyHasPhoto(p))
    .slice(0, 2)
    .map((p) => ({ src: facultyPhotoSrc(p), name: plain(p.nom), href: "#intervenants", face: true }));
  const extras: StatTile[] = [
    { icon: IconMap, num: city, unit: "", label: lieu.slice(0, lieu.length - city.length).trim() || "Campus ISCAE", text: true },
    inaug
      ? { icon: IconGrid, num: String(total), unit: "séances", label: "au programme" }
      : { icon: IconGrid, num: String(i), unit: `/ ${total}`, label: "séance du cycle" },
  ];
  const tiles: (PictureTile | StatTile)[] = [
    { src: cover, name: plain(s.titre), code: sessionCode(s) },
    day
      ? { icon: IconCal, num: day[2], unit: month, label: day[1] }
      : { icon: IconCal, num: plain(s.dates), unit: "", label: plain(s.horaire) },
    { icon: IconClock, num: String(s.heures ?? ""), unit: "h", label: plain(s.horaire), dark: true },
    ...faces,
    ...extras.slice(0, 2 - faces.length),
  ];

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
                  href="/ressources/brochure"
                  variant="ghost"
                  className="sem-hero__cta-secondary"
                >
                  <IconDownload />
                  Recevoir la brochure
                </ButtonLink>
                <ButtonLink
                  href="/candidater"
                  className="sem-hero__cta-primary"
                >
                  Candidater
                  <IconArrowRight />
                </ButtonLink>
              </div>
            </div>

            <ul className="iv-faces is-programme is-seminar" aria-label="La séance en bref">
              {tiles.map((t, ti) => (
                <li key={ti} className={`iv-faces__item is-${ti + 1}`}>
                  {"src" in t ? (
                    t.href ? (
                      <Link href={t.href} className="iv-faces__link" aria-label={t.name}>
                        <Image src={t.src} alt="" fill sizes="180px" className={`iv-faces__img${t.face ? " is-face" : ""}`} />
                        {t.code ? <span className="iv-faces__code" aria-hidden>{t.code}</span> : null}
                        <span className="iv-faces__name" aria-hidden>{t.name}</span>
                      </Link>
                    ) : (
                      <span className="iv-faces__link is-current" aria-hidden>
                        <Image src={t.src} alt="" fill sizes="(min-width: 960px) 18rem, 1px" className="iv-faces__img" priority />
                        {t.code ? <span className="iv-faces__code">{t.code}</span> : null}
                        <span className="iv-faces__cover">
                          {indexLabel !== t.name ? <small>{indexLabel}</small> : null}
                          {t.name}
                        </span>
                      </span>
                    )
                  ) : (
                    <span className={`iv-faces__link iv-faces__stat${t.dark ? " is-dark" : ""}${t.text ? " is-text" : ""}`}>
                      <span className="iv-faces__stat-icon" aria-hidden="true">
                        <t.icon />
                      </span>
                      <strong>
                        {t.num}
                        <small>{t.unit}</small>
                      </strong>
                      <span>{t.label}</span>
                    </span>
                  )}
                </li>
              ))}
              <li className="iv-faces__item">
                <Link href="/candidater" className="iv-faces__link iv-faces__more is-cta">
                  <IconArrowRight />
                  <span className="iv-faces__more-label">Candidater</span>
                </Link>
              </li>
            </ul>
          </div>
        </Container>
      </section>

      <section className="sem-body">
        <Container className="sem-body__layout">
          <div className="sem-body__main">
            <div className="sem-objectif">
              <p className="sem-kicker sem-objectif__kicker"><KickerIcon label="Objectif" />Objectif</p>
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
                      <header className="sem-part__head">
                        <span className="sem-part__num">{part.n}</span>
                        <span className="sem-part__titles">
                          <span className="sem-part__kicker">Partie {Number(part.n)}</span>
                          <span className="sem-part__title">{part.label}</span>
                        </span>
                      </header>
                      <ol className="sem-part__steps">
                        <li>
                          <span className="sem-part__step">Premier temps</span>
                          <p>{part.day.matin}</p>
                        </li>
                        <li>
                          <span className="sem-part__step">Second temps</span>
                          <p>{part.day.apresMidi}</p>
                        </li>
                      </ol>
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
              <div id="intervenants" className="sem-block" aria-labelledby="sem-faculty-title">
                <h2 id="sem-faculty-title" className="sem-block__title">
                  {people.length > 1 ? "Les intervenants" : "L’intervenant"}
                </h2>
                <ul className="iv-grid sem-faculty__cards">
                  {people.map((p, i) => (
                    <li key={p.slug}>
                      <SpeakerCard person={p} index={i} sessions={bySpeaker.get(p.slug) ?? []} />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <nav className="sem-pager" aria-label="Séances adjacentes">
              {prev ? <PagerLink session={prev} dir="prev" /> : <span />}
              {next ? <PagerLink session={next} dir="next" /> : <span />}
            </nav>
          </div>

          <section className="sem-side" aria-label="En bref">
            <div className="sem-side__card">
              <header className="sem-side__head">
                <p className="sem-side__title">En bref</p>
                <span className="sem-side__code">{indexLabel}</span>
              </header>
              <dl className="sem-side__facts">
                <div>
                  <dt>
                    <IconCal />
                    Date
                  </dt>
                  <dd>{s.dates}</dd>
                </div>
                {s.horaire ? (
                  <div>
                    <dt>
                      <IconClock />
                      Horaire
                    </dt>
                    <dd>{s.horaire}</dd>
                  </div>
                ) : null}
                {s.heures ? (
                  <div>
                    <dt>
                      <IconGauge />
                      Durée
                    </dt>
                    <dd>{s.heures}&nbsp;h</dd>
                  </div>
                ) : null}
                <div>
                  <dt>
                    <IconPin />
                    Lieu
                  </dt>
                  <dd>{lieu}</dd>
                </div>
              </dl>
              {people.length ? (
                <ul className="sem-side__people" aria-label="Intervenants">
                  {people.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href="#intervenants"
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
                          <span className="sem-side__person-name">
                            {plain(p.nom)}
                          </span>
                          <span className="sem-side__person-label">
                            {plain(p.fonction)}
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
                  <IconDownload />
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

function PagerLink({
  session,
  dir,
}: {
  session: NonNullable<ReturnType<typeof sessionBySlug>>;
  dir: "prev" | "next";
}) {
  return (
    <Link href={sessionHref(session)} className={`sem-pager__link is-${dir}`}>
      <span className="sem-pager__thumb" aria-hidden>
        <Image src={seminarImage(session.numero)} alt="" fill sizes="80px" />
      </span>
      <span className="sem-pager__text">
        <strong>{plain(session.titre)}</strong>
        <em>
          {sessionLabel(session)} · {session.dates}
        </em>
        <span className="sem-pager__dir card-btn">
          {dir === "prev" ? <IconArrowRight /> : null}
          {dir === "prev" ? "Séance précédente" : "Séance suivante"}
          {dir === "next" ? <IconArrowRight /> : null}
        </span>
      </span>
    </Link>
  );
}
