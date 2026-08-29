// careers.js — Phorge.AI Careers page
// Mirrors the generic site behaviors in script.js (nav scroll, mobile menu,
// smooth scroll, active-link highlighting, info panel) with null-guards so
// this page never throws just because it doesn't have the homepage's
// testimonial slider / contact form / product tabs elements. Then adds the
// careers-specific interactions: benefits tabs, interview-process tabs, and
// the open-roles department filter.

(function () {
    'use strict';

    /* ── Navigation scroll effect ── */
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    /* ── Mobile menu ── */
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    function openMobileMenu() {
        mobileMenu?.classList.add('open');
        mobileMenuOverlay?.classList.add('open');
        mobileMenuBtn?.classList.add('active');
        document.body.classList.add('menu-open');
    }

    function closeMobileMenu() {
        mobileMenu?.classList.remove('open');
        mobileMenuOverlay?.classList.remove('open');
        mobileMenuBtn?.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    mobileMenuBtn?.addEventListener('click', openMobileMenu);
    mobileMenuClose?.addEventListener('click', closeMobileMenu);
    mobileMenuOverlay?.addEventListener('click', closeMobileMenu);
    mobileNavLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileMenu();
    });

    /* ── Smooth scroll for in-page + cross-page anchors ── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ── Active nav highlighting on scroll ── */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    function highlightNavOnScroll() {
        const scrollPos = window.scrollY + 150;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });
            }
        });
    }
    if (sections.length) window.addEventListener('scroll', highlightNavOnScroll);

    /* ── Info panel ── */
    const infoPanelBtn = document.getElementById('infoPanelBtn');
    const infoPanel = document.getElementById('infoPanel');
    const infoPanelOverlay = document.getElementById('infoPanelOverlay');
    const infoPanelClose = document.getElementById('infoPanelClose');

    function openInfoPanel(e) {
        if (e) e.preventDefault();
        infoPanel?.classList.add('open');
        infoPanelOverlay?.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeInfoPanel() {
        infoPanel?.classList.remove('open');
        infoPanelOverlay?.classList.remove('open');
        document.body.style.overflow = '';
    }

    infoPanelBtn?.addEventListener('click', openInfoPanel);
    infoPanelClose?.addEventListener('click', closeInfoPanel);
    infoPanelOverlay?.addEventListener('click', closeInfoPanel);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeInfoPanel();
    });

    /* ── Benefits tabs ── */
    const benefitTabBtns = document.querySelectorAll('.benefit-tab-btn');
    const benefitPanels = document.querySelectorAll('.benefits-tab-content');
    benefitTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-benefit-tab');
            benefitTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            benefitPanels.forEach(panel => {
                panel.classList.toggle('active', panel.id === 'benefit-' + id);
            });
        });
    });

    /* ── Interview process tabs ── */
    const processTabBtns = document.querySelectorAll('.process-tab-btn');
    const processPanels = document.querySelectorAll('.process-panel');
    processTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-process-tab');
            processTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            processPanels.forEach(panel => {
                panel.classList.toggle('active', panel.id === 'process-' + id);
            });
        });
    });

    /* ── Open roles: department filter ── */
    const roleFilterBtns = document.querySelectorAll('.role-filter-btn');
    const roleCards = document.querySelectorAll('.role-card');
    const rolesEmpty = document.querySelector('.roles-empty');

    roleFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const dept = btn.getAttribute('data-dept');
            roleFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            let visibleCount = 0;
            roleCards.forEach(card => {
                const match = dept === 'all' || card.getAttribute('data-dept') === dept;
                card.classList.toggle('role-hidden', !match);
                if (match) visibleCount++;
            });
            rolesEmpty?.classList.toggle('visible', visibleCount === 0);
        });
    });

    /* ── Hero title: curtain-lift word reveal (mirrors index.html) ── */
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const raw = heroTitle.innerHTML;
        heroTitle.innerHTML = raw.replace(/(<[^>]+>)|([^\s<]+)/g, function (m, tag, word) {
            if (tag) return tag;
            if (word) return '<span class="hero-word-outer"><span class="hero-word">' + word + '</span></span>';
            return m;
        });
        heroTitle.querySelectorAll('.hero-word').forEach(function (w, i) {
            w.style.animationDelay = (0.05 + i * 0.07) + 's';
        });
    }

    /* ── Scroll-reveal (mirrors index.html's inline reveal script) ── */
    if (typeof IntersectionObserver !== 'undefined') {
        document.querySelectorAll('[data-reveal="chars"]').forEach(function (el) {
            el.innerHTML = el.textContent.split('').map(function (ch) {
                return ch === ' '
                    ? '<span class="reveal-char" style="display:inline-block;min-width:0.3em"> </span>'
                    : '<span class="reveal-char">' + ch + '</span>';
            }).join('');
        });

        const obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                obs.unobserve(el);
                const type = el.dataset.reveal;

                if (type === 'chars') {
                    el.querySelectorAll('.reveal-char').forEach(function (ch, i) {
                        ch.style.animationDelay = (i * 0.04) + 's';
                    });
                    el.classList.add('revealed');
                    return;
                }
                if (type === 'lines') {
                    Array.from(el.children).forEach(function (child, i) {
                        child.style.transitionDelay = (i * 0.12) + 's';
                    });
                    el.classList.add('revealed');
                    return;
                }
                const group = el.parentElement
                    ? el.parentElement.querySelectorAll('[data-reveal="' + type + '"]')
                    : null;
                const idx = group ? Array.prototype.indexOf.call(group, el) : 0;
                el.style.animationDelay = (idx * 0.13) + 's';
                el.classList.add('revealed');
                el.addEventListener('animationend', function () {
                    el.style.animation = 'none';
                    el.style.animationDelay = '';
                    el.style.opacity = '1';
                    el.style.transform = '';
                }, { once: true });
            });
        }, { threshold: 0.12 });
        document.querySelectorAll('[data-reveal]').forEach(function (el) { obs.observe(el); });

        const cardObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                cardObs.unobserve(el);
                const idx = Array.prototype.indexOf.call(document.querySelectorAll('.service-card, .premium-card'), el);
                setTimeout(function () {
                    el.classList.add('in-view');
                }, 60 + idx * 90);
            });
        }, { threshold: 0.12 });
        document.querySelectorAll('.service-card').forEach(function (el) { cardObs.observe(el); });

        const brand = document.querySelector('.footer-brand-reveal');
        if (brand) {
            const fObs = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    brand.classList.add('in-view');
                    fObs.unobserve(brand);
                });
            }, { threshold: 0.2 });
            fObs.observe(brand);
        }
    }
})();