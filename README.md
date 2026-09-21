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
- `/intervenants`, `/insights`, `/ressources`, `/faq`, `/a-propos`
- `/keystatic` — CMS (Insights + Intervenants), local files under `content/`

## CMS (Keystatic)

Edit Insights and Intervenants at `/keystatic` while `pnpm dev` is running. Changes write YAML into `web/content/` (git-backed).

Protected by HTTP Basic Auth (`KEYSTATIC_USER` / `KEYSTATIC_PASSWORD` in `.env.local`). In production the CMS returns 503 if no password is set.
