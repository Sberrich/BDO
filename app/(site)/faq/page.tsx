import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/FaqList";
import { ButtonLink, Container } from "@/components/ui";
import {
  IconArrowRight,
  IconMail,
  IconPhone,
  IconWhatsApp,
} from "@/components/icons";
import { BRAND, data } from "@/lib/content";
import { plain } from "@/lib/text";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Les réponses aux questions sur le certificat CFO 4.0.",
};

export default function FaqPage() {
  const total = data.faq.groupes.reduce((n, g) => n + g.questions.length, 0);
  const c = data.site.contact;

  return (
    <>
      <section className="sem-hero" aria-labelledby="faq-title">
        <Container className="sem-hero__inner">
          <nav className="sem-hero__crumbs" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span>FAQ</span>
          </nav>
          <div className="sem-hero__grid-layout">
            <div className="sem-hero__copy">
              <p className="sem-hero__index">
                <span className="sem-hero__badge">FAQ</span>
                {total} questions · {data.faq.groupes.length} thèmes
              </p>
              <h1 id="faq-title" className="sem-hero__title">
                Les questions que vous vous posez
              </h1>
              <p className="sem-hero__lead">
                Les réponses, regroupées par thème — du programme au tarif.
              </p>
            </div>
            <aside className="faq-help" aria-labelledby="faq-help-title">
              <p id="faq-help-title" className="faq-help__title">
                Pas trouvé votre réponse ?
              </p>
              <p className="faq-help__lead">
                L’équipe vous répond directement.
              </p>
              <ul className="faq-help__list">
                <li>
                  <a
                    href={BRAND.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="faq-help__link"
                  >
                    <span className="faq-help__icon is-wa" aria-hidden>
                      <IconWhatsApp />
                    </span>
                    WhatsApp
                    <IconArrowRight />
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${plain(c.email)}`}
                    className="faq-help__link"
                  >
                    <span className="faq-help__icon" aria-hidden>
                      <IconMail />
                    </span>
                    {plain(c.email)}
                    <IconArrowRight />
                  </a>
                </li>
                <li>
                  <Link href="/admissions#rappel" className="faq-help__link">
                    <span className="faq-help__icon" aria-hidden>
                      <IconPhone />
                    </span>
                    Être rappelé sous 24 h
                    <IconArrowRight />
                  </Link>
                </li>
              </ul>
            </aside>
          </div>
        </Container>
      </section>

      <section className="faq-page">
        <Container className="faq-page__inner">
          <FaqList />
        </Container>
      </section>

      <section className="cta-band" aria-labelledby="faq-cta-title">
        <Container>
          <div className="cta-band__inner">
            <div>
              <p className="cta-band__kicker">
                Candidatures ouvertes jusqu’au{" "}
                {plain(data.site.admission.dateLimite)}
              </p>
              <h2 id="faq-cta-title" className="cta-band__title">
                Vous avez la réponse qu’il vous fallait ?
              </h2>
            </div>
            <div className="cta-band__actions">
              <ButtonLink href="/candidater" className="sem-hero__cta-primary">
                Candidater
                <IconArrowRight />
              </ButtonLink>
              <ButtonLink
                href="/admissions#rappel"
                variant="ghost"
                className="sem-hero__cta-secondary"
              >
                Être rappelé
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
