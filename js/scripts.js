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

    // Background Music Control with Cross-Page Continuity
    if (bgMusic && musicToggle && musicStatus) {
        // Set initial volume (30% for background music)
        bgMusic.volume = 0.3;
        
        // Create BroadcastChannel for cross-page communication
        const musicChannel = new BroadcastChannel('background-music');
        let hasUserInteracted = false;
        let isInitialized = false;
        
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
        
        // Function to start playing music
        function startMusic() {
            if (bgMusic.paused) {
                bgMusic.play().then(() => {
                    updateMusicUI(true);
                    localStorage.setItem('musicPlaying', 'true');
                    // Broadcast to other pages
                    musicChannel.postMessage({
                        type: 'play',
                        currentTime: bgMusic.currentTime,
                        timestamp: Date.now()
                    });
                }).catch(error => {
                    console.log('Audio play failed:', error);
                });
            }
        }
        
        // Function to pause music
        function pauseMusic() {
            if (!bgMusic.paused) {
                bgMusic.pause();
                updateMusicUI(false);
                localStorage.setItem('musicPlaying', 'false');
                // Broadcast to other pages
                musicChannel.postMessage({
                    type: 'pause',
                    currentTime: bgMusic.currentTime,
                    timestamp: Date.now()
                });
            }
        }
        
        // Function to sync with other pages
        function syncWithOtherPages() {
            const savedState = sessionStorage.getItem('musicState');
            const savedTime = sessionStorage.getItem('musicTime');
            const savedTimestamp = sessionStorage.getItem('musicTimestamp');
            
            if (savedState === 'playing' && savedTime && savedTimestamp) {
                const timeDiff = (Date.now() - parseInt(savedTimestamp)) / 1000;
                const newTime = parseFloat(savedTime) + timeDiff;
                
                // Set the time and try to play
                bgMusic.currentTime = newTime % bgMusic.duration;
                startMusic();
                return true;
            }
            return false;
        }
        
        // Listen for messages from other pages
        musicChannel.onmessage = function(event) {
            const { type, currentTime, timestamp } = event.data;
            
            if (type === 'play') {
                // Another page is playing, sync with it
                const timeDiff = (Date.now() - timestamp) / 1000;
                const newTime = (currentTime + timeDiff) % bgMusic.duration;
                bgMusic.currentTime = newTime;
                startMusic();
            } else if (type === 'pause') {
                // Another page paused, sync with it
                pauseMusic();
            } else if (type === 'timeupdate') {
                // Sync time from another page
                const timeDiff = (Date.now() - timestamp) / 1000;
                const newTime = (currentTime + timeDiff) % bgMusic.duration;
                if (Math.abs(bgMusic.currentTime - newTime) > 1) {
                    bgMusic.currentTime = newTime;
                }
            }
        };
        
        // Try to sync with other pages first
        const synced = syncWithOtherPages();
        
        // Load saved music state
        const savedMusicState = localStorage.getItem('musicPlaying');
        const savedMusicTime = localStorage.getItem('musicTime');
        const wasPaused = savedMusicState === 'false';
        
        // Initialize music
        if (!synced) {
            if (savedMusicTime) {
                bgMusic.currentTime = parseFloat(savedMusicTime);
            }
            
            // Try to auto-play if not paused
            if (!wasPaused) {
                // Use user interaction to enable autoplay
                const enableAutoplay = function() {
                    if (!hasUserInteracted && !isInitialized) {
                        hasUserInteracted = true;
                        startMusic();
                    }
                };
                
                // Listen for any user interaction
                const interactionEvents = ['click', 'touchstart', 'keydown', 'mousedown'];
                interactionEvents.forEach(eventType => {
                    document.addEventListener(eventType, enableAutoplay, { once: true });
                });
                
                // Try immediate autoplay (may be blocked by browser)
                bgMusic.play().then(() => {
                    hasUserInteracted = true;
                    updateMusicUI(true);
                    localStorage.setItem('musicPlaying', 'true');
                }).catch(() => {
                    // Autoplay blocked, wait for user interaction
                    updateMusicUI(false);
                });
                
                isInitialized = true;
            } else {
                updateMusicUI(false);
                isInitialized = true;
            }
        } else {
            isInitialized = true;
        }
        
        // Music toggle functionality
        musicToggle.addEventListener('click', function() {
            hasUserInteracted = true;
            if (bgMusic.paused) {
                startMusic();
            } else {
                pauseMusic();
            }
        });
        
        // Save playback position periodically
        bgMusic.addEventListener('timeupdate', function() {
            if (!bgMusic.paused) {
                const currentTime = bgMusic.currentTime;
                localStorage.setItem('musicTime', currentTime);
                sessionStorage.setItem('musicState', 'playing');
                sessionStorage.setItem('musicTime', currentTime);
                sessionStorage.setItem('musicTimestamp', Date.now().toString());
                
                // Broadcast time update to other pages
                musicChannel.postMessage({
                    type: 'timeupdate',
                    currentTime: currentTime,
                    timestamp: Date.now()
                });
            }
        });
        
        // Handle pause
        bgMusic.addEventListener('pause', function() {
            sessionStorage.setItem('musicState', 'paused');
            sessionStorage.setItem('musicTime', bgMusic.currentTime.toString());
            sessionStorage.setItem('musicTimestamp', Date.now().toString());
        });
        
        // Handle audio ended (shouldn't happen with loop)
        bgMusic.addEventListener('ended', function() {
            updateMusicUI(false);
        });
        
        // Handle audio errors
        bgMusic.addEventListener('error', function(e) {
            console.error('Audio error:', e);
            musicToggle.style.display = 'none';
        });
        
        // Handle page visibility - pause when hidden, resume when visible
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                // Page is hidden, save state
                if (!bgMusic.paused) {
                    sessionStorage.setItem('musicState', 'playing');
                    sessionStorage.setItem('musicTime', bgMusic.currentTime.toString());
                    sessionStorage.setItem('musicTimestamp', Date.now().toString());
                }
            } else {
                // Page is visible, try to sync
                if (!wasPaused && hasUserInteracted) {
                    syncWithOtherPages();
                }
            }
        });
        
        // Save state before page unload
        window.addEventListener('beforeunload', function() {
            if (!bgMusic.paused) {
                sessionStorage.setItem('musicState', 'playing');
                sessionStorage.setItem('musicTime', bgMusic.currentTime.toString());
                sessionStorage.setItem('musicTimestamp', Date.now().toString());
            }
        });
    }
});
