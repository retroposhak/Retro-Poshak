/* =========================================================
   RETRO POSHAK — Product Detail Page (story-first layout)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('productContainer');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id'));
  const product = getProductById(id) || PRODUCTS[0];

  document.title = `${product.name} — Retro Poshak`;

  const wishlisted = window.RetroCart.isWishlisted(product.id);

  const gallery = [
    product.image,
    product.image2 || product.image,
    product.image,
    product.image,
    product.image
  ];

  const colorOptions = product.colors.map(c => `
    <button class="color-btn" data-color="${c}" style="background:${product.colorHex[c] || '#ccc'}" title="${c}" aria-label="${c}"></button>
  `).join('');

  const sizeOptions = product.sizes.map(s => `
    <button class="size-btn" data-size="${s}">${s}</button>
  `).join('');

  const benefitHTML = (product.benefits || []).map(b => `
    <div class="benefit-icon"><span class="bi-emoji">${b.icon}</span><span>${b.label}</span></div>
  `).join('');

  const priceHTML = product.compareAt
    ? `₹${product.price.toLocaleString('en-IN')} <s>₹${product.compareAt.toLocaleString('en-IN')}</s>`
    : `₹${product.price.toLocaleString('en-IN')}`;

  container.innerHTML = `
    <div class="product-detail">
      <div class="product-gallery">
        <div class="gallery-main">
          <img src="${gallery[0]}" alt="${product.name}" id="mainImage"
               onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22500%22 height=%22625%22><rect width=%22500%22 height=%22625%22 fill=%22%23e6d8c3%22/><text x=%22250%22 y=%22312%22 font-family=%22Georgia%22 font-style=%22italic%22 font-size=%2226%22 fill=%22%238f4228%22 text-anchor=%22middle%22>${product.name}</text></svg>'">
        </div>
        <div class="gallery-thumbs">
          ${gallery.map((g, i) => `
            <img src="${g}" alt="${product.name} view ${i + 1}" class="${i === 0 ? 'active' : ''}" data-src="${g}"
                 onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%22100%22><rect width=%2280%22 height=%22100%22 fill=%22%23ebe1d0%22/></svg>'">
          `).join('')}
        </div>
      </div>

      <div class="product-info-detail">
        <span class="eyebrow">${product.category === 'shirt' ? 'Relaxed Shirt' : 'Oversized T-Shirt'}</span>
        <h1>${product.name}</h1>
        <p class="product-subtitle">${product.subtitle || product.description}</p>
        <p class="product-price-detail">${priceHTML}</p>
        <p class="product-tax-note">Inclusive of all taxes · Free shipping over ₹1999</p>

        <!-- THE STORY BEHIND THE PRINT -->
        <div class="product-story-block">
          <span class="story-label">The Story Behind the Print</span>
          <p class="story-quote">${product.story || product.description}</p>
        </div>

        <!-- Benefit icons -->
        <div class="benefit-icons">${benefitHTML}</div>

        <!-- Color -->
        <div class="option-group" style="margin-top: 24px;">
          <h4 style="font-family:'Inter',sans-serif;font-size:10.5px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:var(--brown-soft);margin:0 0 12px;">Colour · <span id="selectedColor">${product.colors[0]}</span></h4>
          <div class="color-options">${colorOptions}</div>
        </div>

        <!-- Size -->
        <div class="option-group" style="margin-top: 24px;">
          <h4 style="font-family:'Inter',sans-serif;font-size:10.5px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:var(--brown-soft);margin:0 0 12px;">Size · <span id="selectedSize">${product.sizes[0]}</span></h4>
          <div class="size-options">${sizeOptions}</div>
          <button class="btn ghost" id="sizeGuideBtn" style="margin-top:10px;">View Size Guide</button>
        </div>

        <!-- Quantity -->
        <div class="option-group" style="margin-top: 24px;">
          <h4 style="font-family:'Inter',sans-serif;font-size:10.5px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:var(--brown-soft);margin:0 0 12px;">Quantity</h4>
          <div class="qty-wrap">
            <button id="qtyMinus" aria-label="Decrease quantity">−</button>
            <span id="qtyValue">1</span>
            <button id="qtyPlus" aria-label="Increase quantity">+</button>
          </div>
        </div>

        <!-- PIN code check -->
        <div class="pincode-block">
          <label for="pincodeInput">Check Delivery</label>
          <div class="pincode-row">
            <input type="text" id="pincodeInput" placeholder="Enter PIN code" maxlength="6" inputmode="numeric" />
            <button class="btn btn-outline" id="pincodeCheck" type="button">Check</button>
          </div>
          <p class="pincode-result" id="pincodeResult"></p>
        </div>

        <!-- CTAs -->
        <div class="product-actions" style="display:flex;gap:12px;margin-top:26px;flex-wrap:wrap;">
          <button class="btn btn-primary" id="addToCartBtn" style="flex:1;min-width:160px;" ${!product.inStock ? 'disabled' : ''}>
            ${product.inStock ? 'Add to Memories' : 'Sold Out'}
          </button>
          <button class="btn btn-outline" id="buyNowBtn" style="flex:1;min-width:160px;" ${!product.inStock ? 'disabled' : ''}>Buy Now</button>
          <button class="wishlist-large ${wishlisted ? 'active' : ''}" id="wishlistLarge" data-id="${product.id}"
                  style="display:inline-flex;align-items:center;gap:8px;background:transparent;border:1px solid var(--line-strong);padding:15px 22px;font-size:12.5px;letter-spacing:0.14em;text-transform:uppercase;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="${wishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
            <span>${wishlisted ? 'Wishlisted' : 'Wishlist'}</span>
          </button>
        </div>

        <!-- Accordions -->
        <div class="accordion">
          <div class="acc-item open">
            <button class="acc-head" aria-expanded="true">Fabric & Fit</button>
            <div class="acc-body"><div class="acc-body-inner">
              <p><strong>Fabric:</strong> ${product.fabric || '100% Cotton'}</p>
              <p><strong>GSM:</strong> ${product.gsm || 240} GSM</p>
              <p><strong>Fit:</strong> ${product.fit || 'Oversized / Drop Shoulder'}</p>
              <p><strong>Print:</strong> DTF printed artwork</p>
            </div></div>
          </div>
          <div class="acc-item">
            <button class="acc-head" aria-expanded="false">Size Guide (inches)</button>
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
            <button class="acc-head" aria-expanded="false">Shipping & Returns</button>
            <div class="acc-body"><div class="acc-body-inner">
              <p>Free shipping on orders over ₹1999. Dispatched within 2–3 business days.</p>
              <p>Easy 7-day returns on unworn items with tags. Exchange available for size issues.</p>
              <p>COD available. 5% off on prepaid orders.</p>
            </div></div>
          </div>
          <div class="acc-item">
            <button class="acc-head" aria-expanded="false">Care Instructions</button>
            <div class="acc-body"><div class="acc-body-inner">
              <p>Machine wash cold, inside out. Do not bleach. Do not tumble dry. Iron on reverse if needed.</p>
            </div></div>
          </div>
        </div>
      </div>
    </div>
  `;

  /* Gallery thumbs */
  container.querySelectorAll('.gallery-thumbs img').forEach(thumb => {
    thumb.addEventListener('click', () => {
      document.getElementById('mainImage').src = thumb.dataset.src;
      container.querySelectorAll('.gallery-thumbs img').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });

  /* Selection state */
  let selectedSize = product.sizes[0];
  let selectedColor = product.colors[0];
  let qty = 1;

  container.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedSize = btn.dataset.size;
      document.getElementById('selectedSize').textContent = selectedSize;
    });
  });
  const firstSize = container.querySelector('.size-btn');
  if (firstSize) firstSize.classList.add('active');

  container.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedColor = btn.dataset.color;
      document.getElementById('selectedColor').textContent = selectedColor;
    });
  });
  const firstColor = container.querySelector('.color-btn');
  if (firstColor) firstColor.classList.add('active');

  /* Quantity */
  document.getElementById('qtyMinus')?.addEventListener('click', () => {
    qty = Math.max(1, qty - 1);
    document.getElementById('qtyValue').textContent = qty;
  });
  document.getElementById('qtyPlus')?.addEventListener('click', () => {
    qty += 1;
    document.getElementById('qtyValue').textContent = qty;
  });

  /* Add to cart */
  document.getElementById('addToCartBtn')?.addEventListener('click', () => {
    if (!product.inStock) return;
    window.RetroCart.addToCart(product.id, selectedSize, selectedColor, qty);
  });

  /* Buy now */
  document.getElementById('buyNowBtn')?.addEventListener('click', () => {
    if (!product.inStock) return;
    window.RetroCart.addToCart(product.id, selectedSize, selectedColor, qty);
    window.location.href = 'checkout.html';
  });

  /* Wishlist */
  const wlBtn = document.getElementById('wishlistLarge');
  wlBtn?.addEventListener('click', () => {
    const active = window.RetroCart.toggleWishlist(product.id);
    wlBtn.classList.toggle('active', active);
    wlBtn.querySelector('span').textContent = active ? 'Wishlisted' : 'Wishlist';
    wlBtn.querySelector('svg').setAttribute('fill', active ? 'currentColor' : 'none');
  });

  /* Size guide */
  document.getElementById('sizeGuideBtn')?.addEventListener('click', () => {
    const items = container.querySelectorAll('.acc-item');
    items.forEach(i => i.classList.remove('open'));
    const sizeAcc = items[1];
    if (sizeAcc) {
      sizeAcc.classList.add('open');
      sizeAcc.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  /* PIN code check (mock) */
  document.getElementById('pincodeCheck')?.addEventListener('click', () => {
    const pin = document.getElementById('pincodeInput').value.trim();
    const result = document.getElementById('pincodeResult');
    if (!/^[0-9]{6}$/.test(pin)) {
      result.textContent = 'Please enter a valid 6-digit PIN code.';
      result.className = 'pincode-result';
      return;
    }
    const days = 3 + (Number(pin[5]) % 4);
    const date = new Date();
    date.setDate(date.getDate() + days);
    const formatted = date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    result.textContent = `✓ Delivers by ${formatted} · COD available · Free shipping over ₹1999`;
    result.className = 'pincode-result ok';
  });

  /* Accordions */
  container.querySelectorAll('.acc-head').forEach(head => {
    head.addEventListener('click', () => {
      const item = head.parentElement;
      const isOpen = item.classList.contains('open');
      container.querySelectorAll('.acc-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* Related products */
  const relatedGrid = document.getElementById('relatedGrid');
  if (relatedGrid) {
    const related = PRODUCTS.filter(p =>
      p.id !== product.id &&
      (p.collection === product.collection || p.category === product.category)
    ).slice(0, 4);
    const fallback = PRODUCTS.filter(p => p.id !== product.id).slice(0, 4);
    const list = related.length ? related : fallback;
    relatedGrid.innerHTML = list.map((p, i) => renderProductCard(p, i)).join('');
    bindProductCardEvents(relatedGrid);
  }
});