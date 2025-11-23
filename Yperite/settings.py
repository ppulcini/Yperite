"""
Django settings for Yperite project (Railway-ready).
"""

import os
from pathlib import Path
import dj_database_url

# --------------------------
# Build paths
# --------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

# --------------------------
# Security
# --------------------------
SECRET_KEY = os.environ.get(
    "SECRET_KEY", 
    "django-insecure-$m(eztk!5!(v6$)mu#1b90*s1r_+5493lc*c5!=w&4z_pj=)st"
)
DEBUG = os.environ.get("DEBUG", "False") == "True"

ALLOWED_HOSTS = ["yperite-production.up.railway.app"]  # ton domaine Railway

# --------------------------
# Application definition
# --------------------------
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "Core",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",  # WhiteNoise pour fichiers statiques
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "Yperite.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "Yperite.wsgi.application"

# --------------------------
# Database
# --------------------------
DATABASES = {
    "default": dj_database_url.config(
        default=os.environ.get(
            "DATABASE_URL",
            "postgres://paul:Meg%40C%40arlie153@yperite-production.up.railway.app:5432/Yperite_dev"
        ),
        conn_max_age=600,
        ssl_require=True
    )
}

# --------------------------
# Password validation
# --------------------------
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# --------------------------
# Internationalization
# --------------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# --------------------------
# Static files
# --------------------------
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# --------------------------
# CSRF & Session
# --------------------------
CSRF_TRUSTED_ORIGINS = ["https://yperite-production.up.railway.app"]
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True

# --------------------------
# Default primary key field type
# --------------------------
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
