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
    const type = c["domaine__type_competence_nom"] || "Autres";
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
        window.location.href = "/home/"
      } else {
        alert("Erreur lors de la création du personnage");
        console.log(data);
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
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
.domaines-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.5rem;
}

.domaine-block {
  display: flex;
  flex-direction: column;
  padding: 0.3rem;
  border-right: 1px solid #555;
  border-bottom: 1px solid #555;
  min-width: 0; /* Permet aux contenus de ne pas déborder */
  overflow: hidden;
}

.button {
  background-color: var(--colors-bg--300);
  color: var(--colors-tertiary--500);
  border: 1px solid var(--colors-tertiary--500);
  border-radius: 0.3rem;
  padding: 0.4rem 0.6rem;
  font-family: var(--fonts-secondary);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 0.25rem;
  white-space: nowrap; /* Empêche le texte de se casser */
  text-overflow: ellipsis; /* Si texte trop long, affiche "..." */
  overflow: hidden; /* Coupe le texte trop long */
}

/* Media queries */
@media (max-width: 1200px) {
  .domaines-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }
}

@media (max-width: 900px) {
  .domaines-grid {
    grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  }
}

@media (max-width: 600px) {
  .domaines-grid {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  }
  
  .button {
    font-size: 0.8rem;
    padding: 0.3rem 0.4rem;
  }
}

`;
document.head.appendChild(style);

render(<CreateCharacterPage />, document.getElementById("root"));
