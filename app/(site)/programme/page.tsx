import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarTable } from "@/components/CalendarTable";
import { DeadlineCountdown } from "@/components/DeadlineCountdown";
import { LeadForm } from "@/components/LeadForm";
import { PriceBand } from "@/components/PriceBand";
import { ProgrammeGrid } from "@/components/ProgrammeGrid";
import { ButtonLink, Container, KickerIcon, SectionHeading } from "@/components/ui";
import { IconArrowRight } from "@/components/icons";
import { allSessions, data, SHOW, sessionHref, type Seminaire } from "@/lib/content";
import { plain, seminarImage, sessionCode } from "@/lib/text";

export const metadata: Metadata = {
  title: "Le programme",
  description: "Six séminaires, un workshop, une conférence inaugurale et un projet de transformation mené sur votre entreprise.",
};

/** "IN", "S1"…"S7", "WS", "CL" */
function calCode(s: Seminaire) {
  const code = sessionCode(s);
  return /^\d+$/.test(code) ? `S${Number(code)}` : code;
}

export default function ProgrammePage() {
  const sessions = allSessions();
  const seminars = sessions.filter((s) => s.numero > 0);

  return (
    <>
      <section className="sem-hero prog-hero" aria-labelledby="prog-title">
        <Container className="sem-hero__inner">
          <nav className="sem-hero__crumbs" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span>Le programme</span>
          </nav>

          <div className="sem-hero__grid-layout">
            <div className="sem-hero__copy">
              <p className="sem-hero__index">
                <span className="sem-hero__badge"><KickerIcon label="Promotion 1" bare />Promotion 1</span>
                {sessions.length} séances · octobre → décembre 2026
              </p>
              <h1 id="prog-title" className="sem-hero__title">
                Neuf séances, un projet mené sur votre entreprise
              </h1>
              <p className="sem-hero__lead">
                Une conférence inaugurale, six séminaires et un workshop, jusqu’à la soutenance des projets du
                26 décembre.
              </p>
              <DeadlineCountdown className="prog-hero__countdown" />
              <div className="sem-hero__ctas">
                <ButtonLink href="/candidater" className="sem-hero__cta-primary">
                  Candidater
                  <IconArrowRight />
                </ButtonLink>
                <ButtonLink href="/ressources/brochure" variant="ghost" className="sem-hero__cta-secondary">
                  Recevoir la brochure
                </ButtonLink>
              </div>
            </div>

            <ul className="iv-faces is-programme" aria-label="Les séances du programme">
              {sessions.slice(0, 8).map((s, i) => (
                <li key={s.numero} className={`iv-faces__item is-${i + 1}`}>
                  <Link href={sessionHref(s)} className="iv-faces__link" aria-label={plain(s.titre)}>
                    <Image src={seminarImage(s.numero)} alt="" fill sizes="180px" className="iv-faces__img" />
                    <span className="iv-faces__code" aria-hidden>
                      {calCode(s)}
                    </span>
                    <span className="iv-faces__name" aria-hidden>
                      {plain(s.titre)}
                    </span>
                  </Link>
                </li>
              ))}
              <li className="iv-faces__item">
                <a href="#seances" className="iv-faces__link iv-faces__more">
                  <span className="iv-faces__more-n">{sessions.length}</span>
                  <span className="iv-faces__more-label">Toutes les séances</span>
                </a>
              </li>
            </ul>
          </div>
        </Container>
      </section>

      <section id="objectifs" className="prog-goals" aria-labelledby="prog-goals-title">
        <Container className="prog-goals__inner">
          <div className="prog-goals__media" aria-hidden="true">
            <Image
              src="/images/home/conference.png"
              alt=""
              fill
              sizes="(min-width: 900px) 26rem, 90vw"
            />
          </div>
          <div className="prog-goals__copy">
            <p className="sem-kicker">Objectifs</p>
            <h2 id="prog-goals-title" className="prog-goals__title">
              {data.site.objectifs.titre}
            </h2>
            <p className="prog-goals__lead">{data.site.objectifs.chapeau}</p>
            <ol className="prog-goals__list">
              {data.site.objectifs.liste.map((o, i) => (
                <li key={o.titre} className="prog-goals__item">
                  <span className="prog-goals__num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="prog-goals__item-title">{o.titre}</span>
                    <span className="prog-goals__item-text">{o.texte}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <section id="seances" className="bg-cream py-[clamp(2.5rem,6vw,4.5rem)]">
        <Container>
          <SectionHeading kicker="Le calendrier" title="Les séances, date par date" />
          <div className="mt-8">
            <ProgrammeGrid />
          </div>
        </Container>
      </section>

      <section id="projet" className="prog-pieces" aria-labelledby="prog-pieces-title">
        <Container>
          <header className="prog-pieces__head">
            <p className="sem-kicker">Le projet</p>
            <h2 id="prog-pieces-title" className="prog-pieces__title">
              Huit pièces pour votre feuille de route
            </h2>
            <p className="prog-pieces__lead">
              Chaque séance produit une pièce appliquée à votre entreprise. Ensemble, elles forment le
              projet soutenu le 26 décembre.
            </p>
          </header>
          <ol className="prog-pieces__grid">
            {seminars.map((s) => (
              <li key={s.numero}>
                <Link href={sessionHref(s)} className="prog-piece">
                  <span className="prog-piece__media" aria-hidden="true">
                    <Image src={seminarImage(s.numero)} alt="" fill sizes="(min-width: 1100px) 17rem, (min-width: 640px) 45vw, 90vw" />
                  </span>
                  <span className="prog-piece__num">{sessionCode(s)}</span>
                  <span className="prog-piece__title">{plain(s.titre)}</span>
                  {s.livrable ? <span className="prog-piece__out">{plain(s.livrable)}</span> : null}
                  <span className="prog-piece__more">
                    Voir la séance <IconArrowRight />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <PriceBand />

      {SHOW.parcours ? (
      <section id="fil-rouge" className="bg-white py-[clamp(2.5rem,6vw,4.5rem)]">
        <Container>
          <SectionHeading kicker="Le fil rouge" title="De la candidature au jury" />
          <ol className="mt-8 grid gap-4 md:grid-cols-2">
            {data.site.filRouge.map((s, i) => (
              <li key={s.etape} className="card-lift flex gap-4 rounded-md border border-line bg-white p-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream text-sm font-bold text-blue">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-bold">{s.etape}</h3>
                  <p className="mt-1 text-sm text-muted">{s.texte}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>
      ) : null}
      {SHOW.calendrier ? (
      <section className="bg-cream py-[clamp(2.5rem,6vw,4.5rem)]">
        <Container>
          <SectionHeading kicker="Calendrier" title={data.calendrier.intitule} lead={data.calendrier.chapeau} />
          <div className="mt-8">
            <CalendarTable />
          </div>
        </Container>
      </section>
      ) : null}
      {SHOW.sessionInfo ? (
      <section id="session-information" className="bg-white py-[clamp(2.5rem,6vw,4.5rem)]">
        <Container className="grid items-start gap-10 md:grid-cols-2">
          <div>
            <SectionHeading kicker="Session d’information" title={data.site.sessionInfo.titre} lead={data.site.sessionInfo.texte} />
            <ul className="mt-4 space-y-2 text-muted">
              {data.site.sessionInfo.creneaux.map((slot) => (
                <li key={slot.id} className="tick flex gap-3">
                  {plain(slot.libelle)}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-muted">{plain(data.site.sessionInfo.replay)}</p>
          </div>
          <div className="rounded-md bg-cream p-6 sm:p-8">
            <LeadForm kind="session" prefix="ps" />
          </div>
        </Container>
      </section>
      ) : null}
    </>
  );
}
