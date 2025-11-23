#!/bin/bash

# Appliquer les migrations
python manage.py migrate --noinput

# Collecter les fichiers statiques
python manage.py collectstatic --noinput

# Démarrer l'application avec Gunicorn (port fourni par Railway)
gunicorn Yperite.wsgi:application --bind 0.0.0.0:$PORT