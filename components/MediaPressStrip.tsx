import Image from "next/image";
import type { ReactNode } from "react";
import { IconArrowUpRight } from "@/components/icons";
import { LoopCarousel } from "@/components/LoopCarousel";
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

function PressCard({ m }: { m: MediaItem }) {
  return (
    <a
      href={m.lien}
      target="_blank"
      rel="noopener noreferrer"
      className="press-card"
      aria-label={`${plain(m.nom)} : ${plain(m.titre)} (nouvel onglet)`}
    >
      <span className="press-card__logo">
        <Image src={m.logo} alt="" width={240} height={64} className="press-card__img" />
      </span>
      <span className="press-card__title">{plain(m.titre)}</span>
      <span className="press-card__foot">
        <span className="press-card__src">
          <span className="press-card__name">{plain(m.nom)}</span>
          <span className="press-card__host">{m.domaine}</span>
        </span>
        <span className="press-card__go" aria-hidden="true">
          <IconArrowUpRight />
        </span>
      </span>
    </a>
  );
}

/** Press carousel: swipe or arrows, autoplay one card every 2 s, endless loop. */
export function MediaPressStrip({ items, children }: { items: readonly MediaItem[]; children?: ReactNode }) {
  return (
    <LoopCarousel
      heading={children}
      slides={items.map((m) => (
        <PressCard key={m.nom} m={m} />
      ))}
      labels={items.map((m) => `Afficher ${plain(m.nom)}`)}
      prevLabel="Média précédent"
      nextLabel="Média suivant"
    />
  );
}
