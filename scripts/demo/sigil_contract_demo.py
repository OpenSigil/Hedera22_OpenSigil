import json
import math
import os

from hedera import (
    Hbar,
    PrivateKey,
    AccountId,
    AccountBalanceQuery,
    AccountCreateTransaction,
    AccountDeleteTransaction,
    ContractCreateTransaction,
    ContractCallQuery,
    ContractExecuteTransaction,
    ContractFunctionParameters,
    FileAppendTransaction,
    FileCreateTransaction,
    TransferTransaction,
    TokenCreateTransaction,
    TokenAssociateTransaction,
    TokenWipeTransaction,
    TokenDeleteTransaction,
    )
from jnius import autoclass

from common.get_client import client, OPERATOR_ID, OPERATOR_KEY

def gen_new_cred():
    wallet_keys = PrivateKey.generate()
    return wallet_keys

def create_account(credential_keys, initial_balance):
    resp = AccountCreateTransaction(
        ).setKey(credential_keys.getPublicKey()
        ).setInitialBalance(Hbar(initial_balance)
        ).execute(client)
    node_id = resp.nodeId
    account_id = resp.getReceipt(client).accountId
    return (node_id, account_id)  

def mint_token(node_id):
    resp = TokenCreateTransaction(
        ).setNodeAccountIds(Collections.singletonList(node_id)
        ).setTokenName("ffff"
        ).setTokenSymbol("F"
        ).setDecimals(1
        ).setInitialSupply(10
        ).setTreasuryAccountId(OPERATOR_ID
        ).setAdminKey(OPERATOR_KEY.getPublicKey()
        ).setFreezeKey(OPERATOR_KEY.getPublicKey()
        ).setWipeKey(OPERATOR_KEY.getPublicKey()
        ).setSupplyKey(OPERATOR_KEY.getPublicKey()
        ).setFreezeDefault(False
        ).execute(client)

    token_id = resp.getReceipt(client).tokenId
    return token_id

def associate_token(node_id, account_id, token_id, wallet_keys):
    resp = TokenAssociateTransaction(
            ).setNodeAccountIds(Collections.singletonList(node_id)
            ).setAccountId(account_id
            ).setTokenIds(Collections.singletonList(token_id)
            ).freezeWith(client
            ).sign(OPERATOR_KEY
            ).sign(wallet_keys
            ).execute(client)
    receipt = resp.getReceipt(client)
    return receipt

def send_tokens(node_id, account_id, token_id, transfer_amount):
    # operator -> account 1
    receipt = TransferTransaction(
            ).setNodeAccountIds(Collections.singletonList(node_id)
            ).addTokenTransfer(token_id, OPERATOR_ID, -abs(transfer_amount)
            ).addTokenTransfer(token_id, account_id, transfer_amount
            ).execute(client
            ).getReceipt(client)
    return receipt

def check_balance(account_id):
    receipt = AccountBalanceQuery(
      ).setAccountId(account_id
      ).execute(client)
    return receipt

def wipe_tokens(node_id, account_id, token_id, wipe_amount):
    receipt = TokenWipeTransaction(
          ).setNodeAccountIds(Collections.singletonList(node_id)
          ).setTokenId(token_id
          ).setAccountId(account_id
          ).setAmount(wipe_amount
          ).execute(client
          ).getReceipt(client)
    return receipt

def delete_token(node_id, token_id):
    receipt = TokenDeleteTransaction(
            ).setNodeAccountIds(Collections.singletonList(node_id)
            ).setTokenId(token_id
            ).execute(client
            ).getReceipt(client)
    return receipt

def delete_account(account_id, wallet_keys):
    receipt = AccountDeleteTransaction(
          ).setAccountId(account_id
          ).setTransferAccountId(OPERATOR_ID
          ).freezeWith(client
          ).sign(OPERATOR_KEY
          ).sign(wallet_keys
          ).execute(client
          ).getReceipt(client)
    return receipt

def load_contract_bytecode(bytecode_path):
    cur_dir = os.path.abspath(os.path.dirname(__file__))
    jsonf = open(os.path.join(cur_dir, bytecode_path))
    stateful_json = json.load(jsonf)
    jsonf.close()
    bytecode = stateful_json['object'].encode()
    return bytecode

def upload_contract_bytecode(bytecode):
    # Files over 6kb need to chunked into smaller pieces
    chunk_size = 5000 # in bytes
    # Number of chunks = file bytes / chunk_size in bytes, rounded up
    for i in range(math.ceil(len(bytecode)/chunk_size)):
        bytes_range_start = (i * chunk_size)
        bytes_range_end = ((i* chunk_size) + chunk_size)
        # Grab "chunk" of file between byte range
        bytecode_chunk = bytecode[bytes_range_start:bytes_range_end]
        if i == 0: # Create file on first chunk
            transaction = FileCreateTransaction()
            resp = transaction.setKeys(OPERATOR_KEY
                ).setContents(bytecode_chunk
                ).setMaxAttempts(4
                ).execute(client)
            file_id = resp.getReceipt(client).fileId
        else: # Add additional chunks w/ append transaction
            transaction = FileAppendTransaction(
            ).setFileId(file_id
            ).setContents(bytecode_chunk
            ).setMaxChunks(15
            ).execute(client)
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

def query_smart_contract(contract_id, function_name, payment_amount):
    result = (ContractCallQuery()
          .setGas(500000)
          .setContractId(contract_id)
          .setFunction(function_name)
          .setQueryPayment(Hbar(payment_amount))
          .execute(client))
    return result

def transact_smart_contract(contract_id, function_name, function_value_a, function_value_b, transaction_fee):
    result = (ContractExecuteTransaction()
            .setGas(500000)
            .setContractId(contract_id)
            .setFunction(function_name,
                        ContractFunctionParameters().addAddress(function_value_a.toSolidityAddress()).addAddress(function_value_b.toSolidityAddress())
                        )
            .setMaxTransactionFee(Hbar(transaction_fee))
            .execute(client))
    return result

def transact_set_file_hash(contract_id, function_name, file_hash, transaction_fee):
    result = (ContractExecuteTransaction()
            .setGas(500000)
            .setContractId(contract_id)
            .setFunction(function_name,
                        ContractFunctionParameters().addString(file_hash)
                        )
            .setMaxTransactionFee(Hbar(transaction_fee))
            .execute(client))
    return result

def transact_set_owner(contract_id, function_name, owner_id, transaction_fee):
    result = (ContractExecuteTransaction()
            .setGas(500000)
            .setContractId(contract_id)
            .setFunction(function_name,
                        ContractFunctionParameters().addAddress(owner_id.toSolidityAddress())
                        )
            .setMaxTransactionFee(Hbar(transaction_fee))
            .execute(client))
    return result

def transact_add_revoke_access(contract_id, function_name, account_id, transaction_fee):
    result = (ContractExecuteTransaction()
            .setGas(500000)
            .setContractId(contract_id)
            .setFunction(function_name,
                        ContractFunctionParameters().addAddress(account_id.toSolidityAddress())
                        )
            .setMaxTransactionFee(Hbar(transaction_fee))
            .execute(client))
    return result

CONTRACT_PATH = '../../resources/contracts/compiled/sigil_contract.json'

if __name__ == '__main__':
    Collections = autoclass("java.util.Collections")
    wallet_keys = gen_new_cred()
    #print(f"Private Key: {wallet_keys.toString()}\n")
    #print(f"Public Key: {wallet_keys.getPublicKey().toString()}\n")
    node_id, account_id = create_account(wallet_keys, 1)
    print(f"Account Id: {account_id.toString()}\n")
    bytecode = load_contract_bytecode(CONTRACT_PATH)
    print(f"Loading contract bytecode...\n")
    file_id = upload_contract_bytecode(bytecode)
    print(f"Uploading contract bytecode\n")
    contract_id = create_smart_contract(file_id)
    print(f"Contract Created: {contract_id}\n")
    response = query_smart_contract(contract_id, "getFileHash", 2)
    message = response.getString(0)
    print(f"[Contract] File Hash: {message}")
    response = transact_set_file_hash(contract_id, "setFileHash", "HELLO", 20)  
    message = response.getReceipt(client).toString()
    print(f"[Contract] Set File Hash: {message}")
    response = query_smart_contract(contract_id, "getFileHash", 2)
    message = response.getString(0)
    print(f"[Contract] File Hash: {message}")
    response = query_smart_contract(contract_id, "getFileHash", 2)
    message = response.getString(0)
    print(f"[Contract] Contract Owner: {message}")
    response = transact_set_owner(contract_id, "setOwner", OPERATOR_ID, 20)  
    message = response.getReceipt(client).toString()
    print(f"[Contract] Set Contract Owner: {message}")
    response = query_smart_contract(contract_id, "getOwner", 2)
    print(f'Response: {response.__dir__()}')
    message = response.getAddress(0)
    print(response.getAddress(0))   
    owner = AccountId.fromSolidityAddress(response.getAddress(0))
    print(f"[Contract] Contract Owner: {owner.toString()}")
    response = query_smart_contract(contract_id, "getAccessList", 2)
    message = response.getStringArray(0)
    print(f"[Contract] Access List: {message.toString()}")
    response = transact_add_revoke_access(contract_id, "addAccess", OPERATOR_ID, 20)  
    message = response.getReceipt(client).toString()
    print(f"[Contract] Added Access For: {message}")
    response = query_smart_contract(contract_id, "getAccessList", 2)
    address_list = []
    for i in range(2, 256):
        try:
            address_list.append(response.getAddress(i))
        except Exception as e:
            if 'End index' in e.innermessage:
                break
            else:
                raise e
    print(f"[Contract] Access List: {address_list}")
    response = transact_add_revoke_access(contract_id, "revokeAccess", OPERATOR_ID, 20)  
    message = response.getReceipt(client).toString()
    print(f"[Contract] Revoked Access for: {message}")
    print('Waiting...')
    import time
    time.sleep(10)
    response = query_smart_contract(contract_id, "getAccessList", 2)
    address_list = []
    for i in range(2, 256):
        try:
            address_list.append(response.getAddress(i))
        except Exception as e:
            if 'End index' in e.innermessage:
                break
            else:
                raise e
    print(f"[Contract] Access List: {address_list}")