// ── Portfolio Projets : projects.js ──
// Cover-flow en cascade de cartes projet rectangulaires (720×405),
// + overlay détail. Pas de lecteur audio : c'est une vitrine de projets.

import { slideTo, initSlideReveal } from './slide.js';
import { getSkill, SKILLS } from './data.js';

// Arrivée via slide (depuis l'interlude ou la conclusion) : le panneau ressort.
initSlideReveal();

const scene         = document.getElementById('carousel-scene');
const cursorLabel   = document.getElementById('cursor-label');
const loadingEl     = document.getElementById('loading');

const shTitle       = document.getElementById('sh-title');
const shSub         = document.getElementById('sh-sub');
const counterName   = document.getElementById('counter-name');
const counterAccce  = document.getElementById('counter-accce');
const counterIdx    = document.getElementById('counter-idx');

const projectDetail = document.getElementById('project-detail');
const pdMainImg     = document.getElementById('pd-main-img');
const pdCaption     = document.getElementById('pd-caption');
const pdThumbs      = document.getElementById('pd-thumbs');
const pdContent     = document.getElementById('pd-content');
const btnBack       = document.getElementById('btn-back');

// ── Géométrie cascade (cartes rectangulaires) ──
const CARD_W       = 720;
const CARD_H       = 405;
const X_STEP       = 300;
const Y_STEP       = -55;
const Z_STEP       = -170;
const ROT_Y        = -16;
const ROT_X        = 3;
const SCROLL_SPEED = 0.004;
const LERP_FACTOR  = 0.065;

// ── State ──
let skill = null;
let projects = [];
let cards = [];
let detailOpen = false;

let targetScroll = 0;
let currentScroll = 0;
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let hoveredIndex = -1;
let frontIndex = 0;
let isDragging = false;
let dragStartX = 0;
let dragScrollStart = 0;
let dragMoved = false;

// ── Init ──
(() => {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('skill');
  skill = getSkill(slug) || SKILLS[0];

  projects = skill.projects || [];

  shTitle.textContent = skill.label;
  shSub.textContent = skill.subtitle || '';
  document.title = `Portfolio | ${skill.label}`;

  buildCascade();
  setupEvents();
  startAnimation();
  loadingEl.classList.add('done');
})();

// ── Placeholder visuel si pas d'image ──
function placeholder(title) {
  const safe = (title || '').replace(/[<>&]/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 405">
    <rect width="720" height="405" fill="#f0f0f0"/>
    <rect x="1" y="1" width="718" height="403" fill="none" stroke="#000" stroke-width="1.5"/>
    <text x="360" y="208" text-anchor="middle" font-family="Inter,sans-serif" font-size="34" font-weight="700" fill="#bbb">${safe}</text>
  </svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

function coverFor(project) {
  return project.image && project.image.trim() ? project.image : placeholder(project.title);
}

// ── Construction des cartes ──
function buildCascade() {
  projects.forEach((project, i) => {
    const card = document.createElement('div');
    card.className = 'cascade-card';

    const src = coverFor(project);
    const ph = placeholder(project.title);
    card.innerHTML = `<img src="${src}" alt="${(project.title || '').replace(/"/g, '&quot;')}" loading="lazy"
      onerror="this.onerror=null;this.src='${ph}'" />`;

    card.addEventListener('mouseenter', () => { hoveredIndex = i; });
    card.addEventListener('mouseleave', () => { if (hoveredIndex === i) hoveredIndex = -1; });
    card.addEventListener('click', () => { if (!dragMoved) openDetail(project); });

    scene.appendChild(card);
    // Stagger wiggle so cards don't move in sync
    card.querySelector('img').style.animationDelay = `${(Math.random() * 3).toFixed(2)}s`;
    cards.push(card);
  });
}

function updateCardPositions() {
  const count = projects.length;
  if (count === 0) return;

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const visibleSlots = Math.floor((vw * 0.85) / X_STEP);

  let baseX, baseY;
  if (count <= visibleSlots) {
    const spreadW = (count - 1) * X_STEP + CARD_W;
    const spreadH = Math.abs((count - 1) * Y_STEP) + CARD_H;
    baseX = (vw - spreadW) / 2 + CARD_W / 2;
    baseY = (vh + spreadH) / 2 - CARD_H / 2 - 60;
  } else {
    baseX = vw * 0.18;
    baseY = vh * 0.56;
  }

  const ns = ((currentScroll % count) + count) % count;

  for (let i = 0; i < count; i++) {
    let rel = i - ns;
    if (rel > count / 2)  rel -= count;
    if (rel < -count / 2) rel += count;

    const card = cards[i];
    if (rel < -1.2 || rel > 9) {
      card.style.opacity = '0';
      card.style.pointerEvents = 'none';
      continue;
    }

    const x = baseX + rel * X_STEP - CARD_W / 2;
    const y = baseY + rel * Y_STEP - CARD_H / 2;
    const z = rel * Z_STEP;

    let opacity = 1;
    if (rel < 0) opacity = Math.max(0, 1 + rel);
    if (rel > 7) opacity = Math.max(0, 1 - (rel - 7) / 2);
    const zIndex = 100 - Math.round(rel);

    card.style.opacity  = opacity;
    card.style.zIndex   = zIndex;
    card.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none';
    card.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${ROT_Y}deg) rotateX(${ROT_X}deg)`;
  }
}

// ── Animation loop ──
function startAnimation() {
  function frame() {
    currentScroll += (targetScroll - currentScroll) * LERP_FACTOR;

    updateCardPositions();
    updateCounter();

    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;
    cursorLabel.style.left = `${cursorX + 22}px`;
    cursorLabel.style.top  = `${cursorY - 8}px`;

    if (hoveredIndex >= 0 && projects[hoveredIndex]) {
      cursorLabel.textContent = projects[hoveredIndex].title;
      cursorLabel.classList.add('visible');
    } else {
      cursorLabel.classList.remove('visible');
    }

    requestAnimationFrame(frame);
  }
  frame();
}

function updateCounter() {
  const count = projects.length;
  if (count === 0) return;
  const ns = ((currentScroll % count) + count) % count;
  frontIndex = Math.round(ns) % count;
  const project = projects[frontIndex];
  if (project) {
    counterName.textContent = project.title;
    counterAccce.textContent = accceCodes(project);
    counterIdx.textContent = `${String(frontIndex + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')}`;
  }
}

// Codes AC/CE résumés (ex: "AC22.01 · CE2.02") pour le compteur.
function accceCodes(project) {
  const codes = [
    ...(project.acs || []).map((a) => a.code),
    ...(project.ces || []).map((c) => c.code),
  ].filter(Boolean);
  return codes.join(' · ');
}

// ── Events ──
function setupEvents() {
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (detailOpen) { closeDetail(); }
      else { goHome(); }
      return;
    }
    if (detailOpen) return;
    if (e.key === 'Enter' && projects[frontIndex]) openDetail(projects[frontIndex]);
  });

  btnBack.addEventListener('click', closeDetail);
}

// ── Retour à l'interlude (slide arrière) ──
function goHome() {
  slideTo(`interlude.html?skill=${encodeURIComponent(skill.slug)}`, 'back');
}
document.getElementById('sh-back').addEventListener('click', (e) => {
  e.preventDefault();
  goHome();
});

// ── Vers la conclusion (slide avant) ──
document.getElementById('to-conclusion').addEventListener('click', () => {
  slideTo(`conclusion.html?skill=${encodeURIComponent(skill.slug)}`, 'fwd');
});

// ── Détail projet (éditorial 2 colonnes) ──
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Placeholder pour la « preuve » (image-trace à venir).
function proofPlaceholder() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 405">
    <rect width="720" height="405" fill="#ececec"/>
    <rect x="2" y="2" width="716" height="401" fill="none" stroke="rgba(0,0,0,0.22)" stroke-dasharray="11 9" stroke-width="2"/>
    <text x="360" y="210" text-anchor="middle" font-family="Inter,sans-serif" font-size="24" font-weight="600" letter-spacing="3" fill="#aaa">PREUVE - A VENIR</text>
  </svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

function accRow(item) {
  const muted = !item.code;
  return `<div class="accce-row"><span class="accce-code${muted ? ' muted' : ''}">${esc(item.code || '—')}</span><span class="accce-text">${esc(item.label)}</span></div>`;
}

function openDetail(project) {
  detailOpen = true;

  // ── Galerie : aperçu du projet + preuve ──
  const proofSrc = project.proofImage && project.proofImage.trim() ? project.proofImage : proofPlaceholder();
  const gallery = [
    { src: coverFor(project), label: 'Aperçu du projet' },
    { src: proofSrc, label: project.proof ? `Preuve — ${project.proof}` : 'Preuve' },
  ];

  function showImg(i) {
    pdMainImg.src = gallery[i].src;
    pdMainImg.onerror = () => { pdMainImg.onerror = null; pdMainImg.src = placeholder(project.title); };
    pdCaption.textContent = gallery[i].label;
    [...pdThumbs.children].forEach((t, k) => t.classList.toggle('active', k === i));
  }

  pdThumbs.innerHTML = gallery
    .map((g, i) => `<div class="pd-thumb${i === 0 ? ' active' : ''}" data-i="${i}"><img src="${esc(g.src)}" alt="" /></div>`)
    .join('');
  [...pdThumbs.children].forEach((t) => t.addEventListener('click', () => showImg(parseInt(t.dataset.i, 10))));
  showImg(0);

  // ── Contenu ──
  const eyebrow = [skill.label, project.context].filter(Boolean).join('  ·  ');
  const sub = [project.role, project.year].filter(Boolean).join('  ·  ');
  const acRows = (project.acs || []).map(accRow).join('');
  const ceRows = (project.ces || []).map(accRow).join('');
  const tags = (project.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('');
  const links = (project.links || [])
    .map((l, i) => `<a class="link-btn${i > 0 ? ' ghost' : ''}" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.label)}</a>`)
    .join('');

  const html = [];
  html.push(`<div class="pd-eyebrow">${esc(eyebrow)}</div>`);
  html.push(`<h2 class="pd-title">${esc(project.title)}</h2>`);
  if (sub) html.push(`<div class="pd-sub">${esc(sub)}</div>`);
  if (project.description) html.push(`<div class="pd-section"><div class="pd-label">Situation</div><div class="pd-text">${esc(project.description)}</div></div>`);
  if (acRows) html.push(`<div class="pd-section"><div class="pd-label">Apprentissages critiques (AC)</div>${acRows}</div>`);
  if (ceRows) html.push(`<div class="pd-section"><div class="pd-label">Composantes essentielles (CE)</div>${ceRows}</div>`);
  if (project.justification) html.push(`<div class="pd-section"><div class="pd-label">Pourquoi ces AC / CE ?</div><div class="pd-justif">${esc(project.justification)}</div></div>`);
  if (project.critique) html.push(`<div class="pd-section"><div class="pd-label">Prise de recul</div><div class="pd-critique">${esc(project.critique)}</div></div>`);
  if (tags) html.push(`<div class="pd-section pd-tags">${tags}</div>`);
  if (links) html.push(`<div class="pd-links">${links}</div>`);

  pdContent.innerHTML = html.join('');
  pdContent.scrollTop = 0;

  projectDetail.classList.add('open');
}

function closeDetail() {
  projectDetail.classList.remove('open');
  detailOpen = false;
}
