from rest_framework import serializers
from .models import Company


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name', 'department_count', 'employee_count', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['department_count', 'employee_count', 'created_at', 'updated_at']
