import type { Metadata } from "next";
import { LegalDoc } from "@/components/LegalDoc";
import { CGU_TITLE, cguLead, cguSections } from "@/lib/cgu";

export const metadata: Metadata = {
  title: CGU_TITLE,
  description: "Conditions générales d’utilisation du site du certificat CFO 4.0 (ISCAE × BDO).",
};

export default function CguPage() {
  return <LegalDoc currentPath="/cgu" title={CGU_TITLE} lead={cguLead()} sections={cguSections()} />;
}
