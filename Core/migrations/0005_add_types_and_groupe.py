# app/migrations/0004_create_types_and_domaines.py
from django.db import migrations

def create_competences(apps, schema_editor):
    TypeCompetence = apps.get_model('Core', 'TypeCompetence')
    Domaine = apps.get_model('Core', 'Domaine')
    Competence = apps.get_model('Core', 'Competence')

    # --- Types ---
    types = {}
    for t in ["MARTIAL", "ADRESSE", "ARTISANAT", "CORPS ET ESPRIT", "YPERITE"]:
        types[t] = TypeCompetence.objects.create(nom=t)

    # --- Domaines par type ---
    domaines = {}

    # MARTIAL
    for d in ["Armes tranchantes", "Armes contondantes", "Armes à distance", "Armure", "Bouclier"]:
        domaines[d] = Domaine.objects.create(nom=d, type_competence=types["MARTIAL"])

    # ADRESSE
    for d in ["Roublardise", "Code secret", "Poche secrète", "Torture", "Assassin", "Pugilat", "Piégeur"]:
        domaines[d] = Domaine.objects.create(nom=d, type_competence=types["ADRESSE"])

    # ARTISANAT
    for d in ["Mécanique", "Alchimie", "Forge", "Récolte", "Médecine"]:
        domaines[d] = Domaine.objects.create(nom=d, type_competence=types["ARTISANAT"])

    # CORPS ET ESPRIT
    for d in ["Archiviste", "Résistance", "Méditation", "Sensibilité d’esprit"]:
        domaines[d] = Domaine.objects.create(nom=d, type_competence=types["CORPS ET ESPRIT"])

    # YPERITE
    for d in ["Soin de folie", "Modification génétique", "Technologie avancée", "Développement Ypérité"]:
        domaines[d] = Domaine.objects.create(nom=d, type_competence=types["YPERITE"])

    # --- Compétences ADRESSE ---
    competences = [
        {
            "nom": "Vol",
            "description": "Vous pouvez voler les armes et les objets avec une gommette rouge.",
            "domaine": domaines["Roublardise"],
        },
        {
            "nom": "Sabotage 1",
            "description": "Vous pouvez saboter les armes, armure en cuir. Vous aurez 3 rubans rouges à attacher sur les armes que vous souhaitez saboter.",
            "domaine": domaines["Roublardise"],
        },
        {
            "nom": "Sabotage 2",
            "description": "Vous pouvez saboter en plus toutes les armures et machines. Vous aurez 3 rubans rouges supplémentaires à attacher sur les armes à saboter.",
            "domaine": domaines["Roublardise"],
        },
        {
            "nom": "Pickpocket",
            "description": "Vous avez 2 pinces à linge que vous pouvez accrocher aux vêtements. Vous ne volez qu’une seule poche par pince à linge.",
            "domaine": domaines["Roublardise"],
        },
        {
            "nom": "Voleur habile",
            "description": "Vous avez 2 pinces à linge supplémentaires et vous pouvez désormais les appliquer aux besaces / bourses et sacoches.",
            "domaine": domaines["Roublardise"],
        },
        {
            "nom": "Professionnel",
            "description": "Vous pouvez saboter en plus toutes les armures et machines. Vous aurez 3 rubans rouges supplémentaires à attacher sur les armes à saboter.",
            "domaine": domaines["Roublardise"],
        },
        {
            "nom": "Poche cachée 1",
            "description": "Vous possédez une petite poche cachée sur votre vêtement de 5cm de diamètre. Son contenu ne peut pas être volé, sauf par un Professionnel.",
            "domaine": domaines["Poche secrète"],
        },
        {
            "nom": "Poche cachée 2",
            "description": "Vous possédez une poche cachée supplémentaire qui peut être dans votre besace ou sacoche (pas bourse) 5cm de diamètre. Son contenu ne peut pas être volé, sauf par un Professionnel.",
            "domaine": domaines["Poche secrète"],
        },
        {
            "nom": "Involable",
            "description": "Vous ne pouvez pas être volé, même par un Professionnel.",
            "domaine": domaines["Poche secrète"],
        },
        {
            "nom": "Connaissances des coffres 1",
            "description": "Vous pouvez voler les armes et les objets avec une gommette rouge.",
            "domaine": domaines["Code secret"],
        },
        {
            "nom": "Connaissances des coffres 2",
            "description": "Vous pouvez saboter les armes, armure en cuir. Vous aurez 3 rubans rouges à attacher sur les armes que vous souhaitez saboter.",
            "domaine": domaines["Code secret"],
        },
        {
            "nom": "Connaissances des coffres 3",
            "description": "Vous pouvez saboter en plus toutes les armures et machines. Vous aurez 3 rubans rouges supplémentaires à attacher sur les armes à saboter.",
            "domaine": domaines["Code secret"],
        },
        {
            "nom": "Connaissance de la douleur",
            "description": "Vous pouvez torturer quelqu’un, ce dernier répondra à 1 question avant de tomber en agonie.",
            "domaine": domaines["Torture"],
        },
        {
            "nom": "Rapide et brutal",
            "description": "Pour chaque question que vous posez, la victime perd 3 PV mais ne peut pas mentir.",
            "domaine": domaines["Torture"],
        },
        {
            "nom": "Expert des coups",
            "description": "Votre victime perd 2 PV au lieu de 3 par question.",
            "domaine": domaines["Torture"],
        },
        {
            "nom": "Lent et efficace",
            "description": "Pour chaque question que vous posez, la victime perd 2 PV et peut mentir à 1 question.",
            "domaine": domaines["Torture"],
        },
        {
            "nom": "Expert des lames",
            "description": "Votre victime perd 1 PV au lieu de 2 par question, et peut mentir à une seule d’entre elles.",
            "domaine": domaines["Torture"],
        },
        {
            "nom": "Egorgement",
            "description": "Vous pouvez torturer quelqu’un, ce dernier répondra à 1 question avant de tomber en agonie.",
            "domaine": domaines["Assassin"],
        },
        {
            "nom": "Assommement",
            "description": "Pour chaque question que vous posez, la victime perd 3 PV mais ne peut pas mentir.",
            "domaine": domaines["Assassin"],
        },
        {
            "nom": "Assassinat",
            "description": "Votre victime perd 2 PV au lieu de 3 par question.",
            "domaine": domaines["Assassin"],
        },
        {
            "nom": "Surineur",
            "description": "Pour chaque question que vous posez, la victime perd 2 PV et peut mentir à 1 question.",
            "domaine": domaines["Assassin"],
        },
        {
            "nom": "Puissant 1",
            "description": "Votre valeur de pugilat (combat à mains nues) augmente de +2 par niveau.",
            "domaine": domaines["Pugilat"],
        },
        {
            "nom": "Puissant 2",
            "description": "Votre valeur de pugilat (combat à mains nues) augmente de +2 par niveau.",
            "domaine": domaines["Pugilat"],
        },
        {
            "nom": "Puissant 3",
            "description": "Votre valeur de pugilat (combat à mains nues) augmente de +2 par niveau.",
            "domaine": domaines["Pugilat"],
        },
        {
            "nom": "Piège simple",
            "description": "Vous pouvez poser 1 piège au sol par jour. Ce dernier rend la jambe inutilisable durant 1h à celui qui le fait exploser et fait perdre 2 PV.",
            "domaine": domaines["Piégeur"],
        },
        {
            "nom": "Piège à effet",
            "description": "Vous pouvez poser 1 piège supplémentaire par jour. Vous pouvez en supplément appliquer un papier donnant un effet, à condition d’avoir fabriqué le nécessaire. Un livret sera fourni.",
            "domaine": domaines["Piégeur"],
        },
        {
            "nom": "Piège destructeur",
            "description": "Vous pouvez poser un piège supplémentaire par jour. Vous pouvez fabriquer le nécessaire pour que ce piège soit explosif, mettant à l’agonie celui qui le prend. Un livret sera fourni.",
            "domaine": domaines["Piégeur"],
        },
        {
            "nom": "Épée et masse courte (Offert)",
            "description": "Permet de manier une arme d’une longueur inférieure ou égale à 70 cm.",
            "domaine": domaines["Armes tranchantes"],
        },
        {
            "nom": "Épée longue",
            "description": "Permet de manier une arme d’une longueur entre 70 cm et 100 cm.",
            "domaine": domaines["Armes tranchantes"],
        },
        {
            "nom": "Ambidextrie 1",
            "description": "Vous pouvez utiliser une arme dans chaque main d’une longueur inférieure à 70 cm.",
            "domaine": domaines["Armes tranchantes"],
        },
        {
            "nom": "Ambidextrie 2",
            "description": "Vous pouvez utiliser une arme dans chaque main d’une longueur 70 cm et 100 cm.",
            "domaine": domaines["Armes tranchantes"],
        },
        {
            "nom": "Armes d’hast",
            "description": "Vous pouvez utiliser une arme d’hast d’une longueur entre 150 cm et 2m.",
            "domaine": domaines["Armes tranchantes"],
        },
        {
            "nom": "2 Mains",
            "description": "Vous pouvez utiliser une arme à deux mains, d’une longueur entre 110 et 150 cm.",
            "domaine": domaines["Armes tranchantes"],
        },
        {
            "nom": "Balayage",
            "description": "Vous pouvez annoncer dans une phrase 'CHOC' à un adversaire en lui donnant un coup dans les jambes, ce dernier tombe au sol. Utilisable 1 fois par demi-journée.",
            "domaine": domaines["Armes tranchantes"],
        },
        {
            "nom": "Tranchant",
            "description": "Vous pouvez annoncer dans une phrase 'TRANCHE' à un adversaire en lui donnant un coup tranchant. Son membre est inutilisable jusqu’à recevoir une chirurgie ou une greffe. Utilisable 1 fois par demi-journée.",
            "domaine": domaines["Armes tranchantes"],
        },
        {
            "nom": "Brisant",
            "description": "Vous pouvez annoncer dans une phrase 'BRISE' à un adversaire en lui donnant un coup dans une armure ou un bouclier, ce dernier est brisé et inutilisable jusqu’à recevoir une chirurgie ou une greffe. Utilisable 1 fois par demi-journée.",
            "domaine": domaines["Armes contondantes"],
        },
        {
            "nom": "Masse courte (Offert)",
            "description": "Permet de manier une arme d’une longueur inférieure ou égale à 70 cm.",
            "domaine": domaines["Armes contondantes"],
        },
        {
            "nom": "Masse longue",
            "description": "Permet de manier une arme d’une longueur entre 70 cm et 100 cm.",
            "domaine": domaines["Armes contondantes"],
        },
        {
            "nom": "Ambidextrie 1",
            "description": "Vous pouvez utiliser une arme dans chaque main d’une longueur inférieure à 70 cm.",
            "domaine": domaines["Armes contondantes"],
        },
        {
            "nom": "Ambidextrie 2",
            "description": "Vous pouvez utiliser une arme dans chaque main d’une longueur 70 cm et 100 cm.",
            "domaine": domaines["Armes contondantes"],
        },
        {
            "nom": "Armes d’hast",
            "description": "Vous pouvez utiliser une arme d’hast d’une longueur entre 150 cm et 2m.",
            "domaine": domaines["Armes contondantes"],
        },
        {
            "nom": "2 Mains",
            "description": "Vous pouvez utiliser une arme à deux mains, d’une longueur entre 110 et 150 cm.",
            "domaine": domaines["Armes contondantes"],
        },
        {
            "nom": "Arme de Jet 1",
            "description": "Permet de posséder 2 armes de jets (couteaux, hachette).",
            "domaine": domaines["Armes à distance"],
        },
        {
            "nom": "Arme de Jet 2",
            "description": "Permet de posséder 2 armes de jets supplémentaires (couteaux, hachette).",
            "domaine": domaines["Armes à distance"],
        },
        {
            "nom": "Arme creuse",
            "description": "Du poison peut être appliqué sur une de vos armes de jet. Vous devez accrocher un ruban vert.",
            "domaine": domaines["Armes à distance"],
        },
        {
            "nom": "Arc et Arbalète",
            "description": "Permet de manier un arc ou une arbalète avec 3 munition.",
            "domaine": domaines["Armes à distance"],
        },
        {
            "nom": "Munitions",
            "description": "Permet de posséder jusqu’à 6 munitions supplémentaires.",
            "domaine": domaines["Armes à distance"],
        },
        {
            "nom": "Armure légère",
            "description": "Permet de vous équiper d’une armure en cuir ou gambison. Elle vous offre 1 PA.",
            "domaine": domaines["Armure"],
        },
        {
            "nom": "Armure intermédiaire",
            "description": "Permet de vous équiper d’une armure en bois/os/écailles.",
            "domaine": domaines["Armure"],
        },
        {
            "nom": "Armure lourde",
            "description": "Permet de vous équiper d’une armure de plaques, de maille ou cotte de maille.",
            "domaine": domaines["Armure"],
        },
        {
            "nom": "Amélioration",
            "description": "Permet de renforcer votre armure et lui apporter 1 PA supplémentaire et de résister à un 'BRISE'.",
            "domaine": domaines["Armure"],
        },
        {
            "nom": "Targe",
            "description": "Permet de posséder un bouclier de type targe. Il possède 1 PA.",
            "domaine": domaines["Bouclier"],
        },
        {
            "nom": "Écu et rondache",
            "description": "Permet de posséder un bouclier de type écusson ou rondache. Il possède 2 PA.",
            "domaine": domaines["Bouclier"],
        },
        {
            "nom": "Pavois",
            "description": "Permet de posséder un bouclier de type pavois à partir de 120 cm de hauteur. Il possède 3 PA.",
            "domaine": domaines["Bouclier"],
        },
        {
            "nom": "Résistance",
            "description": "Votre bouclier peut ignorer un 'BRISE' une fois par jour.",
            "domaine": domaines["Bouclier"],
        },
        {
            "nom": "Bricoleur",
            "description": "Permet de connaître la construction des ressources de base de la mécanique.",
            "domaine": domaines["Mécanique"],
        },
        {
            "nom": "Architecture",
            "description": "Vous connaissez des plans pour construire de nouvelles structures sur la table de Wargame.",
            "domaine": domaines["Mécanique"],
        },
        {
            "nom": "Plans avancés",
            "description": "Vous connaissez des constructions complexes et avancées pour la table de Wargame.",
            "domaine": domaines["Mécanique"],
        },
        {
            "nom": "Réparation et démantèlement",
            "description": "Vous pouvez réparer et démanteler des objets mécaniques pour en récupérer les ressources.",
            "domaine": domaines["Mécanique"],
        },
        {
            "nom": "Création",
            "description": "Vous pouvez créer de nouveaux objets pouvant apporter des effets à des armes, armures ou outils.",
            "domaine": domaines["Mécanique"],
        },
        {
            "nom": "Expert",
            "description": "Toutes vos créations vous coûtent 1 ressource en moins de chaque type, avec un minimum de 1.",
            "domaine": domaines["Mécanique"],
        },
        {
            "nom": "Apothicaire",
            "description": "Vous connaissez la recette de 4 potions et/ou poisons de base.",
            "domaine": domaines["Alchimie"],
        },
        {
            "nom": "Potions",
            "description": "Vous connaissez la recette de 4 potions supplémentaires.",
            "domaine": domaines["Alchimie"],
        },
        {
            "nom": "Élixirs",
            "description": "Vous connaissez la recette de 4 élixirs.",
            "domaine": domaines["Alchimie"],
        },
        {
            "nom": "Poisons",
            "description": "Vous connaissez la recette de 4 poisons supplémentaires.",
            "domaine": domaines["Alchimie"],
        },
        {
            "nom": "Recettes secrètes",
            "description": "Vous connaissez la recette de 4 poisons puissants.",
            "domaine": domaines["Alchimie"],
        },
        {
            "nom": "Secret des poisons",
            "description": "Vous avez accès à un tableau vous offrant la possibilité de créer vos propres poisons et élixirs.",
            "domaine": domaines["Alchimie"],
        },
        {
            "nom": "Forge légère",
            "description": "Vous savez fabriquer et réparer les armes courtes, longues et les armures légères.",
            "domaine": domaines["Forge"],
        },
        {
            "nom": "Forge intermédiaire",
            "description": "Vous savez fabriquer et réparer les armes d’hast, les armes à 2 mains et les armures intermédiaires.",
            "domaine": domaines["Forge"],
        },
        {
            "nom": "Forge lourde",
            "description": "Vous savez fabriquer et réparer les armes lourdes.",
            "domaine": domaines["Forge"],
        },
        {
            "nom": "Création exceptionnelle",
            "description": "Vous pouvez créer vos armes et armures selon les connaissances que vous avez des différents minerais et métaux.",
            "domaine": domaines["Forge"],
        },
        {
            "nom": "Cueillette",
            "description": "Vous connaissez 4 plantes existantes.",
            "domaine": domaines["Récolte"],
        },
        {
            "nom": "Expert en plantes",
            "description": "Vous connaissez 4 plantes supplémentaires.",
            "domaine": domaines["Récolte"],
        },
        {
            "nom": "Récolte efficace",
            "description": "Lorsque vous récoltez, vous récupérez le double de votre récolte.",
            "domaine": domaines["Récolte"],
        },
        {
            "nom": "Expert en minerais",
            "description": "Vous connaissez 4 minerais supplémentaires.",
            "domaine": domaines["Récolte"],
        },
        {
            "nom": "Minerais",
            "description": "Vous connaissez 4 minerais existants.",
            "domaine": domaines["Récolte"],
        },
        {
            "nom": "Premier soin",
            "description": "Vous pouvez appliquer les premiers soins, permettant à la personne de récupérer 1 PV. Vous pouvez aussi stabiliser quelqu’un en agonie, mais pas en combat.",
            "domaine": domaines["Médecine"],
        },
        {
            "nom": "Épidémiologie",
            "description": "Vous avez accès aux connaissances de certaines maladies et comment les soigner.",
            "domaine": domaines["Médecine"],
        },
        {
            "nom": "Chirurgie",
            "description": "Vous pouvez effectuer une opération pour soigner les membres brisés et définir les causes de décès.",
            "domaine": domaines["Médecine"],
        },
        {
            "nom": "Greffe",
            "description": "Vous pouvez greffer un membre tranché afin de le rendre utilisable.",
            "domaine": domaines["Médecine"],
        },
        {
            "nom": "Stabiliser",
            "description": "Vous pouvez stabiliser quelqu’un dans le coma. Ce dernier mettra 1 heure pour passer en agonie puis sera en 1 PV.",
            "domaine": domaines["Médecine"],
        },
        {
            "nom": "Soin d’urgence",
            "description": "Vous pouvez faire revenir quelqu’un d’un état de coma à 1 PV en 1 Sablier.",
            "domaine": domaines["Médecine"],
        },
        {
            "nom": "Missive (offert)",
            "description": "Permet d’envoyer une missive sur la table de Wargame pour réaliser une action.",
            "domaine": domaines["Archiviste"],
        },
        {
            "nom": "Cartographe",
            "description": "Vous pouvez tracer des cartes, vous aurez connaissance d’une partie de la carte du terrain. Vous êtes le seul à pouvoir révéler les détails non découverts sur une zone révélée sur la table de Wargame sans avoir à utiliser de troupe (utilisable 1 fois par jour).",
            "domaine": domaines["Archiviste"],
        },
        {
            "nom": "Bestiaire",
            "description": "Vous avez connaissance de certaines espèces qui vivent sur PLAN.ET.",
            "domaine": domaines["Archiviste"],
        },
        {
            "nom": "Mythes et légendes",
            "description": "Vous connaissez des espèces qui auraient été aperçues ou que vous auriez vues, particulièrement uniques.",
            "domaine": domaines["Archiviste"],
        },
        {
            "nom": "Paléographie 1-2",
            "description": "Vous étudiez les diverses écritures inconnues de PLAN.ET. Vous avez une partie d’un des plus vieux alphabets en cours d’étude par niveau.",
            "domaine": domaines["Archiviste"],
        },
        {
            "nom": "Juridique",
            "description": "Vous pouvez mettre en place des textes de loi avec les autres juristes. Vous êtes le seul capable de transmettre des instructions avec un temps d’action par 2. Utilisable une fois par jour.",
            "domaine": domaines["Archiviste"],
        },
        {
            "nom": "Administratif",
            "description": "Vous pouvez envoyer du courrier à votre Plan par le biais de 'messager'. Vous êtes le seul capable de transmettre des instructions avec un temps d’action par 2. Utilisable une fois par jour.",
            "domaine": domaines["Archiviste"],
        },
        {
            "nom": "Robuste",
            "description": "Vous pouvez résister 1 fois par jour à un 'BRISE' ou 'TRANCHE'.",
            "domaine": domaines["Résistance"],
        },
        {
            "nom": "Haute vitalité",
            "description": "Vous gagnez 2 PV max supplémentaires.",
            "domaine": domaines["Résistance"],
        },
        {
            "nom": "Force de la nature",
            "description": "Vous pouvez ignorer 1 empoisonnement, une fois par GN.",
            "domaine": domaines["Résistance"],
        },
        {
            "nom": "Dur à cuire",
            "description": "Vous gagnez 2 PV max supplémentaires.",
            "domaine": domaines["Résistance"],
        },
        {
            "nom": "Esprit solide",
            "description": "Vous gagnez de la SM supplémentaire.",
            "domaine": domaines["Résistance"],
        },
        {
            "nom": "Résistance à la douleur",
            "description": "Vous pouvez mentir à 1 question lors d’une séance de torture, même si le tortionnaire possède la compétence 'Rapide et brutal'.",
            "domaine": domaines["Résistance"],
        },
        {
            "nom": "Force mentale",
            "description": "Vous pouvez mentir à 1 question supplémentaire lors d’un torture. Du plus vous gagnez 1 résistance à la 'PEUR'.",
            "domaine": domaines["Résistance"],
        },
        {
            "nom": "Esprit implacable",
            "description": "Permet d’ignorer la première perte de SM. Une fois par GN.",
            "domaine": domaines["Résistance"],
        },
        {
            "nom": "Apaisement",
            "description": "Vous pouvez effectuer une séance de méditation pour vous-même, vous permettant d’ignorer un effet psychologique lié à la folie pendant 6h. Une fois par GN.",
            "domaine": domaines["Méditation"],
        },
        {
            "nom": "Thérapie de groupe",
            "description": "Vous pouvez mener une séance de méditation avec un groupe de 5 personnes maximum afin que vous puissiez ignorer l’effet psychologique lié à la folie pendant 6h. Une fois par GN.",
            "domaine": domaines["Méditation"],
        },
        {
            "nom": "Atténuation de folie",
            "description": "Permet d’ignorer totalement un niveau de folie pendant 6h. Il peut être effectué en 'Thérapie de groupe'. Une fois par GN.",
            "domaine": domaines["Méditation"],
        },
        {
            "nom": "Restructuration de l’esprit",
            "description": "L’efficacité de l’apaisement dure une journée complète. Une fois par GN.",
            "domaine": domaines["Méditation"],
        },
        {
            "nom": "Acception",
            "description": "Vous permet de récupérer de la SM supplémentaire lors d’un soin ou d’une folie. Une fois par GN.",
            "domaine": domaines["Méditation"],
        },
        {
            "nom": "Voir l’invisible",
            "description": "Permet de voir les êtres venant d’une autre dimension (ruban violet) mais entraîne la perte de 1 SM (une seule fois pendant le GN).",
            "domaine": domaines["Sensibilité d’esprit"],
        },
        {
            "nom": "Fluctuation",
            "description": "Votre orgasme ou PNJ vous préviendra que vous ressentez quelque chose d’étrange venant d’un endroit, une fois que vous y serez, vous aurez d’autres indications.",
            "domaine": domaines["Sensibilité d’esprit"],
        },
        {
            "nom": "Résistance aux flux",
            "description": "Permet de résister à la perte de SM venant d’un être d’une autre dimension.",
            "domaine": domaines["Sensibilité d’esprit"],
        },
        {
            "nom": "Déceler l’inconnu",
            "description": "Permet d’avoir des détails plus précis sur la fluctuation que vous avez ressentie une fois que vous y êtes.",
            "domaine": domaines["Sensibilité d’esprit"],
        },
        {
            "nom": "Stim",
            "description": "Permet au patient de récupérer un peu de SM contre une dépendance à vie et journalière de produit. Un livret sera fourni.",
            "domaine": domaines["Soin de folie"],
        },
        {
            "nom": "Inhalation d’oxygène pur",
            "description": "Permet au patient de récupérer de la SM, cependant ce dernier aura des effets d’agressivité aléatoire pendant une demi-journée. Utilisable une fois par jour.",
            "domaine": domaines["Soin de folie"],
        },
        {
            "nom": "Transfusion",
            "description": "Permet de transférer du sang muté à un patient. Ce dernier entraîne une paranoïa aiguë pendant 1 journée contre la récupération de SM. Utilisable une fois par jour.",
            "domaine": domaines["Soin de folie"],
        },
        {
            "nom": "La Leerolette",
            "description": "Permet de créer une solution dans des balles spéciales, cependant l’effet peut varier selon la balle. Permet de soigner tous ses points de SM en échange d’un effet négatif pouvant aller jusqu’à la mort.",
            "domaine": domaines["Soin de folie"],
        },
        {
            "nom": "Greffe de filtre à air",
            "description": "Permet de se faire greffer un filtre à air. Ce dernier offre une résistance aux effets respiratoires (poison, hallucinogène, etc.).",
            "domaine": domaines["Modification génétique"],
        },
        {
            "nom": "Greffe d’organes performants",
            "description": "Permet de gagner 2 PV max supplémentaires. Si obtenu dans d’autres mondes, il doit être greffé par un médicin (scène RP).",
            "domaine": domaines["Modification génétique"],
        },
        {
            "nom": "Nerf endormi",
            "description": "Permet de gagner l’immunité à la douleur pendant 1 sablier. Une fois par jour.",
            "domaine": domaines["Modification génétique"],
        },
        {
            "nom": "Cœur temporaire",
            "description": "Permet de récupérer 2 PV une fois en agonie. Une seule fois par GN. Effet RP représentant l’objet.",
            "domaine": domaines["Modification génétique"],
        },
        {
            "nom": "Fusil magnétique",
            "description": "Permet l’utilisation du fusil magnétique.",
            "domaine": domaines["Technologie avancée"],
        },
        {
            "nom": "Fabrication de munition magnétique",
            "description": "Permet de fabriquer des munitions magnétiques. Un livret vous sera fourni.",
            "domaine": domaines["Technologie avancée"],
        },
        {
            "nom": "Champ magnétique",
            "description": "Permet d’équiper une structure (hors village et camps) avec des tourelles de défense magnétiques pour se défendre face aux menaces terrestres et aériennes. Une fois par GN.",
            "domaine": domaines["Technologie avancée"],
        },
        {
            "nom": "Défense magnétique",
            "description": "Permet d’équiper une structure (hors village et camps) avec des tourelles de défense magnétiques pour se défendre face aux menaces terrestres et aériennes. Une fois par GN.",
            "domaine": domaines["Technologie avancée"],
        },
        {
            "nom": "Spécialiste du rationnement",
            "description": "Permet d’ignorer le coût en ration journalier d’une structure hors village.",
            "domaine": domaines["Développement Ypérité"],
        },
        {
            "nom": "Drone adaptatif",
            "description": "Permet la fabrication de drone d’un type (constructeur, explorateur, etc.). 2-5 drones fabriqués du même type, remplacent une troupe. Un drone est limité à son type.",
            "domaine": domaines["Développement Ypérité"],
        },
        {
            "nom": "Technologie de la cité volante",
            "description": "Permet le transport de ressources ou de troupes sans devoir créer de route (fabrication nécessaire pour avoir poste volant).",
            "domaine": domaines["Développement Ypérité"],
        },
        {
            "nom": "Avant poste volant",
            "description": "Permet de faire s’élever dans les airs un avant poste déjà créé. Celui-ci devient intouchable sauf par des armes à longues portées. Ne protège pas des créatures de PLAN.ET.",
            "domaine": domaines["Développement Ypérité"],
        },
        {
            "nom": "Explorer sans crever",
            "description": "Permet de réduire le temps d’une action d’exploration d’une heure.",
            "domaine": domaines["Développement Ypérité"],
        },
        {
            "nom": "Tactique furtive",
            "description": "Permet de réduire la dangerosité d’une action d’exploration d’un cran (hors drone).",
            "domaine": domaines["Développement Ypérité"],
        },
        {
            "nom": "Mine de magnétique",
            "description": "Permet de créer des mines magnétiques et de piéger une zone du Wargame. La troupe piégée ne peut pas se déplacer au tour de Wargame suivant.",
            "domaine": domaines["Développement Ypérité"],
        },
    ]

    # Création des compétences
    for comp in competences:
        Competence.objects.create(
            nom=comp["nom"],
            description=comp["description"],
            domaine=comp["domaine"]
        )

def reverse_func(apps, schema_editor):
    Competence = apps.get_model('app', 'Competence')
    Domaine = apps.get_model('app', 'Domaine')
    TypeCompetence = apps.get_model('app', 'TypeCompetence')

    # supprimer toutes les compétences (on suppose que cette migration place uniquement
    # les compétences qu'on va insérer ensuite — si tu as d'autres compétences existantes,
    # ajuste cette suppression)
    Competence.objects.all().delete()

    # supprimer domaines créés (tous)
    Domaine.objects.all().delete()

    # supprimer uniquement les types que nous avons créés
    TypeCompetence.objects.filter(
        nom__in=[
            "MARTIAL",
            "ADRESSE",
            "ARTISANAT",
            "CORPS ET ESPRIT",
            "YPERITE",
        ]
    ).delete()

class Migration(migrations.Migration):

    dependencies = [
        ('Core', '0003_remove_competence_groupe_competence_domaine_and_more'),  # adapte si nécessaire
    ]

    operations = [
        migrations.RunPython(create_competences, reverse_func),
    ]
