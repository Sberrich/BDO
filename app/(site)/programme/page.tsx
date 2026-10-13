import type { Metadata } from "next";
import Link from "next/link";
import { CalendarTable } from "@/components/CalendarTable";
import { DeadlineCountdown } from "@/components/DeadlineCountdown";
import { LeadForm } from "@/components/LeadForm";
import { PriceBand } from "@/components/PriceBand";
import { ProgrammeCalendar, type CalendarSession } from "@/components/ProgrammeCalendar";
import { ProgrammeGrid, splitDate } from "@/components/ProgrammeGrid";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";
import { IconArrowRight, IconCal, IconClock, IconMap } from "@/components/icons";
import { allSessions, data, SHOW, sessionHref, type Seminaire } from "@/lib/content";
import { plain, sessionCode } from "@/lib/text";

export const metadata: Metadata = {
  title: "Le programme",
  description: "Six séminaires, un workshop, une conférence inaugurale et un projet de transformation mené sur votre entreprise.",
};

/** "IN", "S1"…"S6", "WS", "CL" */
function calCode(s: Seminaire) {
  const code = sessionCode(s);
  return /^\d+$/.test(code) ? `S${Number(code)}` : code;
}

const MONTH_INDEX: Record<string, number> = {
  janvier: 0, février: 1, mars: 2, avril: 3, mai: 4, juin: 5,
  juillet: 6, août: 7, septembre: 8, octobre: 9, novembre: 10, décembre: 11,
};

function calendarSessions(sessions: Seminaire[]): CalendarSession[] {
  return sessions.flatMap((s) => {
    const { day, month, year } = splitDate(plain(s.dates));
    const m = MONTH_INDEX[month.toLowerCase()];
    if (m == null) return [];
    return [{
      code: calCode(s),
      title: plain(s.titre),
      href: sessionHref(s),
      year: Number(year),
      month: m,
      day: Number(day),
      horaire: s.horaire ? plain(s.horaire) : undefined,
      kind: s.numero === 0 ? "open" : s.code === "CL" ? "close" : "seminar",
    }];
  });
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
                <span className="sem-hero__badge">Promotion 1</span>
                {sessions.length} séances · octobre → décembre 2026
              </p>
              <h1 id="prog-title" className="sem-hero__title">
                Neuf séances, un projet mené sur votre entreprise
              </h1>
              <p className="sem-hero__lead">
                Une conférence inaugurale, six séminaires et un workshop, jusqu’à la soutenance des projets du
                26 décembre.
              </p>
              <ul className="sem-hero__meta" aria-label="Repères">
                <li>
                  <IconCal />
                  <span>Du 30 octobre au 26 décembre 2026</span>
                </li>
                <li>
                  <IconClock />
                  <span>Ven. 15 h – 21 h · Sam. 9 h – 16 h</span>
                </li>
                <li>
                  <IconMap />
                  <span>Campus ISCAE Casablanca · ouverture au campus ISCAE de Rabat</span>
                </li>
              </ul>
              <div className="sem-hero__ctas">
                <ButtonLink href="/candidater" className="sem-hero__cta-primary">
                  Candidater
                  <IconArrowRight />
                </ButtonLink>
                <ButtonLink href="/ressources/brochure" variant="ghost" className="sem-hero__cta-secondary">
                  Recevoir la brochure
                </ButtonLink>
              </div>
              <DeadlineCountdown className="prog-hero__countdown" />
            </div>

            <ProgrammeCalendar sessions={calendarSessions(sessions)} />
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

      <section className="prog-pieces" aria-labelledby="prog-pieces-title">
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
            <LeadForm kind="session" prefix="ps" submitVariant="secondary" />
          </div>
        </Container>
      </section>
      ) : null}
    </>
  );
}
