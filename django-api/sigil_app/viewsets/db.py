from pickle import FALSE, TRUE
from django.core.files.uploadhandler import TemporaryFileUploadHandler
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from sigil_app.models import FakeDb

class DbAddRecord(viewsets.ModelViewSet):
    http_method_names = ["post"]
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        _fake_db = FakeDb()
        if request.method == 'POST':
            if _fake_db.add_record(
                account_id=request.headers['ACCOUNT-ID'],
                file_hash=request.headers['FILE-HASH'],
                contract_id=request.headers['CONTRACT-ID']):
                return Response(
                    {
                        "success": True,
                        "msg": "Record update succeeded!",
                    },
                    status=status.HTTP_200_OK,
                )    
        return Response(
            {
                "success": False,
                "msg": "Record update failed!",
            },
            status=status.HTTP_200_OK,
        )

class DbReturnRecord(viewsets.ModelViewSet):
    http_method_names = ["post"]
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        _fake_db = FakeDb()
        if request.method == 'POST':
            return Response(
                {
                    "success": FALSE,
                    "msg": "Record query succeeded!",
                    "account_data": _fake_db.return_record(account_id=request.headers['ACCOUNT-ID'])
                },
                status=status.HTTP_200_OK,
            )
        return Response(
            {
                "success": FALSE,
                "msg": "Record query failed!",
            },
            status=status.HTTP_200_OK,
        )