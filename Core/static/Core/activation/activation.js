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

const IconFeedAdd = MakeIcon(
  <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
);

function CompetenceSelector({ selected, setSelected }) {
  const [competences, setCompetences] = useState([]);

  useEffect(() => {
    fetch("/api/competences/")
      .then(res => res.json())
      .then(data => setCompetences(data))
      .catch(err => console.error(err));
  }, []);

  const toggleCompetence = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(c => c !== id));
    } else if (selected.length < 8) {
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
                    const isDisabled = c["competence_mere__nom"] && 
                                       !competences.find(parent => parent.nom === c["competence_mere__nom"] && selected.includes(parent.id));
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => !isDisabled && toggleCompetence(c.id)}
                        className={`button ${selected.includes(c.id) ? "selected" : ""}`}
                        disabled={isDisabled}
                        style={isDisabled ? {opacity: 0.5, cursor: 'not-allowed'} : {}}
                      >
                        {c.nom}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <p className="counter">Sélectionnées : {selected.length} / 8</p>
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
  const [background, setBackground] = useState("");
  const [competencesSelected, setCompetencesSelected] = useState([]);
  const [classe, setClasse] = useState("");          // la valeur sélectionnée (ID)
  const [classesOptions, setClassesOptions] = useState([]); // les options à afficher

  useEffect(() => {
    fetch("/api/classe/")
      .then((res) => res.json())
      .then((data) => setClassesOptions(data))
      .catch((err) => console.error(err));
  }, []);

  // --- handleSubmit qui crée réellement le personnage ---
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const payload = {
      name,
      age,
      prenom,
      background,
      classe,
      competences: competencesSelected,
    };
  
    try {
      const res = await fetch("/api/personnage/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) {
        // La requête a échoué côté serveur (4xx / 5xx)
        const errorData = await res.text(); // ou res.json() si tu veux
        console.error("Erreur serveur:", errorData);
        alert("Erreur lors de la création du personnage");
        return;
      }
  
      const data = await res.json(); // Maintenant safe
      if (data.success) {
        alert(`Personnage créé ! ID: ${data.id}`);
        // Reset du formulaire
        setName("");
        setAge("");
        setPrenom("");
        setBackground("");
        setClasse("");
        setCompetencesSelected([]);
        window.location.href = "/home";
      } else {
        alert("Erreur lors de la création du personnage");
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
                      rows={4}
                    />
                  </div>

                  <div className="form-row">
                    <label htmlFor="classe">Equipe :</label>
                    <select
                      value={classe}
                      onInput={(e) => setClasse(e.target.value)}
                      required
                    >
                      <option value="">-- Choisir --</option>
                      {classesOptions.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option> // <-- value = id
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
                      className="button button--primary button--size-lg"
                    >
                      Créer
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

.button {
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

.button:hover:not(:disabled) {
  background-color: var(--colors-bg--400);
}

.button.selected {
  background-color: var(--colors-primary--500);
  color: white;
  border-color: var(--colors-primary--500);
}

.button:disabled {
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
  .button { font-size: 0.8rem; padding: 0.4rem; }
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

.button.button--primary {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.button.button--primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

/* Responsive pour petits écrans */
@media (max-width: 600px) {
  .domaines-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
  .button {
    font-size: 0.8rem;
    padding: 0.35rem 0.5rem;
  }
}

/* Bouton submit personnalisé */
.submit-row .button {
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
`;
document.head.appendChild(style);

render(<CreateCharacterPage />, document.getElementById("root"));
