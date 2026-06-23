// ── Portfolio Interlude — interlude.js ──
// Présente une compétence (objectif + AC/CE ciblés par les projets) avant
// d'entrer dans la cascade de projets. Hub → interlude → « Commencer » → projets.

import { playTransition } from './transition.js';
import { slideTo, initSlideReveal } from './slide.js';
import { getSkill, SKILLS } from './data.js';

const loadingEl = document.getElementById('loading');
const wrap      = document.getElementById('il-wrap');
const elIndex   = document.getElementById('il-index');
const elTitle   = document.getElementById('il-title');
const elObj     = document.getElementById('il-objective');
const elAcs     = document.getElementById('il-acs');
const elCes     = document.getElementById('il-ces');

const btnStart  = document.getElementById('il-start');
const btnBack   = document.getElementById('il-back');

const params = new URLSearchParams(window.location.search);
const slug = params.get('skill');
const skill = getSkill(slug) || SKILLS[0];
const projects = skill.projects || [];

// ── Agrège et dédoublonne les AC / CE de tous les projets de la compétence ──
function aggregate(key) {
  const seen = new Map();
  projects.forEach((p) => {
    (p[key] || []).forEach((item) => {
      const id = item.code || item.label;
      if (!seen.has(id)) seen.set(id, item);
    });
  });
  return [...seen.values()];
}

function renderItems(container, items) {
  if (!items.length) {
    container.innerHTML = '<div class="il-item"><span class="il-label">À préciser</span></div>';
    return;
  }
  container.innerHTML = items.map((item) => {
    const muted = !item.code;
    return `<div class="il-item">
      <span class="il-code${muted ? ' muted' : ''}">${esc(item.code || '—')}</span>
      <span class="il-label">${esc(item.label)}</span>
    </div>`;
  }).join('');
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ── Remplissage ──
const index = SKILLS.findIndex((s) => s.slug === skill.slug);
elIndex.textContent = `${String(index + 1).padStart(2, '0')} / ${String(SKILLS.length).padStart(2, '0')}`;
elTitle.textContent = skill.label;
elObj.textContent = skill.description || skill.subtitle || '';
renderItems(elAcs, aggregate('acs'));
renderItems(elCes, aggregate('ces'));

document.title = `Portfolio — ${skill.label}`;

// ── Navigation ──
// Interlude → Projets : transition slide.
function goProjects() {
  slideTo(`projects.html?skill=${encodeURIComponent(skill.slug)}`, 'fwd');
}
// Interlude → Hub : transition WebGL (la seule du site).
function goHub() {
  sessionStorage.setItem('pf-transition', '1');
  playTransition(() => { window.location.href = 'index.html'; });
}

btnStart.addEventListener('click', goProjects);
btnBack.addEventListener('click', goHub);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goProjects(); }
  if (e.key === 'Escape') goHub();
});

// ── Apparition ──
// Hub → Interlude est instantané ; Projets → Interlude (retour) arrive en slide.
loadingEl.classList.add('done');
wrap.classList.add('in');
initSlideReveal();
