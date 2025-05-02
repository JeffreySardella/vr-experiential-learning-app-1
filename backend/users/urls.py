from django.urls import path

from .apis import UserApi

urlpatterns = [
    path("<str:identifier>", UserApi.as_view()),
]
