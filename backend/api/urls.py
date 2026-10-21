from django.urls import include, path
from rest_framework.routers import DefaultRouter

from api.auth_views import LoginView, LogoutView, MeView
from api.views import (
    DashboardStatsView,
    FaqGroupViewSet,
    HealthView,
    HomepageAggregateView,
    HomepageSectionViewSet,
    InsightViewSet,
    LeadCreateView,
    LeadViewSet,
    PageIntroViewSet,
    PartnerViewSet,
    PlaylistViewSet,
    PressItemViewSet,
    ResourceViewSet,
    SeminarViewSet,
    SiteSettingsView,
    SpeakerViewSet,
    StatisticViewSet,
    VideoViewSet,
)

app_name = "api-v1"

router = DefaultRouter()
router.register(r"playlists", PlaylistViewSet, basename="playlist")
router.register(r"videos", VideoViewSet, basename="video")
router.register(r"insights", InsightViewSet, basename="insight")
router.register(r"speakers", SpeakerViewSet, basename="speaker")
router.register(r"seminars", SeminarViewSet, basename="seminar")
router.register(r"page-intros", PageIntroViewSet, basename="page-intro")
router.register(r"press", PressItemViewSet, basename="press")
router.register(r"partners", PartnerViewSet, basename="partner")
router.register(r"statistics", StatisticViewSet, basename="statistic")
router.register(r"resources", ResourceViewSet, basename="resource")
router.register(r"homepage-sections", HomepageSectionViewSet, basename="homepage-section")
router.register(r"faq", FaqGroupViewSet, basename="faq")
router.register(r"leads", LeadViewSet, basename="lead")

urlpatterns = [
    path("health/", HealthView.as_view(), name="health"),
    path("auth/login/", LoginView.as_view(), name="auth-login"),
    path("auth/logout/", LogoutView.as_view(), name="auth-logout"),
    path("auth/me/", MeView.as_view(), name="auth-me"),
    path("dashboard/stats/", DashboardStatsView.as_view(), name="dashboard-stats"),
    path("settings/", SiteSettingsView.as_view(), name="settings"),
    path("homepage/", HomepageAggregateView.as_view(), name="homepage"),
    path("leads/submit/", LeadCreateView.as_view(), name="lead-submit"),
    path("", include(router.urls)),
]
