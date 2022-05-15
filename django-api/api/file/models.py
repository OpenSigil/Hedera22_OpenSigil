from django.db import models

class File(models.Model):
    file_hash = models.CharField(db_index=True, max_length=255)
    contract_id = models.CharField(db_index=True, max_length=255)
    owner_account_id = models.CharField(db_index=True, max_length=255)
    updated_at = models.CharField(db_index=True, max_length=255)
    file_name = models.CharField(db_index=True, max_length=255)
    file_size = models.CharField(db_index=True, max_length=255)
    cid = models.CharField(db_index=True, max_length=255)    
