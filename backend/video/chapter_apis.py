from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from custom_auth.permissions import IsInstructor, IsInternalAdmin
from video.models import ChapterMarker, Video
from video.chapter_serializers import (
    ChapterMarkerSerializer,
    ChapterMarkerCreateSerializer,
    ChapterMarkerUpdateSerializer,
)


class ChapterMarkersApi(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        return [IsInstructor() | IsInternalAdmin()]

    def get(self, request, video_id):
        chapters = ChapterMarker.objects.filter(video_id=video_id)
        return Response(ChapterMarkerSerializer(chapters, many=True).data)

    def post(self, request, video_id):
        serializer = ChapterMarkerCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        video = Video.objects.get(id=video_id)
        chapter = ChapterMarker.objects.create(
            video=video,
            timestamp_seconds=data['timestamp_seconds'],
            label=data['label'],
            created_by=request.user,
        )
        return Response(ChapterMarkerSerializer(chapter).data, status=status.HTTP_201_CREATED)


class ChapterMarkerByIdApi(APIView):
    permission_classes = [IsInstructor | IsInternalAdmin]

    def patch(self, request, video_id, chapter_id):
        try:
            chapter = ChapterMarker.objects.get(id=chapter_id, video_id=video_id)
        except ChapterMarker.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ChapterMarkerUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        if 'timestamp_seconds' in data:
            chapter.timestamp_seconds = data['timestamp_seconds']
        if 'label' in data:
            chapter.label = data['label']
        chapter.save()
        return Response(ChapterMarkerSerializer(chapter).data)

    def delete(self, request, video_id, chapter_id):
        try:
            chapter = ChapterMarker.objects.get(id=chapter_id, video_id=video_id)
        except ChapterMarker.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        chapter.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
