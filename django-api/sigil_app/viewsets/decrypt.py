from pickle import FALSE, TRUE
from django.core.files.uploadhandler import TemporaryFileUploadHandler
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from sigil_app.models import Encrypt

class DecryptViewSet(viewsets.ModelViewSet):
    http_method_names = ["post"]
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        self._encrypt_model = Encrypt()
        print("DECRYPT VIEWSET")
        if request.method == 'POST':
            try:
                return self._encrypt_model.decrypt_file(request.FILES['data'])
            except Exception as e:
                print(f'Exception encountered: {e}')
        return Response(
            {
                "success": FALSE,
                "msg": "File upload failed!",
            },
            status=status.HTTP_200_OK,
        )
