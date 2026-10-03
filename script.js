
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active', open);
      menuToggle.setAttribute('aria-expanded', String(open));
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Smooth scrolling for portfolio section links.
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();
      const header = document.querySelector('header');
      const offset = (header ? header.offsetHeight : 0) + 15;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });
    });
  });

  // Header state while scrolling.
  const header = document.querySelector('header');
  const updateHeader = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 30);
  };

  // Scroll progress indicator.
  let progress = document.querySelector('.scroll-progress');
  if (!progress) {
    progress = document.createElement('div');
    progress.className = 'scroll-progress';
    Object.assign(progress.style, {
      position: 'fixed', top: '0', left: '0', width: '0%', height: '3px',
      zIndex: '9999', background: 'linear-gradient(90deg,#00a8e8,#00c389)',
      transition: 'width .08s linear'
    });
    document.body.appendChild(progress);
  }

  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0}%`;
  };

  // Highlight the current portfolio section.
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a[href^="#"]');
  const updateActiveNav = () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 160) current = section.id;
    });
    navItems.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };

  // Reveal cards as they enter the viewport.
  const revealItems = document.querySelectorAll(
    '.reveal, .skill-card, .project-card, .experience-card, .expertise-card, .value-card'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealItems.forEach((item, index) => {
      item.classList.add('reveal-on-scroll');
      item.style.setProperty('--reveal-delay', `${index * 60}ms`);
      observer.observe(item);
    });
  } else {
    revealItems.forEach(item => item.classList.add('visible'));
  }

  // Back-to-top button.
  const backToTop = document.createElement('button');
  backToTop.type = 'button';
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.textContent = '↑';
  Object.assign(backToTop.style, {
    position: 'fixed', right: '24px', bottom: '24px', width: '44px', height: '44px',
    border: '0', borderRadius: '50%', cursor: 'pointer', fontSize: '20px',
    fontWeight: '700', color: '#fff', background: '#087ea4',
    boxShadow: '0 8px 25px rgba(0,0,0,.18)', zIndex: '1000', opacity: '0',
    visibility: 'hidden', transform: 'translateY(10px)', transition: 'all .25s ease'
  });
  document.body.appendChild(backToTop);

  const updateBackToTop = () => {
    const show = window.scrollY > 500;
    backToTop.style.opacity = show ? '1' : '0';
    backToTop.style.visibility = show ? 'visible' : 'hidden';
    backToTop.style.transform = show ? 'translateY(0)' : 'translateY(10px)';
  };

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Optional copy-email interaction.
  document.querySelectorAll('[data-copy-email], .copy-email').forEach(button => {
    button.addEventListener('click', async () => {
      const email = button.dataset.copyEmail || 'anil2021ak@gmail.com';
      if (!navigator.clipboard) return;
      try {
        await navigator.clipboard.writeText(email);
        const old = button.textContent;
        button.textContent = 'Email Copied!';
        setTimeout(() => { button.textContent = old; }, 1800);
      } catch (error) {
        console.warn('Could not copy email:', error);
      }
    });
  });

  // Automatically update copyright year if the HTML uses data-current-year.
  document.querySelectorAll('[data-current-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // Optional project filtering using data-filter / data-category attributes.
  document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      document.querySelectorAll('[data-category]').forEach(card => {
        card.style.display = filter === 'all' || card.dataset.category === filter ? '' : 'none';
      });
    });
  });

  window.addEventListener('scroll', () => {
    updateHeader();
    updateProgress();
    updateActiveNav();
    updateBackToTop();
  }, { passive: true });

  updateHeader();
  updateProgress();
  updateActiveNav();
  updateBackToTop();

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navLinks && menuToggle) {
      navLinks.classList.remove('active');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
});
