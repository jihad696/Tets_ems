from django.contrib import admin
from .models import Company


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'department_count', 'employee_count', 'created_by', 'created_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['name']
    ordering = ['-created_at']
    readonly_fields = ['department_count', 'employee_count', 'created_at', 'updated_at']
    fieldsets = (
        ('Company Info', {'fields': ('name', 'created_by')}),
        ('Statistics', {'fields': ('department_count', 'employee_count'), 'classes': ('collapse',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )
