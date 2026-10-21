# CFO 4.0 — Django backend & administration

Branded Django admin + DRF API for the certificat site (ISCAE × BDO).

Replaces Keystatic and the Next.js `/admin` inbox.

## Quick start

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # edit DJANGO_SECRET_KEY in production
python manage.py migrate
python manage.py seed_from_frontend --leads
python manage.py createsuperuser
python manage.py runserver    # http://127.0.0.1:8000/admin/
```

API docs (DEBUG): http://127.0.0.1:8000/api/docs/

## Admin UI

- Login: `/admin/`
- Theme: Mulish + navy / BDO blue / BDO red (same tokens as the public site)
- Manage: videos, insights, speakers, seminars, page intros, leads, audit log, staff users

## API (`/api/v1/`)

| Method | Path | Auth |
|--------|------|------|
| GET | `/health/` | public |
| GET | `/videos/`, `/insights/`, `/speakers/`, `/seminars/`, `/page-intros/` | public (published only) |
| POST | `/leads/submit/` | public, throttled 12/h |
| GET/PATCH | `/leads/` | staff |
| GET | `/dashboard/stats/` | staff |

## Database

- Local default: SQLite (`db.sqlite3`)
- Production: set `DATABASE_URL=postgres://...`

## Tests

```bash
pytest
```

## Permissions matrix

| Role | Content CRUD | Leads R/W | Export | Users |
|------|--------------|-----------|--------|-------|
| Superuser | yes | yes | yes | yes |
| Staff + content perms | yes | no* | no* | no |
| Staff + leads perms | no* | yes | if `export_submission` | no |

\*Assign Django groups/permissions as needed (`Admissions`, `Éditorial`, `Lecture seule`).
