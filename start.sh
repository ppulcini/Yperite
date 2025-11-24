#!/bin/bash

# Appliquer les migrations
python manage.py migrate --noinput

#create user
python create_user.py

# Collecter les fichiers statiques
python manage.py collectstatic --noinput

# Démarrer l'application avec Gunicorn (port fourni par Railway)
gunicorn Yperite.wsgi:application --bind 0.0.0.0:$PORT --timeout 120