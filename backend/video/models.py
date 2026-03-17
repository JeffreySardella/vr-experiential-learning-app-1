from django.conf import settings
from django.db import models

from institution.models import Course
from institution.models import Subject


class Video(models.Model):
    video = models.FileField(upload_to="./videos")
    title = models.CharField(max_length=50, blank=False)
    description = models.CharField(max_length=100, blank=False)
    courses = models.ManyToManyField(Course, related_name='videos')
    subjects = models.ManyToManyField(Subject, related_name='videos')
    duration_seconds = models.IntegerField(null=True, blank=True)
    thumbnail = models.ImageField(upload_to='thumbnails/', null=True, blank=True)


class VideoProgress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='video_progress')
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name='progress')
    course = models.ForeignKey('institution.Course', on_delete=models.CASCADE, related_name='video_progress')
    watched = models.BooleanField(default=False)
    progress_percent = models.FloatField(default=0)
    last_watched_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'video', 'course')
        verbose_name_plural = 'Video progress'

    def __str__(self):
        return f'{self.user} - {self.video} ({self.progress_percent}%)'


class VideoNote(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='video_notes')
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name='notes')
    timestamp_seconds = models.IntegerField()
    text = models.CharField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp_seconds']

    def __str__(self):
        return f'Note at {self.timestamp_seconds}s by {self.user}'


class ChapterMarker(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name='chapters')
    timestamp_seconds = models.IntegerField()
    label = models.CharField(max_length=100)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='created_chapters')

    class Meta:
        ordering = ['timestamp_seconds']

    def __str__(self):
        return f'{self.label} at {self.timestamp_seconds}s'
