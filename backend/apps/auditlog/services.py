from __future__ import annotations

import hashlib

from .models import AuditEntry


def hash_ip(ip: str | None) -> str:
    if not ip:
        return ""
    return hashlib.sha256(ip.encode("utf-8")).hexdigest()[:32]


def log_action(
    *,
    action: str,
    actor=None,
    object_type: str = "",
    object_id: str = "",
    message: str = "",
    metadata: dict | None = None,
    ip: str | None = None,
) -> AuditEntry:
    return AuditEntry.objects.create(
        actor=actor if getattr(actor, "is_authenticated", False) else None,
        action=action,
        object_type=object_type,
        object_id=str(object_id) if object_id else "",
        message=message,
        metadata=metadata or {},
        ip_hash=hash_ip(ip),
    )
