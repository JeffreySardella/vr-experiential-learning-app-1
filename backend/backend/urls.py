"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include
from django.urls import path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view

from backend.analytics_apis import AnalyticsOverviewApi, AnalyticsByCourseApi


schema_view = get_schema_view(
    openapi.Info(
        title="API",
        default_version='v1',
    ),
    # TODO consider privating API documentation
    public=True,
    # permission_classes=(permissions.IsAdminUser,),
)

urlpatterns = [
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('admin/', admin.site.urls),
    path(
        'api/',
        include(
            [
                path("institutions/", include("institution.urls")),
                path("courses/", include("institution.courses.urls")),
                path("subjects/", include("institution.subjects.urls")),
                path("users/", include("users.urls")),
                path('auth/', include('custom_auth.urls')),
                path('video/', include('video.urls')),
                path('quizzes/', include('quiz.urls')),
                path('analytics/overview/', AnalyticsOverviewApi.as_view()),
                path('analytics/course/<int:course_id>/', AnalyticsByCourseApi.as_view()),
            ]
        )
    )
]
