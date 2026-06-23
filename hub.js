// ── Portfolio Hub : hub.js ──
// Réseau de nodes : "MMI 2ÈME" au centre + 5 compétences autour,
// reliées par des traits animés (canvas). Clic sur une compétence →
// transition shader → page projets.

import { playTransitionOut } from './transition.js';
import { SKILLS } from './data.js';

const canvas = document.getElementById('network-canvas');
const ctx = canvas.getContext('2d');
const nodesWorld = document.getElementById('nodes-world');
const loadingEl = document.getElementById('loading');

// ── State ──
let nodes = [];          // tous les nodes (centre + compétences)
let centerNode = null;
let skillNodes = [];
let roamingEdges = [];
let hoveredSlug = null;

// ── Config ──
const RADIUS_RATIO = 0.34;  // rayon = ratio × plus petite dimension de l'écran
const RADIUS_MIN = 200;
const RADIUS_MAX = 360;
const DRIFT_SPEED = 0.06;  // px/frame
const DRIFT_CHANGE = 0.012;
const MAX_DRIFT = 22;
const LINE_COLOR = 'rgba(0, 0, 0, 1)';

// ── Init ──
init();

function init() {
    buildNodes();
    initRoamingEdges();
    layout();
    resizeCanvas();
    setupEvents();
    startAnimation();
    loadingEl.classList.add('done');

    // Si on arrive via une transition, on joue la révélation (noir → clair).
    // Sinon (visite directe), on retire juste le cache : pas de noir forcé.
    // Dans les deux cas le cache anti-flash part de façon synchrone (sans rAF,
    // qui ne tourne pas si l'onglet est masqué) : aucune frame blanche possible.
    const fromTransition = sessionStorage.getItem('pf-transition');
    sessionStorage.removeItem('pf-transition');
    if (fromTransition) playTransitionOut();
    document.getElementById('boot-cover')?.remove();
}

// ── Création des nodes ──
function buildNodes() {
    // Node central
    const centerEl = document.createElement('div');
    centerEl.className = 'node center-node';
    centerEl.innerHTML = `
        <div class="c-title">MMI</div>
        <div class="c-title">PORTFOLIO</div>`;
    nodesWorld.appendChild(centerEl);

    centerNode = makeNode(centerEl, { isCenter: true });
    nodes.push(centerNode);

    // Nodes compétences
    SKILLS.forEach((skill) => {
        const el = document.createElement('div');
        el.className = 'node skill-node';
        el.innerHTML = `
            <div class="skill-frame">
                <div class="skill-name">${skill.label}</div>
            </div>`;

        el.addEventListener('mouseenter', () => { hoveredSlug = skill.slug; });
        el.addEventListener('mouseleave', () => { if (hoveredSlug === skill.slug) hoveredSlug = null; });
        el.addEventListener('click', () => {
            // Pas de transition Hub → Interlude : navigation directe.
            window.location.href = `interlude.html?skill=${encodeURIComponent(skill.slug)}`;
        });

        nodesWorld.appendChild(el);
        const node = makeNode(el, { isCenter: false, skill });
        nodes.push(node);
        skillNodes.push(node);
    });
}

function makeNode(el, { isCenter, skill = null }) {
    return {
        el,
        skill,
        isCenter,
        // position (centre du node, en coordonnées écran)
        x: 0, y: 0,
        baseX: 0, baseY: 0,
        vx: (Math.random() - 0.5) * DRIFT_SPEED * 2,
        vy: (Math.random() - 0.5) * DRIFT_SPEED * 2,
        w: 0, h: 0,
    };
}

// ── Roaming edges : connexions animées entre compétences ──
function initRoamingEdges() {
    skillNodes.forEach((_, i) => {
        roamingEdges.push({
            source: i,
            current: pickTarget(i),
            next: -1,
            progress: 0,
            holdTime: 0,
            holdDuration: 2500 + Math.random() * 4000,
            transitionDuration: 1600 + Math.random() * 1200,
            transitioning: false,
        });
    });
}

function pickTarget(srcIdx, excludeIdx = -1) {
    const cands = [];
    for (let j = 0; j < skillNodes.length; j++) {
        if (j === srcIdx || j === excludeIdx) continue;
        cands.push(j);
    }
    if (cands.length === 0) return srcIdx === 0 ? 1 : 0;
    return cands[Math.floor(Math.random() * cands.length)];
}

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function updateRoamingEdges(dt) {
    roamingEdges.forEach((re) => {
        if (!re.transitioning) {
            re.holdTime += dt;
            if (re.holdTime >= re.holdDuration) {
                re.next = pickTarget(re.source, re.current);
                re.transitioning = true;
                re.progress = 0;
            }
        } else {
            re.progress += dt / re.transitionDuration;
            if (re.progress >= 1) {
                re.current = re.next;
                re.next = -1;
                re.transitioning = false;
                re.progress = 0;
                re.holdTime = 0;
                re.holdDuration = 2500 + Math.random() * 4000;
                re.transitionDuration = 1600 + Math.random() * 1200;
            }
        }
    });
}

// ── Placement : centre au milieu, compétences en cercle ──
function layout() {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    // mesurer les tailles réelles
    nodes.forEach((n) => {
        const r = n.el.getBoundingClientRect();
        n.w = r.width;
        n.h = r.height;
    });

    centerNode.baseX = cx;
    centerNode.baseY = cy;
    centerNode.x = cx;
    centerNode.y = cy;

    const radius = Math.max(RADIUS_MIN, Math.min(RADIUS_MAX,
        Math.min(window.innerWidth, window.innerHeight) * RADIUS_RATIO));

    const n = skillNodes.length;
    skillNodes.forEach((node, i) => {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2; // départ en haut
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        node.baseX = x;
        node.baseY = y;
        node.x = x;
        node.y = y;
    });
}

// ── Canvas ──
function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function line(ax, ay, bx, by, alpha) {
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.strokeStyle = alpha === 1 ? LINE_COLOR : `rgba(0,0,0,${alpha})`;
    ctx.lineWidth = 0.9;
    ctx.stroke();
}

function drawEdges() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Traits statiques : centre → chaque compétence
    skillNodes.forEach((node) => {
        line(centerNode.x, centerNode.y, node.x, node.y, 1);
    });

    // Roaming edges : entre compétences (crossfade)
    roamingEdges.forEach((re) => {
        const src = skillNodes[re.source];
        if (!re.transitioning) {
            const tgt = skillNodes[re.current];
            line(src.x, src.y, tgt.x, tgt.y, 1);
        } else {
            const t = easeInOutCubic(re.progress);
            const cur = skillNodes[re.current];
            const nxt = skillNodes[re.next];
            if (1 - t > 0.01) line(src.x, src.y, cur.x, cur.y, 1 - t);
            if (t > 0.01) line(src.x, src.y, nxt.x, nxt.y, t);
        }
    });
}

// ── Animation loop ──
function startAnimation() {
    let lastTime = performance.now();
    function frame() {
        const now = performance.now();
        const dt = now - lastTime;
        lastTime = now;

        updateRoamingEdges(dt);

        nodes.forEach((node) => {
            // le centre dérive très peu, les compétences un peu plus
            const speed = node.isCenter ? DRIFT_SPEED * 0.4 : DRIFT_SPEED;

            if (Math.random() < DRIFT_CHANGE) {
                node.vx += (Math.random() - 0.5) * speed;
                node.vy += (Math.random() - 0.5) * speed;
            }
            node.vx *= 0.998;
            node.vy *= 0.998;
            node.vx = Math.max(-speed, Math.min(speed, node.vx));
            node.vy = Math.max(-speed, Math.min(speed, node.vy));

            node.x += node.vx;
            node.y += node.vy;

            // rappel élastique vers la position de base
            const dx = node.x - node.baseX;
            const dy = node.y - node.baseY;
            if (Math.abs(dx) > MAX_DRIFT) node.vx -= Math.sign(dx) * 0.004;
            if (Math.abs(dy) > MAX_DRIFT) node.vy -= Math.sign(dy) * 0.004;

            // placer l'élément (x,y = centre → on décale de la moitié de la taille)
            const left = node.x - node.w / 2;
            const top = node.y - node.h / 2;
            node.el.style.transform = `translate(${left}px, ${top}px)`;
        });

        drawEdges();
        requestAnimationFrame(frame);
    }
    frame();
}

// ── Events ──
function setupEvents() {
    window.addEventListener('resize', () => {
        resizeCanvas();
        layout();
    });
}
