import os
import json
from hedera import AccountId, PrivateKey, Client

CLIENT_CONFIG_PATH = "../../resources/credentials/client-config.json"
client = Client.fromConfigFile(CLIENT_CONFIG_PATH)
OPERATOR_ID = client.operatorAccountId
with open(CLIENT_CONFIG_PATH) as f:
    OPERATOR_KEY = PrivateKey.fromString(json.load(f)["operator"]["privateKey"])