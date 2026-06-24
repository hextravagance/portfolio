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
    acs: [
      { code: 'AC21.01', label: 'Analyser la stratégie de communication ou marketing d’un acteur, d’une organisation au regard d’un secteur ou d’un marché (stratégie, mission, valeurs...)' },
      { code: 'AC21.02', label: 'Auditer un site web, une marque ou un service, en termes de trafic et de référencement' },
      { code: 'AC21.03', label: 'Traiter des données avec des outils statistiques pour faciliter leur analyse et leur exploitation' },
      { code: 'AC21.04', label: 'Identifier et décrire les parcours client à partir d’enquêtes de terrain' },
      { code: 'AC21.05', label: 'Cartographier les expériences utilisateur : points de contact, points de friction et de satisfaction, carte d’empathie.' }
    ],
    ces: [
      { code: 'CE1.01', label: 'En intégrant les enjeux humains, écologiques et éthiques' },
      { code: 'CE1.02', label: 'En écoutant et observant les utilisateurs' },
      { code: 'CE1.03', label: 'En s’appuyant sur des données quantitatives pertinentes et des outils statistiques adaptés' },
      { code: 'CE1.04', label: 'En sollicitant des modèles théoriques issus des sciences humaines et sociales' },
      { code: 'CE1.05', label: 'En restituant les résultats de manière synthétique' }
    ],
    projects: [],
  },

  {
    slug: 'concevoir',
    label: 'CONCEVOIR',
    subtitle: 'pour le web et les médias numériques',
    description: 'Concevoir un produit numérique en réponse à un besoin, de l\'UX à l\'architecture de l\'information.',
    acs: [
      { code: 'AC22.01', label: 'Co-concevoir un produit ou un service (proposition de valeur, fonctionnalités...)' },
      { code: 'AC22.02', label: 'Produire une recommandation ergonomique à partir des tests utilisateurs (sur système fonctionnel, prototype ou maquette interactive)' },
      { code: 'AC22.03', label: 'Co-construire une recommandation stratégique (en structurant un plan d’action)' },
      { code: 'AC22.04', label: 'Optimiser le référencement d’un site web, d’un produit ou d’un service' },
      { code: 'AC22.05', label: 'Mettre en place une présence sur les réseaux sociaux' }
    ],
    ces: [
      { code: 'CE2.01', label: 'En optimisant la responsabilité sociale et environnementale de l’organisation' },
      { code: 'CE2.02', label: 'En s’intégrant aux écosystèmes physiques et numériques des parties prenantes' },
      { code: 'CE2.03', label: 'En s’appuyant sur les usages et les modes de communication observés' },
      { code: 'CE2.04', label: 'En enrichissant sa démarche de connaissances sociologiques, esthétiques, culturelles et inter-culturelles' },
      { code: 'CE2.05', label: 'En présentant de façon convaincante la réponse proposée, en français, en anglais ou dans d’autres langues' }
    ],
    projects: [
      {
        title: 'Roomies',
        context: 'Intra-muros',
        year: '2025',
        role: 'UI / UX Designer',
        contentHtml: `
<section class="pd-chapter">
  <div class="pd-chapter-num">01</div>
  <div class="pd-chapter-body">
    <div class="pd-chapter-eyebrow">Point de départ</div>
    <h3 class="pd-chapter-title">L'expérience Boostr</h3>
    <p class="pd-lead">L'an dernier, j'ai travaillé sur <strong>Boostr</strong>, un site existant dédié à la conversion et reconversion professionnelle. L'objectif était de redessiner le site en fonction des retours d'utilisateurs. Cette première approche m'a initié aux bases de la conception centrée utilisateur.</p>
    <div class="pd-chapter-media" style="margin-top: 32px;">
      <div class="pd-proof-frame">
        <img src="img/2/boostr.png" alt="Maquette Boostr" style="width:100%;height:auto;display:block;"/>
      </div>
    </div>
  </div>
</section>

<section class="pd-chapter">
  <div class="pd-chapter-num">02</div>
  <div class="pd-chapter-body">
    <div class="pd-chapter-eyebrow">Nouveau projet</div>
    <h3 class="pd-chapter-title">L'application Roomies</h3>
    <div class="pd-chapter-media">
      <div class="pd-proof-frame">
        <div class="pd-proof-placeholder">Visuel à venir</div>
      </div>
    </div>
    <p class="pd-text">Cette année, j'ai mis à profit cette expérience sur un projet similaire mais plus ambitieux : <strong>Roomies</strong>. Il s'agit d'une application mobile qui facilite le quotidien des colocataires, en intégrant la planification des tâches ménagères, la gestion des comptes communs et des défis entre amis.</p>
  </div>
</section>

<section class="pd-chapter">
  <div class="pd-chapter-num">03</div>
  <div class="pd-chapter-body">
    <div class="pd-chapter-eyebrow">Trace</div>
    <h3 class="pd-chapter-title">Preuves de compétences</h3>

    <div class="pd-proof-item">
      <div class="pd-proof-head">
        <span class="code-chip">CE2.03</span>
        <span class="pd-proof-head-label">En s'appuyant sur les usages et les modes de communication observés</span>
      </div>
      <div class="pd-proof-frame">
        <img src="img/2/CE2.03.png" alt="Persona et questionnaire" style="width:100%;height:auto;display:block;"/>
      </div>
      <p>Pour que notre application soit adaptée au mieux, j'ai dressé un persona précis et réalisé un questionnaire utilisateur afin de cibler les vrais besoins des colocataires.</p>
    </div>

    <div class="pd-proof-item">
      <div class="pd-proof-head">
        <span class="code-chip">AC22.01</span>
        <span class="pd-proof-head-label">Co-concevoir un produit ou un service</span>
      </div>
      <div class="pd-proof-frame">
        <img src="img/2/AC22.01.png" alt="Wireframes et parcours utilisateurs" style="width:100%;height:auto;display:block;"/>
      </div>
      <p>Grâce aux réponses recueillies lors de la recherche utilisateur, j'ai conçu l'application mobile en élaborant des parcours utilisateurs complets et un wireframe en haute fidélité (High Fidelity) sur Figma.</p>
    </div>
  </div>
</section>

<section class="pd-chapter">
  <div class="pd-chapter-num">04</div>
  <div class="pd-chapter-body">
    <div class="pd-chapter-eyebrow">Réflexion</div>
    <h3 class="pd-chapter-title">Prise de recul</h3>
    <div class="pd-critique-grid" style="margin:32px 0 0;">
      <div class="pd-critique-col">
        <h4>Points forts</h4>
        <p>Un maquettage Figma plus poussé et propre, facilement modifiable grâce à l'utilisation de composants. La création d'un produit dont les fonctionnalités découlent directement des besoins exprimés par les cibles.</p>
      </div>
      <div class="pd-critique-col">
        <h4>Points faibles</h4>
        <p>Un wireframe bien trop poussé dès le départ, et un léger manque de composants réutilisables sur l'ensemble du projet.</p>
      </div>
    </div>
    <div class="pd-critique-callout" style="margin-top:40px;">
      <p>Comparé à l'an dernier avec le projet Boostr, je commence de plus en plus à prendre la main sur Figma. L'utilisation de nouvelles features comme l'auto layout ainsi que les composants a grandement amélioré l'efficacité dans la création de cette application. Si je devais donner des axes d'amélioration, ce serait d'avoir le plus de composants possibles pour une meilleure customisation, et de passer à la vitesse supérieure en codant cette application directement.</p>
    </div>
  </div>
</section>
        `,
        acs: [
          { code: 'AC22.01', label: 'Co-concevoir un produit ou un service' },
        ],
        ces: [
          { code: 'CE2.03', label: 'En s\'appuyant sur les usages et les modes de communication observés' },
        ],
        tags: ['Figma', 'UI/UX', 'Mobile'],
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
    acs: [
      { code: 'AC23.01', label: 'Produire un écrit journalistique sourcé et documenté' },
      { code: 'AC23.02', label: 'Définir une iconographie (illustrations, photographies, vidéos)' },
      { code: 'AC23.03', label: 'Créer et décliner une identité visuelle (charte graphique)' },
      { code: 'AC23.04', label: 'Imaginer, écrire et scénariser en vue d’une communication multimédia ou transmédia' },
      { code: 'AC23.05', label: 'Réaliser, composer et produire pour une communication plurimédia' },
      { code: 'AC23.06', label: 'Élaborer et produire des animations, des designs sonores, des effets spéciaux, de la visualisation de données ou de la 3D' }
    ],
    ces: [
      { code: 'CE3.01', label: 'En veillant à la qualité esthétique des créations et en la justifiant par des références culturelles et artistiques' },
      { code: 'CE3.02', label: 'En produisant un discours de qualité, appuyé sur les théories du récit et les traditions narratives' },
      { code: 'CE3.03', label: 'En respectant la stratégie de communication établie' },
      { code: 'CE3.04', label: 'En veillant à la qualité orthographique, grammaticale et typographique des productions' },
      { code: 'CE3.05', label: 'En communiquant en français, en anglais ou dans d’autres langues' }
    ],
    projects: [
      {
        title: 'Générique Animé Kill Bill',
        context: 'Intra-muros (SAÉ 302)',
        year: '2025',
        role: 'Motion Designer',
        contentHtml: `
<section class="pd-chapter">
  <div class="pd-chapter-num">01</div>
  <div class="pd-chapter-body">
    <div class="pd-chapter-eyebrow">Point de départ</div>
    <h3 class="pd-chapter-title">Un échec transformé en opportunité</h3>
    <p class="pd-lead">La réalisation de ce générique animé pour Kill Bill, dans le cadre de la SAÉ 302, a marqué un tournant dans mon parcours. Ayant échoué l'année précédente sur un exercice de dessin sous Animate, j'ai choisi de transformer cette lacune en opportunité en exploitant pleinement After Effects, en m'appuyant sur des techniques de motion design (rotoscopie, compositing) plutôt que sur le dessin à main levée.</p>
  </div>
</section>

<section class="pd-chapter">
  <div class="pd-chapter-num">02</div>
  <div class="pd-chapter-body">
    <div class="pd-chapter-eyebrow">Le défi</div>
    <h3 class="pd-chapter-title">Les contraintes à dépasser</h3>
    <p class="pd-text">Avant de produire la moindre image, j'ai dû composer avec trois contraintes fortes :</p>
    <div class="pd-issues">
      <div class="pd-issue">
        <div class="pd-issue-num">1</div>
        <p>Une <strong>lacune assumée en dessin</strong> : mon échec de l'année précédente sous Animate m'imposait de trouver une approche technique qui ne repose pas sur le dessin à main levée.</p>
        <div class="pd-issue-media">
          <div class="pd-proof-frame">
            <img src="img/3/defi1.png" alt="" style="width:100%;height:auto;display:block;"/>
          </div>
        </div>
      </div>
      <div class="pd-issue">
        <div class="pd-issue-num">2</div>
        <p>Me lancer dans la <strong>rotoscopie d'une scène emblématique</strong> : un objectif ambitieux, un peu trop poussé pour le temps imparti, mais l'occasion idéale d'expérimenter cette technique sur un passage marquant du film.</p>
        <div class="pd-issue-media">
          <div class="pd-proof-frame">
            <img src="img/3/defi2.png" alt="" style="width:100%;height:auto;display:block;"/>
          </div>
        </div>
      </div>
      <div class="pd-issue">
        <div class="pd-issue-num">3</div>
        <p><strong>Apprivoiser un outil intimidant</strong> : After Effects, sa logique nodale et ses plugins avancés représentaient un véritable saut technique par rapport à mes acquis.</p>
        <div class="pd-issue-media">
          <div class="pd-proof-frame">
            <img src="img/3/defi3.png" alt="" style="width:100%;height:auto;display:block;"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="pd-chapter">
  <div class="pd-chapter-num">03</div>
  <div class="pd-chapter-body">
    <div class="pd-chapter-eyebrow">Direction artistique</div>
    <h3 class="pd-chapter-title">Penser l'univers avant de l'animer</h3>
    <p class="pd-text">Avant la moindre animation, j'ai posé toute la direction artistique dans un <strong>moodboard sur Canva</strong> : palette, ambiance et références. Le parti pris des <strong>silhouettes en aplat noir</strong> s'inspire directement de l'esthétique des grands génériques de cinéma, pour installer un univers fort et lisible.</p>
    <div class="pd-chapter-media">
      <div class="pd-proof-frame">
        <img src="img/3/1.png" alt="Moodboard du générique" style="width:100%; height:auto; display:block;"/>
      </div>
    </div>
    <div class="pd-proof-item">
      <div class="pd-proof-head">
        <span class="code-chip">CE3.01</span>
        <span class="pd-proof-head-label">En veillant à la qualité esthétique et en la justifiant par des références culturelles</span>
      </div>
      <div class="pd-proof-frame" style="display:flex; flex-direction:column; gap:16px;">
        <img src="img/3/CE3.01.png" alt="Référence Cowboy Bebop épinglée dans le moodboard" style="width:100%; height:auto; display:block;"/>
        <img src="img/3/CE3.01_2.png" alt="Plan du générique rejouant la référence Cowboy Bebop" style="width:100%; height:auto; display:block;"/>
      </div>
      <p>Un plan du générique rend directement hommage à <strong>Cowboy Bebop</strong>, une référence que j'avais épinglée dès le moodboard. Ce lien explicite entre une intention culturelle documentée en amont et le rendu final ancre mes choix esthétiques dans des références assumées.</p>
    </div>
  </div>
</section>

<section class="pd-chapter">
  <div class="pd-chapter-num">04</div>
  <div class="pd-chapter-body">
    <div class="pd-chapter-eyebrow">Production technique</div>
    <h3 class="pd-chapter-title">De l'image fixe au mouvement</h3>
    <p class="pd-text">Pour fabriquer l'animation, j'ai combiné deux techniques : pour une scène emblématique, une <strong>rotoscopie</strong> d'un passage du film via le tracking <strong>Mocha Pro</strong> ; pour les autres scènes, des images détourées et placées sur fond noir dans <strong>Illustrator</strong>, puis animées dans <strong>After Effects</strong>.</p>

    <div class="pd-proof-item">
      <div class="pd-proof-head">
        <span class="code-chip">AC23.06</span>
        <span class="pd-proof-head-label">Élaborer et produire des animations, des designs sonores, des effets spéciaux</span>
      </div>
      <div class="pd-proof-frame">
        <img src="img/3/AC23.06.png" alt="Scène rotoscopée du générique" style="width:100%; height:auto; display:block;"/>
      </div>
      <div class="pd-proof-frame" style="margin-top:16px;">
        <div class="pd-baslider" data-baslider role="group" aria-label="Comparateur avant / après — glisser pour révéler" tabindex="0">
          <img class="ba-after" src="img/3/AC23.06_2.png" alt="Après — rendu final en aplat noir" draggable="false"/>
          <img class="ba-before" src="img/3/AC23.06_1.png" alt="Avant — maillage de tracking Mocha Pro" draggable="false"/>
          <div class="ba-divider"></div>
          <div class="ba-grip" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="11 7 6 12 11 17"/><polyline points="13 7 18 12 13 17"/></svg>
          </div>
          <span class="ba-label before">Avant</span>
          <span class="ba-label after">Après</span>
        </div>
      </div>
      <p>La rotoscopie repose sur la production d'effets spéciaux : le maillage de tracking <strong>Mocha Pro</strong> posé sur les personnages permet de les isoler image par image, jusqu'au rendu final en aplat noir. Glissez le curseur pour comparer le tracking initial et le rendu final.</p>
    </div>
  </div>
</section>

<section class="pd-chapter">
  <div class="pd-chapter-num">05</div>
  <div class="pd-chapter-body">
    <div class="pd-chapter-eyebrow">Réflexion</div>
    <h3 class="pd-chapter-title">Prise de recul</h3>
    <div class="pd-critique-grid" style="margin:32px 0 0;">
      <div class="pd-critique-col">
        <h4>Points forts</h4>
        <p>J'ai su identifier ma faiblesse (le dessin) et trouver une alternative technique professionnelle (le tracking sous Mocha Pro) pour livrer un rendu esthétique cohérent et porteur de sens.</p>
      </div>
      <div class="pd-critique-col">
        <h4>Points faibles</h4>
        <p>Le principal point faible est le <strong>manque de plans</strong> et un <strong>texte qui défile trop vite</strong>, ce qui se ressent dans la note finale. C'est surtout ma progression personnelle, plus que le résultat noté, qui constitue la vraie réussite de ce projet.</p>
      </div>
    </div>
    <div class="pd-critique-callout" style="margin-top:40px;">
      <p>Ce projet m'a permis de vaincre mon appréhension initiale d'After Effects et d'en maîtriser la logique nodale et les plugins avancés, au point d'en faire aujourd'hui mon outil de prédilection au sein de la suite Adobe.</p>
    </div>
  </div>
</section>
        `,
        acs: [
          { code: 'AC23.06', label: 'Élaborer et produire des animations, des designs sonores, des effets spéciaux...' },
        ],
        ces: [
          { code: 'CE3.01', label: 'En veillant à la qualité esthétique des créations et en la justifiant par des références culturelles et artistiques' },
        ],
        tags: ['After Effects', 'Illustrator', 'Mocha Pro', 'Rotoscopie', 'Motion Design'],
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
    acs: [
      { code: 'AC24.01', label: 'Produire des pages et applications Web responsives' },
      { code: 'AC24.02', label: 'Mettre en place ou développer un back office' },
      { code: 'AC24.03', label: 'Intégrer, produire ou développer des interactions riches ou des dispositifs interactifs' },
      { code: 'AC24.04', label: 'Modéliser les traitements d’une application Web' },
      { code: 'AC24.05', label: 'Optimiser une application web en termes de référencement et de temps de chargement' },
      { code: 'AC24.06', label: 'Configurer une solution d’hébergement adaptée aux besoins' }
    ],
    ces: [
      { code: 'CE4.01', label: 'En se conformant aux standards du Web et aux normes d’accessibilité' },
      { code: 'CE4.02', label: 'En s’appuyant sur des concepts théoriques issus de l’informatique et des sciences de l’information' },
      { code: 'CE4.03', label: 'En produisant du code fonctionnel, sobre et réutilisable' },
      { code: 'CE4.04', label: 'En utilisant les outils favorisant un développement itératif et collaboratif' },
      { code: 'CE4.05', label: 'En veillant à la sécurité des systèmes et des données' }
    ],
    projects: [
      {
        title: 'SAÉ Phaser',
        context: 'Intra-muros',
        year: '2025',
        role: 'Développeur back-end',
        contentHtml: `
<section class="pd-chapter">
  <div class="pd-chapter-num">01</div>
  <div class="pd-chapter-body">
    <div class="pd-chapter-eyebrow">Point de départ</div>
    <h3 class="pd-chapter-title">Un peu de contexte</h3>
    <p class="pd-lead">Il est important de préciser que j'ai eu l'opportunité de réaliser ce projet à deux reprises, ce qui m'a offert un véritable recul critique sur mes pratiques. L'an dernier, j'ai participé au développement d'un premier jeu Phaser. Nommé Stellar Swap, ce jeu propose d'incarner un mineur spatial récupérant au centre d'une planète un minerai essentiel à son équilibre. Une fois le minerai acquis, le joueur peut modifier la gravité pour échapper à des monstres hostiles qui le poursuivent jusqu'à son vaisseau.</p>
  </div>
</section>

<section class="pd-chapter">
  <div class="pd-chapter-num">02</div>
  <div class="pd-chapter-body">
    <div class="pd-chapter-eyebrow">Diagnostic</div>
    <h3 class="pd-chapter-title">Les obstacles rencontrés sur Stellar Swap</h3>
    <p class="pd-text">En analysant le code de l'an dernier, j'ai identifié d'importantes lacunes techniques :</p>
    <div class="pd-issues">
      <div class="pd-issue">
        <div class="pd-issue-num">1</div>
        <p>Toutes les variables principales étaient déclarées globalement avec le mot-clé <code>var</code>, ce qui posait de gros problèmes de portée et des risques de modifications accidentelles depuis d'autres fichiers.</p>
        <div class="pd-issue-media">
          <div class="pd-proof-frame">
            <img src="img/4/obstacle1.png" alt="" style="width:100%;height:auto;display:block;"/>
          </div>
        </div>
      </div>
      <div class="pd-issue">
        <div class="pd-issue-num">2</div>
        <p>Tous les comportements des ennemis étaient regroupés dans une seule classe chaotique régie par d'infinies conditions <code>if/else</code>, rendant l'ajout de nouveaux monstres très complexe.</p>
        <div class="pd-issue-media">
          <div class="pd-proof-frame">
            <img src="img/4/obstacle2.png" alt="" style="width:100%;height:auto;display:block;"/>
          </div>
        </div>
      </div>
      <div class="pd-issue">
        <div class="pd-issue-num">3</div>
        <p>La scène de chargement chargeait l'intégralité des 30 niveaux et de leurs ressources simultanément, ce qui pénalisait lourdement les performances de l'application.</p>
        <div class="pd-issue-media">
          <div class="pd-proof-frame">
            <img src="img/4/obstacle3.png" alt="" style="width:100%;height:auto;display:block;"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="pd-chapter">
  <div class="pd-chapter-num">03</div>
  <div class="pd-chapter-body">
    <div class="pd-chapter-eyebrow">Nouvelle itération</div>
    <h3 class="pd-chapter-title">Et maintenant ?</h3>
    <div class="pd-chapter-media">
      <div class="pd-proof-frame pd-slideshow" data-slideshow data-interval="3000" role="button" tabindex="0" aria-label="Diaporama Dragon’s Curse — cliquer pour agrandir">
        <img class="pd-slide is-active" src="img/4/1.png" alt="Dragon’s Curse Tower Escape — capture 1" draggable="false"/>
        <img class="pd-slide" src="img/4/2.png" alt="Dragon’s Curse Tower Escape — capture 2" draggable="false"/>
        <img class="pd-slide" src="img/4/3.png" alt="Dragon’s Curse Tower Escape — capture 3" draggable="false"/>
        <img class="pd-slide" src="img/4/4.png" alt="Dragon’s Curse Tower Escape — capture 4" draggable="false"/>
        <img class="pd-slide" src="img/4/5.png" alt="Dragon’s Curse Tower Escape — capture 5" draggable="false"/>
        <div class="pd-slideshow-dots" aria-hidden="true">
          <span class="is-active"></span><span></span><span></span><span></span><span></span>
        </div>
      </div>
    </div>
    <p class="pd-text">Voici le nouveau jeu développé cette année, <strong>Dragon’s Curse Tower Escape</strong>. Dans ce nouveau jeu, le joueur incarne un mage tentant de s'échapper d'une tour après avoir invoqué un dragon devenu incontrôlable. Sur ce projet, j'ai été spécifiquement en charge du développement des ennemis, de la création des énigmes et de l'intégration des effets visuels.</p>
  </div>
</section>

<section class="pd-chapter">
  <div class="pd-chapter-num">04</div>
  <div class="pd-chapter-body">
    <div class="pd-chapter-eyebrow">Trace</div>
    <h3 class="pd-chapter-title">Preuves de compétences</h3>

    <div class="pd-proof-item">
      <div class="pd-proof-head">
        <span class="code-chip">CE4.03</span>
        <span class="pd-proof-head-label">En produisant du code fonctionnel, sobre et réutilisable</span>
      </div>
      <div class="pd-proof-frame">
        <img src="img/4/CE403_1.png" alt="Code de la classe Ennemi avec extends" style="width:100%; height:auto; display:block;"/>
      </div>
      <p>J'ai abandonné l'approche procédurale brouillonne pour appliquer les véritables concepts de la Programmation Orientée Objet (POO). Mes nouveaux ennemis héritent désormais directement des propriétés natives du moteur via <code>extends Phaser.Physics.Arcade.Sprite</code>, ce qui permet d'isoler les comportements et de créer de nouvelles classes d'ennemis sans casser le code existant.</p>
    </div>

    <div class="pd-proof-item">
      <div class="pd-proof-head">
        <span class="code-chip">CE4.05</span>
        <span class="pd-proof-head-label">En veillant à la sécurité des systèmes et des données</span>
      </div>
      <div class="pd-proof-frame" style="display:flex; flex-direction:column; gap:16px;">
        <img src="img/4/CE405_1.png" alt="const" style="width:100%; height:auto; display:block;"/>
        <img src="img/4/CE405_2.png" alt="export let" style="width:100%; height:auto; display:block;"/>
      </div>
      <p>J'ai sécurisé et nettoyé mon code en remplaçant la déclaration globale par une structure stricte. J'utilise désormais <code>const</code> pour les données fixes et <code>let</code> pour les valeurs devant spécifiquement changer en cours de partie, garantissant un code beaucoup plus fiable et lisible pour l'équipe.</p>
    </div>

    <div class="pd-proof-item">
      <div class="pd-proof-head">
        <span class="code-chip">AC24.03</span>
        <span class="pd-proof-head-label">Intégrer, produire ou développer des interactions riches ou des dispositifs interactifs</span>
      </div>
      <div class="pd-proof-frame">
        <img src="img/4/AC24.03.png" alt="chargement modulaire de niveau1.js" style="width:100%; height:auto; display:block;"/>
      </div>
      <p>Pour répondre à notre contrainte matérielle de faire tourner le jeu fluidement sur une borne d'arcade Raspberry Pi 3, j'ai repensé l'architecture de chargement. Chaque scène de niveau ne charge désormais que les trois ou quatre ressources dont elle a strictement besoin, divisant drastiquement la consommation de mémoire.</p>
    </div>
  </div>
</section>

<section class="pd-chapter">
  <div class="pd-chapter-num">05</div>
  <div class="pd-chapter-body">
    <div class="pd-chapter-eyebrow">Réflexion</div>
    <h3 class="pd-chapter-title">Prise de recul</h3>
    <div class="pd-critique-grid" style="margin:32px 0 0;">
      <div class="pd-critique-col">
        <h4>Points forts</h4>
        <p>J'ai su comprendre et décortiquer mes erreurs passées pour optimiser les performances, aboutissant à un rendu final beaucoup plus propre et professionnel.</p>
      </div>
      <div class="pd-critique-col">
        <h4>Points faibles</h4>
        <p>Notre progression a été freinée par de nombreux changements de direction artistique au sein du groupe. De plus, nous avons dû faire face à d'importants défis d'optimisation suite à des ralentissements inattendus sur la borne d'arcade.</p>
      </div>
    </div>
    <div class="pd-critique-callout" style="margin-top:40px;">
      <p>Comparé à l'an dernier, je comprends et je maîtrise beaucoup mieux l'architecture Orientée Objet en JavaScript. Lors de cette SAÉ, j'ai été capable de repérer mes propres failles en restructurant en profondeur mon code. En écoutant les retours des testeurs, j'ai identifié de nouveaux axes d'amélioration : certaines interfaces, comme le menu « Power-up », sont restées à l'état de prototypes sans habillage final, et la rejouabilité reste limitée par des cartes statiques. Si c'était à refaire, je pousserais l'expérience plus loin en implémentant un algorithme de génération procédurale pour créer des donjons aléatoires, plutôt que de me limiter à des cartes Tiled figées.</p>
    </div>
  </div>
</section>
        `,
        acs: [
          { code: 'AC24.03', label: 'Intégrer, produire ou développer des interactions riches ou des dispositifs interactifs' },
        ],
        ces: [
          { code: 'CE4.03', label: 'En produisant du code fonctionnel, sobre et réutilisable' },
          { code: 'CE4.05', label: 'En veillant à la sécurité des systèmes et des données' },
        ],
        tags: ['Phaser', 'JavaScript', 'POO', 'Tiled'],
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
    acs: [
      { code: 'AC35.01', label: 'Piloter un produit, un service ou une équipe' },
      { code: 'AC35.02', label: 'Maîtriser la qualité en projet Web ou multimédia' },
      { code: 'AC35.03', label: 'Concevoir un projet d’entreprise innovante en définissant le nom, l’identité, la forme juridique et le ton de la marque' },
      { code: 'AC35.04', label: 'Défendre un projet de manière convaincante' }
    ],
    ces: [
      { code: 'CE5.01', label: 'En s’appuyant sur une veille technologique et des modèles de l’innovation' },
      { code: 'CE5.02', label: 'En favorisant la collaboration entre les parties prenantes du projet' },
      { code: 'CE5.03', label: 'En respectant le droit et la vie privée' },
      { code: 'CE5.04', label: 'En favorisant la sobriété numérique' },
      { code: 'CE5.05', label: 'En exploitant des cadres de réflexion français et internationaux' }
    ],
    projects: [
      {
        title: 'Projet Chandeleur : Scrum',
        context: 'Intra-muros',
        year: '2025',
        role: 'Scrum Master & responsable communication',
        contentHtml: `
<section class="pd-chapter">
  <div class="pd-chapter-num">01</div>
  <div class="pd-chapter-body">
    <div class="pd-chapter-eyebrow">Point de départ</div>
    <h3 class="pd-chapter-title">Piloter un projet de A à Z</h3>
    <p class="pd-lead">Sur ce projet, j'ai officié comme <strong>Scrum Master</strong> et responsable de la communication. La mission : concevoir une stratégie événementielle intergénérationnelle pour la mairie de Béziers. J'ai piloté la planification des sprints, défini la vision produit (Product Goal) et coordonné toute l'équipe.</p>
  </div>
</section>

<section class="pd-chapter">
  <div class="pd-chapter-num">02</div>
  <div class="pd-chapter-body">
    <div class="pd-chapter-eyebrow">La démarche</div>
    <h3 class="pd-chapter-title">Le pilotage agile, étape par étape</h3>
    <p class="pd-text">J'ai structuré le projet selon la méthode Scrum, autour de trois leviers :</p>
    <div class="pd-issues">
      <div class="pd-issue">
        <div class="pd-issue-num">1</div>
        <p><strong>Découper les objectifs en sprints</strong>, en partant d'un Product Goal clair pour donner un cap à l'équipe.</p>
        <div class="pd-issue-media"><div class="pd-proof-frame"><img src="img/5/1.png" alt="Découpage en sprints" style="width:100%;height:auto;display:block;"/></div></div>
      </div>
      <div class="pd-issue">
        <div class="pd-issue-num">2</div>
        <p><strong>Rédiger les User Stories</strong> pour traduire les besoins de parties prenantes aux intérêts différents : mairie, familles, journalistes locaux.</p>
        <div class="pd-issue-media"><div class="pd-proof-frame"><img src="img/5/2.png" alt="User Stories" style="width:100%;height:auto;display:block;"/></div></div>
      </div>
      <div class="pd-issue">
        <div class="pd-issue-num">3</div>
        <p><strong>Administrer le tableau Jira</strong> pour attribuer les tâches (visuels print, scripts vidéo, encarts presse) et suivre les échéances.</p>
        <div class="pd-issue-media"><div class="pd-proof-frame"><img src="img/5/3.png" alt="Tableau Jira" style="width:100%;height:auto;display:block;"/></div></div>
      </div>
    </div>
  </div>
</section>

<section class="pd-chapter">
  <div class="pd-chapter-num">03</div>
  <div class="pd-chapter-body">
    <div class="pd-chapter-eyebrow">Trace</div>
    <h3 class="pd-chapter-title">Preuves de compétences</h3>

    <div class="pd-proof-item">
      <div class="pd-proof-head">
        <span class="code-chip">AC25.01</span>
        <span class="pd-proof-head-label">Gérer un projet avec une méthode d'amélioration continue (méthode agile)</span>
      </div>
      <div class="pd-proof-frame">
        <img src="img/5/AC25.01.png" alt="Burndown chart du sprint" style="width:100%;height:auto;display:block;"/>
      </div>
      <p>J'ai piloté le projet entièrement en Scrum — sprints, backlog, Jira, burndown chart — la méthode agile d'amélioration continue par excellence. Les tickets SCRUM-18 et SCRUM-19 validés en « Done » en témoignent.</p>
    </div>

    <div class="pd-proof-item">
      <div class="pd-proof-head">
        <span class="code-chip">CE5.02</span>
        <span class="pd-proof-head-label">En favorisant la collaboration entre les parties prenantes du projet</span>
      </div>
      <div class="pd-proof-frame">
        <img src="img/5/CE5.02.png" alt="Espace de travail centralisé (onglets)" style="width:100%;height:auto;display:block;"/>
      </div>
      <p>Pour assurer la cohésion de l'équipe pluridisciplinaire, j'ai mis en place un espace de travail centralisé où chaque métier disposait de son propre onglet (« Vidéo teaser », « Article », « Formulaire d'inscription »). Cette structuration a permis à des profils très différents de travailler en parallèle de manière fluide et transparente, sans écraser le travail des autres. Ce carrefour d'informations a non seulement responsabilisé chaque membre, mais a aussi grandement facilité la cohérence des livrables et le suivi de l'avancement.</p>
    </div>
  </div>
</section>

<section class="pd-chapter">
  <div class="pd-chapter-num">04</div>
  <div class="pd-chapter-body">
    <div class="pd-chapter-eyebrow">Réflexion</div>
    <h3 class="pd-chapter-title">Prise de recul</h3>
    <div class="pd-critique-grid" style="margin:32px 0 0;">
      <div class="pd-critique-col">
        <h4>Points forts</h4>
        <p>Par rapport à un échec de cohésion l'année précédente, j'ai cette fois mené le projet jusqu'à son terme, en gardant l'équipe alignée sur un objectif commun.</p>
      </div>
      <div class="pd-critique-col">
        <h4>Points faibles</h4>
        <p>Maintenir la rigueur méthodologique dans la durée : après un excellent Sprint 1, l'assiduité sur Jira a chuté et j'ai manqué de fermeté dans mon rôle de leader.</p>
      </div>
    </div>
    <div class="pd-critique-callout" style="margin-top:40px;">
      <p>La prochaine fois, j'instaurerais des Daily Stand-ups quotidiens de cinq minutes pour responsabiliser chacun. Je sais désormais qu'un bon Scrum Master doit recadrer dès les premiers signes de relâchement.</p>
    </div>
  </div>
</section>
        `,
        acs: [
          { code: 'AC25.01', label: 'Gérer un projet avec une méthode d\'amélioration continue (ex. méthode agile)' },
        ],
        ces: [
          { code: 'CE5.02', label: 'En favorisant la collaboration entre les parties prenantes du projet' },
        ],
        tags: ['Scrum', 'Jira', 'User Stories', 'Gestion de projet'],
        links: [],
        image: 'img/cascade/5/cascade_05.png',
        proofImage: '',
      },
    ],
  },
];

export function getSkill(slug) {
  return SKILLS.find((s) => s.slug === slug) || null;
}
