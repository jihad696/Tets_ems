from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Department
from .serializers import DepartmentSerializer
from accounts.permissions import IsManagerOrAdmin


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.select_related('company').all()
    serializer_class = DepartmentSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsManagerOrAdmin()]
        return [IsAuthenticated()]
from django.shortcuts import render

# Create your views here.
