/* =========================================================
   RETRO POSHAK — Cinematic Layer (JS)
   Scroll progress, word reveal, image reveals, magnetic
   buttons, cursor dot + ring, product tilt, parallax, hero
   particles, section-title reveal.

   Depends on: cinematic.css
   Load AFTER: theme.js, products.js, cart.js, main.js

   Safe to include on any page — every module self-detects
   whether its target elements exist and no-ops otherwise.
   ========================================================= */

(function () {
  'use strict';

  /* =========================================================
     0. ENVIRONMENT
     ========================================================= */
  const supports = {
    io: 'IntersectionObserver' in window,
    raf: typeof requestAnimationFrame === 'function',
    ro: 'ResizeObserver' in window,
    mm: typeof window.matchMedia === 'function',
    pointerFine: window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ?? false,
  };

  let reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  const cleanups = [];
  const onCleanup = (fn) => cleanups.push(fn);

  /* Small rAF-batched scheduler */
  const rafQueue = new Set();
  let rafPending = false;
  function schedule(fn) {
    rafQueue.add(fn);
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      const queue = [...rafQueue];
      rafQueue.clear();
      queue.forEach((f) => {
        try { f(); } catch (err) { console.warn('[cinematic]', err); }
      });
    });
  }

  /* Guard: wrap each module so one failure doesn't break others */
  function safe(name, fn) {
    try { fn(); }
    catch (err) { console.warn(`[cinematic:${name}]`, err); }
  }

  /* =========================================================
     1. SCROLL PROGRESS BAR
     ========================================================= */
  safe('progress', () => {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    let cachedH = 0;
    const measure = () => {
      cachedH = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
    };

    const update = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      const pct = cachedH > 0 ? Math.min(100, (y / cachedH) * 100) : 0;
      bar.style.width = pct.toFixed(2) + '%';
    };

    const onScroll = () => schedule(update);
    const onResize = () => schedule(() => { measure(); update(); });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    if (supports.ro) {
      const ro = new ResizeObserver(onResize);
      ro.observe(document.body);
      onCleanup(() => ro.disconnect());
    }

    measure();
    update();

    onCleanup(() => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      bar.remove();
    });
  });

  /* =========================================================
     2. WORD REVEAL
     Splits text nodes only (never breaks <em>, <br>, <a>)
     into per-word spans with a --i index for staggered delay.

     Opt-in selectors: elements with [data-reveal-words] OR
     the built-in safe list.
     ========================================================= */
  safe('wordReveal', () => {
    const AUTO_SELECTORS = [
      '[data-reveal-words]',
      '.statement-hindi',
      '.statement-en',
      '.hero-sub',
      '.featured-hindi',
    ];

    const targets = new Set();
    AUTO_SELECTORS.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => targets.add(el));
    });

    const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE']);

    function splitElement(root) {
      // Walk only text nodes to avoid breaking markup
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          if (node.parentNode && SKIP_TAGS.has(node.parentNode.nodeName)) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      });

      const textNodes = [];
      let n;
      while ((n = walker.nextNode())) textNodes.push(n);

      let index = 0;
      textNodes.forEach(node => {
        const text = node.nodeValue;
        const frag = document.createDocumentFragment();
        const parts = text.split(/(\s+)/);
        parts.forEach(part => {
          if (part === '') return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
          } else {
            const span = document.createElement('span');
            span.textContent = part;
            span.style.setProperty('--i', index++);
            frag.appendChild(span);
          }
        });
        node.parentNode.replaceChild(frag, node);
      });

      if (index > 0) root.classList.add('reveal-words');
    }

    targets.forEach(el => {
      if (el.dataset.split === 'true') return;
      if (el.closest('[data-no-split]')) return;
      splitElement(el);
      el.dataset.split = 'true';
    });
  });

  /* =========================================================
     3. INTERSECTION OBSERVERS — reveals
     ========================================================= */
  safe('reveals', () => {
    if (!supports.io) {
      // Fallback: reveal everything immediately
      document.querySelectorAll(
        '.reveal, .reveal-words, .reveal-img, .reveal-curtain, .section-title, .statement-hindi, .statement-en, .story-card, .memory-card, .lookbook-item, .community-post'
      ).forEach(el => el.classList.add('in'));
      return;
    }

    // Different thresholds per category — headlines vs cards
    const headlineObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          headlineObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -60px 0px' });

    const cardObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          cardObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

    const imageObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          imageObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    // Headlines
    document.querySelectorAll(
      '.reveal, .reveal-words, .section-title, .statement-hindi, .statement-en'
    ).forEach(el => {
      if (el.classList.contains('reveal-words')) {
        headlineObs.observe(el);
      } else {
        el.classList.add('reveal-words');
        headlineObs.observe(el);
      }
    });

    // Cards — staggered
    const cards = document.querySelectorAll(
      '.story-card, .memory-card, .lookbook-item, .community-post, .featured-split, .product-card'
    );
    cards.forEach((el, i) => {
      el.style.transitionDelay = ((i % 8) * 0.06) + 's';
      if (!el.classList.contains('reveal') && !el.classList.contains('reveal-words')) {
        el.classList.add('reveal');
      }
      cardObs.observe(el);
    });

    // Images — opt-in via [data-reveal-img] + auto for known image wrappers
    const imgTargets = new Set();
    document.querySelectorAll('[data-reveal-img]').forEach(el => imgTargets.add(el));
    document.querySelectorAll('.featured-image, .story-image, .lookbook-item').forEach(el => imgTargets.add(el));
    imgTargets.forEach(el => {
      el.classList.add('reveal-img');
      imageObs.observe(el);
    });

    onCleanup(() => {
      headlineObs.disconnect();
      cardObs.disconnect();
      imageObs.disconnect();
    });
  });

  /* =========================================================
     4. CURSOR — dot + ring (desktop, opt-in per element)
     ========================================================= */
  safe('cursor', () => {
    if (!supports.pointerFine || reduceMotion) return;

    const dot = document.createElement('div');
    dot.className = 'cursor-dot is-hidden';
    dot.setAttribute('aria-hidden', 'true');

    const ring = document.createElement('div');
    ring.className = 'cursor-ring is-hidden';
    ring.setAttribute('aria-hidden', 'true');

    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mx = -100, my = -100;   // mouse target
    let dx = mx, dy = my;       // dot position (fast)
    let rx = mx, ry = my;       // ring position (slow)
    let visible = false;
    let pressing = false;

    const setVisible = (v) => {
      if (visible === v) return;
      visible = v;
      dot.classList.toggle('is-hidden', !v);
      ring.classList.toggle('is-hidden', !v);
    };

    document.addEventListener('pointermove', (e) => {
      // Ignore non-mouse pointers
      if (e.pointerType && e.pointerType !== 'mouse') return;
      mx = e.clientX;
      my = e.clientY;
      setVisible(true);
    });

    document.addEventListener('pointerleave', () => setVisible(false));
    document.addEventListener('pointerenter', () => setVisible(true));

    document.addEventListener('pointerdown', () => {
      pressing = true;
      dot.classList.add('is-pressed');
      ring.classList.add('is-pressed');
    });
    document.addEventListener('pointerup', () => {
      pressing = false;
      dot.classList.remove('is-pressed');
      ring.classList.remove('is-pressed');
    });

    // Hover state — delegated
    const HOVER_SELECTOR = [
      'a', 'button', 'summary', '[role="button"]',
      '.product-card', '.story-card', '.memory-card',
      '.lookbook-item', '.trust-item', '.chip',
      '.size-chip', '.color-swatch', '.gallery-thumb',
      '.wishlist-btn', '.add-cart-btn', '.btn',
    ].join(',');
    const TEXT_SELECTOR = 'input, textarea, [contenteditable="true"]';

    document.addEventListener('pointerover', (e) => {
      const isText = e.target.matches?.(TEXT_SELECTOR);
      const isHover = !!e.target.closest?.(HOVER_SELECTOR);

      dot.classList.toggle('is-text', isText);
      ring.classList.toggle('is-text', isText);

      if (!isText) {
        dot.classList.toggle('is-hover', isHover);
        ring.classList.toggle('is-hover', isHover);
      } else {
        dot.classList.remove('is-hover');
        ring.classList.remove('is-hover');
      }
    });

    document.addEventListener('pointerout', (e) => {
      const isText = e.target.matches?.(TEXT_SELECTOR);
      const isHover = !!e.target.closest?.(HOVER_SELECTOR);
      if (!isText && !isHover) {
        dot.classList.remove('is-hover', 'is-text');
        ring.classList.remove('is-hover', 'is-text');
      }
    });

    // Animated loop
    let stopped = false;
    function loop() {
      if (stopped) return;
      dx += (mx - dx) * 0.42;
      dy += (my - dy) * 0.42;
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;

      dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    }
    if (supports.raf) loop();

    onCleanup(() => {
      stopped = true;
      dot.remove();
      ring.remove();
    });
  });

  /* =========================================================
     5. MAGNETIC BUTTONS
     Single delegated pointermove listener + rAF batching.
     ========================================================= */
  safe('magnetic', () => {
    if (!supports.pointerFine || reduceMotion) return;

    const TARGET = '.btn.magnetic, .btn-primary.magnetic, .btn-outline.magnetic, [data-magnetic]';
    // Auto-magnet the primary CTA buttons on hero + featured sections
    document.querySelectorAll('.hero-content .btn-primary, .featured .btn-primary, .section-cta .btn').forEach(el => {
      el.classList.add('magnetic');
    });

    // Track active button + its rect (cached per pointerenter, refreshed on scroll)
    let active = null;
    let rect = null;

    const refreshRect = () => {
      if (active) rect = active.getBoundingClientRect();
    };

    document.addEventListener('pointerover', (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      const btn = e.target.closest?.(TARGET);
      if (btn && btn !== active) {
        active = btn;
        refreshRect();
      }
    });

    document.addEventListener('pointerout', (e) => {
      if (!active) return;
      if (!e.relatedTarget || !active.contains(e.relatedTarget)) {
        active.style.setProperty('--mx', '0px');
        active.style.setProperty('--my', '0px');
        active = null;
        rect = null;
      }
    });

    document.addEventListener('pointermove', (e) => {
      if (!active || !rect) return;
      if (e.pointerType && e.pointerType !== 'mouse') return;
      const px = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const py = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      // Clamp so buttons don't fly off
      const cx = Math.max(-1, Math.min(1, px));
      const cy = Math.max(-1, Math.min(1, py));
      const tx = cx * 6;  // max 6px
      const ty = cy * 4;  // max 4px
      schedule(() => {
        active.style.setProperty('--mx', `${tx}px`);
        active.style.setProperty('--my', `${ty}px`);
      });
    });

    // Keep rect fresh on scroll/resize while hovering
    const onViewport = () => { if (active) schedule(refreshRect); };
    window.addEventListener('scroll', onViewport, { passive: true });
    window.addEventListener('resize', onViewport, { passive: true });

    onCleanup(() => {
      window.removeEventListener('scroll', onViewport);
      window.removeEventListener('resize', onViewport);
    });
  });

  /* =========================================================
     6. PRODUCT CARD 3D TILT
     Delegated pointermove + rAF batching.
     ========================================================= */
  safe('tilt', () => {
    if (!supports.pointerFine || reduceMotion) return;

    let active = null;
    let media = null;
    let rect = null;

    const refreshRect = () => {
      if (media) rect = media.getBoundingClientRect();
    };

    document.addEventListener('pointerover', (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      const card = e.target.closest?.('.product-card');
      if (!card) return;
      const m = card.querySelector('.product-media');
      if (!m) return;
      if (active !== card) {
        active = card;
        media = m;
        refreshRect();
      }
    });

    document.addEventListener('pointerout', (e) => {
      if (!active) return;
      if (!e.relatedTarget || !active.contains(e.relatedTarget)) {
        if (media) {
          media.style.setProperty('--rx', '0deg');
          media.style.setProperty('--ry', '0deg');
          media.style.setProperty('--scale', '1');
        }
        active = null;
        media = null;
        rect = null;
      }
    });

    document.addEventListener('pointermove', (e) => {
      if (!active || !media || !rect) return;
      if (e.pointerType && e.pointerType !== 'mouse') return;
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      const rx = (-py * 6).toFixed(2);
      const ry = (px * 6).toFixed(2);
      schedule(() => {
        media.style.setProperty('--rx', `${rx}deg`);
        media.style.setProperty('--ry', `${ry}deg`);
        media.style.setProperty('--scale', '1.02');
      });
    });

    const onViewport = () => { if (active) schedule(refreshRect); };
    window.addEventListener('scroll', onViewport, { passive: true });
    window.addEventListener('resize', onViewport, { passive: true });

    onCleanup(() => {
      window.removeEventListener('scroll', onViewport);
      window.removeEventListener('resize', onViewport);
    });
  });

  /* =========================================================
     7. PARALLAX
     Element-center based, rAF-batched, opt-in via
     [data-parallax] OR auto-detected .hero-image.
     ========================================================= */
  safe('parallax', () => {
    if (reduceMotion) return;
    if (window.matchMedia('(max-width: 768px)').matches) return;

    const els = new Set();
    document.querySelectorAll('[data-parallax]').forEach(el => els.add(el));
    document.querySelectorAll('.hero-image').forEach(el => els.add(el));
    if (!els.size) return;

    const update = () => {
      const vh = window.innerHeight;
      els.forEach(el => {
        const rect = el.getBoundingClientRect();
        // Only apply when element is roughly in the viewport
        if (rect.bottom < -vh || rect.top > vh * 2) return;
        const speed = parseFloat(el.dataset.parallax) || 0.06;
        const center = rect.top + rect.height / 2;
        const offset = (center - vh / 2) * speed;
        el.style.setProperty('--py', `${offset.toFixed(2)}px`);
      });
    };

    const onScroll = () => schedule(update);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();

    onCleanup(() => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    });
  });

  /* =========================================================
     8. HERO PARTICLES
     Generated with per-particle CSS vars, perf-scaled.
     ========================================================= */
  safe('particles', () => {
    if (reduceMotion) return;

    const wrap = document.querySelector('.hero-particles');
    if (!wrap) return;
    if (wrap.dataset.ready === 'true') return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const count = isMobile ? 0 : 18;
    if (!count) { wrap.style.display = 'none'; return; }

    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      const left = (Math.random() * 100).toFixed(2);
      const bottom = (Math.random() * 60).toFixed(2);
      const dur = (10 + Math.random() * 10).toFixed(2);
      const delay = (Math.random() * 8).toFixed(2);
      const size = (2 + Math.random() * 3).toFixed(2);
      p.style.left = `${left}%`;
      p.style.bottom = `${bottom}%`;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.setProperty('--dur', `${dur}s`);
      p.style.setProperty('--delay', `${delay}s`);
      frag.appendChild(p);
    }
    wrap.appendChild(frag);
    wrap.dataset.ready = 'true';
  });

  /* =========================================================
     9. SECTION TITLE LETTER-SPACING ON REVEAL
     ========================================================= */
  safe('sectionTitle', () => {
    if (reduceMotion || !supports.io) return;

    const titles = document.querySelectorAll('.section-title');
    if (!titles.length) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.style.transition = 'letter-spacing 1.2s var(--ease), color 0.6s var(--ease)';
        obs.unobserve(el);
      });
    }, { threshold: 0.3 });

    titles.forEach(el => obs.observe(el));
    onCleanup(() => obs.disconnect());
  });

  /* =========================================================
     10. UTILITIES — small things every page benefits from
     ========================================================= */

  /* Data-year filler (safe if main.js already handles it) */
  safe('dataYear', () => {
    const year = new Date().getFullYear();
    document.querySelectorAll('[data-year]').forEach(el => {
      if (!el.textContent || el.textContent.trim() !== String(year)) {
        el.textContent = year;
      }
    });
  });

  /* =========================================================
     11. REDUCED MOTION — live listener
     ========================================================= */
  if (supports.mm) {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => {
      const nowReduced = e.matches;
      if (nowReduced !== reduceMotion) {
        reduceMotion = nowReduced;
        // Remove cursor elements if user just enabled reduced motion
        if (nowReduced) {
          document.querySelectorAll('.cursor-dot, .cursor-ring').forEach(el => el.remove());
        }
      }
    };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange); // legacy
    onCleanup(() => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else if (mq.removeListener) mq.removeListener(onChange);
    });
  }

  /* =========================================================
     12. DESTROY HOOK — for SPA or hot reload
     ========================================================= */
  window._cinematicDestroy = function () {
    cleanups.forEach(fn => {
      try { fn(); } catch (err) { console.warn('[cinematic:destroy]', err); }
    });
    cleanups.length = 0;
  };

})();