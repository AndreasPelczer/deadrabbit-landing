// RENT US Glanzgarage — Interaktionen

// Jahr im Footer
document.getElementById('year').textContent = new Date().getFullYear();

// Header-Hintergrund beim Scrollen
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 30);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile-Navigation
const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');
const toggleNav = (open) => {
  mobileNav.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
};
burger.addEventListener('click', () => toggleNav(!mobileNav.classList.contains('open')));
mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleNav(false)));

// Reveal-Animationen beim Scrollen
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Vorher / Nachher – Regler
(function () {
  const ba = document.getElementById('ba');
  if (!ba) return;
  const before = document.getElementById('baBefore');
  const handle = document.getElementById('baHandle');
  const grip = document.getElementById('baGrip');
  let dragging = false;

  const setPct = (pct) => {
    pct = Math.max(0, Math.min(100, pct));
    before.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
    handle.style.left = pct + '%';
    grip.style.left = pct + '%';
  };
  const fromEvent = (e) => {
    const r = ba.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
    setPct((x / r.width) * 100);
  };

  ba.addEventListener('mousedown', (e) => { dragging = true; fromEvent(e); });
  window.addEventListener('mousemove', (e) => { if (dragging) fromEvent(e); });
  window.addEventListener('mouseup', () => { dragging = false; });
  ba.addEventListener('touchstart', (e) => { dragging = true; fromEvent(e); }, { passive: true });
  ba.addEventListener('touchmove', (e) => { if (dragging) fromEvent(e); }, { passive: true });
  ba.addEventListener('touchend', () => { dragging = false; });
  setPct(50);
})();

// Glanzlicht folgt der Maus (mit sanftem Nachziehen)
(function () {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || reduced) return;

  let tx = window.innerWidth / 2, ty = window.innerHeight / 2;   // Ziel
  let cx = tx, cy = ty;                                          // aktuell (gerendert)
  let active = false, raf = null;

  const step = () => {                       // ein Lerp-Schritt + sofortiges Schreiben
    cx += (tx - cx) * 0.16;                  // Lerp = weiches Trailing
    cy += (ty - cy) * 0.16;
    glow.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0) translate(-50%,-50%)';
    return Math.abs(tx - cx) > 0.4 || Math.abs(ty - cy) > 0.4;
  };
  const loop = () => { raf = step() ? requestAnimationFrame(loop) : null; };

  window.addEventListener('mousemove', (e) => {
    tx = e.clientX; ty = e.clientY;
    if (!active) { active = true; cx = tx; cy = ty; glow.classList.add('on'); }
    step();                                  // sofort positionieren (robust ohne rAF)
    if (raf == null) raf = requestAnimationFrame(loop);
  });
  document.addEventListener('mouseleave', () => { active = false; glow.classList.remove('on'); });
})();

// Eastereggs: Shine-Sweep, Funken, Gruß + Tab-Wechsel
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Wiederverwendbares Glanzlicht, das einmal über die Seite wischt
  const sweepEl = document.createElement('div');
  sweepEl.className = 'shine-sweep';
  sweepEl.innerHTML = '<div class="bar"></div>';
  document.body.appendChild(sweepEl);
  const bar = sweepEl.querySelector('.bar');
  let sweeping = false;
  const shineSweep = () => {
    if (reduced || sweeping) return;
    sweeping = true;
    sweepEl.classList.add('run');
    const done = () => { sweepEl.classList.remove('run'); sweeping = false; bar.removeEventListener('animationend', done); };
    bar.addEventListener('animationend', done);
  };

  // Kleiner Gruß unten
  const toast = document.createElement('div');
  toast.className = 'egg-toast';
  document.body.appendChild(toast);
  let toastTimer = null;
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  };

  // Funken an einer Position
  const sparkAt = (x, y) => {
    if (reduced) return;
    const star = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l2.4 9.6L24 12l-9.6 2.4L12 24l-2.4-9.6L0 12l9.6-2.4z"/></svg>';
    for (let i = 0; i < 12; i++) {
      const s = document.createElement('span');
      s.className = 'spark';
      const ang = (Math.PI * 2 * i) / 12 + Math.random();
      const dist = 40 + Math.random() * 55;
      s.style.left = x + 'px';
      s.style.top = y + 'px';
      s.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
      s.style.setProperty('--dy', Math.sin(ang) * dist + 'px');
      s.style.width = s.style.height = (7 + Math.random() * 9) + 'px';
      s.innerHTML = star;
      document.body.appendChild(s);
      s.addEventListener('animationend', () => s.remove());
    }
  };

  // 1) Logo 5× klicken → Politur
  const brand = document.querySelector('.header .brand');
  if (brand) {
    let clicks = 0, clickTimer = null;
    brand.addEventListener('click', () => {
      clicks++;
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => { clicks = 0; }, 1200);
      if (clicks >= 5) {
        clicks = 0;
        const r = brand.getBoundingClientRect();
        sparkAt(r.left + r.width / 2, r.top + r.height / 2);
        shineSweep();
        showToast('Frisch poliert! ✨');
      }
    });
  }

  // 2) "glanz" tippen → Shine-Sweep
  let buffer = '';
  window.addEventListener('keydown', (e) => {
    if (e.key && e.key.length === 1) {
      buffer = (buffer + e.key.toLowerCase()).slice(-6);
      if (buffer.endsWith('glanz')) {
        shineSweep();
        showToast('Glanz-Modus ✨');
        buffer = '';
      }
    }
  });

  // 3) Tab-Wechsel → Titel-Augenzwinkern, beim Zurückkommen ein Glanzlicht
  const origTitle = document.title;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      document.title = '✨ Komm zurück – dein Lack glänzt!';
    } else {
      document.title = origTitle;
      shineSweep();
    }
  });
})();
