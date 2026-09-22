"use client";

import { useId, useState } from "react";

type Day = {
  matin: string;
  apresMidi: string;
};

type Props = {
  jour1: Day;
  jour2: Day;
  livrable?: string;
};

export function SeminarDaysSwitch({ jour1, jour2, livrable }: Props) {
  const [day, setDay] = useState<1 | 2>(1);
  const baseId = useId();
  const active = day === 1 ? jour1 : jour2;

  return (
    <div className="sem-days">
      <div className="sem-days__tabs" role="tablist" aria-label="Programme du week-end">
        <span
          className="sem-days__indicator"
          aria-hidden="true"
          style={{ transform: day === 1 ? "translateX(0%)" : "translateX(100%)" }}
        />
        {(
          [
            { id: 1 as const, label: "Jour 1", sub: "Vendredi", num: "01" },
            { id: 2 as const, label: "Jour 2", sub: "Samedi", num: "02" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`${baseId}-tab-${tab.id}`}
            aria-selected={day === tab.id}
            aria-controls={`${baseId}-panel`}
            className={`sem-days__tab ${day === tab.id ? "is-active" : ""}`}
            onClick={() => setDay(tab.id)}
          >
            <span className="sem-days__tab-num">{tab.num}</span>
            <span className="sem-days__tab-copy">
              <span className="sem-days__tab-label">{tab.label}</span>
              <span className="sem-days__tab-sub">{tab.sub}</span>
            </span>
          </button>
        ))}
      </div>

      <div
        className="sem-days__panel"
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${day}`}
        key={day}
      >
        <ol className="sem-days__timeline">
          <li className="sem-days__slot is-am">
            <span className="sem-days__rail" aria-hidden="true">
              <span className="sem-days__dot" />
              <span className="sem-days__line" />
            </span>
            <div className="sem-days__slot-body">
              <p className="sem-days__slot-kicker">Matin</p>
              <p className="sem-days__slot-text">{active.matin}</p>
            </div>
          </li>
          <li className="sem-days__slot is-pm">
            <span className="sem-days__rail" aria-hidden="true">
              <span className="sem-days__dot" />
            </span>
            <div className="sem-days__slot-body">
              <p className="sem-days__slot-kicker">Après-midi</p>
              <p className="sem-days__slot-text">{active.apresMidi}</p>
            </div>
          </li>
        </ol>

        {livrable ? (
          <aside className="sem-days__livrable">
            <p className="sem-days__livrable-kicker">Livrable du week-end</p>
            <p className="sem-days__livrable-text">{livrable}</p>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
