from django.apps import AppConfig


class DepartmentsConfig(AppConfig):
    name = 'departments'
    default_auto_field = 'django.db.models.BigAutoField'

    def ready(self):
        import departments.signals  # connect signals
