from django.urls import path
from . import views

urlpatterns = [
    # WEB PAGES
    path('', views.connexion, name='connexion'),
    path('deconnexion', views.deconnexion, name='deconnexion'),
    path('load', views.load, name='load'),
    path('home', views.home, name='home'),
    path('activation', views.activation, name='activation'),
    
    # API FOR AJAX REQUESTS
    path("api/competences/", views.competences_list, name="competences_list"),
    path("api/classe/", views.classe_list, name="classe_list"),
    path("api/personnage/create/", views.create_personnage, name="create_personnage"),
    path("api/personnage/update/", views.update_personnage, name="update_personnage"),
    path("api/personnages/", views.personnages, name="personnages_list"),
    path("api/equipes/", views.equipe_list, name="equipe_list"),
    path("api/background/generate/", views.genereted_background, name="genereted_background"),
]