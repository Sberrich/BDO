export type ConfirmationType = "candidature" | "document" | "session" | "rappel" | "default";

export const CONFIRMATIONS: Record<ConfirmationType, { title: string; text: string}> = {
  candidature: {
    title: "Votre candidature est enregistrée",
    text: "Notre équipe étudie votre éligibilité au programme sur la base des informations et documents transmis. La réponse vous est communiquée sous deux jours ouvrés après réception du dossier complet.",
  },
  document: {
    title: "Votre publication est prête",
    text: "Le téléchargement a démarré. Si rien ne s’est passé, utilisez le bouton ci-dessous.",
  },
  session: {
    title: "Votre place est réservée",
    text: "Le lien de connexion vous sera envoyé la veille de la session.",
  },
  rappel: {
    title: "Votre demande de rappel est enregistrée",
    text: "Un membre de l’équipe pédagogique vous appelle sous 24 heures ouvrées.",
  },
  default: { title: "Votre demande est enregistrée", text: "Nous revenons vers vous rapidement." },
};

export function confirmationFor(type: string | null | undefined) {
  return CONFIRMATIONS[(type as ConfirmationType) in CONFIRMATIONS ? (type as ConfirmationType) : "default"];
}

/** Only our own PDFs under /docs may be offered for download. */
export function safeDocPath(fichier: string | null | undefined) {
  if (!fichier || !/^\/docs\/[A-Za-z0-9._-]+\.pdf$/.test(fichier)) return null;
  return fichier;
}
