

from django.http import HttpResponseNotFound


from django.http import HttpResponseNotFound
from django.shortcuts import render

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Video
from .serializers import UploadVideoPostSchema, VideoGetSchema
from . import services
from django.core.exceptions import ValidationError


class VideoApi(APIView):
    @swagger_auto_schema(
        responses={
            200: VideoGetSchema(many=True)
        }
    )
    def get(self, request):
        exclude_subject_id = request.query_params.get('exclude_subject_id')
        exclude_course_id = request.query_params.get('exclude_course_id')

        videos = Video.objects.all()

        if exclude_subject_id:
            videos = videos.exclude(subjects__id=exclude_subject_id)

        if exclude_course_id:
            videos = videos.exclude(courses__id=exclude_course_id)

        serializer = VideoGetSchema(videos, many=True, context={'request': request})
        return Response(serializer.data)


class VideoByIdApi(APIView):
    @swagger_auto_schema(
        responses={
            200: VideoGetSchema()
        }
    )
    def get(self, request, id):
        video = Video.objects.get(id=id)
        serializer = VideoGetSchema(video, context={'request': request})
        data = serializer.data
        return Response(data)

    @swagger_auto_schema(
        responses={
            204: "No Content"
        }
    )
    def delete(self, request, id):
        try:
            video = Video.objects.get(id=id)
            video.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Video.DoesNotExist:
            return HttpResponseNotFound()


class UploadVideoApi(APIView):
    parser_classes = [MultiPartParser, FormParser]

    @swagger_auto_schema(
        request_body=UploadVideoPostSchema,
        responses={
            200: VideoGetSchema()
        }
    )
    def post(self, request):
        serializer = UploadVideoPostSchema(data=request.data)
        if serializer.is_valid():
            try:
                video_data = {**serializer.data}
                video_data["video"] = request.data.get("video")
                video = services.create_video(**video_data)
            except ValidationError as e:
                return Response(e, status=status.HTTP_400_BAD_REQUEST)
            serializer = VideoGetSchema(video, context={'request': request})
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
