# companies/signals.py
"""
Signals for Company model.
Handles automatic count updates when related departments/employees change.
"""
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.apps import apps


@receiver(post_save, sender='departments.Department')
@receiver(post_delete, sender='departments.Department')
def update_company_department_count(sender, instance, **kwargs):
    """Update company's department count when departments change"""
    Company = apps.get_model('companies', 'Company')
    if instance.company_id:
        try:
            company = Company.objects.get(id=instance.company_id)
            company.update_counts()
        except Company.DoesNotExist:
            pass


@receiver(post_save, sender='employees.Employee')
@receiver(post_delete, sender='employees.Employee')
def update_company_employee_count(sender, instance, **kwargs):
    """Update company's employee count when employees change"""
    Company = apps.get_model('companies', 'Company')
    if instance.company_id:
        try:
            company = Company.objects.get(id=instance.company_id)
            company.update_counts()
        except Company.DoesNotExist:
            pass