import type { Metadata } from "next";
import Link from "next/link";
import {
  IconBarChart,
  IconBook,
  IconFileText,
  IconLayers,
} from "@/components/icons";
import { ButtonLink, Container, PageHero } from "@/components/ui";
import { RESOURCES_MENU } from "@/lib/content";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Ressources",
  description: "Brochure, Baromètre BDO des DAF, livre blanc et Insights du certificat CFO 4.0.",
};

function iconFor(icon: (typeof RESOURCES_MENU)[number]["icon"]): ReactNode {
  switch (icon) {
    case "brochure":
      return <IconBook />;
    case "barometre":
      return <IconBarChart size={18} />;
    case "livreblanc":
      return <IconFileText size={18} />;
    case "insights":
      return <IconLayers size={18} />;
    default:
      return <IconFileText size={18} />;
  }
}

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
          <ul className="grid gap-4 sm:grid-cols-2">
            {RESOURCES_MENU.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="group flex h-full gap-4 rounded-md border border-line bg-white p-5 shadow-[var(--shadow-xs)] transition hover:-translate-y-0.5 hover:border-blue/35 hover:shadow-[var(--shadow-md)]"
                >
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-blue/10 text-blue">
                    {iconFor(r.icon)}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-lg font-bold text-ink transition group-hover:text-blue">{r.label}</span>
                    <span className="mt-1 block text-sm text-muted">{r.desc}</span>
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
