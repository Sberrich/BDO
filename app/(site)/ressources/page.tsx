import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PubCard } from "@/components/PubCard";
import { ButtonLink, Container, KickerIcon } from "@/components/ui";
import { IconArrowRight, IconBook, IconPlay } from "@/components/icons";
import { getVideos } from "@/lib/cms";
import { groupPlaylists } from "@/lib/playlists";
import { RESOURCE_COVERS, RESOURCES_MENU } from "@/lib/content";

export const metadata: Metadata = {
  title: "Ressources",
  description: "Brochure, Baromètre BDO des DAF, livre blanc et playlists vidéo du certificat CFO 4.0.",
};

export default async function RessourcesPage() {
  const docs = RESOURCES_MENU.filter((r) => r.cover);
  const playlists = groupPlaylists(await getVideos());

  return (
    <>
      <section className="sem-hero" aria-labelledby="res-title">
        <Container className="sem-hero__inner">
          <nav className="sem-hero__crumbs" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span>Ressources</span>
          </nav>
          <div className="sem-hero__grid-layout">
            <div className="sem-hero__copy">
              <p className="sem-hero__index">
                <span className="sem-hero__badge"><KickerIcon label="Ressources" bare />Ressources</span>
                {docs.length} documents · Insights
              </p>
              <h1 id="res-title" className="sem-hero__title">
                Les publications qui documentent le programme
              </h1>
              <p className="sem-hero__lead">
                Brochure, Baromètre, livre blanc et playlists vidéo : chaque ressource a sa page dédiée.
              </p>
              <div className="sem-hero__ctas">
                <ButtonLink href="/ressources/brochure" className="sem-hero__cta-primary">
                  Recevoir la brochure
                  <IconArrowRight />
                </ButtonLink>
                <ButtonLink href="/playlists" variant="ghost" className="sem-hero__cta-secondary">
                  Voir les playlists
                </ButtonLink>
              </div>
            </div>
            <Link href="/ressources/brochure" className="res-hero__book" aria-label="La brochure du certificat">
              <span className="res-hero__glow" aria-hidden />
              <span className="res-hero__page">
                <Image
                  src={RESOURCE_COVERS.brochure}
                  alt=""
                  width={636}
                  height={900}
                  priority
                  sizes="(min-width: 960px) 16rem, 50vw"
                />
              </span>
              <span className="res-hero__tag">Brochure 2026 · PDF</span>
            </Link>
          </div>
        </Container>
      </section>

      <section className="res-list" aria-labelledby="res-list-title">
        <Container>
          <h2 id="res-list-title" className="sr-only">
            Les documents
          </h2>
          <ul className="res-list__grid">
            {docs.map((r) => (
              <li key={r.href}>
                <PubCard
                  href={r.href}
                  title={r.label}
                  text={r.desc}
                  action="Recevoir le document"
                  cover={r.cover}
                  landscape={r.icon === "barometre"}
                />
              </li>
            ))}
          </ul>

          <Link href="/playlists" className="res-insights">
            <span className="res-insights__icon" aria-hidden>
              <IconPlay />
            </span>
            <span className="res-insights__copy">
              <span className="res-insights__title">Le certificat en vidéo</span>
              <span className="res-insights__go">
                Voir les vidéos
                <IconArrowRight />
              </span>
            </span>
            {playlists.length ? (
              <ul className="res-insights__list">
                {playlists.map((p) => (
                  <li key={p.id}>
                    <span className="res-insights__meta">
                      {p.videos.length} vidéo{p.videos.length > 1 ? "s" : ""}
                    </span>
                    <span className="res-insights__name">{p.titre}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </Link>
        </Container>
      </section>

      <section className="cta-band" aria-labelledby="res-cta-title">
        <Container>
          <div className="cta-band__inner">
            <div>
              <p className="cta-band__kicker"><KickerIcon label="Promotion 1 · rentrée le 30 octobre 2026" />Promotion 1 · rentrée le 30 octobre 2026</p>
              <h2 id="res-cta-title" className="cta-band__title">
                Une question sur le certificat ?
              </h2>
            </div>
            <div className="cta-band__actions">
              <ButtonLink href="/faq" variant="ghost" className="sem-hero__cta-secondary">
                <IconBook />
                Consulter la FAQ
              </ButtonLink>
              <ButtonLink href="/candidater" className="sem-hero__cta-primary">
                Candidater
                <IconArrowRight />
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
