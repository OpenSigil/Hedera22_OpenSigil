from pickle import FALSE, TRUE
from django.core.files.uploadhandler import TemporaryFileUploadHandler
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from sigil_app.models import HederaModel

class HederaViewSet(viewsets.ModelViewSet):
    http_method_names = ["post"]
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        _hedera = HederaModel()
        if request.method == 'POST':
            
            return _hedera.encrypt_file(
                account_id=request.headers['ACCOUNT-ID'],
                public_key=request.headers['PUBLIC-KEY'],
                private_key=request.headers['PRIVATE-KEY'],
                input_file=request.FILES['data'])
        return Response(
            {
                "success": FALSE,
                "msg": "File upload failed!",
            },
            status=status.HTTP_200_OK,
        )
