from rest_framework import serializers


class UploadVideoPostSchema(serializers.Serializer):
    video = serializers.FileField()
    title = serializers.CharField()
    description = serializers.CharField()


class FileFieldNoLeadingSlash(serializers.FileField):
    def to_representation(self, value):
        representation = super().to_representation(value)
        if representation:
            representation = representation.lstrip('/')
        return representation


class VideoGetSchema(serializers.Serializer):
    id = serializers.IntegerField()
    video = FileFieldNoLeadingSlash()
    title = serializers.CharField()
    description = serializers.CharField()
    duration_seconds = serializers.IntegerField(allow_null=True, required=False)
    thumbnail_url = serializers.SerializerMethodField()

    def get_thumbnail_url(self, obj):
        if obj.thumbnail:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
            return obj.thumbnail.url
        return None
