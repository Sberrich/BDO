import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaqList } from "@/components/FaqList";
import { ButtonLink, Container, KickerIcon } from "@/components/ui";
import {
  IconArrowRight,
  IconArrowUpRight,
  IconClock,
  IconGrid,
  IconMail,
  IconPhone,
  IconSearch,
  IconWhatsApp,
} from "@/components/icons";
import { filterFaqByTarif, getFaqGroups, type FaqGroupData } from "@/lib/cms";
import { BRAND, data, SHOW } from "@/lib/content";
import { plain } from "@/lib/text";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Les réponses aux questions sur le certificat CFO 4.0.",
};

type Tile =
  | { src: string }
  | { icon: (props: { size?: number }) => React.JSX.Element; num: string; unit: string; label: string; dark?: boolean }
  | { icon: (props: { size?: number }) => React.JSX.Element; title: string; label: string; href: string; external?: boolean; wa?: boolean };

function staticFaqGroups(): FaqGroupData[] {
  return data.faq.groupes.map((g) => ({
    id: g.id,
    titre: g.titre,
    questions: g.questions.map((q) => ({
      id: q.id,
      q: q.q,
      court: q.court,
      r: q.r,
      lien: q.lien ? { texte: q.lien.texte, href: q.lien.href } : null,
      accueil: q.accueil,
    })),
  }));
}

export default async function FaqPage() {
  const fromApi = await getFaqGroups();
  const groupes = fromApi ? filterFaqByTarif(fromApi, SHOW.tarif) : staticFaqGroups();
  const total = groupes.reduce((n, g) => n + g.questions.length, 0);
  const c = data.site.contact;
  const tiles: Tile[] = [
    { src: "/images/home/about.png" },
    { icon: IconSearch, num: String(total), unit: "questions", label: "réponses claires" },
    { src: "/images/home/campus.png" },
    { icon: IconGrid, num: String(groupes.length), unit: "thèmes", label: "du programme au financement" },
    { icon: IconWhatsApp, title: "WhatsApp", label: "Réponse directe", href: BRAND.whatsapp, external: true, wa: true },
    { src: "/images/home/conference.png" },
    { icon: IconMail, title: "E-mail", label: "Écrire à l’équipe", href: `mailto:${plain(c.email)}` },
    { icon: IconClock, num: "24", unit: "h", label: "pour être rappelé", dark: true },
  ];

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
                <span className="sem-hero__badge"><KickerIcon label="FAQ" bare />FAQ</span>
                {total} questions · {groupes.length} thèmes
              </p>
              <h1 id="faq-title" className="sem-hero__title">
                Les questions que vous vous posez
              </h1>
              <p className="sem-hero__lead">
                Les réponses, regroupées par thème, du programme au financement.
              </p>
              <div className="sem-hero__ctas">
                <ButtonLink href="/admissions#rappel" variant="ghost" className="sem-hero__cta-secondary">
                  <IconPhone />
                  Être rappelé
                </ButtonLink>
                <ButtonLink href="/candidater" className="sem-hero__cta-primary">
                  Candidater
                  <IconArrowRight />
                </ButtonLink>
              </div>
            </div>
            <ul className="iv-faces is-admissions is-faq" aria-label="Pas trouvé votre réponse ?">
              {tiles.map((t, i) => (
                <li key={i} className={`iv-faces__item is-${i + 1}`} aria-hidden={"src" in t || undefined}>
                  {"src" in t ? (
                    <span className="iv-faces__link">
                      <Image src={t.src} alt="" fill sizes="180px" className="iv-faces__img" />
                    </span>
                  ) : "href" in t ? (
                    <a
                      href={t.href}
                      {...(t.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className={`iv-faces__link iv-faces__stat is-action${t.wa ? " is-wa" : ""}`}
                    >
                      <span className="iv-faces__stat-icon" aria-hidden="true"><t.icon /></span>
                      <span className="iv-faces__stat-go" aria-hidden="true"><IconArrowUpRight /></span>
                      <strong>{t.title}</strong>
                      <span>{t.label}</span>
                    </a>
                  ) : (
                    <span className={`iv-faces__link iv-faces__stat${t.dark ? " is-dark" : ""}`}>
                      <span className="iv-faces__stat-icon" aria-hidden="true"><t.icon /></span>
                      <strong>
                        {t.num}
                        <small>{t.unit}</small>
                      </strong>
                      <span>{t.label}</span>
                    </span>
                  )}
                </li>
              ))}
              <li className="iv-faces__item">
                <a href="#questions" className="iv-faces__link iv-faces__more is-cta">
                  <IconArrowRight />
                  <span className="iv-faces__more-label">Voir les questions</span>
                </a>
              </li>
            </ul>
            <section className="faq-help" aria-labelledby="faq-help-title">
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
            </section>
          </div>
        </Container>
      </section>

      <section id="questions" className="faq-page">
        <Container className="faq-page__inner">
          <FaqList groupes={groupes} />
        </Container>
      </section>

      <section className="cta-band" aria-labelledby="faq-cta-title">
        <Container>
          <div className="cta-band__inner">
            <div>
              <p className="cta-band__kicker">
                <KickerIcon label="Candidatures ouvertes" />
                Candidatures ouvertes jusqu’au{" "}
                {plain(data.site.admission.dateLimite)}
              </p>
              <h2 id="faq-cta-title" className="cta-band__title">
                Vous avez la réponse qu’il vous fallait ?
              </h2>
            </div>
            <div className="cta-band__actions">
              <ButtonLink
                href="/admissions#rappel"
                variant="ghost"
                className="sem-hero__cta-secondary"
              >
                <IconPhone />
                Être rappelé
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
