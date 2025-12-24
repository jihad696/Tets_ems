from django.apps import AppConfig


class EmployeesConfig(AppConfig):
    name = 'employees'
    default_auto_field = 'django.db.models.BigAutoField'

    def ready(self):
        import employees.signals  # connect signals
