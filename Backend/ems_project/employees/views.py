from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Employee
from .serializers import EmployeeSerializer
from accounts.permissions import IsAdmin, IsManager


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['company', 'department', 'status']
    search_fields = ['first_name', 'last_name', 'email']
    ordering_fields = ['hired_date', 'created_at']
    ordering = ['-created_at']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAuthenticated, IsManager]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=False, methods=['get'])
    def hired(self, request):
        hired_employees = self.get_queryset().filter(status='hired')
        serializer = self.get_serializer(hired_employees, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def report(self, request):
        hired_employees = self.get_queryset().filter(status='hired')
        serializer = self.get_serializer(hired_employees, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def change_status(self, request, pk=None):
        employee = self.get_object()
        new_status = request.data.get('status')

        # Validate transition
        valid_transitions = {
            'application_received': ['interview_scheduled', 'not_accepted'],
            'interview_scheduled': ['hired', 'not_accepted'],
            'hired': [],
            'not_accepted': [],
        }

        if new_status not in valid_transitions.get(employee.status, []):
            return Response(
                {'error': f'Cannot transition from {employee.status} to {new_status}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if new_status == 'hired' and not request.data.get('hired_date'):
            return Response(
                {'error': 'Hired date is required when marking employee as hired'},
                status=status.HTTP_400_BAD_REQUEST
            )

        employee.status = new_status
        if new_status == 'hired':
            employee.hired_date = request.data.get('hired_date')
        employee.save()

        serializer = self.get_serializer(employee)
        return Response(serializer.data)
from django.shortcuts import render

# Create your views here.
