import os
from django.conf import settings
from mistralai import Mistral
import logging
from .db_Yperite import get_faction_information_global
model = "mistral-large-latest"

client = Mistral(api_key=settings.MISTRAL_API_KEY)
def generate_background(demande):
    content = '''Crée un background **unique et varié** pour un personnage de l'Aéropole.
- **Évite les clichés** : Les parents ne sont pas toujours ouvriers ou soldats. Explore aussi mais pas forcement toujours des métiers rares (artisans spécialisés, scientifiques dissidents, membres du Culte, contrebandiers, etc.). Tout en gardant une coherence quand meme avec le metiers ou sttaus fournir par l'utilisateur.
- **Diversifie les origines** : Le personnage peut venir des bas-fonds, mais aussi des niveaux supérieurs, ou avoir un passé hybride.
- **Inclure des contradictions** : Un enfant de militaire peut détester l'armée, un mutant peut être intégré dans les niveaux supérieurs, etc.
- **Professions des parents** : Liste au moins 3 options possibles (ex: médecin, ingénieur, artiste clandestin) et choisis-en une au hasard.
- **Parcours de vie** : Ajoute un événement inattendu (ex: une rencontre avec un mutant, une mission secrète ratée, une découverte interdite).
- **Tout les infos** fournis sont des exemples de diversité mais n'oublie pas de garder une cohérence avec l'univers de l'Aéropole. Et quecertains personnages peuvent avoir des backgournd avec des passé plus banal ou classique (ex: enfant d'ouvrier devenu artisan, enfant de fonctionnaire devenu policier, etc.
- **Ne donne pas de choix, crée directement un background complet et détaillé avec une mise en page nom prenom age ect.
- **Le background doit etre condenser et précis en utilisant 500 mots maximum ( tu ne doit pas afficher ce nombre dans ta reponse ) .
    les Infos qui suivent elles sont factuelles et doivent être respectées pour garder la cohérence de l'univers et de la demande de l'utilisateur
    - Voici les info de l'univers: ''' + get_faction_information_global() + '''\n
    - Voici les info fournis par l'utilisateur  : '''+ demande + '''\n
    '''
    try:
        chat_response = client.chat.complete(
            model= model,
            messages = [
                {
                    "role": "user",
                    "content": content,
                },
            ]
        )
        return chat_response.choices[0].message.content
    except Exception as e:
        logging.error(f"Erreur Mistral : {e}")
        return {"error": str(e)}