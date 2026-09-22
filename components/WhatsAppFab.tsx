import { IconWhatsApp } from "@/components/icons";
import { BRAND } from "@/lib/content";

export function WhatsAppFab() {
  return (
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
  );
}
