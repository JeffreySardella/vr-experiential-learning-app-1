from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from institution.services import retrieve_subject

from .serializers import SubjectVideosApiPostSerializer

from video.models import Video

from institution.models import Course

class SubjectVideosApi(APIView):
    @swagger_auto_schema(
        request_body=SubjectVideosApiPostSerializer,
        responses={
            204: "No content"
        },
    )
    def post(self, request, subject_id):
        try:
            serializer = SubjectVideosApiPostSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            video = Video.objects.filter(id=serializer.validated_data['video_id']).first()
        except Video.DoesNotExist:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        if video is None:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        subject = retrieve_subject(subject_id)
        if subject is None:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        video.subjects.add(subject)
        return Response(status=status.HTTP_204_NO_CONTENT)


class SubjectVideoByIdApi(APIView):
    @swagger_auto_schema(
        responses={
            204: "No content"
        },
    )
    def delete(self, request, subject_id, video_id):
        try:
            video = Video.objects.filter(id=video_id).first()
        except Video.DoesNotExist:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        subject = retrieve_subject(subject_id)
        if subject is None:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        video.subjects.remove(subject)
        return Response(status=status.HTTP_204_NO_CONTENT)
