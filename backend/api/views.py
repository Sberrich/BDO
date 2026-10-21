from datetime import timedelta

from django.utils import timezone
from rest_framework import mixins, status, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from api.serializers import (
    FaqGroupSerializer,
    HomepageSectionSerializer,
    InsightSerializer,
    LeadCreateSerializer,
    LeadSerializer,
    PageIntroSerializer,
    PartnerSerializer,
    PlaylistSerializer,
    PressItemSerializer,
    ResourceSerializer,
    SeminarSerializer,
    SiteSettingsSerializer,
    SpeakerSerializer,
    StatisticSerializer,
    VideoSerializer,
)
from api.throttles import LeadCreateThrottle
from apps.auditlog.middleware import get_request_ip
from apps.auditlog.services import hash_ip, log_action
from apps.content.models import (
    FaqGroup,
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
from common.permissions import IsAdmissionsOrAdmin, IsStaffOrReadOnly, IsStaffUser


class HealthView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        return Response({"status": "ok", "service": "cfo40-backend"})


class DashboardStatsView(APIView):
    permission_classes = [IsStaffUser]

    def get(self, request):
        qs = Submission.objects.all()
        week = timezone.now() - timedelta(days=7)
        return Response(
            {
                "total": qs.count(),
                "week": qs.filter(created_at__gte=week).count(),
                "candidature": qs.filter(type=Submission.Type.CANDIDATURE).count(),
                "document": qs.filter(type=Submission.Type.DOCUMENT).count(),
                "session": qs.filter(type=Submission.Type.SESSION).count(),
                "rappel": qs.filter(type=Submission.Type.RAPPEL).count(),
                "new": qs.filter(status=Submission.Status.NEW).count(),
                "videos": Video.objects.count(),
                "insights": Insight.objects.count(),
                "speakers": Speaker.objects.count(),
                "seminars": Seminar.objects.count(),
                "press": PressItem.objects.count(),
                "partners": Partner.objects.count(),
                "faq": FaqGroup.objects.count(),
                "resources": Resource.objects.count(),
                "playlists": Playlist.objects.count(),
            }
        )


class PublishedReadMixin:
    def get_queryset(self):
        qs = super().get_queryset()
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return qs
        return qs.filter(is_published=True)


class PlaylistViewSet(PublishedReadMixin, viewsets.ModelViewSet):
    queryset = Playlist.objects.all()
    serializer_class = PlaylistSerializer
    permission_classes = [IsStaffOrReadOnly]
    lookup_field = "slug"
    filterset_fields = ["is_published"]
    search_fields = ["titre", "description"]
    ordering_fields = ["ordre", "titre"]
    ordering = ["ordre", "titre"]


class VideoViewSet(PublishedReadMixin, viewsets.ModelViewSet):
    queryset = Video.objects.select_related("playlist_ref").all()
    serializer_class = VideoSerializer
    permission_classes = [IsStaffOrReadOnly]
    lookup_field = "slug"
    filterset_fields = ["playlist", "langue", "is_published", "playlist_ref__slug"]
    search_fields = ["titre", "sous_titre", "etiquette"]
    ordering_fields = ["ordre", "date", "titre"]
    ordering = ["playlist", "ordre"]


class InsightViewSet(PublishedReadMixin, viewsets.ModelViewSet):
    queryset = Insight.objects.all()
    serializer_class = InsightSerializer
    permission_classes = [IsStaffOrReadOnly]
    lookup_field = "slug"
    filterset_fields = ["category", "related_doc", "is_published"]
    search_fields = ["titre", "resume", "kicker"]
    ordering_fields = ["date", "titre"]
    ordering = ["-date"]


class SpeakerViewSet(PublishedReadMixin, viewsets.ModelViewSet):
    queryset = Speaker.objects.all()
    serializer_class = SpeakerSerializer
    permission_classes = [IsStaffOrReadOnly]
    lookup_field = "slug"
    search_fields = ["nom", "fonction", "institution"]
    ordering_fields = ["ordre", "nom"]
    ordering = ["ordre", "nom"]


class SeminarViewSet(PublishedReadMixin, viewsets.ModelViewSet):
    queryset = Seminar.objects.prefetch_related("seminar_speakers__speaker").all()
    serializer_class = SeminarSerializer
    permission_classes = [IsStaffOrReadOnly]
    lookup_field = "slug"
    search_fields = ["titre", "sous_titre", "objectif"]
    ordering_fields = ["numero"]
    ordering = ["numero"]


class PageIntroViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = PageIntro.objects.all()
    serializer_class = PageIntroSerializer
    permission_classes = [IsStaffOrReadOnly]
    lookup_field = "key"
    http_method_names = ["get", "put", "patch", "head", "options"]


class PressItemViewSet(PublishedReadMixin, viewsets.ModelViewSet):
    queryset = PressItem.objects.all()
    serializer_class = PressItemSerializer
    permission_classes = [IsStaffOrReadOnly]
    filterset_fields = ["is_published"]
    search_fields = ["nom", "titre", "description", "domaine"]
    ordering_fields = ["ordre", "nom"]
    ordering = ["ordre"]


class PartnerViewSet(PublishedReadMixin, viewsets.ModelViewSet):
    queryset = Partner.objects.all()
    serializer_class = PartnerSerializer
    permission_classes = [IsStaffOrReadOnly]
    filterset_fields = ["is_published"]
    search_fields = ["nom", "role"]
    ordering_fields = ["ordre", "nom"]
    ordering = ["ordre"]


class StatisticViewSet(PublishedReadMixin, viewsets.ModelViewSet):
    queryset = Statistic.objects.all()
    serializer_class = StatisticSerializer
    permission_classes = [IsStaffOrReadOnly]
    filterset_fields = ["group", "is_published"]
    search_fields = ["valeur", "libelle"]
    ordering_fields = ["ordre", "group"]
    ordering = ["group", "ordre"]


class ResourceViewSet(PublishedReadMixin, viewsets.ModelViewSet):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [IsStaffOrReadOnly]
    lookup_field = "key"
    filterset_fields = ["is_published"]
    search_fields = ["titre", "description", "key"]
    ordering_fields = ["ordre", "key"]
    ordering = ["ordre"]


class HomepageSectionViewSet(PublishedReadMixin, viewsets.ModelViewSet):
    queryset = HomepageSection.objects.all()
    serializer_class = HomepageSectionSerializer
    permission_classes = [IsStaffOrReadOnly]
    lookup_field = "key"
    filterset_fields = ["is_published"]
    search_fields = ["key", "title", "chapeau"]
    ordering_fields = ["ordre", "key"]
    ordering = ["ordre"]


class FaqGroupViewSet(PublishedReadMixin, viewsets.ModelViewSet):
    queryset = FaqGroup.objects.prefetch_related("questions").all()
    serializer_class = FaqGroupSerializer
    permission_classes = [IsStaffOrReadOnly]
    lookup_field = "slug"
    filterset_fields = ["is_published"]
    search_fields = ["titre", "slug"]
    ordering_fields = ["ordre", "slug"]
    ordering = ["ordre"]


class SiteSettingsView(APIView):
    """Singleton settings — GET public, PATCH staff."""

    def get_permissions(self):
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            return [AllowAny()]
        return [IsStaffUser()]

    def get(self, request):
        settings_obj = SiteSettings.load()
        return Response(SiteSettingsSerializer(settings_obj).data)

    def patch(self, request):
        settings_obj = SiteSettings.load()
        serializer = SiteSettingsSerializer(settings_obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def put(self, request):
        return self.patch(request)


class HomepageAggregateView(APIView):
    """Published homepage payload for `/` — sections + related lists."""

    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        staff = request.user.is_authenticated and request.user.is_staff

        def pub(qs):
            return qs if staff else qs.filter(is_published=True)

        sections = HomepageSectionSerializer(
            pub(HomepageSection.objects.all()), many=True, context={"request": request}
        ).data
        return Response(
            {
                "settings": SiteSettingsSerializer(SiteSettings.load()).data,
                "sections": sections,
                "statistics": StatisticSerializer(pub(Statistic.objects.all()), many=True).data,
                "partners": PartnerSerializer(pub(Partner.objects.all()), many=True).data,
                "press": PressItemSerializer(pub(PressItem.objects.all()), many=True).data,
                "resources": ResourceSerializer(pub(Resource.objects.all()), many=True).data,
            }
        )


class LeadCreateView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    throttle_classes = [LeadCreateThrottle]

    def post(self, request):
        serializer = LeadCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        submission = serializer.save()
        submission.ip_hash = hash_ip(get_request_ip())
        submission.save(update_fields=["ip_hash"])
        log_action(
            action="lead_created",
            object_type="Submission",
            object_id=submission.id,
            message=f"Nouvelle {submission.type}",
            metadata={"type": submission.type},
            ip=get_request_ip(),
        )
        return Response({"ok": True, "id": submission.id}, status=status.HTTP_201_CREATED)


class LeadViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Submission.objects.prefetch_related("files").all()
    serializer_class = LeadSerializer
    permission_classes = [IsAdmissionsOrAdmin]
    filterset_fields = ["type", "status"]
    search_fields = ["full_name", "email", "id"]
    ordering_fields = ["created_at", "type", "status"]
    ordering = ["-created_at"]
    http_method_names = ["get", "patch", "head", "options"]

    def perform_update(self, serializer):
        prev = serializer.instance.status
        instance = serializer.save()
        if prev != instance.status:
            log_action(
                action="submission_status_change",
                actor=self.request.user,
                object_type="Submission",
                object_id=instance.id,
                message=f"Statut {prev} → {instance.status}",
                metadata={"from": prev, "to": instance.status},
                ip=get_request_ip(),
            )
