document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.site-header');
    const nav = document.querySelector('.site-nav');
    const menuButton = document.querySelector('.menu-toggle');
    const navLinks = [...document.querySelectorAll('.site-nav a')];
    const sections = [...document.querySelectorAll('main section[id]')];
    const reveals = document.querySelectorAll('.reveal');
    const music = document.getElementById('bgMusic');
    const musicButton = document.getElementById('musicToggle');
    const musicLabel = musicButton?.querySelector('.music-label');

    const setHeaderState = () => {
        header?.classList.toggle('scrolled', window.scrollY > 18);
    };

    const closeMenu = () => {
        nav?.classList.remove('open');
        menuButton?.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
    };

    menuButton?.addEventListener('click', () => {
        const willOpen = !nav.classList.contains('open');
        nav.classList.toggle('open', willOpen);
        menuButton.setAttribute('aria-expanded', String(willOpen));
        document.body.classList.toggle('menu-open', willOpen);
    });

    navLinks.forEach(link => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeMenu();
    });

    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

    reveals.forEach(item => revealObserver.observe(item));

    const sectionObserver = new IntersectionObserver(entries => {
        const visible = entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === `#${visible.target.id}`;
            link.classList.toggle('active', isActive);
            if (isActive) link.setAttribute('aria-current', 'page');
            else link.removeAttribute('aria-current');
        });
    }, { rootMargin: '-25% 0px -58%', threshold: [0, 0.15, 0.4] });

    sections.forEach(section => sectionObserver.observe(section));
    window.addEventListener('scroll', setHeaderState, { passive: true });
    setHeaderState();

    const updateMusicButton = playing => {
        musicButton?.classList.toggle('playing', playing);
        musicButton?.setAttribute('aria-pressed', String(playing));
        musicButton?.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
        if (musicLabel) musicLabel.textContent = playing ? 'Music on' : 'Music off';
    };

    musicButton?.addEventListener('click', async () => {
        if (!music) return;
        if (music.paused) {
            try {
                await music.play();
                localStorage.setItem('musicPlaying', 'true');
                updateMusicButton(true);
            } catch (error) {
                updateMusicButton(false);
            }
        } else {
            music.pause();
            localStorage.setItem('musicPlaying', 'false');
            updateMusicButton(false);
        }
    });

    if (music) {
        const savedTime = Number(sessionStorage.getItem('musicTime'));
        if (Number.isFinite(savedTime) && savedTime > 0) music.currentTime = savedTime;
        music.addEventListener('timeupdate', () => sessionStorage.setItem('musicTime', String(music.currentTime)));
        music.addEventListener('ended', () => updateMusicButton(false));
    }

    const year = document.getElementById('copyright-year');
    if (year) year.textContent = new Date().getFullYear();

    if (window.location.hash) {
        requestAnimationFrame(() => document.querySelector(window.location.hash)?.scrollIntoView());
    }
});
