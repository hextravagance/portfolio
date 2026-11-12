// --- PAGE PROJET -----------------------------------------------------------
// Clic sur un projet (ARCHIVES) -> un rectangle noir monte et remplit l'écran,
// puis la page projet apparaît en fade. PREV / NEXT : fondu noir puis fade up.
// Fermeture : fade out, le rectangle redescend et révèle l'index là où il était.
(function () {
    if (typeof gsap === 'undefined') return;

    const items = Array.from(document.querySelectorAll('.project-item'));
    if (!items.length) return;

    // Données lues depuis le HTML (+ champs optionnels data-year / data-role / data-desc)
    const projects = items.map((el) => {
        const ps = el.querySelectorAll('.p-info p');
        const link = el.querySelector('.p-link');
        const href = link ? link.getAttribute('href') : '';
        return {
            num: el.querySelector('.p-num').textContent.trim(),
            title: el.querySelector('h3').textContent.trim(),
            tagline: ps[0] ? ps[0].textContent.trim() : '',
            stack: ps[1] ? ps[1].textContent.split('•').map(s => s.trim()).filter(Boolean) : [],
            media: el.dataset.preview || '',
            year: el.dataset.year || '',
            role: el.dataset.role || '',
            desc: el.dataset.desc || '',
            gif: el.dataset.gif || '',   // si présent : page épurée (description seule) + ce gif à la place de la galerie
            url: href && href !== '#' ? href : ''
        };
    });

    // --- DOM ---
    const curtain = document.createElement('div');
    curtain.id = 'project-curtain';

    const page = document.createElement('div');
    page.id = 'project-page';
    page.setAttribute('data-lenis-prevent', '');
    page.setAttribute('aria-hidden', 'true');
    page.innerHTML = `
        <button class="pp-btn pp-close" type="button" aria-label="Quitter le projet">${t('FERMER ✕')}</button>
        <div class="pp-content"></div>
        <div class="pp-nav">
            <button class="pp-btn pp-prev" type="button">← PREV</button>
            <span class="pp-count"></span>
            <button class="pp-btn pp-next" type="button">NEXT →</button>
        </div>`;
    document.body.append(curtain, page);

    const content = page.querySelector('.pp-content');
    const countEl = page.querySelector('.pp-count');

    gsap.set(curtain, { yPercent: 100 });
    gsap.set(page, { autoAlpha: 0 });

    let current = 0;
    let busy = false;
    let isOpen = false;
    let savedScroll = 0;

    const pad = (n) => String(n).padStart(2, '0');

    function render(i) {
        const p = projects[i];
        const isVideo = /\.(mp4|webm|mov)$/i.test(p.media);
        const mediaHTML = p.media
            ? (isVideo
                ? `<video src="${p.media}" muted loop playsinline autoplay></video>`
                : `<img src="${p.media}" alt="">`)
            : '';
        const meta = [
            p.year && [t('ANNÉE'), p.year],
            p.role && [t('RÔLE'), p.role],
            p.stack.length && ['STACK', p.stack.join(' • ')]
        ].filter(Boolean);

        content.innerHTML = `
            <div class="pp-head pp-reveal">
                <div class="pp-num">${p.num}</div>
                <h1 class="pp-title">${p.title}</h1>
                <p class="pp-tagline">${p.tagline}</p>
            </div>
            <div class="pp-hero pp-reveal">${mediaHTML}</div>
            <div class="pp-body pp-reveal${p.gif ? ' pp-body--solo' : ''}">
                ${p.gif ? '' : `<div class="pp-meta">
                    ${meta.map(([k, v]) => `<div class="pp-meta-row"><span>${k}</span><span>${v}</span></div>`).join('')}
                    ${p.url ? `<a class="pp-btn pp-visit" href="${p.url}" target="_blank" rel="noopener">${t('VOIR LE PROJET →')}</a>` : ''}
                </div>`}
                <div class="pp-desc">${p.desc || t('Description du projet à venir :p')}</div>
            </div>
            ${p.gif
                ? `<div class="pp-gif pp-reveal"><img src="${p.gif}" alt=""></div>`
                : `<div class="pp-gallery pp-reveal">
                <div class="pp-shot"></div><div class="pp-shot"></div><div class="pp-shot"></div>
            </div>`}`;
        // un média absent / illisible ne laisse pas un trou
        content.querySelectorAll('.pp-hero img, .pp-hero video').forEach(m => {
            m.addEventListener('error', () => m.remove());
        });
        countEl.textContent = `${pad(i + 1)} / ${pad(projects.length)}`;
        page.scrollTop = 0;
    }

    function revealIn(delay = 0) {
        return gsap.fromTo(content.querySelectorAll('.pp-reveal'),
            { y: 40, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', stagger: 0.1, delay });
    }

    // --- OUVERTURE ---
    function open(i) {
        if (busy || isOpen) return;
        busy = true;
        current = i;
        savedScroll = window.scrollY;
        if (window.lenis) window.lenis.stop();
        document.body.classList.add('project-open');
        document.documentElement.classList.add('project-locked');
        render(i);
        gsap.set(content.children, { autoAlpha: 0 });
        gsap.set(page.querySelectorAll('.pp-close, .pp-nav'), { autoAlpha: 0 });

        gsap.timeline({ onComplete: () => { busy = false; isOpen = true; page.focus && page.focus({ preventScroll: true }); } })
            // 1. le rectangle noir monte et remplit l'écran
            .to(curtain, { yPercent: 0, duration: 0.9, ease: 'power3.inOut' })
            // 2. la page projet apparaît en fade
            .set(page, { autoAlpha: 1 })
            .add(() => page.setAttribute('aria-hidden', 'false'))
            .to(page.querySelectorAll('.pp-close, .pp-nav'), { autoAlpha: 1, duration: 0.6, ease: 'power2.out' })
            .add(() => revealIn(), '<');
    }

    // --- PREV / NEXT : fondu noir puis fade up ---
    function go(dir) {
        if (busy || !isOpen) return;
        busy = true;
        const next = (current + dir + projects.length) % projects.length;
        const tl = gsap.timeline({ onComplete: () => { busy = false; } });
        tl.to(content, { autoAlpha: 0, duration: 0.45, ease: 'power2.in' })
            .add(() => { current = next; render(next); gsap.set(content, { autoAlpha: 1 }); gsap.set(content.querySelectorAll('.pp-reveal'), { autoAlpha: 0 }); })
            .add(() => revealIn());
    }

    // --- FERMETURE ---
    function close() {
        if (busy || !isOpen) return;
        busy = true;
        gsap.timeline({
            onComplete: () => {
                busy = false;
                isOpen = false;
                content.innerHTML = '';
                document.body.classList.remove('project-open');
                document.documentElement.classList.remove('project-locked');
                if (window.lenis) window.lenis.start();
            }
        })
            .add(() => page.setAttribute('aria-hidden', 'true'))
            // la page fade out…
            .to(page, { autoAlpha: 0, duration: 0.5, ease: 'power2.in' })
            // …et le rectangle redescend vers le bas, l'index est toujours à la même position
            .to(curtain, { yPercent: 100, duration: 0.9, ease: 'power3.inOut' }, '-=0.1');
    }

    // --- ÉVÉNEMENTS ---
    items.forEach((el, i) => {
        el.style.cursor = 'pointer';
        el.addEventListener('click', (e) => {
            const a = e.target.closest('a');
            if (a) e.preventDefault(); // le lien ACCÈS ouvre la page projet
            open(i);
        });
    });
    page.querySelector('.pp-close').addEventListener('click', close);
    page.querySelector('.pp-prev').addEventListener('click', () => go(-1));
    page.querySelector('.pp-next').addEventListener('click', () => go(1));
    window.addEventListener('keydown', (e) => {
        if (!isOpen) return;
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowLeft') go(-1);
        else if (e.key === 'ArrowRight') go(1);
    });
})();
