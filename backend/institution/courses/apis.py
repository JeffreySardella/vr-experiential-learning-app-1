from django.contrib.auth import get_user_model
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response

from custom_auth.models import User

from backend.decorators import method_permission_classes

from custom_auth.permissions import IsInternalAdmin

from institution.services import retrieve_course

from institution.courses.serializers import CourseUsersApiPostSerializer
from institution.courses.serializers import CourseVideosApiPostSerializer
from institution.courses.serializers import CourseByIdDetailedApiGetSchema

from video.models import Video, VideoProgress

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


class CourseVisibilityApi(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, course_id):
        course = Course.objects.get(id=course_id)
        course.is_visible = not course.is_visible
        course.save()
        return Response({'is_visible': course.is_visible})


class CourseStudentsApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        course = Course.objects.get(id=course_id)
        students = course.users.filter(groups__name='student')
        data = []
        for student in students:
            progress = VideoProgress.objects.filter(user=student, course=course)
            total = course.videos.count()
            watched = progress.filter(watched=True).count()
            data.append({
                'id': student.id,
                'email': student.email,
                'first_name': student.first_name,
                'last_name': student.last_name,
                'videos_watched': watched,
                'total_videos': total,
                'progress_percent': round((watched / total * 100) if total > 0 else 0, 1),
            })
        return Response(data)

    def post(self, request, course_id):
        course = Course.objects.get(id=course_id)
        user = get_user_model().objects.get(id=request.data['user_id'])
        course.users.add(user)
        return Response({'status': 'added'}, status=status.HTTP_201_CREATED)


class CourseStudentByIdApi(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, course_id, user_id):
        course = Course.objects.get(id=course_id)
        course.users.remove(user_id)
        return Response(status=status.HTTP_204_NO_CONTENT)
