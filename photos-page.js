// --- PAGE PHOTOS ----------------------------------------------------------
// Dépose tes photos dans img/photos/ et liste-les ici (les 8 premières vont dans
// le bento, et toutes les photos s'affichent dans la grille en cascade).
// Une photo introuvable affiche une tuile placeholder.
const PHOTOS = [];
const PHOTO_COUNT = 20; // img_01.jpg … img_20.jpg
for (let i = 1; i <= PHOTO_COUNT; i++) {
    const n = String(i).padStart(2, '0');
    PHOTOS.push({ src: `img/photos/img_${n}.jpg`, title: `PHOTO ${n}` });
}
const BENTO_COUNT = 8;
const STATIC_INDEX = 2; // la 3e case du bento (index 2) reste fixe au centre

// Copie dédiée au bento pour placer img_18.jpg au centre sans modifier l'ordre de la grille d'archives
const BENTO_PHOTOS = [...PHOTOS];
const centerPhotoIdx = BENTO_PHOTOS.findIndex((p) => p.src.endsWith('img_18.jpg'));
if (centerPhotoIdx !== -1 && centerPhotoIdx !== STATIC_INDEX) {
    [BENTO_PHOTOS[STATIC_INDEX], BENTO_PHOTOS[centerPhotoIdx]] = [BENTO_PHOTOS[centerPhotoIdx], BENTO_PHOTOS[STATIC_INDEX]];
}

gsap.registerPlugin(ScrollTrigger, Flip);

// --- construction du DOM ---
function tile(p, i) {
    const h = (i * 47) % 360;
    return `<img src="${p.src}" alt="${p.title}" loading="eager">
            <div class="ph-tile-fallback" style="--h:${h}">${p.title}</div>`;
}
const gallery = document.getElementById('gallery');
gallery.innerHTML = BENTO_PHOTOS.slice(0, BENTO_COUNT).map((p, i) => i === STATIC_INDEX
    ? `<div class="gallery__item is-static">${tile(p, i)}</div>`
    : `<div class="gallery__item is-flip">
            <div class="flip-inner">
                <div class="flip-face flip-front">${tile(p, i)}</div>
                <div class="flip-face flip-back"></div>
            </div>
       </div>`).join('');

const grid = document.getElementById('ph-grid');
// ordre aléatoire à chaque chargement (F5) : les photos changent de place dans la mosaïque
const SHUFFLED = PHOTOS.map((p, i) => ({ p, i }));
for (let k = SHUFFLED.length - 1; k > 0; k--) {
    const j = Math.floor(Math.random() * (k + 1));
    [SHUFFLED[k], SHUFFLED[j]] = [SHUFFLED[j], SHUFFLED[k]];
}
grid.innerHTML = SHUFFLED.map(({ p, i }) => `
    <figure class="ph-item" data-src="${p.src}">
        <div class="ph-frame">${tile(p, i)}</div>
        <figcaption><span>${String(i + 1).padStart(2, '0')}</span><span>${p.title}</span></figcaption>
    </figure>`).join('');
document.getElementById('ph-count').textContent = `${PHOTOS.length} IMG`;

// --- mosaïque : la forme de chaque tuile suit le ratio réel de la photo (pas de recadrage excessif) ---
const ratios = new Map(); // src -> largeur/hauteur
function layoutMosaic() {
    const cs = getComputedStyle(grid);
    const cols = cs.gridTemplateColumns.split(' ').length;
    const gap = parseFloat(cs.rowGap) || 0;
    const inner = grid.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const colW = (inner - (cols - 1) * gap) / cols;
    const unit = colW / 4;
    grid.style.gridAutoRows = unit + 'px';
    grid.style.gridAutoFlow = 'row'; // placement explicite : plus de "dense"

    // 1. forme de chaque tuile d'après le ratio réel de la photo
    const items = [...grid.querySelectorAll('.ph-item')];
    let squareToggle = false;
    const shape = new Map();
    items.forEach((item) => {
        const r = ratios.get(item.dataset.src) || 1.5;
        let c;
        if (cols === 1) c = 1;
        else if (r > 1.15) c = Math.min(2, cols);              // paysage : large
        else if (r < 0.87) c = 1;                              // portrait : colonne haute
        else { c = (squareToggle = !squareToggle) ? 1 : Math.min(2, cols); } // carré : alterne petit / grand
        const w = c * colW + (c - 1) * gap;
        shape.set(item, { c, rows: Math.max(2, Math.round((w / r + gap) / (unit + gap))) });
    });

    // 2. placement "skyline" : chaque tuile va là où elle laisse le moins de vide
    function pack(order) {
        const colH = Array(cols).fill(0);
        const placed = [];
        let waste = 0;
        order.forEach((item) => {
            const { c, rows } = shape.get(item);
            let best = null;
            for (let s = 0; s + c <= cols; s++) {
                let top = 0;
                for (let k = s; k < s + c; k++) top = Math.max(top, colH[k]);
                let hole = 0;
                for (let k = s; k < s + c; k++) hole += top - colH[k];
                const score = top + hole * 1.5;
                if (!best || score < best.score) best = { s, top, hole, score };
            }
            waste += best.hole;
            placed.push({ item, s: best.s, top: best.top, c, rows });
            for (let k = best.s; k < best.s + c; k++) colH[k] = best.top + rows;
        });
        // 3. bas droit : on étire la dernière tuile de chaque colonne jusqu'à la hauteur max
        const T = Math.max(...colH);
        placed.slice().reverse().forEach((p) => {
            let add = Infinity, last = true;
            for (let k = p.s; k < p.s + p.c; k++) {
                if (p.top + p.rows !== colH[k]) last = false;
                add = Math.min(add, T - colH[k]);
            }
            if (last && add > 0 && add !== Infinity) {
                p.rows += add;
                for (let k = p.s; k < p.s + p.c; k++) colH[k] += add;
            }
        });
        let stretch = 0;
        placed.forEach((p) => { stretch += Math.max(0, p.rows - shape.get(p.item).rows) * p.c; });
        for (let k = 0; k < cols; k++) waste += T - colH[k];
        return { placed, cost: waste * 3 + stretch };
    }

    // 4. on teste beaucoup d'ordres aléatoires et on garde le meilleur (mis en cache par nb de colonnes)
    let best = packCache.get(cols);
    if (!best) {
        best = pack(items);
        for (let n = 0; n < 400; n++) {
            const o = items.slice();
            for (let k = o.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1));[o[k], o[j]] = [o[j], o[k]]; }
            const t = pack(o);
            if (t.cost < best.cost) best = t;
        }
        packCache.set(cols, best);
    }
    best.placed.forEach((p) => {
        p.item.style.gridColumn = `${p.s + 1} / span ${p.c}`;
        p.item.style.gridRow = `${p.top + 1} / span ${p.rows}`;
    });
}
const packCache = new Map();
Promise.all(PHOTOS.map((p) => new Promise((res) => {
    const im = new Image();
    im.onload = () => { ratios.set(p.src, im.naturalWidth / im.naturalHeight); res(); };
    im.onerror = () => res();
    im.src = p.src;
}))).then(() => { layoutMosaic(); ScrollTrigger.refresh(); });
window.addEventListener('resize', () => { layoutMosaic(); });

// une image absente laisse apparaître le placeholder
document.querySelectorAll('.gallery__item img, .ph-frame img').forEach((img) => {
    img.addEventListener('error', () => img.remove());
});

// Timeline qui porte toutes les animations de flip (pause = freeze)
const flipTL = gsap.timeline();
const FREEZE_AT = 0.6; // progression du scroll du bento à partir de laquelle les flips se figent
let freezeWanted = false;   // le scroll demande le freeze
let activeFlips = 0;        // flips en cours (on ne fige jamais une tuile à mi-rotation)
function flipsAtRest() {
    return [...document.querySelectorAll('.is-flip .flip-inner')].every((el) => {
        const r = Math.abs(gsap.getProperty(el, 'rotationX')) % 180;
        return r < 0.01 || r > 179.99;
    });
}
function syncFreeze() {
    const p = freezeWanted && activeFlips <= 0 && flipsAtRest();
    if (p !== flipTL.paused()) flipTL.paused(p);
}
// vérifié à chaque frame : la pause n'arrive que quand TOUTES les tuiles sont bien à plat
gsap.ticker.add(() => { if (freezeWanted && !flipTL.paused()) syncFreeze(); });

// --- tuiles du bento qui se retournent (réveil rétro) et montrent une autre photo au hasard ---
(function initFlips() {
    const visible = new Set();            // photos actuellement à l'écran dans le bento
    for (let i = 0; i < BENTO_COUNT; i++) visible.add(i);

    function fill(face, idx) {
        face.innerHTML = tile(BENTO_PHOTOS[idx], idx);
        face.querySelectorAll('img').forEach((im) => im.addEventListener('error', () => im.remove()));
    }

    function flipOnce(item) {
        // freeze demandé : ne pas démarrer un nouveau flip, on réessaie juste après
        if (freezeWanted) { flipTL.call(() => flipOnce(item), null, flipTL.time() + 0.5); return; }
        const inner = item.querySelector('.flip-inner');
        const showingFront = !item._flipped;
        const hidden = item.querySelector(showingFront ? '.flip-back' : '.flip-front');

        // nouvelle photo aléatoire, différente de celles déjà visibles
        const pool = BENTO_PHOTOS.map((_, i) => i).filter((i) => !visible.has(i));
        const idx = pool[Math.floor(Math.random() * pool.length)];
        const old = item._idx;
        visible.add(idx);
        fill(hidden, idx);

        // tout passe par flipTL : le mettre en pause fige flips en cours ET prochains flips
        const t = flipTL.time();
        activeFlips++;
        flipTL.to(inner, {
            rotationX: '+=180',
            duration: 1.0,
            ease: 'sine.inOut', // sans perspective, la compression suit un cosinus : sine donne un mouvement plus doux
            onComplete: () => {
                visible.delete(old); item._idx = idx; item._flipped = !item._flipped;
                activeFlips = Math.max(0, activeFlips - 1); syncFreeze();
            }
        }, t);
        flipTL.call(() => flipOnce(item), null, t + 2.5 + Math.random() * 4);
    }

    gallery.querySelectorAll('.is-flip').forEach((item) => {
        item._idx = [...gallery.children].indexOf(item);
        item._flipped = false;
        flipTL.call(() => flipOnce(item), null, 0.8 + Math.random() * 3.5);
    });
})();

// --- scroll fluide (Lenis) synchronisé avec ScrollTrigger ---
const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
window.lenis = lenis;
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);

// --- 1. bento scrubbé (Flip + expoScale, épinglé) ---
let flipCtx;
function createBento() {
    const el = document.getElementById('gallery');
    const items = el.querySelectorAll('.gallery__item');
    flipCtx && flipCtx.revert();
    el.classList.remove('gallery--final');

    flipCtx = gsap.context(() => {
        el.classList.add('gallery--final');
        const state = Flip.getState(items);
        el.classList.remove('gallery--final');

        const flip = Flip.to(state, { simple: true, ease: 'expoScale(1, 5)' });
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: el,
                start: 'center center',
                end: '+=140%',
                scrub: true,
                pin: el.parentNode,
                // photo 3 (quasi) plein écran : les flips se figent ; on remonte : ils reprennent
                onUpdate: (self) => {
                    freezeWanted = self.progress >= FREEZE_AT;
                    syncFreeze();
                }
            }
        });
        tl.add(flip, 0);
        // le titre et l'indice s'effacent pendant que le bento grandit
        tl.to('#ph-title', { autoAlpha: 0, scale: 1.4, ease: 'none', duration: 0.35 }, 0);
        tl.to('#ph-hint', { autoAlpha: 0, ease: 'none', duration: 0.1 }, 0);
        return () => gsap.set(items, { clearProps: 'all' });
    });
}
createBento();
let rt;
window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(createBento, 150); });

// --- 2. stagger au scroll (ScrollTrigger.batch) ---
gsap.set('.ph-item', { y: 60 });
ScrollTrigger.batch('.ph-item', {
    start: 'top 92%',
    onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, stagger: 0.2, duration: 1, ease: 'sine.out' })
});

// --- 3. popup / lightbox au clic sur une photo de l'archive ---
const popup = document.createElement('div');
popup.id = 'ph-popup';
popup.setAttribute('aria-hidden', 'true');
const popupImg = document.createElement('img');
popupImg.className = 'ph-popup-img';
popupImg.alt = '';
popup.appendChild(popupImg);
document.body.appendChild(popup);

let popupOpen = false;
function openPhotoPopup(src, alt) {
    if (!src || popupOpen) return;
    popupOpen = true;
    popupImg.src = src;
    popupImg.alt = alt || '';
    popup.classList.add('is-open');
    popup.setAttribute('aria-hidden', 'false');
    lenis.stop();
    gsap.killTweensOf([popup, popupImg]);
    gsap.set(popup, { visibility: 'visible' });
    gsap.fromTo(popup, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    gsap.fromTo(popupImg, { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'power3.out' });
}

function closePhotoPopup() {
    if (!popupOpen) return;
    popupOpen = false;
    popup.classList.remove('is-open');
    popup.setAttribute('aria-hidden', 'true');
    gsap.killTweensOf([popup, popupImg]);
    gsap.to(popupImg, { scale: 0.94, opacity: 0, duration: 0.22, ease: 'power2.in' });
    gsap.to(popup, {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
            gsap.set(popup, { visibility: 'hidden' });
            popupImg.removeAttribute('src');
            lenis.start();
        }
    });
}

grid.addEventListener('click', (e) => {
    const item = e.target.closest('.ph-item');
    if (!item) return;
    const img = item.querySelector('img');
    if (!img) return;
    openPhotoPopup(item.dataset.src || img.getAttribute('src'), img.alt);
});

// Appuyer en dehors de l'image referme la popup
popup.addEventListener('click', (e) => {
    if (!e.target.closest('.ph-popup-img')) {
        closePhotoPopup();
    }
});

window.addEventListener('keydown', (e) => {
    if (popupOpen && e.key === 'Escape') closePhotoPopup();
});

// --- curseur custom ---
const cur = document.getElementById('custom-cursor');
cur.style.opacity = '0';
const moveCur = (cx, cy) => {
    if (cur.style.opacity === '0') cur.style.opacity = '1';
    gsap.to(cur, { xPercent: -50, yPercent: -50, left: cx, top: cy, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
};
window.addEventListener('mousemove', (e) => moveCur(e.clientX, e.clientY));
window.addEventListener('touchstart', (e) => { if (e.touches && e.touches[0]) moveCur(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
window.addEventListener('touchmove', (e) => { if (e.touches && e.touches[0]) moveCur(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
document.addEventListener('mouseover', (e) => { if (e.target.closest('a, .ph-item')) cur.classList.add('hover-link'); });
document.addEventListener('mouseout', (e) => { if (e.target.closest('a, .ph-item')) cur.classList.remove('hover-link'); });

// --- transitions de page (fondu noir) ---
const fade = document.getElementById('page-fade');
gsap.to(fade, { opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.1 });
document.querySelectorAll('a[href="index.html"]').forEach((a) => {
    a.addEventListener('click', (e) => {
        e.preventDefault();
        lenis.stop();
        gsap.to(fade, { opacity: 1, duration: 0.6, ease: 'power2.inOut', onComplete: () => { location.href = 'index.html'; } });
    });
});
window.addEventListener('pageshow', (e) => { if (e.persisted) { gsap.set(fade, { opacity: 0 }); lenis.start(); } });
