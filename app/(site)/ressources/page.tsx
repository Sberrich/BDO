import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { IconLayers } from "@/components/icons";
import { ButtonLink, Container, PageHero } from "@/components/ui";
import { RESOURCES_MENU } from "@/lib/content";

export const metadata: Metadata = {
  title: "Ressources",
  description: "Brochure, Baromètre BDO des DAF, livre blanc et Insights du certificat CFO 4.0.",
};

export default function RessourcesPage() {
  return (
    <>
      <PageHero
        motif="mesh"
        kicker="Ressources"
        title="Les publications qui documentent le programme"
        lead="Brochure, Baromètre, livre blanc et analyses — chaque document a sa page dédiée."
      />
      <section className="bg-cream py-[clamp(2.5rem,6vw,4.5rem)]">
        <Container>
          <ul className="resource-grid">
            {RESOURCES_MENU.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="resource-card group">
                  <span className="resource-card__cover" aria-hidden>
                    {r.cover ? (
                      <Image
                        src={r.cover}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 40vw, 180px"
                        className="object-cover object-top"
                      />
                    ) : (
                      <span className="resource-card__cover-fallback">
                        <IconLayers size={28} />
                      </span>
                    )}
                  </span>
                  <span className="resource-card__body">
                    <span className="resource-card__title">{r.label}</span>
                    <span className="resource-card__desc">{r.desc}</span>
                    <span className="resource-card__cta">Consulter →</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/candidater">Candidater</ButtonLink>
            <ButtonLink href="/faq" variant="secondary">
              Consulter la FAQ
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
