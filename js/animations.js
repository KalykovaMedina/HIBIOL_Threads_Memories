/* ============================================================
   HIBIOL — анимации Hero + Этап 3
   ============================================================ */
(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------
     Hero: Лепестки
     ------------------------------------------------------------ */
  function spawnPetals(container, count) {
    if (!container || prefersReduced) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const petal = document.createElement('span');
      petal.className = 'petal';
      petal.style.setProperty('--x',        `${Math.random() * 100}%`);
      petal.style.setProperty('--delay',    `${Math.random() * 14}s`);
      petal.style.setProperty('--duration', `${10 + Math.random() * 12}s`);
      petal.style.setProperty('--size',     `${8 + Math.random() * 10}px`);
      petal.style.setProperty('--drift',    `${-60 + Math.random() * 120}px`);
      petal.style.setProperty('--rotate',   `${Math.random() * 360}deg`);
      frag.appendChild(petal);
    }
    container.appendChild(frag);
  }

  /* ------------------------------------------------------------
     Hero: Каскадное появление
     ------------------------------------------------------------ */
  function revealHero() {
    const hero = document.getElementById('home');
    if (!hero) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        hero.classList.add('is-revealed');
      });
    });
  }

  /* ------------------------------------------------------------
     Hero: Параллакс и fade-out
     ------------------------------------------------------------ */
  function initHeroParallax() {
    const hero = document.getElementById('home');
    if (!hero || prefersReduced) return;

    const layers   = hero.querySelectorAll('[data-parallax]');
    const fadeWrap = hero.querySelector('.hero-fade');
    const scrollHint = document.getElementById('heroScroll');

    let ticking = false;
    let heroHeight = hero.offsetHeight;

    function onResize() {
      heroHeight = hero.offsetHeight;
      requestTick();
    }

    function update() {
      ticking = false;
      const scrollY = window.scrollY;
      if (scrollY > heroHeight + 50) return;

      layers.forEach((layer) => {
        const speed = parseFloat(layer.dataset.parallax) || 0;
        const offset = scrollY * speed;
        layer.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
      });

      const fadeStart = heroHeight * 0.15;
      const fadeEnd   = heroHeight * 0.85;
      const p = Math.max(0, Math.min(1, (scrollY - fadeStart) / (fadeEnd - fadeStart)));

      if (fadeWrap) {
        fadeWrap.style.opacity   = String(1 - p);
        fadeWrap.style.transform = `translate3d(0, ${(p * 60).toFixed(1)}px, 0)`;
      }

      if (scrollHint) {
        const hintOut = Math.min(1, scrollY / (heroHeight * 0.3));
        scrollHint.style.opacity = String(1 - hintOut);
      }
    }

    function requestTick() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', onResize,   { passive: true });
    update();
  }

  /* ------------------------------------------------------------
     Этап 3: Появление секций при скролле (IntersectionObserver)
     ------------------------------------------------------------ */
  function initScrollReveal() {
    if (prefersReduced) return; // Если анимации отключены, просто оставляем всё видимым

    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Анимируем только один раз
        }
      });
    }, {
      threshold: 0.15, // Срабатывает, когда видно 15% элемента
      rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach((el) => observer.observe(el));
  }

  /* ------------------------------------------------------------
     Этап 3: Интерактивное полотно Hibiol
     ------------------------------------------------------------ */
  function initHibiol() {
    const canvas = document.getElementById('hibiolCanvas');
    const tooltip = document.getElementById('hibiolTooltip');
    const tooltipText = tooltip?.querySelector('.hibiol-tooltip__text');
    const threads = document.querySelectorAll('.hibiol-thread');

    if (!canvas || !tooltip || !threads.length) return;

    // --- Наведение мышью (десктоп) ---
    threads.forEach((thread) => {
      thread.addEventListener('mouseenter', (e) => {
        if (prefersReduced) return;
        
        tooltipText.textContent = thread.dataset.thought;
        
        // Позиционируем подсказку
        const rect = thread.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        
        // Берем центр bounding box нити
        const x = rect.left - canvasRect.left + rect.width / 2;
        const y = rect.top - canvasRect.top + rect.height / 2;

        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
        
        tooltip.classList.add('is-visible');
        thread.classList.add('is-active');
      });

      thread.addEventListener('mouseleave', () => {
        tooltip.classList.remove('is-visible');
        thread.classList.remove('is-active');
      });
    });

    // --- Тапы (мобильные устройства) ---
    threads.forEach((thread) => {
      thread.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Если уже активно — скрываем
        if (thread.classList.contains('is-active')) {
          tooltip.classList.remove('is-visible');
          thread.classList.remove('is-active');
          return;
        }

        // Снимаем активность со всех
        threads.forEach(t => t.classList.remove('is-active'));
        tooltip.classList.remove('is-visible');

        // Включаем для текущего
        tooltipText.textContent = thread.dataset.thought;
        
        const rect = thread.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        
        // На мобильных берем координаты клика
        const x = e.clientX - canvasRect.left;
        const y = e.clientY - canvasRect.top;

        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
        
        tooltip.classList.add('is-visible');
        thread.classList.add('is-active');
      });
    });

    // Клик мимо нитей скрывает подсказку
    document.addEventListener('click', (e) => {
      if (!canvas.contains(e.target)) {
        tooltip.classList.remove('is-visible');
        threads.forEach(t => t.classList.remove('is-active'));
      }
    });
  }

  /* ------------------------------------------------------------
     Инициализация
     ------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', () => {
    spawnPetals(document.getElementById('heroPetals'), 22);
    revealHero();
    initHeroParallax();
    
    // Этап 3
    initScrollReveal();
    initHibiol();
  });
})();