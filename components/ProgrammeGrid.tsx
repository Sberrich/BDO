import Image from "next/image";
import Link from "next/link";
import { allSessions, sessionHref, type Seminaire } from "@/lib/content";
import { IconArrowRight, IconJury, IconPlay, seminarIcons } from "@/components/icons";
import { plain, seminarImage, seminarMediaIndex } from "@/lib/text";

type Props = {
  limit?: number;
  /** Hide the session currently being viewed (seminar detail pages). */
  excludeNumero?: number;
};

function daysLabel(s: Seminaire) {
  const n = s.heures ?? (s.numero === 0 ? 3 : 6);
  return `${n}\u00a0h`;
}

function SeminarGlyph({ numero }: { numero: number }) {
  const i = seminarMediaIndex(numero) - 1;
  const Icon = seminarIcons[Math.max(0, Math.min(seminarIcons.length - 1, i))];
  return Icon ? <Icon /> : null;
}

export function ProgrammeGrid({ limit, excludeNumero }: Props) {
  const items = allSessions()
    .filter((s) => excludeNumero == null || s.numero !== excludeNumero)
    .slice(0, limit);
  const opening = items.find((s) => s.numero === 0);
  const seminars = items.filter((s) => s.numero > 0);
  const finale = seminars.find((s) => s.numero === 8);
  const main = seminars.filter((s) => s.numero !== 8);

  return (
    <div className="prog-board">
      <div className={`prog-board__body ${opening ? "" : "is-solo"}`}>
        {opening ? (
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
            <span className="prog-board__open-pattern" aria-hidden="true" />
            <span className="prog-board__open-glow" aria-hidden="true" />
            <span className="prog-board__open-accent" aria-hidden="true" />
            <span className="prog-board__open-mark" aria-hidden="true">
              <IconPlay />
            </span>
            <span className="prog-board__open-top">
              <span className="prog-board__open-tag">Ouverture</span>
              <span className="prog-board__open-badge">00</span>
            </span>
            <span className="prog-board__open-date">{opening.dates}</span>
            <h3 className="prog-board__open-title">{plain(opening.titre)}</h3>
            <p className="prog-board__open-sub">{plain(opening.sousTitre)}</p>
            <span className="prog-board__open-go">
              Voir la séance
              <IconArrowRight />
            </span>
          </Link>
        ) : null}

        <div className="prog-board__rail">
          <p className="prog-board__rail-label">Les séminaires</p>
          <ol className="prog-board__list">
            {main.map((s) => (
              <li key={s.numero}>
                <Link href={sessionHref(s)} className="prog-board__row">
                  <span className="prog-board__thumb" aria-hidden="true">
                    <Image
                      src={seminarImage(s.numero)}
                      alt=""
                      width={56}
                      height={56}
                      className="prog-board__thumb-img"
                    />
                    <span className="prog-board__thumb-icon">
                      <SeminarGlyph numero={s.numero} />
                    </span>
                  </span>
                  <span className="prog-board__main">
                    <span className="prog-board__meta">
                      <span className="prog-board__n-inline">{String(s.numero).padStart(2, "0")}</span>
                      <span className="prog-board__date">{s.dates}</span>
                      <span className="prog-board__days">{daysLabel(s)}</span>
                    </span>
                    <span className="prog-board__name">{plain(s.titre)}</span>
                  </span>
                  <span className="prog-board__arrow" aria-hidden="true">
                    <IconArrowRight />
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          {finale ? (
            <Link href={sessionHref(finale)} className="prog-board__finale">
              <span className="prog-board__finale-media" aria-hidden="true">
                <Image
                  src={seminarImage(8)}
                  alt=""
                  fill
                  sizes="120px"
                  className="prog-board__finale-img"
                />
              </span>
              <span className="prog-board__finale-tag">Clôture · jury</span>
              <span className="prog-board__finale-n" aria-hidden="true">
                <IconJury />
              </span>
              <span className="prog-board__finale-body">
                <span className="prog-board__finale-date">{finale.dates}</span>
                <span className="prog-board__finale-name">{plain(finale.titre)}</span>
              </span>
              <span className="prog-board__finale-go" aria-hidden="true">
                <IconArrowRight />
              </span>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
