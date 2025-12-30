/** @jsx h */
const { h, render } = preact;
const { useState, useEffect } = preactHooks;

function MakeIcon(svg) {
  return ({ className }) => (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      {svg}
    </svg>
  );
}

// === UI HELPERS (Pad, NavSection, ChannelNav, etc) ===
function NavSection(props) {
  return (
    <div className="nav-section">
      <div className="nav-section__header" style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        {props.renderTitle ? props.renderTitle({ className:"nav-section__title" }) : null}
        {props.action ? props.action : null}
      </div>
      <div className="nav-section__body">{props.children}</div>
    </div>
  );
}

function CompetenceSelector({ selected, setSelected }) {
  const [competences, setCompetences] = useState([]);

  useEffect(() => {
    fetch("/api/competences/")
      .then(res => res.json())
      .then(data => {
        setCompetences(data);
  
        // Ajouter automatiquement les compétences offertes
        const offered = data
          .filter(c => c.offer === true)
          .map(c => c.id);
  
        // Fusionne sans doublons
        setSelected(prev => Array.from(new Set([...prev, ...offered])));
      })
      .catch(err => console.error(err));
  }, []);
  
  const toggleCompetence = (id) => {
    // On récupère l'objet complet de la compétence
    const competence = competences.find(c => c.id === id);
    if (!competence) return;
  
    if (selected.includes(id)) {

      if (competence.offer === true) return;

      // --- on désélectionne la compétence ---
      let newSelected = selected.filter(cId => cId !== id);
  
      // --- si c'est une mère, on retire aussi toutes ses filles ---
      const childrenIds = competences
        .filter(c => c.competences_meres__id === id)
        .map(c => c.id);
  
      newSelected = newSelected.filter(cId => !childrenIds.includes(cId));
  
      setSelected(newSelected);
  
    } else if (selected.length -3 < 8) {
      setSelected([...selected, id]);
    } else {
      alert("Vous ne pouvez sélectionner que 8 compétences !");
    }
  };

  // Grouper par type puis par domaine
  const grouped = competences.reduce((acc, c) => {
    const type = c["domaine__type_competence__nom"] || "Autres";
    const domaine = c["domaine__nom"] || "Autres";
    if (!acc[type]) acc[type] = {};
    if (!acc[type][domaine]) acc[type][domaine] = [];
    acc[type][domaine].push(c);
    return acc;
  }, {});

  return (
<div className="competence-container">
  {Object.entries(grouped).map(([type, domaines]) => (
    <div key={type} className="type-competence">
      <h4>{type}</h4>
      <div className="domaines-grid">
        {Object.entries(domaines).map(([domaine, comps]) => (
          <div key={domaine} className="domaine-block">
            <strong>{domaine}</strong>
            <div className="competence-buttons">
              {comps.map(c => {

                // --- NOUVEAU : récupération de l’ID de la compétence mère ---
                const parentId = c["competences_meres__id"];
                const isOffered = c["offer"] === true;

                // Désactivée si :
                // - elle a une compétence mère
                // - et que cette mère n'est PAS dans selected
                const isDisabled = parentId && !selected.includes(parentId);
                return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => !isDisabled && !isOffered && toggleCompetence(c.id)}
                  className={`button1 ${
                    selected.includes(c.id) || isOffered ? "selected" : ""
                  }`}
                  disabled={isDisabled || isOffered}
                  style={(isDisabled || isOffered) ? { opacity: 0.6, cursor: "not-allowed" } : {}}
                >
                  {c.nom} {isOffered ? "⭐" : ""}
                </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  ))}
  <p className="counter">Sélectionnées : {selected.length -3 } / 8</p>
</div>
  );
}

// Composant pour sélectionner les compétences
function ClassesSelector({ selected, setSelected }) {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetch("/api/competences/")
      .then((res) => res.json())
      .then((data) => setClasses(data));
  }, []);

  const toggleCompetence = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((c) => c !== id));
    } else if (selected.length < 8) {
      setSelected([...selected, id]);
    } else {
      alert("Vous ne pouvez sélectionner que 8 compétences !");
    }
  };

  return (
    <div className="form-row">
      <label>Compétences (max 8) :</label>
      <div className="classe-list">
        {classes.map((c) => (
          <button
            type="button"
            key={c.id}
            onClick={() => toggleCompetence(c.id)}
            className={selected.includes(c.id) ? "selected" : ""}
          >
            {c.nom}
          </button>
        ))}
      </div>
    </div>
  );
}

function CreateCharacterPage() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [prenom, setPrenom] = useState("");
  const [niveau, setNiveau] = useState(1);
  const [background, setBackground] = useState(
    localStorage.getItem("backgroundTemp") || ""
  );
  const [competencesSelected, setCompetencesSelected] = useState([]);
  const [classe, setClasse] = useState("");          // la valeur sélectionnée (ID)
  const [classesOptions, setClassesOptions] = useState([]); // les options à afficher
  const [loading, setLoading] = useState(false);

  const editId = new URLSearchParams(window.location.search).get("edit");

// Génération du background
const generateBackground = async () => {
  setLoading(true);

  try {
    // On envoie la valeur actuelle du background
    const res = await fetch("/api/background/generate/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ background }),
    });

    // Récupération de la réponse
    const data = await res.json();

    if (data.background) {
      setBackground(data.background);                  // Mise à jour du state React
      localStorage.setItem("backgroundTemp", data.background); // Sauvegarde locale
    } else {
      console.error("Aucun background généré :", data);
      alert("Erreur lors de la génération du background");
    }
  } catch (err) {
    console.error("Erreur fetch background :", err);
    alert("Erreur réseau lors de la génération du background");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (!editId) return;

    fetch("/api/personnages/")  // ton endpoint renvoyant tous les persos
      .then(res => res.json())
      .then(list => {
        const perso = list.find(p => String(p.id) === String(editId));
        if (!perso) return;

        // Pré-remplissage du formulaire
        setName(perso.nom);
        setPrenom(perso.prenom);
        setAge(perso.age);
        setBackground(perso.background);
        setNiveau(perso.grade);
        setClasse(perso.equipe_id !== 0 ? perso.equipe_id : "");

        setCompetencesSelected(perso.competences.map(c => c.id));
      });
  }, []);


  useEffect(() => {
    fetch("/api/classe/")
      .then((res) => res.json())
      .then((data) => setClassesOptions(data))
      .catch((err) => console.error(err));
  }, []);

  // --- handleSubmit qui crée réellement le personnage ---
  const handleSubmit = async (e) => {
    localStorage.removeItem("backgroundTemp");
    e.preventDefault();
  
    const payload = {
      name,
      age,
      prenom,
      background,
      classe,
      niveau,
      competences: competencesSelected,
    };
  
    try {
      res = ""
      msg_val = ""
      if (editId != null){
        res = await fetch(`/api/personnage/update/${"?edit=" + editId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        msg_val = "Le personnage a bien été modifié"
      } else {
        res = await fetch(`/api/personnage/create/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        msg_val = "Le personnage a bien été crée"
      }

      if (!res.ok) {
        const errorData = await res.json();   // <-- lire le JSON
        alert("Erreur : " + (errorData.error || "Erreur inconnue"));
        return;
      }
  
      const data = await res.json(); // Maintenant safe
      console.log(data)
      if (data.success) {
        alert(msg_val);
        // Reset du formulaire
        setName("");
        setAge("");
        setPrenom("");
        setNiveau(1);
        setBackground("");
        setClasse("");
        setCompetencesSelected([]);
        window.location.href = "/home";
      } else {
        alert("Une erreur est survenue");
        console.log(data);
      }
    } catch (error) {
      alert("Erreur réseau : ", error);
    }
  };

  return (
    <div className="app-skeleton">
      <header className="app-header">
        <div className="app-header__anchor">
          <span className="app-header__anchor__text">Créer un personnage</span>
        </div>
        <NavSection
          renderTitle={function (p) { return <h2 {...p}></h2>; }}
          action={
            <a className="button button--primary button--size-lg" onClick={function(){ window.location.href="/home"; }}>
              Retour
            </a>
          }
        />
      </header>

      <div className="app-container">
        <div className="app-main">
          <div className="channel-feed">
            <div className="channel-feed__footer">
              <div className="pad">
                <br></br>
                <form className="character-form" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <label htmlFor="name">Nom :</label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onInput={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <label htmlFor="prenom">Prenom :</label>
                    <textarea
                      id="prenom"
                      value={prenom}
                      onInput={(e) => setPrenom(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="form-row">
                    <label htmlFor="age">Âge :</label>
                    <input
                      id="age"
                      type="number"
                      value={age}
                      onInput={(e) => setAge(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <label htmlFor="background">Background :</label>
                    <textarea
                      id="background"
                      value={background}
                      onInput={(e) => setBackground(e.target.value)}
                      rows={8}
                    />
                    <button
                      type="button"
                      className="button1 generate"
                      onClick={generateBackground}
                      disabled={loading}  // Désactive le bouton pendant la génération
                    >
                      {loading ? (
                        <div>
                          <span className="spinner"></span>
                          Génération en cours...
                        </div>
                      ) : (
                        "Manque d'inspiration ? Donne des infos dans le background et génère-en un via IA!"
                      )}
                    </button>
                  </div>

                  <div className="form-row">
                    <label htmlFor="niveau">Grade :</label>
                    <select
                      id="niveau"
                      value={niveau}
                      onInput={(e) => setNiveau(e.target.value)}
                      required
                    >
                      <option value="">-- Choisir --</option>
                      <option value="Soldat">Soldat</option>
                      <option value="Chef">Chef</option>
                      <option value="Commandant">Commandant</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <label htmlFor="classe">Équipe :</label>
                    <select
                      id="classe"
                      value={classe}
                      onInput={(e) => setClasse(e.target.value)}
                      required={niveau !== "Commandant"} // Obligatoire sauf pour Commandant
                      disabled={niveau === "Commandant"} // Désactivé si Commandant
                    >
                      <option value="">-- Choisir --</option>
                      {classesOptions.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <CompetenceSelector
                    selected={competencesSelected}
                    setSelected={setCompetencesSelected}
                  />

                  <div className="form-row submit-row">
                    <button
                      type="submit"
                      className="button1 button--secondary button--size-lg"
                    >
                      {editId ? "Modifier" : "Créer"}
                    </button>
                  </div>
                </form>
                <br></br>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- CSS ---
const style = document.createElement("style");
style.innerHTML = `
/* Conteneur global des compétences */
.competence-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1rem; /* marge autour du container */
}

.type-competence {
  border: 1px solid var(--colors-tertiary--500);
  border-radius: 8px;
  padding: 1rem;
  background-color: var(--colors-bg--300); /* garde les couleurs du site */
  margin-top: 0.5rem; /* marge haute */
  margin-bottom: 0.5rem; /* marge basse */
  margin-left: 0.5rem; /* marge gauche */
  margin-right: 0.5rem; /* marge droite */
}

.type-competence h4 {
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  color: var(--colors-tertiary--500); /* couleur des titres raccord */
}

.domaines-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0.8rem;
}

.domaine-block {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.domaine-block strong {
  font-size: 0.95rem;
  color: var(--colors-tertiary--500);
}

.competence-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.button1 {
  width: 100%;
  padding: 0.5rem;
  font-size: 0.85rem;
  border-radius: 6px;
  border: 1px solid var(--colors-tertiary--500);
  background-color: var(--colors-bg--300);
  color: var(--colors-tertiary--500);
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 auto;
}

.button1:hover:not(:disabled) {
  background-color: var(--colors-bg--400);
}

.button1.selected {
  background-color: var(--colors-secondary--500);
  color: white;
  border-color: var(--colors-secondary--500);
}

.button1:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.counter {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: var(--colors-tertiary--500);
}

@media(max-width: 600px) {
  .domaines-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
  .button1 { font-size: 0.8rem; padding: 0.4rem; }
}

/* Formulaire */
.character-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Ligne de formulaire */
.form-row {
  width: 80%;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin: 0 auto;
}

.form-row label {
  font-weight: 600;
  font-size: 0.95rem;
}

/* Inputs et textareas */
.form-row input,
.form-row select,
.form-row textarea {
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 0.9rem;
  width: 100%;
  box-sizing: border-box;
}

/* Bouton submit */
.submit-row {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
}

.button1.button--secondary {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.button1.button--secondary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

/* Responsive pour petits écrans */
@media (max-width: 600px) {
  .domaines-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
  .button1 {
    font-size: 0.8rem;
    padding: 0.35rem 0.5rem;
  }
}

/* Bouton submit personnalisé */
.submit-row .button1 {
  width: 15%;
  background-color: #007bff; /* couleur de fond */
  color: white;              /* texte blanc */
  border: 2px solid #0056b3; /* bordure plus marquée */
  border-radius: 8px;         /* coins arrondis */
  padding: 0.8rem 1.5rem;     /* padding plus large */
  font-size: 1rem;            /* texte un peu plus grand */
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.spinner {
  display: inline-block;          /* obligatoire pour que l'animation tourne */
  width: 16px;
  height: 16px;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-top-color: #007bff;      /* couleur visible sur fond clair */
  border-radius: 50%;
  margin-right: 8px;
  animation: spin 0.8s linear infinite;
  vertical-align: middle;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

`;
document.head.appendChild(style);

render(<CreateCharacterPage />, document.getElementById("root"));
