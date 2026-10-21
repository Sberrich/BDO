from django.conf import settings


def admin_brand(request):
    return {
        "CFO_SITE_NAME": getattr(settings, "SITE_NAME", "CFO 4.0"),
        "CFO_SITE_TAGLINE": getattr(settings, "SITE_TAGLINE", "Groupe ISCAE × BDO Maroc"),
        "CFO_SITE_URL": getattr(settings, "SITE_URL", "https://iscae.bdomaroc.com"),
        "CFO_FRONTEND_ORIGIN": getattr(settings, "FRONTEND_ORIGIN", "http://localhost:3000"),
    }
