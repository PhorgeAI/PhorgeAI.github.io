// JavaScript Document

/*

*/


// Navigation scroll effect
const navbar = document.getElementById('navbar');

// Both scroll handlers below used to run their DOM reads/writes directly
// inside the 'scroll' event callback. The browser fires 'scroll' far more
// often than it paints (sometimes many times per animation frame), so every
// extra listener doing class toggles and offsetTop/offsetHeight reads in
// there adds up to visible jank and a "sticky" feel while scrolling — each
// event forces layout work outside the browser's own paint cadence. Coalescing
// both into a single rAF-scheduled update makes them run at most once per
// rendered frame, which is all that's ever visible anyway.
let scrollScheduled = false;
function onScrollFrame() {
    scrollScheduled = false;
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    highlightNavOnScroll();
}
function requestScrollUpdate() {
    if (!scrollScheduled) {
        scrollScheduled = true;
        requestAnimationFrame(onScrollFrame);
    }
}
window.addEventListener('scroll', requestScrollUpdate, { passive: true });

// Mobile Menu
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const mobileMenuClose = document.getElementById('mobileMenuClose');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

function openMobileMenu() {
    mobileMenu.classList.add('open');
    mobileMenuOverlay.classList.add('open');
    mobileMenuBtn.classList.add('active');
    document.body.classList.add('menu-open');
}

function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    mobileMenuOverlay.classList.remove('open');
    mobileMenuBtn.classList.remove('active');
    document.body.classList.remove('menu-open');
}

mobileMenuBtn.addEventListener('click', openMobileMenu);
mobileMenuClose.addEventListener('click', closeMobileMenu);
mobileMenuOverlay.addEventListener('click', closeMobileMenu);

// Close mobile menu when clicking a link
mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeMobileMenu();
    });
});

// Close mobile menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeMobileMenu();
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Guard against bare "#" placeholder links ? document.querySelector('#')
        // throws (invalid selector), which would silently kill this handler.
        if (!href || href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active menu highlighting on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function highlightNavOnScroll() {
    const scrollPos = window.scrollY + 150;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            // Desktop nav
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + sectionId) {
                    link.classList.add('active');
                }
            });
            // Mobile nav
            mobileNavLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + sectionId) {
                    link.classList.add('active');
                }
            });
        }
    });

    // Remove active if at top of page
    if (window.scrollY < 100) {
        navLinks.forEach(link => link.classList.remove('active'));
        mobileNavLinks.forEach(link => link.classList.remove('active'));
    }
}

// (called from the rAF-batched requestScrollUpdate() above, not its own listener)

// Product tabs
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.products-tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');

        // Remove active from all buttons
        tabBtns.forEach(b => b.classList.remove('active'));
        // Add active to clicked button
        btn.classList.add('active');

        // Hide all tab contents
        tabContents.forEach(content => {
            content.classList.remove('active');
        });

        // Show selected tab content
        const activeContent = document.getElementById('tab-' + tabId);
        if (activeContent) {
            activeContent.classList.add('active');
        }
    });
});

// Testimonial Slider
const testimonialsTrack = document.getElementById('testimonialsTrack');
const testimonialDots = document.querySelectorAll('#testimonialDots .dot');
const testimonialPrev = document.getElementById('testimonialPrev');
const testimonialNext = document.getElementById('testimonialNext');
const totalTestimonials = testimonialDots.length;
let currentTestimonial = 0;

function goToTestimonial(index) {
    if (index < 0) index = totalTestimonials - 1;
    if (index >= totalTestimonials) index = 0;

    currentTestimonial = index;
    testimonialsTrack.style.transform = `translateX(-${currentTestimonial * 100}%)`;

    testimonialDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentTestimonial);
    });
}

testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        goToTestimonial(index);
    });
});

testimonialPrev.addEventListener('click', () => {
    goToTestimonial(currentTestimonial - 1);
});

testimonialNext.addEventListener('click', () => {
    goToTestimonial(currentTestimonial + 1);
});

// Auto-advance testimonials every 6 seconds
let testimonialAutoPlay = setInterval(() => {
    goToTestimonial(currentTestimonial + 1);
}, 6000);

// Pause auto-play on hover
document.querySelector('.testimonials-wrapper').addEventListener('mouseenter', () => {
    clearInterval(testimonialAutoPlay);
});

document.querySelector('.testimonials-wrapper').addEventListener('mouseleave', () => {
    testimonialAutoPlay = setInterval(() => {
        goToTestimonial(currentTestimonial + 1);
    }, 6000);
});

// Form submission
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for your inquiry! Our team will contact you within 24 hours.');
    contactForm.reset();
});

// Info Panel (grip-vertical button)
const infoPanelBtn = document.getElementById('infoPanelBtn');
const infoPanel = document.getElementById('infoPanel');
const infoPanelOverlay = document.getElementById('infoPanelOverlay');
const infoPanelClose = document.getElementById('infoPanelClose');

function openInfoPanel(e) {
    if (e) e.preventDefault();
    infoPanel.classList.add('open');
    infoPanelOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeInfoPanel() {
    infoPanel.classList.remove('open');
    infoPanelOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

if (infoPanelBtn) infoPanelBtn.addEventListener('click', openInfoPanel);
if (infoPanelClose) infoPanelClose.addEventListener('click', closeInfoPanel);
if (infoPanelOverlay) infoPanelOverlay.addEventListener('click', closeInfoPanel);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeInfoPanel();
});