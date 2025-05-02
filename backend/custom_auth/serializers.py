from dj_rest_auth.serializers import LoginSerializer as DjraLoginSerializer
from dj_rest_auth.registration.serializers import RegisterSerializer as DjraRegisterSerializer
from dj_rest_auth.serializers import PasswordResetConfirmSerializer as DjraPasswordResetConfirmSerializer
from dj_rest_auth.serializers import UserDetailsSerializer as DjraUserDetailsSerializer
from rest_framework import serializers
from django.contrib.auth.models import Group
from django.utils.translation import gettext_lazy as _
from rest_framework.exceptions import ValidationError

import institution.validators as institution_validators
from . import services
from . import validators
from .models import User
from institution.serializers import CourseApiGetSchema
from institution.serializers import InstitutionApiGetSchema
from institution.serializers import ProgramApiGetSchema


class UserGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('name',)


class CustomUserDetailsSerializer(DjraUserDetailsSerializer):
    groups = UserGroupSerializer(many=True)
    institution = InstitutionApiGetSchema()
    programs = ProgramApiGetSchema(many=True)
    courses = CourseApiGetSchema(many=True)

    class Meta(DjraUserDetailsSerializer.Meta):
        fields = DjraUserDetailsSerializer.Meta.fields + (
            'groups',
            'institution',
            'programs',
            'courses',
        )


class ProgramRegisterSerializer(serializers.Serializer):
    program_ids = serializers.ListField(child=serializers.IntegerField(), required=True)

    def validate_program_ids(self, program_ids):
        return institution_validators.validate_program_ids(program_ids)


class AcceptInviteSerializer(DjraPasswordResetConfirmSerializer):
    """
    The invites leverage the password reset functionality for a one-time use invite.
    Allows users to update all of their information upon registering.

    # TODO update our implementation to use different token generators (unique salts) for admins and instructors
    """
    attrs = None
    email = serializers.EmailField(required=True, allow_blank=False)
    first_name = serializers.CharField(required=True, allow_blank=False)
    last_name = serializers.CharField(required=True, allow_blank=False)

    def custom_validation(self, attrs):
        if self.user.is_active:
            raise ValidationError({'uid': [_('User is already active')]})
        if attrs["email"] != self.user.email:
            raise ValidationError({'email': [_('Email does not match the email for the invite')]})
        self.attrs = attrs

    def update_user(self, user: User):
        user.is_active = True
        user.first_name = self.attrs["first_name"]
        user.last_name = self.attrs["last_name"]

    def save(self):
        self.update_user(self.user)
        return super().save()


"""
Concrete Register Serializers
"""


class LoginSerializer(DjraLoginSerializer):
    username = None
    email = serializers.EmailField(required=True, allow_blank=False)
    password = serializers.CharField(style={'input_type': 'password'}, required=True, allow_blank=False)

    def _validate_email(self, email, password):
        return super()._validate_email(email.lower(), password)


class InviteSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True, allow_blank=False)
    institution_id = serializers.IntegerField(required=False)

    def validate_email(self, email):
        return validators.validate_email_does_not_exist(email)

    def validate_institution_id(self, institution_id):
        return institution_validators.validate_institution_id(institution_id)


class StudentRegisterSerializer(DjraRegisterSerializer, ProgramRegisterSerializer):
    username = None
    first_name = serializers.CharField(required=True, allow_blank=False)
    last_name = serializers.CharField(required=True, allow_blank=False)
    institution_id = serializers.IntegerField(required=True)

    def validate_email(self, email):
        return validators.validate_email_does_not_exist(email)

    def validate_institution_id(self, institution_id):
        return institution_validators.validate_institution_id(institution_id)

    def custom_signup(self, request, user):
        services.set_user_institution_id(user, self.validated_data["institution_id"])
        services.set_user_program_ids(user, self.validated_data["program_ids"])
        user.save()


class AdminRegisterSerializer(AcceptInviteSerializer):
    pass


class InstructorRegisterSerializer(AcceptInviteSerializer, ProgramRegisterSerializer):
    def update_user(self, user: User):
        super().update_user(user)
        services.set_user_program_ids(user, self.validated_data["program_ids"])


class InstructorInviteApiPostResponseSchema(serializers.Serializer):
    url = serializers.CharField()


class AdminInviteApiPostResponseSchema(serializers.Serializer):
    url = serializers.CharField()
