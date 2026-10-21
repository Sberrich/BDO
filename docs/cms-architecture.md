# CFO 4.0 — CMS & Django architecture

**Live reference:** https://bdo-silk.vercel.app/  
**Repo:** `web/` (GitHub `Sberrich/BDO`)  
**Branch:** `backend` @ base `bc89c81780d4227f427ad52be086ff14f315eda1` (`origin/main`)  
**Stack target:** Django 5 · DRF · PostgreSQL · Next.js 16 (unchanged public UI)

---

## 1. Repository audit

### 1.1 Frontend architecture

| Layer | Reality |
|-------|---------|
| Framework | Next.js 16 App Router, React 19, TypeScript, Tailwind 4 + BEM in `globals.css` |
| Public routes | `/`, `/programme`, `/seminaires/[slug]`, `/admissions`, `/intervenants`, `/playlists`, `/insights`, `/insights/[slug]`, `/ressources` (+ brochure/barometre/livre-blanc), `/faq`, `/a-propos`, `/candidater`, `/inscription`, legal pages |
| Content today | Hybrid: `lib/payload/*.ts` (site, seminaires, faq, calendrier) + `content/*.yaml` (videos, insights, speakers) + `lib/faculty-roster.ts` |
| Forms | Single `POST /api/submit` — types `candidature`, `document`, `session`, `rappel` — email + JSONL + optional Sheets; dual-write to Django |
| Former CMS | Keystatic removed on this branch; staff UI is Next `/admin/*` + Django Admin |
| Feature flags | `SHOW.*` in `lib/content.ts` (tarif, calendrier, video, etc.) — product decisions, not CMS entities |

### 1.2 Homepage sections (from live site + `site.ts`)

Mapped to real UI, not invented:

1. Hero / promesse + faits  
2. Constat (stats + conclusion + source)  
3. Livrable (3 items)  
4. Programme teaser (sessions)  
5. Profil (audience cards + prérequis)  
6. Intervenants showcase  
7. Playlists / témoignages (`PLAYLIST_PREVIEW = 3` then « Voir plus »)  
8. Revue de presse (`site.medias`)  
9. Dispositif BDO (resources teasers)  
10. Partenaires  
11. Contact  

### 1.3 Forms (inspected)

| Type | Purpose | PII / files | Storage today |
|------|---------|-------------|---------------|
| `candidature` | Application | High + CV/photo | JSONL + Django `Submission` + email |
| `document` | Brochure / baromètre / livre blanc request | Medium | Same |
| `session` | Info session signup | Medium | Same (`SHOW.sessionInfo` may hide UI) |
| `rappel` | Callback request | Medium | Same |

Rate limit: 12/IP/h (Next + DRF throttle). Attachments validated (ext + magic bytes, 5 Mo).

### 1.4 Already on `backend` (do not recreate)

- Apps: `accounts`, `content`, `leads`, `auditlog`, `api`, `common`  
- Models: `Video`, `Insight`, `Speaker`, `Seminar`, `PageIntro`, `Submission`, `SubmissionFile`, `AuditEntry`  
- Auth: DRF Token + Next `/api/cms/*` BFF cookie  
- Public read APIs + staff CRUD for those entities  
- Next admin UI (design-system branded) without public-site redirects  
- Tests: 4 API tests passing (baseline)  
- SQLite locally; `DATABASE_URL` → PostgreSQL in prod  

### 1.5 Gaps vs requested CMS scope

| Requested | Status | Source of truth today |
|-----------|--------|------------------------|
| Website pages / homepage sections | Partial (`PageIntro` only) | `site.ts` |
| Seminars + speakers relation | Done (M2M via JSON slugs — normalize later) | DB + payload fallback |
| Playlists / videos + 3 featured | Done (`playlist` + `ordre`; preview=3 in frontend) | DB |
| Press / media publications | **Missing** | `site.medias` |
| Downloadable resources | **Missing** | `public/docs` + `RESOURCES_MENU` |
| FAQ | **Missing** | `faq.ts` |
| Partners + key statistics | **Missing** | `site.partenaires`, `site.constat`, `site.faits` |
| Site settings / contact / SEO | **Missing** | `site.ts` + `BRAND` + metadata |
| Form submissions | Done | Django + JSONL dual-write |

### 1.6 Risks

- Dual content sources until each domain is wired to API with fallback  
- Speaker↔Seminar still slug/JSON — normalize to M2M when stable  
- Local `main` was stale; branch correctly based on `origin/main`  
- Working tree has large uncommitted CMS work — commit when approved  
- Do not switch production to PostgreSQL or drop SQLite without backup  

---

## 2. Proposed database schema & relationships

```
SiteSettings (singleton)
  brand name, tagline, contact email/phone/whatsapp, address,
  seo_title_template, seo_description_default, social URLs, SHOW flags JSON

HomepageSection
  key (unique), title, chapeau, body JSON, ordre, is_published
  — keys align with real sections: constat, livrable, profil, dispositif, …

Statistic
  group (hero_faits | constat | …), valeur, unite, libelle, ordre, is_published

Partner
  nom, role, logo, lien, ordre, is_published

PressItem
  nom, titre, description, lien, logo, domaine, apercu, ordre, is_published

Resource
  key (brochure|barometre|livreblanc|…), titre, description, file_path or URL,
  cover, ordre, is_published

FaqGroup / FaqItem
  group(slug, titre, ordre) 1──* item(question, answer_html, ordre, is_published, hides_if_tarif)

Playlist (optional explicit) / Video
  Video.playlist (string or FK), ordre, is_published
  — featured = first 3 by ordre per playlist (frontend PLAYLIST_PREVIEW)

Seminar  *──*  Speaker   (target: M2M through SeminarSpeaker with ordre)
  keep speaker_slugs during migration

Insight, PageIntro — keep

Submission 1──* SubmissionFile
  type, status, fields JSON, notes, email, full_name, ip_hash

AuditEntry — keep
```

**Publication:** every public content model has `is_published`; public API filters unpublished unless staff.

**Ordering:** `ordre` / `numero` / `-date` as appropriate; admin list editable where useful.

---

## 3. Modular Django project structure

```
backend/
  config/           # settings, urls, wsgi/asgi, env
  apps/
    accounts/       # staff users, groups (Editorial, Admissions, Viewer)
    catalog/        # OR keep content/ — seminars, speakers, videos, insights
    sitecontent/    # NEW: settings, sections, stats, partners, press, resources, FAQ
    leads/          # submissions + files
    auditlog/
  api/              # /api/v1/ routers, auth, throttles
  common/           # pagination, permissions, exception format
  fixtures/         # seed JSON from payload
  tests/
```

**Decision:** extend `apps/content` rather than invent parallel apps until volume justifies split — avoids duplicate models.

---

## 4. API endpoint plan (`/api/v1/`)

### Public (read, published only)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health/` | Health |
| GET | `/seminars/`, `/seminars/{slug}/` | Programme |
| GET | `/speakers/`, `/speakers/{slug}/` | Faculty |
| GET | `/videos/` | Playlists (filter `playlist`) |
| GET | `/insights/`, `/insights/{slug}/` | Articles |
| GET | `/page-intros/{key}/` | Page chapeaux |
| GET | `/press/` | Revue de presse |
| GET | `/partners/` | Partenaires |
| GET | `/statistics/?group=` | Faits / constat |
| GET | `/resources/` | Docs téléchargeables |
| GET | `/faq/` | Groupes + questions |
| GET | `/settings/` | Contact + SEO defaults + flags |
| GET | `/homepage/` | Aggregated sections payload for `/` |
| POST | `/leads/submit/` | Form intake (throttled) |

### Staff (Token / session)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/auth/login|logout/` · GET `/auth/me/` | Auth |
| GET | `/dashboard/stats/` | Admin dashboard |
| CRUD | same resources | Write when `IsStaffOrReadOnly` |
| GET/PATCH | `/leads/` | Admissions inbox |

**Conventions:** camelCase field aliases matching existing frontend shapes; paginated lists; unified error `{ detail, code, errors }`.

**Frontend integration:** keep routes/UI; replace payload reads with `fetch*` helpers + static fallback (already pattern for videos/insights/seminars).

---

## 5. Security & permissions plan

| Role | Django | Access |
|------|--------|--------|
| Public | — | Read published; `POST leads/submit` |
| Viewer | `is_staff` + view perms | Read-only admin/API |
| Editorial | content change perms | CMS CRUD, no lead export |
| Admissions | leads perms | Leads R/W, downloads, export |
| Admin | superuser / all | Users, settings, everything |

Controls:

- Secrets in env; never commit `.env`  
- `DEBUG=False` in prod; `ALLOWED_HOSTS`, CSRF trusted origins, CORS allowlist  
- Token auth for Next BFF; httpOnly cookie on Next  
- Throttle lead create; hash IPs  
- File upload validation (size, extension, signature)  
- No PII on public endpoints  
- Audit log for login, lead status, exports  
- PostgreSQL in staging/prod; backups before migrate  

---

## 6. Implementation roadmap

| Phase | Scope | Status |
|-------|--------|--------|
| **0** | Branch `backend`, Django scaffold, auth, leads, videos/insights/speakers/seminars, Next admin shell | **Done (in progress on branch)** |
| **1** | Models + admin + public API: Press, Partner, Statistic, Resource, FAQ, SiteSettings, HomepageSection | **Done** (migration `0002_site_cms_entities`) |
| **2** | Seed from `site.ts` / `faq.ts`; wire homepage + FAQ + ressources to API with fallback | **Done** — FAQ/admissions/ressources + admin screens for press/partners/resources/FAQ/settings |
| **3** | Normalize Seminar↔Speaker M2M; playlist entity if needed | **Done** (`0003_playlist_and_seminar_m2m`) — denormalized `speaker_slugs` / `playlist` kept for API compat |
| **4** | PostgreSQL docker-compose; drop JSONL dual-write behind flag; media storage | Planned |
| **5** | Full pytest suite (perms, publish filters, form PII); load/security review | Planned |
| **6** | Staging deploy docs; production only with explicit approval | Blocked on approval |

**Non-goals this cycle:** redesign public UI; invent new form types; destructive data resets; production deploy.

---

## Forms decision (from inspection)

Keep **one intake path**: Next `POST /api/submit` validates UX rules → dual-write Django `Submission` → email (smtp/resend/formsubmit) → optional Sheets.  
Admin inbox: Next `/admin/leads` (and Django Admin).  
Export: CSV via staff action; file downloads only for authenticated staff.  
Personal data: hashed IP, no public list, staff-only notes/status.
