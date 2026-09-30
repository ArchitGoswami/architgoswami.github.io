// Portfolio interactions: theme, nav, reveal, particles, contact form.

document.documentElement.classList.remove('no-js');

let animate, inView;
try {
    ({ animate, inView } = await import('https://cdn.jsdelivr.net/npm/motion@11.15.0/+esm'));
} catch (err) {
    console.warn('Motion library failed to load, falling back to CSS-only state.', err);
}

const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

themeToggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', next === 'light' ? '#ffffff' : '#000000');
});

document.querySelectorAll('a[href^="#"]').forEach((anchorEl) => {
    anchorEl.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.pageYOffset - 72;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

function closeMenu() {
    navLinksEl.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
}

hamburger.addEventListener('click', () => {
    const open = navLinksEl.classList.toggle('open');
    hamburger.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
});

const navLinkEls = Array.from(document.querySelectorAll('.nav-link'));
const sections = document.querySelectorAll('main section[id]');

function setActiveLink(id) {
    navLinkEls.forEach((link) => {
        const on = link.dataset.nav === id;
        link.classList.toggle('active', on);
        if (on) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
    });
}

function activateNavOnScroll() {
    const scrollY = window.pageYOffset;
    let current = 'home';
    sections.forEach((section) => {
        if (scrollY >= section.offsetTop - 140) current = section.id;
    });
    setActiveLink(current);
}

window.addEventListener('scroll', activateNavOnScroll, { passive: true });
window.addEventListener('load', activateNavOnScroll);

const revealEls = document.querySelectorAll('[data-reveal]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion && animate && inView) {
    revealEls.forEach((el, i) => {
        inView(el, () => {
            animate(
                el,
                { opacity: [0, 1], transform: ['translateY(16px)', 'translateY(0px)'] },
                { duration: 0.7, delay: (i % 4) * 0.05, easing: [0.22, 1, 0.36, 1] }
            );
        }, { amount: 0.18 });
    });
} else {
    revealEls.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
    });
}

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! I will get back to you soon.');
        contactForm.reset();
    });
}

const backToTop = document.createElement('button');
backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTop.className = 'back-to-top';
backToTop.setAttribute('aria-label', 'Back to top');
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let dots = [];
    let width = 0;
    let height = 0;
    let running = true;

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const count = Math.max(28, Math.round((width * height) / 18000));
        dots = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 1.15 + 0.35,
            o: Math.random() * 0.45 + 0.15,
            vy: Math.random() * 0.18 + 0.04
        }));
    }

    function frame() {
        if (!running) return;
        ctx.clearRect(0, 0, width, height);
        const light = html.getAttribute('data-theme') === 'light';
        ctx.fillStyle = light ? '#111111' : '#ffffff';
        for (const dot of dots) {
            if (!reduceMotion) {
                dot.y -= dot.vy;
                if (dot.y < -2) dot.y = height + 2;
            }
            ctx.globalAlpha = dot.o;
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        requestAnimationFrame(frame);
    }

    resize();
    frame();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', () => {
        running = !document.hidden;
        if (running) frame();
    });
}

initParticles();
