from django.contrib import admin

from .models import (
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
    SeminarSpeaker,
    SiteSettings,
    Speaker,
    Statistic,
    Video,
)


class PublishedFilter(admin.SimpleListFilter):
    title = "publication"
    parameter_name = "pub"

    def lookups(self, request, model_admin):
        return (("1", "Publié"), ("0", "Brouillon"))

    def queryset(self, request, queryset):
        if self.value() == "1":
            return queryset.filter(is_published=True)
        if self.value() == "0":
            return queryset.filter(is_published=False)
        return queryset


@admin.register(PageIntro)
class PageIntroAdmin(admin.ModelAdmin):
    list_display = ("key", "chapeau_short", "updated_at")
    search_fields = ("chapeau",)

    @admin.display(description="Chapeau")
    def chapeau_short(self, obj):
        return (obj.chapeau or "")[:80]


@admin.register(Playlist)
class PlaylistAdmin(admin.ModelAdmin):
    list_display = ("titre", "slug", "ordre", "is_published", "video_count")
    list_filter = (PublishedFilter,)
    search_fields = ("titre", "slug", "description")
    prepopulated_fields = {"slug": ("titre",)}
    list_editable = ("ordre", "is_published")

    @admin.display(description="Vidéos")
    def video_count(self, obj):
        return obj.videos.count()


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ("titre", "playlist_ref", "playlist", "ordre", "duree", "langue", "date", "is_published")
    list_filter = ("playlist_ref", "langue", PublishedFilter)
    search_fields = ("titre", "sous_titre", "etiquette", "slug", "playlist")
    prepopulated_fields = {"slug": ("titre",)}
    list_editable = ("ordre", "is_published")
    autocomplete_fields = ("playlist_ref",)
    ordering = ("playlist", "ordre")


@admin.register(Insight)
class InsightAdmin(admin.ModelAdmin):
    list_display = ("titre", "category", "date", "lecture", "is_published")
    list_filter = ("category", "related_doc", PublishedFilter)
    search_fields = ("titre", "resume", "slug", "kicker")
    prepopulated_fields = {"slug": ("titre",)}
    list_editable = ("is_published",)
    fieldsets = (
        (None, {"fields": ("titre", "slug", "category", "kicker", "is_published")}),
        ("Dates", {"fields": ("date", "date_label", "lecture")}),
        ("Contenu", {"fields": ("resume", "corps", "source", "related_doc")}),
    )


@admin.register(Speaker)
class SpeakerAdmin(admin.ModelAdmin):
    list_display = ("nom", "fonction", "institution", "ordre", "is_published")
    list_filter = (PublishedFilter,)
    search_fields = ("nom", "fonction", "institution", "slug", "bio")
    prepopulated_fields = {"slug": ("nom",)}
    list_editable = ("ordre", "is_published")


class SeminarSpeakerInline(admin.TabularInline):
    model = SeminarSpeaker
    extra = 0
    autocomplete_fields = ("speaker",)
    ordering = ("ordre",)


@admin.register(Seminar)
class SeminarAdmin(admin.ModelAdmin):
    list_display = ("numero", "titre", "dates", "horaire", "heures", "speaker_list", "is_published")
    list_filter = (PublishedFilter,)
    search_fields = ("titre", "sous_titre", "slug", "objectif")
    prepopulated_fields = {"slug": ("titre",)}
    list_editable = ("is_published",)
    inlines = [SeminarSpeakerInline]
    fieldsets = (
        (None, {"fields": ("numero", "slug", "code", "titre", "sous_titre", "is_published")}),
        ("Planning", {"fields": ("dates", "horaire", "heures", "lieu")}),
        ("Pédagogie", {"fields": ("objectif", "livrable", "actualisation", "speaker_slugs")}),
        (
            "Jour 1",
            {"fields": ("jour1_matin", "jour1_apres_midi"), "classes": ("collapse",)},
        ),
        (
            "Jour 2",
            {"fields": ("jour2_matin", "jour2_apres_midi"), "classes": ("collapse",)},
        ),
    )

    @admin.display(description="Intervenants")
    def speaker_list(self, obj):
        return ", ".join(obj.speaker_slugs or []) or "—"

    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)
        form.instance.sync_speaker_slugs()


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        ("Marque", {"fields": ("nom", "sous_titre_officiel", "cosignature", "domaine", "base_url")}),
        ("Promesse", {"fields": ("promesse_titre", "promesse_sous_titre")}),
        (
            "Contact",
            {
                "fields": (
                    "contact_nom",
                    "contact_fonction",
                    "contact_email",
                    "contact_telephone",
                    "contact_linkedin",
                    "adresse_iscae",
                    "lieu_formation",
                )
            },
        ),
        ("SEO", {"fields": ("seo_title_template", "seo_description_default")}),
        ("Flags", {"fields": ("show_flags",)}),
    )

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(HomepageSection)
class HomepageSectionAdmin(admin.ModelAdmin):
    list_display = ("key", "title", "ordre", "is_published", "updated_at")
    list_filter = (PublishedFilter,)
    search_fields = ("key", "title", "chapeau")
    list_editable = ("ordre", "is_published")
    prepopulated_fields = {"key": ("title",)}


@admin.register(Statistic)
class StatisticAdmin(admin.ModelAdmin):
    list_display = ("group", "valeur", "unite", "libelle", "ordre", "accent", "is_published")
    list_filter = ("group", PublishedFilter)
    search_fields = ("valeur", "libelle")
    list_editable = ("ordre", "is_published", "accent")


@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display = ("nom", "role", "ordre", "is_published")
    list_filter = (PublishedFilter,)
    search_fields = ("nom", "role")
    list_editable = ("ordre", "is_published")


@admin.register(PressItem)
class PressItemAdmin(admin.ModelAdmin):
    list_display = ("nom", "titre", "domaine", "ordre", "is_published")
    list_filter = (PublishedFilter,)
    search_fields = ("nom", "titre", "description", "domaine")
    list_editable = ("ordre", "is_published")


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ("key", "titre", "ordre", "is_published")
    list_filter = (PublishedFilter,)
    search_fields = ("key", "titre", "description")
    list_editable = ("ordre", "is_published")
    prepopulated_fields = {"key": ("titre",)}


class FaqItemInline(admin.TabularInline):
    model = FaqItem
    extra = 0
    fields = (
        "external_id",
        "question",
        "ordre",
        "accueil",
        "hides_if_tarif",
        "is_published",
    )
    show_change_link = True


@admin.register(FaqGroup)
class FaqGroupAdmin(admin.ModelAdmin):
    list_display = ("titre", "slug", "ordre", "is_published", "question_count")
    list_filter = (PublishedFilter,)
    search_fields = ("titre", "slug")
    list_editable = ("ordre", "is_published")
    prepopulated_fields = {"slug": ("titre",)}
    inlines = [FaqItemInline]

    @admin.display(description="Questions")
    def question_count(self, obj):
        return obj.questions.count()


@admin.register(FaqItem)
class FaqItemAdmin(admin.ModelAdmin):
    list_display = (
        "question_short",
        "group",
        "ordre",
        "accueil",
        "hides_if_tarif",
        "is_published",
    )
    list_filter = ("group", "accueil", "hides_if_tarif", PublishedFilter)
    search_fields = ("question", "reponse_courte", "reponse_html", "external_id")
    list_editable = ("ordre", "accueil", "is_published")

    @admin.display(description="Question")
    def question_short(self, obj):
        return (obj.question or "")[:70]
