// ── Portfolio Conclusion — conclusion.js (placeholder) ──
import { slideTo, initSlideReveal } from './slide.js';

const params = new URLSearchParams(window.location.search);
const skill = params.get('skill') || '';

// Retour aux projets (slide arrière), vers la compétence d'où l'on vient.
document.getElementById('cc-back').addEventListener('click', () => {
  const url = skill ? `projects.html?skill=${encodeURIComponent(skill)}` : 'index.html';
  slideTo(url, 'back');
});

// Le lien « Hub » navigue directement (pas de transition, comme Hub ↔ Interlude).

initSlideReveal();
