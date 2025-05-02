from django.db import models

from institution.models import Course
from institution.models import Subject


class Video(models.Model):
    video = models.FileField(upload_to="./videos")
    title = models.CharField(max_length=50, blank=False)
    description = models.CharField(max_length=100, blank=False)
    courses = models.ManyToManyField(Course, related_name='videos')
    subjects = models.ManyToManyField(Subject, related_name='videos')
