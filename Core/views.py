import json
from django.contrib.auth import login, authenticate, logout
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import Competence, Personnage, EquipesClass
from .forms import connexionForm

@csrf_exempt
def connexion(request):
    if request.method == "POST":
        form = connexionForm(request.POST)
        if form.is_valid():
            print("form valid")
            user = authenticate(
                username=form.cleaned_data['Username'],
                password=form.cleaned_data['Password'],
            )
            print("user", user)
            if user is not None:
                login(request, user)
                return render(request, "Core/loading.html")
        print("form invalid")
    if request.user.is_authenticated:
        return render(request, "Core/loading.html")
    return render(request, "Core/connexion.html", context={"form": connexionForm()})

def deconnexion(request):
    logout(request)
    return redirect("connexion")


def load(request):
    return render(request, "Core/loading.html")

def home(request):
    Username = request.user.username
    return render(request, "Core/home.html", context={"Username": Username})

@csrf_exempt
def create_personnage(request):
    if request.method == "GET":
        return render(request, "Core/activation.html")
    elif request.method == "POST":
        data = json.loads(request.body)
        print("data", data)
        name = data.get("name")
        age = data.get("age")
        background = data.get("background", "")
        competences_ids = data.get("competences", [])
        prenom = data.get("prenom", "")

        equipe_id = data.get("classe")
        try:
            equipe_instance = EquipesClass.objects.get(name=equipe_id)
        except EquipesClass.DoesNotExist:
            return JsonResponse({"error": "Équipe invalide"}, status=400)
        personnage = Personnage.objects.create(
            nom=name,
            prenom=prenom,
            age=age,
            equipe=equipe_instance,
            background=background
        )
        # Ajouter les compétences
        competences = Competence.objects.filter(id__in=competences_ids)
        personnage.competences.set(competences)
        return render(request, "Core/home.html")
    else:
        return JsonResponse({"error": "Méthode non autorisée"}, status=405)


def activation(request):
    return render(request, "Core/activation.html")

def competences_list(request):
    competences = list(Competence.objects.values(
        "id", "nom", "description", "domaine__nom",
        "competence_mere__nom", "domaine__type_competence__nom"))
    return JsonResponse(competences, safe=False)

def classe_list(request):
    classes = list(EquipesClass.objects.values("name"))
    return JsonResponse(classes, safe=False)