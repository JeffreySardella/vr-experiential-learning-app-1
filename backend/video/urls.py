

from django.urls import include

from django.urls import path
from .apis import VideoApi
from .apis import VideoByIdApi
from .apis import UploadVideoApi

urlpatterns = [
    path("", VideoApi.as_view()),
    path("<int:id>/", VideoByIdApi.as_view()),
    path("uploadvideo/", UploadVideoApi.as_view()),
    path('', include('sage_stream.api.urls'))
]
