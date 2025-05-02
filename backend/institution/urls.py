from django.urls import path

from .apis import (
    AddCourseApi,
    AnnouncementApi,
    AnnouncementByIdApi,
    CourseByIdApi,
    CourseApi,
    InstitutionApi,
    InstitutionByIdApi,
    ProgramApi,
    ProgramByIdApi,
    SubjectByIdApi,
    SubjectsByCourseAPI,
    UserCoursesApi,
)


urlpatterns = [
    path("", InstitutionApi.as_view()),
    path("<int:id>/", InstitutionByIdApi.as_view()),
    path("<int:institution_id>/programs/", ProgramApi.as_view()),
    path("<int:institution_id>/programs/<int:id>", ProgramByIdApi.as_view()),
    path('<int:institution_id>/programs/<int:program_id>/courses/', CourseApi.as_view()),
    path('<int:institution_id>/programs/<int:program_id>/courses/<int:id>', CourseByIdApi.as_view()),
    path('course/<int:course_id>/announcements', AnnouncementApi.as_view()),
    path('course/<int:course_id>/announcements/<int:announcement_id>', AnnouncementByIdApi.as_view()),
    path('<int:institution_id>/programs/<int:program_id>/courses/<int:course_id>/subjects/', SubjectsByCourseAPI.as_view()),
    path('<int:institution_id>/programs/<int:program_id>/courses/<int:course_id>/subjects/<int:id>', SubjectByIdApi.as_view()),
    path("add_course/", AddCourseApi.as_view()),
    path("courses/", UserCoursesApi.as_view()),

]
