from rest_framework import serializers


class InstitutionApiGetSchema(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    datetime_created = serializers.DateTimeField(format="%Y-%m-%d")


class InstitutionApiPostSchema(serializers.Serializer):
    name = serializers.CharField()


class ProgramApiGetSchema(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    institution = InstitutionApiGetSchema()


class ProgramApiPostSchema(serializers.Serializer):
    name = serializers.CharField()


class CourseApiGetSchema(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    program = ProgramApiGetSchema()


class CourseApiPostSchema(serializers.Serializer):
    name = serializers.CharField()


class AnnouncementApiGetSchema(serializers.Serializer):
    id = serializers.IntegerField()
    datetime_created = serializers.DateTimeField(format="%Y-%m-%d")
    title = serializers.CharField()
    body = serializers.CharField()


class AnnouncementPostSchema(serializers.Serializer):
    title = serializers.CharField()
    body = serializers.CharField()


class AnnouncementPutSchema(serializers.Serializer):
    title = serializers.CharField()
    body = serializers.CharField()


class SubjectApiGetSchema(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    description = serializers.CharField()


class SubjectApiPostSchema(serializers.Serializer):
    name = serializers.CharField()


class SubjectApiEditSchema(serializers.Serializer):
    name = serializers.CharField(required=False)
    description = serializers.CharField()

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.save()
        return instance


class AddCourseSerializer(serializers.Serializer):
    course_id = serializers.IntegerField(required=True)
