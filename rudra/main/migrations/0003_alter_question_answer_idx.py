# Generated by Django 5.1.4 on 2024-12-12 21:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_remove_quizsession_user_quiz_user_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='question',
            name='answer_idx',
            field=models.CharField(max_length=255),
        ),
    ]
