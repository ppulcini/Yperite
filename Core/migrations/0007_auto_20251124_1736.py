from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ('Core', '0006_personnage_niveau'),
    ]

    operations = [
        migrations.RenameField(
            model_name='personnage',
            old_name='Niveau',  # correspond à la colonne actuelle
            new_name='grade',
        ),
    ]