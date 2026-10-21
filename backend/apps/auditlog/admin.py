from django.contrib import admin

from .models import AuditEntry


@admin.register(AuditEntry)
class AuditEntryAdmin(admin.ModelAdmin):
    list_display = ("created_at", "actor", "action", "object_type", "object_id", "message")
    list_filter = ("action", "object_type", "created_at")
    search_fields = ("action", "object_id", "message", "actor__username")
    readonly_fields = (
        "actor",
        "action",
        "object_type",
        "object_id",
        "message",
        "metadata",
        "ip_hash",
        "created_at",
    )
    ordering = ("-created_at",)

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
