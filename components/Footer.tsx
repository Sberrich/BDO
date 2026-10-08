import Image from "next/image";
import Link from "next/link";
import { BRAND, NAV, data } from "@/lib/content";
import { IconArrowRight, IconMail, IconPhone, IconPin, IconWhatsApp } from "@/components/icons";
import { plain } from "@/lib/text";

export function Footer() {
  const c = data.site.contact;
  const seminars = data.seminaires.seminaires;
  const inaugurale = data.seminaires.inaugurale;
  const email = plain(c.email);
  const year = new Date().getFullYear();

  return (
    <footer className="foot">
      <div className="foot__inner">
        <div className="foot__hero">
          <div>
            <p className="foot__wordmark">
              CFO <span>4.0</span>
            </p>
            <p className="foot__tagline">{data.site.sousTitreOfficiel}</p>
          </div>
          <div className="foot__cta">
            <p className="foot__cta-note">
              <span className="foot__dot" aria-hidden="true" />
              Candidatures ouvertes jusqu’au 30 octobre 2026
            </p>
            <div className="foot__cta-row">
              <Link href="/candidater" className="foot__btn is-primary">
                Candidater
                <IconArrowRight />
              </Link>
              <Link href="/ressources/brochure" className="foot__btn is-ghost">
                Recevoir la brochure
              </Link>
            </div>
          </div>
        </div>

        <div className="foot__grid">
          <div className="foot__brand">
            <div className="foot__brand-card">
            <div className="foot__logos">
              <Image
                src="/images/logo-iscae-header.png"
                alt="Groupe ISCAE"
                width={351}
                height={184}
                className="foot__logo is-iscae"
              />
              <span className="foot__logo-rule" aria-hidden="true" />
              <Image
                src="/images/logo-bdo-header.png"
                alt="BDO Maroc"
                width={418}
                height={161}
                className="foot__logo is-bdo"
              />
            </div>
            <p className="foot__brand-text">{data.site.cosignature}.</p>
            </div>
            <address className="foot__address">
              <span className="foot__address-icon" aria-hidden="true">
                <IconPin />
              </span>
              {plain(c.adresseIscae)}
            </address>
          </div>

          <nav className="foot__col" aria-labelledby="footer-cert">
            <h2 id="footer-cert" className="foot__heading">
              Le certificat
            </h2>
            <ul className="foot__list">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/insights">Insights</Link>
              </li>
              <li>
                <Link href="/a-propos">À propos</Link>
              </li>
            </ul>
          </nav>

          <nav className="foot__col" aria-labelledby="footer-sem">
            <h2 id="footer-sem" className="foot__heading">
              Les séminaires
            </h2>
            <ul className="foot__list is-sem">
              <li>
                <Link href={`/seminaires/${inaugurale.slug}`}>
                  <span className="foot__n is-in" aria-hidden="true">
                    IN
                  </span>
                  {plain(inaugurale.titre)}
                </Link>
              </li>
              {seminars.map((s) => (
                <li key={s.numero}>
                  <Link href={`/seminaires/${s.numero}`}>
                    <span className="foot__n" aria-hidden="true">
                      {String(s.numero).padStart(2, "0")}
                    </span>
                    {plain(s.titre)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="foot__col" aria-labelledby="footer-contact">
            <h2 id="footer-contact" className="foot__heading">
              Contact
            </h2>
            <ul className="foot__contact">
              <li>
                <a href={`mailto:${email}`} className="foot__contact-link">
                  <span className="foot__contact-icon" aria-hidden="true">
                    <IconMail />
                  </span>
                  <span>
                    <span className="foot__contact-label">E-mail</span>
                    {email}
                  </span>
                  <IconArrowRight />
                </a>
              </li>
              <li>
                <a
                  href={BRAND.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="foot__contact-link is-wa"
                >
                  <span className="foot__contact-icon" aria-hidden="true">
                    <IconWhatsApp />
                  </span>
                  <span>
                    <span className="foot__contact-label">WhatsApp</span>
                    +212 679 724 416
                  </span>
                  <IconArrowRight />
                </a>
              </li>
              <li>
                <Link href="/admissions#rappel" className="foot__contact-link">
                  <span className="foot__contact-icon" aria-hidden="true">
                    <IconPhone />
                  </span>
                  <span>
                    <span className="foot__contact-label">Rappel</span>
                    Être rappelé sous 24&nbsp;h
                  </span>
                  <IconArrowRight />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="foot__bar">
        <div className="foot__bar-inner">
          <p>© {year} Groupe ISCAE · BDO Maroc</p>
          <ul className="foot__legal">
            <li>
              <Link href="/mentions-legales">Mentions légales</Link>
            </li>
            <li>
              <Link href="/cgu">CGU</Link>
            </li>
            <li>
              <Link href="/confidentialite">Confidentialité</Link>
            </li>
          </ul>
          <a href="#contenu" className="foot__top">
            Haut de page
            <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

export function MobileBar() {
  return (
    <div
      className="mobile-bar fixed inset-x-0 bottom-0 z-40 hidden gap-2 border-t border-line bg-white/95 px-4 py-3 shadow-[0_-4px_16px_rgba(51,51,51,.08)] backdrop-blur max-[720px]:flex"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      role="group"
      aria-label="Actions rapides"
    >
      <Link href="/candidater" className="flex-1 rounded-md bg-red py-3 text-center text-sm font-bold text-white">
        Candidater
      </Link>
      <Link href="/admissions#rappel" className="flex-1 rounded-md border border-blue py-3 text-center text-sm font-bold text-blue">
        Être rappelé
      </Link>
    </div>
  );
}
