/* =====================================================
   VITAL-SNACK — script.js
   Interactions: navbar, mobile menu, scroll reveal,
   cookie banner, smooth anchor, active nav link.
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ─── NAVBAR SCROLL ───────────────────────────────
  const navbar = document.getElementById('navbar');

  const handleNavbarScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();


  // ─── MOBILE MENU ─────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  const toggleMenu = (open) => {
    const isOpen = open !== undefined ? open : mobileMenu.hidden;
    mobileMenu.hidden = !isOpen;
    hamburger.setAttribute('aria-expanded', String(isOpen));
  };

  hamburger.addEventListener('click', () => toggleMenu());

  // Close menu on mobile link click
  mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      toggleMenu(false);
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.hidden) {
      toggleMenu(false);
      hamburger.focus();
    }
  });


  // ─── SCROLL REVEAL ───────────────────────────────
  const reveals = document.querySelectorAll(
    '.prob-card, .vp-card, .segment-card, .step, .plan-card, ' +
    '.channel-item, .partner-card, .team-card, .legal-block, ' +
    '.problem-layout, .solution-header, .channels-layout, ' +
    '.section-tag, .section-title, .section-desc, .university-badge'
  );

  // Add reveal class to all candidate elements
  reveals.forEach(el => {
    // Don't double-add to elements already animated
    if (!el.classList.contains('animate-in')) {
      el.classList.add('reveal');
    }
  });

  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings for grid/flex containers
        const siblings = entry.target.parentElement
          ? [...entry.target.parentElement.children].filter(c => c.classList.contains('reveal'))
          : [];
        const idx = siblings.indexOf(entry.target);
        const delay = Math.min(idx * 80, 300);

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


  // ─── ACTIVE NAV LINK ─────────────────────────────
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.style.color = 'var(--lime)';
          } else {
            link.style.color = '';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(section => activeObserver.observe(section));


  // ─── SMOOTH SCROLL (fallback for older browsers) ─
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Set focus for accessibility
        const focusable = target.querySelector(
          'h1, h2, h3, [tabindex="-1"], button, a, input'
        );
        if (focusable) {
          focusable.setAttribute('tabindex', '-1');
          focusable.focus({ preventScroll: true });
        }
      }
    });
  });


  // ─── COOKIE BANNER ───────────────────────────────
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAccept = document.getElementById('cookieAccept');

  const COOKIE_KEY = 'vs_cookie_accepted';

  // Check if already accepted
  if (localStorage.getItem(COOKIE_KEY)) {
    cookieBanner.classList.add('hidden');
  }

  cookieAccept.addEventListener('click', () => {
    cookieBanner.classList.add('hidden');
    localStorage.setItem(COOKIE_KEY, '1');
  });


  // ─── HERO PARALLAX (subtle, desktop only) ────────
  if (window.matchMedia('(min-width: 768px)').matches) {
    const heroBg = document.querySelector('.hero-food-grid');
    if (heroBg) {
      window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
          heroBg.style.transform = `translateY(${scrolled * 0.12}px)`;
        }
      }, { passive: true });
    }
  }


  // ─── PLANS: highlight on hover ───────────────────
  document.querySelectorAll('.plan-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      document.querySelectorAll('.plan-card').forEach(c => {
        if (c !== card && !c.classList.contains('plan-featured')) {
          c.style.opacity = '0.7';
        }
      });
    });
    card.addEventListener('mouseleave', () => {
      document.querySelectorAll('.plan-card').forEach(c => {
        c.style.opacity = '';
      });
    });
  });


  // ─── YEAR AUTO-UPDATE in footer ──────────────────
  const yearEl = document.querySelector('.footer-bottom p');
  if (yearEl) {
    const currentYear = new Date().getFullYear();
    yearEl.textContent = yearEl.textContent.replace(/\d{4}/, currentYear);
  }

});
