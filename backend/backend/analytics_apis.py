from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from custom_auth.permissions import IsInternalAdmin
from django.contrib.auth import get_user_model
from django.db.models import Avg
from institution.models import Course
from video.models import Video, VideoProgress
from quiz.models import QuizAttempt

User = get_user_model()


class AnalyticsOverviewApi(APIView):
    permission_classes = [IsAuthenticated, IsInternalAdmin]

    def get(self, request):
        users = User.objects.all()
        return Response({
            'users': {
                'total': users.count(),
                'admins': users.filter(groups__name='admin').count(),
                'instructors': users.filter(groups__name='instructor').count(),
                'students': users.filter(groups__name='student').count(),
            },
            'courses': Course.objects.count(),
            'videos': Video.objects.count(),
        })


class AnalyticsByCourseApi(APIView):
    permission_classes = [IsAuthenticated, IsInternalAdmin]

    def get(self, request, course_id):
        course = Course.objects.get(id=course_id)
        student_count = course.users.filter(groups__name='student').count()
        progress = VideoProgress.objects.filter(course=course)
        avg_completion = progress.aggregate(avg=Avg('progress_percent'))['avg'] or 0
        watched_count = progress.filter(watched=True).count()
        total_videos = course.videos.count()
        quiz_attempts = QuizAttempt.objects.filter(quiz__course=course)
        avg_quiz_score = quiz_attempts.aggregate(avg=Avg('score'))['avg'] or 0
        return Response({
            'course_name': course.name,
            'student_count': student_count,
            'avg_completion': round(avg_completion, 1),
            'videos_watched': watched_count,
            'total_videos': total_videos,
            'avg_quiz_score': round(avg_quiz_score, 1),
            'total_quiz_attempts': quiz_attempts.count(),
        })
