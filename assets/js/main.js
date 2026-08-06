// ==========================================
// ARCHIT GOSWAMI — PORTFOLIO JS
// Theming, nav, scroll-spy + Motion-powered animation
// ==========================================

document.documentElement.classList.remove('no-js');

/* ---------- Motion (motion.dev) — loaded from CDN, degrades gracefully ---------- */
let animate, inView, stagger;
try {
    ({ animate, inView, stagger } = await import('https://cdn.jsdelivr.net/npm/motion@11.15.0/+esm'));
} catch (err) {
    console.warn('Motion library failed to load, falling back to CSS-only state.', err);
}

/* ---------- Theme Management ---------- */
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

const currentTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    if (animate) animate(themeToggle, { scale: [0.85, 1] }, { duration: 0.3, easing: 'ease-out' });
});

/* ---------- Smooth Scrolling ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchorEl => {
    anchorEl.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    });
});

/* ---------- Mobile Menu ---------- */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinksEl.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinksEl.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

/* ---------- Sliding nav pill (mirrors the highlighted-tab look) ---------- */
const navPill = document.querySelector('.nav-pill');
const navLinkEls = Array.from(document.querySelectorAll('.nav-link'));

function movePillTo(link) {
    if (!navPill || !link) return;
    const pillParentRect = navPill.parentElement.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const x = linkRect.left - pillParentRect.left - 3;
    const width = linkRect.width;

    if (animate) {
        animate(navPill, { x, width }, { duration: 0.35, easing: [0.22, 1, 0.36, 1] });
    } else {
        navPill.style.transform = `translateX(${x}px)`;
        navPill.style.width = `${width}px`;
    }
}

function setActiveLink(id) {
    navLinkEls.forEach(link => {
        link.classList.toggle('active', link.dataset.nav === id);
    });
    const activeLink = navLinkEls.find(link => link.dataset.nav === id);
    movePillTo(activeLink);
}

window.addEventListener('load', () => setActiveLink('home'));
window.addEventListener('resize', () => {
    const active = navLinkEls.find(link => link.classList.contains('active'));
    movePillTo(active);
});

/* ---------- Active Navigation on Scroll ---------- */
const sections = document.querySelectorAll('section[id]');

function activateNavOnScroll() {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 140;
        const sectionId = section.getAttribute('id');
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            setActiveLink(sectionId);
        }
    });
}
window.addEventListener('scroll', activateNavOnScroll, { passive: true });

/* ---------- Navbar shadow on scroll ---------- */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 30 ? 'var(--shadow-xl)' : 'var(--shadow-lg)';
}, { passive: true });

/* ---------- Scroll-reveal animations ---------- */
const revealEls = document.querySelectorAll('[data-reveal]');

if (animate && inView) {
    revealEls.forEach((el, i) => {
        inView(el, () => {
            animate(
                el,
                { opacity: [0, 1], transform: ['translateY(24px)', 'translateY(0px)'] },
                { duration: 0.6, delay: (i % 6) * 0.06, easing: [0.22, 1, 0.36, 1] }
            );
        }, { amount: 0.2 });
    });

    // Stagger the skill pills and timeline items a touch more explicitly
    const skillItems = document.querySelectorAll('.skills-grid li');
    if (skillItems.length) {
        inView('#skillsGrid', () => {
            animate(skillItems, { opacity: [0, 1], scale: [0.9, 1] }, { delay: stagger(0.03), duration: 0.4 });
        }, { amount: 0.3 });
    }
} else {
    // No-JS-animation fallback: just make everything visible
    revealEls.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
}

/* ---------- Hover micro-interactions on windows & cards ---------- */
if (animate) {
    document.querySelectorAll('.window').forEach(card => {
        card.addEventListener('mouseenter', () => {
            animate(card, { transform: ['translateY(0px)', 'translateY(-4px)'] }, { duration: 0.25, easing: 'ease-out' });
        });
        card.addEventListener('mouseleave', () => {
            animate(card, { transform: ['translateY(-4px)', 'translateY(0px)'] }, { duration: 0.25, easing: 'ease-out' });
        });
    });

    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => animate(btn, { scale: 1.04 }, { duration: 0.2 }));
        btn.addEventListener('mouseleave', () => animate(btn, { scale: 1 }, { duration: 0.2 }));
    });
}

/* ---------- Contact Form ---------- */
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! I will get back to you soon.');
        contactForm.reset();
    });
}

/* ---------- Back to Top ---------- */
const backToTop = document.createElement('button');
backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTop.className = 'back-to-top';
backToTop.setAttribute('aria-label', 'Back to top');
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---------- Console Easter Egg ---------- */
console.log('%c👋 Hello, fellow developer!', 'font-size: 20px; font-weight: bold; color: #88BDF2;');
console.log('%cLike what you see? Let\'s connect!', 'font-size: 14px; color: #6A89A7;');
