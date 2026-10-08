import type { Metadata } from "next";
import Link from "next/link";
import { CalendarTable } from "@/components/CalendarTable";
import { DeadlineCountdown } from "@/components/DeadlineCountdown";
import { LeadForm } from "@/components/LeadForm";
import { PriceBand } from "@/components/PriceBand";
import { ProgrammeGrid, splitDate } from "@/components/ProgrammeGrid";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";
import { IconArrowRight, IconCal, IconClock, IconMap } from "@/components/icons";
import { allSessions, data, SHOW, sessionHref, type Seminaire } from "@/lib/content";
import { plain } from "@/lib/text";

export const metadata: Metadata = {
  title: "Le programme",
  description: "Huit séminaires, une conférence inaugurale et un projet de transformation mené sur votre entreprise.",
};

function byMonth(sessions: Seminaire[]) {
  const months: { month: string; sessions: { s: Seminaire; day: string; weekday: string }[] }[] = [];
  for (const s of sessions) {
    const { month, day, weekday } = splitDate(plain(s.dates));
    const last = months[months.length - 1];
    const entry = { s, day, weekday };
    if (last && last.month === month) last.sessions.push(entry);
    else months.push({ month, sessions: [entry] });
  }
  return months;
}

export default function ProgrammePage() {
  const sessions = allSessions();
  const seminars = sessions.filter((s) => s.numero > 0);
  const months = byMonth(sessions);

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
                Huit séminaires, un projet mené sur votre entreprise
              </h1>
              <p className="sem-hero__lead">
                Une conférence inaugurale, huit séminaires et un workshop, jusqu’à la présentation des projets du
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
                  <span>Casablanca</span>
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

            <div className="prog-cal" aria-label="Le cycle en un coup d’œil">
              <p className="prog-cal__title">Le cycle en un coup d’œil</p>
              {months.map((m) => (
                <div key={m.month} className="prog-cal__month">
                  <p className="prog-cal__name">
                    {m.month}
                    <span>
                      {m.sessions.length} séance{m.sessions.length > 1 ? "s" : ""}
                    </span>
                  </p>
                  <ul className="prog-cal__days">
                    {m.sessions.map(({ s, day, weekday }) => (
                      <li key={s.numero}>
                        <Link
                          href={sessionHref(s)}
                          className={`prog-cal__day ${s.numero === 0 ? "is-open" : ""} ${s.numero === 8 ? "is-close" : ""}`}
                          title={plain(s.titre)}
                        >
                          <span className="prog-cal__d">{day}</span>
                          <span className="prog-cal__w">{weekday}</span>
                          <span className="prog-cal__n">{s.numero === 0 ? "IN" : `S${s.numero}`}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <p className="prog-cal__legend">
                <span className="is-open" /> Ouverture
                <span className="is-close" /> Présentation des projets
              </p>
            </div>
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
              Huit séminaires, huit pièces de votre feuille de route
            </h2>
            <p className="prog-pieces__lead">
              Chaque séminaire produit une pièce appliquée à votre entreprise. Assemblées, elles forment le projet
              présenté au dernier séminaire.
            </p>
          </header>
          <ol className="prog-pieces__grid">
            {seminars.map((s) => (
              <li key={s.numero}>
                <Link href={sessionHref(s)} className="prog-piece">
                  <span className="prog-piece__num">{String(s.numero).padStart(2, "0")}</span>
                  <span className="prog-piece__title">{plain(s.titre)}</span>
                  {s.livrable ? <span className="prog-piece__out">{plain(s.livrable)}</span> : null}
                  <span className="prog-piece__more">
                    Voir le séminaire <IconArrowRight />
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
