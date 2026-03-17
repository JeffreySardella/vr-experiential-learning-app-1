from django.urls import path

from .apis import CourseByIdDetailedApi
from .apis import CourseUsersApi
from .apis import CourseUserByIdApi
from .apis import CourseVideosApi
from .apis import CourseVideoByIdApi
from .apis import CourseVisibilityApi
from .apis import CourseStudentsApi
from .apis import CourseStudentByIdApi

urlpatterns = [
    path("<int:course_id>", CourseByIdDetailedApi.as_view()),
    path("<int:course_id>/users", CourseUsersApi.as_view()),
    path("<int:course_id>/users/<int:user_id>", CourseUserByIdApi.as_view()),
    path("<int:course_id>/videos", CourseVideosApi.as_view()),
    path("<int:course_id>/videos/<int:video_id>", CourseVideoByIdApi.as_view()),
    path("<int:course_id>/visibility/", CourseVisibilityApi.as_view()),
    path("<int:course_id>/students/", CourseStudentsApi.as_view()),
    path("<int:course_id>/students/<int:user_id>/", CourseStudentByIdApi.as_view()),
]
