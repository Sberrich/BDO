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
        kicker="Ressources"
        title="Les publications qui documentent le programme"
        lead="Brochure, Baromètre, livre blanc et analyses — chaque document a sa page dédiée."
      />
      <section className="bg-cream py-[clamp(2.5rem,6vw,4.5rem)]">
        <Container>
          <ul className="doc-others__grid">
            {RESOURCES_MENU.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="doc-card doc-card--lg">
                  <span className="doc-card__cover" aria-hidden>
                    {r.cover ? (
                      <Image src={r.cover} alt="" fill sizes="140px" className="object-cover object-top" />
                    ) : (
                      <span className="resource-card__cover-fallback">
                        <IconLayers size={28} />
                      </span>
                    )}
                  </span>
                  <span className="doc-card__body">
                    <span className="doc-card__title">{r.label}</span>
                    <span className="doc-card__desc">{r.desc}</span>
                    <span className="doc-card__more">
                      {r.href.startsWith("/insights") ? "Lire les analyses" : "Recevoir le document"}{" "}
                      <span aria-hidden="true">→</span>
                    </span>
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
