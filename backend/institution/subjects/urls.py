from django.urls import path

from .apis import SubjectVideosApi
from .apis import SubjectVideoByIdApi

urlpatterns = [
    path("<int:subject_id>/videos", SubjectVideosApi.as_view()),
    path("<int:subject_id>/videos/<int:video_id>", SubjectVideoByIdApi.as_view()),
]
