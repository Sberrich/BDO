"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { IconArrowRight, IconDownload, IconTick } from "@/components/icons";
import { ButtonLink, Container, Kicker } from "@/components/ui";

const NEXT_STEPS = [
  { href: "/programme", label: "Parcourir les huit séminaires" },
  { href: "/ressources", label: "Télécharger les publications" },
];

const cases: Record<string, [string, string]> = {
  candidature: [
    "Votre candidature est enregistrée",
    "Le comité pédagogique examine votre dossier. Vous recevez une proposition d’entretien sous quelques jours.",
  ],
  document: [
    "Votre publication est prête",
    "Le téléchargement démarre automatiquement. Si rien ne se passe, utilisez le bouton ci-dessous.",
  ],
  session: [
    "Votre place est réservée",
    "Le lien de connexion vous sera envoyé la veille de la session.",
  ],
  rappel: [
    "Votre demande de rappel est enregistrée",
    "Un membre de l’équipe pédagogique vous appelle sous 24 heures ouvrées.",
  ],
  default: ["Votre demande est enregistrée", "Nous revenons vers vous rapidement."],
};

function safeDocPath(fichier: string | null) {
  if (!fichier) return null;
  if (!/^\/docs\/[A-Za-z0-9._-]+\.pdf$/.test(fichier)) return null;
  return fichier;
}

function MerciInner() {
  const p = useSearchParams();
  const type = p.get("type") || "default";
  const pair = cases[type] || cases.default;
  const fichier = safeDocPath(p.get("fichier"));
  const started = useRef(false);

  useEffect(() => {
    if (!fichier || started.current) return;
    started.current = true;
    const name = fichier.split("/").pop() || "document.pdf";
    const a = document.createElement("a");
    a.href = fichier;
    a.setAttribute("download", name);
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [fichier]);

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
          {pair[0]}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{pair[1]}</p>
        {fichier && (
          <p className="mt-6">
            <a
              className="btn-icon inline-flex min-h-11 items-center gap-2 rounded-[10px] bg-red px-6 py-3 text-sm font-bold text-white shadow-[var(--shadow-cta)] hover:bg-red-dark"
              href={fichier}
              download={fichier.split("/").pop() || "document.pdf"}
            >
              <IconDownload />
              Télécharger maintenant
            </a>
          </p>
        )}
        <ul className="mt-10 grid gap-3 sm:grid-cols-3">
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
          <ButtonLink href="/candidater">Candidater</ButtonLink>
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
    <Suspense>
      <MerciInner />
    </Suspense>
  );
}
