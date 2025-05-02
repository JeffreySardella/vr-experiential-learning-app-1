from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response

from custom_auth.models import User
from custom_auth.serializers import CustomUserDetailsSerializer

from backend.decorators import method_permission_classes

from custom_auth.permissions import IsInternalAdmin


class UserApi(APIView):
    @swagger_auto_schema(
        responses={
            200: CustomUserDetailsSerializer()
        },
    )
    @method_permission_classes([IsAdminUser | IsInternalAdmin])
    def get(self, request, identifier):
        user = User.objects.filter(email=identifier).first()
        if not user:
            return Response({})
        serializer = CustomUserDetailsSerializer(user)
        return Response(serializer.data)

    @swagger_auto_schema(
        responses={
            204: "No content"
        },
    )
    @method_permission_classes([IsAdminUser | IsInternalAdmin])
    def delete(self, request, identifier):
        try:
            user = User.objects.get(pk=int(identifier))
        except (User.DoesNotExist, ValueError):
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
