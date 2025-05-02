from rest_framework import serializers


class SubjectVideosApiPostSerializer(serializers.Serializer):
    video_id = serializers.IntegerField()
