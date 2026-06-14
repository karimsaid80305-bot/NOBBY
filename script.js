/* ============================================================
   NOBBY RESTAURANT · LOUNGE — script.js
   ============================================================ */

(function () {
  'use strict';

  /* ── Navbar: glass + hide/show on scroll direction ─────── */
  const nav        = document.getElementById('nav');
  const hamburger  = document.getElementById('hamburger');
  const drawer     = document.getElementById('mobile-drawer');
  const drawerLinks = drawer.querySelectorAll('a');
  const navLinks   = document.querySelectorAll('.nav-link');

  let lastY    = window.scrollY;
  let ticking  = false;

  function updateNav() {
    const y = window.scrollY;

    // glassmorphism after first 10px
    nav.classList.toggle('glass', y > 10);

    // hide on scroll down (past hero), show on scroll up
    if (y > lastY && y > 300) {
      nav.classList.add('hidden');
    } else {
      nav.classList.remove('hidden');
    }

    lastY   = y;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });

  // Fire once on load so glass appears if page was reloaded mid-scroll
  updateNav();


  /* ── Active nav link via IntersectionObserver ──────────── */
  const sections = document.querySelectorAll('section[id]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => sectionObserver.observe(s));


  /* ── Mobile drawer ─────────────────────────────────────── */
  function openDrawer() {
    drawer.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    drawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });

  drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));

  // Close drawer on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
  });


  /* ── Scroll-reveal (fade-in on entry) ──────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ── Hero parallax ─────────────────────────────────────── */
  const heroImg     = document.querySelector('.hero-img');
  const heroSection = document.querySelector('.hero');

  if (heroImg && heroSection) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y <= heroSection.offsetHeight) {
        heroImg.style.transform = `translateY(${y * 0.28}px) scale(1.08)`;
      }
    }, { passive: true });
  }


  /* ── Smooth scroll for all #anchor links ───────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });


  /* ── Gallery lightbox (minimal) ─────────────────────────── */
  const galItems = document.querySelectorAll('.gal-item');

  // Create overlay elements
  const overlay = document.createElement('div');
  overlay.id = 'lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Fotoğraf görüntüleyici');
  overlay.style.cssText = [
    'position:fixed', 'inset:0', 'z-index:9000',
    'background:rgba(0,0,0,.93)', 'backdrop-filter:blur(12px)',
    'display:none', 'align-items:center', 'justify-content:center',
    'cursor:zoom-out', 'padding:24px',
  ].join(';');

  const lbImg = document.createElement('img');
  lbImg.style.cssText = [
    'max-width:92vw', 'max-height:90vh',
    'object-fit:contain', 'border-radius:10px',
    'pointer-events:none',
  ].join(';');

  const lbClose = document.createElement('button');
  lbClose.innerHTML = '&#x2715;';
  lbClose.setAttribute('aria-label', 'Kapat');
  lbClose.style.cssText = [
    'position:absolute', 'top:20px', 'right:24px',
    'background:none', 'border:none', 'color:#fff',
    'font-size:2rem', 'cursor:pointer', 'opacity:.7',
    'transition:opacity .2s', 'line-height:1',
  ].join(';');
  lbClose.addEventListener('mouseover', () => lbClose.style.opacity = '1');
  lbClose.addEventListener('mouseout',  () => lbClose.style.opacity = '.7');

  overlay.appendChild(lbImg);
  overlay.appendChild(lbClose);
  document.body.appendChild(overlay);

  function openLightbox(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt;
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    overlay.style.display = 'none';
    lbImg.src = '';
    document.body.style.overflow = '';
  }

  galItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) openLightbox(img.src, img.alt);
    });
    item.style.cursor = 'zoom-in';
  });

  overlay.addEventListener('click', e => {
    if (e.target === overlay || e.target === lbClose) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.style.display !== 'none') closeLightbox();
  });

})();
