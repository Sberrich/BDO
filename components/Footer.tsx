import Image from "next/image";
import Link from "next/link";
import { BRAND, NAV, data } from "@/lib/content";
import { IconPhone, IconWhatsApp } from "@/components/icons";
import { plain } from "@/lib/text";

export function Footer() {
  const c = data.site.contact;
  const seminars = data.seminaires.seminaires.slice(0, 4);
  const email = plain(c.email);
  const tel = plain(c.telephone);
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <div className="site-footer__logos">
              <Image
                src="/images/logo-iscae.png"
                alt="Groupe ISCAE"
                width={220}
                height={70}
                className="site-footer__logo site-footer__logo--iscae"
                priority
              />
              <span className="site-footer__rule" aria-hidden />
              <Image
                src="/images/logo-bdo.png"
                alt="BDO"
                width={150}
                height={52}
                className="site-footer__logo site-footer__logo--bdo"
                priority
              />
            </div>
            <p className="site-footer__tag">{data.site.cosignature}.</p>
          </div>

          <div className="site-footer__cta-block">
            <p className="site-footer__cta-label">Prochaine session</p>
            <p className="site-footer__cta-text">
              Candidatures ouvertes — cycle à Rabat, jury ISCAE × BDO.
            </p>
            <div className="site-footer__cta-row">
              <Link href="/candidater" className="site-footer__btn site-footer__btn--primary">
                Candidater
              </Link>
              <Link href="/ressources" className="site-footer__btn site-footer__btn--ghost">
                Recevoir la brochure
              </Link>
            </div>
          </div>
        </div>

        <div className="site-footer__grid">
          <nav className="site-footer__col" aria-labelledby="footer-cert">
            <h2 id="footer-cert" className="site-footer__heading">
              Le certificat
            </h2>
            <ul className="site-footer__list">
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

          <nav className="site-footer__col" aria-labelledby="footer-sem">
            <h2 id="footer-sem" className="site-footer__heading">
              Les séminaires
            </h2>
            <ul className="site-footer__list site-footer__list--sem">
              {seminars.map((s) => (
                <li key={s.numero}>
                  <Link href={`/seminaires/${s.numero}`}>
                    <span className="site-footer__n" aria-hidden="true">
                      {String(s.numero).padStart(2, "0")}
                    </span>
                    <span>{plain(s.titre)}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/programme" className="site-footer__more">
              Les huit séminaires <span aria-hidden="true">→</span>
            </Link>
          </nav>

          <div className="site-footer__col" aria-labelledby="footer-contact">
            <h2 id="footer-contact" className="site-footer__heading">
              Contact
            </h2>
            <div className="site-footer__contact">
              <p className="site-footer__person">
                <strong>{plain(c.nom)}</strong>
                <span>{plain(c.fonction)}</span>
              </p>
              <ul className="site-footer__contact-list">
                <li>
                  <a href={`mailto:${email}`}>{email}</a>
                </li>
                <li>
                  <a href={BRAND.phoneHref} className="site-footer__with-icon">
                    <IconPhone />
                    {tel}
                  </a>
                </li>
                <li>
                  <a
                    href={BRAND.whatsapp}
                    className="site-footer__wa"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconWhatsApp />
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href={plain(c.linkedin) || "https://www.linkedin.com/company/bdo-maroc/"}
                    rel="noopener"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="site-footer__col" aria-labelledby="footer-legal">
            <h2 id="footer-legal" className="site-footer__heading">
              Informations légales
            </h2>
            <ul className="site-footer__list">
              <li>
                <Link href="/mentions-legales">Mentions légales</Link>
              </li>
              <li>
                <Link href="/confidentialite">Protection des données</Link>
              </li>
              <li>
                <Link href="/faq#donnees">Vos données, en bref</Link>
              </li>
            </ul>
            <p className="site-footer__legal">
              Traitement déclaré au titre de la {data.site.conformite.loi}.{" "}
              {plain(data.site.conformite.declaration)}
            </p>
          </div>
        </div>
      </div>

      <div className="site-footer__bar">
        <div className="site-footer__bar-inner">
          <p>© {year} Groupe ISCAE — BDO Maroc</p>
          <p>
            {data.site.nom} · {data.site.sousTitreOfficiel}
          </p>
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
