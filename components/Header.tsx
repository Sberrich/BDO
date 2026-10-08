"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { NAV, RESOURCES_MENU } from "@/lib/content";
import { IconArrowRight, IconFileText, IconLayers, IconPhone } from "@/components/icons";

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

function ResourceThumb({
  icon,
  cover,
}: {
  icon: (typeof RESOURCES_MENU)[number]["icon"];
  cover: (typeof RESOURCES_MENU)[number]["cover"];
}) {
  if (cover) {
    return (
      <span className="site-header__dd-cover" aria-hidden>
        <Image src={cover} alt="" width={72} height={96} className="site-header__dd-cover-img" />
      </span>
    );
  }
  return (
    <span className="site-header__dd-icon" aria-hidden>
      {icon === "insights" ? <IconLayers size={18} /> : <IconFileText size={18} />}
    </span>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const resourcesRef = useRef<HTMLLIElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const resourcesMenuId = useId();
  const mobileMenuId = useId();

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      setOpen(false);
      setResourcesOpen(false);
      setMobileResourcesOpen(false);
    });
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const syncTop = () => {
      const bottom = headerRef.current?.getBoundingClientRect().bottom ?? 0;
      root.style.setProperty("--nav-top", `${Math.max(0, Math.round(bottom))}px`);
    };
    syncTop();
    root.style.overflow = "hidden";
    document.body.dataset.nav = "open";
    window.addEventListener("resize", syncTop);
    return () => {
      window.removeEventListener("resize", syncTop);
      root.style.overflow = "";
      root.style.removeProperty("--nav-top");
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
        setMobileResourcesOpen(false);
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

  function closeMobile() {
    setOpen(false);
    setMobileResourcesOpen(false);
  }

  const mobileMenu =
    open && mounted
      ? createPortal(
          <>
            <button
              type="button"
              className="site-header__scrim"
              aria-label="Fermer le menu"
              onClick={closeMobile}
            />
            <div id={mobileMenuId} className="site-header__drawer menu-slide">
              <nav className="site-header__mobile" aria-label="Navigation mobile">
                <ul className="site-header__mobile-list">
                  {NAV.map((item) => {
                    const current = isCurrent(item.href, pathname);
                    if ("menu" in item && item.menu) {
                      return (
                        <li key={item.href} className="site-header__mobile-group">
                          <button
                            type="button"
                            className={`site-header__mobile-link site-header__mobile-toggle ${current || mobileResourcesOpen ? "is-current" : ""}`}
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
                          <div
                            className={`site-header__mobile-subwrap ${mobileResourcesOpen ? "is-open" : ""}`}
                          >
                            <ul className="site-header__mobile-sub">
                              {RESOURCES_MENU.map((sub) => (
                                <li key={sub.href}>
                                  <Link
                                    href={sub.href}
                                    className="site-header__mobile-sublink"
                                    onClick={closeMobile}
                                  >
                                    <ResourceThumb icon={sub.icon} cover={sub.cover} />
                                    <span>
                                      <span className="site-header__dd-title">{sub.label}</span>
                                      <span className="site-header__dd-desc">{sub.desc}</span>
                                    </span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </li>
                      );
                    }
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={current ? "page" : undefined}
                          className={`site-header__mobile-link ${current ? "is-current" : ""}`}
                          onClick={closeMobile}
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
                  <Link
                    href="/admissions#rappel"
                    className="site-header__mobile-rappel"
                    onClick={closeMobile}
                  >
                    <IconPhone />
                    Être rappelé
                  </Link>
                  <Link
                    href="/candidater"
                    className="site-header__mobile-cta"
                    onClick={closeMobile}
                  >
                    Candidater
                  </Link>
                </div>
              </nav>
            </div>
          </>,
          document.body,
        )
      : null;

  return (
    <header
      ref={headerRef}
      className={`site-header sticky top-0 z-[70] ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}
    >
      <div className="site-header__bar mx-auto flex w-full max-w-[1160px] items-center justify-between gap-3 px-5">
        <Link
          href="/"
          className="site-header__brand flex min-w-0 shrink-0 items-center"
          aria-label="CFO 4.0 — certificat cosigné par le Groupe ISCAE et BDO Maroc, retour à l’accueil"
          onClick={closeMobile}
        >
          <Image
            src="/images/logo-iscae-header.png"
            alt="Groupe ISCAE"
            width={351}
            height={184}
            className="site-header__logo site-header__logo--iscae"
            priority
          />
          <span className="site-header__rule" aria-hidden />
          <Image
            src="/images/logo-bdo-header.png"
            alt="BDO"
            width={418}
            height={161}
            className="site-header__logo site-header__logo--bdo"
            priority
          />
        </Link>

        <nav
          className="site-header__nav hidden flex-1 items-center min-[961px]:flex"
          aria-label="Navigation principale"
        >
          <ul className="site-header__links mx-auto my-0 flex list-none items-center">
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
                                <ResourceThumb icon={sub.icon} cover={sub.cover} />
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

          <div className="site-header__actions flex items-center">
            <Link
              href="/admissions#rappel"
              className="site-header__rappel"
              aria-label="Être rappelé"
            >
              <IconPhone />
              <span className="site-header__rappel-label">Être rappelé</span>
            </Link>
            <Link
              href="/candidater"
              aria-current={isCurrent("/candidater", pathname) ? "page" : undefined}
              className="site-header__cta"
            >
              Candidater
              <IconArrowRight />
            </Link>
          </div>
        </nav>

        <button
          type="button"
          className={`site-header__burger ${open ? "is-open" : ""}`}
          aria-expanded={open}
          aria-controls={mobileMenuId}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="site-header__burger-icon" aria-hidden>
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      {mobileMenu}
    </header>
  );
}
