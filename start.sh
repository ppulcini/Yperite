#!/bin/bash
# start.sh - script de démarrage pour Railway

echo "Réinitialisation de l'app Core..."
python manage.py migrate Core zero

python manage.py migrate

python manage.py collectstatic --noinput

gunicorn myproject.wsgi:application --bind 0.0.0.0:$PORT --timeout 120