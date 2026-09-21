import type { Metadata } from "next";
import { ResourceDocumentPage, resourceMetadata } from "@/components/ResourceDocumentPage";

export const metadata: Metadata = resourceMetadata("barometre");

export default function BarometrePage() {
  return <ResourceDocumentPage kind="barometre" />;
}
