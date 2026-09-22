"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { ButtonLink, Container } from "@/components/ui";

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
    const a = document.createElement("a");
    a.href = fichier;
    a.setAttribute("download", "");
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [fichier]);

  return (
    <section className="bg-cream py-16">
      <Container className="max-w-2xl">
        <h1 className="font-display text-4xl font-bold">{pair[0]}</h1>
        <p className="mt-4 text-lg text-muted">{pair[1]}</p>
        {fichier && (
          <p className="mt-6">
            <a
              className="inline-flex min-h-11 items-center rounded-md bg-red px-6 py-3 text-sm font-bold text-white hover:bg-red-dark"
              href={fichier}
              download
            >
              Télécharger maintenant
            </a>
          </p>
        )}
        <ul className="mt-10 list-disc space-y-2 pl-5 text-muted">
          <li>
            <a className="text-blue" href="/programme">
              Parcourir les huit séminaires
            </a>
          </li>
          <li>
            <a className="text-blue" href="/admissions#calendrier">
              Vérifier le calendrier
            </a>
          </li>
          <li>
            <a className="text-blue" href="/ressources">
              Télécharger les publications
            </a>
          </li>
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
