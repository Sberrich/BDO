"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { SuccessCard } from "@/components/SuccessDialog";
import { ButtonLink } from "@/components/ui";
import { safeDocPath } from "@/lib/confirmation";

function MerciInner() {
  const p = useSearchParams();
  return <MerciView type={p.get("type") || "default"} fichier={safeDocPath(p.get("fichier"))} />;
}

function MerciView({ type, fichier }: { type: string; fichier: string | null }) {
  return (
    <section className="merci-page">
      <div className="success-dialog is-page">
        <SuccessCard
          page
          type={type}
          fichier={fichier}
          secondary={
            <ButtonLink href="/" variant="ghost">
              Retour à l’accueil
            </ButtonLink>
          }
        />
      </div>
    </section>
  );
}

export default function MerciPage() {
  return (
    <Suspense fallback={<MerciView type="default" fichier={null} />}>
      <MerciInner />
    </Suspense>
  );
}
