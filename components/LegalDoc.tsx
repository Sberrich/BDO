import type { ReactNode } from "react";
import Link from "next/link";
import { ButtonLink, Container, PageHero } from "@/components/ui";

export type LegalSection = {
  id: string;
  title: string;
  body: ReactNode;
};

const LEGAL_NAV = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/cgu", label: "CGU" },
  { href: "/confidentialite", label: "Confidentialité" },
] as const;

export function LegalDoc({
  kicker = "Informations légales",
  title,
  lead,
  sections,
  currentPath,
}: {
  kicker?: string;
  title: string;
  lead: ReactNode;
  sections: LegalSection[];
  currentPath: string;
}) {
  return (
    <>
      <PageHero kicker={kicker} title={title} lead={lead} />

      <section className="legal-page">
        <Container className="legal-page__inner">
          <aside className="legal-page__aside" aria-label="Navigation légale">
            <p className="legal-page__aside-kicker">Sur cette page</p>
            <nav className="legal-page__toc">
              <ul>
                {sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`}>{s.title}</a>
                  </li>
                ))}
              </ul>
            </nav>

            <p className="legal-page__aside-kicker is-docs">Documents</p>
            <nav className="legal-page__docs" aria-label="Autres pages légales">
              <ul>
                {LEGAL_NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={item.href === currentPath ? "is-current" : undefined}
                      aria-current={item.href === currentPath ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className="legal-page__content">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} className="legal-block">
                <header className="legal-block__head">
                  <span className="legal-block__index" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="legal-block__title">{s.title}</h2>
                </header>
                <div className="legal-block__body">{s.body}</div>
              </section>
            ))}

            <div className="legal-page__cta">
              <p className="legal-page__cta-title">Une question ?</p>
              <p className="legal-page__cta-lead">
                L’équipe pédagogique répond sous 24 heures ouvrées.
              </p>
              <div className="legal-page__cta-actions">
                <ButtonLink href="/a-propos#contact">Nous écrire</ButtonLink>
                <ButtonLink href="/admissions#rappel" variant="ghost">
                  Être rappelé
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
