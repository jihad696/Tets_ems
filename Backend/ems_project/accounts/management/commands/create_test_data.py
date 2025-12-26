from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates a test user for development'

    def handle(self, *args, **options):
        if not User.objects.filter(email='test@example.com').exists():
            User.objects.create_user(
                email='test@example.com',
                password='password',
                first_name='Test',
                last_name='User',
                role='ADMIN'
            )
            self.stdout.write(self.style.SUCCESS('Successfully created test user'))
        else:
            self.stdout.write(self.style.WARNING('Test user already exists'))
