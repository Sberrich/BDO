from __future__ import annotations

import re
import uuid

from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone


def submission_upload_to(instance: "SubmissionFile", filename: str) -> str:
    return f"leads/{instance.submission_id}/{filename}"


class Submission(models.Model):
    class Type(models.TextChoices):
        CANDIDATURE = "candidature", "Candidature"
        DOCUMENT = "document", "Document"
        SESSION = "session", "Session d’information"
        RAPPEL = "rappel", "Demande de rappel"

    class Status(models.TextChoices):
        NEW = "new", "Nouveau"
        IN_PROGRESS = "in_progress", "En cours"
        ACCEPTED = "accepted", "Accepté"
        REJECTED = "rejected", "Refusé"
        ARCHIVED = "archived", "Archivé"

    id = models.CharField(primary_key=True, max_length=32, editable=False)
    type = models.CharField("Type", max_length=20, choices=Type.choices, db_index=True)
    status = models.CharField(
        "Statut",
        max_length=20,
        choices=Status.choices,
        default=Status.NEW,
        db_index=True,
    )
    fields = models.JSONField("Champs", default=dict)
    notes = models.TextField("Notes internes", blank=True)
    email = models.EmailField("E-mail", blank=True, db_index=True)
    full_name = models.CharField("Nom complet", max_length=200, blank=True, db_index=True)
    ip_hash = models.CharField("IP (hash)", max_length=64, blank=True)
    created_at = models.DateTimeField("Reçu le", default=timezone.now, db_index=True)
    updated_at = models.DateTimeField("Modifié le", auto_now=True)

    class Meta:
        verbose_name = "Demande"
        verbose_name_plural = "Demandes"
        ordering = ["-created_at"]
        permissions = [
            ("export_submission", "Peut exporter les demandes"),
            ("download_submission_files", "Peut télécharger les fichiers"),
        ]

    def save(self, *args, **kwargs):
        if not self.id:
            stamp = timezone.now().strftime("%Y%m%d%H%M%S")
            self.id = f"{stamp}-{uuid.uuid4().hex[:8]}"
        fields = self.fields or {}
        self.email = str(fields.get("email", "")).strip()[:254]
        prenom = str(fields.get("prenom", "")).strip()
        nom = str(fields.get("nom", "")).strip()
        self.full_name = f"{prenom} {nom}".strip()[:200]
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.get_type_display()} — {self.full_name or self.email or self.id}"


class SubmissionFile(models.Model):
    submission = models.ForeignKey(Submission, related_name="files", on_delete=models.CASCADE)
    field = models.CharField("Champ", max_length=40)  # cv | photo
    label = models.CharField("Libellé", max_length=80)
    file = models.FileField("Fichier", upload_to=submission_upload_to)
    original_name = models.CharField("Nom d’origine", max_length=200)
    size = models.PositiveIntegerField("Taille (octets)", default=0)
    content_type = models.CharField("Type MIME", max_length=120, blank=True)

    class Meta:
        verbose_name = "Fichier joint"
        verbose_name_plural = "Fichiers joints"

    def clean(self):
        max_bytes = 5 * 1024 * 1024
        if self.size and self.size > max_bytes:
            raise ValidationError({"file": "Fichier trop volumineux (5 Mo maximum)."})
        if self.original_name and not re.search(r"\.(pdf|doc|docx|jpg|jpeg|png)$", self.original_name, re.I):
            if self.field == "cv":
                raise ValidationError({"file": "CV : PDF, DOC ou DOCX uniquement."})
            if self.field == "photo":
                raise ValidationError({"file": "Photo : JPG ou PNG uniquement."})

    def __str__(self):
        return f"{self.label} ({self.original_name})"
