# Generated by Django 4.2.7 on 2024-07-10 22:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('races', '0007_alter_race_race_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='race',
            name='race_date',
            field=models.DateField(blank=True, null=True),
        ),
    ]
