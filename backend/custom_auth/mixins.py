from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.views import APIView


class EnsureCsrfMixin(APIView):
    """
    Ensures a CSRF cookie is set.

    Useful for when a view does not set the CSRF cookie when it should be and is required for authentication.
    For example, the dj-rest-auth login/register views do not set the cookie but it is required when CSRF is enforced
    for session based authentication or JWT Cookie Authentication (with CSRF checks enabled)

    Ref: https://docs.djangoproject.com/en/5.0/ref/csrf/#django.views.decorators.csrf.ensure_csrf_cookie
    """
    @method_decorator(ensure_csrf_cookie)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)
