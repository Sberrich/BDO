# Certificat CFO 4.0 — Groupe ISCAE × BDO Maroc

Official website of the executive certificate **« Transformation Digitale et Leadership Financier » (CFO 4.0)**, co-signed by the **Groupe ISCAE** and **BDO Maroc**.

The site presents the programme (opening conference, 8 seminars, closing session), the faculty, admissions and pricing, downloadable resources (brochure, Baromètre des DAF, livre blanc), Insights articles and a FAQ. It collects leads through 4 forms (application, document request, info session, call-back) that are forwarded by e-mail to the programme inbox.

| | |
|---|---|
| **Production URL** | `https://iscae.bdomaroc.com` |
| **Repository** | <https://github.com/Sberrich/BDO> (branch `main`) |
| **Stack** | Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 + BEM CSS · Keystatic CMS |
| **Runtime** | Node.js ≥ 20.9 (developed on Node 24) |
| **Package manager** | pnpm 8.15.0, pinned in `package.json` (`packageManager`); lockfile format v6 — use `corepack enable` to get the right version |
| **Language of the site** | French |

---

## Table of contents

1. [Quick start (developers)](#1-quick-start-developers)
2. [Environment variables](#2-environment-variables)
3. [Project structure](#3-project-structure)
4. [Day-to-day workflow](#4-day-to-day-workflow)
5. [Content & CMS (Keystatic)](#5-content--cms-keystatic)
6. [Forms & e-mail delivery](#6-forms--e-mail-delivery)
7. [Deployment guide (DevOps)](#7-deployment-guide-devops)
8. [Go-live checklist](#8-go-live-checklist)
9. [Operations & troubleshooting](#9-operations--troubleshooting)

---

## 1. Quick start (developers)

```bash
git clone https://github.com/Sberrich/BDO.git
cd BDO

pnpm install
cp .env.example .env.local      # then edit the values (see §2)
pnpm dev                        # http://localhost:3000
```

Useful scripts:

| Command | What it does |
|---|---|
| `pnpm dev` | Development server with hot reload |
| `pnpm build` | Production build (pre-renders every page) |
| `pnpm start` | Serves the production build (`PORT` env var, default `3000`) |
| `pnpm lint` | ESLint |
| `pnpm exec tsc --noEmit` | Type check |

> `npm` also works (`npm install`, `npm run dev`), but keep `pnpm-lock.yaml` as the single lockfile — don't commit a `package-lock.json`.

---

## 2. Environment variables

Copy `.env.example` to `.env.local` for local work. In production, set the same variables in the hosting platform / container environment. **Never commit `.env.local` or any secret** (it is gitignored).

| Variable | Required | Example | Purpose |
|---|---|---|---|
| `EMAIL_PROVIDER` | yes | `formsubmit` | `formsubmit` (works with any inbox, no domain setup) or `resend` (needs a verified sending domain) |
| `NOTIFY_EMAIL` | yes | `certificat@bdo-info.ma` | Inbox that receives every form submission |
| `RESEND_API_KEY` | only if `resend` | `re_xxxxxxxx` | Resend API key |
| `FROM_EMAIL` | only if `resend` | `CFO 4.0 <noreply@iscae.bdomaroc.com>` | Sender address (must belong to the verified domain) |
| `KEYSTATIC_USER` | yes in prod | `admin` | CMS login user name |
| `KEYSTATIC_PASSWORD` | **yes in prod** | *strong password* | CMS login password. If missing in production, `/keystatic` answers **503** |
| `KEYSTATIC_SECRET` | recommended | 64 random chars | Signs the CMS session cookie. Generate with `openssl rand -hex 32` |

No variable is exposed to the browser (there are no `NEXT_PUBLIC_*` variables), so all of them can be changed without touching the code — a restart is enough.

---

## 3. Project structure

```
.
├── app/
│   ├── (site)/                 # Public pages (home, programme, seminaires/[slug], admissions,
│   │                           #   candidater, intervenants, insights/[slug], ressources, faq,
│   │                           #   a-propos, legal pages, merci)
│   ├── api/
│   │   ├── submit/             # POST — all site forms (validation, rate limit, e-mail)
│   │   ├── cms-login/          # POST — CMS login (sets the session cookie)
│   │   ├── cms-logout/         # GET/POST — CMS logout
│   │   └── keystatic/          # Keystatic API (protected)
│   ├── keystatic/              # CMS admin UI (protected)
│   ├── cms-login/              # CMS login page
│   ├── sitemap.ts · robots.ts  # SEO
│   └── globals.css             # Site styles (BEM components)
├── components/                 # React components (Header, Hero, ProgrammeGrid, forms…)
├── content/                    # CMS content (YAML) — edited through /keystatic
├── lib/
│   ├── payload/                # Static content: site texts, seminars, calendar, FAQ, faculty
│   ├── cms.ts                  # Reads content/ through the Keystatic reader
│   ├── cms-session.ts          # CMS session (signed cookie)
│   ├── emails.ts               # E-mail templates for form notifications
│   └── content.ts              # Brand constants (site URL, contacts…)
├── public/
│   ├── docs/                   # PDFs (brochure, baromètre, livre blanc…)
│   ├── images/                 # Photos, logos, covers
│   └── videos/                 # Seminar & testimonial videos (~120 MB)
├── styles/tokens.css           # Design tokens (brand colours, spacing, header height…)
├── keystatic.config.ts         # CMS schema
├── middleware.ts               # Protects /keystatic and /api/keystatic
└── next.config.ts              # Redirects from the legacy .html site + security headers
```

**Where to change what**

| I want to change… | Edit |
|---|---|
| An Insights article, a speaker bio, Insights/Intervenants page texts | `/keystatic` (CMS) → `content/` |
| Seminar titles, dates, times, speakers | `lib/payload/seminaires.ts`, `lib/payload/calendrier.ts` |
| FAQ | `lib/payload/faq.ts` |
| Home / admissions / pricing texts, contacts | `lib/payload/site.ts`, `lib/content.ts` |
| Faculty list & order | `lib/faculty-roster.ts` (+ CMS overrides) |
| A PDF | Replace the file in `public/docs/` **keeping the same file name** |
| Colours, spacing | `styles/tokens.css` |

---

## 4. Day-to-day workflow

```
feature branch ──► pnpm lint + tsc + pnpm build ──► Pull Request ──► review ──► merge to main ──► deploy
```

1. **Branch** from `main`: `git checkout -b feat/short-description`
2. **Develop** with `pnpm dev`; check desktop **and** mobile (≈ 390 px wide).
3. **Verify** before pushing:
   ```bash
   pnpm lint && pnpm exec tsc --noEmit && pnpm build
   ```
4. **Commit** with a clear message (`Programme: fix seminar 5 time slot`).
5. **Open a Pull Request** to `main`; merge after review.
6. **Deploy**: `main` is the production branch (see §7).

Content rules for the team:

- Text still awaiting validation is marked `{{PROV}}` — leave the marker until the content owner confirms it.
- Brand colours are navy / blue / red (`styles/tokens.css`) — don't introduce new ones.
- To hide a section temporarily, use its `SHOW` flag instead of deleting the code.

---

## 5. Content & CMS (Keystatic)

The CMS is **[Keystatic](https://keystatic.com)** in **local mode**: it has no database and writes YAML files into `content/`, which are versioned with Git like the code.

- Admin UI: `/keystatic` → redirects to the login page `/cms-login`
- Credentials: `KEYSTATIC_USER` / `KEYSTATIC_PASSWORD`; session cookie valid **8 hours**
- Logout: the "Se déconnecter" button in the CMS toolbar (or `/api/cms-logout`)

### Recommended editorial workflow

Pages are **pre-rendered at build time**. An edit only reaches the public site after a rebuild, so the official workflow is:

```
pnpm dev  ──►  edit in http://localhost:3000/keystatic  ──►  git commit content/  ──►  push / PR  ──►  deploy
```

1. Run the site locally (`pnpm dev`) and open `/keystatic`.
2. Edit the article / speaker and save — Keystatic writes to `content/`.
3. Check the result on the local site.
4. Commit and push the `content/` changes (PR to `main`).
5. The deployment rebuilds the site and the change goes live.

> ⚠️ Edits made through `/keystatic` **on the production server** are written to that server's disk only. They are not in Git, won't appear until the next build, and are **lost on the next deployment**. On production, treat the CMS as read-only (or block `/keystatic` at the proxy, see §7.5).

---

## 6. Forms & e-mail delivery

All forms post to `POST /api/submit`, which:

- validates the required fields for each form type (`candidature`, `document`, `session`, `rappel`),
- rate-limits to **12 submissions per IP per hour** (in memory, per instance — reads `X-Forwarded-For`),
- sends a formatted e-mail to `NOTIFY_EMAIL`,
- answers JSON (`200` ok, `400`/`422` invalid input, `429` rate-limited); the form then sends the visitor to `/merci` (with the PDF link for document requests).

**Providers**

- `formsubmit` (default): no account needed. ⚠️ The **first** submission triggers an *activation e-mail* from FormSubmit to `NOTIFY_EMAIL` — someone must click the confirmation link once, otherwise nothing is delivered. Do this right after go-live (see §8).
- `resend`: more reliable and branded. Verify the `iscae.bdomaroc.com` domain in Resend (DKIM/SPF DNS records in the `bdomaroc.com` zone), then set `EMAIL_PROVIDER=resend`, `RESEND_API_KEY` and `FROM_EMAIL`.

The server must be able to reach `https://formsubmit.co` or `https://api.resend.com` over outbound HTTPS.

---

## 7. Deployment guide (DevOps)

The app is a standard **Node.js Next.js server** (`next build` then `next start`). It needs no database, no Redis and no file storage service: everything ships in the build.

**Requirements**

| | |
|---|---|
| Node.js | ≥ 20.9 (LTS 22 or 24 recommended) |
| RAM | 1 GB to build, ~300 MB at runtime |
| Disk | ~1 GB (dependencies + build + 160 MB of media in `public/`) |
| Port | `3000` by default (`PORT` env var) |
| Outbound | HTTPS to formsubmit.co or api.resend.com |
| Health check | `GET /` → `200` |

Pick **one** of the options below.

### 7.1 Option A — Vercel (simplest)

1. Import the GitHub repo in Vercel (framework detected automatically, root directory = repository root).
2. Add the environment variables from §2 (Production + Preview).
3. Set the production branch to `main` → every merge deploys automatically, and every PR gets a preview URL.
4. Add the domain `iscae.bdomaroc.com` and create the DNS record Vercel shows (CNAME to `cname.vercel-dns.com`).

### 7.2 Option B — Linux VM with PM2 + Nginx

```bash
# 1. Install Node 22 LTS + pnpm + pm2
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs nginx
sudo npm i -g pnpm@8.15.0 pm2

# 2. Get the code
sudo mkdir -p /var/www && cd /var/www
git clone https://github.com/Sberrich/BDO.git cfo40 && cd cfo40

# 3. Configure
cp .env.example .env.production.local   # fill in the production values (§2)
chmod 600 .env.production.local

# 4. Build & run
pnpm install --frozen-lockfile
pnpm build
pm2 start "pnpm start" --name cfo40 --env PORT=3000
pm2 save && pm2 startup                 # restart on reboot
```

**Update / redeploy** (can be wrapped in a `deploy.sh` or a CI job):

```bash
cd /var/www/cfo40
git pull origin main
pnpm install --frozen-lockfile
pnpm build && pm2 reload cfo40
```

`pm2 reload` restarts without downtime. If the build fails, the running version keeps serving.

### 7.3 Option C — Docker

Example `Dockerfile` (add it to the repository root):

```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000
RUN corepack enable
COPY --from=build /app ./
USER node
EXPOSE 3000
CMD ["pnpm", "start"]
```

And a `.dockerignore`:

```
node_modules
.next
.git
.env*
!.env.example
```

```bash
docker build -t cfo40 .
docker run -d --name cfo40 -p 3000:3000 --env-file .env.production --restart unless-stopped cfo40
```

Secrets go in `--env-file` (or the orchestrator's secret store), never in the image.

### 7.4 Reverse proxy (Nginx) + HTTPS

```nginx
server {
    listen 80;
    server_name iscae.bdomaroc.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name iscae.bdomaroc.com;

    ssl_certificate     /etc/letsencrypt/live/iscae.bdomaroc.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/iscae.bdomaroc.com/privkey.pem;

    client_max_body_size 2m;
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;

    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }

    # Static media: long browser cache
    location ~* ^/(_next/static|images|videos|docs)/ {
        proxy_pass http://127.0.0.1:3000;
        expires 30d;
        add_header Cache-Control "public";
    }
}
```

Certificate: `sudo apt install certbot python3-certbot-nginx && sudo certbot --nginx -d iscae.bdomaroc.com`.

The `X-Forwarded-*` headers are required: the rate limiter uses the client IP, and the CMS cookie is `Secure` (HTTPS only) in production.

### 7.5 Security notes

- The CMS (`/keystatic`, `/api/keystatic/*`) is protected by `middleware.ts` (signed, httpOnly cookie, 8 h). Use a strong `KEYSTATIC_PASSWORD` and set `KEYSTATIC_SECRET`.
- Optional hardening: since content is edited locally (§5), the proxy can block the CMS entirely in production:
  ```nginx
  location ~ ^/(keystatic|api/keystatic|cms-login) { return 404; }
  ```
- Security headers (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`) are set in `next.config.ts`. HSTS can be added at the proxy.
- `/api/` is excluded from indexing in `robots.txt`; the CMS login page is `noindex`.

### 7.6 CI suggestion (GitHub Actions)

`.github/workflows/ci.yml`, run on every PR:

```yaml
name: CI
on: [pull_request, push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4   # reads the version from package.json "packageManager"
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm exec tsc --noEmit
      - run: pnpm build
```

Deploy on merge to `main`: either Vercel's Git integration, or an SSH step that runs the update commands from §7.2.

---

## 8. Go-live checklist

- [ ] Production environment variables set (§2), with a strong `KEYSTATIC_PASSWORD` and a `KEYSTATIC_SECRET`
- [ ] DNS `iscae.bdomaroc.com` → server / Vercel; HTTPS certificate valid; HTTP → HTTPS redirect
- [ ] `pnpm build` passes on the server / in CI
- [ ] Home, programme, a seminar page, admissions and candidater open on desktop and mobile
- [ ] Videos play and the PDFs download (`/docs/CFO-4-0-brochure.pdf`)
- [ ] Test submission of each form → e-mail received at `NOTIFY_EMAIL`
- [ ] **FormSubmit activation link clicked** (first submission only)
- [ ] `/keystatic` asks for login (or returns 404 if blocked at the proxy)
- [ ] `https://iscae.bdomaroc.com/sitemap.xml` and `/robots.txt` respond
- [ ] Legacy URLs redirect (e.g. `/programme.html` → `/programme`, `/lp/brochure` → `/ressources/brochure`)
- [ ] Uptime monitor on `GET /`

---

## 9. Operations & troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| Forms say "sent" but no e-mail arrives | FormSubmit not activated (check `NOTIFY_EMAIL` inbox/spam), or outbound HTTPS blocked. Check server logs for `/api/submit`. |
| `/keystatic` returns **503** | `KEYSTATIC_PASSWORD` not set in production. |
| CMS login loops back to the login page | Site served over HTTP (cookie is `Secure`) or `X-Forwarded-Proto` missing at the proxy. |
| CMS edit not visible on the site | Expected: pages are pre-rendered. Commit `content/` and redeploy (§5). |
| Visitors get "too many requests" | Rate limit is 12/hour/IP. Behind a proxy without `X-Forwarded-For`, all visitors share one IP → fix the proxy headers. |
| Build runs out of memory | Give the build ≥ 1 GB, or `NODE_OPTIONS=--max-old-space-size=1536 pnpm build`. |
| Changed an env var, no effect | Restart the process (`pm2 restart cfo40` / restart the container). |

**Logs**: `pm2 logs cfo40` (VM), `docker logs -f cfo40` (Docker), or the Vercel dashboard → *Logs*.

**Rollback**: `git checkout <previous-commit> && pnpm build && pm2 reload cfo40` (VM), redeploy the previous image tag (Docker), or *Promote* the previous deployment (Vercel).

---

**Contacts**: programme team — certificat@bdo-info.ma
