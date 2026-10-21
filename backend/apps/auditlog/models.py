from django.conf import settings
from django.db import models


class AuditEntry(models.Model):
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="audit_entries",
        verbose_name="Acteur",
    )
    action = models.CharField("Action", max_length=80, db_index=True)
    object_type = models.CharField("Type d’objet", max_length=80, blank=True, db_index=True)
    object_id = models.CharField("ID objet", max_length=64, blank=True, db_index=True)
    message = models.TextField("Message", blank=True)
    metadata = models.JSONField("Métadonnées", default=dict, blank=True)
    ip_hash = models.CharField("IP (hash)", max_length=64, blank=True)
    created_at = models.DateTimeField("Date", auto_now_add=True, db_index=True)

    class Meta:
        verbose_name = "Entrée d’audit"
        verbose_name_plural = "Journal d’audit"
        ordering = ["-created_at"]

    def __str__(self):
        who = self.actor_id or "système"
        return f"{self.created_at:%Y-%m-%d %H:%M} · {who} · {self.action}"
