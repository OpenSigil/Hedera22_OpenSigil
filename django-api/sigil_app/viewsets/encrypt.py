from pickle import FALSE, TRUE
from django.core.files.uploadhandler import TemporaryFileUploadHandler
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from sigil_app.models import Encrypt

class EncryptViewSet(viewsets.ModelViewSet):
    http_method_names = ["post"]
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        self._encrypt_model = Encrypt()
        if request.method == 'POST':
            try:
                self._encrypt_model.encrypt_file(request.FILES['data'])
                return Response(
                    {
                        "success": TRUE,
                        "msg": "File upload succeeded!",
                    },
                    status=status.HTTP_200_OK,
                )
            except Exception as e:
                print(f'Exception encountered: {e}')
        return Response(
            {
                "success": FALSE,
                "msg": "File upload failed!",
            },
            status=status.HTTP_200_OK,
        )
