document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('nav ul li a');
    const nav = document.querySelector('nav');
    const footer = document.querySelector('footer');
    const bgImage = document.querySelector('.bg-image');
    const profileContainer = document.querySelector('.profile-main-container');
    const profilePhoto = document.querySelector('.profile-photo');
    const main = document.querySelector('main');
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    const musicStatus = musicToggle ? musicToggle.querySelector('.music-status') : null;

    const backgrounds = [
        { url: 'images/bg1.jpg', theme: 'dark-theme' },
        { url: 'images/bg2.jpg', theme: 'dark-theme' },
        { url: 'images/bg3.jpg', theme: 'dark-theme' },
        { url: 'images/bg4.jpg', theme: 'light-theme' },
        { url: 'images/bg5.jpg', theme: 'light-theme' },
        { url: 'images/bg6.jpg', theme: 'light-theme' },
        { url: 'images/bg7.jpg', theme: 'light-theme' },
        { url: 'images/bg8.jpg', theme: 'light-theme' },
        { url: 'images/bg9.jpg', theme: 'light-theme' },
    ];

    let currentIndex = 0;

    function preloadBackgrounds() {
        backgrounds.forEach(background => {
            const img = new Image();
            img.src = background.url;
        });
    }

    function applyBackground(index) {
        bgImage.style.backgroundImage = `url(${backgrounds[index].url})`;
        nav.className = '';
        footer.className = '';
        profileContainer.className = 'profile-main-container';

        nav.classList.add(backgrounds[index].theme);
        footer.classList.add(backgrounds[index].theme);
        profileContainer.classList.add(backgrounds[index].theme);
    }

    function changeBackground() {
        currentIndex = (currentIndex + 1) % backgrounds.length;
        applyBackground(currentIndex);
        localStorage.setItem('currentBackgroundIndex', currentIndex);
    }

    // Preload all background images
    preloadBackgrounds();

    // Set initial background and theme
    const storedIndex = localStorage.getItem('currentBackgroundIndex');
    if (storedIndex !== null) {
        currentIndex = parseInt(storedIndex);
    }
    applyBackground(currentIndex);

    setInterval(changeBackground, 3000);

    // Set active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
        link.addEventListener('click', smoothScroll);
    });

    function smoothScroll(event) {
        event.preventDefault();
        const targetId = event.currentTarget.getAttribute('href');
        if (targetId.startsWith('#')) {
            window.scrollTo({
                top: document.querySelector(targetId).offsetTop - 50,
                behavior: 'smooth'
            });
        } else {
            window.location.href = targetId;
        }
    }

    // Parallax effect on mouse move (desktop only for performance)
    let ticking = false;
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', function(e) {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    const mouseX = e.clientX / window.innerWidth;
                    const mouseY = e.clientY / window.innerHeight;
                    
                    if (bgImage) {
                        const moveX = (mouseX - 0.5) * 20;
                        const moveY = (mouseY - 0.5) * 20;
                        bgImage.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
                    }

                    if (profilePhoto) {
                        const moveX = (mouseX - 0.5) * 10;
                        const moveY = (mouseY - 0.5) * 10;
                        profilePhoto.style.transform = `translate(${moveX}px, ${moveY}px)`;
                    }
                    
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe main content for scroll animations
    if (main) {
        observer.observe(main);
    }

    // Add ripple effect to profile photo on click
    if (profilePhoto) {
        profilePhoto.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 300);
        });
    }

    // Smooth scroll behavior enhancement (parallax on scroll)
    let scrollTicking = false;
    window.addEventListener('scroll', function() {
        if (!scrollTicking && window.innerWidth > 768) {
            window.requestAnimationFrame(function() {
                const scrolled = window.pageYOffset;
                if (bgImage) {
                    bgImage.style.transform = `translateY(${scrolled * 0.2}px)`;
                }
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });

    // Background Music Control with Seamless Cross-Page Continuity using iframe
    if (musicToggle && musicStatus) {
        let musicIframe = null;
        let musicState = { paused: true, currentTime: 0 };
        let hasUserInteracted = false;
        
        // Function to update UI
        function updateMusicUI(playing) {
            if (playing) {
                musicToggle.classList.add('playing');
                musicStatus.textContent = 'Playing';
            } else {
                musicToggle.classList.remove('playing');
                musicStatus.textContent = 'Paused';
            }
        }
        
        // Create or get music player iframe
        function getMusicIframe() {
            if (musicIframe && musicIframe.contentWindow) {
                return musicIframe;
            }
            
            // Check if iframe already exists in document
            let existingIframe = document.getElementById('musicPlayerIframe');
            if (existingIframe) {
                musicIframe = existingIframe;
                return musicIframe;
            }
            
            // Create new iframe
            musicIframe = document.createElement('iframe');
            musicIframe.id = 'musicPlayerIframe';
            musicIframe.src = 'music-player.html';
            musicIframe.style.position = 'fixed';
            musicIframe.style.top = '-9999px';
            musicIframe.style.left = '-9999px';
            musicIframe.style.width = '1px';
            musicIframe.style.height = '1px';
            musicIframe.style.border = 'none';
            musicIframe.style.opacity = '0';
            musicIframe.style.pointerEvents = 'none';
            document.body.appendChild(musicIframe);
            
            return musicIframe;
        }
        
        // Send command to iframe
        function sendToIframe(type, data = {}) {
            const iframe = getMusicIframe();
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage({ type, ...data }, window.location.origin);
            }
        }
        
        // Listen for messages from iframe
        window.addEventListener('message', function(event) {
            if (event.origin !== window.location.origin) return;
            
            const { type, paused, currentTime, duration, timestamp } = event.data;
            
            if (type === 'timeupdate') {
                musicState.currentTime = currentTime;
                musicState.paused = false;
                if (!musicState.paused) {
                    localStorage.setItem('musicTime', currentTime);
                    sessionStorage.setItem('musicState', 'playing');
                    sessionStorage.setItem('musicTime', currentTime);
                    sessionStorage.setItem('musicTimestamp', timestamp.toString());
                }
            } else if (type === 'state') {
                musicState.paused = paused;
                musicState.currentTime = currentTime;
                updateMusicUI(!paused);
            }
        });
        
        // Initialize music player
        function initMusicPlayer() {
            const iframe = getMusicIframe();
            
            // Wait for iframe to load
            iframe.addEventListener('load', function() {
                // Request current state
                sendToIframe('getState');
                
                // Try to restore and play
                const savedState = sessionStorage.getItem('musicState');
                const savedMusicState = localStorage.getItem('musicPlaying');
                const wasPaused = savedMusicState === 'false';
                
                if (savedState === 'playing' || (!wasPaused && savedState !== 'paused')) {
                    // Try to play
                    setTimeout(() => {
                        sendToIframe('play');
                        updateMusicUI(true);
                        localStorage.setItem('musicPlaying', 'true');
                    }, 100);
                } else {
                    updateMusicUI(false);
                }
            }, { once: true });
        }
        
        // Start music
        function startMusic() {
            sendToIframe('play');
            updateMusicUI(true);
            localStorage.setItem('musicPlaying', 'true');
        }
        
        // Pause music
        function pauseMusic() {
            sendToIframe('pause');
            updateMusicUI(false);
            localStorage.setItem('musicPlaying', 'false');
            sessionStorage.setItem('musicState', 'paused');
            sessionStorage.setItem('musicTime', musicState.currentTime.toString());
            sessionStorage.setItem('musicTimestamp', Date.now().toString());
        }
        
        // Initialize on page load
        initMusicPlayer();
        
        // User interaction to unlock autoplay
        const enableAutoplay = function() {
            if (!hasUserInteracted) {
                hasUserInteracted = true;
                const savedMusicState = localStorage.getItem('musicPlaying');
                if (savedMusicState !== 'false') {
                    startMusic();
                }
            }
        };
        ['click', 'touchstart', 'keydown', 'mousedown'].forEach(function(ev) {
            document.addEventListener(ev, enableAutoplay, { once: true });
        });
        
        // Music toggle functionality
        musicToggle.addEventListener('click', function() {
            hasUserInteracted = true;
            if (musicState.paused) {
                startMusic();
            } else {
                pauseMusic();
            }
        });
        
        // Save state before page unload
        window.addEventListener('beforeunload', function() {
            if (!musicState.paused) {
                sessionStorage.setItem('musicState', 'playing');
                sessionStorage.setItem('musicTime', musicState.currentTime.toString());
                sessionStorage.setItem('musicTimestamp', Date.now().toString());
            }
        });
        
        // On internal link click, save state immediately
        document.addEventListener('click', function(e) {
            const a = e.target.closest('a[href]');
            if (!a) return;
            const href = a.getAttribute('href') || '';
            if (href.startsWith('#') || href.startsWith('javascript:')) return;
            if (a.target === '_blank') return;
            try {
                const url = new URL(a.href);
                if (url.origin === window.location.origin && url.pathname !== window.location.pathname) {
                    if (!musicState.paused) {
                        sessionStorage.setItem('musicState', 'playing');
                        sessionStorage.setItem('musicTime', musicState.currentTime.toString());
                        sessionStorage.setItem('musicTimestamp', Date.now().toString());
                    }
                }
            } catch (err) {}
        }, true);
        
        // Periodically sync state from iframe
        setInterval(function() {
            sendToIframe('getState');
        }, 1000);
    }
});
