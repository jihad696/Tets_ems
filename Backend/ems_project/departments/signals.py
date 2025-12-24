from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.apps import apps


@receiver(post_save, sender='employees.Employee')
@receiver(post_delete, sender='employees.Employee')
def update_department_employee_count(sender, instance, **kwargs):
    """Update department employee_count when employees change."""
    if instance.department_id:
        Department = apps.get_model('departments', 'Department')
        try:
            dept = Department.objects.get(id=instance.department_id)
            dept.update_employee_count()
        except Department.DoesNotExist:
            pass
