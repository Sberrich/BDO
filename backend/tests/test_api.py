import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient

from apps.content.models import Video
from apps.leads.models import Submission


@pytest.fixture
def api():
    return APIClient()


@pytest.mark.django_db
def test_health(api):
    res = api.get("/api/v1/health/")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"


@pytest.mark.django_db
def test_videos_public_hides_drafts(api):
    Video.objects.create(
        titre="Publiée",
        slug="pub",
        fichier="/videos/a.mp4",
        is_published=True,
        ordre=1,
    )
    Video.objects.create(
        titre="Brouillon",
        slug="draft",
        fichier="/videos/b.mp4",
        is_published=False,
        ordre=2,
    )
    res = api.get("/api/v1/videos/")
    assert res.status_code == 200
    slugs = [r["slug"] for r in res.json()["results"]]
    assert "pub" in slugs
    assert "draft" not in slugs


@pytest.mark.django_db
def test_lead_create_and_staff_list(api):
    res = api.post(
        "/api/v1/leads/submit/",
        {
            "type": "rappel",
            "fields": {
                "prenom": "Amina",
                "nom": "Benali",
                "fonction": "DAF",
                "email": "amina@example.com",
                "telephone": "+212612345678",
                "moment": "matin",
            },
        },
        format="json",
    )
    assert res.status_code == 201
    lead_id = res.json()["id"]
    assert Submission.objects.filter(pk=lead_id).exists()

    # anonymous cannot list
    assert api.get("/api/v1/leads/").status_code in (401, 403)

    user = User.objects.create_user("staff", password="x", is_staff=True)
    user.user_permissions.add(
        *__import__("django.contrib.auth.models", fromlist=["Permission"]).Permission.objects.filter(
            codename__in=["view_submission", "change_submission"]
        )
    )
    api.force_authenticate(user=user)
    listed = api.get("/api/v1/leads/")
    assert listed.status_code == 200
    assert listed.json()["count"] >= 1


@pytest.mark.django_db
def test_lead_validation(api):
    res = api.post(
        "/api/v1/leads/submit/",
        {"type": "rappel", "fields": {"prenom": "A"}},
        format="json",
    )
    assert res.status_code == 400
    assert "errors" in res.json()


@pytest.mark.django_db
def test_press_and_partners_public(api):
    from apps.content.models import Partner, PressItem

    PressItem.objects.create(
        nom="Test Media",
        titre="Titre",
        lien="https://example.com/a",
        is_published=True,
        ordre=1,
    )
    PressItem.objects.create(
        nom="Draft",
        titre="Hidden",
        lien="https://example.com/b",
        is_published=False,
        ordre=2,
    )
    Partner.objects.create(nom="ISCAE", role="Cosignataire", is_published=True, ordre=1)

    press = api.get("/api/v1/press/")
    assert press.status_code == 200
    noms = [r["nom"] for r in press.json()["results"]]
    assert "Test Media" in noms
    assert "Draft" not in noms

    partners = api.get("/api/v1/partners/")
    assert partners.status_code == 200
    assert partners.json()["count"] >= 1


@pytest.mark.django_db
def test_settings_and_homepage_aggregate(api):
    from apps.content.models import SiteSettings

    SiteSettings.load()
    settings = api.get("/api/v1/settings/")
    assert settings.status_code == 200
    assert "contact" in settings.json()
    assert "nom" in settings.json()

    home = api.get("/api/v1/homepage/")
    assert home.status_code == 200
    body = home.json()
    assert "settings" in body
    assert "press" in body
    assert "partners" in body
    assert "statistics" in body


@pytest.mark.django_db
def test_seminar_speaker_m2m_and_playlist(api):
    from apps.content.models import Playlist, Seminar, Speaker, Video

    sp = Speaker.objects.create(slug="ismail-lahsini", nom="Ismail Lahsini", is_published=True)
    seminar = Seminar.objects.create(
        numero=0,
        slug="conference-inaugurale",
        titre="Conférence inaugurale",
        is_published=True,
    )
    seminar.set_speakers_by_slugs(["ismail-lahsini", "unknown-guest"])
    assert list(seminar.speakers.values_list("slug", flat=True)) == ["ismail-lahsini"]
    assert seminar.speaker_slugs == ["ismail-lahsini", "unknown-guest"]

    res = api.get("/api/v1/seminars/conference-inaugurale/")
    assert res.status_code == 200
    assert res.json()["intervenants"] == ["ismail-lahsini", "unknown-guest"]

    pl = Playlist.objects.create(titre="Témoignages", slug="temoignages", is_published=True)
    Video.objects.create(
        titre="Pub",
        slug="pub-pl",
        fichier="/videos/a.mp4",
        playlist_ref=pl,
        playlist="Témoignages",
        is_published=True,
        ordre=1,
    )
    listed = api.get("/api/v1/playlists/")
    assert listed.status_code == 200
    assert any(r["slug"] == "temoignages" for r in listed.json()["results"])
    sp.refresh_from_db()
    assert sp.seminaires == [0]


@pytest.mark.django_db
def test_faq_nested_questions(api):
    from apps.content.models import FaqGroup, FaqItem

    group = FaqGroup.objects.create(slug="programme", titre="Le programme", ordre=1)
    FaqItem.objects.create(
        group=group,
        external_id="faq-test",
        question="Question ?",
        reponse_html="<p>Réponse</p>",
        is_published=True,
        ordre=1,
    )
    FaqItem.objects.create(
        group=group,
        external_id="faq-draft",
        question="Brouillon ?",
        reponse_html="<p>Non</p>",
        is_published=False,
        ordre=2,
    )
    res = api.get("/api/v1/faq/")
    assert res.status_code == 200
    groups = res.json()["results"]
    assert len(groups) == 1
    ids = [q["id"] for q in groups[0]["questions"]]
    assert "faq-test" in ids
    assert "faq-draft" not in ids
