from rest_framework import serializers
from .models import Department


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'company', 'name', 'employee_count', 'created_at', 'updated_at']
        read_only_fields = ['employee_count', 'created_at', 'updated_at']
