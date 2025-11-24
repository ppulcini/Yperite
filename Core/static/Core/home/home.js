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

  useEffect(function () {
    // Charge équipes + personnages
    Promise.all([
      fetch("/api/equipes/").then(function (r) { return r.json(); }),
      fetch("/api/personnages/").then(function (r) { return r.json(); })
    ]).then(function (results) {
      var equipesData = results[0];
      var membresData = results[1];

      // Normaliser équipes : id en string, children = []
      var equipes = equipesData.map(function (e, i) {
        return {
          id: String(e.id ? e.id : "team-" + i),
          name: e.name ? e.name : ("Equipe " + (i+1)),
          children: []
        };
      });

      // Construire map par id
      var teamMap = {};
      equipes.forEach(function (t) { teamMap[t.id] = t; });

      // Ajouter membres dans leur équipe (on suppose maintenant que django renvoie equipe_id)
      membresData.forEach(function (m) {
        var equipeId = (m.equipe_id !== undefined && m.equipe_id !== null) ? String(m.equipe_id) : (m.equipe ? String(m.equipe) : null);
        if (equipeId && teamMap[equipeId]) {
          teamMap[equipeId].children.push({
            id: "m-" + m.id,
            name: (m.prenom ? m.prenom : "Pers " + m.id)
          });
        }
      });

      // Préparer racine unique (évite superposition)
      var root = {
        id: "root",
        name: "Organisation",
        children: Object.keys(teamMap).map(function (k) { return teamMap[k]; })
      };

      // Liste de membres complète pour le panneau gauche / infos
      var membresList = membresData.map(function (m) {
        return {
          id: m.id,
          nom: m.nom,
          prenom: m.prenom,
          age: m.age,
          equipe: m.equipe,
          equipe_id: m.equipe_id,
          background: m.background,
          competences: m.competences || []
        };
      });

      setOrgRoot(root);
      setMembres(membresList);

    }).catch(function (err) {
      console.error("Erreur fetch équipes/membres :", err);
    });
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
                  {orgRoot ? <OrgChart data={orgRoot} /> : <div>Chargement...</div>}
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
  var data = props.data || { id: "root", name: "Organisation", children: [] };
  var positions = [];
  var teams = data.children || [];

  for (var ti = 0; ti < teams.length; ti++) {
    var team = teams[ti];
    positions.push({ id: team.id, name: team.name, depth: 0, xOffset: ti, isTeam: true });
    var children = team.children || [];
    for (var ci = 0; ci < children.length; ci++) {
      var member = children[ci];
      positions.push({ id: member.id, name: member.name, depth: ci + 1, xOffset: ti, isTeam: false });
    }
  }

  var boxH = 60;
  var vSpace = 20;
  var hSpace = 220;

  // dimension du SVG
  var columns = teams.length || 1;
  var rows = 1;
  positions.forEach(function(p){ if (p.depth + 1 > rows) rows = p.depth + 1; });

  var svgHeight = Math.max(200, rows * (boxH + vSpace) + 20);
  var totalWidth = (columns - 1) * hSpace + 140; // largeur totale du schéma (boxes + espaces)

  // dynamic center
  var containerWidth = props.containerWidth || 800; // fallback si non fourni
  var marginX = Math.max(100, (containerWidth - totalWidth) / 2);

  function findPos(id) {
    for (var i = 0; i < positions.length; i++) if (positions[i].id === id) return positions[i];
    return null;
  }

  return (
    <svg width={Math.max(totalWidth + marginX*2, containerWidth)} height={svgHeight} style={{ display: "block" }}>
      {/* lignes de connexion */}
      {positions.map(function (p) {
        if (!p.isTeam) return null;
        var teamPos = p;
        var teamChildren = teams[p.xOffset] && teams[p.xOffset].children ? teams[p.xOffset].children : [];
        return teamChildren.map(function (child) {
          var childPos = findPos(child.id);
          if (!childPos) return null;
          var teamX = teamPos.xOffset * hSpace + 70 + marginX;
          var teamY = teamPos.depth * (boxH + vSpace) + boxH;
          var childX = childPos.xOffset * hSpace + 70 + marginX;
          var childY = childPos.depth * (boxH + vSpace);
          var d = "M" + teamX + "," + teamY + " L" + teamX + "," + (teamY + 20) + " L" + childX + "," + (childY - 20) + " L" + childX + "," + childY;
          return <path key={teamPos.id + "-" + child.id} d={d} stroke="#fed33f" strokeWidth="2" fill="none" />;
        });
      })}

      {/* noeuds */}
      {positions.map(function (p) {
        var x = p.xOffset * hSpace + marginX;
        var y = p.depth * (boxH + vSpace);
        return <NodeBox key={p.id} x={x} y={y} name={p.name} width={140} height={48} fill={p.isTeam ? "#e8615a" : "#2c3e50"} stroke={p.isTeam ? "#fed33f" : "#e8615a"} />;
      })}
    </svg>
  );
}


// === render ===
render(<App />, document.getElementById("root"));
