# Generated by Django 4.2.7 on 2024-07-10 20:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('races', '0005_race_race_image'),
    ]

    operations = [
        migrations.RenameField(
            model_name='race',
            old_name='race_image',
            new_name='race_images',
        ),
    ]
