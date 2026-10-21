from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.auditlog.middleware import get_request_ip
from apps.auditlog.services import log_action
from common.permissions import IsStaffUser


class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        username = str(request.data.get("username", "")).strip()
        password = str(request.data.get("password", ""))
        user = authenticate(request, username=username, password=password)
        if not user or not user.is_active or not user.is_staff:
            return Response(
                {"detail": "Identifiants invalides ou accès non autorisé.", "code": 401, "errors": {}},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        token, _ = Token.objects.get_or_create(user=user)
        log_action(
            action="staff_login",
            actor=user,
            message=f"Connexion API de {user.username}",
            ip=get_request_ip(),
        )
        return Response(
            {
                "token": token.key,
                "user": {
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "is_superuser": user.is_superuser,
                },
            }
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        log_action(
            action="staff_logout",
            actor=request.user,
            message=f"Déconnexion de {request.user.username}",
            ip=get_request_ip(),
        )
        return Response({"ok": True})


class MeView(APIView):
    permission_classes = [IsStaffUser]

    def get(self, request):
        u = request.user
        return Response(
            {
                "username": u.username,
                "email": u.email,
                "first_name": u.first_name,
                "last_name": u.last_name,
                "is_superuser": u.is_superuser,
            }
        )
