# Generated by Django 4.2.7 on 2024-07-10 20:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('races', '0003_alter_state_flag_image'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='race',
            name='completed',
        ),
    ]
