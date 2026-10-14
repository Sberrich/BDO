"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { IconArrowRight, IconLinkedIn } from "@/components/icons";

export type SpeakerSession = { code: string; titre: string; label: string; href: string };

export type SpeakerProfileData = {
  slug: string;
  name: string;
  role: string;
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
      LinkedIn
    </a>
  );
}

export function SpeakerProfile({ person }: { person: SpeakerProfileData }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = `${person.slug}-profile-title`;

  return (
    <>
      <button
        type="button"
        className="iv-card__more"
        aria-haspopup="dialog"
        onClick={() => ref.current?.showModal()}
      >
        Lire la suite
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
            {person.photo ? (
              <Image src={person.photo} alt="" fill sizes="(min-width: 760px) 18rem, 100vw" className="iv-modal__img" />
            ) : (
              <span className={`faculty-mono tone-${person.tone} iv-modal__mono`} aria-hidden>
                {person.initials}
              </span>
            )}
          </div>

          <div className="iv-modal__body">
            <h2 id={titleId} className="iv-modal__name">{person.name}</h2>
            <p className="iv-modal__role">{person.role}</p>
            {person.bio ? <p className="iv-modal__bio">{person.bio}</p> : null}

            {person.sessions.length ? (
              <div className="iv-modal__sessions">
                <p className="iv-modal__label">Intervient sur</p>
                <ul>
                  {person.sessions.map((s) => (
                    <li key={s.href}>
                      <Link href={s.href} className="iv-modal__session">
                        <span className="iv-modal__code">{s.code}</span>
                        <span>
                          <span className="iv-modal__session-title">{s.titre}</span>
                          <span className="iv-modal__session-date">{s.label}</span>
                        </span>
                        <IconArrowRight />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {person.linkedin ? (
              <div className="iv-modal__foot">
                <LinkedInButton href={person.linkedin} name={person.name} />
              </div>
            ) : null}
          </div>
        </div>
      </dialog>
    </>
  );
}
