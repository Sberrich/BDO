import type { Metadata } from "next";
import { ResourceDocumentPage, resourceMetadata } from "@/components/ResourceDocumentPage";

export const metadata: Metadata = resourceMetadata("livreblanc");

export default function LivreBlancPage() {
  return <ResourceDocumentPage kind="livreblanc" />;
}
