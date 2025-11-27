import json
from django.utils.timezone import now
from django.contrib.auth import login, authenticate, logout
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import Competence, Personnage, EquipesClass
from .forms import connexionForm
from .apis.ia import generate_background

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
    return render(request, "Core/home.html", context={"Username": Username, "now": now().timestamp()})

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
        grade = data.get("niveau", "Soldat")
        try:
            equipe_instance = EquipesClass.objects.get(name=equipe_id)
        except EquipesClass.DoesNotExist:
            equipe_instance = None
        personnage = Personnage.objects.create(
            nom=name,
            prenom=prenom,
            age=age,
            equipe=equipe_instance,
            grade=grade,
            background=background
        )
        # Ajouter les compétences
        competences = Competence.objects.filter(id__in=competences_ids)
        personnage.competences.set(competences)
        return JsonResponse({"success": True, "id": personnage.id})
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

def equipe_list(request):
    equipes = list(EquipesClass.objects.values("id", "name"))
    return JsonResponse(equipes, safe=False)

def personnages(request):
    personnages = []
    for p in Personnage.objects.all():
        if p.equipe is None:
            equipe_name = 'Commandant'
            equipe_id = 0
        else:
            equipe_name = p.equipe.name
            equipe_id = p.equipe.id
        personnages.append({
            "id": p.id,
            "nom": p.nom,
            "prenom": p.prenom,
            "age": p.age,
            "equipe": equipe_name,
            "equipe_id": equipe_id,   # ← IMPORTANT
            "grade": p.grade,
            "background": p.background,
            "competences": list(p.competences.values("id", "nom"))
        })
    return JsonResponse(personnages, safe=False)

@csrf_exempt
def genereted_background(request):
    if request.method == "POST":
        infos = request.body.decode("utf-8")
        bg = generate_background(infos)
        return JsonResponse({"background": bg})
    return JsonResponse({"error": "Méthode non autorisée"}, status=405)