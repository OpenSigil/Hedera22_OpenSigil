# Generated by Django 3.2.5 on 2022-05-15 04:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_file', '0002_auto_20220515_0150'),
    ]

    operations = [
        migrations.AlterField(
            model_name='file',
            name='cid',
            field=models.CharField(db_index=True, max_length=255, null=True),
        ),
    ]