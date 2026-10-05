// ============================================
// COMPONENT LOADER
// ============================================
async function loadComponent(id, path) {
  const el = document.getElementById(id);
  if (!el) return false; // Silently skip if placeholder doesn't exist
  try {
    const response = await fetch(path);
    const html = await response.text();
    el.innerHTML = html;
    return true;
  } catch (error) {
    console.error(`Error loading ${path}:`, error);
    return false;
  }
}

// ============================================
// HERO CAROUSEL
// ============================================
function initHeroCarousel() {
  const slides = document.querySelectorAll(".hero-slide");
  const indicators = document.querySelectorAll(".indicator");
  const progressBar = document.querySelector(".hero-progress-bar");

  if (slides.length === 0) return;

  let currentSlide = 0;
  const slideInterval = 4000;

  function goToSlide(index) {
    slides.forEach((s) => s.classList.remove("active"));
    indicators.forEach((d) => d.classList.remove("active"));

    slides[index].classList.add("active");
    if (indicators[index]) indicators[index].classList.add("active");

    currentSlide = index;

    if (progressBar) {
      progressBar.style.animation = "none";
      void progressBar.offsetWidth;
      progressBar.style.animation = "progressFill 4s linear infinite";
    }
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
  }

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
// MOBILE MENU
// ============================================
function initMobileMenu() {
  const toggle = document.querySelector(".mobile-toggle");
  const menu = document.querySelector(".mobile-menu");
  const overlay = document.querySelector(".mobile-overlay");
  const closeBtn = document.querySelector(".mobile-menu-close");

  if (!toggle || !menu || !overlay) return;

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

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

// ============================================
// SEARCH FUNCTIONALITY (desktop + mobile)
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
    window.location.href = `shop.html?search=${encodeURIComponent(query.trim())}`;
  }

  inputs.forEach((input) => {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        performSearch(input.value);
      }
    });
  });

  submits.forEach((btn, i) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      performSearch(inputs[i]?.value || inputs[0]?.value || "");
    });
  });
}

// ============================================
// FOOTER: Auto year + Newsletter handler
// ============================================
function initFooter() {
  const yearEl = document.getElementById("footerYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterEmail = document.getElementById("newsletterEmail");

  if (newsletterForm && newsletterEmail) {
    newsletterForm.addEventListener("submit", (e) => {
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
// LOOKBOOK: Arrow navigation
// ============================================
function initLookbook() {
  const prevBtn = document.getElementById("lookbookPrev");
  const nextBtn = document.getElementById("lookbookNext");
  const grid = document.getElementById("lookbookGrid");

  if (!prevBtn || !nextBtn || !grid) return;

  let scrollPosition = 0;
  const itemWidth =
    (grid.querySelector(".lookbook-item")?.offsetWidth || 260) + 20;

  prevBtn.addEventListener("click", () => {
    scrollPosition = Math.max(0, scrollPosition - itemWidth);
    grid.scrollTo({ left: scrollPosition, behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    scrollPosition += itemWidth;
    grid.scrollTo({ left: scrollPosition, behavior: "smooth" });
  });
}

// ============================================
// REVIEWS: Community carousel auto-scroll + arrow
// ============================================
function initCommunityCarousel() {
  const carousel = document.getElementById("communityCarousel");
  const nextBtn = document.getElementById("communityNext");

  if (!carousel || !nextBtn) return;

  const itemWidth = 140 + 12; // item width + gap ≈ 152px
  let autoScroll = null;

  // Next button — scroll forward ~2 items, loop at end
  nextBtn.addEventListener("click", () => {
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;

    if (carousel.scrollLeft >= maxScroll - 10) {
      carousel.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      carousel.scrollBy({ left: itemWidth * 2, behavior: "smooth" });
    }
  });

  // Auto-scroll every 3 seconds
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

  function stopAutoScroll() {
    clearInterval(autoScroll);
  }

  startAutoScroll();
  carousel.addEventListener("mouseenter", stopAutoScroll);
  carousel.addEventListener("mouseleave", startAutoScroll);

  document.addEventListener("visibilitychange", () => {
    document.hidden ? stopAutoScroll() : startAutoScroll();
  });
}

// ============================================
// FULL PAGE INITIALIZER
// Works on every page — only loads what exists
// ============================================
async function init() {
  // Prevent double init
  if (window.__retroPosahkInitialized) return;
  window.__retroPosahkInitialized = true;

  // --------------------------------------------------
  // 1. Load navbar FIRST (needed for search + menu)
  // --------------------------------------------------
  await loadComponent("navbar-placeholder", "components/navbar.html");

  // Initialize navbar interactions immediately after it's injected
  initMobileMenu();
  initSearch();

  // --------------------------------------------------
  // 2. Load remaining components (only if placeholders exist)
  // --------------------------------------------------
  await loadComponent("hero-placeholder", "components/hero.html");
  await loadComponent("products-placeholder", "components/products.html");
  await loadComponent("about-placeholder", "components/about.html");
  await loadComponent("reviews-placeholder", "components/reviews.html");
  await loadComponent("footer-placeholder", "components/footer.html");

  // --------------------------------------------------
  // 3. Initialize component-specific behaviors
  // --------------------------------------------------

  // Lookbook arrows (only if lookbook exists)
  if (typeof initLookbook === "function" && document.getElementById("lookbookGrid")) {
    initLookbook();
  }

  // Community carousel (only if reviews exist)
  if (
    typeof initCommunityCarousel === "function" &&
    document.getElementById("communityCarousel")
  ) {
    initCommunityCarousel();
  }

  // Footer (auto year + newsletter)
  if (typeof initFooter === "function") {
    initFooter();
  }

  // Products grid (only on homepage)
  if (
    typeof renderProducts === "function" &&
    document.getElementById("product-grid")
  ) {
    renderProducts();
  }

  // Hero carousel (only if slides exist)
  if (
    typeof initHeroCarousel === "function" &&
    document.querySelector(".hero-slide")
  ) {
    initHeroCarousel();
  }

  // --------------------------------------------------
  // 4. Cart counter (works anywhere a .cart-icon exists)
  // --------------------------------------------------
  let cartCount = 0;
  const cartIcon = document.querySelector(".cart-icon");
  const cartCountEl = document.querySelector(".cart-count");
  if (cartIcon && cartCountEl) {
    cartIcon.addEventListener("click", (e) => {
      e.preventDefault();
      cartCount++;
      cartCountEl.textContent = cartCount;
    });
  }
}

// ============================================
// START THE APP
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  // Only auto-init on pages that have the homepage placeholders
  const hasHomepage = !!document.getElementById("hero-placeholder");
  if (hasHomepage) {
    init();
  }
});