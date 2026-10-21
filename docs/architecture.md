# Architecture — Django backend (branch `backend`)

> **Full CMS plan (audit, schema, API, security, roadmap):** [`cms-architecture.md`](./cms-architecture.md)

## Starting point

- Branch: `backend`
- Base commit: `bc89c81780d4227f427ad52be086ff14f315eda1` (`origin/main`)

## Decision

Keystatic was removed as the CMS. Django Admin (branded to the CFO 4.0 design system) is the single staff interface for:

1. **Editorial content** — videos, insights, speakers, seminars, page intros  
2. **Operations** — form submissions (candidature, document, session, rappel), files, statuses, CSV export  
3. **Audit** — status changes, exports, lead creation  

The Next.js site remains the public frontend. It reads content from `GET /api/v1/*` (with YAML fallback) and dual-writes form posts to Django.

## Layout

```
web/
├── app/ …                 # Next.js public site
├── backend/               # Django project
│   ├── config/            # settings, urls, asgi/wsgi
│   ├── apps/
│   │   ├── accounts/      # staff branding, user admin
│   │   ├── content/       # CMS models
│   │   ├── leads/         # submissions + files
│   │   └── auditlog/      # audit trail
│   ├── api/               # /api/v1/
│   ├── common/            # pagination, permissions, errors
│   ├── static/admin/css/  # design-system admin theme
│   ├── templates/admin/   # branded chrome + dashboard
│   └── tests/
└── docs/architecture.md
```

## Entity relationships

```
PageIntro (key)
Video (slug, playlist, …)
Insight (slug, category, corps JSON)
Speaker (slug, seminaires JSON)
Seminar (numero, speaker_slugs JSON)

Submission 1──* SubmissionFile
User ──* AuditEntry
```

## Security

- Secrets via env (never commit `.env`)
- `DEBUG=False` in production; HTTPS cookies; CSRF trusted origins; CORS allowlist
- Public lead create throttled; staff endpoints require `is_staff` + model perms
- Uploads capped at 5 Mo; validated extensions on model clean
- IPs stored hashed in audit / submissions

## Migration path

1. Run Django beside Next (Nginx: `/admin` + `/api/v1` → Gunicorn; `/` → Next)  
2. Seed from `content/` YAML + `data/submissions.jsonl`  
3. Point `DJANGO_API_URL` / `DJANGO_ADMIN_URL` on Next  
4. Legacy `/keystatic`, `/cms-login`, `/admin` redirect to Django  
5. Later: stop JSONL dual-write; serve media from Django/object storage  
