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
      <IconWhatsApp size={28} />
    </a>
  );
}
