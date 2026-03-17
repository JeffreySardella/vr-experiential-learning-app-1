from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from video.models import VideoNote, Video
from video.notes_serializers import VideoNoteSerializer, VideoNoteCreateSerializer, VideoNoteUpdateSerializer


class VideoNotesApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, video_id):
        notes = VideoNote.objects.filter(user=request.user, video_id=video_id)
        return Response(VideoNoteSerializer(notes, many=True).data)

    def post(self, request, video_id):
        serializer = VideoNoteCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        video = Video.objects.get(id=video_id)
        note = VideoNote.objects.create(
            user=request.user,
            video=video,
            timestamp_seconds=data['timestamp_seconds'],
            text=data['text'],
        )
        return Response(VideoNoteSerializer(note).data, status=status.HTTP_201_CREATED)


class VideoNoteByIdApi(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, video_id, note_id):
        try:
            note = VideoNote.objects.get(id=note_id, video_id=video_id, user=request.user)
        except VideoNote.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = VideoNoteUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        if 'timestamp_seconds' in data:
            note.timestamp_seconds = data['timestamp_seconds']
        if 'text' in data:
            note.text = data['text']
        note.save()
        return Response(VideoNoteSerializer(note).data)

    def delete(self, request, video_id, note_id):
        try:
            note = VideoNote.objects.get(id=note_id, video_id=video_id, user=request.user)
        except VideoNote.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        note.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
