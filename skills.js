// Rangées d'icônes qui défilent (STATUS).
// icon = nom Devicon (https://devicon.dev) ; white: true = icône en blanc (même au survol),
// sinon elle garde ses couleurs d'origine. Les rangées alternent : gauche, droite, gauche...
// Si l'icône Devicon n'existe pas (404), une tuile "monogramme" (mono) est affichée à la place,
// en attendant tes propres icônes (tu pourras alors ajouter src: 'img/...' à l'entrée).
const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons';

const SKILL_ROWS = [
    {
        title: 'DEV', items: [
            { name: 'TypeScript', icon: 'typescript' },
            { name: 'JavaScript', icon: 'javascript' },
            { name: 'HTML', icon: 'html5' },
            { name: 'CSS', icon: 'css3' },
            { name: 'PHP', icon: 'php' },
            { name: 'Python', icon: 'python', white: true },
            { name: 'C#', icon: 'csharp' },
            { name: 'Svelte', icon: 'svelte' },
            { name: 'Three.js', icon: 'threejs', white: true },
            { name: 'GSAP', icon: 'gsap', mono: 'Gs' },
            { name: 'React', icon: 'react', white: true },
            { name: 'Node.js', icon: 'nodejs' },
            { name: 'Express', icon: 'express', white: true },
            { name: 'Flask', icon: 'flask', white: true },
            { name: 'PostgreSQL', icon: 'postgresql' },
            { name: 'MySQL', icon: 'mysql', white: true },
            { name: 'SQLite', icon: 'sqlite' },
            { name: 'WordPress', icon: 'wordpress' },
            { name: 'PrestaShop', icon: 'prestashop', mono: 'Pr' },
            { name: 'Git', icon: 'git', white: true },
            { name: 'GitHub', icon: 'github', white: true },
            { name: 'Docker', icon: 'docker', white: true },
            { name: 'VS Code', icon: 'vscode', white: true },
            { name: 'Claude Code', icon: 'claude', mono: 'claude' },
            { name: 'Unity', icon: 'unity' }
        ]
    },
    {
        title: 'CREATIVITY', items: [
            { name: 'Figma', icon: 'figma', white: true },
            { name: 'Premiere Pro', icon: 'premierepro' },
            { name: 'After Effects', icon: 'aftereffects' },
            { name: 'Photoshop', icon: 'photoshop' },
            { name: 'Lightroom', icon: 'lightroom', mono: 'Lr' },
            { name: 'TouchDesigner', icon: 'touchdesigner', mono: 'TD' },
            { name: 'osci-render', icon: 'osci-render', mono: 'OR' },
            { name: 'GameMaker', icon: 'gamemaker', mono: 'GM' },
            { name: 'Fusion 360', icon: 'fusion360', mono: 'F360' },
            { name: 'SolidWorks', icon: 'solidworks', mono: 'SW' },
            { name: 'AutoCAD', icon: 'autocad', mono: 'AC' }
        ]
    }
];

const TILE_W = 160; // largeur d'une tuile (px), doit correspondre au CSS (.skill)

function skillTile(s) {
    const tile = document.createElement('div');
    tile.className = 'skill';

    const box = document.createElement('div');
    box.className = 'skill-icon';

    const mono = () => {
        box.classList.add('is-mono');
        box.textContent = s.mono || s.name.slice(0, 2);
        // Offbit n'est nette qu'à 18 / 36 px : 36 pour 1-2 lettres, 18 pour les monogrammes plus longs
        box.style.fontSize = box.textContent.length <= 2 ? '36px' : '18px';
    };

    if (s.src || s.icon) {
        const img = document.createElement('img');
        img.src = s.src || `${DEVICON}/${s.icon}/${s.icon}-original.svg`;
        if (s.white) img.classList.add('is-white');
        img.alt = '';
        img.onerror = () => { img.remove(); mono(); };
        box.appendChild(img);
    } else {
        mono();
    }

    const label = document.createElement('div');
    label.className = 'skill-name';
    label.textContent = s.name;

    tile.append(box, label);
    return tile;
}

function buildSkills() {
    const root = document.getElementById('skills');
    if (!root) return;
    root.innerHTML = '';
    const width = root.clientWidth || 600;

    SKILL_ROWS.forEach((row, i) => {
        const wrap = document.createElement('div');
        wrap.className = 'skill-row';

        const title = document.createElement('div');
        title.className = 'skill-row-title';
        title.textContent = row.title;

        const marquee = document.createElement('div');
        marquee.className = 'marquee';

        const track = document.createElement('div');
        track.className = 'marquee-track ' + (i % 2 === 0 ? 'to-left' : 'to-right');

        // Un "set" doit être plus large que la zone visible pour boucler sans trou
        const reps = Math.max(1, Math.ceil(width / (row.items.length * TILE_W)));
        const set = [];
        for (let r = 0; r < reps; r++) row.items.forEach(s => set.push(s));
        // Deux sets identiques : la boucle translate de -50% (= un set) en continu
        for (let k = 0; k < 2; k++) set.forEach(s => track.appendChild(skillTile(s)));

        // Vitesse constante quelle que soit la longueur du set
        const duration = Math.max(12, set.length * 1.6);
        track.style.animationDuration = duration + 's';

        marquee.appendChild(track);
        wrap.append(title, marquee);
        root.appendChild(wrap);
    });
}

buildSkills();
let skillsResizeT;
window.addEventListener('resize', () => {
    clearTimeout(skillsResizeT);
    skillsResizeT = setTimeout(buildSkills, 250);
});




