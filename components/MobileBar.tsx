"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/** Application pages: the visitor is already applying, so no « Candidater » bar. */
const HIDDEN_ON = ["/candidater", "/merci"];

/** In-page calls to action that make the bar redundant while they are on screen. */
const PAGE_CTAS = [
  'a[href^="/candidater"]',
  'a[href*="#rappel"]',
  'a[href^="/admissions#rappel"]',
]
  .flatMap((sel) => [`#contenu ${sel}`, `footer ${sel}`])
  .join(", ");

export function MobileBar() {
  const pathname = usePathname();
  const hiddenPage = HIDDEN_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const [ctaOnScreen, setCtaOnScreen] = useState(false);

  useEffect(() => {
    if (hiddenPage) return;
    const onScreen = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) onScreen.add(e.target);
        else onScreen.delete(e.target);
      }
      setCtaOnScreen(onScreen.size > 0);
    });
    const watched = new Set<Element>();
    const scan = () => {
      for (const el of document.querySelectorAll(PAGE_CTAS)) {
        if (watched.has(el)) continue;
        watched.add(el);
        io.observe(el);
      }
    };
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
      setCtaOnScreen(false);
    };
  }, [pathname, hiddenPage]);

  if (hiddenPage) return null;

  return (
    <nav
      className={`mobile-bar fixed inset-x-0 bottom-0 z-40 hidden flex-col gap-2 border-t border-line bg-white/95 px-4 py-3 backdrop-blur max-[720px]:flex ${ctaOnScreen ? "is-tucked" : ""}`}
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      aria-label="Actions rapides"
      aria-hidden={ctaOnScreen || undefined}
      inert={ctaOnScreen}
    >
      <Link href="/candidater" className="rounded-[10px] border border-red bg-red py-3 text-center text-[0.9375rem] font-bold text-white">
        Candidater
      </Link>
      <Link href="/admissions#rappel" className="rounded-[10px] border border-blue bg-white py-3 text-center text-[0.9375rem] font-bold text-blue">
        Être rappelé
      </Link>
    </nav>
  );
}
