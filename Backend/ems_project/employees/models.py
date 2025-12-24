from django.db import models

# Create your models here.


# employees/models.py
from django.db import models
from django.core.validators import EmailValidator, RegexValidator
from django.utils import timezone
from datetime import timedelta


class Employee(models.Model):
    """
    Employee model with company, department, and status workflow.
    Includes calculated fields like days_employed.
    """

    STATUS_CHOICES = [
        ('application_received', 'Application Received'),
        ('interview_scheduled', 'Interview Scheduled'),
        ('hired', 'Hired'),
        ('not_accepted', 'Not Accepted'),
    ]

    first_name = models.CharField(max_length=100, verbose_name='First Name')
    last_name = models.CharField(max_length=100, verbose_name='Last Name')
    email = models.EmailField(
        unique=True,
        validators=[EmailValidator()],
        verbose_name='Email Address',
        help_text='Professional email address'
    )
    mobile_number = models.CharField(
        max_length=20,
        validators=[RegexValidator(r'^\d{10,}$', 'Mobile number must be at least 10 digits')],
        verbose_name='Mobile Number',
        help_text='Format: +1234567890'
    )
    address = models.TextField(verbose_name='Address', blank=True)
    designation = models.CharField(
        max_length=100,
        verbose_name='Designation',
        help_text='Position/Title in the company'
    )
    company = models.ForeignKey(
        'companies.Company',
        on_delete=models.CASCADE,
        related_name='employees',
        verbose_name='Company'
    )
    department = models.ForeignKey(
        'departments.Department',
        on_delete=models.CASCADE,
        related_name='employees',
        verbose_name='Department'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='application_received',
        verbose_name='Employee Status'
    )
    hired_date = models.DateField(
        null=True,
        blank=True,
        verbose_name='Hired Date',
        help_text='Date when employee was hired'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        'accounts.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='employees_created'
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def days_employed(self):
        if self.hired_date and self.status == 'hired':
            return (timezone.now().date() - self.hired_date).days
        return None

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.company and self.department.company != self.company:
            raise ValidationError({'department': 'Selected department must belong to the selected company.'})
        if self.status == 'hired' and not self.hired_date:
            raise ValidationError({'hired_date': 'Hired date is required when status is Hired.'})

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)