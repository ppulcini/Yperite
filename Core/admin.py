from django.contrib import admin

# Register your models here.

from .models import Personnage, EquipesClass, Competence, Domaine,  TypeCompetence
admin.site.register(Personnage)
admin.site.register(EquipesClass)
admin.site.register(Competence)
admin.site.register(Domaine)
admin.site.register(TypeCompetence)
