"""Lightweight request context for audit logging (stores client IP)."""

from __future__ import annotations

import threading

_local = threading.local()


def get_request_ip() -> str | None:
    return getattr(_local, "ip", None)


class AuditMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        forwarded = request.META.get("HTTP_X_FORWARDED_FOR", "")
        ip = forwarded.split(",")[0].strip() if forwarded else request.META.get("REMOTE_ADDR")
        _local.ip = ip
        try:
            return self.get_response(request)
        finally:
            _local.ip = None
