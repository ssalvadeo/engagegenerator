/**
 * LEADGENERATOR — main.js
 * Vanilla JavaScript para:
 *  1. Scroll Reveal con IntersectionObserver
 *  2. Navbar "scrolled" state
 *  3. Menú mobile (burger)
 *  4. Año dinámico en el footer
 *  5. Active nav link según sección visible
 */

/* ============================================================
   1. SCROLL REVEAL — IntersectionObserver
   ============================================================ */
(function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Una vez visible, dejar de observar
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,      // 12% del elemento visible para activar
      rootMargin: '0px 0px -48px 0px', // adelantar la activación levemente
    }
  );

  revealElements.forEach((el) => observer.observe(el));
})();

/* ============================================================
   2. NAVBAR — estado "scrolled"
   ============================================================ */
(function initNavScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const SCROLL_THRESHOLD = 40;

  const updateHeader = () => {
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader(); // estado inicial
})();

/* ============================================================
   3. MENÚ MOBILE — burger toggle
   ============================================================ */
(function initMobileMenu() {
  const burgerBtn  = document.getElementById('nav-burger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.nav__mobile-link');

  if (!burgerBtn || !mobileMenu) return;

  const openMenu = () => {
    burgerBtn.classList.add('is-open');
    burgerBtn.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    burgerBtn.classList.remove('is-open');
    burgerBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  burgerBtn.addEventListener('click', () => {
    const isOpen = burgerBtn.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });

  // Cerrar al hacer click en un link
  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && burgerBtn.classList.contains('is-open')) {
      closeMenu();
      burgerBtn.focus();
    }
  });

  // Cerrar si se agranda la ventana por encima del breakpoint tablet
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && burgerBtn.classList.contains('is-open')) {
      closeMenu();
    }
  }, { passive: true });
})();

/* ============================================================
   4. AÑO DINÁMICO EN EL FOOTER
   ============================================================ */
(function initFooterYear() {
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();

/* ============================================================
   5. ACTIVE NAV LINK — IntersectionObserver en secciones
   ============================================================ */
(function initActiveNav() {
  const navLinks = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('main > section[id]');

  if (!navLinks.length || !sections.length) return;

  const sectionMap = new Map();
  sections.forEach((section) => {
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav__link[href="#${id}"]`);
    if (link) sectionMap.set(id, link);
  });

  const setActive = (id) => {
    navLinks.forEach((l) => l.removeAttribute('aria-current'));
    const active = sectionMap.get(id);
    if (active) active.setAttribute('aria-current', 'true');
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    {
      rootMargin: '-30% 0px -60% 0px', // activa cuando la sección ocupa el 30%-40% central del viewport
      threshold: 0,
    }
  );

  sections.forEach((section) => observer.observe(section));
})();

/* ============================================================
   6. MÉTRICAS — animación de contador al entrar al viewport
   ============================================================ */
(function initCounterAnimation() {
  const metricValues = document.querySelectorAll('.metric__value');
  if (!metricValues.length) return;

  // Extraer el valor numérico y el prefijo/sufijo del texto
  const parseMetric = (text) => {
    const raw = text.trim();
    const match = raw.match(/^([−\-]?)(\d+(?:\.\d+)?)([×xhmins%]*)?$/i);
    if (!match) return null;
    return {
      prefix: match[1] || '',
      number: parseFloat(match[2]),
      suffix: match[3] || '',
      raw,
    };
  };

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el, parsed) => {
    const duration = 1800;
    const start    = performance.now();

    const tick = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOut(progress);
      const current  = Math.round(eased * parsed.number);
      el.textContent = `${parsed.prefix}${current}${parsed.suffix}`;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = parsed.raw; // restaurar texto original
      }
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const parsed = parseMetric(el.textContent);
          if (parsed) animateCounter(el, parsed);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  metricValues.forEach((el) => observer.observe(el));
})();

/* ============================================================
   7. THEME SWITCHER LOGIC
   ============================================================ */
(function initThemeSwitcher() {
  const themes = [
    { id: 'default', name: 'Original', desc: 'Diseño editorial LeadGenerator', color: '#E8501A' },
    { id: 'neobrutalist', name: 'Neobrutalista', desc: 'Crudo, audaz, bordes gruesos', color: '#ffde03' },
    { id: 'swiss', name: 'Suizo', desc: 'Cuadrículas, tipografía limpia', color: '#e31e24' },
    { id: 'editorial', name: 'Editorial', desc: 'Revista, Serif elegante', color: '#1a1a1a' },
    { id: 'glassmorphism', name: 'Glassmorphism', desc: 'Capas translúcidas, blur', color: '#3b82f6' },
    { id: 'retro', name: 'Retro-futurista', desc: 'Synthwave, neones', color: '#ff00ff' },
    { id: 'bauhaus', name: 'Bauhaus', desc: 'Geometría, colores primarios', color: '#ed1c24' },
    { id: 'artdeco', name: 'Art Deco', desc: 'Dorado, lujo vintage', color: '#d4af37' },
    { id: 'minimalist', name: 'Minimalista', desc: 'Espacio en blanco, esencial', color: '#000000' },
    { id: 'flat', name: 'Flat', desc: 'Sin sombras, colores sólidos', color: '#10b981' },
    { id: 'material', name: 'Material', desc: 'Elevación, sombras suaves', color: '#2196f3' },
    { id: 'neumorphic', name: 'Neumórfico', desc: 'Sombras duales, extruido', color: '#e0e0e0' },
    { id: 'monochrome', name: 'Monocromático', desc: 'Matices de un solo color', color: '#1e3a8a' },
    { id: 'scandinavian', name: 'Escandinavo', desc: 'Madera, blanco, funcional', color: '#e5dace' },
    { id: 'japandi', name: 'Japandi', desc: 'Minimalismo zen, orgánico', color: '#d7ccc8' },
    { id: 'dark', name: 'Dark Mode First', desc: 'Alto contraste oscuro', color: '#0f172a' },
    { id: 'modernist', name: 'Modernista', desc: 'Funcionalidad pura', color: '#000000' },
    { id: 'organic', name: 'Orgánico/Fluido', desc: 'Formas curvas, blobs', color: '#10b981' },
    { id: 'corporate', name: 'Profesional Corporativo', desc: 'Azul/Gris, confianza', color: '#1e3a8a' },
    { id: 'tech', name: 'Tech Forward', desc: 'Innovador, micro-animado', color: '#0ea5e9' },
    { id: 'luxury', name: 'Minimalismo de Lujo', desc: 'Espaciado premium', color: '#9c855a' },
    { id: 'neogeo', name: 'Neo-Geo', desc: 'Patrones matemáticos', color: '#000000' },
    { id: 'kinetic', name: 'Kinetic', desc: 'Dinamismo y movimiento', color: '#ef4444' },
    { id: 'mesh', name: 'Gradiente Moderno', desc: 'Mesh gradients vibrantes', color: '#7c3aed' },
    { id: 'typo', name: 'Tipografía Primero', desc: 'Texto como elemento gráfico', color: '#000000' },
    { id: 'metropolitan', name: 'Metropolitano', desc: 'Urbano, sofisticado', color: '#334155' }
  ];

  const switcher = document.getElementById('theme-switcher');
  const toggleBtn = document.getElementById('theme-toggle');
  const closeBtn = document.getElementById('theme-close');
  const grid = document.getElementById('theme-grid');
  const body = document.body;

  if (!switcher || !toggleBtn || !grid) return;

  // Toggle drawer
  toggleBtn.addEventListener('click', () => switcher.classList.toggle('is-open'));
  closeBtn.addEventListener('click', () => switcher.classList.remove('is-open'));

  // Render themes
  themes.forEach(theme => {
    const item = document.createElement('button');
    item.className = 'theme-item';
    item.innerHTML = `
      <div class="theme-item__preview" style="background: ${theme.color}"></div>
      <div class="theme-item__info">
        <h4>${theme.name}</h4>
        <p>${theme.desc}</p>
      </div>
    `;

    item.addEventListener('click', () => {
      // Remove all theme classes
      themes.forEach(t => body.classList.remove(`theme-${t.id}`));
      
      // Apply new theme
      if (theme.id !== 'default') {
        body.classList.add(`theme-${theme.id}`);
      }

      // Cerrar switcher
      switcher.classList.remove('is-open');

      // Scroll to top to see full effect (optional)
      // window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    grid.appendChild(item);
  });
})();
