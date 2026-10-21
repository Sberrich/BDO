from django.contrib import admin
from django.contrib.auth.admin import GroupAdmin, UserAdmin
from django.contrib.auth.models import Group, User

# Re-register with French labels / clearer staff focus
admin.site.unregister(User)
admin.site.unregister(Group)


@admin.register(User)
class StaffUserAdmin(UserAdmin):
    list_display = ("username", "email", "first_name", "last_name", "is_staff", "is_active", "last_login")
    list_filter = ("is_staff", "is_superuser", "is_active", "groups")
    search_fields = ("username", "first_name", "last_name", "email")
    ordering = ("username",)


@admin.register(Group)
class StaffGroupAdmin(GroupAdmin):
    search_fields = ("name",)
