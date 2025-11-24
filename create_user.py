import os
import django

# Préparer Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Yperite.settings') 
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Récupérer les infos depuis les variables d'environnement si elles existent, sinon valeurs par défaut
username = os.environ.get("DJANGO_SUPERUSER_USERNAME", "admin")
email = os.environ.get("DJANGO_SUPERUSER_EMAIL", "admin@example.com")
password = os.environ.get("DJANGO_SUPERUSER_PASSWORD", "admin123")

# Créer le superuser si il n'existe pas
if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email=email, password=password)
    print(f"Superuser '{username}' créé !")
else:
    print(f"Superuser '{username}' existe déjà.")
