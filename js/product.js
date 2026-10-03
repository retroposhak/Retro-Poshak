/* =========================================================
   RETRO POSHAK — Product Detail Page (story-first layout)
   Depends on: products.js, cart.js (window.RetroCart)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('productContainer');
  if (!container) return;

  const params  = new URLSearchParams(window.location.search);
  const id      = Number(params.get('id'));
  const product = getProductById(id) || PRODUCTS[0];

  document.title = `${product.name} — Retro Poshak`;

  const stories      = getProductStories(product.id);
  const primaryStory = stories[0] || null;
  const wishlisted   = window.RetroCart?.isWishlisted?.(product.id) || false;

  /* ---- Real images only (no duplicate placeholders) ---- */
  const gallery = [product.image];
  if (product.image2 && product.image2 !== product.image) gallery.push(product.image2);

  /* ---- Option markup ---- */
  const colorOptions = product.colors.map(c => {
    const hex = product.colorHex?.[c] || '#ccc';
    return `<button class="color-swatch" data-color="${c}" style="--swatch:${hex}"
              title="${c}" aria-label="${c}" type="button"></button>`;
  }).join('');

  const sizeOptions = product.sizes.map(s => `
    <button class="size-chip" data-size="${s}" type="button">${s}</button>
  `).join('');

  const benefitHTML = (product.benefits || []).map(b => `
    <div class="trust-item">
      <span class="trust-icon">${b.icon}</span>
      <div>
        <strong>${b.label}</strong>
        ${b.label === '240 GSM' ? 'Heavyweight feel' : ''}
        ${b.label === '100% Cotton' ? 'Breathable & soft' : ''}
        ${b.label === 'Oversized Fit' ? 'Relaxed silhouette' : ''}
        ${b.label === 'Premium Print' ? 'Fade-resistant' : ''}
      </div>
    </div>
  `).join('');

  const save = (product.compareAt && product.compareAt > product.price)
    ? product.compareAt - product.price : 0;

  const storyLabel = primaryStory
    ? `${primaryStory.title} · ${primaryStory.number}`
    : (product.category === 'shirt' ? 'Relaxed Shirt' : 'Oversized T-Shirt');

  /* ---- Markup ---- */
  container.innerHTML = `
    <div class="product-layout">

      <div class="product-gallery">
        <div class="gallery-main">
          ${product.badge === 'bestseller' ? '<span class="gallery-badge">Bestseller</span>' : ''}
          ${product.badge === 'new'        ? '<span class="gallery-badge badge-new">New</span>' : ''}
          ${(!product.badge && save > 0)   ? '<span class="gallery-badge badge-sale">Sale</span>' : ''}
          <img src="${gallery[0]}" alt="${product.name}" id="mainImage"
               onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22500%22 height=%22625%22><rect width=%22500%22 height=%22625%22 fill=%22%23e6d8c3%22/><text x=%22250%22 y=%22312%22 font-family=%22Georgia%22 font-style=%22italic%22 font-size=%2226%22 fill=%22%238f4228%22 text-anchor=%22middle%22>${product.name}</text></svg>'">
        </div>
        ${gallery.length > 1 ? `
          <div class="gallery-thumbs">
            ${gallery.map((g, i) => `
              <button class="gallery-thumb ${i === 0 ? 'is-active' : ''}"
                      data-src="${g}" type="button" aria-label="View image ${i + 1}">
                <img src="${g}" alt="" loading="lazy">
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>

      <div class="product-info">

        <nav class="product-breadcrumb" aria-label="Breadcrumb">
          <a href="index.html">Home</a>
          <span class="sep">/</span>
          <a href="shop.html">Shop</a>
          <span class="sep">/</span>
          <span>${product.name}</span>
        </nav>

        <span class="product-story-label">${storyLabel}</span>

        <h1 class="product-title">${product.name}</h1>
        <p class="product-subtitle">${product.subtitle || product.description}</p>

        ${product.story ? `<blockquote class="product-story">${product.story}</blockquote>` : ''}

        <div class="product-price-block">
          <span class="product-price-now">${formatPrice(product.price)}</span>
          ${product.compareAt ? `<span class="product-price-compare">${formatPrice(product.compareAt)}</span>` : ''}
          ${save > 0 ? `<span class="product-price-save">Save ${formatPrice(save)}</span>` : ''}
        </div>
        <p class="product-tax-note">Inclusive of all taxes · Free shipping over ₹1999</p>

        <!-- Colour -->
        <div class="option-group">
          <div class="option-head">
            <span class="option-label">Colour</span>
            <span class="option-value" id="colorValue">${product.colors[0]}</span>
          </div>
          <div class="color-swatches" id="colorSwatches">${colorOptions}</div>
        </div>

        <!-- Size -->
        <div class="option-group">
          <div class="option-head">
            <span class="option-label">Size</span>
            <button class="option-help" type="button" id="sizeGuideBtn">Size guide</button>
          </div>
          <div class="size-chips" id="sizeChips">${sizeOptions}</div>
        </div>

        <!-- Stock indicator -->
        <div class="stock-row">
          <span class="stock-dot" id="stockDot"></span>
          <span id="stockText">Select a size to see availability</span>
        </div>

        <!-- Quantity -->
        <div class="option-group qty-row">
          <span class="option-label">Quantity</span>
          <div class="qty-stepper">
            <button type="button" id="qtyMinus" aria-label="Decrease quantity">−</button>
            <input type="number" id="qtyInput" value="1" min="1" max="10" inputmode="numeric">
            <button type="button" id="qtyPlus" aria-label="Increase quantity">+</button>
          </div>
        </div>

        <!-- CTAs -->
        <div class="product-cta">
          <button class="btn btn-primary" id="addToCartBtn" ${!product.inStock ? 'disabled' : ''}>
            ${product.inStock ? 'Add to Memories' : 'Sold Out'}
          </button>
          <button class="btn btn-primary" id="buyNowBtn"
                  style="background:var(--rust);border-color:var(--rust);"
                  ${!product.inStock ? 'disabled' : ''}>
            Buy Now
          </button>
          <button class="btn btn-outline ${wishlisted ? 'is-active' : ''}" id="wishlistBtn"
                  aria-label="Add to wishlist" type="button">
            <svg width="18" height="18" viewBox="0 0 24 24"
                 fill="${wishlisted ? 'currentColor' : 'none'}"
                 stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>
            </svg>
          </button>
        </div>

        <!-- PIN code check -->
        <div class="option-group" style="margin-top: 6px;">
          <label class="option-label" for="pincodeInput" style="margin-bottom:10px;">Check Delivery</label>
          <div class="qty-row" style="gap:10px;">
            <input type="text" id="pincodeInput" placeholder="Enter PIN code" maxlength="6"
                   inputmode="numeric"
                   style="flex:1;padding:13px 14px;border:1px solid var(--line-strong);background:transparent;
                          font-family:'Inter',sans-serif;font-size:13px;color:var(--brown);border-radius:2px;">
            <button class="btn btn-outline" id="pincodeCheck" type="button">Check</button>
          </div>
          <p id="pincodeResult" style="font-size:12px;letter-spacing:0.04em;color:var(--brown-soft);margin:8px 0 0;"></p>
        </div>

        <!-- Trust row -->
        ${benefitHTML ? `<div class="trust-row">${benefitHTML}</div>` : ''}

        <!-- Accordions -->
        <div class="accordion">
          <div class="acc-item open">
            <button class="acc-head" aria-expanded="true" type="button">Fabric &amp; Fit</button>
            <div class="acc-body"><div class="acc-body-inner">
              <p><strong>Fabric:</strong> ${product.fabricInfo?.fabric || product.fabric || '100% Cotton Terry'}</p>
              <p><strong>GSM:</strong> ${product.fabricInfo?.gsm || (product.gsm + ' GSM')}</p>
              <p><strong>Fit:</strong> ${product.fabricInfo?.fit || product.fit || 'Oversized / Drop Shoulder'}</p>
              <p><strong>Print:</strong> High-quality DTF print</p>
            </div></div>
          </div>
          <div class="acc-item">
            <button class="acc-head" aria-expanded="false" type="button">Size Guide (inches)</button>
            <div class="acc-body"><div class="acc-body-inner">
              <p><strong>Chest · Length · Shoulder · Sleeve</strong></p>
              <p>S: 38" · 27" · 20" · 9"</p>
              <p>M: 40" · 28" · 21" · 9.5"</p>
              <p>L: 42" · 29" · 22" · 10"</p>
              <p>XL: 44" · 30" · 23" · 10.5"</p>
              <p>XXL: 46" · 31" · 24" · 11"</p>
              <p style="margin-top:14px;"><em>Model is wearing: L</em></p>
            </div></div>
          </div>
          <div class="acc-item">
            <button class="acc-head" aria-expanded="false" type="button">Shipping &amp; Returns</button>
            <div class="acc-body"><div class="acc-body-inner">
              <p>Free shipping on orders over ₹1999. Dispatched within 2–3 business days.</p>
              <p>Easy 7-day returns on unworn items with tags. Exchange available for size issues.</p>
              <p>COD available. 5% off on prepaid orders.</p>
            </div></div>
          </div>
          <div class="acc-item">
            <button class="acc-head" aria-expanded="false" type="button">Care Instructions</button>
            <div class="acc-body"><div class="acc-body-inner">
              <p>Machine wash cold, inside out. Do not bleach. Do not tumble dry.
                 Iron on reverse if needed.</p>
            </div></div>
          </div>
        </div>

      </div>
    </div>
  `;

  /* =========================================================
     DETAILS STRIP
     ========================================================= */
  const strip = document.getElementById('productDetailsStrip');
  if (strip) {
    const setText = (id, txt) => {
      const el = document.getElementById(id);
      if (el) el.textContent = txt;
    };
    setText('detailFabric', product.fabricInfo?.fabric || product.fabric || '100% Cotton Terry');
    setText('detailGsm',    product.fabricInfo?.gsm    || (product.gsm + ' GSM'));
    setText('detailFit',    product.fabricInfo?.fit    || product.fit || 'Oversized / Drop Shoulder');
    strip.hidden = false;
  }

  /* =========================================================
     STATE
     ========================================================= */
  let selectedColor = product.colors[0];
  let selectedSize  = product.sizes.find(s => getVariantStock(product.id, selectedColor, s) > 0)
                       || product.sizes[0];
  let qty = 1;

  const stockDot  = document.getElementById('stockDot');
  const stockText = document.getElementById('stockText');
  const qtyInput  = document.getElementById('qtyInput');
  const qtyMinus  = document.getElementById('qtyMinus');
  const qtyPlus   = document.getElementById('qtyPlus');
  const addBtn    = document.getElementById('addToCartBtn');
  const buyBtn    = document.getElementById('buyNowBtn');

  /* =========================================================
     STOCK REFRESH — disables sold-out sizes, updates badge
     ========================================================= */
  function refreshStock() {
    const stock = getVariantStock(product.id, selectedColor, selectedSize);

    // Disable size chips that are 0 in the current colour
    container.querySelectorAll('.size-chip').forEach(chip => {
      const s = chip.dataset.size;
      const n = getVariantStock(product.id, selectedColor, s);
      chip.disabled = n === 0;
      chip.classList.toggle('is-active', s === selectedSize && n > 0);
    });

    // Update stock indicator
    if (stockDot) stockDot.className = 'stock-dot';
    if (stock === 0) {
      stockDot?.classList.add('out');
      if (stockText) stockText.innerHTML = 'Out of stock in this colour';
      if (addBtn) addBtn.disabled = true;
      if (buyBtn) buyBtn.disabled = true;
      if (qtyInput) { qtyInput.value = 1; qtyInput.max = 1; }
      qty = 1;
      if (qtyMinus) qtyMinus.disabled = true;
      if (qtyPlus)  qtyPlus.disabled  = true;
    } else if (stock <= 3) {
      stockDot?.classList.add('low');
      if (stockText) stockText.innerHTML = `Only <strong>${stock}</strong> left`;
      if (addBtn) addBtn.disabled = false;
      if (buyBtn) buyBtn.disabled = false;
      if (qtyInput) qtyInput.max = stock;
      if (qtyMinus) qtyMinus.disabled = qty <= 1;
      if (qtyPlus)  qtyPlus.disabled  = qty >= stock;
    } else {
      if (stockText) stockText.innerHTML = `<strong>${stock}</strong> in stock`;
      if (addBtn) addBtn.disabled = false;
      if (buyBtn) buyBtn.disabled = false;
      if (qtyInput) qtyInput.max = Math.min(stock, 10);
      if (qtyMinus) qtyMinus.disabled = qty <= 1;
      if (qtyPlus)  qtyPlus.disabled  = qty >= Math.min(stock, 10);
    }
  }

  /* =========================================================
     COLOUR SELECTION
     ========================================================= */
  const colorSwatches = container.querySelectorAll('.color-swatch');
  colorSwatches.forEach(btn => {
    btn.addEventListener('click', () => {
      colorSwatches.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      selectedColor = btn.dataset.color;
      const valEl = document.getElementById('colorValue');
      if (valEl) valEl.textContent = selectedColor;

      // If current size is out of stock in new colour, jump to first available
      if (getVariantStock(product.id, selectedColor, selectedSize) === 0) {
        const firstAvailable = product.sizes.find(
          s => getVariantStock(product.id, selectedColor, s) > 0
        );
        if (firstAvailable) selectedSize = firstAvailable;
      }
      refreshStock();
    });
  });
  colorSwatches[0]?.classList.add('is-active');

  /* =========================================================
     SIZE SELECTION
     ========================================================= */
  container.querySelectorAll('.size-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      container.querySelectorAll('.size-chip').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      selectedSize = btn.dataset.size;
      refreshStock();
    });
  });

  /* =========================================================
     QUANTITY
     ========================================================= */
  qtyMinus?.addEventListener('click', () => {
    qty = Math.max(1, qty - 1);
    if (qtyInput) qtyInput.value = qty;
    refreshStock();
  });
  qtyPlus?.addEventListener('click', () => {
    const max = Number(qtyInput?.max) || 10;
    qty = Math.min(max, qty + 1);
    if (qtyInput) qtyInput.value = qty;
    refreshStock();
  });
  qtyInput?.addEventListener('change', () => {
    const max = Number(qtyInput.max) || 10;
    qty = Math.max(1, Math.min(max, Number(qtyInput.value) || 1));
    qtyInput.value = qty;
    refreshStock();
  });

  /* =========================================================
     GALLERY THUMBS
     ========================================================= */
  container.querySelectorAll('.gallery-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const main = document.getElementById('mainImage');
      if (main) main.src = thumb.dataset.src;
      container.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('is-active'));
      thumb.classList.add('is-active');
    });
  });

  /* =========================================================
     ADD TO CART
     ========================================================= */
  addBtn?.addEventListener('click', () => {
    if (getVariantStock(product.id, selectedColor, selectedSize) === 0) return;
    window.RetroCart?.addToCart?.(product.id, selectedSize, selectedColor, qty);
  });

  /* =========================================================
     BUY NOW
     ========================================================= */
  buyBtn?.addEventListener('click', () => {
    if (getVariantStock(product.id, selectedColor, selectedSize) === 0) return;
    window.RetroCart?.addToCart?.(product.id, selectedSize, selectedColor, qty);
    window.location.href = 'checkout.html';
  });

  /* =========================================================
     WISHLIST
     ========================================================= */
  const wlBtn = document.getElementById('wishlistBtn');
  wlBtn?.addEventListener('click', () => {
    const active = window.RetroCart?.toggleWishlist?.(product.id);
    if (typeof active !== 'boolean') return;
    wlBtn.classList.toggle('is-active', active);
    const svg = wlBtn.querySelector('svg');
    if (svg) svg.setAttribute('fill', active ? 'currentColor' : 'none');
  });

  /* =========================================================
     SIZE GUIDE — opens the size accordion
     ========================================================= */
  document.getElementById('sizeGuideBtn')?.addEventListener('click', () => {
    const items = container.querySelectorAll('.acc-item');
    items.forEach(i => i.classList.remove('open'));
    const sizeAcc = items[1];
    if (sizeAcc) {
      sizeAcc.classList.add('open');
      sizeAcc.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  /* =========================================================
     PIN CODE CHECK (mock)
     ========================================================= */
  document.getElementById('pincodeCheck')?.addEventListener('click', () => {
    const pin    = document.getElementById('pincodeInput').value.trim();
    const result = document.getElementById('pincodeResult');
    if (!/^[0-9]{6}$/.test(pin)) {
      result.textContent = 'Please enter a valid 6-digit PIN code.';
      result.style.color = 'var(--rust)';
      return;
    }
    const days = 3 + (Number(pin[5]) % 4);
    const date = new Date();
    date.setDate(date.getDate() + days);
    const formatted = date.toLocaleDateString('en-IN',
      { weekday: 'short', day: 'numeric', month: 'short' });
    result.textContent = `✓ Delivers by ${formatted} · COD available · Free shipping over ₹1999`;
    result.style.color = '#5b8c4a';
  });

  /* =========================================================
     ACCORDIONS
     ========================================================= */
  container.querySelectorAll('.acc-head').forEach(head => {
    head.addEventListener('click', () => {
      const item   = head.parentElement;
      const isOpen = item.classList.contains('open');
      container.querySelectorAll('.acc-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
      head.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* =========================================================
     INITIAL PAINT
     ========================================================= */
  refreshStock();

  /* =========================================================
     RELATED PRODUCTS
     Scores by story overlap (collections[]), fallback category.
     Uses shared renderProductCard from products.js.
     ========================================================= */
  const relatedGrid = document.getElementById('relatedGrid');
  if (relatedGrid && typeof renderProductCard === 'function') {
    const primaryCollections = getCollections(product);

    const scored = PRODUCTS
      .filter(p => p.id !== product.id)
      .map(p => {
        const sharedStories = getCollections(p)
          .filter(c => primaryCollections.includes(c)).length;
        const sameCat = p.category === product.category ? 1 : 0;
        return { p, score: sharedStories * 2 + sameCat };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(x => x.p);

    relatedGrid.innerHTML = scored.map((p, i) => renderProductCard(p, i)).join('');
    if (typeof bindProductCardEvents === 'function') {
      bindProductCardEvents(relatedGrid);
    }
  }
});