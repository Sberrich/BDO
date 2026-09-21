"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/content/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[88px] w-full max-w-6xl items-center justify-between gap-6 px-5">
        <Link href="/#hero" className="flex items-center gap-4" aria-label="Retour à l’accueil">
          <Image
            src="/images/logo-iscae.png"
            alt="Groupe ISCAE"
            width={140}
            height={44}
            className="h-10 w-auto"
            priority
          />
          <span className="hidden h-8 w-px bg-line sm:block" aria-hidden />
          <Image
            src="/images/logo-bdo.png"
            alt="BDO"
            width={92}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Navigation principale">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-ink/80 transition hover:text-navy"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/inscription"
            className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-dark"
          >
            S’inscrire
          </Link>
        </nav>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-navy lg:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Fermer le menu" : "Ouvrir le menu"}</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div
          id="menu-mobile"
          className="border-t border-line bg-white px-5 py-4 lg:hidden"
        >
          <nav className="flex flex-col" aria-label="Navigation mobile">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-line py-3 text-base font-semibold text-ink"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/inscription"
              className="mt-4 rounded-full bg-navy px-5 py-3 text-center text-sm font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              S’inscrire
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
