from django.contrib import admin
from .models import Department


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'company', 'employee_count', 'created_at']
    list_filter = ['company', 'created_at', 'updated_at']
    search_fields = ['name', 'company__name']
    ordering = ['-created_at']
    readonly_fields = ['employee_count', 'created_at', 'updated_at']
    fieldsets = (
        ('Department Info', {'fields': ('company', 'name')}),
        ('Statistics', {'fields': ('employee_count',), 'classes': ('collapse',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )
