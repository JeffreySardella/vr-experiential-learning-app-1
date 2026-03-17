from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from video.models import VideoProgress, Video
from institution.models import Course
from video.progress_serializers import VideoProgressSerializer, VideoProgressUpdateSerializer


class ProgressApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        progress = VideoProgress.objects.filter(user=request.user)
        return Response(VideoProgressSerializer(progress, many=True).data)

    def post(self, request):
        serializer = VideoProgressUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        video = Video.objects.get(id=data['video'])
        course = Course.objects.get(id=data['course'])
        progress, _ = VideoProgress.objects.update_or_create(
            user=request.user, video=video, course=course,
            defaults={
                'progress_percent': data['progress_percent'],
                'watched': data.get('watched', False) or data['progress_percent'] >= 80,
            })
        return Response(VideoProgressSerializer(progress).data, status=status.HTTP_200_OK)


class ProgressByCourseApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        progress = VideoProgress.objects.filter(user=request.user, course_id=course_id)
        return Response(VideoProgressSerializer(progress, many=True).data)


class RecentActivityApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        recent = (
            VideoProgress.objects.filter(user=request.user, last_watched_at__isnull=False)
            .select_related('video', 'course')
            .order_by('-last_watched_at')[:10]
        )
        data = [
            {
                'video_id': p.video.id,
                'video_title': p.video.title,
                'course_id': p.course.id,
                'course_name': p.course.name,
                'progress_percent': p.progress_percent,
                'watched': p.watched,
                'last_watched_at': p.last_watched_at,
            }
            for p in recent
        ]
        return Response(data)
