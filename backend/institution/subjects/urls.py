from django.urls import path

from .apis import SubjectVideosApi
from .apis import SubjectVideoByIdApi
from .apis import SubjectVisibilityApi
from .apis import SubjectVideoOrderApi

urlpatterns = [
    path("<int:subject_id>/videos", SubjectVideosApi.as_view()),
    path("<int:subject_id>/videos/<int:video_id>", SubjectVideoByIdApi.as_view()),
    path("<int:subject_id>/visibility/", SubjectVisibilityApi.as_view()),
    path("<int:subject_id>/videos/order/", SubjectVideoOrderApi.as_view()),
]
