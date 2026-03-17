from rest_framework import serializers
from video.models import VideoNote


class VideoNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoNote
        fields = ['id', 'video', 'timestamp_seconds', 'text', 'created_at']
        read_only_fields = ['id', 'video', 'created_at']


class VideoNoteCreateSerializer(serializers.Serializer):
    timestamp_seconds = serializers.IntegerField(min_value=0)
    text = serializers.CharField(max_length=500)


class VideoNoteUpdateSerializer(serializers.Serializer):
    timestamp_seconds = serializers.IntegerField(min_value=0, required=False)
    text = serializers.CharField(max_length=500, required=False)
