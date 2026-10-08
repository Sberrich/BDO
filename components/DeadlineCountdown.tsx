"use client";

import { useEffect, useState } from "react";

/** Fin des candidatures : vendredi 30 octobre 2026, 23 h 59 (heure du Maroc). */
export const APPLICATION_DEADLINE = "2026-10-30T23:59:59+01:00";

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function remaining(target: number): Parts | null {
  const ms = target - Date.now();
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export function DeadlineCountdown({ className = "" }: { className?: string }) {
  const target = new Date(APPLICATION_DEADLINE).getTime();
  const [parts, setParts] = useState<Parts | null | undefined>(undefined);

  useEffect(() => {
    const tick = () => setParts(remaining(target));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  if (parts === null) {
    return (
      <div className={`countdown is-closed ${className}`}>
        <p className="countdown__label">Candidatures closes pour la promotion 1</p>
      </div>
    );
  }

  const units = [
    { value: parts?.days, label: "jours" },
    { value: parts?.hours, label: "h" },
    { value: parts?.minutes, label: "min" },
    { value: parts?.seconds, label: "s" },
  ];

  return (
    <div
      className={`countdown ${className}`}
      role="timer"
      aria-label={
        parts
          ? `Clôture des candidatures dans ${parts.days} jours, ${parts.hours} heures et ${parts.minutes} minutes`
          : "Clôture des candidatures le 30 octobre 2026"
      }
    >
      <p className="countdown__label">
        Clôture des candidatures
        <span>Vendredi 30 octobre · 23 h 59</span>
      </p>
      <ol className="countdown__units" aria-hidden="true">
        {units.map((u) => (
          <li key={u.label} className="countdown__unit">
            <span className="countdown__value">
              {u.value === undefined ? "--" : pad(u.value)}
            </span>
            <span className="countdown__unit-label">{u.label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
