/* =========================================================
   RETRO POSHAK — Theme (Light / Dark) + Cursor glow + Ripples
   ========================================================= */

(function () {
  const KEY = 'retroPoshakTheme';

  function getStored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function store(theme) {
    try { localStorage.setItem(KEY, theme); } catch (e) {}
  }
  function systemPref() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark' : 'light';
  }
  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    store(theme);
    document.dispatchEvent(new CustomEvent('theme:changed', { detail: { theme } }));
  }

  // Initial apply (before paint if script is loaded early — this is at bottom of body,
  // so we also set it inline in <head> via a tiny inline script for zero-flash)
  const initial = getStored() || systemPref();
  apply(initial);

  // Expose
  window.RetroTheme = {
    get: () => document.documentElement.getAttribute('data-theme') || 'light',
    set: apply,
    toggle: () => apply(window.RetroTheme.get() === 'dark' ? 'light' : 'dark')
  };

  // React to system change if user hasn't chosen
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!getStored()) apply(e.matches ? 'dark' : 'light');
    });
  }

  /* ---------- Cursor glow (desktop only) ---------- */
  if (window.matchMedia('(hover: hover)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
    let tx = 0, ty = 0, cx = 0, cy = 0;
    document.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
    (function loop() {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      glow.style.transform = `translate(${cx - 170}px, ${cy - 170}px)`;
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Magnetic buttons ---------- */
  if (window.matchMedia('(hover: hover)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.addEventListener('mousemove', (e) => {
      const btn = e.target.closest('.btn.magnetic, .btn-primary, .btn-outline');
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      const mx = e.clientX - r.left - r.width / 2;
      const my = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${mx * 0.08}px, ${my * 0.12}px)`;
    });
    document.addEventListener('mouseleave', () => {}, true);
    document.addEventListener('mouseout', (e) => {
      const btn = e.target.closest('.btn');
      if (btn && !btn.contains(e.relatedTarget)) btn.style.transform = '';
    });
  }

  /* ---------- Ripple on click ---------- */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const size = Math.max(r.width, r.height);
    const span = document.createElement('span');
    span.className = 'ripple';
    span.style.width = span.style.height = size + 'px';
    span.style.left = (e.clientX - r.left - size / 2) + 'px';
    span.style.top = (e.clientY - r.top - size / 2) + 'px';
    btn.appendChild(span);
    setTimeout(() => span.remove(), 620);
  });

  /* ---------- Smooth page transitions on internal links ---------- */
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href) return;
      if (a.target === '_blank' || href.startsWith('#') || href.startsWith('http')) return;
      if (href.startsWith('mailto:') || href.startsWith('tel:')) return;
      // Allow default nav (lightweight fade handled by body animation on load)
    });
  }
})();