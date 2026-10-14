"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Application pages: the visitor is already applying, so no « Candidater » bar. */
const HIDDEN_ON = ["/candidater", "/merci"];

export function MobileBar() {
  const pathname = usePathname();
  if (HIDDEN_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null;

  return (
    <nav
      className="mobile-bar fixed inset-x-0 bottom-0 z-40 hidden flex-col gap-2 border-t border-line bg-white/95 px-4 py-3 backdrop-blur max-[720px]:flex"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      aria-label="Actions rapides"
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
