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
    const languageButton = document.getElementById('languageToggle');
    const languageIcon = languageButton?.querySelector('.language-icon');
    const languageLabel = languageButton?.querySelector('.language-label');

    const translations = {
        en: {
            'accessibility.skip': 'Skip to content',
            'accessibility.openNav': 'Open navigation',
            'nav.home': 'Home',
            'nav.about': 'About',
            'nav.publications': 'Publications',
            'nav.awards': 'Awards',
            'nav.contact': 'Contact',
            'hero.eyebrow': 'Ph.D. Researcher · HKUST(GZ)',
            'hero.title': 'I build agents that make sense of',
            'hero.titleAccent': 'cities.',
            'hero.lead': 'My work sits at the intersection of urban intelligence and foundation models—creating agents that understand complex city environments, reason across space and time, and make reliable real-world decisions.',
            'hero.researchCta': 'Explore research',
            'hero.contactCta': 'Get in touch',
            'hero.languageAgents': 'Language agents',
            'hero.visualReasoning': 'Visual reasoning',
            'hero.embodiedAction': 'Embodied action',
            'hero.focusLabel': 'Research focus',
            'hero.focusValue': 'Urban agents for<br>real-world systems',
            'hero.scroll': 'Scroll to discover',
            'about.kicker': '01 / About me',
            'about.title': 'Research grounded in the rhythm of real cities.',
            'about.bioLead': 'I am a Ph.D. student at the Information Hub of <a href="https://www.hkust-gz.edu.cn/" target="_blank" rel="noopener noreferrer">HKUST(GZ)</a>, supervised by <a href="https://raymondhliu.github.io/" target="_blank" rel="noopener noreferrer">Prof. Hao Liu</a> and guided by <a href="https://scholar.google.com/citations?user=cVDF1tkAAAAJ&amp;hl=en" target="_blank" rel="noopener noreferrer">Prof. Hui Xiong</a>.',
            'about.bioBody': "I earned my Bachelor's degree from Wuhan University in 2022 under the mentorship of Prof. Chenliang Li. Today, my research explores how LLM, VLM, and VLA agents can learn from complex urban data and support traffic control, mobility, navigation, and broader city decision-making.",
            'about.quote': 'Toward generalizable, collaborative, and trustworthy intelligence for cities.',
            'about.photography': 'Photography',
            'about.badminton': 'Badminton',
            'about.tennis': 'Tennis',
            'about.japanese': 'Japanese · JLPT N3',
            'about.education': 'Education & experience',
            'about.now': '2023—Now',
            'about.phd': 'Ph.D. Student',
            'about.ra': 'Research Assistant',
            'about.beng': 'B.Eng.',
            'about.whu': 'Wuhan University',
            'about.service': 'Academic service',
            'about.serviceHighlight': 'Session Chair &amp; Outstanding Reviewer <strong>Top 10%</strong>',
            'publications.kicker': '02 / Publications',
            'publications.title': 'Selected research',
            'publications.scholar': 'Complete profile on Google Scholar',
            'publications.featured': '01 / Featured work',
            'publications.gold': 'Gold Medal · Geneva 2025',
            'publications.audience': 'KDD Audience Appreciation Award',
            'publications.urbanReasoning': '02 / Urban reasoning',
            'publications.multiAgent': '03 / Multi-agent systems',
            'publications.navigation': '04 / Cooperative navigation',
            'publications.trustworthy': '05 / Trustworthy learning',
            'publications.mobility': '06 / Urban mobility',
            'publications.recommendation': '07 / Recommendation',
            'awards.kicker': '03 / Recognition',
            'awards.title': 'Ideas recognized beyond the lab.',
            'awards.lead': 'Selected conference, invention, and academic honors.',
            'awards.geneva2025': '2025 · Geneva',
            'awards.goldTitle': 'Gold Medal',
            'awards.goldBody': '50th International Exhibition of Inventions Geneva',
            'awards.specialTitle': 'Special Award',
            'awards.specialBody': 'Swiss Automobile Club Prize — ACS',
            'awards.audienceTitle': 'Audience Appreciation Award',
            'awards.audienceBody': 'For LLMLight at KDD 2025',
            'awards.nanjing2020': '2020 · Nanjing',
            'awards.secondTitle': 'Second Prize',
            'awards.secondBody': 'China Software Cup · CV-based traffic scene application',
            'awards.whu2021': '2021 · Wuhan University',
            'awards.academicTitle': 'Academic honors',
            'awards.scholarship': 'Academic Scholarship',
            'awards.student': 'Outstanding Student',
            'contact.kicker': '04 / Contact',
            'contact.title': 'Let’s build more intelligent cities.',
            'contact.lead': 'I’m always interested in thoughtful conversations around urban agents, multimodal reasoning, and real-world AI systems.',
            'contact.email': 'Email',
            'footer.role': 'Urban intelligence researcher',
            'footer.top': 'Back to top ↑',
            'music.on': 'Music on',
            'music.off': 'Music off',
            'music.play': 'Play background music',
            'music.pause': 'Pause background music'
        },
        zh: {
            'accessibility.skip': '跳至主要内容',
            'accessibility.openNav': '打开导航',
            'nav.home': '首页',
            'nav.about': '关于我',
            'nav.publications': '学术论文',
            'nav.awards': '荣誉奖项',
            'nav.contact': '联系我',
            'hero.eyebrow': '博士研究生 · 香港科技大学（广州）',
            'hero.title': '我致力于构建理解',
            'hero.titleAccent': '城市的智能体。',
            'hero.lead': '我的研究聚焦城市智能与基础模型的交汇点：构建能够理解复杂城市环境、进行时空推理，并在真实世界中做出可靠决策的智能体。',
            'hero.researchCta': '查看研究',
            'hero.contactCta': '与我联系',
            'hero.languageAgents': '语言智能体',
            'hero.visualReasoning': '视觉推理',
            'hero.embodiedAction': '具身行动',
            'hero.focusLabel': '研究方向',
            'hero.focusValue': '面向真实世界系统的<br>城市智能体',
            'hero.scroll': '向下探索',
            'about.kicker': '01 / 关于我',
            'about.title': '植根于真实城市脉动的研究。',
            'about.bioLead': '我是<a href="https://www.hkust-gz.edu.cn/" target="_blank" rel="noopener noreferrer">香港科技大学（广州）</a>信息枢纽的博士研究生，师从<a href="https://raymondhliu.github.io/" target="_blank" rel="noopener noreferrer">刘浩教授</a>，并接受<a href="https://scholar.google.com/citations?user=cVDF1tkAAAAJ&amp;hl=en" target="_blank" rel="noopener noreferrer">熊辉教授</a>指导。',
            'about.bioBody': '2022 年，我在李晨亮教授的指导下获得武汉大学学士学位。目前，我专注于探索 LLM、VLM 和 VLA 智能体如何从复杂城市数据中学习，并支持交通控制、城市出行、导航以及更广泛的城市决策。',
            'about.quote': '面向可泛化、可协作、值得信赖的城市智能。',
            'about.photography': '摄影',
            'about.badminton': '羽毛球',
            'about.tennis': '网球',
            'about.japanese': '日语 · JLPT N3',
            'about.education': '教育与经历',
            'about.now': '2023—至今',
            'about.phd': '博士研究生',
            'about.ra': '研究助理',
            'about.beng': '工学学士',
            'about.whu': '武汉大学',
            'about.service': '学术服务',
            'about.serviceHighlight': '分会主席与优秀审稿人 <strong>前 10%</strong>',
            'publications.kicker': '02 / 学术论文',
            'publications.title': '代表性研究',
            'publications.scholar': '在 Google Scholar 查看完整资料',
            'publications.featured': '01 / 精选工作',
            'publications.gold': '日内瓦国际发明展金奖 · 2025',
            'publications.audience': 'KDD 观众赞誉奖',
            'publications.urbanReasoning': '02 / 城市推理',
            'publications.multiAgent': '03 / 多智能体系统',
            'publications.navigation': '04 / 协同导航',
            'publications.trustworthy': '05 / 可信学习',
            'publications.mobility': '06 / 城市出行',
            'publications.recommendation': '07 / 推荐系统',
            'awards.kicker': '03 / 荣誉奖项',
            'awards.title': '让研究价值走出实验室。',
            'awards.lead': '部分会议奖项、发明荣誉与学术奖项。',
            'awards.geneva2025': '2025 · 日内瓦',
            'awards.goldTitle': '金奖',
            'awards.goldBody': '第 50 届日内瓦国际发明展',
            'awards.specialTitle': '特别奖',
            'awards.specialBody': '瑞士汽车俱乐部奖 — ACS',
            'awards.audienceTitle': '观众赞誉奖',
            'awards.audienceBody': 'LLMLight 获 KDD 2025 观众赞誉奖',
            'awards.nanjing2020': '2020 · 南京',
            'awards.secondTitle': '二等奖',
            'awards.secondBody': '中国软件杯 · 基于计算机视觉的交通场景应用',
            'awards.whu2021': '2021 · 武汉大学',
            'awards.academicTitle': '学术荣誉',
            'awards.scholarship': '学业奖学金',
            'awards.student': '优秀学生',
            'contact.kicker': '04 / 联系我',
            'contact.title': '一起构建更智能的城市。',
            'contact.lead': '欢迎与我交流城市智能体、多模态推理和真实世界 AI 系统等方向。',
            'contact.email': '邮箱',
            'footer.role': '城市智能研究者',
            'footer.top': '返回顶部 ↑',
            'music.on': '音乐已开启',
            'music.off': '音乐已关闭',
            'music.play': '播放背景音乐',
            'music.pause': '暂停背景音乐'
        }
    };

    const getSavedLanguage = () => {
        try {
            return localStorage.getItem('siteLanguage') === 'zh' ? 'zh' : 'en';
        } catch (error) {
            return 'en';
        }
    };

    let currentLanguage = getSavedLanguage();
    const t = key => translations[currentLanguage][key] || translations.en[key] || key;

    const applyLanguage = language => {
        currentLanguage = language === 'zh' ? 'zh' : 'en';
        document.documentElement.lang = currentLanguage === 'zh' ? 'zh-CN' : 'en';
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const value = t(element.dataset.i18n);
            if (value) element.innerHTML = value;
        });

        if (languageIcon) languageIcon.textContent = currentLanguage === 'en' ? '文' : 'EN';
        if (languageLabel) languageLabel.textContent = currentLanguage === 'en' ? '中文' : 'English';
        if (languageButton) {
            const label = currentLanguage === 'en' ? 'Switch to Chinese' : '切换到英文';
            languageButton.setAttribute('aria-label', label);
            languageButton.title = label;
        }

        nav?.setAttribute('aria-label', currentLanguage === 'en' ? 'Main navigation' : '主导航');
        document.querySelector('.brand')?.setAttribute('aria-label', currentLanguage === 'en' ? 'Siqi Lai, home' : 'Siqi Lai，首页');
        document.querySelector('.scroll-cue')?.setAttribute('aria-label', currentLanguage === 'en' ? 'Scroll to About section' : '滚动至关于我');
        document.querySelector('.hero-meta')?.setAttribute('aria-label', currentLanguage === 'en' ? 'Research focus' : '研究方向');
        document.querySelector('.interest-row')?.setAttribute('aria-label', currentLanguage === 'en' ? 'Personal interests' : '个人兴趣');
        document.querySelector('.portrait-frame img')?.setAttribute('alt', currentLanguage === 'en' ? 'Siqi Lai standing in front of an illuminated bridge' : 'Siqi Lai 在灯光映照的大桥前');
        document.querySelector('.contact-photo')?.setAttribute('aria-label', currentLanguage === 'en' ? 'HKUST Guangzhou campus' : '香港科技大学（广州）校园');
        document.title = currentLanguage === 'en' ? 'Siqi Lai — Urban Intelligence Researcher' : 'Siqi Lai — 城市智能研究者';
        document.querySelector('meta[name="description"]')?.setAttribute('content', currentLanguage === 'en'
            ? 'Siqi Lai is a Ph.D. researcher at HKUST(GZ), building language and embodied agents for intelligent urban systems.'
            : 'Siqi Lai 是香港科技大学（广州）博士研究生，致力于为智能城市系统构建语言与具身智能体。');
    };

    applyLanguage(currentLanguage);

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
        musicButton?.setAttribute('aria-label', playing ? t('music.pause') : t('music.play'));
        if (musicLabel) musicLabel.textContent = playing ? t('music.on') : t('music.off');
    };

    languageButton?.addEventListener('click', () => {
        const nextLanguage = currentLanguage === 'en' ? 'zh' : 'en';
        applyLanguage(nextLanguage);
        try {
            localStorage.setItem('siteLanguage', nextLanguage);
        } catch (error) {
            // The language still switches when storage is unavailable.
        }
        updateMusicButton(Boolean(music && !music.paused));
    });

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
    updateMusicButton(Boolean(music && !music.paused));

    const year = document.getElementById('copyright-year');
    if (year) year.textContent = new Date().getFullYear();

    if (window.location.hash) {
        requestAnimationFrame(() => document.querySelector(window.location.hash)?.scrollIntoView());
    }
});
