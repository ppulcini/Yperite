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
            user = authenticate(
                username=form.cleaned_data['Username'],
                password=form.cleaned_data['Password'],
            )
            if user is not None:
                login(request, user)
                return render(request, "Core/loading.html")
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
def update_personnage(request):
    if request.method == "GET":
        return render(request, "Core/activation.html")

    elif request.method == "POST":
        data = json.loads(request.body)
        print("DATA : ", data)
        # Si on édite un personnage
        edit_id = request.GET.get("edit")
        try:
            personnage = Personnage.objects.get(id=edit_id, author=request.user)
        except Personnage.DoesNotExist:
            return JsonResponse({"error": "Vous ne pouvez pas modifier ce personnage"}, status=403)

        personnage.nom = data.get("name")
        personnage.prenom = data.get("prenom")
        personnage.age = data.get("age")
        personnage.background = data.get("background")
        personnage.grade = data.get("niveau")

        equipe_id = data.get("classe")
        try:
            personnage.equipe = EquipesClass.objects.get(id=equipe_id)
        except:
            personnage.equipe = None

        # Mise à jour compétences
        competences_ids = data.get("competences", [])
        competences = Competence.objects.filter(id__in=competences_ids)
        personnage.competences.set(competences)
        print("PERSONNAGE : ", personnage)
        personnage.save()
        return JsonResponse({"success": True, "id": personnage.id, "edit": True})

@csrf_exempt
def create_personnage(request):
    if request.method == "GET":
        return render(request, "Core/activation.html")
    elif request.method == "POST":
        data = json.loads(request.body)

        if request.user.is_staff is False:
            if Personnage.objects.filter(author=request.user).exists():
                 return JsonResponse({"error": "Un personnages existe deja pour ce compte"}, status=405)

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
            author=request.user,
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
        "id", "nom", "description", "offer", "domaine__nom", "competences_meres__id",
        "competences_meres__nom", "domaine__type_competence__nom"))
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
            "competences": list(p.competences.values("id", "nom")),
            "author": p.author.username,
        })
    return JsonResponse(personnages, safe=False)

@csrf_exempt
def genereted_background(request):
    if request.method == "POST":
        infos = request.body.decode("utf-8")
        bg = generate_background(infos)
        return JsonResponse({"background": bg})
    return JsonResponse({"error": "Méthode non autorisée"}, status=405)