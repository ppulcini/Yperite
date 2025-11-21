/** @jsx h */
const { h, render } = preact;

function App() {
  return (
    <div className="app-skeleton">
      <header className="app-header">
        <div className="app-header__anchor">
          <span className="app-header__anchor__text">Yperite /\ Bienvenu {window.DJANGO.Username}</span>
        </div>
        <NavSection
          renderTitle={(props) => <h2 {...props}></h2>}
          action={
            <a className="button button--primary button--size-lg"
              onClick={() => (window.location.href = "/deconnexion")}>
                Deconnexion
              </a>
          }
        >
        </NavSection>
      </header>
      <div className="app-container">
        <div className="app-a">
        <br/><br/><br/>
        <NavSection
          renderTitle={(props) => <h2 {...props}>Members</h2>}
          action={
            <a
              className="button button--primary button--size-lg"
              onClick={() => (window.location.href = "/activation")}
            >
              <IconFeedAdd className="button__icon" />
            </a>
          }
        >
          <ChannelNav
            activeChannel={{ id: "", name: "Watson" }}
            channels={FIXTURES.Equipes}
          />
        </NavSection>
        </div>
        <div className="app-main">
          <div className="channel-feed">
            <div className="segment-topbar">
            </div>
            <div className="channel-feed__footer">
            <Pad>
              <TextHeading3 $as="h4">Structure de l'équipe</TextHeading3>
              <div
                className="orgchart-container"
                style={{
                  width: "100%",
                  height: "400px",
                  overflowX: "auto",
                  overflowY: "hidden",
                  background: "transparent",  // pas de fond blanc
                  padding: 0                 // supprime padding autour
                }}
              >
                <OrgChart data={teamData} />
              </div>
            </Pad>
            </div>
          </div>
        </div>
        <div className="app-b">
          <br/><br/><br/>
          <Pad>
            <TextHeading3 $as="h4">Operation classifié</TextHeading3>
            <TextParagraph1>
              En application avec les directives de la citadelle,
              cette opération a pour but d'e ramener des ressources vitale au bon 
              fonctionnement de la ville de Yperite'.
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

const IconFeedAdd = MakeIcon(
  <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
);

function NavSection({ children, renderTitle, action }) {
  return (
    <div className="nav-section">
      <div
        className="nav-section__header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between", // titre à gauche, bouton à droite
        }}
      >
        {renderTitle({ className: "nav-section__title" })}
        {action && action} {/* bouton ici */}
      </div>
      <div className="nav-section__body">{children}</div>
    </div>
  );
}

function ChannelNav({ activeChannel = null, channels = [] }) {
  return (
    <ul className="nav">
      {channels.map((channel) => (
        <li className="nav__item">
          <a
            className={`nav__link ${
              activeChannel && activeChannel.id === channel.id
                ? "nav__link--active"
                : ""
            }`}
            href="#"
          >
            <ChannelLink {...channel}>{name}</ChannelLink>
          </a>
        </li>
      ))}
    </ul>
  );
}

function ConversationNav({ activeConversation = null, conversations = [] }) {
  return (
    <ul className="nav">
      {conversations.map((convo) => (
        <li className="nav__item">
          <a
            className={`nav__link ${
              activeConversation && activeConversation.id === convo.id
                ? "nav__link--active"
                : ""
            }`}
            href="#"
          >
            <ConversationLink conversation={convo} />
          </a>
        </li>
      ))}
    </ul>
  );
}

function ChannelLink({ icon, name, unread }) {
  return (
    <span
      className={`channel-link ${
        unread > 0 ? "conversation-link--unread" : ""
      }`}
    >
      <span className="channel-link__icon">#</span>
      <span className="channel-link__element">{name}</span>

      {unread > 0 && (
        <span className="channel-link__element">
          <Badge>{unread}</Badge>
        </span>
      )}
    </span>
  );
}

function ConversationLink({ conversation }) {
  return (
    <span
      className={`conversation-link ${
        conversation.isOnline ? "conversation-link--online" : ""
      } ${conversation.unread > 0 ? "conversation-link--unread" : ""}`}
    >
      {conversation.members && conversation.members.length > 2 ? (
        <span className="conversation-link__icon" />
      ) : (
        <span className="conversation-link__icon" />
      )}

      <span className="conversation-link__element">{conversation.name}</span>

      {conversation.unread > 0 && (
        <span className="conversation-link__element">
          <Badge>{conversation.unread}</Badge>
        </span>
      )}
    </span>
  );
}

function Badge({ children }) {
  return <span className="badge">{children}</span>;
}

function Button({
  children,
  type = "button",
  size = "default",
  variant = "default"
}) {
  return (
    <button
      className={`button ${variant ? `button--${variant}` : ""} ${
        size ? `button--size-${size}` : ""
      }`}
      type={type}
    >
      <span className="button__content">{children}</span>
    </button>
  );
}

function Pad({ children, renderCap = null }) {
  return (
    <div className="pad">
      <div className="pad__body">{children}</div>
    </div>
  );
}

function NavItem({ navItem }) {
  return (
    <li className="nav__item">
      <a
        className={`nav__link ${navItem.isActive ? "nav__link--active" : ""}`}
        href="#"
      >
        <span className="nav__link__element">{navItem.text}</span>
        {navItem.notificationCount > 0 && (
          <span className="nav__link__element">
            <Badge>{navItem.notificationCount}</Badge>
          </span>
        )}
      </a>
    </li>
  );
}

function MakeTextBase(classNameDefault, $asDefault) {
  return ({ $as = null, children, className }) => {
    const AsComponent = $as || $asDefault;

    return (
      <AsComponent className={`${classNameDefault} ${className}`}>
        {children}
      </AsComponent>
    );
  };
}

const TextHeading1 = MakeTextBase("text-heading1", "h1");
const TextHeading2 = MakeTextBase("text-heading2", "h2");
const TextHeading3 = MakeTextBase("text-heading3", "h3");
const TextHeading4 = MakeTextBase("text-heading4", "h4");
const TextHeading5 = MakeTextBase("text-heading5", "h5");
const TextHeading6 = MakeTextBase("text-heading6", "h6");
const TextParagraph1 = MakeTextBase("text-paragraph1", "p");
const TextOverline = MakeTextBase("segment-topbar__overline", "span");

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

const FIXTURES = {
  Equipes: [
    { id: "5ba5", name: "Paul",isPrivate: true},
    { id: "4f22", name: "Kéké",isPrivate: true},
    { id: "fee9", name: "PNJ-1" },
    { id: "a0cc", name: "PNJ-2" },
    { id: "dee3", name: "SQUAD",}
  ],
};

function NodeBox({ x, y, name }) {
  const textRef = preactHooks.useRef(null);
  const [bbox, setBbox] = preactHooks.useState(null);

  preactHooks.useLayoutEffect(() => {
    if (textRef.current) {
      setBbox(textRef.current.getBBox());
    }
  }, []);

  const paddingX = 12;
  const paddingY = 8;

  const width  = bbox ? bbox.width + paddingX * 2 : 100;
  const height = bbox ? bbox.height + paddingY * 2 : 60;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="var(--colors-bg--300)"
        stroke="var(--colors-tertiary--500)"
        strokeWidth="1"
        rx="3"
        ry="3"
      />

      <text
        ref={textRef}
        className="app-header__anchor__text"
        filter="url(#text-glow)"
        x={x + paddingX}
        y={y + height / 2}
        dominantBaseline="middle"
        textAnchor="start"
        style={{
          fontFamily: "var(--fonts-secondary)",
          fontSize: "1.25rem",
          letterSpacing: "0.035rem",
          textTransform: "uppercase",
          fill: "var(--colors-tertiary--500)"
        }}
      >
        {name}
      </text>
    </g>
  );
}

function OrgChart({ data }) {
  const boxHeight = 60;
  const verticalSpacing = 10;
  const horizontalSpacing = 20;
  const positions = [];

  // Calcul des positions (identique à ton code actuel)
  const computePositions = (node, depth = 0, xOffset = 0) => {
    if (!node.children || node.children.length === 0) {
      const nodePos = { ...node, depth, xOffset, width: 1 };
      positions.push(nodePos);
      return nodePos;
    }

    let currentX = xOffset;
    const childPositions = node.children.map((child) => {
      const childNode = computePositions(child, depth + 1, currentX);
      currentX += childNode.width;
      return childNode;
    });

    const subtreeWidth = childPositions.reduce((sum, c) => sum + c.width, 0);
    const firstChild = childPositions[0];
    const lastChild = childPositions[childPositions.length - 1];
    const parentX = (firstChild.xOffset + lastChild.xOffset) / 2;

    const nodePos = { ...node, depth, xOffset: parentX, width: subtreeWidth };
    positions.push(nodePos);
    return nodePos;
  };

  let rootX = 0;
  data.forEach((node) => {
    const rootNode = computePositions(node, 0, rootX);
    rootX += rootNode.width;
  });

  // Calcul de la largeur maximale pour le SVG
  const svgWidth =
    positions.reduce(
      (max, node) => Math.max(max, node.xOffset * (100 + horizontalSpacing) + 100),
      0
    );

  return (
    <svg width={svgWidth+10} height={positions.length * (boxHeight + verticalSpacing)}>
      {/* Lignes */}
      {positions.map((node) =>
        node.children
          ? node.children.map((child) => {
              const childNode = positions.find((p) => p.id === child.id);
              return (
                <line
                  key={`${node.id}-${childNode.id}`}
                  x1={node.xOffset * (100 + horizontalSpacing) + 50}
                  y1={node.depth * (boxHeight + verticalSpacing) + boxHeight}
                  x2={childNode.xOffset * (100 + horizontalSpacing) + 50}
                  y2={childNode.depth * (boxHeight + verticalSpacing)}
                  stroke="#888"
                  strokeWidth="2"
                />
              );
            })
          : null
      )}

      {/* Boîtes NodeBox */}
      {positions.map((node) => {
        const x = node.xOffset * (100 + horizontalSpacing);
        const y = node.depth * (boxHeight + verticalSpacing);
        return <NodeBox key={node.id} x={x} y={y} name={node.name} />;
      })}
    </svg>
  );
}

const teamData = [
  {
    id: "root",
    name: "Chef",
    children: [
      {
        id: "alpha",
        name: "Equipe Alpha",
        children: [
          { id: "paul", name: "Paul", children: [{ id: "pnj9", name: "PNJ-9" }, { id: "pnj10", name: "PNJ-10" }] },
          { id: "keke", name: "Kéké" },
          { id: "jean", name: "Jean" },
          { id: "charle", name: "Charle" },
          { id: "pnj1", name: "PNJ-1" },
          { id: "pnj2", name: "PNJ-2" }
        ]
      },
      {
        id: "omega",
        name: "Equipe Omega",
        children: [
          { id: "pnj3", name: "PNJ-3" },
          { id: "pnj4", name: "PNJ-4" }
        ]
      },
      {
        id: "bita",
        name: "Equipe bita",
        children: [
          { id: "pnj5", name: "PNJ-5" },
          { id: "pnj6", name: "PNJ-6" }
        ]
      }
    ]
  }
];

render(<App />, document.getElementById("root"));
