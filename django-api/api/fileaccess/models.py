from django.db import models

class FileAccess(models.Model):
    contract_id = models.CharField(db_index=True, max_length=255)
    account_id = models.CharField(db_index=True, max_length=255)
