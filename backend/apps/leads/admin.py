from django.contrib import admin, messages
from django.http import HttpResponse
from django.urls import reverse
from django.utils.html import format_html

from apps.auditlog.middleware import get_request_ip
from apps.auditlog.services import log_action

from .models import Submission, SubmissionFile


class SubmissionFileInline(admin.TabularInline):
    model = SubmissionFile
    extra = 0
    readonly_fields = ("field", "label", "original_name", "size", "content_type", "file_link")
    fields = ("field", "label", "original_name", "size", "file_link")
    can_delete = False

    @admin.display(description="Télécharger")
    def file_link(self, obj):
        if not obj.pk or not obj.file:
            return "—"
        return format_html('<a href="{}" target="_blank" rel="noopener">Ouvrir</a>', obj.file.url)

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = (
        "created_at",
        "type",
        "full_name",
        "email",
        "status",
        "files_count",
        "id",
    )
    list_filter = ("type", "status", "created_at")
    search_fields = ("full_name", "email", "id", "fields")
    readonly_fields = ("id", "type", "fields_pretty", "email", "full_name", "ip_hash", "created_at", "updated_at")
    list_editable = ("status",)
    inlines = [SubmissionFileInline]
    actions = ("export_csv", "mark_in_progress", "mark_archived")
    date_hierarchy = "created_at"
    ordering = ("-created_at",)
    fieldsets = (
        (None, {"fields": ("id", "type", "status", "created_at", "updated_at")}),
        ("Contact", {"fields": ("full_name", "email")}),
        ("Détail", {"fields": ("fields_pretty", "notes")}),
        ("Technique", {"fields": ("ip_hash",), "classes": ("collapse",)}),
    )

    @admin.display(description="Fichiers")
    def files_count(self, obj):
        n = obj.files.count()
        return n or "—"

    @admin.display(description="Champs du formulaire")
    def fields_pretty(self, obj):
        if not obj.fields:
            return "—"
        rows = "".join(
            f"<tr><th style='text-align:left;padding:4px 12px 4px 0;color:#5a6b7d'>{k}</th>"
            f"<td style='padding:4px 0'>{v}</td></tr>"
            for k, v in obj.fields.items()
        )
        return format_html(f"<table>{rows}</table>")

    @admin.action(description="Exporter la sélection en CSV")
    def export_csv(self, request, queryset):
        import csv

        response = HttpResponse(content_type="text/csv; charset=utf-8")
        response["Content-Disposition"] = 'attachment; filename="cfo40-demandes.csv"'
        response.write("\ufeff")
        writer = csv.writer(response, delimiter=";")
        writer.writerow(["id", "type", "status", "created_at", "full_name", "email", "fields"])
        for s in queryset:
            writer.writerow(
                [
                    s.id,
                    s.type,
                    s.status,
                    s.created_at.isoformat(),
                    s.full_name,
                    s.email,
                    str(s.fields),
                ]
            )
        log_action(
            action="export_submissions",
            actor=request.user,
            object_type="Submission",
            message=f"Export CSV de {queryset.count()} demande(s)",
            ip=get_request_ip(),
        )
        return response

    @admin.action(description="Marquer « En cours »")
    def mark_in_progress(self, request, queryset):
        n = queryset.update(status=Submission.Status.IN_PROGRESS)
        self.message_user(request, f"{n} demande(s) marquées en cours.", messages.SUCCESS)

    @admin.action(description="Archiver")
    def mark_archived(self, request, queryset):
        n = queryset.update(status=Submission.Status.ARCHIVED)
        self.message_user(request, f"{n} demande(s) archivées.", messages.SUCCESS)

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        if change and "status" in form.changed_data:
            log_action(
                action="submission_status_change",
                actor=request.user,
                object_type="Submission",
                object_id=obj.id,
                message=f"Statut → {obj.status}",
                metadata={"status": obj.status},
                ip=get_request_ip(),
            )

    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        qs = Submission.objects.all()
        from django.utils import timezone
        from datetime import timedelta

        week = timezone.now() - timedelta(days=7)
        extra_context["cfo_stats"] = {
            "total": qs.count(),
            "week": qs.filter(created_at__gte=week).count(),
            "candidature": qs.filter(type=Submission.Type.CANDIDATURE).count(),
            "document": qs.filter(type=Submission.Type.DOCUMENT).count(),
            "session": qs.filter(type=Submission.Type.SESSION).count(),
            "rappel": qs.filter(type=Submission.Type.RAPPEL).count(),
            "new": qs.filter(status=Submission.Status.NEW).count(),
        }
        return super().changelist_view(request, extra_context=extra_context)
