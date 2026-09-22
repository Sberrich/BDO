import Link from "next/link";
import { CalendarRow, data } from "@/lib/content";
import { IconArrowRight, IconCal, IconClock, IconMap } from "@/components/icons";
import { appHref, plain } from "@/lib/text";

type Kind = "open" | "pause" | "finale" | "seminar";

const MONTHS: Record<string, string> = {
  janvier: "01",
  février: "02",
  fevrier: "02",
  mars: "03",
  avril: "04",
  mai: "05",
  juin: "06",
  juillet: "07",
  août: "08",
  aout: "08",
  septembre: "09",
  octobre: "10",
  novembre: "11",
  décembre: "12",
  decembre: "12",
};

const MONTH_LABELS: Record<string, string> = {
  "2026-10": "Octobre 2026",
  "2026-11": "Novembre 2026",
  "2026-12": "Décembre 2026",
  "2027-01": "Janvier 2027",
  "2027-02": "Février 2027",
  "2027-03": "Mars 2027",
  "2027-04": "Avril 2027",
};

function sessionKind(row: CalendarRow): Kind {
  if (row.pause) return "pause";
  if (/inaugurale/i.test(row.seance)) return "open";
  if (/Séminaire\s*8/i.test(row.seance)) return "finale";
  return "seminar";
}

function sessionIndex(row: CalendarRow): string | null {
  const m = row.seance.match(/Séminaire\s*(\d+)/i);
  if (m) return m[1].padStart(2, "0");
  if (/inaugurale/i.test(row.seance)) return null;
  return null;
}

function phaseLabel(kind: Kind): string {
  if (kind === "open") return "Ouverture";
  if (kind === "finale") return "Clôture";
  if (kind === "pause") return "Interruption";
  return "Séminaire";
}

function monthKeyFromDates(dates: string): string {
  const year = dates.match(/20\d{2}/)?.[0] ?? "2026";
  const lower = dates.toLowerCase();
  for (const [name, mm] of Object.entries(MONTHS)) {
    if (lower.includes(name)) return `${year}-${mm}`;
  }
  return `${year}-00`;
}

function groupByMonth(rows: CalendarRow[]) {
  const groups: { key: string; label: string; items: CalendarRow[] }[] = [];
  for (const row of rows) {
    const key = monthKeyFromDates(row.dates);
    const last = groups[groups.length - 1];
    if (!last || last.key !== key) {
      groups.push({
        key,
        label: MONTH_LABELS[key] ?? row.dates,
        items: [row],
      });
    } else {
      last.items.push(row);
    }
  }
  return groups;
}

export function CalendarTable() {
  const cal = data.calendrier;
  const rows = cal.seances as unknown as CalendarRow[];
  const groups = groupByMonth(rows);
  const totalDays = rows.reduce((sum, r) => sum + (r.pause ? 0 : r.jours), 0);
  const seminarCount = rows.filter((r) => !r.pause && !/inaugurale/i.test(r.seance)).length;
  const weekends = seminarCount;

  return (
    <div className="cal">
      <aside className="cal__aside" aria-label="Repères du calendrier">
        <div className="cal__aside-glow" aria-hidden="true" />
        <div className="cal__aside-head">
          <p className="cal__aside-kicker">Promotion 1</p>
          <p className="cal__aside-badge" aria-hidden="true">
            2026 → 2027
          </p>
        </div>
        <p className="cal__aside-title">Le rythme en un coup d’œil</p>

        <ul className="cal__stats">
          <li>
            <span className="cal__stat-icon" aria-hidden="true">
              <IconCal />
            </span>
            <span>
              <strong>{totalDays}</strong>
              <span className="cal__stat-label">jours de formation</span>
            </span>
          </li>
          <li>
            <span className="cal__stat-icon" aria-hidden="true">
              <IconClock />
            </span>
            <span>
              <strong>{weekends}</strong>
              <span className="cal__stat-label">week-ends · ven.–sam.</span>
            </span>
          </li>
          <li>
            <span className="cal__stat-icon" aria-hidden="true">
              <IconMap />
            </span>
            <span>
              <strong>Rabat · Casablanca</strong>
              <span className="cal__stat-label">présentiel + coaching</span>
            </span>
          </li>
        </ul>

        <ul className="cal__legend" aria-label="Légende">
          <li>
            <span className="cal__legend-dot is-open" /> Ouverture
          </li>
          <li>
            <span className="cal__legend-dot is-seminar" /> Séminaire
          </li>
          <li>
            <span className="cal__legend-dot is-pause" /> Pause
          </li>
          <li>
            <span className="cal__legend-dot is-finale" /> Clôture
          </li>
        </ul>

        <p className="cal__aside-note">{plain(cal.note)}</p>
        <Link href="/candidater" className="cal__aside-cta">
          Réserver ma place
          <IconArrowRight />
        </Link>
      </aside>

      <div className="cal__timeline">
        <ol className="cal__months">
          {groups.map((group, gi) => (
            <li key={group.key} className="cal__month">
              <div className="cal__month-head">
                <h3 className="cal__month-label">{group.label}</h3>
                <span className="cal__month-count">
                  {group.items.filter((x) => !x.pause).length} séance
                  {group.items.filter((x) => !x.pause).length > 1 ? "s" : ""}
                </span>
              </div>
              <ol className="cal__sessions">
                {group.items.map((s, i) => {
                  const kind = sessionKind(s);
                  const index = sessionIndex(s);
                  const href = s.lien && !s.pause ? appHref(s.lien) : null;
                  const mark =
                    index ?? (kind === "open" ? "IN" : kind === "finale" ? "08" : "—");
                  const isLastOverall =
                    gi === groups.length - 1 && i === group.items.length - 1;

                  const inner = (
                    <>
                      <span className="cal__spine" aria-hidden="true">
                        <span className="cal__dot" />
                        {!isLastOverall ? <span className="cal__line" /> : null}
                      </span>

                      <span className="cal__card">
                        <span className="cal__wash" aria-hidden="true" />
                        <span className="cal__mark" aria-hidden="true">
                          {mark}
                        </span>
                        <span className="cal__topline">
                          <span className="cal__phase">{phaseLabel(kind)}</span>
                          {!s.pause ? (
                            <span className="cal__duration">
                              {s.jours}&nbsp;j
                            </span>
                          ) : null}
                        </span>

                        <span className="cal__date">{s.dates}</span>
                        <span className="cal__title">{s.contenu}</span>
                        <span className="cal__seance">{s.seance}</span>

                        {href ? (
                          <span className="cal__cta">
                            Voir la séance
                            <IconArrowRight />
                          </span>
                        ) : null}
                      </span>
                    </>
                  );

                  return (
                    <li
                      key={`${s.seance}-${s.dates}`}
                      className={`cal__session is-${kind}`}
                    >
                      {href ? (
                        <Link href={href} className="cal__hit">
                          {inner}
                        </Link>
                      ) : (
                        <div className="cal__hit is-static">{inner}</div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
