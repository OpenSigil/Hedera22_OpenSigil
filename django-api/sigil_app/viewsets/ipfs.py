from pickle import FALSE, TRUE
from django.core.files.uploadhandler import TemporaryFileUploadHandler
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from sigil_app.models.fake_db import FakeDb
from django.http import HttpResponse
import requests

from sigil_app.models import HederaModel

class IPFSUploadViewSet(viewsets.ModelViewSet):
    http_method_names = ["post"]
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        try:
            _hedera = HederaModel()
            _fake_db = FakeDb()
            if request.method == 'POST':
                print('test')

                encrypted_file, file_hash, contract_id = _hedera.encrypt_file(
                    account_id=request.headers['ACCOUNT-ID'],
                    public_key=request.headers['PUBLIC-KEY'],
                    private_key=request.headers['PRIVATE-KEY'],
                    input_file=request.FILES['data'])

                file_name = request.FILES['data'].name
                file_size = request.FILES['data'].size

                response = requests.post('https://api.web3.storage/upload', data=encrypted_file, headers={
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEY0NjdiM0VmNWIyMWE4YUVCNDQ0QmQzOTYyZmMzZUI4OGJkOWU4ZkQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTEwMTYyODY2MTUsIm5hbWUiOiJvcGVuc2lnaWwifQ.34hfUxJOEyOrkY-i1VjGLNxl-zRBi1FcejT150SJ_mc'
                })

                cid = response.json()['cid']

                _fake_db.add_record(request.headers['ACCOUNT-ID'], file_hash, contract_id, file_name, file_size, cid)

                return Response(
                    {
                        "success": True,
                        "msg": "File upload successful!",
                    },
                    status=status.HTTP_200_OK,
                )  
                
            return Response(
                {
                    "success": FALSE,
                    "msg": "File upload failed!",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            print(e)

class IPFSDownloadViewSet(viewsets.ModelViewSet):
    http_method_names = ["post"]
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        try:
            _hedera = HederaModel()
            _fake_db = FakeDb()
            if request.method == 'POST':
                account_id = request.headers['ACCOUNT-ID']
                contract_id = request.headers['CONTRACT-ID']

                # Get CID from the above info
                cid = _fake_db.get_cid_from_contract_id(contract_id)

                # Get file here
                response = requests.get('https://{}.ipfs.dweb.link/'.format(cid))

                file_contents = response.text
                
                # Decrypt the file
                decrypted_file = _hedera.decrypt_file(
                    account_id=account_id,
                    contract_id=request.headers['CONTRACT-ID'],
                    input_file=file_contents
                )

                return HttpResponse(decrypted_file, content_type="application/octet-stream")
                
            return Response(
                {
                    "success": FALSE,
                    "msg": "File upload failed!",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            print(e)