// ============================================
// NAVBAR ACTIVE STATE
// Auto-highlights the current page's nav link
// Works from root AND from /pages/ subfolder
// ============================================
(function () {
  "use strict";

  // Map of page filename → data-page value
  const pageMap = {
    "index.html": "home",
    "": "home", // root
    "shop.html": "shop",
    "product.html": "shop", // product detail also marks Shop
    "our-story.html": "our-story",
    "about.html": "our-story", // alias
    "blog.html": "blog",
    "blog-post.html": "blog",
    "contact.html": "contact",
    "wishlist.html": "wishlist",
    "cart.html": "cart",
    "checkout.html": "cart",
    "profile.html": "account",
    "login.html": "account",
    "signup.html": "account",

    // ✅ Policy pages — no nav link marked active
    "size-guide.html": "",
    "shipping-policy.html": "",
    "returns.html": "",
    "faqs.html": "",
    "track-order.html": "",
    "terms.html": "",
    "privacy.html": "",
  };

  function getCurrentPage() {
    const path = window.location.pathname;
    const file = path.substring(path.lastIndexOf("/") + 1);
    return pageMap[file] || "";
  }

  function applyActiveState() {
    const current = getCurrentPage();

    // Desktop links — always reset first, then apply
    document.querySelectorAll(".nav-links .nav-link").forEach((link) => {
      link.classList.toggle(
        "active",
        !!current && link.dataset.page === current,
      );
    });

    // Mobile links
    document.querySelectorAll(".mobile-nav-link").forEach((link) => {
      link.classList.toggle(
        "active",
        !!current && link.dataset.page === current,
      );
    });
  }

  // Run once on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyActiveState);
  } else {
    applyActiveState();
  }

  // Re-apply when navbar HTML is injected via fetch (async)
  // (MutationObserver catches the injection)
  if ("MutationObserver" in window) {
    const observer = new MutationObserver(() => {
      const hasNavLinks = document.querySelector(".nav-links .nav-link");
      if (hasNavLinks) applyActiveState();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
