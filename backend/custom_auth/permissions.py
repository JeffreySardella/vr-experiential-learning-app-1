from dj_rest_auth.jwt_auth import JWTCookieAuthentication
from rest_framework.permissions import IsAuthenticated

from .constants import ADMIN_GROUP_NAME
from .constants import INSTRUCTOR_GROUP_NAME
from .constants import STUDENT_GROUP_NAME


class IsPartOfGroup(IsAuthenticated):
    # Ref: https://stackoverflow.com/questions/45280248/django-rest-framework-group-based-permissions-for-individual-views
    @property
    def group_name(self) -> str:
        raise NotImplementedError

    def has_permission(self, request, view):
        if super().has_permission(request, view):
            if request.user and request.user.groups.filter(name=self.group_name):
                return True
        return False


class IsStudent(IsPartOfGroup):
    @property
    def group_name(self) -> str:
        return STUDENT_GROUP_NAME


class IsInternalAdmin(IsPartOfGroup):
    """
    This admin is different from the Django admin created via "createsuperuser" command:
    https://docs.djangoproject.com/en/5.0/ref/django-admin/#createsuperuser
    """
    @property
    def group_name(self) -> str:
        return ADMIN_GROUP_NAME


class IsInstructor(IsPartOfGroup):
    @property
    def group_name(self) -> str:
        return INSTRUCTOR_GROUP_NAME
