"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { IconArrowRight, IconDownload, IconTick } from "@/components/icons";
import { ButtonLink, Container, Kicker, cls } from "@/components/ui";
import { confirmationFor, safeDocPath } from "@/lib/confirmation";

const NEXT_STEPS = [
  { href: "/programme", label: "Parcourir le programme" },
  { href: "/ressources", label: "Télécharger les publications" },
];

function MerciInner() {
  const p = useSearchParams();
  return <MerciView type={p.get("type") || "default"} fichier={safeDocPath(p.get("fichier"))} />;
}

function MerciView({ type, fichier }: { type: string; fichier: string | null }) {
  const c = confirmationFor(type);

  return (
    <section className="bg-cream py-[clamp(3rem,7vw,5.5rem)]">
      <Container className="max-w-3xl">
        <span className="merci__badge" aria-hidden>
          <IconTick size={26} />
        </span>
        <div className="mt-6">
          <Kicker>Confirmation</Kicker>
        </div>
        <h1 className="mt-3 text-[clamp(2.05rem,1.5rem+2.2vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.025em]">
          {c.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{c.text}</p>
        {fichier && (
          <p className="mt-6">
            <a
              className={cls("primary")}
              href={fichier}
              download={fichier.split("/").pop() || "document.pdf"}
            >
              <IconDownload />
              Télécharger maintenant
            </a>
          </p>
        )}
        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {NEXT_STEPS.map((step) => (
            <li key={step.href}>
              <Link href={step.href} className="merci__step card-lift">
                {step.label}
                <IconArrowRight />
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          {type !== "candidature" && <ButtonLink href="/candidater">Candidater</ButtonLink>}
          <ButtonLink href="/" variant="ghost">
            Retour à l’accueil
          </ButtonLink>
        </div>
      </Container>
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
