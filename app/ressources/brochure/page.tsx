import type { Metadata } from "next";
import { ResourceDocumentPage, resourceMetadata } from "@/components/ResourceDocumentPage";

export const metadata: Metadata = resourceMetadata("brochure");

export default function BrochurePage() {
  return <ResourceDocumentPage kind="brochure" />;
}
