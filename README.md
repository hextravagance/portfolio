# Portfolio MMI 2ème

Portfolio inspiré de la structure du projet **FVT** (hub réseau → transition shader → cascade), adapté en vitrine de projets.

## Le parcours (4 écrans)

1. **Hub** (`index.html` / `hub.js`) : « MMI 2ÈME » au centre, les 5 compétences (EXPRIMER, COMPRENDRE, DÉVELOPPER, ENTREPRENDRE, CONCEVOIR) autour, reliées par des traits animés. Clic sur une compétence → transition → interlude.
2. **Interlude** (`interlude.html` / `interlude.js`) : présente la compétence (objectif + **AC/CE ciblés**, agrégés automatiquement depuis les projets) avant d'entrer. Bouton **« Commencer »** → transition → projets.
3. **Transition** (`transition.js`) : le wipe noir à bruit de Perlin (Three.js), identique à FVT. Joue le « reveal » seulement si on arrive via une transition (flag `sessionStorage`), sinon la page s'affiche direct.
4. **Projets** (`projects.html` / `projects.js`) : cover-flow en cascade de cartes **720×405**, + détail **éditorial 2 colonnes** (galerie aperçu/preuve à gauche ; situation, AC, CE, justification, prise de recul à droite).

Navigation : Hub → Interlude → Projets → (détail). Les boutons « Retour » remontent d'un cran (projets → interlude → hub).

## Lancer en local

Il faut un serveur http (les modules ES ne se chargent pas en `file://`).

```bash
npm install
npm start          # -> http://localhost:3002
```

Alternatives sans install : `npx serve` ou `python -m http.server`.

## Modifier le contenu

Tout est dans **`data.js`** : un tableau `SKILLS`, chaque compétence a une liste `projects[]`.

```js
{
  title: 'Mon projet',
  context: 'Intra-muros',          // ou 'Extra-muros'
  year: '2025',
  role: 'Développeur',
  description: 'Analyse réflexive : ce que J\'AI fait.',
  critique: 'Prise de recul : points forts / faibles / alternatives.',
  acs: [{ code: 'AC22.01', label: 'Concevoir un produit…' }],   // code:'' => badge « à préciser »
  ces: [{ code: 'CE2.02', label: 'En tenant compte de l\'UX…' }],
  justification: 'POURQUOI ces AC/CE collent à ce projet.',
  proof: 'Légende de la preuve attendue (la trace).',
  tags: ['Figma', 'UI/UX'],
  links: [{ label: 'Voir le site', url: 'https://…' }],
  image: 'assets/projets/hero.jpg',       // visuel 720×405 : vide = placeholder auto
  proofImage: 'assets/preuves/trace.jpg', // visuel de la preuve : vide = placeholder « preuve »
}
```

Les **AC/CE sont mis en avant** à deux endroits : la page **interlude** liste tous les AC/CE de la compétence (dédoublonnés), et le **détail projet** les rappelle par projet avec le bloc **« Pourquoi ces AC / CE ? »** (justification) juste après. La galerie de gauche affiche l'aperçu (`image`) et la **preuve** (`proofImage`) ; sans visuel, un placeholder s'affiche.

Mets tes visuels dans un dossier `assets/` et pointe `image` / `proofImage` dessus.

> **DÉVELOPPER** : codes remplis depuis le référentiel officiel (niveau 2 — AC24.xx / CE4.xx). **COMPRENDRE** reste un placeholder à compléter. **ENTREPRENDRE** : la 2ᵉ situation (montage PC vs projet cascade) est à confirmer. **Evano** : la CE reste « à préciser ».

## Réglages rapides

- **Géométrie de la cascade** : constantes en haut de `projects.js` (`CARD_W`, `CARD_H`, `X_STEP`, `Z_STEP`, `ROT_Y`…).
- **Disposition du hub** : `RADIUS_RATIO` et la dérive (`DRIFT_SPEED`) en haut de `hub.js`.
