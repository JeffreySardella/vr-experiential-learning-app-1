from rest_framework import serializers
from video.models import ChapterMarker


class ChapterMarkerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChapterMarker
        fields = ['id', 'video', 'timestamp_seconds', 'label', 'created_by']
        read_only_fields = ['id', 'video', 'created_by']


class ChapterMarkerCreateSerializer(serializers.Serializer):
    timestamp_seconds = serializers.IntegerField(min_value=0)
    label = serializers.CharField(max_length=100)


class ChapterMarkerUpdateSerializer(serializers.Serializer):
    timestamp_seconds = serializers.IntegerField(min_value=0, required=False)
    label = serializers.CharField(max_length=100, required=False)
