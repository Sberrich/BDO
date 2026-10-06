import type { Metadata } from "next";
import SiteLayout from "./(site)/layout";
import NotFoundContent from "./(site)/not-found";

export const metadata: Metadata = { title: "Page introuvable", robots: { index: false } };

export default function NotFound() {
  return (
    <SiteLayout>
      <NotFoundContent />
    </SiteLayout>
  );
}
