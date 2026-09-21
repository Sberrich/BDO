# Certificat ISCAE × BDO

Site du certificat **Transformation Digitale et Leadership Financier**, inspiré de [certificat.bdo-info.ma](https://certificat.bdo-info.ma/).

Stack : Next.js (App Router), Tailwind CSS, déployé sur Vercel.

## Développement

```bash
pnpm install
pnpm dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Variables d’environnement

Copier `.env.example` vers `.env.local` :

- `RESEND_API_KEY` — envoi des notifications d’inscription
- `NOTIFY_EMAIL` — destinataire (défaut : tkane@bdo.ma)
- `FROM_EMAIL` — expéditeur Resend (domaine vérifié)

Sans `RESEND_API_KEY`, le formulaire s’enregistre dans les logs du serveur (utile en local).

## Pages

- `/` — page d’accueil (une page, navigation par ancres)
- `/inscription` — formulaire
- `/confidentialite` — déclaration de confidentialité
