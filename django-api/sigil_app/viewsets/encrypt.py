from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

class EncryptViewSet(viewsets.ModelViewSet):
    http_method_names = ["post"]
    permission_classes = (AllowAny,)
    def create(self, request, *args, **kwargs):

        return Response(
            {
                "success": True,
                "msg": "Request aknowledged!",
            },
            status=status.HTTP_200_OK,
        )
