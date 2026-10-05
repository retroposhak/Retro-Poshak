// ============================================
// SHOP PAGE — FULLY UPDATED
// Supports: ?id=  ?search=  ?category=  ?color=  ?size=  ?sort=
// ============================================

// ---- Global state ----
const shopState = {
    category: 'all',
    colors: [],
    sizes: [],
    maxPrice: 2000,
    sort: 'featured',
    search: ''
};

// ---- Extract data dynamically ----
const ALL_COLORS = (() => {
    const map = new Map();
    products.forEach(p => p.colors.forEach(c => !map.has(c) && map.set(c, p.colorHex[c])));
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
})();

const ALL_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const PRICE_MIN = Math.min(...products.map(p => p.price));
const PRICE_MAX = Math.max(...products.map(p => p.price));

// ============================================
// ENTRY POINT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);

    const id = parseInt(params.get('id'));

    if (id) {
        renderProductDetail(id);
    } else {
        // Read initial filters from URL
        shopState.search = params.get('search') || '';
        shopState.category = params.get('category') || 'all';
        shopState.sort = params.get('sort') || 'featured';

        const colorParam = params.get('color');
        if (colorParam) shopState.colors = colorParam.split(',').map(c => c.trim()).filter(Boolean);

        const sizeParam = params.get('size');
        if (sizeParam) shopState.sizes = sizeParam.split(',').map(s => s.trim()).filter(Boolean);

        renderShopGrid();
    }
});

// ============================================
// MODE A — PRODUCT DETAIL
// ============================================
function renderProductDetail(id) {
    const app = document.getElementById('shop-app');
    if (!app) return;

    const product = products.find(p => p.id === id) || products[0];
    const images = product.images || [product.image];
    document.title = `${product.name} - Retro Poshak`;

    app.innerHTML = `
        <div class="product-detail-page">
            <div class="product-detail-container">
                <a href="shop.html" class="shop-back">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    <span>Back to Shop</span>
                </a>
                <div class="product-detail-layout">
                    <div class="product-gallery">
                        <div class="gallery-main">
                            <img id="main-product-img" src="${images[0]}" alt="${product.name}">
                        </div>
                        <div class="gallery-thumbs">
                            ${images.map((img, i) => `
                                <button class="gallery-thumb ${i === 0 ? 'active' : ''}" data-img="${img}">
                                    <img src="${img}" alt="${product.name} ${i + 1}">
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    <div class="product-detail-info">
                        <span class="detail-eyebrow">Retro Poshak</span>
                        <h1 class="detail-title">${product.name}</h1>
                        <p class="detail-subtitle">${product.subtitle}</p>
                        <div class="detail-price">
                            <span class="detail-current">₹${product.price.toLocaleString()}</span>
                            <span class="detail-compare">₹${product.compareAt.toLocaleString()}</span>
                            <span class="detail-save">Save ₹${(product.compareAt - product.price).toLocaleString()}</span>
                        </div>
                        <p class="detail-description">${product.description}</p>

                        <div class="detail-section">
                            <span class="detail-label">Colour</span>
                            <div class="detail-color-list">
                                ${product.colors.map((c, i) => `
                                    <button class="detail-color ${i === 0 ? 'active' : ''}" style="background: ${product.colorHex[c]}" title="${c}"></button>
                                `).join('')}
                            </div>
                        </div>

                        <div class="detail-section">
                            <span class="detail-label">Size</span>
                            <div class="detail-size-list">
                                ${['S', 'M', 'L', 'XL', 'XXL'].map((s, i) => `
                                    <button class="detail-size ${i === 1 ? 'active' : ''}">${s}</button>
                                `).join('')}
                            </div>
                        </div>

                        <button class="detail-cta">ADD TO BAG</button>
                        <div class="detail-meta">
                            <p>✦ 240 GSM Heavyweight Cotton</p>
                            <p>✦ Free shipping on orders above ₹1499</p>
                            <p>✦ COD available across India</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    attachProductDetailListeners();
}

function attachProductDetailListeners() {
    const mainImg = document.getElementById('main-product-img');
    document.querySelectorAll('.gallery-thumb').forEach(t => t.addEventListener('click', () => {
        document.querySelectorAll('.gallery-thumb').forEach(x => x.classList.remove('active'));
        t.classList.add('active');
        mainImg.style.opacity = '0';
        setTimeout(() => { mainImg.src = t.dataset.img; mainImg.style.opacity = '1'; }, 180);
    }));
    document.querySelectorAll('.detail-size').forEach(b => b.addEventListener('click', () => {
        document.querySelectorAll('.detail-size').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
    }));
    document.querySelectorAll('.detail-color').forEach(b => b.addEventListener('click', () => {
        document.querySelectorAll('.detail-color').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
    }));
    const cta = document.querySelector('.detail-cta');
    if (cta) cta.addEventListener('click', () => {
        cta.textContent = '✓ ADDED TO BAG';
        cta.style.background = '#2c7a4a';
        setTimeout(() => { cta.textContent = 'ADD TO BAG'; cta.style.background = ''; }, 1800);
    });
}

// ============================================
// MODE B — SHOP GRID
// ============================================
function renderShopGrid() {
    const app = document.getElementById('shop-app');
    if (!app) return;

    // Title updates based on search
    document.title = shopState.search
        ? `Search: "${shopState.search}" - Retro Poshak`
        : 'Shop - Retro Poshak';

    // Max price init
    if (shopState.maxPrice === 2000) shopState.maxPrice = PRICE_MAX;

    // Search banner text
    const searchBanner = shopState.search ? `
        <div class="shop-search-banner">
            <span>Showing results for</span>
            <strong>"${shopState.search}"</strong>
            <button class="shop-search-clear" id="clearSearch">
                Clear
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        </div>
    ` : '';

    app.innerHTML = `
        <section class="shop-hero">
            <div class="shop-hero-bg" style="background-image: url('assets/images/shop-hero.jpeg');"></div>
            <div class="shop-hero-overlay"></div>
            <div class="shop-hero-content">
                <span class="shop-hero-eyebrow">EXPLORE OUR COLLECTION</span>
                <h1 class="shop-hero-title">Shop</h1>
                <p class="shop-hero-subtitle">Nostalgia you can wear.</p>
            </div>
            <div class="shop-hero-note">
                <p>Same<br>streets.<br>Different<br>generations.</p>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="hero-note-heart"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </div>
            <div class="shop-hero-stamp">
                <p>Wear<br>your<br>yaaden.</p>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </div>
        </section>

        <section class="shop-categories">
            <button class="shop-cat active" data-cat="all"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path></svg><span>All Products</span></button>
            <button class="shop-cat" data-cat="childhood"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="17.5" r="3.5"></circle><circle cx="18.5" cy="17.5" r="3.5"></circle><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2"></path></svg><span>Childhood</span></button>
            <button class="shop-cat" data-cat="vintage"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="1"></rect><circle cx="7" cy="12" r="2"></circle><circle cx="17" cy="12" r="2"></circle><path d="M9 12h6"></path></svg><span>Vintage</span></button>
            <button class="shop-cat" data-cat="indian-streets"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 9h.01M15 9h.01M9 13h.01M15 13h.01"></path></svg><span>Indian Streets</span></button>
            <button class="shop-cat" data-cat="everyday"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 8 6H4l4 4-3 3 3 3-4 4h4l4 4 4-4h4l-4-4 3-3-3-3 4-4h-4z"></path></svg><span>Everyday Memories</span></button>
        </section>

        <section class="shop-content">
            <aside class="shop-filters">
                <div class="filters-header">
                    <h2 class="filters-title">Filters</h2>
                    <button class="filter-clear" id="clearFilters">Clear All</button>
                </div>

                <div class="filter-group">
                    <h3 class="filter-heading">Category</h3>
                    <ul class="filter-list">
                        <li><label class="filter-checkbox"><input type="checkbox" data-cat="all" checked><span>All Products</span></label></li>
                        <li><label class="filter-checkbox"><input type="checkbox" data-cat="childhood"><span>Childhood</span></label></li>
                        <li><label class="filter-checkbox"><input type="checkbox" data-cat="vintage"><span>Vintage</span></label></li>
                        <li><label class="filter-checkbox"><input type="checkbox" data-cat="indian-streets"><span>Indian Streets</span></label></li>
                        <li><label class="filter-checkbox"><input type="checkbox" data-cat="everyday"><span>Everyday Memories</span></label></li>
                    </ul>
                </div>

                <div class="filter-group">
                    <h3 class="filter-heading">Colour</h3>
                    <div class="filter-colors" id="filter-colors-container"></div>
                </div>

                <div class="filter-group">
                    <h3 class="filter-heading">Size</h3>
                    <div class="filter-sizes" id="filter-sizes-container"></div>
                </div>

                <div class="filter-group">
                    <h3 class="filter-heading">Price</h3>
                    <div class="filter-price">
                        <input type="range" min="${PRICE_MIN}" max="${PRICE_MAX}" value="${shopState.maxPrice}" step="50" class="price-slider" id="priceSlider">
                        <div class="price-labels"><span id="priceMinLabel">₹${PRICE_MIN.toLocaleString()}</span><span id="priceMaxLabel">₹${shopState.maxPrice.toLocaleString()}</span></div>
                    </div>
                </div>
            </aside>

            <div class="shop-products-area">
                ${searchBanner}
                <div class="shop-topbar">
                    <span class="shop-count" id="shopCount">${products.length} Products</span>
                    <div class="shop-sort">
                        <label>Sort by:</label>
                        <select id="sortSelect">
                            <option value="featured">Featured</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="name">Name: A–Z</option>
                        </select>
                    </div>
                </div>
                <div class="shop-product-grid" id="shop-product-grid"></div>
                <div class="shop-empty" id="shopEmpty" style="display:none;">
                    <p>No products match your filters.</p>
                    <button id="resetEmpty">Reset Filters</button>
                </div>
            </div>
        </section>
    `;

    populateColorFilters();
    populateSizeFilters();
    attachCategoryListeners();
    attachColorListeners();
    attachSizeListeners();
    attachPriceListener();
    attachSortListener();
    attachClearFiltersListener();
    attachSearchClearListener();
    syncStateToUI();
    applyFiltersAndRender();
}

// ============================================
// SYNC STATE → UI (called after render)
// ============================================
function syncStateToUI() {
    // Sort select
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) sortSelect.value = shopState.sort;

    // Active category tab
    document.querySelectorAll('.shop-cat').forEach(t => {
        t.classList.toggle('active', t.dataset.cat === shopState.category);
    });

    // Sidebar category checkboxes
    document.querySelectorAll('.filter-checkbox input[data-cat]').forEach(i => {
        i.checked = i.dataset.cat === shopState.category;
    });

    // Colors
    document.querySelectorAll('.filter-color').forEach(btn => {
        btn.classList.toggle('active', shopState.colors.includes(btn.dataset.color));
    });

    // Sizes
    document.querySelectorAll('.filter-size').forEach(btn => {
        btn.classList.toggle('active', shopState.sizes.includes(btn.dataset.size));
    });
}

// ============================================
// POPULATE DYNAMIC FILTERS
// ============================================
function populateColorFilters() {
    const c = document.getElementById('filter-colors-container');
    if (!c) return;
    c.innerHTML = ALL_COLORS.map(col => `
        <button class="filter-color" style="background: ${col.hex}" data-color="${col.name}" title="${col.name}">
            <span class="color-check">✓</span>
        </button>
    `).join('');
}

function populateSizeFilters() {
    const c = document.getElementById('filter-sizes-container');
    if (!c) return;
    c.innerHTML = ALL_SIZES.map(s => `<button class="filter-size" data-size="${s}">${s}</button>`).join('');
}

// ============================================
// LISTENERS
// ============================================
function attachCategoryListeners() {
    document.querySelectorAll('.filter-checkbox input[data-cat]').forEach(input => {
        input.addEventListener('change', () => {
            document.querySelectorAll('.filter-checkbox input[data-cat]').forEach(i => { if (i !== input) i.checked = false; });
            shopState.category = input.dataset.cat;
            document.querySelectorAll('.shop-cat').forEach(t => t.classList.toggle('active', t.dataset.cat === shopState.category));
            updateURL();
            applyFiltersAndRender();
        });
    });
    document.querySelectorAll('.shop-cat').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.shop-cat').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            shopState.category = tab.dataset.cat;
            document.querySelectorAll('.filter-checkbox input[data-cat]').forEach(i => i.checked = i.dataset.cat === shopState.category);
            updateURL();
            applyFiltersAndRender();
        });
    });
}

function attachColorListeners() {
    document.querySelectorAll('.filter-color').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const color = btn.dataset.color;
            btn.classList.toggle('active');
            if (shopState.colors.includes(color)) shopState.colors = shopState.colors.filter(c => c !== color);
            else shopState.colors.push(color);
            updateURL();
            applyFiltersAndRender();
        });
    });
}

function attachSizeListeners() {
    document.querySelectorAll('.filter-size').forEach(btn => {
        btn.addEventListener('click', () => {
            const size = btn.dataset.size;
            btn.classList.toggle('active');
            if (shopState.sizes.includes(size)) shopState.sizes = shopState.sizes.filter(s => s !== size);
            else shopState.sizes.push(size);
            updateURL();
            applyFiltersAndRender();
        });
    });
}

function attachPriceListener() {
    const slider = document.getElementById('priceSlider');
    const label = document.getElementById('priceMaxLabel');
    if (!slider) return;
    slider.addEventListener('input', () => {
        shopState.maxPrice = parseInt(slider.value);
        label.textContent = `₹${shopState.maxPrice.toLocaleString()}`;
        applyFiltersAndRender();
    });
}

function attachSortListener() {
    const select = document.getElementById('sortSelect');
    if (!select) return;
    select.addEventListener('change', () => {
        shopState.sort = select.value;
        updateURL();
        applyFiltersAndRender();
    });
}

function attachClearFiltersListener() {
    document.getElementById('clearFilters')?.addEventListener('click', resetFilters);
    document.getElementById('resetEmpty')?.addEventListener('click', resetFilters);
}

function attachSearchClearListener() {
    document.getElementById('clearSearch')?.addEventListener('click', () => {
        shopState.search = '';
        updateURL();
        renderShopGrid();
    });
}

function resetFilters() {
    shopState.category = 'all';
    shopState.colors = [];
    shopState.sizes = [];
    shopState.maxPrice = PRICE_MAX;
    shopState.sort = 'featured';
    shopState.search = '';

    const url = new URL(window.location);
    url.search = '';
    window.history.replaceState({}, '', url);

    renderShopGrid();
}

// ============================================
// URL SYNC — keeps filters shareable
// ============================================
function updateURL() {
    const url = new URL(window.location);
    const params = new URLSearchParams();

    if (shopState.search) params.set('search', shopState.search);
    if (shopState.category && shopState.category !== 'all') params.set('category', shopState.category);
    if (shopState.colors.length) params.set('color', shopState.colors.join(','));
    if (shopState.sizes.length) params.set('size', shopState.sizes.join(','));
    if (shopState.sort && shopState.sort !== 'featured') params.set('sort', shopState.sort);

    const qs = params.toString();
    window.history.replaceState({}, '', url.pathname + (qs ? '?' + qs : ''));
}

// ============================================
// FILTER + SORT + RENDER
// ============================================
function applyFiltersAndRender() {
    let filtered = [...products];

    // Search filter
    if (shopState.search) {
        const q = shopState.search.toLowerCase().trim();
        filtered = filtered.filter(p =>
            (p.name || '').toLowerCase().includes(q) ||
            (p.subtitle || '').toLowerCase().includes(q) ||
            (p.description || '').toLowerCase().includes(q) ||
            (p.categories || []).some(c => c.toLowerCase().includes(q)) ||
            (p.colors || []).some(c => c.toLowerCase().includes(q))
        );
    }

    // Category filter
    if (shopState.category !== 'all') {
        const map = {
            'childhood': [1, 4],
            'vintage': [2],
            'indian-streets': [3],
            'everyday': [1, 2, 3, 4]
        };
        const allowed = map[shopState.category] || [];
        filtered = filtered.filter(p => allowed.includes(p.id));
    }

    // Color filter
    if (shopState.colors.length > 0) {
        filtered = filtered.filter(p =>
            (p.colors || []).some(c => shopState.colors.includes(c))
        );
    }

    // Size filter
    if (shopState.sizes.length > 0) {
        filtered = filtered.filter(p => {
            if (!p.sizes) return true; // assume universal if no sizes
            return p.sizes.some(s => shopState.sizes.includes(s));
        });
    }

    // Price filter
    filtered = filtered.filter(p => p.price <= shopState.maxPrice);

    // Sort
    switch (shopState.sort) {
        case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
        case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
        case 'name': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
    }

    // Update count
    const countEl = document.getElementById('shopCount');
    if (countEl) {
        countEl.textContent = `${filtered.length} ${filtered.length === 1 ? 'Product' : 'Products'}`;
    }

    // Empty state
    const emptyEl = document.getElementById('shopEmpty');
    const gridEl = document.getElementById('shop-product-grid');

    if (filtered.length === 0) {
        if (emptyEl) emptyEl.style.display = 'block';
        if (gridEl) gridEl.innerHTML = '';
    } else {
        if (emptyEl) emptyEl.style.display = 'none';
        renderShopProductCards(filtered);
    }
}

// ============================================
// RENDER CARDS
// ============================================
function renderShopProductCards(list = products) {
    const grid = document.getElementById('shop-product-grid');
    if (!grid) return;

    grid.innerHTML = list.map(product => `
        <div class="product-card" data-id="${product.id}" data-images='${JSON.stringify(product.images)}'>
            <div class="product-image-wrap">
                <a href="shop.html?id=${product.id}" class="product-image-link">
                    <img src="${product.images[0]}" alt="${product.name}" class="product-img" loading="lazy">
                </a>
                <button class="wishlist-btn" aria-label="Add to wishlist">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </button>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="story-text">${product.subtitle}</p>
                <div class="product-bottom">
                    <div class="product-price-row">
                        <div class="product-price"><span class="current-price">₹${product.price.toLocaleString()}</span></div>
                        <div class="color-dots">
                            ${product.colors.map(color => `<span class="color-dot" style="background: ${product.colorHex[color]}" title="${color}"></span>`).join('')}
                        </div>
                    </div>
                    <a href="shop.html?id=${product.id}" class="product-arrow" aria-label="View product">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </a>
                </div>
            </div>
        </div>
    `).join('');

    attachHoverCycling();
    attachWishlistToggle();
}

function attachHoverCycling() {
    document.querySelectorAll('.product-card').forEach(card => {
        const img = card.querySelector('.product-img');
        const images = JSON.parse(card.dataset.images || '[]');
        if (!img || images.length < 2) return;
        let interval = null, index = 0;
        card.addEventListener('mouseenter', () => {
            index = 0;
            interval = setInterval(() => {
                index = (index + 1) % images.length;
                img.style.opacity = '0';
                setTimeout(() => { img.src = images[index]; img.style.opacity = '1'; }, 200);
            }, 1200);
        });
        card.addEventListener('mouseleave', () => {
            clearInterval(interval); index = 0;
            img.src = images[0]; img.style.opacity = '1';
        });
    });
}

function attachWishlistToggle() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); btn.classList.toggle('active'); });
    });
}