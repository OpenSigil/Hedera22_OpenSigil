from pickle import FALSE, TRUE
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.http import HttpResponse

from sigil_app.models import HederaModel
from api.file.models import File
from datetime import datetime

class HederaEncryptViewSet(viewsets.ModelViewSet):
    http_method_names = ["post"]
    permission_classes = (AllowAny,)
    def create(self, request, *args, **kwargs):
        try:
            _hedera = HederaModel()

            if request.method == 'POST':
                encrypted_file, file_hash, contract_id = _hedera.encrypt_file(
                    account_id=request.headers['ACCOUNT-ID'],
                    public_key=request.headers['PUBLIC-KEY'],
                    private_key=request.headers['PRIVATE-KEY'],
                    input_file=request.FILES['data'])

                file_name = request.FILES['data'].name
                file_size = request.FILES['data'].size

                f = File(
                    file_hash=file_hash, 
                    contract_id=contract_id, 
                    owner_account_id=request.headers['ACCOUNT-ID'],
                    updated_at=datetime.now().isoformat(), 
                    file_name=file_name, 
                    file_size=file_size, 
                    cid=None
                )
                
                f.save()

                return HttpResponse(encrypted_file, content_type="application/octet-stream")
            return Response(
                {
                    "success": FALSE,
                    "msg": "File upload failed!",
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )
        except Exception as e:
            print(e)

class HederaDecryptViewSet(viewsets.ModelViewSet):
    http_method_names = ["post"]
    permission_classes = (AllowAny,)
    def create(self, request, *args, **kwargs):
        try:
            _hedera = HederaModel()
            if request.method == 'POST':
                decrypted_file =  _hedera.decrypt_file(
                    account_id=request.headers['ACCOUNT-ID'],
                    contract_id=request.headers['CONTRACT-ID'],
                    input_file=request.FILES['data']
                )

                return HttpResponse(decrypted_file, content_type="application/octet-stream")
            return Response(
                {
                    "success": FALSE,
                    "msg": "File upload failed!",
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )
        except Exception as e:
            print(e)

class HederaListViewSet(viewsets.ModelViewSet):
    http_method_names = ["post"]
    permission_classes = (AllowAny,)
    def create(self, request, *args, **kwargs):
        _hedera = HederaModel()
        if request.method == 'POST':
            return Response(
                {
                    "success": TRUE,
                    "msg": "Smart contract query succeeded!",
                    "access_list": _hedera.list_access(
                        contract_id=request.headers['CONTRACT-ID']
                    )
                },
                status=status.HTTP_200_OK,
            )
        return Response(
            {
                "success": FALSE,
                "msg": "Smart contract query failed!",
                "access_list": None
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

class HederaAddViewSet(viewsets.ModelViewSet):
    http_method_names = ["post"]
    permission_classes = (AllowAny,)
    def create(self, request, *args, **kwargs):
        _hedera = HederaModel()
        if request.method == 'POST':
            if _hedera.add_access(
                contract_id=request.headers['CONTRACT-ID'],
                account_id=request.headers['ACCOUNT-ID']
            ):
                return Response(
                    {
                        "success": TRUE,
                        "msg": "Smart contract query succeeded!",
                    },
                    status=status.HTTP_200_OK,
                )
        return Response(
            {
                "success": FALSE,
                "msg": "Smart contract query failed!",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

class HederaRevokeViewSet(viewsets.ModelViewSet):
    http_method_names = ["post"]
    permission_classes = (AllowAny,)
    def create(self, request, *args, **kwargs):
        _hedera = HederaModel()
        if request.method == 'POST':
            if _hedera.revoke_access(
                contract_id=request.headers['CONTRACT-ID'],
                account_id=request.headers['ACCOUNT-ID']
            ):
                return Response(
                    {
                        "success": TRUE,
                        "msg": "Smart contract query succeeded!",
                    },
                    status=status.HTTP_200_OK,
                )
        return Response(
            {
                "success": FALSE,
                "msg": "Smart contract query failed!",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )