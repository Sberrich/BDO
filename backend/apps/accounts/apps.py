from django.apps import AppConfig
from django.contrib import admin


class AccountsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.accounts"
    label = "accounts"
    verbose_name = "Comptes"

    def ready(self):
        admin.site.site_header = "CFO 4.0 · Administration"
        admin.site.site_title = "CFO 4.0 Admin"
        admin.site.index_title = "Pilotage du certificat"
