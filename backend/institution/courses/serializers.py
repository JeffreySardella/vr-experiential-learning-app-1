from rest_framework import serializers

from institution.serializers import ProgramApiGetSchema

from video.serializers import VideoGetSchema


class CourseContentSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    description = serializers.CharField(required=False)
    videos = VideoGetSchema(many=True)
    subjects = serializers.SerializerMethodField()

    def get_subjects(self, obj):
        if hasattr(obj, "subjects"):
            serializer = CourseContentSerializer(obj.subjects.all(), many=True)
            return serializer.data
        return []


class CourseByIdDetailedApiGetSchema(CourseContentSerializer):
    program = ProgramApiGetSchema()


class CourseUsersApiPostSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()


class CourseVideosApiPostSerializer(serializers.Serializer):
    video_id = serializers.IntegerField()
