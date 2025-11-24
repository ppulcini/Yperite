/** @jsx h */
const { h, render } = preact;
const { useState, useEffect } = preactHooks;

/*
  home.js — affichage :
  - gauche : membres
  - centre : OrgChart (scrollable) + en dessous infos du membre sélectionné
  - droite : objectif/mission
*/

// === APP PRINCIPALE ===
function App() {
  const [membres, setMembres] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [orgRoot, setOrgRoot] = useState(null);

  useEffect(() => {
    // Charge équipes + personnages
    Promise.all([
      fetch("/api/equipes/").then(r => r.json()),
      fetch("/api/personnages/").then(r => r.json())
    ]).then(([equipesData, membresData]) => {
  
      // 1️⃣ Normaliser équipes : id en string, children = []
      const equipes = equipesData.map((e, i) => ({
        id: String(e.id != null ? e.id : "team-" + i),
        name: e.name != null ? e.name : `Equipe ${i + 1}`,
        children: []
      }));
  
      // 2️⃣ Construire map par id
      const teamMap = {};
      equipes.forEach(t => { teamMap[t.id] = t; });
  
      // 3️⃣ Ajouter membres dans leur équipe
      membresData.forEach(m => {
        const equipeId = m.equipe_id != null ? String(m.equipe_id) : (m.equipe ? String(m.equipe) : null);
  
        const memberObj = {
          id: "m-" + m.id,
          name: m.prenom || m.nom || "Pers " + m.id,
          grade: m.grade || m.Niveau || "Soldat",
          ...m // tu peux ajouter d'autres infos si besoin
        };
  
        if (equipeId && teamMap[equipeId]) {
          teamMap[equipeId].children.push(memberObj);
        }
      });
  
      // 4️⃣ Mettre le Chef en premier dans chaque équipe
      Object.values(teamMap).forEach(team => {
        if (team.children && team.children.length > 1) {
          const chefIndex = team.children.findIndex(m => m.grade === "Chef");
          if (chefIndex > 0) {
            const [chef] = team.children.splice(chefIndex, 1);
            team.children.unshift(chef);
          }
        }
      });
  
      // 5️⃣ Récupérer le Commandant (sans équipe)
      const commandant = membresData.find(m => m.grade === "Commandant" || m.Niveau === "Commandant");
      const rootChildren = Object.values(teamMap);

  
      // 6️⃣ Préparer racine unique
      const root = {
        id: "root",
        name: commandant ? commandant.prenom + " " + commandant.nom : "Commandement",
        children: rootChildren
      };
  
      // 7️⃣ Liste complète de membres pour le panneau gauche
      const membresList = membresData.map(m => ({
        id: m.id,
        nom: m.nom,
        prenom: m.prenom,
        age: m.age,
        equipe: m.equipe,
        equipe_id: m.equipe_id,
        background: m.background,
        competences: m.competences || [],
        grade: m.grade || m.Niveau
      }));
  
      setOrgRoot(root);
      setMembres(membresList);
  
    }).catch(err => console.error("Erreur fetch équipes/membres :", err));
  }, []);


  return (
    <div className="app-skeleton">
      <header className="app-header">
        <div className="app-header__anchor">
          <span className="app-header__anchor__text">
            Yperite /\ Bienvenu {window.DJANGO && window.DJANGO.Username ? window.DJANGO.Username : ""}
          </span>
        </div>
        <NavSection
          renderTitle={function (p) { return <h2 {...p}></h2>; }}
          action={
            <a className="button button--primary button--size-lg" onClick={function(){ window.location.href="/deconnexion"; }}>
              Deconnexion
            </a>
          }
        />
      </header>

      <div className="app-container">

        {/* Colonne gauche : liste membres */}
        <div className="app-a">
          <br/><br/><br/>
          <NavSection
            renderTitle={function(p){ return <h2 {...p}>Members</h2>; }}
            action={
              <a className="button button--primary button--size-lg" onClick={function(){ window.location.href="/activation"; }}>
                <IconFeedAdd className="button__icon" />
              </a>
            }
          >
            <ChannelNav
              channels={membres.map(function(m){ return { id: m.id, name: m.nom, prenom: m.prenom, meta: m }; })}
              activeChannel={selectedMember || {}}
              onChannelClick={function(member) { setSelectedMember(member.meta || member); }}
            />
          </NavSection>
        </div>

        {/* Colonne centrale : OrgChart + infos membre en dessous */}
        <div className="app-main">
          <div className="channel-feed">
            <div className="segment-topbar"></div>
            <div className="channel-feed__footer">

              {/* OrgChart container : scrollable quand large */}
              <Pad>
                <TextHeading3 $as="h4">Structure de l'équipe</TextHeading3>

                <div
                  className="orgchart-wrapper"
                  style={{
                    width: "100%",
                    height: "360px",
                    overflowX: "auto",
                    overflowY: "auto",
                    background: "transparent",
                    padding: 8,
                    boxSizing: "border-box"
                  }}
                >
                  {orgRoot ? <OrgChartWithLegend data={orgRoot} /> : <div>Chargement...</div>}
                </div>
              </Pad>

              <br />

              {/* Infos du membre sous l'orgchart */}
              <Pad>
                <NavSection renderTitle={function(p){ return <h2 {...p}>Infos du membre</h2>; }}>
                  { selectedMember ? (
                    <div>
                      <p><strong>Nom: </strong>{selectedMember.nom}</p>
                      <p><strong>Prénom: </strong>{selectedMember.prenom}</p>
                      <p><strong>Âge: </strong>{selectedMember.age}</p>
                      <p><strong>Équipe: </strong>{selectedMember.equipe}</p>
                      <p><strong>Background: </strong>{selectedMember.background}</p>
                      <p><strong>Compétences:</strong></p>
                      <ul>
                        {(selectedMember.competences || []).map(function(c){ return <li key={c.id}>{c.nom}</li>; })}
                      </ul>
                    </div>
                  ) : (
                    <p>Sélectionnez un membre pour voir ses informations.</p>
                  )}
                </NavSection>
              </Pad>

            </div>
          </div>
        </div>

        {/* Colonne droite : objectifs / mission */}
        <div className="app-b">
          <br/><br/><br/>
          <Pad>
            <TextHeading3 $as="h4">Operation classifié</TextHeading3>
            <TextParagraph1>
              En application avec les directives de la citadelle, cette opération a pour but de ramener des ressources vitales au bon fonctionnement de la ville de Yperite.
            </TextParagraph1>
            <br/><br/>
            <TextParagraph1>
              Objectifs :
              <ul>
                <li>cartographie du monde</li>
                <li>Recuperation des ressources</li>
                <li>Dialoguer avec les potentiel autochtone</li>
              </ul>
            </TextParagraph1>
          </Pad>
        </div>

      </div>
    </div>
  );
}


// === ICON ===
const IconFeedAdd = MakeIcon(
  <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
);


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

function ChannelNav(props) {
  var channels = props.channels || [];
  var active = props.activeChannel || {};
  var onClick = props.onChannelClick || function(){};
  return (
    <ul className="nav">
      {channels.map(function(channel){
        return (
          <li key={channel.id} className="nav__item">
            <a href="#" className={"nav__link " + (active.id === channel.id ? "nav__link--active" : "")}
               onClick={function(e){ e.preventDefault(); onClick(channel); }}>
              <ChannelLink name={channel.name + " " + channel.prenom} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function ChannelLink(props) {
  return (
    <span className="channel-link">
      <span className="channel-link__icon">#</span>
      <span className="channel-link__element">{props.name}</span>
    </span>
  );
}

function Badge(props) { return <span className="badge">{props.children}</span>; }

function Pad(props) {
  return (
    <div className="pad" style={{ marginBottom: 8 }}>
      <div className="pad__body">{props.children}</div>
    </div>
  );
}

function MakeTextBase(classNameDefault, $asDefault) {
  return function (props) {
    var As = props.$as || $asDefault;
    var cls = classNameDefault + (props.className ? " " + props.className : "");
    return <As className={cls}>{props.children}</As>;
  };
}

const TextHeading3 = MakeTextBase("text-heading3", "h3");
const TextParagraph1 = MakeTextBase("text-paragraph1", "p");

function MakeIcon(svg) {
  return function IconComp(props) {
    return (
      <svg className={props.className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ width: 18, height: 18 }}>
        {svg}
      </svg>
    );
  };
}

function ColorLegend() {
  const legendItems = [
    { color: "#fed33f", label: "Commandement / Commandant" },
    { color: "#e8615a", label: "Équipe" },
    { color: "#2ecc71", label: "Chef d'équipe" },
    { color: "#2c3e50", label: "Soldat" }
  ];

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      marginLeft: "20px",
      backgroundColor: "transparent" // ← fond transparent
    }}>
      {legendItems.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div style={{
            width: "20px",
            height: "20px",
            backgroundColor: item.color,
            borderRadius: "4px",
            border: "1px solid #000"
          }}></div>
          <span style={{ fontSize: "14px" }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function OrgChartWithLegend({ data, containerWidth = 800 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      {/* Conteneur scroll horizontal */}
      <div
        style={{
          overflowX: "auto",
          overflowY: "hidden",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",   // horizontal
            alignItems: "flex-start",
            gap: "20px",
            minWidth: containerWidth,
          }}
        >
          {/* Légende à gauche */}
          <div style={{ flexShrink: 0 }}>
            <ColorLegend />
          </div>

          {/* Diagramme */}
          <div style={{ flexShrink: 0 }}>
            <OrgChart data={data} containerWidth={containerWidth} />
          </div>
        </div>
      </div>
    </div>
  );
}

// === ORGCHART SIMPLE (colonnes d'équipes) ===
function NodeBox({ x, y, name, width, height, fill, stroke }) {
  const textX = x + width / 6; // centre horizontal exact
  const textY = y + height / 2; // centre vertical

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={6} ry={6} fill={fill} stroke={stroke} strokeWidth="2" />
      <text
        x={textX}
        y={textY}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fill: "#fff",
          fontFamily: "VT323, monospace",
          fontSize: "22px",
          fontWeight: "700"
        }}
      >
        {name}
      </text>
    </g>
  );
}

function OrgChart(props) {
  var data = props.data || { id: "root", name: "Commandement", children: [] };
  var positions = [];
  var teams = data.children || [];

  // Hauteurs / espacements
  var boxH = 60;
  var vSpace = 30;
  var hSpace = 220;
  console.log(JSON.stringify(teams, null, 2));
  // Chercher le membre qui est Commandant
  var teams = props.data.children || [];
  var commandant = teams
    .flatMap(team => team.children || [])
    .find(member => member.grade === "Commandant");

  // Ajouter la racine "Commandement"
  positions.push({
    id: data.id,
    name: commandant ? `Commandement\n${commandant.name}` : data.name,
    depth: 0, 
    xOffset: (teams.length - 1) / 2, // centre la racine au-dessus des équipes
    isRoot: true
  });

  // Ajouter les équipes et leurs membres
  for (var ti = 0; ti < teams.length; ti++) {
    var team = teams[ti];

    // Noeud équipe (niveau 0)
    positions.push({
      id: team.id,
      name: team.name,
      depth: 1,
      xOffset: ti,
      isTeam: true
    });

    // Membres (niveau 1 et plus)
    var children = team.children || [];
    for (var ci = 0; ci < children.length; ci++) {
      var member = children[ci];
      positions.push({
        id: member.id,
        name: member.name + " - " + member.prenom,
        grade: member.grade,
        depth: ci + 2,
        xOffset: ti,
        isTeam: false
      });
    }
  }

  // Calcul Taille SVG
  var rows = 2;
  positions.forEach(function(p) {
    if (p.depth + 1 > rows) rows = p.depth + 1;
  });

  var svgHeight = Math.max(300, rows * (boxH + vSpace) + 50);
  var columns = teams.length || 1;

  // largeur min du diagramme
  var totalWidth = (columns - 1) * hSpace + 200;

  var containerWidth = props.containerWidth || 800;
  var marginX = Math.max(50, (containerWidth - totalWidth) / 2);

  function findPos(id) {
    return positions.find(p => p.id === id);
  }

  return (
    <svg
      width={Math.max(totalWidth + marginX * 2, containerWidth)}
      height={svgHeight}
      style={{ display: "block" }}
    >
      {/* ======== LIGNES Commandement → Équipes ======== */}
      {positions.filter(p => p.isTeam).map(function(teamPos) {
        var rootPos = positions.find(p => p.isRoot);
        if (!rootPos) return null;

        var rootX = rootPos.xOffset * hSpace + 70 + marginX;
        var rootY = (rootPos.depth * (boxH + vSpace)) + boxH;

        var teamX = teamPos.xOffset * hSpace + 70 + marginX;
        var teamY = (teamPos.depth * (boxH + vSpace));

        var d = "M" + rootX + "," + rootY
          + " L" + rootX + "," + (rootY + 20)
          + " L" + teamX + "," + (teamY - 20)
          + " L" + teamX + "," + teamY;

        return (
          <path
            key={"root-" + teamPos.id}
            d={d}
            stroke="#fed33f"
            strokeWidth="2"
            fill="none"
          />
        );
      })}

      {/* ======== LIGNES Équipe → Membres ======== */}
      {positions.filter(p => p.isTeam).map(function(teamPos) {
        var children = teams[teamPos.xOffset].children || [];

        return children.map(function(child) {
          var childPos = findPos(child.id);
          if (!childPos) return null;

          var teamX = teamPos.xOffset * hSpace + 70 + marginX;
          var teamY = teamPos.depth * (boxH + vSpace) + boxH;

          var childX = childPos.xOffset * hSpace + 70 + marginX;
          var childY = childPos.depth * (boxH + vSpace);

          var d = "M" + teamX + "," + teamY
            + " L" + teamX + "," + (teamY + 20)
            + " L" + childX + "," + (childY - 20)
            + " L" + childX + "," + childY;

          return (
            <path
              key={teamPos.id + "-" + child.id}
              d={d}
              stroke="#fed33f"
              strokeWidth="2"
              fill="none"
            />
          );
        });
      })}

      {/* ======== NŒUDS ======== */}
      {positions.map(function(p) {
        var x = p.xOffset * hSpace + marginX;
        var y = p.depth * (boxH + vSpace);

        // Déterminer la couleur selon le type / grade
        let fill, stroke;
        console.log(p); 
        if (p.isRoot) {
          fill = "#fed33f";   // Commandement
          stroke = "#ffffff";
        } else if (p.isTeam) {
          fill = "#e8615a";   // Équipe
          stroke = "#fed33f";
        } else {
          // Membre
          if (p.grade === "Chef") {
            fill = "#2ecc71"; // vert pour les Chefs
            stroke = "#27ae60";
          } else {
            fill = "#2c3e50"; // Soldat
            stroke = "#e8615a";
          }
        }

        return (
          <NodeBox
            key={p.id}
            x={x}
            y={y}
            name={p.name}
            width={180}
            height={60}
            fill={fill}
            stroke={stroke}
          />
        );
      })}
    </svg>
  );
}


// === render ===
render(<App />, document.getElementById("root"));
