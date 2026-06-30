/* ============================================================
   NABAA AL SAHRA TECHNICAL WORKS LLC — Main Script
   Vanilla JS — no dependencies
   ============================================================ */

'use strict';

/* ──────────────────────────────────────────────────────────── */
/*  DOM HELPERS                                                  */
/* ──────────────────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ──────────────────────────────────────────────────────────── */
/*  NAVBAR: scroll state + active link                          */
/* ──────────────────────────────────────────────────────────── */
function initNavbar() {
  const navbar = $('#navbar');
  if (!navbar) return;

  const scrollThreshold = 60;

  function updateNavbar() {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();
}

/* ──────────────────────────────────────────────────────────── */
/*  ACTIVE NAV LINK (scroll spy)                                */
/* ──────────────────────────────────────────────────────────── */
function initScrollSpy() {
  const navLinks = $$('.nav-link[data-section]');
  const sections = navLinks
    .map(link => document.getElementById(link.dataset.section))
    .filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      });
    },
    { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach(section => observer.observe(section));
}

/* ──────────────────────────────────────────────────────────── */
/*  MOBILE HAMBURGER                                             */
/* ──────────────────────────────────────────────────────────── */
function initMobileMenu() {
  const hamburger = $('#hamburger');
  const menu = $('#navMenu');
  if (!hamburger || !menu) return;

  function closeMenu() {
    hamburger.classList.remove('open');
    menu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    menu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on nav link click
  $$('.nav-link', menu).forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!e.target.closest('#navbar')) closeMenu();
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ──────────────────────────────────────────────────────────── */
/*  SMOOTH SCROLL (for browsers that don't respect CSS)         */
/* ──────────────────────────────────────────────────────────── */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();

      const navbarHeight = $('#navbar')?.offsetHeight ?? 72;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });
}

/* ──────────────────────────────────────────────────────────── */
/*  SCROLL REVEAL ANIMATION                                      */
/* ──────────────────────────────────────────────────────────── */
function initRevealAnimations() {
  const elements = $$('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* ──────────────────────────────────────────────────────────── */
/*  BACK TO TOP BUTTON                                           */
/* ──────────────────────────────────────────────────────────── */
function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ──────────────────────────────────────────────────────────── */
/*  FOOTER YEAR                                                  */
/* ──────────────────────────────────────────────────────────── */
function initYear() {
  const el = $('#year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ──────────────────────────────────────────────────────────── */
/*  GALLERY — fallback placeholder bg if image fails to load    */
/* ──────────────────────────────────────────────────────────── */
function initGalleryFallbacks() {
  $$('.gallery-item img').forEach(img => {
    img.addEventListener('error', () => {
      img.style.display = 'none';
      img.parentElement.style.background = 'linear-gradient(135deg, #0F2A44 0%, #163555 100%)';
    });
  });
}

/* ──────────────────────────────────────────────────────────── */
/*  IMAGE FALLBACKS                                              */
/* ──────────────────────────────────────────────────────────── */
function initImageFallbacks() {
  // Splash logo: show text if image fails
  const splashImg = $('#splashImg');
  const splashTxt = $('#splashTxt');
  if (splashImg && splashTxt) {
    splashImg.addEventListener('error', () => {
      splashImg.style.display = 'none';
      splashTxt.style.display = 'flex';
    });
  }

  // CEO image fallback
  const ceoImg = $('#ceoImg');
  const ceoWrap = $('#ceoImgWrap');
  if (ceoImg && ceoWrap) {
    ceoImg.addEventListener('error', () => {
      ceoImg.style.display = 'none';
      ceoWrap.innerHTML = `
        <div class="leadership__img-placeholder-inner">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>CEO Photo — Coming Soon</span>
        </div>`;
    });
  }

  // Generic fallbacks
  $$('img').forEach(img => {
    img.addEventListener('error', () => {
      if (img.classList.contains('hero__bg-img')) {
        img.style.display = 'none';
      } else if (img.classList.contains('about__img')) {
        img.style.background = 'linear-gradient(135deg, #1e4878 0%, #0F2A44 100%)';
        img.style.display = 'block';
      }
    });
  });
}

/* ──────────────────────────────────────────────────────────── */
/*  SPLASH SCREEN                                                */
/* ──────────────────────────────────────────────────────────── */
function initSplash() {
  const splash = document.getElementById('splash');
  if (!splash) return;

  document.body.style.overflow = 'hidden';

  // Duration: progress bar takes ~2.9s total (0.9s delay + 2s fill)
  const exitDelay = 3100;

  setTimeout(() => {
    splash.classList.add('exit');
    document.body.style.overflow = '';

    setTimeout(() => {
      splash.style.display = 'none';
      splash.removeAttribute('aria-hidden');
    }, 800);
  }, exitDelay);
}

/* ──────────────────────────────────────────────────────────── */
/*  PREMIUM CLICK RIPPLE                                         */
/* ──────────────────────────────────────────────────────────── */
function initClickRipple() {
  document.addEventListener('click', e => {
    const target = e.target.closest('.btn, .nav-link, .service-card, .why-card, .industry-card, .contact-row');
    if (!target) return;

    const ripple = document.createElement('span');
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.4;

    ripple.style.cssText = `
      position:absolute;
      width:${size}px;
      height:${size}px;
      top:${e.clientY - rect.top - size/2}px;
      left:${e.clientX - rect.left - size/2}px;
      background:rgba(212,175,55,0.18);
      border-radius:50%;
      pointer-events:none;
      transform:scale(0);
      animation:rippleOut 0.55s ease forwards;
    `;

    const prev = target.style.position;
    if (!prev || prev === 'static') target.style.position = 'relative';
    target.style.overflow = 'hidden';
    target.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
}

/* ──────────────────────────────────────────────────────────── */
/*  INIT                                                         */
/* ──────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initSplash();
  initClickRipple();
  initNavbar();
  initScrollSpy();
  initMobileMenu();
  initSmoothScroll();
  initRevealAnimations();
  initBackToTop();
  initYear();
  initGalleryFallbacks();
  initImageFallbacks();
});
