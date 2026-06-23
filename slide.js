// ── Transition slide (CSS, sans WebGL) ──
// Un panneau noir balaie l'écran : il entre pour couvrir (départ), puis sur la
// page d'arrivée il ressort pour révéler le contenu. Pas de WebGL, pas de
// dépendance à requestAnimationFrame (tout est piloté par setTimeout + CSS).
//
// Chaque page « slide » doit contenir :
//   • dans <head> :  <script>(function(){if(sessionStorage.getItem('pf-slide'))
//                    document.documentElement.classList.add('pf-cover');})();</script>
//   • dans <body> :  <div id="slide-panel"></div>
//   • le CSS de #slide-panel (voir les pages).

const DURATION = 550; // ms — doit matcher la transition CSS inline ci-dessous
const EASE = 'cubic-bezier(0.76, 0, 0.24, 1)';

function panel() { return document.getElementById('slide-panel'); }

/**
 * Couvre l'écran avec le panneau puis navigue.
 * @param {string} url
 * @param {'fwd'|'back'} dir  fwd = on avance (panneau vient de droite),
 *                            back = on recule (panneau vient de gauche).
 */
export function slideTo(url, dir = 'fwd') {
  sessionStorage.setItem('pf-slide', dir);
  const p = panel();
  if (!p) { window.location.href = url; return; }

  p.style.display = 'block';
  p.style.transition = 'none';
  p.style.transform = dir === 'fwd' ? 'translateX(100%)' : 'translateX(-100%)';
  p.getBoundingClientRect(); // force le reflow avant d'animer

  setTimeout(() => {
    p.style.transition = `transform ${DURATION}ms ${EASE}`;
    p.style.transform = 'translateX(0)';
  }, 10);

  setTimeout(() => { window.location.href = url; }, DURATION + 30);
}

/**
 * Au chargement : si on arrive via un slide, le panneau couvre déjà l'écran
 * (classe html.pf-cover posée par le script <head>) ; on le fait sortir.
 */
export function initSlideReveal() {
  const dir = sessionStorage.getItem('pf-slide');
  sessionStorage.removeItem('pf-slide');
  const p = panel();
  if (!p) return;

  if (!dir) { p.style.display = 'none'; return; }

  p.style.display = 'block';
  setTimeout(() => {
    p.style.transition = `transform ${DURATION}ms ${EASE}`;
    p.style.transform = dir === 'fwd' ? 'translateX(-100%)' : 'translateX(100%)';
  }, 20);
  setTimeout(() => {
    p.style.display = 'none';
    document.documentElement.classList.remove('pf-cover');
  }, DURATION + 80);
}
