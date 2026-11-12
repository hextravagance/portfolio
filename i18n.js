// --- LANGUE (FR / EN) -------------------------------------------------------
// Maj droite (hero de l'index uniquement) ouvre un champ : taper "eng" recharge le site en anglais,
// "fr" revient au français. La langue est mémorisée (localStorage) et reprise par photos.html.
// Les textes français du HTML sont traduits via ce dictionnaire (clé = texte FR, espaces normalisés).
(function () {
    let lang = 'fr';
    try { lang = localStorage.getItem('lang') === 'en' ? 'en' : 'fr'; } catch (_) { }
    window.LANG = lang;

    const EN = {
        // hero / menu
        'Mes projets ↓': 'My projects ↓',
        'PRESENTATION': 'ABOUT',
        'PROJETS': 'PROJECTS',
        // bio
        "Moi c'est Nicolas, j'ai 20 ans, je suis un jeune développeur originaire du sud de la France, et j'étudie en BUT MMI (Métiers du Multimédia et de l'Internet).":
            "I'm Nicolas, I'm 20, a young developer from the south of France, and I'm studying for a BUT MMI (Multimedia and Internet Professions).",
        "J'ai toujours été attiré à la fois par le développement et par le design : j'aime autant écrire le code d'une interface que penser son image, son rythme et ses animations.":
            "I've always been drawn to both development and design: I enjoy writing an interface's code as much as thinking through its look, its rhythm and its animations.",
        'Je cherche à rester polyvalent sur tous les aspects de la création, que ce soit pour des visuels, de la vidéo, de la 3D ou des pages web, et à relier ces mondes dans des projets qui ont une vraie identité.':
            'I aim to stay versatile across every aspect of creation, whether visuals, video, 3D or web pages, and to connect these worlds in projects with a real identity.',
        // projets
        'Carte collaborative pour recenser les stickers de rue': 'Collaborative map to catalog street stickers',
        'Tower defense en réalité virtuelle': 'Tower defense in virtual reality',
        'Lecteur de musique web pour ma bibliothèque perso': 'Web music player for my personal library',
        'Visualiseur 3D et AR du robot Ned2 avec assistant IA': '3D and AR viewer for the Ned2 robot with an AI assistant',
        "Refonte d'un site WordPress de domaine viticole": "Redesign of a winery's WordPress website",
        'ACCÈS →': 'ACCESS →',
        // page projet
        'FERMER ✕': 'CLOSE ✕',
        'VOIR LE PROJET →': 'VIEW THE PROJECT →',
        'Description du projet à venir.': 'Project description coming soon.',
        'Description du projet à venir :p': 'Project description coming soon :p',
        'ANNÉE': 'YEAR',
        'RÔLE': 'ROLE',
        // photos
        "← RETOUR À L'INDEX": '← BACK TO INDEX'
    };

    window.t = (s) => (lang === 'en' && EN[s] !== undefined ? EN[s] : s);

    // --- traduction du texte statique déjà présent dans la page ---
    if (lang === 'en') {
        document.documentElement.lang = 'en';
        const norm = (s) => s.replace(/\s+/g, ' ').trim();
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
            acceptNode: (n) => /^(SCRIPT|STYLE|NOSCRIPT)$/.test(n.parentNode.nodeName)
                ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
        });
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach((n) => {
            const k = norm(n.nodeValue);
            if (k && EN[k] !== undefined) n.nodeValue = n.nodeValue.replace(k.length ? /\S[\s\S]*\S|\S/ : /$/, EN[k]);
        });
    }

    // --- invite "terminal" : Maj droite, uniquement dans le hero de l'index ---
    // Un petit ">" glisse depuis l'extérieur de la page (haut droite), puis le champ se déplie à côté.
    // "eng" => anglais, "fr" => français. Échap / clic ailleurs / scroll hors hero => se referme.
    if (!document.getElementById('cta')) return;

    const term = document.createElement('div');
    term.id = 'lang-term';
    term.innerHTML = '<span class="lt-prompt">&gt;</span>';
    const input = document.createElement('input');
    input.id = 'lang-input';
    input.type = 'text';
    input.autocomplete = 'off';
    input.spellcheck = false;
    input.maxLength = 8;
    input.setAttribute('aria-label', 'Language');
    term.appendChild(input);
    document.body.appendChild(term);

    const OUT = 90;   // distance (px) hors de l'écran, à droite
    const INPUT_W = 78;
    gsap.set(term, { x: OUT });

    const inHero = () => (window.scrollY || document.documentElement.scrollTop || 0) < window.innerHeight * 0.7;
    let opened = false, busy = false;

    function open() {
        if (opened || busy || !inHero()) return;
        opened = true;
        input.value = '';
        term.classList.add('is-open');
        gsap.killTweensOf([term, input]);
        // visible AVANT le focus (un élément invisible ne peut pas être focalisé) : on peut taper tout de suite
        gsap.set(term, { visibility: 'visible', x: OUT });
        input.focus({ preventScroll: true });
        gsap.timeline({ onComplete: () => { if (opened) input.focus({ preventScroll: true }); } })
            // le ">" entre depuis l'extérieur de la page, petit rebond
            .to(term, { x: 0, duration: 0.6, ease: 'back.out(2.2)' })
            // puis le champ se déplie
            .to(input, { width: INPUT_W, duration: 0.35, ease: 'power3.out' }, '-=0.15');
    }
    function close(cb) {
        if (!opened) return;
        opened = false;
        term.classList.remove('is-open');
        input.blur();
        gsap.killTweensOf([term, input]);
        gsap.timeline({ onComplete: () => { gsap.set(term, { visibility: 'hidden' }); if (typeof cb === 'function') cb(); } })
            .to(input, { width: 0, duration: 0.2, ease: 'power2.in' })
            .to(term, { x: OUT, duration: 0.4, ease: 'power3.in' }, '-=0.05');
    }
    function setLang(l) {
        try { localStorage.setItem('lang', l); } catch (_) { }
        busy = true;
        const fade = document.getElementById('page-fade');
        if (fade) gsap.to(fade, { opacity: 1, duration: 0.4, ease: 'power2.inOut', onComplete: () => location.reload() });
        else location.reload();
    }
    // ouvrir un site externe dans un NOUVEL onglet (la page actuelle reste en place), puis refermer l'invite
    function go(url) {
        window.open(url, '_blank', 'noopener,noreferrer');
        busy = false;
        close();
    }
    // commandes tapées dans l'invite
    const COMMANDS = {
        eng: () => setLang('en'),
        fr: () => setLang('fr'),
        fra: () => setLang('fr'),
        wix: () => go('https://wix.neocities.org/'),
        nerv: () => go('https://discord.gg/may3SXZZpm')
    };
    // commande reconnue : l'invite clignote, puis l'action est lancée
    function accept(action) {
        busy = true;
        input.blur();
        gsap.killTweensOf([term, input]);
        gsap.fromTo(term, { opacity: 1 }, {
            opacity: 0.15, duration: 0.07, repeat: 5, yoyo: true,
            onComplete: () => { gsap.set(term, { opacity: 1 }); action(); }
        });
    }
    // commande inconnue (Entrée) : petite secousse
    function reject() {
        gsap.fromTo(term, { x: -7 }, { x: 0, duration: 0.5, ease: 'elastic.out(1.2, 0.3)' });
        input.select();
    }

    window.addEventListener('keydown', (e) => {
        if (busy) return;
        if (e.code === 'ShiftRight' && !e.repeat) {
            e.preventDefault();
            opened ? close() : open();
        } else if (e.key === 'Escape') close();
    });
    input.addEventListener('input', () => {
        const v = input.value.trim().toLowerCase();
        if (Object.prototype.hasOwnProperty.call(COMMANDS, v)) accept(COMMANDS[v]);
    });
    // retour arrière du navigateur (page restaurée depuis le cache) : on remet l'invite en état
    window.addEventListener('pageshow', (e) => {
        if (!e.persisted) return;
        busy = false;
        opened = false;
        term.classList.remove('is-open');
        gsap.set(term, { visibility: 'hidden', x: OUT, opacity: 1 });
        gsap.set(input, { width: 0 });
        const fade = document.getElementById('page-fade');
        if (fade) gsap.set(fade, { opacity: 0 });
    });
    input.addEventListener('keydown', (e) => {
        e.stopPropagation();
        if (e.key === 'Escape') close();
        else if (e.key === 'Enter') reject();
    });
    input.addEventListener('blur', () => { if (!busy) close(); });
    window.addEventListener('scroll', () => { if (opened && !inHero()) close(); }, { passive: true });
})();
