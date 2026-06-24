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
const pdContainer   = document.getElementById('pd-container');
const btnBack       = document.getElementById('btn-back');

const lightbox      = document.getElementById('lightbox');
const lightboxImg   = lightbox.querySelector('img');
const lightboxClose = document.getElementById('lightbox-close');

// Intervalles de diaporama actifs (nettoyés à la fermeture du détail).
let slideshowTimers = [];

function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt || '';
  lightbox.classList.add('open');
}
function closeLightbox() {
  lightbox.classList.remove('open');
}
lightbox.addEventListener('click', (e) => {
  if (e.target === lightboxImg) return; // clic sur l'image : ne pas fermer
  closeLightbox();
});
lightboxClose.addEventListener('click', closeLightbox);
// Capture-phase : si le lightbox est ouvert, Échap le ferme SANS fermer le détail.
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('open')) {
    e.stopImmediatePropagation();
    closeLightbox();
  }
}, true);

// Démarre chaque diaporama [data-slideshow] présent dans le conteneur.
function initSlideshows(root) {
  root.querySelectorAll('[data-slideshow]').forEach((box) => {
    const slides = [...box.querySelectorAll('.pd-slide')];
    const dots   = [...box.querySelectorAll('.pd-slideshow-dots span')];
    if (slides.length < 2) return;

    const delay = parseInt(box.dataset.interval, 10) || 3000;
    let idx = 0;

    const timer = setInterval(() => {
      slides[idx].classList.remove('is-active');
      dots[idx]?.classList.remove('is-active');
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add('is-active');
      dots[idx]?.classList.add('is-active');
    }, delay);
    slideshowTimers.push(timer);

    const enlarge = () => openLightbox(slides[idx].src, slides[idx].alt);
    box.addEventListener('click', enlarge);
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); enlarge(); }
    });
  });
}

function clearSlideshows() {
  slideshowTimers.forEach(clearInterval);
  slideshowTimers = [];
}

// Active chaque comparateur avant/après [data-baslider] (glissé souris/tactile + flèches).
function initBaSliders(root) {
  root.querySelectorAll('[data-baslider]').forEach((el) => {
    const before  = el.querySelector('.ba-before');
    const divider = el.querySelector('.ba-divider');
    const grip    = el.querySelector('.ba-grip');
    if (!before || !divider) return;

    let pos = 50;
    const setPos = (pct) => {
      pos = Math.max(0, Math.min(100, pct));
      before.style.clipPath = `inset(0 ${100 - pos}% 0 0)`;
      divider.style.left = pos + '%';
      if (grip) grip.style.left = pos + '%';
    };
    const fromEvent = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      setPos(((cx - rect.left) / rect.width) * 100);
    };

    el.addEventListener('pointerdown', (e) => {
      fromEvent(e);
      const move = (ev) => { fromEvent(ev); ev.preventDefault(); };
      const up = () => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  { setPos(pos - 4); e.preventDefault(); }
      if (e.key === 'ArrowRight') { setPos(pos + 4); e.preventDefault(); }
    });

    setPos(50);
  });
}

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

function openDetail(project) {
  detailOpen = true;

  const eyebrow = [skill.label, project.context, project.role, project.year].filter(Boolean).join('  ·  ');
  
  const allAcCe = [...(project.ces || []), ...(project.acs || [])];
  let metaHtml = '';
  if (allAcCe.length > 0) {
    metaHtml = allAcCe.map(i => `<div class="pd-meta-item"><span class="pd-meta-accent">${i.code}</span> ${(i.label || '').toUpperCase()}</div>`).join('');
  }

  const skillIndex = SKILLS.indexOf(skill);
  const coverSrc = `img/${skillIndex + 1}/main.png`;
  const proofSrc = project.proofImage && project.proofImage.trim() ? project.proofImage : null;
  const tags = (project.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('');
  const links = (project.links || [])
    .map((l, i) => `<a class="link-btn${i > 0 ? ' ghost' : ''}" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.label)}</a>`)
    .join('');

  const html = [];
  
  html.push(`<div class="pd-header">`);
  html.push(`<div class="pd-eyebrow">${esc(eyebrow)}</div>`);
  html.push(`<h2 class="pd-title" style="margin-bottom: 16px;">${esc(project.title)}</h2>`);
  if (tags) html.push(`<div class="pd-tags" style="margin-bottom: 24px;">${tags}</div>`);
  if (metaHtml) html.push(`<div class="pd-meta-row">${metaHtml}</div>`);
  html.push(`</div>`);

  html.push(`<div class="pd-hero"><img src="${esc(coverSrc)}" alt=""/></div>`);

  html.push(`<div class="pd-content-block">`);
  
  if (project.contentHtml) {
    html.push(project.contentHtml);
  } else {
    const chapters = [];
    if (project.description) {
      chapters.push({
        eyebrow: 'Démarche',
        title: 'Contexte & approche',
        body: `<p class="pd-lead">${esc(project.description)}</p>`,
      });
    }

    if (proofSrc || project.proof) {
      const proofMedia = proofSrc
        ? `<div class="pd-proof-frame"><img src="${esc(proofSrc)}" alt=""/></div>`
        : `<div class="pd-proof-frame"><div class="pd-proof-placeholder">Visuel à venir</div></div>`;
      chapters.push({
        eyebrow: 'Trace',
        title: 'La preuve',
        body: `
          <figure class="pd-proof-figure">
            ${proofMedia}
            ${project.proof ? `<figcaption class="pd-proof-figcaption">${esc(project.proof)}</figcaption>` : ''}
          </figure>
        `,
      });
    }

    if (project.justification) {
      const codePills = allAcCe
        .filter((i) => i.code)
        .map((i) => `<span class="code-pill">${esc(i.code)}</span>`)
        .join('');
      chapters.push({
        eyebrow: 'Référentiel',
        title: 'Pourquoi ces AC / CE',
        body: `
          <div class="pd-justif-card">
            ${codePills ? `<div class="pd-justif-card-codes">${codePills}</div>` : ''}
            <div class="pd-justif-card-label">Justification</div>
            <p>${esc(project.justification)}</p>
          </div>
        `,
      });
    }

    if (project.critique) {
      chapters.push({
        eyebrow: 'Réflexion',
        title: 'Prise de recul',
        body: `<div class="pd-critique-callout"><p>${esc(project.critique)}</p></div>`,
      });
    }

    chapters.forEach((ch, i) => {
      const num = String(i + 1).padStart(2, '0');
      html.push(`
        <section class="pd-chapter">
          <div class="pd-chapter-num">${num}</div>
          <div class="pd-chapter-body">
            <div class="pd-chapter-eyebrow">${esc(ch.eyebrow)}</div>
            <h3 class="pd-chapter-title">${esc(ch.title)}</h3>
            ${ch.body}
          </div>
        </section>
      `);
    });
  }

  if (links) {
    html.push(`<div class="pd-footer">`);
    html.push(`<div class="pd-links">${links}</div>`);
    html.push(`</div>`);
  }
  
  html.push(`</div>`);

  pdContainer.innerHTML = html.join('');
  projectDetail.scrollTop = 0;

  clearSlideshows();
  initSlideshows(pdContainer);
  initBaSliders(pdContainer);

  const proofFrames = pdContainer.querySelectorAll('.pd-proof-frame');
  proofFrames.forEach(frame => {
    // Le diaporama gère déjà son propre clic ; le comparateur avant/après se manipule au glissé.
    if (frame.classList.contains('pd-slideshow') || frame.querySelector('[data-baslider]')) return;
    frame.addEventListener('click', () => {
      const activeImg = frame.querySelector('img.is-active') || frame.querySelector('img');
      if (activeImg && activeImg.src) {
        openLightbox(activeImg.src);
      }
    });
  });

  projectDetail.classList.add('open');
}

function closeDetail() {
  projectDetail.classList.remove('open');
  detailOpen = false;
  closeLightbox();
  clearSlideshows();
}
