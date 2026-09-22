"use client";

import Image from "next/image";
import { plain } from "@/lib/text";

export type MediaItem = {
  nom: string;
  lien: string;
  logo: string;
  domaine: string;
  titre: string;
  description: string;
  apercu: string;
};

export function MediaPressStrip({ items }: { items: readonly MediaItem[] }) {
  return (
    <ul className="press-logos">
      {items.map((m) => (
        <li key={m.nom} className="press-logos__item">
          <a
            href={m.lien}
            target="_blank"
            rel="noopener noreferrer"
            className="press-logo"
            aria-label={`${plain(m.nom)} — ${plain(m.titre)}`}
          >
            <span className="press-logo__mark">
              <Image
                src={m.logo}
                alt=""
                width={240}
                height={64}
                className="press-logo__img"
              />
            </span>
            <span className="press-logo__meta">
              <span className="press-logo__name">{plain(m.nom)}</span>
              <span className="press-logo__host">{m.domaine}</span>
            </span>

            <span className="press-preview" aria-hidden="true">
              <span className="press-preview__chrome">
                <span className="press-preview__dots" />
                <span className="press-preview__url">{m.domaine}</span>
              </span>
              <span className="press-preview__shot">
                <Image
                  src={m.apercu}
                  alt=""
                  width={640}
                  height={360}
                  className="press-preview__img"
                />
              </span>
              <span className="press-preview__body">
                <span className="press-preview__title">{plain(m.titre)}</span>
                <span className="press-preview__desc">{plain(m.description)}</span>
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
