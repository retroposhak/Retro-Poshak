// ============================================
// PATH HELPER — detects if we're inside /pages/
// ============================================
function getBasePath() {
  const path = window.location.pathname;
  if (/\/pages\//i.test(path)) return '../';
  return '';
}

// ============================================
// COMPONENT LOADER — auto-resolves subfolder paths
// AND auto-rewrites relative links inside the loaded HTML
// ============================================
async function loadComponent(id, path) {
  const el = document.getElementById(id);
  if (!el) {
    console.error(`[loadComponent] Element #${id} not found.`);
    return false;
  }

  const base = getBasePath();
  const resolvedPath = path.startsWith('http') || path.startsWith('/')
    ? path
    : base + path;

  try {
    const response = await fetch(resolvedPath);
    if (!response.ok) {
      console.error(`[loadComponent] Failed to load ${resolvedPath} — HTTP ${response.status}`);
      return false;
    }
    let html = await response.text();

    // ✅ If we're inside /pages/, prepend "../" to every relative
    //    href and src inside the injected HTML so links work
    //    from the subfolder correctly.
    if (base) {
      html = html.replace(
        /\b(href|src)\s*=\s*"([^"]+)"/g,
        (match, attr, url) => {
          // Skip absolute URLs, anchors, mailto, tel, data, protocol-relative, and root-absolute
          if (/^(https?:|mailto:|tel:|data:|#|\/\/|\/)/i.test(url)) {
            return match;
          }
          return `${attr}="${base}${url}"`;
        }
      );
    }

    el.innerHTML = html;
    console.log(`[loadComponent] Loaded ${resolvedPath} into #${id}${base ? ` (paths prefixed with "${base}")` : ''}`);
    return true;
  } catch (error) {
    console.error(`[loadComponent] Error loading ${resolvedPath}:`, error);
    return false;
  }
}

// ============================================
// HERO CAROUSEL
// ============================================
function initHeroCarousel() {
  const slides = document.querySelectorAll(".hero-slide");
  const indicators = document.querySelectorAll(".indicator");
  const progressBar = document.getElementById("heroProgressBar");
  const labelEl = document.getElementById("heroSlideLabel");
  const numEl = document.getElementById("heroSlideNum");
  if (slides.length === 0) return;

  const slidesData = Array.from(slides).map((slide, i) => {
    const img = slide.querySelector("img");
    return {
      label: img?.alt || `Slide ${i + 1}`,
      num: String(i + 1).padStart(2, "0") + " / " + String(slides.length).padStart(2, "0")
    };
  });

  let currentSlide = 0;
  const slideInterval = 4000;

  function goToSlide(index) {
    slides.forEach(s => s.classList.remove("active"));
    indicators.forEach(d => d.classList.remove("active"));
    slides[index].classList.add("active");
    if (indicators[index]) indicators[index].classList.add("active");
    currentSlide = index;
    if (labelEl) labelEl.textContent = slidesData[index].label;
    if (numEl) numEl.textContent = slidesData[index].num;
    if (progressBar) {
      progressBar.style.animation = "none";
      void progressBar.offsetWidth;
      progressBar.style.animation = "progressFill 4s linear infinite";
    }
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
  }

  goToSlide(0);
  let autoPlayTimer = setInterval(nextSlide, slideInterval);

  indicators.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      clearInterval(autoPlayTimer);
      goToSlide(i);
      autoPlayTimer = setInterval(nextSlide, slideInterval);
    });
  });
}

// ============================================
// MOBILE MENU — with double-init guard
// ============================================
function initMobileMenu() {
  const toggle = document.querySelector(".mobile-toggle");
  const menu = document.querySelector(".mobile-menu");
  const overlay = document.querySelector(".mobile-overlay");
  const closeBtn = document.querySelector(".mobile-menu-close");
  if (!toggle || !menu || !overlay) {
    console.warn('[initMobileMenu] Missing elements:',
      { toggle: !!toggle, menu: !!menu, overlay: !!overlay });
    return;
  }

  // Prevent double-wiring
  if (toggle.dataset.mobileMenuWired === "1") {
    console.log('[initMobileMenu] Already wired, skipping.');
    return;
  }
  toggle.dataset.mobileMenuWired = "1";

  function openMenu() {
    toggle.classList.add("active");
    menu.classList.add("open");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    toggle.classList.remove("active");
    menu.classList.remove("open");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  toggle.addEventListener("click", () => {
    menu.classList.contains("open") ? closeMenu() : openMenu();
  });
  closeBtn?.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);
  menu.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });

  console.log('[initMobileMenu] Wired up successfully.');
}

// ============================================
// SEARCH — context-aware redirect
// ============================================
function initSearch() {
  const inputs = [
    document.querySelector(".nav-search-input"),
    document.querySelector(".mobile-search-input"),
  ].filter(Boolean);
  const submits = [
    document.querySelector(".search-submit"),
    document.querySelector(".mobile-search-submit"),
  ].filter(Boolean);
  if (inputs.length === 0) return;

  function performSearch(query) {
    if (!query || !query.trim()) return;
    // ✅ Use base path so it works from /pages/ too
    const base = getBasePath();
    window.location.href = `${base}shop.html?search=${encodeURIComponent(query.trim())}`;
  }
  inputs.forEach(input => {
    input.addEventListener("keypress", e => {
      if (e.key === "Enter") { e.preventDefault(); performSearch(input.value); }
    });
  });
  submits.forEach((btn, i) => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      performSearch(inputs[i]?.value || inputs[0]?.value || "");
    });
  });
}

// ============================================
// FOOTER
// ============================================
function initFooter() {
  const yearEl = document.getElementById("footerYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterEmail = document.getElementById("newsletterEmail");
  if (newsletterForm && newsletterEmail) {
    // Prevent double-wiring
    if (newsletterForm.dataset.wired === "1") return;
    newsletterForm.dataset.wired = "1";

    newsletterForm.addEventListener("submit", e => {
      e.preventDefault();
      const email = newsletterEmail.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
      }
      const btn = newsletterForm.querySelector("button");
      const originalText = btn.textContent;
      btn.textContent = "✓ SUBSCRIBED";
      btn.style.background = "#2c7a4a";
      setTimeout(() => {
        newsletterForm.reset();
        btn.textContent = originalText;
        btn.style.background = "";
      }, 2500);
    });
  }
}

// ============================================
// PROFILE DROPDOWN — context-aware links
// ============================================
function initProfileDropdown() {
  const toggle = document.getElementById("profileToggle");
  const dropdown = document.getElementById("profileDropdown");
  const wrapper = document.getElementById("profileWrapper");
  const mobileSlot = document.querySelector(".mobile-auth-slot");

  if (!toggle || !dropdown || !wrapper) {
    console.warn('[initProfileDropdown] Missing elements:',
      { toggle: !!toggle, dropdown: !!dropdown, wrapper: !!wrapper });
    return;
  }

  // Prevent double-wiring
  if (toggle.dataset.profileWired === "1") {
    console.log('[initProfileDropdown] Already wired, skipping.');
    return;
  }
  toggle.dataset.profileWired = "1";

  // ✅ Context-aware base path
  const base = getBasePath();

  // Safe auth check
  const loggedIn = (typeof isLoggedIn === "function") ? isLoggedIn() : false;
  const user = (typeof currentUser !== "undefined") ? currentUser : null;

  function renderDropdown() {
    if (loggedIn && user) {
      dropdown.innerHTML = `
        <div class="dropdown-header">
          <div class="dropdown-avatar">${(user.name || "U").charAt(0).toUpperCase()}</div>
          <div class="dropdown-user">
            <p class="dropdown-name">${user.name || "User"}</p>
            <p class="dropdown-email">${user.email || ""}</p>
          </div>
        </div>
        <div class="dropdown-divider"></div>
        <a href="${base}profile.html" class="dropdown-item">👤 My Profile</a>
        <a href="${base}profile.html#orders" class="dropdown-item">📦 My Orders</a>
        <a href="${base}wishlist.html" class="dropdown-item">♡ Wishlist</a>
        <div class="dropdown-divider"></div>
        <button class="dropdown-item dropdown-logout" id="dropdownLogout">🚪 Logout</button>
      `;
      dropdown.querySelector("#dropdownLogout")?.addEventListener("click", () => {
        if (typeof logoutUser === "function") logoutUser();
        window.location.href = base + "index.html";
      });
    } else {
      dropdown.innerHTML = `
        <div class="dropdown-header">
          <p class="dropdown-guest-title">Welcome!</p>
          <p class="dropdown-guest-sub">Sign in to track your orders</p>
        </div>
        <div class="dropdown-divider"></div>
        <a href="${base}login.html" class="dropdown-item dropdown-primary">Login</a>
        <a href="${base}signup.html" class="dropdown-item">Create Account</a>
      `;
    }

    if (mobileSlot) {
      mobileSlot.innerHTML = (loggedIn && user)
        ? `<a href="${base}profile.html">My Profile <span class="mobile-user-name">(${user.name.split(" ")[0]})</span></a>`
        : `<a href="${base}login.html">Login / Signup</a>`;
    }
  }

  renderDropdown();

  toggle.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();
    wrapper.classList.toggle("open");
  });

  document.addEventListener("click", e => {
    if (!wrapper.contains(e.target)) wrapper.classList.remove("open");
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") wrapper.classList.remove("open");
  });

  console.log('[initProfileDropdown] Wired up successfully.');
}

// ============================================
// LOOKBOOK
// ============================================
function initLookbook() {
  const prevBtn = document.getElementById("lookbookPrev");
  const nextBtn = document.getElementById("lookbookNext");
  const grid = document.getElementById("lookbookGrid");
  if (!prevBtn || !nextBtn || !grid) return;

  let scrollPosition = 0;
  const itemWidth = (grid.querySelector(".lookbook-item")?.offsetWidth || 260) + 20;

  prevBtn.addEventListener("click", () => {
    scrollPosition = Math.max(0, scrollPosition - itemWidth);
    grid.scrollTo({ left: scrollPosition, behavior: "smooth" });
  });
  nextBtn.addEventListener("click", () => {
    scrollPosition += itemWidth;
    grid.scrollTo({ left: scrollPosition, behavior: "smooth" });
  });

  attachLookbookWishlist();
}

function attachLookbookWishlist() {
  const items = document.querySelectorAll(".lookbook-item");
  const lookbookProductMap = {
    "Chai ki Tapri": 3, "Barf Ka Gola": 4, "Khelo Cards": 2, "Cycle ka Safar": 1
  };

  items.forEach(item => {
    const img = item.querySelector("img");
    const btn = item.querySelector(".lookbook-wishlist");
    if (!img || !btn) return;

    const productName = btn.dataset.productName || img.alt?.replace(" lookbook", "");
    const productId = lookbookProductMap[productName];
    if (!productId) return;

    btn.dataset.wishlistId = productId;
    if (isInWishlist(productId)) {
      btn.classList.add("active");
      const svg = btn.querySelector("svg");
      if (svg) svg.setAttribute("fill", "#b33a3a");
    }

    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();
      const isAdded = toggleWishlist(productId);
      const svg = newBtn.querySelector("svg");
      if (isAdded) {
        newBtn.classList.add("active", "pop");
        if (svg) svg.setAttribute("fill", "#b33a3a");
        setTimeout(() => newBtn.classList.remove("pop"), 500);
      } else {
        newBtn.classList.remove("active");
        if (svg) svg.setAttribute("fill", "none");
      }
      updateWishlistBadge();
    });
  });
}

// ============================================
// COLLECTIONS WISHLIST
// ============================================
function initCollectionsWishlist() {
  const cards = document.querySelectorAll(".collection-card");
  const categoryProductMap = {
    "gola-wale-ki-gali": 4, "school-ka-vo-safar": 1, "doston-ki-baithak": 2,
    "ek-chai-hazaar-kisse": 3, "woh-lambi-calls": 3, "gali-cricket": 1,
    "ready-set-bachpan": 1, "woh-gaane-woh-din": 3
  };

  cards.forEach(card => {
    const btn = card.querySelector(".collection-wishlist");
    const category = card.dataset.category || "";
    if (!btn || !category) return;

    const productId = categoryProductMap[category];
    if (!productId) return;

    btn.dataset.wishlistId = productId;
    if (isInWishlist(productId)) {
      btn.classList.add("active");
      const svg = btn.querySelector("svg");
      if (svg) svg.setAttribute("fill", "#b33a3a");
    }

    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();
      const isAdded = toggleWishlist(productId);
      const svg = newBtn.querySelector("svg");
      if (isAdded) {
        newBtn.classList.add("active", "pop");
        if (svg) svg.setAttribute("fill", "#b33a3a");
        setTimeout(() => newBtn.classList.remove("pop"), 500);
      } else {
        newBtn.classList.remove("active");
        if (svg) svg.setAttribute("fill", "none");
      }
      updateWishlistBadge();
    });
  });
}

// ============================================
// REVIEWS CAROUSEL
// ============================================
function initCommunityCarousel() {
  const carousel = document.getElementById("communityCarousel");
  const nextBtn = document.getElementById("communityNext");
  if (!carousel || !nextBtn) return;

  const itemWidth = 152;
  let autoScroll = null;

  nextBtn.addEventListener("click", () => {
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    if (carousel.scrollLeft >= maxScroll - 10) {
      carousel.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      carousel.scrollBy({ left: itemWidth * 2, behavior: "smooth" });
    }
  });

  function startAutoScroll() {
    autoScroll = setInterval(() => {
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      if (carousel.scrollLeft >= maxScroll - 10) {
        carousel.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        carousel.scrollBy({ left: itemWidth, behavior: "smooth" });
      }
    }, 3000);
  }
  function stopAutoScroll() { clearInterval(autoScroll); }

  startAutoScroll();
  carousel.addEventListener("mouseenter", stopAutoScroll);
  carousel.addEventListener("mouseleave", startAutoScroll);
  document.addEventListener("visibilitychange", () => {
    document.hidden ? stopAutoScroll() : startAutoScroll();
  });
}

// ============================================
// FULL PAGE INITIALIZER (Homepage)
// ============================================
async function init() {
  if (window.__retroPoshakInitialized) return;
  window.__retroPoshakInitialized = true;

  await loadComponent("navbar-placeholder", "components/navbar.html");
  await new Promise(r => setTimeout(r, 60));

  safeRun("initMobileMenu", initMobileMenu);
  safeRun("initSearch", initSearch);
  safeRun("initProfileDropdown", initProfileDropdown);

  await loadComponent("hero-placeholder", "components/hero.html");
  await loadComponent("products-placeholder", "components/products.html");
  await loadComponent("about-placeholder", "components/about.html");
  await loadComponent("reviews-placeholder", "components/reviews.html");
  await loadComponent("footer-placeholder", "components/footer.html");
  await new Promise(r => setTimeout(r, 60));

  safeRun("initLookbook", initLookbook);
  safeRun("initCommunityCarousel", initCommunityCarousel);
  safeRun("initFooter", initFooter);

  if (typeof renderProducts === "function" && document.getElementById("product-grid")) renderProducts();
  safeRun("initCollectionsWishlist", initCollectionsWishlist);
  if (typeof syncWishlistButtons === "function") syncWishlistButtons();
  if (typeof updateWishlistBadge === "function") updateWishlistBadge();
  if (typeof updateCartBadge === "function") updateCartBadge();

  safeRun("initHeroCarousel", initHeroCarousel);
}

// ============================================
// SAFE RUN HELPER
// ============================================
function safeRun(name, fn) {
  try {
    if (typeof fn === "function") fn();
  } catch (e) {
    console.error(`[safeRun] ${name} failed:`, e);
  }
}

// ============================================
// GLOBAL NAVBAR LOADER (for non-homepage pages)
// ============================================
async function initNavbarAndFooter() {
  console.log('[initNavbarAndFooter] Starting...');
  console.log('[initNavbarAndFooter] Base path:', getBasePath() || '(root)');

  // Load both components
  const navLoaded = await loadComponent("navbar-placeholder", "components/navbar.html");
  const footLoaded = await loadComponent("footer-placeholder", "components/footer.html");

  console.log('[initNavbarAndFooter] Navbar loaded:', navLoaded, 'Footer loaded:', footLoaded);

  // Give the browser time to parse the injected HTML
  await new Promise(r => setTimeout(r, 100));

  // Init each feature independently
  safeRun("initMobileMenu", initMobileMenu);
  safeRun("initSearch", initSearch);
  safeRun("initProfileDropdown", initProfileDropdown);
  safeRun("initFooter", initFooter);

  // Update badges (safe calls)
  if (typeof updateWishlistBadge === "function") {
    try { updateWishlistBadge(); } catch (e) { console.error('[badge] wishlist:', e); }
  }
  if (typeof updateCartBadge === "function") {
    try { updateCartBadge(); } catch (e) { console.error('[badge] cart:', e); }
  }

  console.log('[initNavbarAndFooter] Done.');
}

// ============================================
// HOMEPAGE AUTO-INIT
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  const hasHomepage = !!document.getElementById("hero-placeholder");
  if (hasHomepage) init();
});