import os
import json

from hedera import (
    AccountId,
    Client,
    PrivateKey,
    )

ACCOUNT_ID = ''
PRIVATE_KEY = ''

if __name__ == '__main__':
    try:
        operator_id = AccountId.fromString(ACCOUNT_ID)
        operator_key = PrivateKey.fromString(PRIVATE_KEY)
        hedera_network = os.environ.get("HEDERA_NETWORK", "testnet")
        if hedera_network == "previewnet":
            client = Client.forPreviewnet()
        elif hedera_network == "testnet":
            client = Client.forTestnet()
        else:
            client = Client.forMainnet()
        client.setOperator(operator_id, operator_key)
    except Exception as e:
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