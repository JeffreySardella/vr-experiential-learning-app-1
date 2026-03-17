

from django.urls import include

from django.urls import path
from .apis import VideoApi
from .apis import VideoByIdApi
from .apis import UploadVideoApi
from video.progress_apis import ProgressApi, ProgressByCourseApi, RecentActivityApi
from video.notes_apis import VideoNotesApi, VideoNoteByIdApi
from video.chapter_apis import ChapterMarkersApi, ChapterMarkerByIdApi

urlpatterns = [
    path("", VideoApi.as_view()),
    path("<int:id>/", VideoByIdApi.as_view()),
    path("uploadvideo/", UploadVideoApi.as_view()),
    # Progress endpoints
    path('progress/', ProgressApi.as_view()),
    path('progress/recent/', RecentActivityApi.as_view()),
    path('progress/course/<int:course_id>/', ProgressByCourseApi.as_view()),
    # Notes endpoints
    path('<int:video_id>/notes/', VideoNotesApi.as_view()),
    path('<int:video_id>/notes/<int:note_id>/', VideoNoteByIdApi.as_view()),
    # Chapter markers endpoints
    path('<int:video_id>/chapters/', ChapterMarkersApi.as_view()),
    path('<int:video_id>/chapters/<int:chapter_id>/', ChapterMarkerByIdApi.as_view()),
    # Sage stream catch-all (must be last)
    path('', include('sage_stream.api.urls'))
]
