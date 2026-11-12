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
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const radius = Math.min(rect.width, rect.height) * 0.22;
            const dx = e.clientX - centerX;
            const dy = e.clientY - centerY;
            const wasHovered = this.isHovered;
            this.isHovered = Math.sqrt(dx * dx + dy * dy) < radius;
            if (this.isHovered !== wasHovered) {
                document.body.classList.toggle('ascii-hovered', this.isHovered);
            }
        });

        try {
            await this.loadSVG();
            this.ready = true;
            console.log('ASCII Effect loaded:', this.asciiGrid.length, 'x', this.asciiGrid[0]?.length);
        } catch (e) {
            console.error('Failed to load SVG', e);
            this.createFallbackPattern();
            this.ready = true;
        }

        this.animate();
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
        this.ctx.font = `bold ${this.options.fontSize}px "Courier New", monospace`;
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

    animate() {
        const deltaTime = 0.016;
        this.time += deltaTime;
        const eeActive = this.easterEggActive;
        const targetZoom = (!eeActive && this.isHovered) ? 1.4 : 1;
        const targetRotMult = eeActive ? 3 : (this.isHovered ? 3 : 1);
        this.hoverZoom += (targetZoom - this.hoverZoom) * 0.06;
        this.hoverRotMult += (targetRotMult - this.hoverRotMult) * 0.08;
        const targetValue = this.lightTheme ? 1 : 0;
        this.themeValue += (targetValue - this.themeValue) * 0.1;
        const bg = this.lightThemeBg;
        const bgR = Math.floor(this.themeValue * bg.r);
        const bgG = Math.floor(this.themeValue * bg.g);
        const bgB = Math.floor(this.themeValue * bg.b);
        this.ctx.fillStyle = `rgb(${bgR}, ${bgG}, ${bgB})`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        if (!this.ready || !this.asciiGrid.length) {
            requestAnimationFrame(() => this.animate());
            return;
        }
        const gridWidth = this.asciiGrid[0].length;
        const gridHeight = this.asciiGrid.length;
        const charWidth = this.options.fontSize * 0.65;
        const charHeight = this.options.fontSize;
        const centerX = this.canvas.width / 2 + this.options.offsetX;
        const centerY = this.canvas.height / 2 + this.options.offsetY;
        const extrusionDepth = this.options.extrusionDepth;
        const extrusionLayers = this.options.extrusionLayers;

        // Rotation continue (accélérée au hover)
        this.rotationAngle += deltaTime * this.options.rotationSpeed * this.hoverRotMult;
        const rotationY = this.rotationAngle;
        const angleX = this.options.perspectiveAngleX;
        const cosY = Math.cos(rotationY);
        const sinY = Math.sin(rotationY);
        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        const perspective = 500;
        const zoomScale = this.hoverZoom;
        const points = [];

        for (let y = 0; y < gridHeight; y++) {
            for (let x = 0; x < gridWidth; x++) {
                const cell = this.asciiGrid[y][x];
                if (!cell.isVisible) continue;
                cell.charTimer += 0.15 + Math.random() * 0.1;
                const relX = (x - gridWidth / 2) * charWidth;
                const relY = (y - gridHeight / 2) * charHeight;
                for (let layer = 0; layer <= extrusionLayers; layer++) {
                    const z = -extrusionDepth / 2 + layer * (extrusionDepth / extrusionLayers);
                    const x1 = relX * cosY + z * sinY;
                    const z1 = -relX * sinY + z * cosY;
                    const y1 = relY * cosX - z1 * sinX;
                    const z2 = relY * sinX + z1 * cosX;
                    const scale = (perspective / (perspective + z2)) * zoomScale;
                    const screenX = centerX + x1 * scale;
                    const screenY = centerY + y1 * scale;
                    const char = this.getRandomChar(cell.charTimer + layer * 2, this.options.charChangeSpeed);
                    const isFrontOrBack = (layer === 0 || layer === extrusionLayers);
                    const depthRatio = Math.abs(layer - extrusionLayers / 2) / (extrusionLayers / 2);
                    let baseColor;
                    if (this.options.useGradient) {
                        baseColor = this.getGradientColor(screenX, screenY, this.time);
                    } else {
                        const val = Math.floor(255 * (1 - this.themeValue));
                        baseColor = { r: val, g: val, b: val };
                    }
                    if (this.easterEggProgress > 0.001) {
                        const p = this.easterEggProgress;
                        const ec = this.easterEggColor;
                        baseColor = {
                            r: Math.floor(baseColor.r + (ec.r - baseColor.r) * p),
                            g: Math.floor(baseColor.g + (ec.g - baseColor.g) * p),
                            b: Math.floor(baseColor.b + (ec.b - baseColor.b) * p)
                        };
                    }

                    let color, alpha;
                    if (isFrontOrBack) {
                        color = baseColor;
                        alpha = 0.95;
                    } else {
                        const darkFactor = 0.3 + depthRatio * 0.4;
                        color = {
                            r: Math.floor(baseColor.r * darkFactor),
                            g: Math.floor(baseColor.g * darkFactor),
                            b: Math.floor(baseColor.b * darkFactor)
                        };
                        alpha = 0.3 + depthRatio * 0.4;
                    }

                    points.push({
                        x: screenX,
                        y: screenY,
                        z: z2,
                        char,
                        color,
                        alpha
                    });
                }
            }
        }
        points.sort((a, b) => b.z - a.z);
        for (const point of points) {
            this.ctx.fillStyle = `rgba(${point.color.r}, ${point.color.g}, ${point.color.b}, ${point.alpha})`;
            this.ctx.fillText(point.char, point.x, point.y);
        }
        requestAnimationFrame(() => this.animate());
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
