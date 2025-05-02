from allauth.account.models import EmailAddress
from rest_framework import serializers
from django.utils.translation import gettext_lazy as _

from .models import User


def validate_email_does_not_exist(email: str) -> str:
    email_lower = email.lower()
    if User.objects.filter(email=email_lower) or EmailAddress.objects.lookup([email_lower]):
        raise serializers.ValidationError(
            _('A user is already registered with this e-mail address.'),
        )
    return email_lower
