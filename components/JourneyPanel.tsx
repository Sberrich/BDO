"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useState,
  type KeyboardEvent,
} from "react";
import { BRAND } from "@/lib/content";
import { Container } from "@/components/ui";

type Seminar = {
  n: string;
  tag: string;
  short: string;
  title: string;
  start: string;
  shortDate: string;
  longDate: string;
  apport?: string;
};

const SEMINARS: Seminar[] = [
  {
    n: "01",
    tag: "Data",
    short: "Big data",
    title: "Big data & data analytics",
    start: "2026-10-31",
    shortDate: "31 oct.",
    longDate: "Samedi 31 octobre 2026 · 9 h – 16 h",
  },
  {
    n: "02",
    tag: "IA",
    short: "IA",
    title: "I.A – aspects conceptuels & pratiques",
    start: "2026-11-13",
    shortDate: "13 nov.",
    longDate: "Vendredi 13 novembre 2026 · 15 h – 21 h",
  },
  {
    n: "03",
    tag: "Cloud",
    short: "Cloud",
    title: "Cloud",
    start: "2026-11-14",
    shortDate: "14 nov.",
    longDate: "Samedi 14 novembre 2026 · 9 h – 16 h",
  },
  {
    n: "WS",
    tag: "Workshop",
    short: "Workshop",
    title: "Management digital, aspects entrepreneurial et éthique",
    start: "2026-11-27",
    shortDate: "27 nov.",
    longDate: "Vendredi 27 novembre 2026 · 15 h – 21 h",
  },
  {
    n: "04",
    tag: "Trésorerie",
    short: "Cash management",
    title: "Digitalisation du cash management avec vue sur IoT",
    start: "2026-11-28",
    shortDate: "28 nov.",
    longDate: "Samedi 28 novembre 2026 · 9 h – 16 h",
  },
  {
    n: "05",
    tag: "Blockchain",
    short: "Blockchain",
    title: "Blockchain",
    start: "2026-12-11",
    shortDate: "11 déc.",
    longDate: "Vendredi 11 décembre 2026 · 15 h – 21 h · séance commune avec les crypto-actifs",
  },
  {
    n: "06",
    tag: "Crypto",
    short: "Crypto-actifs",
    title: "Crypto-actifs",
    start: "2026-12-11",
    shortDate: "11 déc.",
    longDate: "Vendredi 11 décembre 2026 · 15 h – 21 h · séance commune avec la blockchain",
  },
  {
    n: "07",
    tag: "Cyber",
    short: "Cybersécurité",
    title: "Cybersécurité",
    start: "2026-12-12",
    shortDate: "12 déc.",
    longDate: "Samedi 12 décembre 2026 · 9 h – 16 h",
  },
  {
    n: "08",
    tag: "Jury",
    short: "Projets & jury",
    title: "Présentation des projets de transformation digitale",
    start: "2026-12-26",
    shortDate: "26 déc.",
    longDate:
      "Samedi 26 décembre 2026 · 9 h – 16 h · soutenance devant le jury ISCAE × BDO",
    apport:
      "Vous présentez votre feuille de route de transformation et la défendez devant le jury ISCAE × BDO.",
  },
];

const DEADLINE = "2026-12-26T23:59:00";
const PLACES = 25;

const MONTH_LABELS: Record<string, string> = {
  "2026-10": "Octobre 2026",
  "2026-11": "Novembre 2026",
  "2026-12": "Décembre 2026",
  "2027-01": "Janvier 2027",
  "2027-02": "Février 2027",
  "2027-03": "Mars 2027",
  "2027-04": "Avril 2027",
};

function monthKey(start: string) {
  return start.slice(0, 7);
}

function daysUntilDeadline(now: Date) {
  return Math.ceil((new Date(DEADLINE).getTime() - now.getTime()) / 86400000);
}

function groupByMonth(list: Seminar[]) {
  const groups: {
    key: string;
    label: string;
    items: { seminar: Seminar; index: number }[];
  }[] = [];
  list.forEach((seminar, index) => {
    const key = monthKey(seminar.start);
    const last = groups[groups.length - 1];
    if (!last || last.key !== key) {
      groups.push({
        key,
        label: MONTH_LABELS[key] ?? key,
        items: [{ seminar, index }],
      });
    } else {
      last.items.push({ seminar, index });
    }
  });
  return groups;
}

export function JourneyPanel() {
  const [open, setOpen] = useState(0);
  const [days, setDays] = useState<number | null>(null);
  const titleId = useId();
  const groups = groupByMonth(SEMINARS);

  useEffect(() => {
    queueMicrotask(() => setDays(daysUntilDeadline(new Date())));
  }, []);

  const select = useCallback((i: number) => {
    setOpen(Math.min(SEMINARS.length - 1, Math.max(0, i)));
  }, []);

  const onListKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        select(open + 1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        select(open - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        select(0);
      } else if (e.key === "End") {
        e.preventDefault();
        select(SEMINARS.length - 1);
      }
    },
    [open, select],
  );

  const closed = days !== null && days < 0;
  const active = SEMINARS[open];

  return (
    <section id="parcours" className="parcours" aria-labelledby={titleId}>
      <Container className="parcours__inner">
        <div className="parcours-intro">
          <div className="parcours-intro__copy">
            <p className="parcours-intro__meta">
              Oct. → déc. 2026 · Casablanca · 9 séances
            </p>
            <h2 id={titleId} className="parcours-intro__title">
              Huit séminaires,
              <br />
              <span className="parcours-intro__accent">un fil rouge</span>.
            </h2>
          </div>
          <p className="parcours-intro__lead">
            Le vendredi de 15 h à 21 h ou le samedi de 9 h à 16 h. Chaque
            séance ajoute une pièce à votre projet — mené sur votre propre
            direction financière — jusqu&apos;à la soutenance du 26 décembre 2026.
          </p>
        </div>

        <div className="parcours-board">
          <div
            className="parcours-index"
            role="listbox"
            aria-label="Les huit séminaires"
            aria-activedescendant={`parcours-opt-${active.n}`}
            tabIndex={0}
            onKeyDown={onListKeyDown}
          >
            <span className="parcours-index__thread" aria-hidden="true" />

            {groups.map((group) => (
              <div key={group.key} className="parcours-index__month">
                <p className="parcours-index__month-label">{group.label}</p>
                {group.items.map(({ seminar: s, index: i }) => {
                  const isOpen = open === i;
                  const isLast = i === SEMINARS.length - 1;
                  return (
                    <div
                      key={s.n}
                      id={`parcours-opt-${s.n}`}
                      role="option"
                      aria-selected={isOpen}
                      className={`parcours-entry ${isOpen ? "is-open" : ""} ${isLast ? "is-finale" : ""}`}
                    >
                      <button
                        type="button"
                        className="parcours-entry__hit"
                        aria-expanded={isOpen}
                        aria-controls={`parcours-panel-${s.n}`}
                        onClick={() => select(i)}
                      >
                        <span
                          className="parcours-entry__knot"
                          aria-hidden="true"
                        />
                        <span className="parcours-entry__num">{s.n}</span>
                        <span className="parcours-entry__main">
                          <span className="parcours-entry__tag">{s.tag}</span>
                          <span className="parcours-entry__name">
                            {s.title}
                          </span>
                        </span>
                        <span className="parcours-entry__date">
                          {s.shortDate}
                        </span>
                      </button>

                      <div
                        id={`parcours-panel-${s.n}`}
                        className="parcours-entry__body"
                        hidden={!isOpen}
                        aria-hidden={!isOpen}
                      >
                        <p className="parcours-entry__when">
                          {s.longDate} · Casablanca
                        </p>
                        {s.apport ? (
                          <p className="parcours-entry__apport">{s.apport}</p>
                        ) : null}
                        <a
                          href={BRAND.brochure}
                          className="parcours-entry__pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Programme détaillé (PDF)
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <aside className="parcours-aside" aria-label="Candidatures">
            <p className="parcours-aside__kicker">Candidatures</p>
            <p className="parcours-aside__count">
              {days === null ? (
                <span aria-hidden="true">…</span>
              ) : closed ? (
                "Clos"
              ) : (
                <>
                  J<span className="parcours-aside__minus">−</span>
                  {days}
                </>
              )}
            </p>
            <p className="parcours-aside__caption">
              {closed ? "Candidatures closes" : "avant la clôture"}
            </p>
            <p className="parcours-aside__note">
              Samedi 26 décembre 2026
              <br />
              {PLACES} places · promotion 1
            </p>
            <Link href="/candidater" className="parcours-aside__cta">
              Candidater
              <span aria-hidden="true">→</span>
            </Link>
            <p className="parcours-aside__thread-note">
              Le fil rouge relie les séances à un seul projet défendu
              devant le jury ISCAE × BDO.
            </p>
          </aside>
        </div>
      </Container>
    </section>
  );
}
