from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response

from custom_auth.models import User

from backend.decorators import method_permission_classes

from custom_auth.permissions import IsInternalAdmin

from institution.services import retrieve_course

from institution.courses.serializers import CourseUsersApiPostSerializer
from institution.courses.serializers import CourseVideosApiPostSerializer
from institution.courses.serializers import CourseByIdDetailedApiGetSchema

from video.models import Video

from institution.models import Course


class CourseByIdDetailedApi(APIView):
    @swagger_auto_schema(
        responses={
            200: CourseByIdDetailedApiGetSchema()
        }
    )
    def get(self, request, course_id):
        try:
            course = retrieve_course(course_id)
        except Course.DoesNotExist:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        serializer = CourseByIdDetailedApiGetSchema(course)
        data = serializer.data
        return Response(data)


class CourseUsersApi(APIView):
    @swagger_auto_schema(
        request_body=CourseUsersApiPostSerializer,
        responses={
            204: "No content"
        },
    )
    @method_permission_classes([IsAdminUser | IsInternalAdmin])
    def post(self, request, course_id):
        try:
            serializer = CourseUsersApiPostSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            user = User.objects.filter(id=serializer.validated_data['user_id']).first()
        except User.DoesNotExist:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        course = retrieve_course(course_id)
        if course is None:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        user.courses.add(course)
        return Response(status=status.HTTP_204_NO_CONTENT)


class CourseUserByIdApi(APIView):
    @swagger_auto_schema(
        responses={
            204: "No content"
        },
    )
    @method_permission_classes([IsAdminUser | IsInternalAdmin])
    def delete(self, request, course_id, user_id):
        try:
            user = User.objects.filter(id=user_id).first()
        except User.DoesNotExist:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        course = retrieve_course(course_id)
        if course is None:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        user.courses.remove(course)
        return Response(status=status.HTTP_204_NO_CONTENT)


class CourseVideosApi(APIView):
    @swagger_auto_schema(
        request_body=CourseVideosApiPostSerializer,
        responses={
            204: "No content"
        },
    )
    def post(self, request, course_id):
        try:
            serializer = CourseVideosApiPostSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            video = Video.objects.filter(id=serializer.validated_data['video_id']).first()
        except Video.DoesNotExist:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        if video is None:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        course = retrieve_course(course_id)
        if course is None:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        video.courses.add(course)
        return Response(status=status.HTTP_204_NO_CONTENT)


class CourseVideoByIdApi(APIView):
    @swagger_auto_schema(
        responses={
            204: "No content"
        },
    )
    def delete(self, request, course_id, video_id):
        try:
            video = Video.objects.filter(id=video_id).first()
        except Video.DoesNotExist:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        course = retrieve_course(course_id)
        if course is None:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        video.courses.remove(course)
        return Response(status=status.HTTP_204_NO_CONTENT)
