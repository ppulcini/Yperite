from django.db import models
from django.forms import ValidationError

Grades = (
    ('Soldat', 'Soldat'),
    ('Chef', 'Chef'),
    ('Commandant', 'Commandant'),
)

# Create your models here.
class Personnage(models.Model):
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    age = models.IntegerField()
    background = models.TextField()
    grade = models.CharField(choices=Grades, default='Soldat', max_length=20)
    equipe = models.ForeignKey('EquipesClass', on_delete=models.CASCADE, blank=True, null=True)
    competences = models.ManyToManyField('Competence', blank=True)

    def clean(self):
        if self.grade in ['Soldat', 'Chef'] and not self.equipe:
            raise ValidationError("Un Soldat ou un Chef doit avoir une équipe.")

    def __str__(self):
        return self.nom + self.prenom


class EquipesClass(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name

class TypeCompetence(models.Model):
    nom = models.CharField(max_length=100)

    def __str__(self):
        return self.nom


class Domaine(models.Model):
    nom = models.CharField(max_length=100)
    type_competence = models.ForeignKey(
        TypeCompetence,
        on_delete=models.CASCADE,
        related_name='domaines',
    )

    def __str__(self):
        return f"{self.nom} ({self.type_competence.nom})"

class Competence(models.Model):
    nom = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    domaine = models.ForeignKey(
        Domaine,
        on_delete=models.CASCADE,
        related_name='groupes',
        null=True,
        blank=True,
    )
    competence_mere = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='competences_filles'
    )

    def __str__(self):
        return self.nom