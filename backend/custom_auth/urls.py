from dj_rest_auth.app_settings import api_settings
from dj_rest_auth.views import LogoutView
from dj_rest_auth.views import UserDetailsView
from django.urls import include
from django.urls import path

from .apis import AdminInviteApi
from .apis import AdminRegisterApi
from .apis import InstructorInviteApi
from .apis import InstructorRegisterApi
from .apis import LoginApi
from .apis import StudentRegisterApi

urlpatterns = [
    path(
        "register/", include(
            [
                path("students/", StudentRegisterApi.as_view()),
                path("admins/", AdminRegisterApi.as_view()),
                path("instructors/", InstructorRegisterApi.as_view()),
            ]
        ),
    ),
    path('login/', LoginApi.as_view()),
    path('logout/', LogoutView.as_view(), name='rest_logout'),
    path('user/', UserDetailsView.as_view(), name='rest_user_details'),
    path(
        "invite/", include(
            [
                path("admins/", AdminInviteApi.as_view()),
                path("instructors/", InstructorInviteApi.as_view()),
            ]
        ),
    ),
]


if api_settings.USE_JWT:
    from rest_framework_simplejwt.views import TokenVerifyView

    from dj_rest_auth.jwt_auth import get_refresh_view

    urlpatterns += [
        path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
        path('token/refresh/', get_refresh_view().as_view(), name='token_refresh'),
    ]
