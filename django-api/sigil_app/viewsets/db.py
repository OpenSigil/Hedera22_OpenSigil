from pickle import FALSE, TRUE
from django.core.files.uploadhandler import TemporaryFileUploadHandler
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from api.file.models import File
from api.fileaccess.models import FileAccess

class DbAddRecord(viewsets.ModelViewSet):
    http_method_names = ["post"]
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
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
        if request.method == 'POST':
            try:
                files = File.objects.filter(owner_account_id=request.headers['ACCOUNT-ID'])

                response = []

                for file in files:
                    response.append({
                        "cid": file.cid,
                        "fileHash": file.file_hash,
                        "contractId": file.contract_id,
                        "fileSize": file.file_size,
                        "fileName": file.file_name,
                        "uploadedAt": file.updated_at,
                    })

                # Get files granted access to

                access_list = FileAccess.objects.filter(account_id=request.headers['ACCOUNT-ID'])

                for access in access_list:
                    files = File.objects.filter(contract_id=access.contract_id)

                    if len(files) != 0:
                        file = files[0]
                        response.append({
                            "cid": file.cid,
                            "fileHash": file.file_hash,
                            "contractId": file.contract_id,
                            "fileSize": file.file_size,
                            "fileName": file.file_name,
                            "uploadedAt": file.updated_at,
                        })
            except Exception as e:
                print("test")
                print(e)
                
            return Response(
                {
                    "success": FALSE,
                    "msg": "Record query succeeded!",
                    "account_data": response
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