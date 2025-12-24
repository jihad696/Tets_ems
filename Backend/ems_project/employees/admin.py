from django.contrib import admin
from .models import Employee


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'company', 'department', 'status', 'hired_date', 'days_employed')
    list_filter = ('status', 'company', 'department', 'hired_date')
    search_fields = ('first_name', 'last_name', 'email', 'mobile_number')
    readonly_fields = ('days_employed',)

    def full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"
    full_name.short_description = 'Name'

    def days_employed(self, obj):
        return obj.days_employed
    days_employed.short_description = 'Days Employed'
