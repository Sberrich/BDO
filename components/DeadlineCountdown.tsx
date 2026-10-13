"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/** Fin des candidatures : jeudi 22 octobre 2026, 23 h 59 (heure du Maroc). */
export const APPLICATION_DEADLINE = "2026-10-22T23:59:59+01:00";

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

/**
 * Static pages can be served long after they were rendered: this runs as soon as the HTML
 * is parsed, before hydration, so the first paint already shows the real remaining time.
 */
const syncScript = (target: number) =>
  `(function(){var o=document.currentScript&&document.currentScript.previousElementSibling;if(!o)return;var s=Math.max(0,Math.floor((${target}-Date.now())/1000));var v=[Math.floor(s/86400),Math.floor(s%86400/3600),Math.floor(s%3600/60),s%60];o.querySelectorAll(".countdown__value").forEach(function(e,i){e.textContent=String(v[i]).padStart(2,"0")})})()`;

const noSubscribe = () => () => {};

export function DeadlineCountdown({ className = "" }: { className?: string }) {
  const target = new Date(APPLICATION_DEADLINE).getTime();
  const [parts, setParts] = useState<Parts | null>(() => remaining(target));
  const serverHtml = useSyncExternalStore(noSubscribe, () => false, () => true);

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
    { value: parts.days, label: "jours" },
    { value: parts.hours, label: "h" },
    { value: parts.minutes, label: "min" },
    { value: parts.seconds, label: "s" },
  ];

  return (
    <div
      className={`countdown ${className}`}
      role="timer"
      aria-label={`Clôture des candidatures dans ${parts.days} jours, ${parts.hours} heures et ${parts.minutes} minutes`}
      suppressHydrationWarning
    >
      <p className="countdown__label">
        Clôture des candidatures
        <span>Jeudi 22 octobre · 23 h 59</span>
      </p>
      <ol className="countdown__units" aria-hidden="true">
        {units.map((u) => (
          <li key={u.label} className="countdown__unit">
            <span className="countdown__value" suppressHydrationWarning>
              {pad(u.value)}
            </span>
            <span className="countdown__unit-label">{u.label}</span>
          </li>
        ))}
      </ol>
      {serverHtml && <script dangerouslySetInnerHTML={{ __html: syncScript(target) }} />}
    </div>
  );
}
