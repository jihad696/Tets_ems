from rest_framework import serializers
from .models import Employee
import phonenumbers


class EmployeeSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    full_name = serializers.SerializerMethodField()
    days_employed = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = [
            'id', 'first_name', 'last_name', 'full_name', 'email', 'mobile_number',
            'address', 'designation', 'company', 'company_name', 'department',
            'department_name', 'status', 'hired_date', 'days_employed', 'created_at'
        ]
        read_only_fields = ['created_at', 'days_employed']

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

    def get_days_employed(self, obj):
        return obj.days_employed

    def validate_mobile_number(self, value):
        try:
            parsed = phonenumbers.parse(value, None)
            if not phonenumbers.is_valid_number(parsed):
                raise serializers.ValidationError('Invalid phone number.')
        except phonenumbers.NumberParseException:
            raise serializers.ValidationError('Invalid phone number format.')
        return value

    def validate(self, data):
        # Ensure department belongs to company
        company = data.get('company') or getattr(self.instance, 'company', None)
        department = data.get('department') or getattr(self.instance, 'department', None)
        status = data.get('status') or getattr(self.instance, 'status', None)
        hired_on = data.get('hired_on') if 'hired_on' in data else getattr(self.instance, 'hired_on', None)

        if department and company and department.company_id != company.id:
            raise serializers.ValidationError({'department': 'Department must belong to the selected company.'})

        if status == Employee.Status.HIRED and not hired_on:
            raise serializers.ValidationError({'hired_on': 'Hire date is required when status is Hired.'})
        if status != Employee.Status.HIRED and hired_on:
            raise serializers.ValidationError({'hired_on': 'Hire date should only be set when status is Hired.'})

        return data

    def validate_department(self, value):
        request = self.context.get('request')
        if request and request.data.get('company'):
            company_id = request.data['company']
            if value.company_id != int(company_id):
                raise serializers.ValidationError(
                    'Selected department must belong to the selected company.'
                )
        return value
