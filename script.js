// Menu mobile
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');

if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  nav.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => nav.classList.remove('open'));
  });
}

// Header shadow on scroll
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (!header) return;
  header.style.boxShadow = window.scrollY > 10 ? '0 8px 24px rgba(11,47,45,.08)' : 'none';
}, { passive: true });

// Faixa em loop constante + sincronizada com a rolagem:
// rolando para baixo -> vai para a esquerda | rolando para cima -> vai para a direita
(function initSyncedMarquee() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;

  // Garante duas metades idênticas para loop perfeito (4 blocos no total)
  track.innerHTML += track.innerHTML;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let x = 0;
  let half = 0;
  const measure = () => { half = track.scrollWidth / 2 || 1; };
  measure();
  window.addEventListener('resize', measure);

  const BASE_SPEED = reduceMotion ? 0 : 70; // px/s — loop constante mesmo parado
  let targetDir = -1;   // -1 = esquerda (descendo) | +1 = direita (subindo)
  let currentDir = -1;
  let boost = 0;        // impulso extra proporcional à velocidade do scroll
  let lastY = window.scrollY;
  let lastT = performance.now();

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const delta = y - lastY;
    lastY = y;
    if (delta > 0) targetDir = -1;       // descendo -> esquerda
    else if (delta < 0) targetDir = 1;   // subindo -> direita
    // Impulso sincronizado (limitado para não disparar)
    boost += delta * 1.2;
    boost = Math.max(-900, Math.min(900, boost));
  }, { passive: true });

  function frame(now) {
    const dt = Math.min((now - lastT) / 1000, 0.05);
    lastT = now;

    // Suaviza a inversão de direção (sem tranco)
    currentDir += (targetDir - currentDir) * 0.08;

    // Decai o impulso aos poucos
    boost *= 0.94;
    if (Math.abs(boost) < 1) boost = 0;

    x += (BASE_SPEED * currentDir + boost * 2.2) * dt;

    // Loop infinito: envolve dentro de uma metade
    if (half > 0) {
      if (x <= -half) x += half;
      else if (x > 0) x -= half;
    }

    track.style.transform = `translate3d(${x}px, 0, 0)`;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
// Ano dinâmico
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Reveal on scroll
const revealEls = document.querySelectorAll('.service, .who, .place, .t-card, .step, .mini-card, .section-head, .about-cards');
revealEls.forEach((el) => el.classList.add('reveal'));

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealEls.forEach((el) => io.observe(el));
