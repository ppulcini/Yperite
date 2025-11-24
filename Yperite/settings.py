"""
Django settings for Yperite project — production-ready for Railway.
"""

import os
from pathlib import Path
import dj_database_url

# --------------------------
# Base directory
# --------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

# --------------------------
# Security
# --------------------------
SECRET_KEY = os.environ.get(
    "SECRET_KEY",
    "django-insecure-dev-key"       # fallback pour local seulement
)

# DEBUG = os.environ.get("DEBUG", "False") == "True"
DEBUG = os.environ.get("RAILWAY_PROJECT_NAME") is None  # True si local, False si prod

# Domain Railway auto
RAILWAY_DOMAIN = os.environ.get("RAILWAY_PUBLIC_DOMAIN")

ALLOWED_HOSTS = [
    RAILWAY_DOMAIN,
    "localhost",
    "127.0.0.1"
]

# CSRF (OBLIGATOIRE sur Railway)
CSRF_TRUSTED_ORIGINS = [
    f"https://{RAILWAY_DOMAIN}",
]

CSRF_COOKIE_SECURE = not DEBUG
SESSION_COOKIE_SECURE = not DEBUG

# --------------------------
# Applications
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

# --------------------------
# Middleware
# --------------------------
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",   # static files en prod
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "Yperite.urls"

# --------------------------
# Templates
# --------------------------
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
# Database (Railway + Local)
# --------------------------
if os.environ.get("RAILWAY_PROJECT_NAME"):  # en prod sur Railway
    DATABASES = {
        "default": dj_database_url.config(
            default=os.environ.get("DATABASE_URL"),
            conn_max_age=600,
            ssl_require=True
        )
    }
else:  # en local
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": "Yperite_dev",
            "USER": "paul",
            "PASSWORD": "Meg@C@arlie153",
            "HOST": "127.0.0.1",
            "PORT": "5433",
        }
    }

# --------------------------
# Password validators
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

if os.environ.get("RAILWAY_PROJECT_NAME"):  # prod
    STATIC_ROOT = BASE_DIR / "staticfiles"
    STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
else:  # local
    STATICFILES_DIRS = [
        BASE_DIR / "Core" / "static",  # dossier static de ton app Core
    ]
    STATIC_ROOT = BASE_DIR / "staticfiles"  # facultatif pour collectstatic en local

# --------------------------
# Default primary key field type
# --------------------------
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
