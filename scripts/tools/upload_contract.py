from platform import node
import json, os, time
from hedera import (
    ContractCreateTransaction,
    ContractFunctionParameters,
    FileCreateTransaction
    )
from jnius import autoclass
from get_client import client, OPERATOR_KEY

def load_contract_bytecode(bytecode_path):
    cur_dir = os.path.abspath(os.path.dirname(__file__))
    jsonf = open(os.path.join(cur_dir, bytecode_path))
    stateful_json = json.load(jsonf)
    jsonf.close()
    bytecode = stateful_json['object'].encode()
    return bytecode

def upload_contract_bytecode(bytecode):
    transaction = FileCreateTransaction()
    resp = transaction.setKeys(OPERATOR_KEY
        ).setContents(bytecode
        ).setMaxAttempts(4
        ).execute(client)
    file_id = resp.getReceipt(client).fileId
    return file_id

def create_smart_contract(file_id):
    tran = ContractCreateTransaction()
    resp = tran.setGas(500000
        ).setBytecodeFileId(file_id
        ).setConstructorParameters(
            ContractFunctionParameters().addUint32(100)
        ).execute(client)
    contract_id = resp.getReceipt(client).contractId
    return contract_id

CONTRACT_PATH = '../../resources/contracts/compiled/check_balance.json'

if __name__ == '__main__':
    Collections = autoclass("java.util.Collections")
    bytecode = load_contract_bytecode(CONTRACT_PATH)
    print(f"Loading contract bytecode...\n")
    file_id = upload_contract_bytecode(bytecode)
    print(f"Uploading contract bytecode\n")
    contract_id = create_smart_contract(file_id)
    print(f"Contract Created: {contract_id}\n")