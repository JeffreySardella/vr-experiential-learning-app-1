"""
https://docs.djangoproject.com/en/5.0/topics/auth/customizing/#using-a-custom-user-model-when-starting-a-project
https://docs.djangoproject.com/en/5.0/topics/auth/customizing/#specifying-a-custom-user-model
https://docs.djangoproject.com/en/5.0/topics/auth/customizing/#referencing-the-user-model
"""

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from .managers import UserManager


class User(AbstractUser):
    # Ref: https://github.com/jmfederico/django-use-email-as-username/blob/main/django_use_email_as_username/models.py

    email = models.EmailField(_("email address"), unique=True)
    institution = models.ForeignKey("institution.Institution", on_delete=models.SET_NULL, blank=True, null=True)

    username = None
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
    objects = UserManager()

