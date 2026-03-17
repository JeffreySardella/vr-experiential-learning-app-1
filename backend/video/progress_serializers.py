from rest_framework import serializers
from video.models import VideoProgress


class VideoProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoProgress
        fields = ['id', 'video', 'course', 'watched', 'progress_percent', 'last_watched_at']
        read_only_fields = ['id', 'last_watched_at']


class VideoProgressUpdateSerializer(serializers.Serializer):
    video = serializers.IntegerField()
    course = serializers.IntegerField()
    progress_percent = serializers.FloatField(min_value=0, max_value=100)
    watched = serializers.BooleanField(required=False, default=False)
