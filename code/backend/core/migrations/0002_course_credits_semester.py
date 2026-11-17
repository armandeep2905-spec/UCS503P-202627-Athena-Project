from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='credits',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='course',
            name='semester',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]

