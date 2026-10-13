"use client";

import Link from "next/link";
import { useState } from "react";

export type CalendarSession = {
  code: string;
  title: string;
  href: string;
  year: number;
  /** 0-based month */
  month: number;
  day: number;
  horaire?: string;
  kind: "open" | "close" | "seminar";
};

const MONTHS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];
const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const WEEKDAYS_LONG = ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."];

function monthCells(year: number, month: number) {
  const first = new Date(year, month, 1);
  const lead = (first.getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array.from({ length: lead }, () => null);
  for (let d = 1; d <= days; d++) cells.push(d);
  while (cells.length % 7) cells.push(null);
  return cells;
}

export function ProgrammeCalendar({ sessions }: { sessions: CalendarSession[] }) {
  const months = [
    ...new Map(sessions.map((s) => [`${s.year}-${s.month}`, { year: s.year, month: s.month }])).values(),
  ];
  const [active, setActive] = useState(0);
  const current = months[active];
  if (!current) return null;

  const inMonth = sessions.filter((s) => s.year === current.year && s.month === current.month);
  const byDay = new Map(inMonth.map((s) => [s.day, s]));
  const cells = monthCells(current.year, current.month);

  return (
    <div className="pcal" aria-label="Le cycle en un coup d’œil">
      <div className="pcal__head">
        <p className="pcal__title">Le cycle en un coup d’œil</p>
        <div className="pcal__tabs" role="tablist" aria-label="Mois">
          {months.map((m, i) => {
            const count = sessions.filter((s) => s.year === m.year && s.month === m.month).length;
            return (
              <button
                key={`${m.year}-${m.month}`}
                type="button"
                role="tab"
                aria-selected={i === active}
                className={`pcal__tab${i === active ? " is-active" : ""}`}
                onClick={() => setActive(i)}
              >
                {MONTHS[m.month]}
                <span>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pcal__grid" role="grid" aria-label={`${MONTHS[current.month]} ${current.year}`}>
        {WEEKDAYS.map((w, i) => (
          <span key={w} className={`pcal__wd${i >= 5 ? " is-weekend" : ""}`} aria-hidden="true">
            {w}
          </span>
        ))}
        {cells.map((d, i) => {
          const weekend = i % 7 >= 5;
          const s = d ? byDay.get(d) : undefined;
          if (!d) return <span key={`e${i}`} className="pcal__cell is-empty" aria-hidden="true" />;
          if (!s) {
            return (
              <span key={d} className={`pcal__cell${weekend ? " is-weekend" : ""}`}>
                {d}
              </span>
            );
          }
          return (
            <Link
              key={d}
              href={s.href}
              className={`pcal__cell is-session is-${s.kind}`}
              title={`${s.title}${s.horaire ? ` · ${s.horaire}` : ""}`}
            >
              <span className="pcal__d">{d}</span>
              <span className="pcal__code">{s.code}</span>
            </Link>
          );
        })}
      </div>

      <ol className="pcal__list">
        {inMonth.map((s) => (
          <li key={`${s.month}-${s.day}-${s.code}`}>
            <Link href={s.href} className={`pcal__item is-${s.kind}`}>
              <span className="pcal__item-date">
                {WEEKDAYS_LONG[new Date(s.year, s.month, s.day).getDay()]} {s.day}
              </span>
              <span className="pcal__item-code">{s.code}</span>
              <span className="pcal__item-title">{s.title}</span>
              {s.horaire ? <span className="pcal__item-time">{s.horaire}</span> : null}
            </Link>
          </li>
        ))}
      </ol>

      <p className="pcal__legend">
        <span className="is-open" /> Ouverture
        <span className="is-seminar" /> Séance
        <span className="is-close" /> Soutenance
        <span className="is-weekend" /> Week-end
      </p>
    </div>
  );
}
