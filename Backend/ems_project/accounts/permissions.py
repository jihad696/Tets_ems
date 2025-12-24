# accounts/permissions.py
from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """Allows access only to admin users."""
    def has_permission(self, request, view):
        return request.user and request.user.is_staff


class IsManager(permissions.BasePermission):
    """Allows access to managers."""
    def has_permission(self, request, view):
        return request.user and (request.user.is_staff or getattr(request.user, 'role', '') in ['manager', 'admin'])


class IsAdminOrReadOnly(permissions.BasePermission):
    """Allows read-only access to authenticated users, and full access to admin users."""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return request.user and request.user.is_staff


# Backward-compatible alias
class IsManagerOrAdmin(IsManager):
    """Backward-compatible alias used by views that import IsManagerOrAdmin."""
    pass


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Grants object-level access to the object's owner (created_by or user) or admin users.
    Use for viewsets that require owner-level permissions.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Admins always allowed
        if request.user and request.user.is_staff:
            return True
        # Try common ownership attributes
        owner = getattr(obj, 'created_by', None) or getattr(obj, 'user', None) or getattr(obj, 'owner', None)
        return owner == request.user