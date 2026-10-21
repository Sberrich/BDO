"""
Import Keystatic YAML (+ optional JSONL leads) into Django.

Usage (from web/backend):
  python manage.py seed_from_frontend
  python manage.py seed_from_frontend --leads
"""
from __future__ import annotations

import json
from datetime import date, datetime
from pathlib import Path

from django.core.management.base import BaseCommand
from django.utils.dateparse import parse_date

from apps.content.models import (
    FaqGroup,
    FaqItem,
    HomepageSection,
    Insight,
    PageIntro,
    Partner,
    Playlist,
    PressItem,
    Resource,
    Seminar,
    SiteSettings,
    Speaker,
    Statistic,
    Video,
)
from apps.leads.models import Submission

try:
    import yaml
except ImportError:  # pragma: no cover
    yaml = None


def web_root() -> Path:
    # backend/ → web/
    return Path(__file__).resolve().parents[5]


def slug_name(value, fallback: str) -> str:
    if isinstance(value, str) and value.strip():
        return value.strip()
    if isinstance(value, dict):
        name = value.get("name") or value.get("slug")
        if isinstance(name, str) and name.strip():
            return name.strip()
    return fallback


class Command(BaseCommand):
    help = "Seed Django content from web/content YAML (and optionally data/submissions.jsonl)."

    def add_arguments(self, parser):
        parser.add_argument("--leads", action="store_true", help="Also import submissions.jsonl")
        parser.add_argument(
            "--content-dir",
            default=None,
            help="Path to content/ (default: ../content relative to backend)",
        )

    def handle(self, *args, **options):
        if yaml is None:
            self.stderr.write("PyYAML is required: pip install pyyaml")
            return

        content_dir = Path(options["content_dir"] or (web_root() / "content"))
        if not content_dir.is_dir():
            self.stderr.write(f"Content dir not found: {content_dir}")
            return

        self._seed_page_intros(content_dir)
        self._seed_videos(content_dir / "videos")
        self._seed_insights(content_dir / "insights")
        self._seed_speakers(content_dir / "intervenants")
        self._seed_seminars()
        self._seed_site_content()

        if options["leads"]:
            self._seed_leads(web_root() / "data" / "submissions.jsonl")

        self.stdout.write(self.style.SUCCESS("Seed completed."))

    def _seed_page_intros(self, content_dir: Path):
        mapping = {
            "playlists-page.yaml": PageIntro.PageKey.PLAYLISTS,
            "insights-page.yaml": PageIntro.PageKey.INSIGHTS,
            "intervenants-page.yaml": PageIntro.PageKey.INTERVENANTS,
        }
        for filename, key in mapping.items():
            path = content_dir / filename
            if not path.exists():
                continue
            data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
            obj, created = PageIntro.objects.update_or_create(
                key=key,
                defaults={"chapeau": (data.get("chapeau") or "")[:280]},
            )
            self.stdout.write(f"  page-intro {obj.key}: {'created' if created else 'updated'}")

    def _seed_videos(self, folder: Path):
        if not folder.is_dir():
            return
        for path in sorted(folder.glob("*.yaml")):
            data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
            slug = path.stem
            titre = slug_name(data.get("titre"), slug)
            d = data.get("date")
            if isinstance(d, datetime):
                d = d.date()
            elif isinstance(d, str):
                d = parse_date(d)
            elif not isinstance(d, date):
                d = None
            playlist_name = (data.get("playlist") or "Témoignages")[:60]
            pl, _ = Playlist.objects.get_or_create(
                titre=playlist_name[:120],
                defaults={"ordre": 1, "is_published": True},
            )
            obj, created = Video.objects.update_or_create(
                slug=slug,
                defaults={
                    "titre": titre[:120],
                    "playlist_ref": pl,
                    "playlist": pl.titre[:60],
                    "ordre": int(data.get("ordre") or 1),
                    "sous_titre": (data.get("sousTitre") or "")[:200],
                    "etiquette": (data.get("etiquette") or "")[:120],
                    "fichier": data.get("fichier") or "",
                    "poster": data.get("poster") or "",
                    "duree": (data.get("duree") or "")[:40],
                    "langue": (data.get("langue") or "FR")[:2],
                    "date": d,
                    "resume": (data.get("resume") or "")[:300],
                    "is_published": True,
                },
            )
            self.stdout.write(f"  video {obj.slug}: {'created' if created else 'updated'}")

    def _seed_insights(self, folder: Path):
        if not folder.is_dir():
            return
        for path in sorted(folder.glob("*.yaml")):
            if path.name.startswith("_"):
                continue
            data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
            slug = path.stem
            titre = slug_name(data.get("titre"), slug)
            d = data.get("date")
            if isinstance(d, datetime):
                d = d.date()
            elif isinstance(d, str):
                d = parse_date(d)
            if not d:
                self.stderr.write(f"  skip insight {slug}: missing date")
                continue
            corps = data.get("corps") or []
            if not isinstance(corps, list):
                corps = [str(corps)]
            obj, created = Insight.objects.update_or_create(
                slug=slug,
                defaults={
                    "titre": titre[:120],
                    "category": data.get("category") or Insight.Category.METHODE,
                    "kicker": (data.get("kicker") or "")[:120],
                    "date": d,
                    "date_label": (data.get("dateLabel") or "")[:40],
                    "lecture": (data.get("lecture") or "5 min")[:20],
                    "resume": (data.get("resume") or "")[:400],
                    "corps": [str(p) for p in corps if p],
                    "source": data.get("source") or "",
                    "related_doc": data.get("relatedDoc") or Insight.RelatedDoc.BROCHURE,
                    "is_published": True,
                },
            )
            self.stdout.write(f"  insight {obj.slug}: {'created' if created else 'updated'}")

    def _seed_speakers(self, folder: Path):
        if not folder.is_dir():
            return
        for path in sorted(folder.glob("*.yaml")):
            data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
            slug = path.stem
            nom = slug_name(data.get("nom"), slug)
            seminaires = data.get("seminaires") or []
            if not isinstance(seminaires, list):
                seminaires = []
            obj, created = Speaker.objects.update_or_create(
                slug=slug,
                defaults={
                    "nom": nom[:120],
                    "fonction": (data.get("fonction") or "")[:200],
                    "institution": (data.get("institution") or "")[:200],
                    "photo": data.get("photo") or "",
                    "bio": data.get("bio") or "",
                    "linkedin": data.get("linkedin") or "",
                    "seminaires": [int(n) for n in seminaires if str(n).isdigit() or isinstance(n, int)],
                    "is_published": True,
                },
            )
            self.stdout.write(f"  speaker {obj.slug}: {'created' if created else 'updated'}")

    def _seed_seminars(self):
        path = web_root() / "backend" / "fixtures" / "seminars_seed.json"
        if not path.exists():
            self.stderr.write(f"No seminars fixture: {path}")
            return
        rows = json.loads(path.read_text(encoding="utf-8"))
        for row in rows:
            slug = row.get("slug") or f"seminaire-{row.get('numero')}"
            jour1 = row.get("jour1") or {}
            jour2 = row.get("jour2") or {}
            obj, created = Seminar.objects.update_or_create(
                slug=slug,
                defaults={
                    "numero": int(row.get("numero") or 0),
                    "code": (row.get("code") or "")[:20],
                    "titre": (row.get("titre") or slug)[:200],
                    "sous_titre": (row.get("sousTitre") or "")[:300],
                    "objectif": row.get("objectif") or "",
                    "dates": (row.get("dates") or "")[:120],
                    "horaire": (row.get("horaire") or "")[:80],
                    "heures": int(row.get("heures") or 0),
                    "lieu": (row.get("lieu") or "")[:120],
                    "jour1_matin": jour1.get("matin") or "",
                    "jour1_apres_midi": jour1.get("apresMidi") or "",
                    "jour2_matin": jour2.get("matin") or "",
                    "jour2_apres_midi": jour2.get("apresMidi") or "",
                    "livrable": row.get("livrable") or "",
                    "actualisation": row.get("actualisation") or "",
                    "is_published": True,
                },
            )
            obj.set_speakers_by_slugs(list(row.get("intervenants") or []))
            self.stdout.write(f"  seminar {obj.slug}: {'created' if created else 'updated'}")

    def _seed_site_content(self):
        path = web_root() / "backend" / "fixtures" / "site_content_seed.json"
        if not path.exists():
            self.stderr.write(f"No site content fixture: {path}")
            return
        data = json.loads(path.read_text(encoding="utf-8"))

        settings_data = data.get("settings") or {}
        settings = SiteSettings.load()
        for field, value in settings_data.items():
            setattr(settings, field, value)
        settings.save()
        self.stdout.write("  site-settings: updated")

        for row in data.get("sections") or []:
            obj, created = HomepageSection.objects.update_or_create(
                key=row["key"],
                defaults={
                    "title": (row.get("title") or "")[:200],
                    "chapeau": row.get("chapeau") or "",
                    "body": row.get("body") or {},
                    "ordre": int(row.get("ordre") or 100),
                    "is_published": True,
                },
            )
            self.stdout.write(f"  section {obj.key}: {'created' if created else 'updated'}")

        # Idempotent: clear then recreate stats/partners/press by natural keys
        Statistic.objects.all().delete()
        for row in data.get("statistics") or []:
            Statistic.objects.create(
                group=row["group"],
                valeur=str(row.get("valeur") or "")[:40],
                unite=(row.get("unite") or "")[:40],
                libelle=(row.get("libelle") or "")[:200],
                icone=(row.get("icone") or "")[:40],
                accent=bool(row.get("accent")),
                ordre=int(row.get("ordre") or 1),
                is_published=True,
            )
        self.stdout.write(f"  statistics: {len(data.get('statistics') or [])}")

        Partner.objects.all().delete()
        for row in data.get("partners") or []:
            Partner.objects.create(
                nom=(row.get("nom") or "")[:120],
                role=(row.get("role") or "")[:120],
                logo=row.get("logo") or "",
                lien=row.get("lien") or "",
                ordre=int(row.get("ordre") or 1),
                is_published=True,
            )
        self.stdout.write(f"  partners: {len(data.get('partners') or [])}")

        PressItem.objects.all().delete()
        for row in data.get("press") or []:
            PressItem.objects.create(
                nom=(row.get("nom") or "")[:120],
                titre=(row.get("titre") or "")[:300],
                description=row.get("description") or "",
                lien=row.get("lien") or "",
                logo=row.get("logo") or "",
                domaine=(row.get("domaine") or "")[:120],
                apercu=row.get("apercu") or "",
                ordre=int(row.get("ordre") or 1),
                is_published=True,
            )
        self.stdout.write(f"  press: {len(data.get('press') or [])}")

        for row in data.get("resources") or []:
            obj, created = Resource.objects.update_or_create(
                key=row["key"],
                defaults={
                    "titre": (row.get("titre") or row["key"])[:200],
                    "description": (row.get("description") or "")[:300],
                    "fichier": row.get("fichier") or "",
                    "cover": row.get("cover") or "",
                    "href": row.get("href") or "",
                    "icon": (row.get("icon") or "")[:40],
                    "poids": (row.get("poids") or "")[:40],
                    "ordre": int(row.get("ordre") or 1),
                    "is_published": True,
                },
            )
            self.stdout.write(f"  resource {obj.key}: {'created' if created else 'updated'}")

        for group_row in data.get("faq_groups") or []:
            group, created = FaqGroup.objects.update_or_create(
                slug=group_row["slug"],
                defaults={
                    "titre": (group_row.get("titre") or group_row["slug"])[:120],
                    "ordre": int(group_row.get("ordre") or 1),
                    "is_published": True,
                },
            )
            self.stdout.write(f"  faq-group {group.slug}: {'created' if created else 'updated'}")
            for q in group_row.get("questions") or []:
                FaqItem.objects.update_or_create(
                    external_id=q["external_id"],
                    defaults={
                        "group": group,
                        "question": (q.get("question") or "")[:400],
                        "reponse_courte": q.get("reponse_courte") or "",
                        "reponse_html": q.get("reponse_html") or "",
                        "lien_texte": (q.get("lien_texte") or "")[:120],
                        "lien_href": (q.get("lien_href") or "")[:200],
                        "accueil": bool(q.get("accueil")),
                        "hides_if_tarif": bool(q.get("hides_if_tarif")),
                        "ordre": int(q.get("ordre") or 1),
                        "is_published": True,
                    },
                )

    def _seed_leads(self, path: Path):
        if not path.exists():
            self.stderr.write(f"No leads file: {path}")
            return
        n = 0
        for line in path.read_text(encoding="utf-8").splitlines():
            if not line.strip():
                continue
            try:
                row = json.loads(line)
            except json.JSONDecodeError:
                continue
            sid = row.get("id")
            if not sid or Submission.objects.filter(pk=sid).exists():
                continue
            created_at = row.get("createdAt")
            Submission.objects.create(
                id=sid,
                type=row.get("type") or Submission.Type.DOCUMENT,
                fields=row.get("fields") or {},
                created_at=datetime.fromisoformat(created_at.replace("Z", "+00:00"))
                if created_at
                else datetime.utcnow(),
            )
            n += 1
        self.stdout.write(f"  leads imported: {n}")
