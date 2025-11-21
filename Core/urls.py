from django.urls import path
from . import views

urlpatterns = [
    path('', views.connexion, name='connexion'),
    path('deconnexion', views.deconnexion, name='deconnexion'),
    path('load', views.load, name='load'),
    path('home', views.home, name='home'),
    path('activation', views.activation, name='activation'),
    path("api/competences/", views.competences_list, name="competences_list"),
    path("api/classe/", views.classe_list, name="classe_list"),
    path("api/personnage/create/", views.create_personnage, name="create_personnage"),
]