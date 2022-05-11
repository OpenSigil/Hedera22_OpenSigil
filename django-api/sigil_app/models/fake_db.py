'''
This is an unsecured temporary database alternative for DEMO PURPOSES ONLY 

IT SHOULD NOT BE USED TO STORE AUTH CREDENTIALS OR ACTUAL USER DATA OF ANY KIND
(All auth should be handed by hashconnect integration)

This may be replaced by an ipfs or alternative option in the near future
rather than an actual DB solution (which is why we chose such a temporary solution)
'''

import json
import os
from datetime import datetime

class FakeDb():
    FILE_PATH = 'resources/fake_db/data.json'

    def __init__(self):
        with open(self.FILE_PATH, 'r') as f:      
            self._database = json.loads(f.read())
        
    def __save_state(self, db_state):
        with open(self.FILE_PATH, 'w', encoding='utf-8') as f:
            json.dump(db_state, f, ensure_ascii=False, indent=4)

    def add_record(self, account_id, file_hash, contract_id, file):
        try:
            if account_id in self._database.keys():
                self._database[account_id].append({
                    "fileHash": file_hash,
                    "contractId": contract_id,
                    "uploadedAt": datetime.now().isoformat(),
                    "fileName": file.name,
                    "fileSize": file.size
                })
            else:
                self._database[account_id] = [{
                    "fileHash": file_hash,
                    "contractId": contract_id,
                    "uploadedAt": datetime.now().isoformat(),
                    "fileName": file.name,
                    "fileSize": file.size
                }]
            self.__save_state(self._database)
            return True
        except Exception as e:
            print(e)
        return False

    def return_record(self, account_id):
        if account_id in self._database.keys():
            return self._database[account_id]
        return None