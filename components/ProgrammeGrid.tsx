import Link from "next/link";
import { allSessions, sessionHref } from "@/lib/content";
import { plain } from "@/lib/text";

export function ProgrammeGrid({ limit }: { limit?: number }) {
  const items = allSessions().slice(0, limit);
  const opening = items.find((s) => s.numero === 0);
  const seminars = items.filter((s) => s.numero > 0);

  return (
    <div className="prog-board">
      {opening ? (
        <Link href={sessionHref(opening)} className="prog-board__open">
          <span className="prog-board__open-tag">Ouverture</span>
          <span className="prog-board__open-date">{opening.dates}</span>
          <h3 className="prog-board__open-title">{plain(opening.titre)}</h3>
          <p className="prog-board__open-sub">{plain(opening.sousTitre)}</p>
          <span className="prog-board__open-go">
            Voir la séance <span aria-hidden="true">→</span>
          </span>
        </Link>
      ) : null}

      <ol className="prog-board__list">
        {seminars.map((s) => (
          <li key={s.numero}>
            <Link href={sessionHref(s)} className="prog-board__row">
              <span className="prog-board__n" aria-hidden="true">
                {String(s.numero).padStart(2, "0")}
              </span>
              <span className="prog-board__main">
                <span className="prog-board__date">{s.dates}</span>
                <span className="prog-board__name">{plain(s.titre)}</span>
              </span>
              <span className="prog-board__arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
