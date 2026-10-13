import type { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/lib/content";
import { ButtonLink, Container, Kicker } from "@/components/ui";

export const metadata: Metadata = { title: "Page introuvable", robots: { index: false } };

const LINKS = [
  { href: "/admissions", label: "Admissions et tarif" },
  { href: "/candidater", label: "Déposer une candidature" },
  { href: "/faq", label: "Questions fréquentes" },
  { href: "/ressources", label: "Brochure et publications" },
];

export default function NotFound() {
  return (
    <section className="bg-cream py-24">
      <Container className="max-w-xl text-center">
        <Kicker>Erreur 404</Kicker>
        <h1 className="mt-3 font-display text-4xl font-bold">Cette page n’existe pas</h1>
        <p className="mt-4 text-muted">Le lien est ancien ou incorrect.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/">Retour à l’accueil</ButtonLink>
          <ButtonLink href="/programme" variant="secondary">Le programme</ButtonLink>
        </div>
        <ul className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-semibold">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-blue underline underline-offset-4">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted">
          Besoin d’aide ? Écrivez à{" "}
          <a href={`mailto:${BRAND.email}`} className="font-semibold text-blue">
            {BRAND.email}
          </a>
          .
        </p>
      </Container>
    </section>
  );
}
