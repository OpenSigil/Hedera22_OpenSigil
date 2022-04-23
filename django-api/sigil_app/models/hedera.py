import os

from cryptography.fernet import Fernet
from django.db import models
from django.conf import settings
from django.http import HttpResponse
from hedera import (
    AccountId,
    Client,
    PrivateKey,
    )


class HederaModel():
    def __init__(self):
        pass

    def account_eval(self, account_id, private_key):
        try:
            operator_id = AccountId.fromString(account_id)
            operator_key = PrivateKey.fromString(private_key)
            hedera_network = os.environ.get("HEDERA_NETWORK", "testnet")
            if hedera_network == "previewnet":
                client = Client.forPreviewnet()
            elif hedera_network == "testnet":
                client = Client.forTestnet()
            else:
                client = Client.forMainnet()
            client.setOperator(operator_id, operator_key)
            return True
        except Exception as e:
            print("Exception raised")
            if 'Invalid Account ID' in e.innermessage:
                print("Invalid Account ID")
            if '"<parameter1>" is null' in e.innermessage:
                print("Missing Private Key")
            if 'invalid characters encountered in Hex string' in e.innermessage:
                print("Invalid Private Key")
            if 'DEF length 34 object truncated by 4' in e.innermessage:
                print("Invalid Account & Private Key")
            else:
                print(e)
            return False

    def encrypt_file(self, account_id, public_key, private_key, input_file):
        print("BEFORE ENCYPT FILE")
        result = self.account_eval(account_id, private_key)
        print(f'Account Status: {result}')