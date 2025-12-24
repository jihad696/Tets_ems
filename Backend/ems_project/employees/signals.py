from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.apps import apps


@receiver(post_save, sender='employees.Employee')
def ensure_days_and_counts(sender, instance, created, **kwargs):
    """Calculate days_employed and update related department/company counts."""
    Employee = apps.get_model('employees', 'Employee')
    Department = apps.get_model('departments', 'Department')
    Company = apps.get_model('companies', 'Company')

    # Calculate days employed and update if necessary
    try:
        emp = Employee.objects.get(pk=instance.pk)
    except Employee.DoesNotExist:
        return

    days = emp.calculate_days_employed()
    if emp.days_employed != days:
        Employee.objects.filter(pk=emp.pk).update(days_employed=days)

    # Update department employee count
    if emp.department_id:
        try:
            dept = Department.objects.get(id=emp.department_id)
            dept.update_employee_count()
        except Department.DoesNotExist:
            pass

    # Company counts are updated by companies.signals, but make sure company exists
    if emp.company_id:
        try:
            comp = Company.objects.get(id=emp.company_id)
            comp.update_counts()
        except Company.DoesNotExist:
            pass


@receiver(post_delete, sender='employees.Employee')
def on_employee_deleted(sender, instance, **kwargs):
    """Update counts when an employee is deleted."""
    Department = apps.get_model('departments', 'Department')
    Company = apps.get_model('companies', 'Company')

    if instance.department_id:
        try:
            dept = Department.objects.get(id=instance.department_id)
            dept.update_employee_count()
        except Department.DoesNotExist:
            pass

    if instance.company_id:
        try:
            comp = Company.objects.get(id=instance.company_id)
            comp.update_counts()
        except Company.DoesNotExist:
            pass
