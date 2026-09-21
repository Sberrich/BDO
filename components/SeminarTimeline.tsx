"use client";

import Link from "next/link";
import { useState } from "react";
import { data } from "@/lib/content";
import { seminarPath, plain } from "@/lib/text";

export function SeminarTimeline() {
  const seminars = data.seminaires.seminaires;
  const [active, setActive] = useState(0);

  return (
    <div className="seminar-timeline">
      {/* Desktop: horizontal rail */}
      <div className="hidden lg:block">
        <div className="relative">
          <div
            className="absolute left-0 right-0 top-[1.15rem] h-px bg-line"
            aria-hidden
          />
          <ol className="relative grid grid-cols-8 gap-2">
            {seminars.map((s, i) => {
              const isActive = active === i;
              return (
                <li key={s.numero} className="min-w-0">
                  <button
                    type="button"
                    className="group flex w-full flex-col items-start text-left outline-none"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    aria-current={isActive ? "step" : undefined}
                  >
                    <span
                      className={`relative z-[1] flex h-9 w-9 items-center justify-center border text-xs font-bold tabular-nums transition-all duration-300 ${
                        isActive
                          ? "border-navy bg-navy text-white"
                          : "border-line bg-white text-muted group-hover:border-navy group-hover:text-navy"
                      }`}
                    >
                      {String(s.numero).padStart(2, "0")}
                    </span>
                    <span
                      className={`mt-3 line-clamp-2 text-[0.8125rem] font-bold leading-snug tracking-[-0.01em] transition-colors ${
                        isActive ? "text-ink" : "text-muted"
                      }`}
                    >
                      {plain(s.titre)}
                    </span>
                    <span className="mt-1 text-[11px] font-medium text-muted/80">{s.dates}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div
          className="mt-8 overflow-hidden border border-line bg-white"
          aria-live="polite"
        >
          <div
            key={active}
            className="seminar-timeline__panel grid gap-6 p-7 md:grid-cols-[minmax(0,1.1fr)_auto] md:items-end"
          >
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-blue">
                Séminaire {String(seminars[active].numero).padStart(2, "0")}
                <span className="mx-2 text-line">·</span>
                <span className="text-muted">{seminars[active].dates}</span>
              </p>
              <h3 className="mt-2 text-[1.375rem] font-bold leading-tight tracking-[-0.025em] text-ink">
                {plain(seminars[active].titre)}
              </h3>
              <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-muted">
                {plain(seminars[active].sousTitre)}
              </p>
            </div>
            <Link
              href={seminarPath(seminars[active])}
              className="inline-flex items-center gap-2 self-start text-sm font-bold text-blue transition hover:text-blue-dark md:self-end"
            >
              Voir le séminaire
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile / tablet: vertical timeline */}
      <ol className="relative space-y-0 border-l border-line lg:hidden">
        {seminars.map((s, i) => {
          const isActive = active === i;
          return (
            <li key={s.numero} className="relative pl-6">
              <span
                className={`absolute -left-[5px] top-5 h-2.5 w-2.5 border transition-colors ${
                  isActive ? "border-navy bg-navy" : "border-line bg-white"
                }`}
                aria-hidden
              />
              <button
                type="button"
                className={`w-full border-b border-line py-5 text-left outline-none transition-colors ${
                  isActive ? "bg-cream/60" : ""
                }`}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                aria-expanded={isActive}
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                  {String(s.numero).padStart(2, "0")} · {s.dates}
                </p>
                <p className="mt-1 text-base font-bold tracking-[-0.015em] text-ink">{plain(s.titre)}</p>
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="mt-2 text-sm leading-relaxed text-muted">{plain(s.sousTitre)}</p>
                    <Link
                      href={seminarPath(s)}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-blue"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Voir le séminaire →
                    </Link>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
