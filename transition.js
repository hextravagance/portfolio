// ── Shader Transition : transition.js ──
// Codrops-style perlin noise reveal as a black page wipe
// Reference: tympanus.net/codrops : "Shader Based Reveal Effect"
// Adapted: no image, solid black wipe with vertical-line dithered edges

import * as THREE from 'three';

// ── Perlin 3D Noise (Patricio Gonzalez Vivo) ──
const perlinNoiseGLSL = `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 P){
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;
  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);
  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);
  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);
  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
  vec4 norm0 = taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));
  g000*=norm0.x; g010*=norm0.y; g100*=norm0.z; g110*=norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));
  g001*=norm1.x; g011*=norm1.y; g101*=norm1.z; g111*=norm1.w;
  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);
  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000,n100,n010,n110), vec4(n001,n101,n011,n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}

float hash(float n) { return fract(sin(n) * 43758.5453123); }
`;

// ── Vertex Shader (with wave displacement from Codrops tutorial) ──
const vertexShader = `
uniform float uProgress;
varying vec2 vUv;

void main() {
    vec3 newPosition = position;

    // Wave displacement synchronized with progress (Codrops style)
    float distanceToCenter = distance(vec2(0.5), uv);
    float wave = (1.0 - uProgress) * sin(distanceToCenter * 20.0 - uProgress * 5.0) * 0.05;
    newPosition.z += wave;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    vUv = uv;
}
`;

// ── Fragment Shader ──
// Uses the EXACT Codrops dissolve formula (displaced UVs + perlin noise + radial gradient)
// then applies vertical-line dithering on the edge band instead of smooth alpha
const fragmentShader = `
uniform float uTime;
uniform float uProgress;
uniform vec2 uResolution;

varying vec2 vUv;

${perlinNoiseGLSL}

void main() {
    // ═══════════════════════════════════════════════════════════
    // CODROPS DISSOLVE MASK : kept exactly as the tutorial
    // ═══════════════════════════════════════════════════════════

    // Displace the UVs with perlin noise
    vec2 displacedUv = vUv + cnoise(vec3(vUv * 5.0, uTime * 0.1));

    // Perlin noise on displaced UVs
    float strength = cnoise(vec3(displacedUv * 5.0, uTime * 0.2));

    // Inverted radial gradient: black grows from EDGES toward CENTER
    // (0.4 - dist) is high at center, low at edges
    // As uProgress goes 0→1, everything shifts down → center eventually becomes black too
    float radialGradient = (0.4 - distance(vUv, vec2(0.5))) * 12.5 - 7.0 * uProgress;
    strength += radialGradient;

    // Clamp & invert → strength=1 means black, 0 means transparent
    strength = clamp(strength, 0.0, 1.0);
    strength = 1.0 - strength;

    // Opacity ramp : delayed start prevents early stray dithering
    float opacityProgress = smoothstep(0.15, 0.45, uProgress);
    strength *= opacityProgress;

    // ═══════════════════════════════════════════════════════════
    // VERTICAL-LINE DITHERED EDGES : etching/engraving style
    // Matches the reference: very fine 1px lines, dramatically
    // varied heights, organic clustering, lines reaching far
    // into the light zone like scratchy drips/etching marks
    // ═══════════════════════════════════════════════════════════

    float solidZone = 0.65;  // above this = fully solid black
    float fadeZone  = 0.14;  // below this = fully transparent (buffer prevents edge artifacts)

    // 1px-wide columns for fine engraving lines
    float col = floor(gl_FragCoord.x);

    // ── Multi-layer noise for dramatic line height variation ──
    // Fine grain: each column unique
    float h1 = hash(col);
    // Medium grain: groups of ~8-12px cluster together
    float h2 = hash(floor(col / 10.0)) * 0.5 + 0.25;
    // Large-scale organic grouping via perlin noise (smooth blobs)
    float pn = cnoise(vec3(col * 0.015, 0.0, uTime * 0.03)) * 0.5 + 0.5;

    // Blend: perlin controls broad shape, hash adds per-line variation
    float colThreshold = pn * 0.55 + h1 * 0.3 + h2 * 0.15;

    // Power curve: makes most lines short, a few reach very far (dramatic variation)
    colThreshold = pow(colThreshold, 1.8);

    // Some columns should be completely empty (gaps between line clusters)
    float gapNoise = cnoise(vec3(col * 0.04, 5.0, uTime * 0.02)) * 0.5 + 0.5;
    float gapMask = smoothstep(0.18, 0.35, gapNoise);
    colThreshold *= gapMask;

    // Subtle shimmer over time
    colThreshold += sin(col * 0.53 + uTime * 0.8) * 0.015;
    colThreshold = clamp(colThreshold, 0.0, 1.0);

    // ── Skip every other pixel column for "scanline" gaps ──
    // Creates the thin-line-with-gap look from the reference
    float colMod = mod(col, 2.0);
    float lineActive = step(0.5, colMod); // only odd columns draw lines

    float alpha;
    if (strength > solidZone) {
        // Deep in the black zone : fully opaque
        alpha = 1.0;
    } else if (strength > fadeZone) {
        // Edge/transition zone : vertical line dithering
        float edgePos = (strength - fadeZone) / (solidZone - fadeZone);

        // In the dither zone, a column is black if colThreshold > (1 - edgePos)
        // Near the solid edge (edgePos≈1) almost all lines appear;
        // far from it (edgePos≈0) only the tallest lines survive
        float lineDraw = step(1.0 - colThreshold, edgePos);

        // Apply the line-gap pattern (alternating columns)
        // Near solid zone, fill everything; further out, show individual lines
        float gapInfluence = smoothstep(0.85, 0.45, edgePos);
        float finalLine = mix(lineDraw, lineDraw * lineActive, gapInfluence);

        alpha = finalLine;
    } else {
        // Fully transparent
        alpha = 0.0;
    }

    // Force clean extremes: fully black when progress is high, fully clear when low
    // Wide ranges guarantee no stray dithering at the start/end of transitions
    float forceBlack = smoothstep(0.78, 0.92, uProgress);
    float forceClear = 1.0 - smoothstep(0.0, 0.22, uProgress);
    alpha = mix(alpha, 1.0, forceBlack);
    alpha = mix(alpha, 0.0, forceClear);

    gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
}
`;

// ── Transition Controller ──
let renderer, scene, camera, mesh, material;
let progress = 0;
let startTime = 0;
let startProgress = 0;
let endProgress = 1;
let transitionDuration = 3; // seconds
let onCompleteCallback = null;
let animating = false;

const overlayEl = document.createElement('div');
overlayEl.id = 'transition-overlay';
overlayEl.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 200;
    pointer-events: none;
    display: none;
`;
document.body.appendChild(overlayEl);

function initThree() {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    overlayEl.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        if (material) {
            material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
        }
    });
}

function createMesh() {
    if (mesh) {
        scene.remove(mesh);
        mesh.geometry.dispose();
        mesh.material.dispose();
    }

    material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        uniforms: {
            uTime: { value: performance.now() / 1000 },
            uProgress: { value: startProgress },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        },
    });

    // 32×32 subdivisions so the wave vertex displacement is visible
    const geometry = new THREE.PlaneGeometry(2, 2, 32, 32);
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
}

function easeInOutCubic(t) {
    return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function animate() {
    if (!animating) return;
    requestAnimationFrame(animate);

    const elapsed = (performance.now() / 1000) - startTime;
    const t = Math.min(elapsed / transitionDuration, 1.0);
    const eased = easeInOutCubic(t);

    progress = startProgress + (endProgress - startProgress) * eased;

    if (material) {
        material.uniforms.uProgress.value = progress;
        material.uniforms.uTime.value = performance.now() / 1000;
    }

    renderer.render(scene, camera);

    if (t >= 1.0) {
        animating = false;
        // Clean up mesh
        if (mesh) {
            scene.remove(mesh);
            mesh.geometry.dispose();
            mesh.material.dispose();
            mesh = null;
            material = null;
        }
        if (endProgress === 0) {
            // Transition OUT complete: clear canvas, fully hide overlay
            renderer.clear();
            overlayEl.style.pointerEvents = 'none';
            overlayEl.style.display = 'none';
        }
        if (onCompleteCallback) {
            onCompleteCallback();
            onCompleteCallback = null;
        }
    }
}

// ── Public API ──

/**
 * Transition IN: clear → fully black (covers the screen).
 */
export function playTransition(onComplete) {
    if (!renderer) initThree();

    overlayEl.style.display = '';
    startProgress = 0;
    endProgress = 1;
    createMesh();

    overlayEl.style.pointerEvents = 'all';
    startTime = performance.now() / 1000;
    animating = true;
    onCompleteCallback = onComplete;
    animate();
}

/**
 * Transition OUT: fully black → clear (reveals content underneath).
 */
export function playTransitionOut(onComplete) {
    if (!renderer) initThree();

    overlayEl.style.display = '';
    startProgress = 1;
    endProgress = 0;
    createMesh();

    overlayEl.style.pointerEvents = 'all';
    startTime = performance.now() / 1000;
    animating = true;
    onCompleteCallback = onComplete;
    animate();
}
