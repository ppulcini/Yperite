#!/bin/bash
# start.sh - script de démarrage pour Railway

# 1️⃣ Appliquer la migration problématique en "fake" pour éviter l'erreur competences_mere_id
echo "Fake migration de la 0009 pour Core..."
python manage.py migrate Core 0009 --fake

# 2️⃣ Appliquer toutes les migrations restantes
echo "Application des migrations restantes..."
python manage.py migrate

# 3️⃣ Collecter les fichiers statiques (si nécessaire)
echo "Collecte des fichiers statiques..."
python manage.py collectstatic --noinput

# 4️⃣ Démarrer le serveur Django avec Gunicorn
echo "Démarrage du serveur Django..."
gunicorn myproject.wsgi:application --bind 0.0.0.0:$PORT --timeout 120