#!/bin/bash

# Appliquer les migrations
python manage.py migrate --noinput

python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username="Paul").exists():
    User.objects.create_superuser("Paul", "pulcinpaul@gmail.com", "P@aulPulc1n1->@-@<-")
    print("Superuser created")
else:
    print("Superuser already exists")
EOF

# Collecter les fichiers statiques
python manage.py collectstatic --noinput

# Démarrer l'application avec Gunicorn (port fourni par Railway)
gunicorn Yperite.wsgi:application --bind 0.0.0.0:$PORT --timeout 120