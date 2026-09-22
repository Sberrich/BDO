"use client";

import Image from "next/image";
import { WireframeGlobe } from "@/components/WireframeGlobe";
import { Container } from "@/components/ui";

type Props = {
  kicker?: string;
  title: string;
  lead?: string;
};

export function IntervenantsHero({
  kicker = "Les intervenants",
  title,
  lead,
}: Props) {
  return (
    <header className="iv-hero" aria-labelledby="iv-hero-title">
      <div className="iv-hero__bg" aria-hidden="true">
        <Image
          src="/images/heroes/trophee-partenariat.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="iv-hero__bg-img"
        />
        <span className="iv-hero__veil" />
      </div>

      <div className="iv-hero__orbits" aria-hidden="true">
        <span className="iv-hero__orb is-left">
          <WireframeGlobe size={520} intensity={1} />
        </span>
        <span className="iv-hero__orb is-right">
          <WireframeGlobe size={380} reverse intensity={0.85} />
        </span>
      </div>

      <Container className="iv-hero__inner">
        <p className="iv-hero__kicker">{kicker}</p>
        <h1 id="iv-hero-title" className="iv-hero__title">
          {title}
        </h1>
        {lead ? <p className="iv-hero__lead">{lead}</p> : null}
        <p className="iv-hero__credit">
          Esthétique inspirée du Trophée BDO des CFOs
        </p>
      </Container>
    </header>
  );
}
