"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { IconWhatsApp } from "@/components/icons";
import { BRAND } from "@/lib/content";

/** Pages built around a form: no floating WhatsApp / cookie buttons over the fields. */
const FORM_PAGES = ["/candidater", "/inscription"];

export function WhatsAppFab() {
  const pathname = usePathname();
  const onForm = FORM_PAGES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  useEffect(() => {
    if (onForm) document.body.dataset.formPage = "";
    else delete document.body.dataset.formPage;
  }, [onForm]);

  if (onForm) return null;

  return (
    <aside aria-label="Contact WhatsApp">
      <a
        href={BRAND.whatsapp}
        className="wa-fab"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Écrire sur WhatsApp"
      >
        <span className="wa-fab__ping" aria-hidden="true" />
        <span className="wa-fab__ping wa-fab__ping--delay" aria-hidden="true" />
        <span className="wa-fab__core">
          <IconWhatsApp size={28} />
        </span>
      </a>
    </aside>
  );
}
