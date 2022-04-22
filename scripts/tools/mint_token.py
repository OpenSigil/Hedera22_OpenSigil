from distutils.sysconfig import EXEC_PREFIX
import os
import json

from hedera import (
    PrivateKey,
    AccountBalanceQuery,
    TokenCreateTransaction,
    TokenAssociateTransaction
    )
from jnius import autoclass

from common.get_client import client, OPERATOR_ID, OPERATOR_KEY

def gen_new_cred():
    wallet_keys = PrivateKey.generate()
    return wallet_keys

def mint_token():
    resp = TokenCreateTransaction(
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

def associate_token(account_id, token_id, wallet_keys):
    resp = TokenAssociateTransaction(
            ).setAccountId(account_id
            ).setTokenIds(Collections.singletonList(token_id)
            ).freezeWith(client
            ).sign(OPERATOR_KEY
            ).sign(wallet_keys
            ).execute(client)
    receipt = resp.getReceipt(client)
    return receipt

def check_balance(account_id):
    receipt = AccountBalanceQuery(
      ).setAccountId(account_id
      ).execute(client)
    return receipt

if __name__ == '__main__':
    Collections = autoclass("java.util.Collections")
    wallet_keys = gen_new_cred()
    response = check_balance(OPERATOR_ID)
    print(f"Account Balance: {response.toString()}\n")
    token_id = mint_token()
    print(f"Token Id: {token_id.toString()}\n")
    try:
        response = associate_token(OPERATOR_ID, token_id, wallet_keys)
        print(f"Token Associated: {response.toString()}\n")
    except Exception as e:
        if 'TOKEN_ALREADY_ASSOCIATED_TO_ACCOUNT' in e.innermessage:
            print('Token already associated w/ account...')
        else:
            raise(e)
    response = check_balance(OPERATOR_ID)
    print(f"Account Balance of {token_id}: {response.tokens[token_id]}")