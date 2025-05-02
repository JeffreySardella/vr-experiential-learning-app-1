from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models.functions import Now


class Institution(models.Model):
    name = models.CharField(unique=True, null=False, max_length=32)
    datetime_created = models.DateTimeField(db_default=Now(), null=False, auto_now_add=True)

    def clean(self):
        if not self.name:
            raise ValidationError({'name': 'An institution must have a name'})


class Program(models.Model):
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE, related_name='programs')
    users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="programs")
    name = models.CharField(max_length=100)

    class Meta:
        unique_together = ('name', 'institution')

    def clean(self):
        if not self.name:
            raise ValidationError({'name': 'A program must have a name'})


class Course(models.Model):
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='courses')
    name = models.CharField(max_length=100)
    password = models.CharField(max_length=5, null = True)
    users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='courses')

    class Meta:
        unique_together = ('name', 'program')

    def clean(self):
        if not self.name:
            raise ValidationError({'name': 'A course must have a name'})


class Announcement(models.Model):
    datetime_created = models.DateTimeField(default=Now(), null=False)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='announcements')
    title = models.CharField(max_length=30)
    body = models.CharField(max_length=100)

    def clean(self):
        if not self.title:
            raise ValidationError({'title': 'A announcement must have a title'})
        if not self.body:
            raise ValidationError({'body': 'A announcement must have a body'})


class Subject(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='subjects')
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=255, blank=True, null=True)

    def clean(self):
        if not self.name:
            raise ValidationError({'name': 'A subject must have a name'})
