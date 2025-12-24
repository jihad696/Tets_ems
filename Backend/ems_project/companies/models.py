from django.db import models
from django.core.validators import MinValueValidator, EmailValidator
from django.utils.translation import gettext_lazy as _
from django.conf import settings


class Company(models.Model):
	"""
	Company model with automatic department and employee counts.
	These counts are maintained via signals to avoid expensive aggregations.
	"""
	name = models.CharField(
		max_length=255,
		unique=True,
		verbose_name=_('Company Name'),
		help_text=_('Full legal name of the company')
	)
	email = models.EmailField(
		validators=[EmailValidator()],
		verbose_name=_('Email Address'),
		help_text=_('Official email address of the company'),
		blank=True,
		default=''
	)
	address = models.TextField(
		blank=True,
		null=True,
		default='',
		verbose_name=_('Address'),
		help_text=_('Headquarters address of the company')
	)
	phone = models.CharField(
		max_length=20,
		verbose_name=_('Phone Number'),
		help_text=_('Contact phone number for the company')
	)
	website = models.URLField(
		blank=True,
		verbose_name=_('Website'),
		help_text=_('Official website of the company')
	)
	created_by = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.SET_NULL,
		null=True,
		related_name='created_companies',
		verbose_name=_('Created By')
	)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	# Denormalized counts for performance
	department_count = models.PositiveIntegerField(
		default=0,
		validators=[MinValueValidator(0)],
		verbose_name=_('Number of Departments')
	)
	employee_count = models.PositiveIntegerField(
		default=0,
		validators=[MinValueValidator(0)],
		verbose_name=_('Number of Employees')
	)

	class Meta:
		verbose_name = _('Company')
		verbose_name_plural = _('Companies')
		ordering = ['name']
		indexes = [
			models.Index(fields=['name']),
			models.Index(fields=['created_at']),
		]

	def __str__(self):
		return self.name

	def update_counts(self):
		"""Update denormalized counts (called via signals)"""
		from departments.models import Department
		from employees.models import Employee

		self.department_count = Department.objects.filter(company=self).count()
		self.employee_count = Employee.objects.filter(company=self).count()
		self.save(update_fields=['department_count', 'employee_count', 'updated_at'])

	@property
	def number_of_departments(self):
		return self.departments.count()

	@property
	def number_of_employees(self):
		return self.employees.count()