"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { IconArrowRight, IconCal, IconLinkedIn } from "@/components/icons";

export type SpeakerSession = {
  code: string;
  titre: string;
  label: string;
  when: string;
  image: string;
  href: string;
};

export type SpeakerProfileData = {
  slug: string;
  index: string;
  name: string;
  fonction: string;
  institution: string;
  bio: string;
  photo: string | null;
  initials: string;
  tone: string;
  linkedin: string | null;
  sessions: SpeakerSession[];
};

export function LinkedInButton({ href, name }: { href: string; name: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="li-btn"
      aria-label={`Profil LinkedIn de ${name} (nouvel onglet)`}
    >
      <IconLinkedIn size={15} />
      <span className="li-btn__label">LinkedIn</span>
    </a>
  );
}

export function SpeakerProfile({
  person,
  label = "Lire la suite",
  className = "iv-card__more",
}: {
  person: SpeakerProfileData;
  label?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = `${person.slug}-profile-title`;
  const n = person.sessions.length;

  return (
    <>
      <button
        type="button"
        className={className}
        aria-haspopup="dialog"
        onClick={() => ref.current?.showModal()}
      >
        {label}
        <span className="sr-only"> : {person.name}</span>
        <IconArrowRight />
      </button>

      <dialog
        ref={ref}
        className="iv-modal"
        aria-labelledby={titleId}
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
      >
        <div className="iv-modal__panel">
          <button
            type="button"
            className="iv-modal__close"
            aria-label="Fermer"
            onClick={() => ref.current?.close()}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <div className="iv-modal__media">
            <span className="iv-modal__index" aria-hidden>
              Intervenant <b>{person.index}</b>
            </span>
            {person.photo ? (
              <span className="iv-modal__portrait">
                <Image src={person.photo} alt="" fill sizes="(min-width: 760px) 28rem, 100vw" className="iv-modal__img" />
              </span>
            ) : (
              <span className={`faculty-mono tone-${person.tone} iv-modal__mono`} aria-hidden>
                {person.initials}
              </span>
            )}
          </div>

          <div className="iv-modal__body">
            <header className="iv-modal__head">
              <h2 id={titleId} className="iv-modal__name">{person.name}</h2>
              <p className="iv-modal__role">{person.fonction}</p>
              <div className="iv-modal__meta">
                <ul className="iv-modal__chips">
                  {person.institution ? <li>{person.institution}</li> : null}
                  {n ? (
                    <li className="is-count">
                      <IconCal />
                      {n} séance{n > 1 ? "s" : ""}
                    </li>
                  ) : null}
                </ul>
                {person.linkedin ? (
                  <a
                    href={person.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="li-icon iv-modal__li"
                    aria-label={`Profil LinkedIn de ${person.name} (nouvel onglet)`}
                    title="LinkedIn"
                  >
                    <IconLinkedIn size={16} />
                  </a>
                ) : null}
              </div>
            </header>

            <div className="iv-modal__scroll">
              {person.bio ? (
                <section className="iv-modal__section">
                  <p className="iv-modal__label">Parcours</p>
                  <p className="iv-modal__bio">{person.bio}</p>
                </section>
              ) : null}
  
              {n ? (
                <section className="iv-modal__section">
                  <p className="iv-modal__label">Intervient sur</p>
                  <ul className="iv-modal__sessions">
                    {person.sessions.map((s) => (
                      <li key={s.href}>
                        <Link href={s.href} className="iv-modal__session">
                          <span className="iv-modal__thumb">
                            <Image src={s.image} alt="" fill sizes="64px" />
                            <span>{s.code}</span>
                          </span>
                          <span className="iv-modal__session-text">
                            <span className="iv-modal__session-kicker">{s.label}</span>
                            <span className="iv-modal__session-title">{s.titre}</span>
                            {s.when ? <span className="iv-modal__session-date">{s.when}</span> : null}
                          </span>
                          <IconArrowRight />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>

            <footer className="iv-modal__foot">
              <Link href="/candidater" className="iv-modal__cta">
                Candidater
                <IconArrowRight />
              </Link>
            </footer>
          </div>
        </div>
      </dialog>
    </>
  );
}
