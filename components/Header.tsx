"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { NAV, RESOURCES_MENU } from "@/lib/content";
import {
  IconBarChart,
  IconBook,
  IconFileText,
  IconLayers,
  IconPhone,
} from "@/components/icons";

function isCurrent(href: string, pathname: string) {
  if (href === "/programme") {
    return pathname.startsWith("/programme") || pathname.startsWith("/seminaires");
  }
  if (href === "/candidater") return pathname.startsWith("/candidater");
  if (href === "/ressources") {
    return pathname.startsWith("/ressources") || pathname.startsWith("/insights");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function ResourceIcon({ icon }: { icon: (typeof RESOURCES_MENU)[number]["icon"] }) {
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

export function Header() {
  const [open, setOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const resourcesRef = useRef<HTMLLIElement>(null);
  const resourcesMenuId = useId();

  useEffect(() => {
    queueMicrotask(() => {
      setOpen(false);
      setResourcesOpen(false);
      setMobileResourcesOpen(false);
    });
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    document.body.dataset.nav = open ? "open" : "";
    return () => {
      document.body.style.overflow = "";
      delete document.body.dataset.nav;
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open && !resourcesOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setResourcesOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, resourcesOpen]);

  useEffect(() => {
    if (!resourcesOpen) return;
    const onPointer = (e: MouseEvent) => {
      if (!resourcesRef.current?.contains(e.target as Node)) setResourcesOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    return () => window.removeEventListener("mousedown", onPointer);
  }, [resourcesOpen]);

  return (
    <header className={`site-header sticky top-0 z-50 ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}>
      <div className="site-header__bar mx-auto flex w-full max-w-[1160px] items-center justify-between gap-3 px-5">
        <Link
          href="/"
          className="site-header__brand group flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3.5"
          aria-label="CFO 4.0 — certificat cosigné par le Groupe ISCAE et BDO Maroc, retour à l’accueil"
        >
          <Image
            src="/images/logo-iscae.png"
            alt="Groupe ISCAE"
            width={180}
            height={56}
            className="site-header__logo site-header__logo--iscae h-11 w-auto sm:h-12"
            priority
          />
          <span className="site-header__rule" aria-hidden />
          <Image
            src="/images/logo-bdo.png"
            alt="BDO"
            width={120}
            height={42}
            className="site-header__logo site-header__logo--bdo h-10 w-auto sm:h-11"
            priority
          />
        </Link>

        <nav className="site-header__nav ml-auto hidden items-center gap-1 min-[961px]:flex" aria-label="Navigation principale">
          <ul className="site-header__links m-0 flex list-none items-center gap-0.5 p-0">
            {NAV.map((item) => {
              const current = isCurrent(item.href, pathname);
              if ("menu" in item && item.menu) {
                return (
                  <li key={item.href} className="site-header__dd" ref={resourcesRef}>
                    <button
                      type="button"
                      className={`site-header__link site-header__dd-trigger ${current || resourcesOpen ? "is-current" : ""}`}
                      aria-expanded={resourcesOpen}
                      aria-controls={resourcesMenuId}
                      aria-haspopup="menu"
                      onClick={() => setResourcesOpen((v) => !v)}
                      onMouseEnter={() => setResourcesOpen(true)}
                    >
                      {item.label}
                      <svg
                        className={`site-header__dd-chevron ${resourcesOpen ? "is-open" : ""}`}
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        aria-hidden
                      >
                        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    {resourcesOpen ? (
                      <div
                        id={resourcesMenuId}
                        role="menu"
                        className="site-header__dd-panel"
                        onMouseLeave={() => setResourcesOpen(false)}
                      >
                        <p className="site-header__dd-label">Ressources</p>
                        <ul className="site-header__dd-list">
                          {RESOURCES_MENU.map((sub) => (
                            <li key={sub.href} role="none">
                              <Link
                                href={sub.href}
                                role="menuitem"
                                className="site-header__dd-item"
                                onClick={() => setResourcesOpen(false)}
                              >
                                <span className="site-header__dd-icon" aria-hidden>
                                  <ResourceIcon icon={sub.icon} />
                                </span>
                                <span className="site-header__dd-copy">
                                  <span className="site-header__dd-title">{sub.label}</span>
                                  <span className="site-header__dd-desc">{sub.desc}</span>
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </li>
                );
              }
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={`site-header__link ${current ? "is-current" : ""}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="site-header__actions ml-2 flex items-center gap-2 pl-3">
            <Link href="/admissions#rappel" className="site-header__rappel">
              <IconPhone />
              <span className="hidden min-[1100px]:inline">Être rappelé</span>
              <span className="sr-only min-[1100px]:hidden">Être rappelé</span>
            </Link>
            <Link
              href="/candidater"
              aria-current={isCurrent("/candidater", pathname) ? "page" : undefined}
              className="site-header__cta"
            >
              Candidater
            </Link>
          </div>
        </nav>

        <button
          type="button"
          className={`site-header__burger ${open ? "is-open" : ""}`}
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Fermer" : "Menu"}</span>
          <span className="site-header__burger-icon" aria-hidden>
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      {open && (
        <>
          <button
            type="button"
            className="nav-overlay fixed inset-0 top-[var(--header-h)] z-40 bg-ink/40 backdrop-blur-[3px] min-[961px]:hidden"
            aria-label="Fermer le menu"
            onClick={() => setOpen(false)}
          />
          <div id="menu-mobile" className="site-header__panel menu-slide relative z-50 min-[961px]:hidden">
            <nav className="site-header__mobile" aria-label="Navigation mobile">
              <ul className="site-header__mobile-list">
                {NAV.map((item) => {
                  const current = isCurrent(item.href, pathname);
                  if ("menu" in item && item.menu) {
                    return (
                      <li key={item.href} className="site-header__mobile-group">
                        <button
                          type="button"
                          className={`site-header__mobile-link site-header__mobile-toggle ${current ? "is-current" : ""}`}
                          aria-expanded={mobileResourcesOpen}
                          onClick={() => setMobileResourcesOpen((v) => !v)}
                        >
                          <span>{item.label}</span>
                          <svg
                            className={`site-header__mobile-chevron ${mobileResourcesOpen ? "is-open" : ""}`}
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            aria-hidden
                          >
                            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                        {mobileResourcesOpen ? (
                          <ul className="site-header__mobile-sub">
                            {RESOURCES_MENU.map((sub) => (
                              <li key={sub.href}>
                                <Link
                                  href={sub.href}
                                  className="site-header__mobile-sublink"
                                  onClick={() => setOpen(false)}
                                >
                                  <span className="site-header__dd-icon" aria-hidden>
                                    <ResourceIcon icon={sub.icon} />
                                  </span>
                                  <span>
                                    <span className="site-header__dd-title">{sub.label}</span>
                                    <span className="site-header__dd-desc">{sub.desc}</span>
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </li>
                    );
                  }
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={current ? "page" : undefined}
                        className={`site-header__mobile-link ${current ? "is-current" : ""}`}
                        onClick={() => setOpen(false)}
                      >
                        <span>{item.label}</span>
                        <svg
                          className="site-header__mobile-chevron"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          aria-hidden
                        >
                          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="site-header__mobile-actions">
                <Link href="/admissions#rappel" className="site-header__mobile-rappel" onClick={() => setOpen(false)}>
                  <IconPhone />
                  Être rappelé
                </Link>
                <Link href="/candidater" className="site-header__mobile-cta" onClick={() => setOpen(false)}>
                  Candidater
                </Link>
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
