import json
import math
import os
from traceback import print_tb

from cryptography.fernet import Fernet
from django.db import models
from django.conf import settings
from django.http import HttpResponse
from hedera import (
    AccountId,
    Client,
    ContractCallQuery,
    ContractCreateTransaction,
    ContractExecuteTransaction,
    ContractFunctionParameters,
    ContractId,
    FileAppendTransaction,
    FileCreateTransaction,
    Hbar,
    PrivateKey,
    )

from sigil_app.models.encrypt import Encrypt
from sigil_app.models.fake_db import FakeDb
from common.get_client import client, OPERATOR_ID, OPERATOR_KEY

CONTRACT_PATH = '../../resources/contracts/compiled/sigil_contract.json'

class HederaModel():
    def __init__(self):
        try:
            self._wallet_keys = self.__gen_new_cred()
            self._fake_db = FakeDb()
        except Exception as e:
            print(e)
            raise Exception(e)
    
    def __gen_new_cred(self):
        wallet_keys = PrivateKey.generate()
        return wallet_keys

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

    def gen_auth_token(self, account_id, public_key, private_key):
        token_id = self.__mint_token()
        try:
            response = self.__associate_token(account_id, token_id, self._wallet_keys)
            print(f"Token Associated: {response.toString()}\n")
        except Exception as e:
            if 'TOKEN_ALREADY_ASSOCIATED_TO_ACCOUNT' in e.innermessage:
                print('Token already associated w/ account...')
            else:
                raise(e)
        response = self.__check_balance(account_id)
        print(f"Account Balance of {token_id}: {response.tokens[token_id]}")

    def load_contract_bytecode(self, bytecode_path):
        cur_dir = os.path.abspath(os.path.dirname(__file__))
        jsonf = open(os.path.join(cur_dir, bytecode_path))
        stateful_json = json.load(jsonf)
        jsonf.close()
        bytecode = stateful_json['object'].encode()
        return bytecode

    def upload_contract_bytecode(self, bytecode):
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

    def create_smart_contract(self, file_id):
        tran = ContractCreateTransaction()
        resp = tran.setGas(500000
            ).setBytecodeFileId(file_id
            ).setConstructorParameters(
                ContractFunctionParameters().addUint32(100)
            ).execute(client)
        contract_id = resp.getReceipt(client).contractId
        return contract_id

    def __transact_set_owner(self, contract_id, function_name, owner_id, transaction_fee):
        result = (ContractExecuteTransaction()
                .setGas(500000)
                .setContractId(contract_id)
                .setFunction(function_name,
                            ContractFunctionParameters().addAddress(owner_id.toSolidityAddress())
                            )
                .setMaxTransactionFee(Hbar(transaction_fee))
                .execute(client))
        return result

    def __transact_set_file_hash(self, contract_id, file_hash, transaction_fee):
        result = (ContractExecuteTransaction()
                .setGas(500000)
                .setContractId(contract_id)
                .setFunction('setFileHash',
                            ContractFunctionParameters().addString(file_hash)
                            )
                .setMaxTransactionFee(Hbar(transaction_fee))
                .execute(client))
        return result

    def __query_smart_contract(self, contract_id, function_name, payment_amount):
        result = (ContractCallQuery()
            .setGas(500000)
            .setContractId(ContractId.fromString(contract_id))
            .setFunction(function_name)
            .setQueryPayment(Hbar(payment_amount))
            .execute(client))
        return result

    def __transact_add_revoke_access(self, contract_id, function_name, account_id, transaction_fee):
        print("ADD REVOKE ACCESS")
        result = (ContractExecuteTransaction()
                .setGas(500000)
                .setContractId(ContractId.fromString(contract_id))
                .setFunction(function_name,
                            ContractFunctionParameters().addAddress(AccountId.fromString(account_id).toSolidityAddress())
                            )
                .setMaxTransactionFee(Hbar(transaction_fee))
                .execute(client))
        return result

    def encrypt_file(self, account_id, public_key, private_key, input_file):
        print('Encrypt file')
        if self.account_eval(account_id, private_key):
            bytecode = self.load_contract_bytecode(CONTRACT_PATH)
            print(f"Loading contract bytecode...\n")
            file_id = self.upload_contract_bytecode(bytecode)
            print(f"Uploading contract bytecode\n")
            contract_id = self.create_smart_contract(file_id)
            print(f"Contract Created: {contract_id.toString()}\n")
            response = self.__transact_set_owner(contract_id, "setOwner", OPERATOR_ID, 20)  
            print(f" Set Contract Owner")
            # Encrypt here
            sigil_cryptography = Encrypt()
            encrypted_file, temp_file_path = sigil_cryptography.encrypt_file(input_file)
            print("Encrypted file")
            file_hash = sigil_cryptography.get_file_hash(temp_file_path)
            print(f"Encrypted file hash: {file_hash}")
            response = self.__transact_set_file_hash(contract_id, file_hash, 20)  
            message = response.getReceipt(client).toString()
            print(f"[Contract] Set File Hash: {message}")
            self._fake_db.add_record(account_id, file_hash, contract_id.toString())
            return encrypted_file
        else:
            print("Account eval failed")
            return None

    def list_access(self, contract_id):
        response = self.__query_smart_contract(contract_id, "getAccessList", 2)
        address_list = []
        for i in range(2, 256):
            try:
                # Address is in hex, convert to int & add hedera address prefix (0.0.)
                address_list.append(f'0.0.{int(response.getAddress(i), 16)}')
            except Exception as e:
                if 'End index' in e.innermessage:
                    break
                else:
                    raise e
        print(f'Address list: {address_list}')
        return address_list

    def add_access(self, contract_id, account_id):
        response = self.__transact_add_revoke_access(contract_id, "addAccess", account_id, 20)  
        message = response.getReceipt(client).toString()
        print(f"[Contract] Added Access For: {account_id}")
        return True

    def revoke_access(self, contract_id, account_id):
        response = self.__transact_add_revoke_access(contract_id, "revokeAccess", account_id, 20)  
        message = response.getReceipt(client).toString()
        print(f"[Contract] Revoked Access For: {account_id}")
        return True