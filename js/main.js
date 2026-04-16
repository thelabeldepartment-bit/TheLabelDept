/* ============================================================
   THE LABEL DEPT — Shared JS
   ============================================================ */

/* ── Scroll Reveal (.r .rl .rr → .on) ── */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.r, .rl, .rr').forEach(el => obs.observe(el));
}

/* ── 3D Tilt ── */
function initTilt() {
  document.querySelectorAll('.hc, .proc-card, .cta-glass-card, .vis-card, [data-tilt]').forEach(card => {
    card.addEventListener('mouseenter', () => { card.style.transition = 'none'; });
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 18;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * -14;
      card.style.transform = `rotateX(${y}deg) rotateY(${x}deg) translateZ(20px) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
      card.style.transform = '';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
}

/* ── Service Accordion ── */
function initAccordion() {
  document.querySelectorAll('.srv-item').forEach(item => {
    const header = item.querySelector('.srv-header-row');
    const body   = item.querySelector('.srv-body');
    if (!header || !body) return;
    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.srv-item.open').forEach(o => {
        o.classList.remove('open');
        o.querySelector('.srv-body').style.maxHeight = '0';
      });
      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
    body.style.overflow = 'hidden';
    body.style.maxHeight = '0';
    body.style.transition = 'max-height 0.5s cubic-bezier(0.4,0,0.2,1)';
  });
}

/* ── AI Neural Canvas ── */
function initNeuralCanvas(id) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [], raf;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    nodes = Array.from({ length: 42 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: 1.8 + Math.random() * 2.2
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d  = Math.hypot(dx, dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(71,58,49,${(1 - d / 120) * 0.45})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(71,58,49,0.65)';
      ctx.fill();
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });
    raf = requestAnimationFrame(draw);
  }

  resize(); draw();
  window.addEventListener('resize', () => { cancelAnimationFrame(raf); resize(); draw(); });
}

/* ── Marquee auto-duplicate ── */
function initMarquee() {
  document.querySelectorAll('.marquee-track').forEach(track => {
    const inner = track.innerHTML;
    track.innerHTML = inner + inner;
  });
}

/* ── Active nav link ── */
function initActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* ── Portfolio filter ── */
function initPortfolioFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  if (!btns.length) return;
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      /* query live so async-rendered cards are included */
      document.querySelectorAll('.portfolio-item').forEach(item => {
        const match = cat === 'all' || item.dataset.category === cat;
        item.style.opacity       = match ? '1' : '0.22';
        item.style.transform     = match ? '' : 'scale(0.96)';
        item.style.pointerEvents = match ? '' : 'none';
      });
    });
  });
}

/* ── Contact form ── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn  = form.querySelector('[type=submit]');
    const orig = btn.textContent;
    btn.textContent = '✓ Gesendet!';
    btn.disabled = true;
    btn.style.opacity = '0.7';
    setTimeout(() => { btn.textContent = orig; btn.disabled = false; btn.style.opacity = ''; form.reset(); }, 3200);
  });
}

/* ── CTA Cursor ── */
function initCtaCursor() {
  const cta    = document.getElementById('cta');
  const cursor = document.getElementById('cta-cursor');
  if (!cta || !cursor) return;

  let mx = 0, my = 0, cx = 0, cy = 0;

  cta.addEventListener('mousemove', e => {
    const r = cta.getBoundingClientRect();
    mx = e.clientX - r.left;
    my = e.clientY - r.top;
  });

  (function animate() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
    requestAnimationFrame(animate);
  })();
}

/* ── Mobile Nav ── */
function initMobileNav() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  const btn = document.createElement('button');
  btn.className = 'nav-hamburger';
  btn.setAttribute('aria-label', 'Menü');
  btn.innerHTML = '<span></span>';
  nav.appendChild(btn);

  const menu = document.createElement('div');
  menu.className = 'mobile-menu';
  menu.innerHTML = `
    <a href="index.html">Start</a>
    <a href="portfolio.html">Portfolio</a>
    <a href="services.html">Leistungen</a>
    <a href="about.html">Studio</a>
    <a href="contact.html">Kontakt</a>
    <a href="contact.html" class="mob-cta">Projekt starten</a>`;
  document.body.appendChild(menu);

  const path = window.location.pathname.split('/').pop() || 'index.html';
  menu.querySelectorAll('a:not(.mob-cta)').forEach(a => {
    if ((a.getAttribute('href') || '').split('/').pop() === path) a.classList.add('active');
  });

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initTilt();
  initAccordion();
  initNeuralCanvas('ai-canvas');
  initMarquee();
  initActiveNav();
  initPortfolioFilter();
  initContactForm();
  initCtaCursor();
  initMobileNav();
});
