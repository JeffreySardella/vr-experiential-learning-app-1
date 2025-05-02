from django.urls import path

from .apis import CourseByIdDetailedApi
from .apis import CourseUsersApi
from .apis import CourseUserByIdApi
from .apis import CourseVideosApi
from .apis import CourseVideoByIdApi

urlpatterns = [
    path("<int:course_id>", CourseByIdDetailedApi.as_view()),
    path("<int:course_id>/users", CourseUsersApi.as_view()),
    path("<int:course_id>/users/<int:user_id>", CourseUserByIdApi.as_view()),
    path("<int:course_id>/videos", CourseVideosApi.as_view()),
    path("<int:course_id>/videos/<int:video_id>", CourseVideoByIdApi.as_view()),
]
