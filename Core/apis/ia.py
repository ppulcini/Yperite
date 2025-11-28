import os
from mistralai import Mistral
import logging
from .db_Yperite import get_faction_information_global
model = "mistral-large-latest"

client = Mistral(api_key=os.environ.get("API_KEY_MISTRAL"))
print("client ia init", os.environ.get("API_KEY_MISTRAL"))
def generate_background(demande):
    content = '''Tu doit crée un background de personnage pour un jeu de rôle a l'aide des info fourni par l'utilisateur mais aussi des les infos de l'univers.
    tu ne donnera pas d'autre information en dehors de la reponse pas d'explication n'y rien d'autre.
    tu proposera une Fiche d’Identité, des Origines, un Parcours de vie, des Motivations et Objectifs. chaque session commencera par ** nom ** exemple  ** Fiche d’Identité **. mais evite apres d'ajouter des étoiles dans le texte.
    Le background doit etre condenser et précis en utilisant 300 mots maximum ( tu ne doit pas afficher ce nombre dans ta reponse ) .
    '''
    content += content + "\nVoici les info fournis par l'utilisateur  : " + demande + "\n voici les info de l'univers: " + get_faction_information_global()
    print("demenade user :", demande)
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
