// ── Portfolio data ──
// Contenu issu du dossier de compétences MMI 2e année.
//
// Chaque projet expose :
//  • description    : l'analyse réflexive (le « Je » : ce que j'ai fait)
//  • critique       : la prise de recul (points forts / faibles / alternatives)
//  • acs / ces      : les Apprentissages Critiques et Composantes Essentielles
//                     validés : { code, label }. code:'' => badge « à préciser ».
//  • justification  : POURQUOI ces AC/CE ont été choisis pour ce projet
//  • proof          : légende de la « preuve » (l'image-trace à fournir)
//  • image          : visuel hero 720×405. Vide => placeholder auto.
//  • proofImage     : visuel de la preuve. Vide => placeholder « preuve » auto.

export const SKILLS = [
  {
    slug: 'comprendre',
    label: 'COMPRENDRE',
    subtitle: 'les écosystèmes numériques',
    description: 'Les écosystèmes, les besoins des utilisateurs et les dispositifs de communication numérique',
    projects: [
      {
        title: 'À compléter',
        context: '',
        year: '',
        role: '',
        description: 'Cette compétence reste à documenter : ajoute ici tes situations (veille, analyse d\'écosystème, étude de cas) avec leurs AC/CE.',
        critique: '',
        acs: [{ code: '', label: 'À préciser (réf. Comprendre)' }],
        ces: [{ code: '', label: 'À préciser' }],
        justification: 'À rédiger : explique pourquoi cet AC et cette CE correspondent au projet.',
        proof: 'À définir : capture / document servant de preuve.',
        tags: ['À compléter'],
        links: [],
        image: '',
        proofImage: '',
      },
    ],
  },

  {
    slug: 'concevoir',
    label: 'CONCEVOIR',
    subtitle: 'pour le web et les médias numériques',
    description: 'Concevoir un produit numérique en réponse à un besoin, de l\'UX à l\'architecture de l\'information.',
    projects: [
      {
        title: 'KultApp',
        context: 'Intra-muros',
        year: '2025',
        role: 'UI / UX Designer',
        description: 'J\'ai imaginé et maquetté l\'interface d\'une application mobile dédiée à la culture (KultApp), centrée sur l\'expérience utilisateur et la clarté du parcours. À partir du besoin identifié (faciliter la découverte d\'événements culturels), j\'ai conçu les wireframes et maquettes interactives sur Figma autour de deux fonctionnalités clés : un flux de « posts culturels » et une carte interactive. J\'ai travaillé le placement des call-to-action et la hiérarchie visuelle pour qu\'on puisse publier ou trouver un événement en moins de trois clics.',
        critique: 'Mon point fort a été un design intuitif et moderne, inspiré des standards des apps sociales. Avec le recul, j\'ai privilégié l\'esthétique (UI) au détriment de l\'accessibilité : certains contrastes et tailles de typo sur la carte pourraient gêner des utilisateurs malvoyants. Si je reconcevais l\'app aujourd\'hui, j\'intégrerais des tests de contraste (WCAG) dès la phase de wireframing.',
        acs: [
          { code: 'AC22.01', label: 'Concevoir un produit ou un service et sa communication en réponse à un besoin' },
        ],
        ces: [
          { code: 'CE2.02', label: 'En tenant compte des critères de l\'expérience utilisateur (UX) et de l\'accessibilité' },
        ],
        justification: 'J\'ai retenu l\'AC22.01 car j\'ai conçu de A à Z une interface répondant à un besoin réel et identifié (découvrir des événements culturels). La CE2.02 s\'impose car toute ma démarche est partie de l\'UX (parcours en moins de 3 clics), et c\'est précisément sur le volet accessibilité de cette CE que porte ma prise de recul, ce qui montre que je situe mon travail par rapport à l\'exigence complète.',
        proof: 'Capture de l\'espace Figma montrant les maquettes de KultApp, en particulier l\'écran de la carte interactive.',
        tags: ['Figma', 'UI/UX', 'Wireframing', 'Mobile'],
        links: [],
        image: '',
        proofImage: '',
      },
    ],
  },

  {
    slug: 'exprimer',
    label: 'EXPRIMER',
    subtitle: 'une intention de communication',
    description: 'Production audiovisuelle : animation, design sonore et effets spéciaux au service du sens.',
    projects: [
      {
        title: 'Générique Animé Kill Bill',
        context: 'Intra-muros (SAÉ 302)',
        year: '2025',
        role: 'Motion Designer',
        description: 'La réalisation de ce générique animé pour Kill Bill dans le cadre de la SAÉ 302 a marqué un tournant dans mon parcours. Ayant échoué l\'année précédente sur un exercice de dessin sous Animate, j\'ai transformé cette lacune en opportunité en exploitant pleinement After Effects. J\'ai élaboré un moodboard sur Canva, puis utilisé le plugin Mocha Pro pour réaliser un tracking et un détourage rotoscopique minutieux des personnages du film. J\'ai ensuite transformé ces séquences en aplats de couleurs unies (silhouettes noires) pour répondre à la contrainte de produire du sens et d\'installer un univers sans utiliser directement les images brutes du film.',
        critique: 'Si la note finale n\'a pas été extraordinaire, l\'évaluation de ma propre progression l\'est. Mon point fort a été d\'identifier ma faiblesse (le dessin) et de trouver une alternative technique professionnelle (le tracking Mocha Pro) pour livrer un rendu esthétique cohérent. Ce projet m\'a permis de vaincre mon appréhension initiale d\'After Effects et d\'en maîtriser la logique nodale et les plugins avancés, au point d\'en faire aujourd\'hui mon outil de prédilection au sein de la suite Adobe.',
        acs: [
          { code: 'AC23.06', label: 'Élaborer et produire des animations, des designs sonores, des effets spéciaux...' },
        ],
        ces: [
          { code: 'CE3.01', label: 'En veillant à la qualité esthétique des créations et en la justifiant par des références culturelles et artistiques' },
        ],
        justification: 'J\'ai retenu l\'AC23.06 car ce projet repose sur la production d\'effets spéciaux (tracking et rotoscopie sous Mocha Pro) pour élaborer une métaphore visuelle (la silhouette en aplat noir). La CE3.01 s\'impose car mes choix techniques visaient précisément à contourner une lacune en dessin pour garantir un rendu esthétique exigeant et professionnel.',
        proof: 'Un visuel « Avant / Après » : d\'un côté, une capture de l\'interface After Effects montrant le maillage de tracking Mocha Pro sur un personnage du film ; de l\'autre, le rendu final de cette même scène avec la silhouette en aplat noir.',
        tags: ['After Effects', 'Mocha Pro', 'Rotoscopie', 'Motion Design'],
        links: [],
        image: 'img/cascade/3/cascade_03.png',
        proofImage: '',
      },
    ],
  },

  {
    slug: 'developper',
    label: 'DÉVELOPPER',
    subtitle: 'pour le web et les médias numériques',
    description: 'Développement back-end et front-end, du refactoring orienté objet aux interfaces 3D temps réel.',
    projects: [
      {
        title: 'SAÉ Phaser',
        context: 'Intra-muros',
        year: '2025',
        role: 'Développeur back-end',
        description: 'J\'ai conçu et optimisé l\'architecture back-end orientée objet d\'un jeu vidéo par navigateur, en refactorisant le code pour passer d\'une structure séquentielle lourde à un modèle objet fluide. Ayant déjà abordé ce projet l\'année précédente, j\'ai analysé la dette technique de mon ancien code pour identifier les surcharges de requêtes et les instanciations inutiles. J\'ai réécrit les classes principales en PHP, mis en place des méthodes d\'encapsulation strictes pour sécuriser les données du joueur, et optimisé les traitements de requêtes entre le serveur et l\'affichage front-end.',
        critique: 'Mon point fort a été d\'objectiver mes propres erreurs passées en restructurant le code proprement en PHP objet. En écoutant les retours des autres groupes lors des phases de test, j\'ai identifié des faiblesses : des interfaces (menu « Power-up ») restées à l\'état de prototypes fonctionnels sans habillage, et une rejouabilité limitée par des cartes statiques. Si c\'était à refaire, j\'implémenterais un algorithme de génération procédurale pour des donjons aléatoires.',
        acs: [
          { code: 'AC24.04', label: 'Modéliser les traitements d\'une application Web' },
          { code: 'AC24.02', label: 'Mettre en place ou développer un back office' },
        ],
        ces: [
          { code: 'CE4.03', label: 'En produisant du code fonctionnel, sobre et réutilisable' },
          { code: 'CE4.05', label: 'En veillant à la sécurité des systèmes et des données' },
        ],
        justification: 'J\'ai retenu l\'AC24.04 car le cœur du projet était de repenser et modéliser les traitements back-end : refactoriser une structure séquentielle lourde en un modèle objet optimisé. L\'AC24.02 correspond au développement de la logique serveur du jeu. La CE4.03 décrit exactement ma démarche de refactoring (code sobre et réutilisable), et la CE4.05 la mise en place d\'une encapsulation stricte pour sécuriser les données du joueur.',
        proof: 'Capture du code PHP objet refactorisé (classes encapsulées) et/ou de l\'analyse Xdebug des temps d\'exécution avant/après optimisation.',
        tags: ['PHP', 'POO', 'VS Code', 'Xdebug'],
        links: [],
        image: 'img/cascade/4/cascade_04.png',
        proofImage: '',
      },
    ],
  },

  {
    slug: 'entreprendre',
    label: 'ENTREPRENDRE',
    subtitle: 'dans le secteur du numérique',
    description: 'Gestion de projet, méthodes agiles et collaboration entre parties prenantes.',
    projects: [
      {
        title: 'Projet Chandeleur : Scrum',
        context: 'Intra-muros',
        year: '2025',
        role: 'Scrum Master & responsable communication',
        description: 'J\'ai officié comme Scrum Master et responsable de la communication. J\'ai piloté la planification des sprints, défini la vision produit (Product Goal) et coordonné l\'équipe pour concevoir une stratégie événementielle intergénérationnelle pour la mairie de Béziers. J\'ai découpé les objectifs en sprints, rédigé les User Stories pour traduire les besoins des parties prenantes (mairie, familles, journalistes locaux), et administré le tableau Jira pour attribuer les tâches (visuels print, scripts vidéo, encarts presse) et suivre les échéances.',
        critique: 'Ma principale difficulté en tant que leader a été de maintenir la rigueur méthodologique dans la durée. Après un excellent Sprint 1, l\'assiduité sur Jira a chuté et j\'ai manqué de fermeté dans mon rôle. La prochaine fois, j\'instaurerais des Daily Stand-ups quotidiens de 5 minutes pour responsabiliser chacun. Par rapport à un échec de cohésion l\'année précédente, j\'ai cette fois mené le projet à son terme, mais je sais désormais qu\'un bon Scrum Master doit recadrer dès les premiers signes de relâchement.',
        acs: [
          { code: 'AC25.01', label: 'Gérer un projet avec une méthode d\'amélioration continue (ex. méthode agile)' },
        ],
        ces: [
          { code: 'CE5.02', label: 'En favorisant la collaboration entre les parties prenantes du projet' },
        ],
        justification: 'J\'ai choisi l\'AC25.01 car j\'ai piloté le projet entièrement en Scrum (sprints, backlog, Jira, burndown chart) : la méthode agile d\'amélioration continue par excellence. La CE5.02 est au cœur de mon rôle : en tant que Scrum Master, ma mission était de faire collaborer des parties prenantes aux intérêts différents (mairie, familles, journalistes) en traduisant leurs besoins en User Stories.',
        proof: 'Tableau de bord Jira avec les tickets SCRUM-18 (compréhension de la cible) et SCRUM-19 validés en « DONE », et le Burndown chart illustrant la progression réelle du sprint.',
        tags: ['Scrum', 'Jira', 'User Stories', 'Gestion de projet'],
        links: [],
        image: '',
        proofImage: '',
      },
    ],
  },
];

export function getSkill(slug) {
  return SKILLS.find((s) => s.slug === slug) || null;
}
