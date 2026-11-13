/**
 * ASCII Art Effect with Real 3D Perspective + Gradient Colors
 * Smooth continuous rotation with animated gradient on characters
 */

class AsciiEffect {
    constructor(container, svgPath, options = {}) {
        this.container = container;
        this.svgPath = svgPath;

        this.options = {
            fontSize: options.fontSize || 11,
            chars: options.chars || '@%#&*+=-:;,. ',
            charChangeSpeed: options.charChangeSpeed || 0.12,
            rotationSpeed: options.rotationSpeed || 0.25,
            perspectiveAngleX: options.perspectiveAngleX || 0.25,
            extrusionDepth: options.extrusionDepth || 40,
            extrusionLayers: options.extrusionLayers || 8,
            scale: options.scale || 0.45,
            useGradient: options.useGradient || false,  // false = blanc, true = gradient
            offsetX: options.offsetX || 0,  // Décalage horizontal du centre
            offsetY: options.offsetY || 0,  // Décalage vertical du centre
            ...options
        };

        this.canvas = null;
        this.ctx = null;
        this.asciiGrid = [];
        this.time = 0;
        this.ready = false;
        this.lightTheme = false;
        this.themeValue = 0;
        this.isHovered = false;
        this.hoverZoom = 1;
        this.hoverRotMult = 1;
        this.rotationAngle = 0;
        this.easterEggProgress = 0;
        this.easterEggActive = false;
        this.easterEggColor = { r: 255, g: 0, b: 0 };
        this.lightThemeBg = { r: 255, g: 255, b: 255 };

        this.init();
    }

    async init() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.display = 'block';
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        window.addEventListener('resize', () => this.resize());
        this.resize();

        // Hover detection sur la zone du logo ASCII
        document.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const isMobile = rect.width <= 768;
            const offsetY = isMobile ? -40 : this.options.offsetY;
            const centerX = rect.left + rect.width / 2 + this.options.offsetX;
            const centerY = rect.top + rect.height / 2 + offsetY;
            const radius = Math.min(rect.width, rect.height) * 0.22;
            const dx = e.clientX - centerX;
            const dy = e.clientY - centerY;
            const wasHovered = this.isHovered;
            this.isHovered = Math.sqrt(dx * dx + dy * dy) < radius;
            if (this.isHovered !== wasHovered) {
                document.body.classList.toggle('ascii-hovered', this.isHovered);
            }
        });

        // En responsive : clic sur l'ASCII art du hero => bascule la page en anglais (ou retour FR)
        document.addEventListener('click', (e) => {
            if (window.innerWidth > 768) return;
            if ((window.scrollY || document.documentElement.scrollTop || 0) > window.innerHeight * 0.5) return;
            if (e.target.closest('a, button, #logo, #cta, #main-menu, #lang-term')) return;
            const rect = this.canvas.getBoundingClientRect();
            const offsetY = -40;
            const centerX = rect.left + rect.width / 2 + this.options.offsetX;
            const centerY = rect.top + rect.height / 2 + offsetY;
            const radius = Math.min(rect.width, rect.height) * 0.32;
            const dx = e.clientX - centerX;
            const dy = e.clientY - centerY;
            if (Math.sqrt(dx * dx + dy * dy) < radius && typeof window.toggleLang === 'function') {
                window.toggleLang();
            }
        });

        try {
            await this.loadSVG();
            this.ready = true;
        } catch (e) {
            console.error('Failed to load SVG', e);
            this.createFallbackPattern();
            this.ready = true;
        }

        // Boucle d'animation : en pause quand l'onglet est masqué
        this.rafId = 0;
        this.lastT = 0;
        this.loop = (now) => {
            this.rafId = 0;
            if (document.hidden) return;
            this.rafId = requestAnimationFrame(this.loop);
            // mobile : 30 fps max (le canvas est coûteux et l'écran n'y gagne rien)
            const minFrame = this.canvas.width <= 768 ? 30 : 0;
            if (this.lastT && now - this.lastT < minFrame) return;
            const dt = this.lastT ? Math.min((now - this.lastT) / 1000, 0.05) : 0.016;
            this.lastT = now;
            this.draw(dt);
        };
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && !this.rafId) { this.lastT = 0; this.rafId = requestAnimationFrame(this.loop); }
        });
        this.rafId = requestAnimationFrame(this.loop);
    }

    async loadSVG() {
        return new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => {
                const targetWidth = Math.floor(img.width * this.options.scale / this.options.fontSize);
                const targetHeight = Math.floor(img.height * this.options.scale / this.options.fontSize);
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = targetWidth;
                tempCanvas.height = targetHeight;
                const tempCtx = tempCanvas.getContext('2d');
                tempCtx.fillStyle = '#FFFFFF';
                tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                tempCtx.drawImage(img, 0, 0, targetWidth, targetHeight);
                const imageData = tempCtx.getImageData(0, 0, targetWidth, targetHeight);
                this.processImage(imageData);
                resolve();
            };
            img.onerror = reject;
            img.src = this.svgPath;
        });
    }

    createFallbackPattern() {
        const size = 60;
        this.asciiGrid = [];
        for (let y = 0; y < size; y++) {
            const row = [];
            for (let x = 0; x < size; x++) {
                const dist = Math.sqrt((x - size / 2) ** 2 + (y - size / 2) ** 2);
                const inShape = dist < size / 2.5;
                row.push({
                    isVisible: inShape,
                    charTimer: Math.random() * 100,
                    x, y
                });
            }
            this.asciiGrid.push(row);
        }
    }

    processImage(imageData) {
        const { width, height, data } = imageData;
        this.asciiGrid = [];
        for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                const brightness = 1 - ((r + g + b) / 3 / 255);
                const isVisible = brightness > 0.05;
                row.push({
                    isVisible,
                    charTimer: Math.random() * 100,
                    x, y
                });
            }
            this.asciiGrid.push(row);
        }
    }

    getRandomChar(timer, speed) {
        const chars = this.options.chars;
        const index = Math.floor((timer * speed) % (chars.length - 1));
        return chars[index];
    }

    resize() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        const isMobile = rect.width <= 768;
        const fs = isMobile ? Math.max(7, Math.round(this.options.fontSize * 0.65)) : this.options.fontSize;
        this.ctx.font = `bold ${fs}px "Courier New", monospace`;
        this.ctx.textBaseline = 'middle';
        this.ctx.textAlign = 'center';
    }

    setLightTheme(isLight) {
        this.lightTheme = isLight;
    }

    getGradientColor(screenX, screenY, time) {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const nx = (screenX / w) - 0.5;
        const ny = (screenY / h) - 0.5;
        const t = time * 1.5;
        const wave1 = Math.sin(nx * 8 + t * 2) * 0.5;
        const wave2 = Math.sin(ny * 6 + t * 1.5) * 0.5;
        const wave3 = Math.sin((nx + ny) * 5 + t * 1.8) * 0.3;
        const wave4 = Math.sin((nx - ny) * 4 + t * 1.2) * 0.3;
        let value = wave1 + wave2 + wave3 + wave4;
        value = (value + 1.6) / 3.2;
        const colors = [
            { pos: 0.0, r: 120, g: 120, b: 140 },
            { pos: 0.2, r: 80, g: 80, b: 180 },
            { pos: 0.4, r: 140, g: 80, b: 200 },
            { pos: 0.6, r: 80, g: 120, b: 220 },
            { pos: 0.8, r: 60, g: 180, b: 200 },
            { pos: 1.0, r: 140, g: 140, b: 160 }
        ];
        let c1 = colors[0];
        let c2 = colors[1];
        for (let i = 0; i < colors.length - 1; i++) {
            if (value >= colors[i].pos && value <= colors[i + 1].pos) {
                c1 = colors[i];
                c2 = colors[i + 1];
                break;
            }
        }
        const range = c2.pos - c1.pos;
        const t2 = range > 0 ? (value - c1.pos) / range : 0;
        return {
            r: Math.floor(c1.r + (c2.r - c1.r) * t2),
            g: Math.floor(c1.g + (c2.g - c1.g) * t2),
            b: Math.floor(c1.b + (c2.b - c1.b) * t2)
        };
    }

    draw(dt) {
        const k = dt / 0.016; // 1 à 60 fps : garde la même vitesse visuelle quel que soit le framerate
        const ctx = this.ctx;
        const eeActive = this.easterEggActive;
        const targetZoom = (!eeActive && this.isHovered) ? 1.4 : 1;
        const targetRotMult = eeActive ? 3 : (this.isHovered ? 3 : 1);
        this.hoverZoom += (targetZoom - this.hoverZoom) * Math.min(1, 0.06 * k);
        this.hoverRotMult += (targetRotMult - this.hoverRotMult) * Math.min(1, 0.08 * k);
        const targetValue = this.lightTheme ? 1 : 0;
        this.themeValue += (targetValue - this.themeValue) * Math.min(1, 0.1 * k);
        const bg = this.lightThemeBg;
        ctx.fillStyle = `rgb(${Math.floor(this.themeValue * bg.r)}, ${Math.floor(this.themeValue * bg.g)}, ${Math.floor(this.themeValue * bg.b)})`;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        if (!this.ready || !this.asciiGrid.length) return;

        // cellules visibles : listées une seule fois (plus de parcours de toute la grille à chaque frame)
        if (!this.cells) {
            this.cells = [];
            for (const row of this.asciiGrid) for (const c of row) if (c.isVisible) this.cells.push(c);
        }
        const cells = this.cells;

        const isMobile = this.canvas.width <= 768;
        const mobileScale = isMobile ? 0.6 : 1;
        const gridWidth = this.asciiGrid[0].length;
        const gridHeight = this.asciiGrid.length;
        const charWidth = this.options.fontSize * 0.65;
        const charHeight = this.options.fontSize;
        const centerX = this.canvas.width / 2 + this.options.offsetX;
        const centerY = this.canvas.height / 2 + (isMobile ? -40 : this.options.offsetY);
        const extrusionDepth = this.options.extrusionDepth;
        // mobile : moins de couches d'extrusion (4 au lieu de 8) = 2x moins de caractères à dessiner
        const extrusionLayers = isMobile ? Math.max(2, Math.round(this.options.extrusionLayers / 2)) : this.options.extrusionLayers;
        const nLayers = extrusionLayers + 1;

        this.rotationAngle += dt * this.options.rotationSpeed * this.hoverRotMult;
        const cosY = Math.cos(this.rotationAngle);
        const sinY = Math.sin(this.rotationAngle);
        const angleX = this.options.perspectiveAngleX;
        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        const perspective = 500;
        const zoomScale = this.hoverZoom * mobileScale;

        // Couleur/alpha par couche (identique pour tous les points d'une couche hors dégradé) : 9 chaînes au lieu de milliers
        const layerStyle = [];
        for (let layer = 0; layer < nLayers; layer++) {
            const isFrontOrBack = (layer === 0 || layer === extrusionLayers);
            const depthRatio = Math.abs(layer - extrusionLayers / 2) / (extrusionLayers / 2);
            const val = Math.floor(255 * (1 - this.themeValue));
            let r = val, g = val, b = val;
            if (this.easterEggProgress > 0.001) {
                const p = this.easterEggProgress, ec = this.easterEggColor;
                r = Math.floor(r + (ec.r - r) * p);
                g = Math.floor(g + (ec.g - g) * p);
                b = Math.floor(b + (ec.b - b) * p);
            }
            let alpha = 0.95;
            if (!isFrontOrBack) {
                const f = 0.3 + depthRatio * 0.4;
                r = Math.floor(r * f); g = Math.floor(g * f); b = Math.floor(b * f);
                alpha = 0.3 + depthRatio * 0.4;
            }
            layerStyle.push(`rgba(${r}, ${g}, ${b}, ${alpha})`);
        }

        // buffers réutilisés d'une frame à l'autre (zéro allocation par point)
        const total = cells.length * nLayers;
        if (!this.buf || this.buf.cap < total) {
            this.buf = {
                cap: total,
                xs: new Float32Array(total), ys: new Float32Array(total), zs: new Float32Array(total),
                layer: new Uint8Array(total), ch: new Uint8Array(total), order: new Uint32Array(total)
            };
        }
        const { xs, ys, zs, layer: ly, ch, order } = this.buf;
        const chars = this.options.chars;
        const nChars = chars.length - 1;
        const speed = this.options.charChangeSpeed;
        const zStep = extrusionDepth / extrusionLayers;
        let n = 0, zMin = Infinity, zMax = -Infinity;

        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i];
            cell.charTimer += (0.15 + Math.random() * 0.1) * k;
            const relX = (cell.x - gridWidth / 2) * charWidth;
            const relY = (cell.y - gridHeight / 2) * charHeight;
            for (let layer = 0; layer < nLayers; layer++) {
                const z = -extrusionDepth / 2 + layer * zStep;
                const x1 = relX * cosY + z * sinY;
                const z1 = -relX * sinY + z * cosY;
                const y1 = relY * cosX - z1 * sinX;
                const z2 = relY * sinX + z1 * cosX;
                const scale = (perspective / (perspective + z2)) * zoomScale;
                xs[n] = centerX + x1 * scale;
                ys[n] = centerY + y1 * scale;
                zs[n] = z2;
                ly[n] = layer;
                ch[n] = Math.floor(((cell.charTimer + layer * 2) * speed) % nChars);
                if (z2 < zMin) zMin = z2;
                if (z2 > zMax) zMax = z2;
                n++;
            }
        }

        // tri par profondeur en O(n) (tri par seaux) au lieu d'un Array.sort sur des milliers d'objets : du plus loin au plus proche
        const B = 512;
        const counts = this.counts || (this.counts = new Uint32Array(B + 1));
        counts.fill(0);
        const inv = zMax > zMin ? (B - 1) / (zMax - zMin) : 0;
        for (let i = 0; i < n; i++) counts[B - 1 - Math.floor((zs[i] - zMin) * inv) + 1]++;
        for (let b = 1; b <= B; b++) counts[b] += counts[b - 1];
        for (let i = 0; i < n; i++) order[counts[B - 1 - Math.floor((zs[i] - zMin) * inv)]++] = i;

        let lastLayer = -1;
        for (let j = 0; j < n; j++) {
            const i = order[j];
            if (ly[i] !== lastLayer) {
                lastLayer = ly[i];
                ctx.fillStyle = layerStyle[lastLayer];
            }
            ctx.fillText(chars[ch[i]], xs[i], ys[i]);
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const bgContainer = document.getElementById('bg');
    if (bgContainer) {
        bgContainer.removeAttribute('data-us-project');

        // Stocker l'instance globalement pour le toggle de thème
        window.asciiEffect = new AsciiEffect(bgContainer, 'img/ico.svg', {
            fontSize: 11,
            chars: '@%#&*+=-:;,. ',
            charChangeSpeed: 0.1,
            rotationSpeed: 0.2,
            perspectiveAngleX: 0,
            extrusionDepth: 35,
            extrusionLayers: 8,
            scale: 0.45
            // pas d'offsetY : le logo est centré verticalement dans la page
        });
    }
});
