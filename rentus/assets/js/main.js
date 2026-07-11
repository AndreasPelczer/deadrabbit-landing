// RENT US Glanzgarage — Interaktionen

// Beim Laden oben beim Hero starten. Safari-Scroll-Restore (auch 'load'/'pageshow'
// aus dem bfcache) UND ein beim Teilen mitgewanderter Sektions-#anker starten die
// Seite sonst mitten drin. Nur der funktionale Deep-Link #buchung bleibt erhalten.
try { history.scrollRestoration = 'manual'; } catch (e) {}
(function () {
  const keepHash = location.hash === '#buchung';
  if (!keepHash && location.hash) {
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
  }
  const toTop = () => { if (!keepHash) window.scrollTo(0, 0); };
  toTop();
  window.addEventListener('load', toTop);
  window.addEventListener('pageshow', toTop);
})();

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

// Anker-Navigation: sanft scrollen, aber die URL sauber halten. Ein hängengebliebener
// #anker wandert sonst beim Teilen mit und startet die geteilte Seite mitten drin.
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').slice(1);
    const target = id ? document.getElementById(id) : document.body;
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    try { history.replaceState(null, '', location.pathname + location.search); } catch (err) {}
  });
});

// Reveal-Animationen beim Scrollen
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Kontaktformular -> WhatsApp (statt Formspree-Platzhalter). Pflichtfelder greifen
// weiter (Browser-Validierung vor submit). Öffnet WhatsApp mit den Angaben.
const kontaktForm = document.getElementById('kontaktForm');
if (kontaktForm) {
  kontaktForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const g = (idv) => (document.getElementById(idv)?.value || '').trim();
    const t = 'Kontakt über die Website:\n'
      + '– Name: ' + (g('name') || '-') + '\n'
      + (g('email') ? '– E-Mail: ' + g('email') + '\n' : '')
      + (g('phone') ? '– Telefon: ' + g('phone') + '\n' : '')
      + '– Nachricht: ' + (g('msg') || '-');
    window.open('https://wa.me/4915901606913?text=' + encodeURIComponent(t), '_blank', 'noopener');
  });
}

// Vorher / Nachher – Regler (mehrfach nutzbar)
document.querySelectorAll('[data-ba]').forEach((ba) => {
  const before = ba.querySelector('[data-ba-before]');
  const handle = ba.querySelector('[data-ba-handle]');
  const grip   = ba.querySelector('[data-ba-grip]');
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
});

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

// ===== Buchungs-Wizard (Welle 2) =====
(function () {
  const wiz = document.getElementById('wizard');
  if (!wiz) return;
  const state = { typ: null, faktor: 1, paket: null, preis: 0, step: 1 };
  const steps = wiz.querySelectorAll('.wstep');
  const dots = wiz.querySelectorAll('.wdot');
  const prev = document.getElementById('wPrev');
  const next = document.getElementById('wNext');

  function show(n) {
    state.step = Math.max(1, Math.min(4, n));
    steps.forEach(s => s.classList.toggle('on', +s.dataset.step === state.step));
    dots.forEach(d => d.classList.toggle('on', +d.dataset.d <= state.step));
    prev.disabled = state.step === 1;
    next.style.visibility = state.step === 4 ? 'hidden' : 'visible';
    if (state.step === 4) { summary(); links(); }
  }
  function preise() {
    wiz.querySelectorAll('[data-base]').forEach(el => {
      el.textContent = Math.round(+el.dataset.base * state.faktor);
    });
    wiz.querySelectorAll('[data-range-min]').forEach(el => {
      el.textContent = Math.round(+el.dataset.rangeMin * state.faktor) + '-' + Math.round(+el.dataset.rangeMax * state.faktor);
    });
  }
  function selectTypButton(b) {
    wiz.querySelectorAll('[data-typ]').forEach(x => x.classList.remove('sel'));
    b.classList.add('sel');
    state.typ = b.dataset.typ; state.faktor = +b.dataset.faktor; preise();
  }
  wiz.querySelectorAll('[data-typ]').forEach(b => b.addEventListener('click', () => {
    selectTypButton(b);
    setTimeout(() => show(state.paket ? 3 : 2), 250);
  }));
  wiz.querySelectorAll('[data-paket]').forEach(b => b.addEventListener('click', () => {
    wiz.querySelectorAll('[data-paket]').forEach(x => x.classList.remove('sel'));
    b.classList.add('sel');
    state.paket = b.dataset.paket;
    state.preis = b.dataset.preis === '0' ? (state.faktor > 1 ? '72-96' : '60-80') : Math.round(+b.dataset.preis * state.faktor);
    setTimeout(() => show(3), 250);
  }));
  function val(name) { const el = wiz.querySelector('input[name="' + name + '"]:checked'); return el ? el.value : ''; }
  function summary() {
    const d = document.getElementById('wDatum').value;
    const datum = d ? new Date(d).toLocaleDateString('de-DE') : 'nach Absprache';
    document.getElementById('wSummary').innerHTML =
      'Fahrzeug: <b>' + (state.typ || '&ndash;') + '</b><br>' +
      'Leistung: <b>' + (state.paket || '&ndash;') + '</b> (ab ' + state.preis + ' &euro;)<br>' +
      'Abholung: <b>' + val('abhol') + '</b> ' + (document.getElementById('wOrt').value || '') + '<br>' +
      'Wunschtermin: <b>' + datum + ', ' + val('halbtag') + '</b>';
  }
  function baueText() {
    const d = document.getElementById('wDatum').value;
    const datum = d ? new Date(d).toLocaleDateString('de-DE') : 'nach Absprache';
    const faktorHinweis = state.faktor > 1 ? '– Preis-Hinweis: SUV/Bus/Van +20 % ist eingerechnet\n' : '';
    return 'Hallo Mike! Anfrage über die Website:\n'
      + '– Fahrzeug: ' + (state.typ || '-') + '\n'
      + '– Leistung: ' + (state.paket || '-') + ' (ab ' + state.preis + ' €)\n'
      + faktorHinweis
      + '– Abholung: ' + val('abhol') + ' ' + (document.getElementById('wOrt').value || '') + '\n'
      + '– Wunschtermin: ' + datum + ', ' + val('halbtag') + '\n'
      + '– Name: ' + (document.getElementById('wName').value || '-')
      + (document.getElementById('wTel').value ? ' · Tel: ' + document.getElementById('wTel').value : '') + '\n'
      + (document.getElementById('wMsg').value ? '– Hinweise: ' + document.getElementById('wMsg').value : '');
  }
  function links() {
    const t = baueText();
    document.getElementById('wSend').href = 'https://wa.me/4915901606913?text=' + encodeURIComponent(t);
    document.getElementById('wMail').href = 'mailto:info.rentus@web.de?subject=' + encodeURIComponent('Terminanfrage Glanzgarage') + '&body=' + encodeURIComponent(t);
  }
  ['wName','wTel','wMsg','wOrt','wDatum'].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('input', links); el.addEventListener('change', links);
  });
  // Paket-Knöpfe auf der Seite wählen im Wizard vor
  document.querySelectorAll('a[data-wpaket]').forEach(a => a.addEventListener('click', () => {
    const btn = wiz.querySelector('[data-paket="' + a.dataset.wpaket + '"]');
    if (btn) {
      wiz.querySelectorAll('[data-paket]').forEach(x => x.classList.remove('sel'));
      btn.classList.add('sel');
      state.paket = btn.dataset.paket;
      state.preis = btn.dataset.preis === '0' ? '60-80' : Math.round(+btn.dataset.preis * state.faktor);
    }
    show(1);
  }));
  prev.addEventListener('click', () => show(state.step - 1));
  next.addEventListener('click', () => show(state.step + 1));
  show(1);
  (function uebernimmAutoCheck() {
    let check = null;
    try { check = JSON.parse(localStorage.getItem('rentusAutoCheck') || 'null'); } catch(e) {}
    if (!check || !check.text) return;
    const typ = check.typ || '';
    const typBtn = typ ? wiz.querySelector('[data-typ="' + typ + '"]') : null;
    if (typBtn) selectTypButton(typBtn);
    const msg = document.getElementById('wMsg');
    const intro = '3D-Check übernommen:\n';
    if (!msg.value.includes('3D-Check übernommen')) {
      msg.value = (msg.value ? msg.value + '\n\n' : '') + intro + check.text;
    }
    // Fahrzeug/Name aus dem 3D-Check ins Namensfeld übernehmen (sonst "Name: -")
    const nameEl = document.getElementById('wName');
    if (check.fahrzeug && nameEl && !nameEl.value) nameEl.value = check.fahrzeug;
    links();
    if (location.hash === '#buchung') show(typBtn ? 2 : 4);
  })();
})();
