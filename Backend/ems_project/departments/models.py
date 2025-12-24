from django.db import models
from django.core.validators import MinValueValidator
from django.utils.translation import gettext_lazy as _


class Department(models.Model):
	"""
	Department model belonging to a company.
	Employee count is maintained via signals.
	"""
	company = models.ForeignKey(
		'companies.Company',  # String reference to avoid import
		on_delete=models.CASCADE,
		related_name='departments',
		verbose_name=_('Company')
	)
	name = models.CharField(
		max_length=255,
		verbose_name=_('Department Name'),
		help_text=_('Name of the department within the company')
	)
	description = models.TextField(blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
	created_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True, related_name='departments_created')

	# Denormalized count for performance
	employee_count = models.PositiveIntegerField(
		default=0,
		validators=[MinValueValidator(0)],
		verbose_name=_('Number of Employees')
	)

	class Meta:
		verbose_name = _('Department')
		verbose_name_plural = _('Departments')
		ordering = ['-created_at']
		unique_together = ['company', 'name']
		indexes = [
			models.Index(fields=['company', 'name']),
		]

	def __str__(self):
		return f"{self.name} ({self.company.name})"

	def update_employee_count(self):
		"""Update employee count (called via signals)"""
		from employees.models import Employee

		self.employee_count = Employee.objects.filter(department=self).count()
		self.save(update_fields=['employee_count', 'updated_at'])

	@property
	def number_of_employees(self):
		return self.employees.count()