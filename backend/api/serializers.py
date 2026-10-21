from rest_framework import serializers

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
from apps.leads.models import Submission, SubmissionFile


class PlaylistSerializer(serializers.ModelSerializer):
    isPublished = serializers.BooleanField(source="is_published", required=False)
    videoCount = serializers.SerializerMethodField()

    class Meta:
        model = Playlist
        fields = ("slug", "titre", "description", "ordre", "isPublished", "videoCount")
        extra_kwargs = {"slug": {"required": False}}

    def get_videoCount(self, obj):
        return obj.videos.filter(is_published=True).count()


class VideoSerializer(serializers.ModelSerializer):
    sousTitre = serializers.CharField(source="sous_titre", required=False, allow_blank=True)
    etiquette = serializers.CharField(required=False, allow_blank=True)
    isPublished = serializers.BooleanField(source="is_published", required=False)
    playlistSlug = serializers.SerializerMethodField()

    class Meta:
        model = Video
        fields = (
            "slug",
            "titre",
            "playlist",
            "playlistSlug",
            "ordre",
            "sousTitre",
            "etiquette",
            "fichier",
            "poster",
            "duree",
            "langue",
            "date",
            "resume",
            "isPublished",
        )
        extra_kwargs = {"slug": {"required": False}}

    def get_playlistSlug(self, obj):
        return obj.playlist_ref.slug if obj.playlist_ref_id else None

    def _resolve_playlist(self, titre: str | None):
        name = (titre or "Témoignages").strip() or "Témoignages"
        pl, _ = Playlist.objects.get_or_create(titre=name[:120], defaults={"ordre": 1, "is_published": True})
        return pl

    def create(self, validated_data):
        playlist_name = validated_data.get("playlist") or "Témoignages"
        pl = self._resolve_playlist(playlist_name)
        validated_data["playlist_ref"] = pl
        validated_data["playlist"] = pl.titre[:60]
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if "playlist" in validated_data:
            pl = self._resolve_playlist(validated_data.get("playlist"))
            validated_data["playlist_ref"] = pl
            validated_data["playlist"] = pl.titre[:60]
        return super().update(instance, validated_data)


class InsightSerializer(serializers.ModelSerializer):
    dateLabel = serializers.CharField(source="date_label", required=False, allow_blank=True)
    relatedDoc = serializers.CharField(source="related_doc")
    isPublished = serializers.BooleanField(source="is_published", required=False)

    class Meta:
        model = Insight
        fields = (
            "slug",
            "titre",
            "category",
            "kicker",
            "date",
            "dateLabel",
            "lecture",
            "resume",
            "corps",
            "source",
            "relatedDoc",
            "isPublished",
        )
        extra_kwargs = {"slug": {"required": False}}


class SpeakerSerializer(serializers.ModelSerializer):
    isPublished = serializers.BooleanField(source="is_published", required=False)

    class Meta:
        model = Speaker
        fields = (
            "slug",
            "nom",
            "fonction",
            "institution",
            "photo",
            "bio",
            "linkedin",
            "seminaires",
            "ordre",
            "isPublished",
        )


class SpeakerSlugListField(serializers.ListField):
    """Read from M2M (fallback speaker_slugs); write accepts ordered slug list."""

    def __init__(self, **kwargs):
        kwargs.setdefault("child", serializers.CharField(max_length=140))
        kwargs.setdefault("required", False)
        super().__init__(**kwargs)

    def get_attribute(self, instance):
        # Cache is the ordered public list (includes guests not yet in Speaker table).
        cached = list(instance.speaker_slugs or [])
        if cached:
            return cached
        return list(
            instance.seminar_speakers.select_related("speaker")
            .order_by("ordre", "id")
            .values_list("speaker__slug", flat=True)
        )


class SeminarSerializer(serializers.ModelSerializer):
    sousTitre = serializers.CharField(source="sous_titre", required=False, allow_blank=True)
    jour1 = serializers.SerializerMethodField()
    jour2 = serializers.SerializerMethodField()
    intervenants = SpeakerSlugListField()
    isPublished = serializers.BooleanField(source="is_published", required=False)
    jour1Matin = serializers.CharField(source="jour1_matin", required=False, allow_blank=True)
    jour1ApresMidi = serializers.CharField(source="jour1_apres_midi", required=False, allow_blank=True)
    jour2Matin = serializers.CharField(source="jour2_matin", required=False, allow_blank=True)
    jour2ApresMidi = serializers.CharField(source="jour2_apres_midi", required=False, allow_blank=True)

    class Meta:
        model = Seminar
        fields = (
            "numero",
            "slug",
            "code",
            "titre",
            "sousTitre",
            "objectif",
            "dates",
            "horaire",
            "heures",
            "lieu",
            "jour1",
            "jour2",
            "jour1Matin",
            "jour1ApresMidi",
            "jour2Matin",
            "jour2ApresMidi",
            "livrable",
            "actualisation",
            "intervenants",
            "isPublished",
        )
        extra_kwargs = {"slug": {"required": False}}

    def get_jour1(self, obj):
        if not obj.jour1_matin and not obj.jour1_apres_midi:
            return None
        return {"matin": obj.jour1_matin, "apresMidi": obj.jour1_apres_midi}

    def get_jour2(self, obj):
        if not obj.jour2_matin and not obj.jour2_apres_midi:
            return None
        return {"matin": obj.jour2_matin, "apresMidi": obj.jour2_apres_midi}

    def create(self, validated_data):
        slugs = validated_data.pop("intervenants", None)
        seminar = super().create(validated_data)
        if slugs is not None:
            seminar.set_speakers_by_slugs(slugs)
        return seminar

    def update(self, instance, validated_data):
        slugs = validated_data.pop("intervenants", None)
        seminar = super().update(instance, validated_data)
        if slugs is not None:
            seminar.set_speakers_by_slugs(slugs)
        return seminar


class PageIntroSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageIntro
        fields = ("key", "chapeau")
        read_only_fields = ("key",)


class SiteSettingsSerializer(serializers.ModelSerializer):
    sousTitreOfficiel = serializers.CharField(source="sous_titre_officiel", required=False, allow_blank=True)
    baseUrl = serializers.URLField(source="base_url", required=False, allow_blank=True)
    promesse = serializers.SerializerMethodField()
    contact = serializers.SerializerMethodField()
    seoTitleTemplate = serializers.CharField(source="seo_title_template", required=False, allow_blank=True)
    seoDescriptionDefault = serializers.CharField(
        source="seo_description_default", required=False, allow_blank=True
    )
    showFlags = serializers.JSONField(source="show_flags", required=False)

    class Meta:
        model = SiteSettings
        fields = (
            "nom",
            "sousTitreOfficiel",
            "cosignature",
            "domaine",
            "baseUrl",
            "promesse",
            "contact",
            "seoTitleTemplate",
            "seoDescriptionDefault",
            "showFlags",
            "promesse_titre",
            "promesse_sous_titre",
            "contact_nom",
            "contact_fonction",
            "contact_email",
            "contact_telephone",
            "contact_linkedin",
            "adresse_iscae",
            "lieu_formation",
        )
        extra_kwargs = {
            "promesse_titre": {"write_only": True, "required": False},
            "promesse_sous_titre": {"write_only": True, "required": False},
            "contact_nom": {"write_only": True, "required": False},
            "contact_fonction": {"write_only": True, "required": False},
            "contact_email": {"write_only": True, "required": False},
            "contact_telephone": {"write_only": True, "required": False},
            "contact_linkedin": {"write_only": True, "required": False},
            "adresse_iscae": {"write_only": True, "required": False},
            "lieu_formation": {"write_only": True, "required": False},
        }

    def get_promesse(self, obj):
        return {"titre": obj.promesse_titre, "sousTitre": obj.promesse_sous_titre}

    def get_contact(self, obj):
        return {
            "nom": obj.contact_nom,
            "fonction": obj.contact_fonction,
            "email": obj.contact_email,
            "telephone": obj.contact_telephone,
            "linkedin": obj.contact_linkedin,
            "adresseIscae": obj.adresse_iscae,
            "lieuFormation": obj.lieu_formation,
        }


class HomepageSectionSerializer(serializers.ModelSerializer):
    isPublished = serializers.BooleanField(source="is_published", required=False)

    class Meta:
        model = HomepageSection
        fields = ("key", "title", "chapeau", "body", "ordre", "isPublished")


class StatisticSerializer(serializers.ModelSerializer):
    isPublished = serializers.BooleanField(source="is_published", required=False)

    class Meta:
        model = Statistic
        fields = ("id", "group", "valeur", "unite", "libelle", "icone", "accent", "ordre", "isPublished")
        read_only_fields = ("id",)


class PartnerSerializer(serializers.ModelSerializer):
    isPublished = serializers.BooleanField(source="is_published", required=False)
    lien = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Partner
        fields = ("id", "nom", "role", "logo", "lien", "ordre", "isPublished")
        read_only_fields = ("id",)


class PressItemSerializer(serializers.ModelSerializer):
    isPublished = serializers.BooleanField(source="is_published", required=False)

    class Meta:
        model = PressItem
        fields = (
            "id",
            "nom",
            "titre",
            "description",
            "lien",
            "logo",
            "domaine",
            "apercu",
            "ordre",
            "isPublished",
        )
        read_only_fields = ("id",)


class ResourceSerializer(serializers.ModelSerializer):
    isPublished = serializers.BooleanField(source="is_published", required=False)

    class Meta:
        model = Resource
        fields = (
            "key",
            "titre",
            "description",
            "fichier",
            "cover",
            "href",
            "icon",
            "poids",
            "ordre",
            "isPublished",
        )


class FaqItemSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="external_id")
    q = serializers.CharField(source="question")
    court = serializers.CharField(source="reponse_courte", required=False, allow_blank=True)
    r = serializers.CharField(source="reponse_html")
    lien = serializers.SerializerMethodField()
    hidesIfTarif = serializers.BooleanField(source="hides_if_tarif", required=False)
    isPublished = serializers.BooleanField(source="is_published", required=False)

    class Meta:
        model = FaqItem
        fields = (
            "id",
            "q",
            "court",
            "r",
            "lien",
            "accueil",
            "hidesIfTarif",
            "ordre",
            "isPublished",
            "external_id",
            "question",
            "reponse_courte",
            "reponse_html",
            "lien_texte",
            "lien_href",
            "hides_if_tarif",
            "group",
        )
        extra_kwargs = {
            "external_id": {"write_only": True, "required": False},
            "question": {"write_only": True, "required": False},
            "reponse_courte": {"write_only": True, "required": False},
            "reponse_html": {"write_only": True, "required": False},
            "lien_texte": {"write_only": True, "required": False},
            "lien_href": {"write_only": True, "required": False},
            "hides_if_tarif": {"write_only": True, "required": False},
            "group": {"write_only": True, "required": False},
        }

    def get_lien(self, obj):
        if not obj.lien_texte and not obj.lien_href:
            return None
        return {"texte": obj.lien_texte, "href": obj.lien_href}


class FaqGroupSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="slug")
    questions = serializers.SerializerMethodField()
    isPublished = serializers.BooleanField(source="is_published", required=False)

    class Meta:
        model = FaqGroup
        fields = ("id", "titre", "ordre", "isPublished", "questions", "slug")
        extra_kwargs = {"slug": {"write_only": True, "required": False}}

    def get_questions(self, obj):
        request = self.context.get("request")
        qs = obj.questions.all()
        if not (request and request.user.is_authenticated and request.user.is_staff):
            qs = qs.filter(is_published=True)
        return FaqItemSerializer(qs, many=True, context=self.context).data


class SubmissionFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubmissionFile
        fields = ("id", "field", "label", "original_name", "size", "content_type")


class LeadSerializer(serializers.ModelSerializer):
    files = SubmissionFileSerializer(many=True, read_only=True)

    class Meta:
        model = Submission
        fields = (
            "id",
            "type",
            "status",
            "fields",
            "notes",
            "email",
            "full_name",
            "created_at",
            "updated_at",
            "files",
        )
        read_only_fields = ("id", "type", "fields", "email", "full_name", "created_at", "updated_at", "files")


class LeadCreateSerializer(serializers.Serializer):
    type = serializers.ChoiceField(choices=Submission.Type.choices)
    fields = serializers.DictField(child=serializers.CharField(allow_blank=True, max_length=2000))

    REQUIRED = {
        "document": ["prenom", "nom", "fonction", "email", "document"],
        "session": ["prenom", "nom", "fonction", "email", "creneau"],
        "rappel": ["prenom", "nom", "fonction", "email", "telephone", "moment"],
        "candidature": [
            "prenom",
            "nom",
            "email",
            "telephone",
            "ville",
            "participation",
            "secteur",
            "niveau",
            "diplome",
            "decouverte",
            "interet",
            "consentement",
        ],
    }

    def validate(self, attrs):
        form_type = attrs["type"]
        fields = attrs["fields"]
        missing = [k for k in self.REQUIRED.get(form_type, []) if not str(fields.get(k, "")).strip()]
        if missing:
            raise serializers.ValidationError({"fields": {k: ["Ce champ est obligatoire."] for k in missing}})
        email = str(fields.get("email", "")).strip()
        if email and "@" not in email:
            raise serializers.ValidationError({"fields": {"email": ["Adresse e-mail invalide."]}})
        if str(fields.get("_hp", "")).strip():
            raise serializers.ValidationError("Rejected.")
        return attrs

    def create(self, validated_data):
        cleaned = {}
        for k, v in validated_data["fields"].items():
            if k in {"_hp", "_ts", "type"}:
                continue
            cleaned[k] = str(v).replace("\x00", "").strip()[:2000]
        return Submission.objects.create(type=validated_data["type"], fields=cleaned)
