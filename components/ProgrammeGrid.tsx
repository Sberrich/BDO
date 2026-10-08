import Link from "next/link";
import { allSessions, sessionHref, type Seminaire } from "@/lib/content";
import { IconArrowRight, IconPlay } from "@/components/icons";
import { plain } from "@/lib/text";

type Props = {
  limit?: number;
  /** Hide the session currently being viewed (seminar detail pages). */
  excludeNumero?: number;
};

function hours(s: Seminaire) {
  return s.heures ?? (s.numero === 0 ? 3 : 6);
}

function hoursLabel(s: Seminaire) {
  return `${hours(s)}\u00a0h`;
}

/** "Samedi 31 octobre 2026" → { weekday: "Sam.", day: "31", month: "octobre" } */
export function splitDate(dates: string) {
  const [weekday = "", day = "", month = "", year = ""] = dates.split(" ");
  return { weekday: `${weekday.slice(0, 3)}.`, day, month, year };
}

export function ProgrammeGrid({ limit, excludeNumero }: Props) {
  const items = allSessions()
    .filter((s) => excludeNumero == null || s.numero !== excludeNumero)
    .slice(0, limit);
  const opening = items.find((s) => s.numero === 0);
  const seminars = items.filter((s) => s.numero > 0);

  const months: { month: string; year: string; sessions: Seminaire[] }[] = [];
  for (const s of seminars) {
    const { month, year } = splitDate(plain(s.dates));
    const last = months[months.length - 1];
    if (last && last.month === month) last.sessions.push(s);
    else months.push({ month, year, sessions: [s] });
  }

  const all = opening ? [opening, ...seminars] : seminars;
  const first = all[0] ? splitDate(plain(all[0].dates)) : null;
  const last = all.length ? splitDate(plain(all[all.length - 1].dates)) : null;
  const slots = [
    ...new Set(
      seminars
        .filter((s) => s.horaire)
        .map(
          (s) =>
            `${splitDate(plain(s.dates)).weekday.replace(".", "")}. ${s.horaire}`,
        ),
    ),
  ];
  const stats = [
    {
      value: String(seminars.length),
      label: seminars.length > 1 ? "séminaires" : "séminaire",
    },
    {
      value: `${all.reduce((n, s) => n + hours(s), 0)} h`,
      label: "de formation",
    },
  ];

  return (
    <div className="prog-board">
      <div className={`prog-board__body ${opening ? "" : "is-solo"}`}>
        {opening ? (
          <div className="prog-board__aside">
            <Link href={sessionHref(opening)} className="prog-board__open">
              <span className="prog-board__open-media" aria-hidden="true">
                <video
                  className="prog-board__open-video"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster="/images/home/hero.png"
                >
                  <source src="/videos/seminaires/0.mp4" type="video/mp4" />
                </video>
              </span>
              <span className="prog-board__open-veil" aria-hidden="true" />
              <span className="prog-board__open-top">
                <span className="prog-board__open-tag">Ouverture du cycle</span>
                <span className="prog-board__open-mark" aria-hidden="true">
                  <IconPlay />
                </span>
              </span>
              <span className="prog-board__open-bottom">
                <span className="prog-board__open-date">
                  {opening.dates}
                  {opening.horaire ? ` · ${opening.horaire}` : ""}
                </span>
                <h3 className="prog-board__open-title">
                  {plain(opening.titre)}
                </h3>
                <span className="prog-board__open-sub">
                  {plain(opening.sousTitre)}
                </span>
                <span className="prog-board__open-go">
                  Voir la séance
                  <IconArrowRight />
                </span>
              </span>
            </Link>
            <div className="prog-board__sum">
              <p className="prog-board__sum-title">Le cycle en chiffres</p>
              <dl className="prog-board__stats">
                {stats.map((x) => (
                  <div key={x.label}>
                    <dt>{x.label}</dt>
                    <dd>{x.value}</dd>
                  </div>
                ))}
              </dl>
              {first && last ? (
                <p className="prog-board__sum-line">
                  Du {first.day} {first.month} au {last.day} {last.month}{" "}
                  {last.year}
                </p>
              ) : null}
              {slots.length ? (
                <ul className="prog-board__slots">
                  {slots.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="prog-board__rail">
          {months.map((m) => (
            <div key={m.month} className="prog-board__month">
              <p className="prog-board__month-label">
                <span>
                  {m.month} {m.year}
                </span>
                <span className="prog-board__month-count">
                  {m.sessions.length} séance{m.sessions.length > 1 ? "s" : ""}
                </span>
              </p>
              <ol className="prog-board__list">
                {m.sessions.map((s) => {
                  const d = splitDate(plain(s.dates));
                  const finale = s.numero === 8;
                  return (
                    <li key={s.numero}>
                      <Link
                        href={sessionHref(s)}
                        className={`prog-board__row${finale ? " is-finale" : ""}`}
                      >
                        <span className="prog-board__day" aria-hidden="true">
                          <span className="prog-board__day-num">{d.day}</span>
                          <span className="prog-board__day-name">
                            {d.weekday}
                          </span>
                        </span>
                        <span className="prog-board__main">
                          <span className="prog-board__meta">
                            {finale
                              ? "Clôture du cycle"
                              : `Séminaire ${String(s.numero).padStart(2, "0")}`}
                            <span aria-hidden="true">·</span>
                            {s.horaire ? plain(s.horaire) : hoursLabel(s)}
                          </span>
                          <span className="prog-board__name">
                            {plain(s.titre)}
                          </span>
                          <span className="sr-only">{s.dates}</span>
                        </span>
                        <span className="prog-board__arrow" aria-hidden="true">
                          <IconArrowRight />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
