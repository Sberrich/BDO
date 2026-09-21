# Certificat CFO 4.0 — Groupe ISCAE × BDO Maroc

Next.js site for the executive certificate **Transformation Digitale et Leadership Financier**.

## Setup

```bash
pnpm install
cp .env.example .env.local   # then set RESEND_API_KEY
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port Next prints).

## Environment

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Send form notifications via Resend |
| `NOTIFY_EMAIL` | Inbox that receives submissions |
| `FROM_EMAIL` | Sender (use `onboarding@resend.dev` until a domain is verified) |

`.env.local` is gitignored — never commit API keys.

## Main routes

- `/` — home
- `/programme`, `/seminaires/[slug]`
- `/admissions`, `/candidater`
- `/intervenants`, `/ressources`, `/faq`, `/a-propos`
