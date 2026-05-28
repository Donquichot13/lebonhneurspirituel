/* ============================================================
   Le Bonheur Spirituel — main.js
   ============================================================ */

/* Navigation : sticky + hamburger */
const nav = document.querySelector('.site-nav');
const hamburger = document.getElementById('nav-hamburger');
const navLinks = document.getElementById('nav-links');
const scrollTopBtn = document.querySelector('.scroll-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav?.classList.add('scrolled');
    scrollTopBtn?.classList.add('visible');
  } else {
    nav?.classList.remove('scrolled');
    scrollTopBtn?.classList.remove('visible');
  }
}, { passive: true });

hamburger?.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  navLinks?.classList.toggle('open', isOpen);
});

navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
  });
});

/* Active nav link */
const currentFile = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  if (link.getAttribute('href') === currentFile) link.classList.add('active');
});

/* Scroll-to-top */
scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* Scroll animations (Intersection Observer) */
const fadeEls = document.querySelectorAll('.fade-in');
if (fadeEls.length && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );
  fadeEls.forEach(el => io.observe(el));
} else {
  fadeEls.forEach(el => el.classList.add('visible'));
}

/* Stars in hero */
function createStars() {
  const container = document.querySelector('.hero-stars');
  if (!container) return;
  for (let i = 0; i < 45; i++) {
    const s = document.createElement('span');
    s.classList.add('star');
    const size = Math.random() * 2.5 + 0.8;
    s.style.cssText = `
      width:${size}px; height:${size}px;
      top:${Math.random() * 100}%;
      left:${Math.random() * 100}%;
      animation-delay:${(Math.random() * 4).toFixed(2)}s;
      animation-duration:${(2 + Math.random() * 3).toFixed(2)}s;
    `;
    container.appendChild(s);
  }
}
createStars();

/* Testimonials slider */
(function initSlider() {
  const wrap = document.querySelector('.testimonials-wrap');
  const track = document.querySelector('.testimonial-track');
  if (!track) return;

  const slides = Array.from(track.children);
  const total = slides.length;
  if (total < 2) return;

  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.querySelector('.slider-btn--prev');
  const nextBtn = document.querySelector('.slider-btn--next');
  let current = 0;
  let autoId;

  function getSlideW() {
    const gap = parseFloat(getComputedStyle(track).gap) || 24;
    return slides[0].getBoundingClientRect().width + gap;
  }

  function goTo(idx) {
    current = ((idx % total) + total) % total;
    track.style.transform = `translateX(-${current * getSlideW()}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function startAuto() { autoId = setInterval(() => goTo(current + 1), 5500); }
  function stopAuto() { clearInterval(autoId); }

  prevBtn?.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
  nextBtn?.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); }));

  wrap?.addEventListener('mouseenter', stopAuto);
  wrap?.addEventListener('mouseleave', startAuto);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => goTo(current), 200);
  }, { passive: true });

  if (dots[0]) dots[0].classList.add('active');
  startAuto();
})();

/* Smooth scroll for anchor links */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = (nav?.offsetHeight || 72) + 8;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  });
});

/* Contact form (simulated — replace with real endpoint) */
const contactForm = document.getElementById('contact-form');
contactForm?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = contactForm.querySelector('[type="submit"]');
  const original = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Envoi en cours…';

  setTimeout(() => {
    btn.textContent = '✓ Message envoyé !';
    btn.style.background = '#5A9E6A';
    contactForm.reset();
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = original;
      btn.style.background = '';
    }, 4000);
  }, 1400);
});
