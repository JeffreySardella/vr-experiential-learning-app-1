from typing import Any
from typing import Dict
from typing import Optional

from dj_rest_auth.app_settings import api_settings
from dj_rest_auth.jwt_auth import set_jwt_cookies
from dj_rest_auth.registration.views import RegisterView as DjraRegisterView
from dj_rest_auth.serializers import JWTSerializer
from dj_rest_auth.views import LoginView as DjraLoginView
from dj_rest_auth.views import PasswordResetConfirmView
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from django.utils.translation import gettext_lazy as _

from . import services
from .mixins import EnsureCsrfMixin
from .models import User
from .permissions import IsInternalAdmin
from .permissions import IsInstructor
from .serializers import AdminInviteApiPostResponseSchema

from .serializers import AdminRegisterSerializer
from .serializers import CustomUserDetailsSerializer
from .serializers import InstructorInviteApiPostResponseSchema
from .serializers import InstructorRegisterSerializer
from .serializers import InviteSerializer
from .serializers import StudentRegisterSerializer


class LoginApi(DjraLoginView, EnsureCsrfMixin):
    @swagger_auto_schema(
        responses={
            200: JWTSerializer()
        }
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class AdminInviteApi(GenericAPIView):
    permission_classes = [IsAdminUser | IsInternalAdmin]
    serializer_class = InviteSerializer

    @swagger_auto_schema(
        responses={
            200: AdminInviteApiPostResponseSchema()
        }
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.data["email"]
        institution_id = serializer.data.get("institution_id")
        if not institution_id:
            if request_user_institution := request.user.institution:
                institution_id = request_user_institution.id
            else:
                return Response({
                    'detail': "Missing institution information"
                }, status=status.HTTP_400_BAD_REQUEST)
        user = services.invite_admin_user(email, institution_id)
        user.save()
        url = services.generate_admin_invite_url(user)
        return Response(
            {
                'detail': _('User invited'),
                'url': url,
            },
            status=status.HTTP_200_OK
        )


class InstructorInviteApi(GenericAPIView):
    permission_classes = [IsAdminUser | IsInternalAdmin | IsInstructor]
    serializer_class = InviteSerializer

    @swagger_auto_schema(
        responses={
            200: InstructorInviteApiPostResponseSchema()
        }
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.data["email"]
        institution_id = serializer.data.get("institution_id")
        if not institution_id:
            if request_user_institution := request.user.institution:
                institution_id = request_user_institution.id
            else:
                return Response({
                    'detail': "Missing institution information"
                }, status=status.HTTP_400_BAD_REQUEST)
        user = services.invite_instructor_user(email, institution_id)
        user.save()
        url = services.generate_instructor_invite_url(user)
        return Response(
            {
                'detail': _('User invited'),
                'url': url,
            },
            status=status.HTTP_200_OK
        )


class StudentRegisterApi(DjraRegisterView, EnsureCsrfMixin):
    serializer_class = StudentRegisterSerializer

    @swagger_auto_schema(
        responses={
            201: JWTSerializer(),
        }
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        # dj-rest-auth RegisterView does not respect login configurations by default
        if api_settings.USE_JWT:
            set_jwt_cookies(response, self.access_token, self.refresh_token)
        if not api_settings.SESSION_LOGIN:
            if hasattr(request, "session"):
                request.session.flush()
        return response


class AcceptInviteApi(PasswordResetConfirmView):
    """
    The invites leverage the password reset functionality for a one-time use invite.

    Logic to set password and update user lives in the serializer.save() method
    """
    serializer_class = None
    # child classes must set a serializer_class to define API schema

    @swagger_auto_schema(
        responses={
            204: "No content"
        }
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminRegisterApi(AcceptInviteApi):
    serializer_class = AdminRegisterSerializer


class InstructorRegisterApi(AcceptInviteApi):
    serializer_class = InstructorRegisterSerializer


class InternalUserApi:
    @staticmethod
    def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
        user = User.objects.filter(email=email)
        if not user:
            return None
        serializer = CustomUserDetailsSerializer(user)
        return serializer.data
