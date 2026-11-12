// --- CONFIGURATION ---
const DEBUG = false; // METTRE A FALSE QUAND TOUT EST BON
const SPEED = 15;   // Vitesse de déplacement

// --- DONNÉES ---
const contentsFR = [
    { html: `Timezone : <span id="city">New York</span><br><span id="time">-- : -- : --</span>` },
    { html: `Martigues, FRA<br>[43.40° N, 5.04° E]` },
    { html: `Disponible pour vos projets<br><a href="mailto:nicolas.dev@gmail.com">nicolas.dev@gmail.com</a>` },
    { html: `Site build avec :<br>GSAP, CSS, Three.js` },
    { html: `Statut : En recherche<br>d'une Alternance` },
    { html: `Projets réalisés : +20<br>Années d'exp. : 3` }
];
const contentsEN = [
    { html: `Timezone: <span id="city">New York</span><br><span id="time">-- : -- : --</span>` },
    { html: `Martigues, FRA<br>[43.40° N, 5.04° E]` },
    { html: `Available for your projects<br><a href="mailto:nicolas.dev@gmail.com">nicolas.dev@gmail.com</a>` },
    { html: `Site built with:<br>GSAP, CSS, Three.js` },
    { html: `Status: Looking for<br>a work-study position` },
    { html: `Projects completed: +20<br>Years of exp.: 3` }
];
const contents = window.LANG === 'en' ? contentsEN : contentsFR;

const timezones = [
    { city: "New York", zone: "America/New_York" },
    { city: "Béziers", zone: "Europe/Paris" },
    { city: "Tokyo", zone: "Asia/Tokyo" },
    { city: "Los Angeles", zone: "America/Los_Angeles" },
    { city: "London", zone: "Europe/London" },
    { city: "Sydney", zone: "Australia/Sydney" }
];

const menuItems = [
    { default: t('PRESENTATION'), hover: t('PRESENTATION') },
    { default: t('PROJETS'), hover: t('PROJETS') },
    { default: 'PHOTOS', hover: 'PHOTOS' },
    { default: 'CONTACTS', hover: 'CONTACTS' }
];

// --- THÈME MÉMORISÉ (clair/sombre) : repris au chargement et au retour depuis la page photos ---
(function restoreTheme() {
    let light = false;
    try { light = localStorage.getItem('theme') === 'light'; } catch (_) { }
    if (!light) return;
    document.body.classList.add('light-theme');
    document.documentElement.classList.add('light-theme-html');
    const favicon = document.getElementById('favicon');
    if (favicon) favicon.href = 'img/favicon-dark.svg';
    // l'effet ASCII se crée après : on le prévient dès qu'il existe
    let tries = 0;
    const t = setInterval(() => {
        if (window.asciiEffect) { window.asciiEffect.setLightTheme(true); clearInterval(t); }
        else if (++tries > 100) clearInterval(t);
    }, 100);
})();

// --- STATE ---
const State = {
    activeContentIndices: new Set(),
    currentTimezone: timezones[0],
    getUniqueContentIndex() {
        let available = contents.map((_, i) => i).filter(i => !this.activeContentIndices.has(i));
        if (available.length === 0) {
            this.activeContentIndices.clear();
            return Math.floor(Math.random() * contents.length);
        }
        return available[Math.floor(Math.random() * available.length)];
    }
};

// --- TAILLE MAX D'UNE POPUP ---
// Le contenu change toutes les ~10s et sa largeur varie : on place donc chaque popup avec la taille
// du contenu LE PLUS GRAND, pour qu'elle ne déborde jamais de sa zone quel que soit le texte affiché.
function measurePopupMax() {
    const probe = document.createElement('div');
    probe.className = 'info';
    probe.style.cssText = 'position:fixed;left:-9999px;top:0;visibility:hidden;pointer-events:none;opacity:0;transition:none';
    probe.innerHTML = '<div class="dot"></div><div class="text"></div>';
    document.body.appendChild(probe);
    const t = probe.querySelector('.text');
    let w = 0, h = 0;
    contents.forEach((c) => {
        t.innerHTML = c.html.replace(/ id="[^"]*"/g, ''); // pas d'id dupliqués
        w = Math.max(w, probe.offsetWidth);
        h = Math.max(h, probe.offsetHeight);
    });
    probe.remove();
    State.maxSize = { w, h };
}
function popupSize(el) {
    return State.maxSize || { w: el.offsetWidth || 200, h: el.offsetHeight || 60 };
}
measurePopupMax();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(measurePopupMax);
window.addEventListener('resize', measurePopupMax);

// --- ZONES (ENCLOS) ---
function getZoneForPopup(index) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const menuEl = document.getElementById('main-menu');
    const menuTop = menuEl ? menuEl.getBoundingClientRect().top : (h - 150);

    if (index === 0) {
        // ZONE 1 : GAUCHE
        // On laisse de la place sous le logo (100px)
        // On s'arrête avant le menu
        return {
            x: 20,
            y: 110,
            w: 600,
            h: Math.max(100, (menuTop - 150) - 100)
        };
    } else if (index === 1) {
        // ZONE 2 : DROITE HAUT
        // On pousse bien à gauche (x = w - 350) pour que le texte ne sorte pas à droite
        return {
            x: w - 700,
            y: 20,
            w: 650,
            h: (h * 0.45)
        };
    } else {
        // ZONE 3 : DROITE BAS
        const startY = h * 0.50;
        return {
            x: w - 700,
            y: startY,
            w: 630,
            h: (h - startY) - 70
        };
    }
}

// --- DEBUG ---
function drawDebugZone(id, z) {
    if (!DEBUG) return;
    let el = document.getElementById('dz-' + id);
    if (!el) {
        el = document.createElement('div');
        el.id = 'dz-' + id;
        el.className = 'debug-zone';
        // Style inline pour être sûr qu'il s'affiche par dessus tout
        el.style.cssText = "position:fixed; border:2px solid red; z-index:9999; pointer-events:none; color:red; font-family:monospace; font-size:12px;";
        el.innerText = `ENCLOS ${id + 1}`;
        document.body.appendChild(el);
    }
    el.style.left = z.x + 'px';
    el.style.top = z.y + 'px';
    el.style.width = z.w + 'px';
    el.style.height = z.h + 'px';
}

// --- CLASSE POPUP ---
class FloatingPopup {
    constructor(element, index) {
        this.el = element;
        this.textEl = element.querySelector('.text');
        this.index = index;

        // === ÉTAPE CRUCIALE : LE RESET BRUTAL ===
        // On force l'élément à se remettre à 0,0 par rapport à l'écran
        // On écrase toutes les règles CSS (top, right, bottom...) qui foutent le bazar
        this.el.style.position = 'fixed'; // Fixed pour être sûr d'être relatif à la fenêtre
        this.el.style.top = '0px';
        this.el.style.left = '0px';
        this.el.style.right = 'auto';
        this.el.style.bottom = 'auto';
        this.el.style.margin = '0';
        this.el.style.transform = 'translate3d(0,0,0)'; // Reset transform

        this.currentX = 0;
        this.currentY = 0;

        // Initialisation
        this.cycleContentLoop();
        setTimeout(() => this.spawnInZone(), 100);
    }

    spawnInZone() {
        const z = getZoneForPopup(this.index);
        drawDebugZone(this.index, z);

        // Mesurer la taille réelle de l'élément pour ne pas déborder
        const { w: elW, h: elH } = popupSize(this.el);
        const maxX = Math.max(0, z.w - elW);
        const maxY = Math.max(0, z.h - elH);
        this.currentX = z.x + maxX / 2;
        this.currentY = z.y + maxY / 2;

        // TÉLÉPORTATION
        this.el.style.transition = 'none';
        this.el.style.opacity = '0';

        // Application des coordonnées
        this.el.style.transform = `translate3d(${this.currentX}px, ${this.currentY}px, 0)`;

        // Force calcul
        void this.el.offsetWidth;

        // Apparition
        this.el.style.transition = 'opacity 0.8s ease';
        this.el.style.opacity = '1';

        setTimeout(() => this.float(), 500);
    }

    float() {
        const z = getZoneForPopup(this.index);
        drawDebugZone(this.index, z);

        // Mesurer la taille réelle de l'élément pour ne pas déborder
        const { w: elW, h: elH } = popupSize(this.el);
        const maxX = Math.max(0, z.w - elW);
        const maxY = Math.max(0, z.h - elH);
        const nextX = z.x + Math.random() * maxX;
        const nextY = z.y + Math.random() * maxY;

        const dist = Math.hypot(nextX - this.currentX, nextY - this.currentY);
        const duration = Math.max(4, dist / SPEED);

        this.el.style.transition = `transform ${duration}s ease-in-out`;
        this.el.style.transform = `translate3d(${nextX}px, ${nextY}px, 0)`;

        this.currentX = nextX;
        this.currentY = nextY;

        setTimeout(() => requestAnimationFrame(() => this.float()), (duration * 1000) - 50);
    }

    // après un redimensionnement de la fenêtre : on ramène la popup dans sa (nouvelle) zone
    reclamp() {
        const z = getZoneForPopup(this.index);
        const { w: elW, h: elH } = popupSize(this.el);
        this.currentX = Math.min(Math.max(this.currentX, z.x), z.x + Math.max(0, z.w - elW));
        this.currentY = Math.min(Math.max(this.currentY, z.y), z.y + Math.max(0, z.h - elH));
        this.el.style.transform = `translate3d(${this.currentX}px, ${this.currentY}px, 0)`;
    }

    async cycleContentLoop() {
        await new Promise(r => setTimeout(r, 2000 + Math.random() * 4000));
        while (true) {
            this.el.style.transition = 'opacity 0.5s ease, transform ' + (parseFloat(getComputedStyle(this.el).transitionDuration) || 0) + 's linear';
            this.el.style.opacity = '0';
            await new Promise(r => setTimeout(r, 500));

            const newIdx = State.getUniqueContentIndex();
            if (newIdx !== undefined) {
                if (this.currIdx !== undefined) State.activeContentIndices.delete(this.currIdx);
                this.currIdx = newIdx;
                State.activeContentIndices.add(newIdx);
                this.textEl.innerHTML = contents[newIdx].html;
            }

            // Re-clamper la position après changement de contenu
            // Le nouveau texte peut être plus grand et déborder de l'enclos
            void this.el.offsetWidth; // forcer le recalcul
            const z = getZoneForPopup(this.index);
            const { w: elW, h: elH } = popupSize(this.el);
            const clampedX = Math.min(this.currentX, z.x + Math.max(0, z.w - elW));
            const clampedY = Math.min(this.currentY, z.y + Math.max(0, z.h - elH));
            if (clampedX !== this.currentX || clampedY !== this.currentY) {
                this.currentX = clampedX;
                this.currentY = clampedY;
                this.el.style.transform = `translate3d(${this.currentX}px, ${this.currentY}px, 0)`;
            }

            this.el.style.opacity = '1';
            await new Promise(r => setTimeout(r, 10000 + Math.random() * 5000));
        }
    }
}

// --- UTILS ---
document.querySelectorAll('#main-menu a').forEach((link, i) => {
    const item = menuItems[i];
    if (item) {
        const wrap = (txt) => txt.split('').map((l, idx) => `<span style="--index:${idx}">${l}</span>`).join('');
        link.innerHTML = `<div class="default">${wrap(item.default)}</div><div class="hover">${wrap(item.hover)}</div>`;
    }
});

// Cache pour le formatter Intl (évite de recréer l'objet à chaque seconde)
let cachedFormatter = null;
let cachedTimezone = null;

function getTimeFormatter(timezone) {
    if (cachedTimezone !== timezone) {
        cachedTimezone = timezone;
        cachedFormatter = new Intl.DateTimeFormat("fr-FR", {
            timeZone: timezone,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    }
    return cachedFormatter;
}

function updateTimeDisplay() {
    const t = document.getElementById('time');
    if (t) {
        t.textContent = getTimeFormatter(State.currentTimezone.zone).format(new Date());
    }
}

// Mise à jour immédiate au chargement
updateTimeDisplay();

// Mise à jour chaque seconde
setInterval(updateTimeDisplay, 1000);

// Changement de timezone toutes les 15 secondes
setInterval(() => {
    const c = document.getElementById('city');
    const t = document.getElementById('time');
    if (c) {
        // Sélectionner la nouvelle timezone AVANT le fade
        let z;
        do {
            z = timezones[Math.floor(Math.random() * timezones.length)];
        } while (z === State.currentTimezone);

        // Mise à jour immédiate de l'état et de l'heure (pas de décalage visible)
        State.currentTimezone = z;
        cachedTimezone = null; // Forcer la recréation du formatter

        // Mettre à jour l'heure instantanément avec la nouvelle timezone
        updateTimeDisplay();

        // Animation fade uniquement sur le nom de la ville
        c.style.opacity = 0;
        setTimeout(() => {
            c.textContent = z.city;
            c.style.opacity = 1;
        }, 300); // Réduit de 500ms à 300ms pour plus de réactivité
    }
}, 15000);

// --- INIT ---
window.onload = () => {
    const els = [document.querySelector('.i1'), document.querySelector('.i2'), document.querySelector('.i3')];
    const popups = [];
    els.forEach((el, i) => { if (el) popups.push(new FloatingPopup(el, i)); });

    window.addEventListener('resize', () => {
        popups.forEach((p) => p.reclamp());
        if (DEBUG) [0, 1, 2].forEach(i => drawDebugZone(i, getZoneForPopup(i)));
    });

    // --- THEME TOGGLE ---
    const logo = document.getElementById('logo');
    if (logo) {
        logo.addEventListener('click', () => {
            // Éviter les clics multiples pendant l'animation
            if (logo.classList.contains('rotating')) return;

            // Lancer l'animation de rotation
            logo.classList.add('rotating');

            // À mi-chemin (300ms sur 600ms), changer le thème
            setTimeout(() => {
                document.body.classList.toggle('light-theme');
                document.documentElement.classList.toggle('light-theme-html');

                // Notifier l'effet ASCII du changement de thème
                if (window.asciiEffect) {
                    window.asciiEffect.setLightTheme(document.body.classList.contains('light-theme'));
                }

                // Mémoriser le thème (repris par la page photos et au prochain chargement)
                try { localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark'); } catch (_) { }

                // Changer la favicon selon le thème
                const favicon = document.getElementById('favicon');
                if (favicon) {
                    const isLight = document.body.classList.contains('light-theme');
                    // Thème clair = favicon sombre (noire), Thème sombre = favicon claire (blanche)
                    favicon.href = isLight ? 'img/favicon-dark.svg' : 'img/favicon-light.svg';
                }
            }, 300);

            // Retirer la classe après l'animation
            setTimeout(() => {
                logo.classList.remove('rotating');
            }, 600);
        });
    }
};

// --- SCROLL INTERACTION (GSAP + ScrollTo) ---
const ctaBtn = document.getElementById('cta');
const presentationSection = document.getElementById('presentation');

if (ctaBtn && presentationSection && typeof gsap !== 'undefined') {
    ctaBtn.addEventListener('click', () => {
        // On utilise Lenis pour un scroll fluide synchronis�
        if (typeof lenis !== 'undefined') {
            lenis.scrollTo(presentationSection, {
                duration: 1.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        } else {
            // Fallback GSAP si Lenis n'est pas dispo
            gsap.to(window, {
                duration: 1.5,
                scrollTo: { y: presentationSection, autoKill: true },
                ease: "power3.inOut"
            });
        }
    });
}

// --- MENU : scroll fluide vers la section (Presentation, Projets, Contacts...) ---
const menuNav = document.getElementById('main-menu');
if (menuNav) {
    menuNav.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        const target = document.querySelector(link.getAttribute('href'));
        e.preventDefault(); // pas de saut brusque, même si la section n'existe pas (ex: Photos)
        if (!target) return;
        if (window.lenis) {
            window.lenis.scrollTo(target, {
                duration: 1.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        } else if (typeof gsap !== 'undefined') {
            gsap.to(window, { duration: 1.5, scrollTo: { y: target, autoKill: true }, ease: "power3.inOut" });
        } else {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// --- MENU : PHOTOS = page séparée (fondu noir puis navigation) ---
(function () {
    const fade = document.getElementById('page-fade');
    const photosLink = document.querySelector('#main-menu a[href="photos.html"]');
    if (!fade || !photosLink || typeof gsap === 'undefined') return;
    photosLink.addEventListener('click', (e) => {
        e.preventDefault();
        gsap.to(fade, { opacity: 1, duration: 0.6, ease: 'power2.inOut', onComplete: () => { location.href = 'photos.html'; } });
    });
    // retour via le bouton "précédent" du navigateur (bfcache) : on retire le noir
    window.addEventListener('pageshow', () => gsap.set(fade, { opacity: 0 }));
})();

// --- MASQUER LES INFO EN COLLISION AVEC LE MENU ---
const mainMenu = document.getElementById('main-menu');
const infoElements = document.querySelectorAll('.info');

function checkInfoCollision() {
    if (!mainMenu || infoElements.length === 0) return;

    const menuRect = mainMenu.getBoundingClientRect();

    infoElements.forEach(info => {
        const infoRect = info.getBoundingClientRect();

        // Vérifier si collision (rectangles qui se chevauchent)
        const isColliding = !(
            infoRect.right < menuRect.left ||
            infoRect.left > menuRect.right ||
            infoRect.bottom < menuRect.top ||
            infoRect.top > menuRect.bottom
        );

        if (isColliding) {
            info.style.opacity = '0';
            info.style.pointerEvents = 'none';
        } else {
            info.style.opacity = '1';
            info.style.pointerEvents = 'auto';
        }
    });
}

// Vérifier régulièrement (les popups bougent)
setInterval(checkInfoCollision, 100);

// Optionnel : Effet d'apparition au scroll (Reveal)
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, observerOptions);

// On applique l'observer sur tous les items de projet
document.querySelectorAll('.project-item').forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(50px)";
    el.style.transition = "all 0.6s ease-out";
    observer.observe(el);
});

// --- CUSTOM CURSOR (GSAP) ---
const customCursor = document.getElementById('custom-cursor');
if (customCursor && typeof gsap !== 'undefined') {
    // On cache le vrai curseur
    customCursor.style.opacity = '0';

    // GSAP QuickSetter pour des performances maximales
    const xSet = gsap.quickSetter(customCursor, "left", "px");
    const ySet = gsap.quickSetter(customCursor, "top", "px");

    const moveCursor = (clientX, clientY) => {
        if (customCursor.style.opacity === '0') customCursor.style.opacity = '1';
        gsap.to(customCursor, {
            xPercent: -50,
            yPercent: -50,
            left: clientX,
            top: clientY,
            duration: 0.5,
            ease: "power3.out",
            overwrite: "auto"
        });
    };

    window.addEventListener("mousemove", e => moveCursor(e.clientX, e.clientY));
    window.addEventListener("touchstart", e => {
        if (e.touches && e.touches[0]) moveCursor(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    window.addEventListener("touchmove", e => {
        if (e.touches && e.touches[0]) moveCursor(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    // Effets au survol
    // (classe CSS .hover-link : couleurs gérées par le thème clair/sombre)
    const HOVER_SEL = 'a, button, #logo, #cta, .p-link, .photo-item';
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(HOVER_SEL)) customCursor.classList.add('hover-link');
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(HOVER_SEL)) customCursor.classList.remove('hover-link');
    });

    // --- PREVIEW DE PROJET À CÔTÉ DU CURSEUR ---
    const preview = document.getElementById('project-preview');
    if (preview) {
        const pImg = preview.querySelector('img');
        const pVid = preview.querySelector('video');
        const px = gsap.quickTo(preview, 'x', { duration: 0.45, ease: 'power3.out' });
        const py = gsap.quickTo(preview, 'y', { duration: 0.45, ease: 'power3.out' });
        const rot = gsap.quickTo(preview, 'rotation', { duration: 0.6, ease: 'power3.out' });
        const OFFSET = 36, M = 10;
        let lastX = 0, rotReset;

        // Placement : à droite par défaut, à gauche / en dessous / au-dessus selon la place
        const place = (cx, cy) => {
            const w = preview.offsetWidth, h = preview.offsetHeight;
            const W = window.innerWidth, H = window.innerHeight;
            let x, y;
            const fitsRight = cx + OFFSET + w <= W - M;
            const fitsLeft = cx - OFFSET - w >= M;
            const fitsV = cy - h / 2 >= M && cy + h / 2 <= H - M;

            if (fitsV && fitsRight) { x = cx + OFFSET; y = cy - h / 2; }
            else if (fitsV && fitsLeft) { x = cx - OFFSET - w; y = cy - h / 2; }
            else {
                // trop près du haut / bas (ou des deux côtés) : au-dessus ou en dessous du curseur
                x = cx - w / 2;
                y = (cy < H / 2) ? cy + OFFSET : cy - OFFSET - h;
            }
            x = Math.max(M, Math.min(x, W - w - M));
            y = Math.max(M, Math.min(y, H - h - M));
            px(x); py(y);
        };

        const showPreview = (item, cx, cy) => {
            const src = item.dataset.preview;
            pImg.onload = null;
            pImg.onerror = null;
            pVid.onloadeddata = null;
            pVid.onerror = null;
            pImg.style.display = 'none';
            pVid.style.display = 'none';
            pVid.pause();
            preview.classList.add('no-img');
            if (src && /\.(mp4|webm|mov)$/i.test(src)) {
                // Vidéo : lecture en boucle, muette, depuis le début à chaque survol
                const showVid = () => {
                    pVid.style.display = 'block';
                    preview.classList.remove('no-img');
                };
                pVid.onloadeddata = showVid;
                pVid.onerror = () => { pVid.style.display = 'none'; preview.classList.add('no-img'); };
                if (pVid.getAttribute('src') !== src) {
                    pVid.setAttribute('src', src);
                    pVid.load();
                } else {
                    try { pVid.currentTime = 0; } catch (_) {}
                }
                if (pVid.readyState >= 1) showVid();
                pVid.play().then(showVid).catch(() => {
                    if (pVid.readyState >= 1) showVid();
                });
            } else if (src) {
                const showImg = () => {
                    pImg.style.display = 'block';
                    preview.classList.remove('no-img');
                };
                pImg.onload = showImg;
                pImg.onerror = () => { pImg.style.display = 'none'; preview.classList.add('no-img'); };
                if (pImg.getAttribute('src') !== src) {
                    pImg.setAttribute('src', src);
                } else if (pImg.complete && pImg.naturalWidth > 0) {
                    showImg();
                }
            }
            gsap.set(preview, { x: cx + OFFSET, y: cy });
            place(cx, cy);
            preview.classList.add('is-visible');
        };

        const hidePreview = () => {
            preview.classList.remove('is-visible');
            pVid.pause();
        };

        window.addEventListener('mousemove', (e) => {
            if (!preview.classList.contains('is-visible')) { lastX = e.clientX; return; }
            place(e.clientX, e.clientY);
            // Petite inclinaison selon la vitesse horizontale, retour à plat à l'arrêt
            const dx = e.clientX - lastX; lastX = e.clientX;
            rot(Math.max(-10, Math.min(10, dx * 0.5)));
            clearTimeout(rotReset);
            rotReset = setTimeout(() => rot(0), 80);
        });

        // Desktop (> 768px) : affichage au survol
        document.addEventListener('mouseover', (e) => {
            if (window.innerWidth <= 768) return;
            const item = e.target.closest('.project-item');
            if (!item || item.contains(e.relatedTarget)) return;
            showPreview(item, e.clientX, e.clientY);
        });

        document.addEventListener('mouseout', (e) => {
            if (window.innerWidth <= 768) return;
            const item = e.target.closest('.project-item');
            if (item && !item.contains(e.relatedTarget)) hidePreview();
        });

        // Mobile / Responsive (<= 768px) : affichage uniquement en restant appuyé longtemps sur .p-info
        let pressTimer = null;
        let pressStartX = 0, pressStartY = 0;
        const LONG_PRESS_MS = 400;

        const cancelPress = () => {
            if (pressTimer) {
                clearTimeout(pressTimer);
                pressTimer = null;
            }
            if (window.innerWidth <= 768) hidePreview();
        };

        document.addEventListener('pointerdown', (e) => {
            if (window.innerWidth > 768) return;
            const pInfo = e.target.closest('.p-info');
            if (!pInfo) return;
            const item = pInfo.closest('.project-item');
            if (!item) return;
            pressStartX = e.clientX;
            pressStartY = e.clientY;
            clearTimeout(pressTimer);
            pressTimer = setTimeout(() => {
                pressTimer = null;
                showPreview(item, pressStartX, pressStartY);
            }, LONG_PRESS_MS);
        });

        document.addEventListener('pointermove', (e) => {
            if (window.innerWidth > 768) return;
            if (pressTimer) {
                if (Math.hypot(e.clientX - pressStartX, e.clientY - pressStartY) > 12) {
                    clearTimeout(pressTimer);
                    pressTimer = null;
                }
            } else if (preview.classList.contains('is-visible')) {
                place(e.clientX, e.clientY);
            }
        });

        document.addEventListener('pointerup', cancelPress);
        document.addEventListener('pointercancel', cancelPress);
        document.addEventListener('touchend', cancelPress, { passive: true });
        document.addEventListener('touchcancel', cancelPress, { passive: true });
        document.addEventListener('contextmenu', (e) => {
            if (window.innerWidth <= 768 && e.target.closest('.p-info')) {
                e.preventDefault();
            }
        });

        // Au scroll la souris ne bouge pas : mouseout n'est jamais déclenché.
        // On vérifie donc ce qu'il y a sous le curseur, et on masque si ce n'est plus un projet.
        let mouseX = -1, mouseY = -1, scrollTick = false;
        window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
        window.addEventListener('scroll', () => {
            if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; }
            if (window.innerWidth <= 768) {
                if (preview.classList.contains('is-visible')) hidePreview();
                return;
            }
            if (scrollTick || !preview.classList.contains('is-visible')) return;
            scrollTick = true;
            requestAnimationFrame(() => {
                scrollTick = false;
                const under = document.elementFromPoint(mouseX, mouseY);
                if (!under || !under.closest('.project-item')) hidePreview();
            });
        }, { passive: true });
    }

    window.addEventListener("mouseleave", () => gsap.to(customCursor, { opacity: 0 }));
    window.addEventListener("mouseenter", () => gsap.to(customCursor, { opacity: 1 }));

    // --- LISSAGE DU SCROLL (LENIS + GSAP) ---
    window.lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    // Empêcher Lenis de scroller avec la barre espace (pour l'easter egg)
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            e.stopPropagation();
        }
    }, { capture: true });

    // (Lenis est avancé par le ticker GSAP ci-dessous ; une 2e boucle rAF le faisait avancer 2x par image)

    // Synchronisation ScrollTrigger avec Lenis
    if (typeof ScrollTrigger !== 'undefined') {
        window.lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            window.lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    }

    // --- ANIMATION GSAP POLICE VARIABLE (Huge Text) ---
    const hugeText = document.querySelector('.huge-text');
    if (hugeText && typeof gsap !== 'undefined') {
        const textStr = hugeText.innerText;
        hugeText.innerHTML = textStr.split('').map(char => 
            `<span style="display:inline-block;">${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('');

        const spans = hugeText.querySelectorAll('span');

        const wave = gsap.to(spans, {
            fontWeight: 900,
            y: -20,
            duration: 1,
            stagger: {
                each: 0.1,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut"
            }
        });

        // L'animation ne tourne que quand la section CONTACTS est à l'écran (inutile de la calculer ailleurs)
        wave.pause();
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.create({
            trigger: '#contacts',
            start: 'top bottom',
            end: 'bottom top',
            onToggle: (self) => wave.paused(!self.isActive)
        });
    }
}

// --- SCRAMBLE TEXT EFFECT ON HERO (GSAP ScrambleTextPlugin) ---
(function initScrambleTextEffect() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Wait for DOM and plugins to be ready
    gsap.registerPlugin(ScrollTrigger);
    if (typeof ScrambleTextPlugin !== 'undefined') {
        gsap.registerPlugin(ScrambleTextPlugin);
    }

    // Build a random string with length = original ± tolerance (-5 to +3)
    function buildRandomString(originalLength) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&!?<>[]{}|/\\~^*+=_";
        const offset = Math.floor(Math.random() * 9) - 5; // -5 to +3
        const len = Math.max(1, originalLength + offset);
        let result = '';
        for (let i = 0; i < len; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }

    // Collect all hero text elements that should scramble
    function getHeroTextElements() {
        const els = [];
        const isMobile = window.innerWidth <= 768;
        
        // CTA button (desktop only; on mobile it only displays the arrow via ::after)
        const cta = document.getElementById('cta');
        if (cta && !isMobile) els.push(cta);
        
        // Info text elements (the floating popups, desktop only)
        if (!isMobile) {
            document.querySelectorAll('.info .text').forEach(el => {
                if (el.textContent.trim().length > 0) els.push(el);
            });
        }
        
        // Menu items (the visible text spans)
        document.querySelectorAll('#main-menu a .default').forEach(el => {
            els.push(el);
        });
        
        return els;
    }

    // Store original content for each element
    const originalContents = new Map();
    let scrambleState = 'idle'; // 'idle' | 'scrambled' | 'animating'
    let isInHero = true; // Start in hero section

    function captureOriginals() {
        const els = getHeroTextElements();
        els.forEach(el => {
            if (!originalContents.has(el)) {
                originalContents.set(el, el.innerHTML);
            }
        });
    }

    // Run scramble effect (scramble then reveal original)
    function scrambleAllHeroTexts() {
        if (scrambleState === 'animating') return;
        scrambleState = 'animating';

        const els = getHeroTextElements();
        captureOriginals();

        let completed = 0;
        const total = els.length;

        if (total === 0) {
            scrambleState = 'idle';
            return;
        }

        els.forEach((el, i) => {
            const originalHTML = originalContents.get(el) || el.textContent;
            const plainText = el.textContent.trim();
            
            // Skip empty elements
            if (plainText.length === 0) {
                completed++;
                if (completed >= total) scrambleState = 'idle';
                return;
            }

            // For elements with inner HTML (links, spans), use textContent for scramble
            const scrambledText = buildRandomString(plainText.length);
            const delay = i * 0.05; // Slight stagger

            // Create a timeline: scramble to random → then reveal original
            const tl = gsap.timeline({
                delay: delay,
                onComplete: () => {
                    completed++;
                    if (completed >= total) scrambleState = 'idle';
                }
            });

            // Phase 1: Scramble to random text (right to left)
            tl.to(el, {
                duration: 0.4,
                scrambleText: {
                    text: scrambledText,
                    chars: "upperAndLowerCase",
                    speed: 0.8,
                    rightToLeft: true,
                    revealDelay: 0,
                    tweenLength: false
                }
            });

            // Phase 2: Reveal original text (right to left)
            tl.to(el, {
                duration: 0.6,
                scrambleText: {
                    text: "{original}",
                    chars: "upperAndLowerCase",
                    speed: 0.6,
                    rightToLeft: true,
                    revealDelay: 0.15,
                    tweenLength: true
                },
                onComplete: () => {
                    // Restore original HTML (preserving links, spans, etc.)
                    el.innerHTML = originalHTML;
                }
            });
        });
    }

    // Capture originals once DOM is settled
    setTimeout(captureOriginals, 2000);

    // Debounce to avoid rapid re-trigger
    let scrollDebounce = null;
    let lastScrollY = window.scrollY || 0;
    let heroThreshold = window.innerHeight * 0.7; // 70% of viewport

    // Update threshold on resize
    window.addEventListener('resize', () => {
        heroThreshold = window.innerHeight * 0.7;
    });

    // Listen to scroll events
    function onScrollCheck() {
        const currentY = window.scrollY || document.documentElement.scrollTop || 0;
        const wasInHero = isInHero;
        
        // Determine if we're in the hero zone
        isInHero = currentY < heroThreshold;

        // Trigger scramble when crossing the threshold in either direction
        if (wasInHero !== isInHero) {
            // Re-capture originals (popup contents may have changed)
            captureOriginals();
            
            if (scrollDebounce) clearTimeout(scrollDebounce);
            scrollDebounce = setTimeout(() => {
                scrambleAllHeroTexts();
            }, 50);
        }

        lastScrollY = currentY;
    }

    // Use Lenis scroll event if available, otherwise native scroll
    if (window.lenis) {
        window.lenis.on('scroll', onScrollCheck);
    } else {
        // Fallback: wait for lenis to init, then attach
        const waitForLenis = setInterval(() => {
            if (window.lenis) {
                window.lenis.on('scroll', onScrollCheck);
                clearInterval(waitForLenis);
            }
        }, 500);
        
        // Also listen to native scroll as fallback
        window.addEventListener('scroll', onScrollCheck, { passive: true });
    }

    // Also trigger scramble on initial page load after settling
    // (scroll from 0 counts as being in hero, so first scroll down triggers it)
})();
