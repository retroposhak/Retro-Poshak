/* =========================================================
   RETRO POSHAK — Shared UI (header, search, cards, reveal, auth)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById('header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Hamburger / mobile nav ---------- */
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('mainNav');
  if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
      const open = mainNav.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });
    mainNav.querySelectorAll('.nav-link').forEach(a => {
      a.addEventListener('click', () => {
        mainNav.classList.remove('open');
        hamburger.classList.remove('open');
      });
    });
  }

  /* ---------- Theme toggle buttons ---------- */
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => window.RetroTheme?.toggle());
  });

  /* ---------- Search overlay ---------- */
  const searchOverlay = document.getElementById('searchOverlay');
  const searchToggle = document.getElementById('searchToggle');
  const searchClose = document.getElementById('searchClose');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  function openSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.add('open');
    setTimeout(() => searchInput && searchInput.focus(), 250);
  }
  function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove('open');
  }
  if (searchToggle) searchToggle.addEventListener('click', openSearch);
  if (searchClose) searchClose.addEventListener('click', closeSearch);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSearch();
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
  });

  if (searchInput && searchResults) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim();
      if (!q) { searchResults.innerHTML = ''; return; }
      const results = searchProducts(q);
      if (!results.length) {
        searchResults.innerHTML = `<p style="color:var(--brown-soft);font-family:'Playfair Display',serif;">No memories found for "${q}".</p>`;
        return;
      }
      searchResults.innerHTML = results.map(p => `
        <a href="product.html?id=${p.id}" class="search-item">
          <img src="${p.image}" alt="${p.name}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2264%22 height=%2280%22><rect width=%2264%22 height=%2280%22 fill=%22%23e8e0d5%22/></svg>'">
          <div>
            <h4>${p.name}</h4>
            <p>₹${p.price.toLocaleString('en-IN')}</p>
          </div>
        </a>
      `).join('');
    });
  }

  /* ---------- Newsletter ---------- */
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', e => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      if (input && input.value) {
        window.RetroCart?.showToast('Subscribed. Welcome to the memory club.');
        input.value = '';
      }
    });
  }

  /* ---------- Contact form (frontend only) ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const msg = document.getElementById('contactMsg');
      if (msg) {
        msg.textContent = "Thank you — we'll get back to you soon.";
        msg.className = 'form-msg success';
      }
      contactForm.reset();
    });
  }

  /* ---------- Scroll reveal ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  /* ---------- Featured products (home) ---------- */
  const featuredGrid = document.getElementById('featuredGrid');
  if (featuredGrid) {
    const limit = Number(featuredGrid.dataset.limit) || 4;
    const items = getFeaturedProducts(limit);
    featuredGrid.innerHTML = items.map((p, i) => renderProductCard(p, i)).join('');
    bindProductCardEvents(featuredGrid);
  }

  /* ---------- Memory Archive (home) ---------- */
  const memoryGrid = document.getElementById('memoryGrid');
  if (memoryGrid) {
    memoryGrid.innerHTML = MEMORY_ARCHIVE.map(m => `
      <a href="${m.link}" class="memory-card" aria-label="${m.title}: ${m.story}">
        <span class="memory-emoji" aria-hidden="true">${m.icon}</span>
        <h3>${m.title}</h3>
        <p class="memory-story">${m.story}</p>
        <span class="memory-link">See the Story →</span>
      </a>
    `).join('');
  }

  /* ---------- Auth header UI ---------- */
  renderAuthHeader();
  document.addEventListener('auth:changed', renderAuthHeader);

  /* ---------- Footer year (dynamic) ---------- */
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
});

/* =========================================================
   AUTH HEADER RENDER
   ========================================================= */
function renderAuthHeader() {
  const slot = document.getElementById('authSlot');
  if (!slot) return;
  const user = window.RetroAuth?.currentUser();

  if (!user) {
    slot.innerHTML = `
      <a href="login.html" class="icon-btn hide-mobile" aria-label="Sign in" title="Sign in">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2"/></svg>
      </a>
    `;
    return;
  }
  const initials = user.name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
  slot.innerHTML = `
    <div class="user-menu" id="userMenu">
      <button class="user-pill" id="userPill" aria-haspopup="true" aria-expanded="false">
        <span class="avatar">${initials}</span>
        <span class="hide-mobile">Hi, ${user.name.split(' ')[0]}</span>
      </button>
      <div class="user-dropdown" role="menu">
        <a href="account.html" role="menuitem">My Account</a>
        <a href="cart.html" role="menuitem">My Cart</a>
        <hr />
        <button type="button" id="logoutBtn" role="menuitem">Sign Out</button>
      </div>
    </div>
  `;
  const menu = document.getElementById('userMenu');
  const pill = document.getElementById('userPill');
  pill?.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = menu.classList.toggle('open');
    pill.setAttribute('aria-expanded', open);
  });
  document.addEventListener('click', () => menu?.classList.remove('open'));
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    window.RetroAuth.logout();
    window.RetroCart?.showToast('Signed out. See you soon.');
    setTimeout(() => window.location.href = 'index.html', 500);
  });
}

/* =========================================================
   PRODUCT CARD RENDERER
   ========================================================= */
function renderProductCard(p, index = 0) {
  const wishlisted = window.RetroCart ? window.RetroCart.isWishlisted(p.id) : false;
  const badgeHTML = p.badge === 'new'
    ? `<span class="badge-tag new">New</span>`
    : p.badge === 'bestseller'
    ? `<span class="badge-tag best">Bestseller</span>`
    : '';
  const colorDots = p.colors.map(c =>
    `<span class="color-dot" style="background:${p.colorHex[c] || '#ccc'}" title="${c}"></span>`
  ).join('');
  const priceHTML = p.compareAt
    ? `<span class="product-price">₹${p.price.toLocaleString('en-IN')} <s style="opacity:.45;font-weight:400;font-size:12px;">₹${p.compareAt.toLocaleString('en-IN')}</s></span>`
    : `<span class="product-price">₹${p.price.toLocaleString('en-IN')}</span>`;

  return `
    <article class="product-card" style="animation-delay:${index * 0.06}s" data-id="${p.id}">
      <div class="product-media">
        <a href="product.html?id=${p.id}" aria-label="View ${p.name}">
          <img class="img-primary" src="${p.image}" alt="${p.name} — Retro Poshak" loading="lazy"
               onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22500%22><rect width=%22400%22 height=%22500%22 fill=%22%23e8e0d5%22/><text x=%22200%22 y=%22250%22 font-family=%22Georgia%22 font-size=%2222%22 fill=%22%238b6f4c%22 text-anchor=%22middle%22>${p.name}</text></svg>'">
          <img class="img-secondary" src="${p.image2 || p.image}" alt="${p.name} alternate view" loading="lazy"
               onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22500%22><rect width=%22400%22 height=%22500%22 fill=%22%23d9cdb8%22/><text x=%22200%22 y=%22250%22 font-family=%22Georgia%22 font-size=%2222%22 fill=%22%238b6f4c%22 text-anchor=%22middle%22>${p.name} alt</text></svg>'">
        </a>
        <div class="product-badges">${badgeHTML}</div>
        <button class="wishlist-btn ${wishlisted ? 'active' : ''}" data-id="${p.id}" aria-label="Add ${p.name} to wishlist" aria-pressed="${wishlisted}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
        </button>
        <button class="quick-view" data-id="${p.id}">Quick View</button>
      </div>
      <div class="product-info">
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.description}</p>
        <div class="product-meta">
          ${priceHTML}
          <span class="color-dots">${colorDots}</span>
        </div>
        <button class="add-cart-btn" data-id="${p.id}">Add to Memories</button>
      </div>
    </article>
  `;
}

/* =========================================================
   BIND CARD EVENTS
   ========================================================= */
function bindProductCardEvents(scope) {
  scope.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = Number(btn.dataset.id);
      const nowActive = window.RetroCart.toggleWishlist(id);
      btn.classList.toggle('active', nowActive);
      btn.setAttribute('aria-pressed', nowActive);
      btn.classList.remove('pop');
      void btn.offsetWidth;
      btn.classList.add('pop');
    });
  });

  scope.querySelectorAll('.add-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = Number(btn.dataset.id);
      const p = getProductById(id);
      if (!p) return;
      if (!p.inStock) { window.RetroCart.showToast('This memory is sold out.'); return; }
      window.RetroCart.addToCart(id, p.sizes[0], p.colors[0], 1);
    });
  });

  scope.querySelectorAll('.quick-view').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = `product.html?id=${btn.dataset.id}`;
    });
  });

  scope.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      window.location.href = `product.html?id=${card.dataset.id}`;
    });
  });
}