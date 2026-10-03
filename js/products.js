/* =========================================================
   RETRO POSHAK — Product Data
   Add/edit products here. No HTML changes required.

   FABRIC INFORMATION (rendered on every product page):
     Fabric            :- 100% Cotton Terry
     GSM               :- 240 GSM
     Fit               :- Oversized / Drop Shoulder
     Product Details   :- Premium heavyweight feel
                          Oversized silhouette
                          Drop shoulder
                          High-quality print
                          Comfortable everyday fit

   VARIANT STOCK (from production sheet):
     Each product carries a `sizeStock` map keyed by size,
     broken down by colour. Total per product = MOQ (30).

   STORY COLLECTIONS:
     Each product has BOTH:
       - `collection`  : primary story (backward compat)
       - `collections` : all stories it belongs to
     Shop filter uses `collections` when present.

   SHARED HELPERS:
     This file also exposes global helpers used by both
     shop.html and product.html:
       - getCollections(p)
       - isProductSoldOut(p)
       - formatPrice(n)
       - renderProductCard(p, i)
       - bindProductCardEvents(root)
   ========================================================= */

const PRODUCTS = [
  /* =======================================================
     ID 1 — CYCLE KA SAFAR (Design 1)
     Colours: Beige, Navy Blue (Acid Wash), Black
     Sizes:   M, L, XL  (S and XXL are 0)
     Stories: School Days, Gully Games, Dosti
     ======================================================= */
  {
    id: 1,
    name: "Cycle ka Safar",
    subtitle: "For every game that had a starting line.",
    category: "oversized-tshirt",
    collection: "school-days",
    collections: ["school-days", "gully-games", "dosti"],
    price: 1299,
    compareAt: 1699,
    colors: ["Beige", "Navy Blue", "Black"],
    colorHex: { "Beige": "#e6d8c3", "Navy Blue": "#3b4a63", "Black": "#262220" },
    sizes: ["S", "M", "L", "XL", "XXL"],
    /* Per-colour, per-size stock */
    sizeStock: {
      "Beige":       { S: 0, M: 4, L: 4, XL: 2, XXL: 0 },
      "Navy Blue":   { S: 0, M: 4, L: 4, XL: 2, XXL: 0 },
      "Black":       { S: 0, M: 4, L: 4, XL: 2, XXL: 0 }
    },
    image: "assets/images/gully-champion.jpg",
    image2: "assets/images/gully-champion-2.jpg",
    description: "Oversized heavyweight tee with a nostalgic gully-cricket graphic.",
    story: "Some memories don't need photographs. They live somewhere between the starting line, dusty playgrounds, school bells and the friends who made ordinary days special.",

    fabric: "100% Cotton Terry",
    gsm: 240,
    fit: "Oversized / Drop Shoulder",
    fabricInfo: {
      fabric: "100% Cotton Terry",
      gsm: "240 GSM",
      fit: "Oversized / Drop Shoulder",
      details: [
        "Premium heavyweight feel",
        "Oversized silhouette",
        "Drop shoulder",
        "High-quality print",
        "Comfortable everyday fit"
      ]
    },

    benefits: [
      { icon: "🧵", label: "240 GSM" },
      { icon: "🌱", label: "100% Cotton" },
      { icon: "👕", label: "Oversized Fit" },
      { icon: "✨", label: "Premium Print" }
    ],
    tags: ["retro", "sports", "school", "nostalgia", "gully", "cricket", "cycle", "bicycle", "school-bag"],
    badge: "bestseller",
    featured: true,
    inStock: true,
    createdAt: "2025-06-01"
  },

  /* =======================================================
     ID 2 — KHELO CARDS (Design 2)
     Colours: Beige, Navy Blue (Acid Wash), Black, Charcoal Grey (Acid Wash)
     Sizes:   M, L, XL  (S and XXL are 0)
     Stories: Gully Games, Dosti
     ======================================================= */
  {
    id: 2,
    name: "Khelo Cards",
    subtitle: "The rivalry that made us best friends.",
    category: "oversized-tshirt",
    collection: "gully-games",
    collections: ["gully-games", "dosti"],
    price: 1299,
    compareAt: 1699,
    colors: ["Beige", "Navy Blue", "Black", "Charcoal Grey"],
    colorHex: {
      "Beige": "#e6d8c3",
      "Navy Blue": "#3b4a63",
      "Black": "#262220",
      "Charcoal Grey": "#4a4643"
    },
    sizes: ["S", "M", "L", "XL", "XXL"],
    sizeStock: {
      "Beige":         { S: 0, M: 3, L: 3, XL: 1, XXL: 0 },
      "Navy Blue":     { S: 0, M: 4, L: 3, XL: 1, XXL: 0 },
      "Black":         { S: 0, M: 3, L: 2, XL: 1, XXL: 0 },
      "Charcoal Grey": { S: 0, M: 4, L: 3, XL: 2, XXL: 0 }
    },
    image: "assets/images/mohalla-match.jpg",
    image2: "assets/images/mohalla-match-2.jpg",
    description: "For every mohalla that turned into a stadium.",
    story: "Every street had its own World Cup. Every evening had a new final. The only prize that mattered was bragging rights until tomorrow.",

    fabric: "100% Cotton Terry",
    gsm: 240,
    fit: "Oversized / Drop Shoulder",
    fabricInfo: {
      fabric: "100% Cotton Terry",
      gsm: "240 GSM",
      fit: "Oversized / Drop Shoulder",
      details: [
        "Premium heavyweight feel",
        "Oversized silhouette",
        "Drop shoulder",
        "High-quality print",
        "Comfortable everyday fit"
      ]
    },

    benefits: [
      { icon: "🧵", label: "240 GSM" },
      { icon: "🌱", label: "100% Cotton" },
      { icon: "👕", label: "Oversized Fit" },
      { icon: "✨", label: "Premium Print" }
    ],
    tags: ["retro", "sports", "mohalla", "nostalgia", "friends", "cards", "dosti", "terrace"],
    badge: "new",
    featured: true,
    inStock: true,
    createdAt: "2025-06-20"
  },

  /* =======================================================
     ID 3 — CHAI KI TAPRI (Design 3)
     Colours: Beige, Navy Blue (Acid Wash), Black, Charcoal Grey (Acid Wash)
     Sizes:   M, L, XL  (S and XXL are 0)
     Stories: Sunday Memories, Dosti, Desi Nostalgia
     ======================================================= */
  {
    id: 3,
    name: "Chai ki Tapri",
    subtitle: "Conversations that fixed everything.",
    category: "oversized-tshirt",
    collection: "sunday-memories",
    collections: ["sunday-memories", "dosti", "desi-nostalgia"],
    price: 1399,
    compareAt: 1799,
    colors: ["Beige", "Navy Blue", "Black", "Charcoal Grey"],
    colorHex: {
      "Beige": "#e6d8c3",
      "Navy Blue": "#3b4a63",
      "Black": "#262220",
      "Charcoal Grey": "#4a4643"
    },
    sizes: ["S", "M", "L", "XL", "XXL"],
    sizeStock: {
      "Beige":         { S: 0, M: 5, L: 3, XL: 2, XXL: 0 },
      "Navy Blue":     { S: 0, M: 2, L: 1, XL: 0, XXL: 0 },
      "Black":         { S: 0, M: 5, L: 3, XL: 1, XXL: 0 },
      "Charcoal Grey": { S: 0, M: 4, L: 3, XL: 1, XXL: 0 }
    },
    image: "assets/images/chai-baatein.jpg",
    image2: "assets/images/chai-baatein-2.jpg",
    description: "A relaxed-fit tee with a nostalgic cutting-chai graphic.",
    story: "Cutting chai, gossip, and the corner tapri that knew everyone. Every sip carried a story — and every story had a listener.",

    fabric: "100% Cotton Terry",
    gsm: 240,
    fit: "Oversized / Drop Shoulder",
    fabricInfo: {
      fabric: "100% Cotton Terry",
      gsm: "240 GSM",
      fit: "Oversized / Drop Shoulder",
      details: [
        "Premium heavyweight feel",
        "Oversized silhouette",
        "Drop shoulder",
        "High-quality print",
        "Comfortable everyday fit"
      ]
    },

    benefits: [
      { icon: "🧵", label: "240 GSM" },
      { icon: "🌱", label: "100% Cotton" },
      { icon: "👕", label: "Oversized Fit" },
      { icon: "✨", label: "Premium Print" }
    ],
    tags: ["retro", "chai", "street", "nostalgia", "conversation", "radio", "tapri", "dosti", "sunday"],
    badge: "bestseller",
    featured: true,
    inStock: true,
    createdAt: "2025-05-05"
  },

  /* =======================================================
     ID 4 — BARF KA GOLA (Design 4)
     Colours: Beige, Navy Blue (Acid Wash), Black
     Sizes:   M, L, XL  (S and XXL are 0)
     Stories: Gully Games, Bachpan
     ======================================================= */
  {
    id: 4,
    name: "Barf Ka Gola",
    subtitle: "Filed from the field of every summer evening.",
    category: "oversized-tshirt",
    collection: "gully-games",
    collections: ["gully-games", "bachpan"],
    price: 1299,
    compareAt: 1699,
    colors: ["Beige", "Navy Blue", "Black"],
    colorHex: { "Beige": "#e6d8c3", "Navy Blue": "#3b4a63", "Black": "#262220" },
    sizes: ["S", "M", "L", "XL", "XXL"],
    sizeStock: {
      "Beige":     { S: 0, M: 3, L: 2, XL: 1, XXL: 0 },
      "Navy Blue": { S: 0, M: 5, L: 5, XL: 2, XXL: 0 },
      "Black":     { S: 0, M: 5, L: 5, XL: 2, XXL: 0 }
    },
    image: "assets/images/ground-report.jpg",
    image2: "assets/images/ground-report-2.jpg",
    description: "A tribute to the local grounds that hosted our greatest matches.",
    story: "One wicket. Ten runs. A whole summer of glory. The ground didn't care who won — it just kept the score in our memory.",

    fabric: "100% Cotton Terry",
    gsm: 240,
    fit: "Oversized / Drop Shoulder",
    fabricInfo: {
      fabric: "100% Cotton Terry",
      gsm: "240 GSM",
      fit: "Oversized / Drop Shoulder",
      details: [
        "Premium heavyweight feel",
        "Oversized silhouette",
        "Drop shoulder",
        "High-quality print",
        "Comfortable everyday fit"
      ]
    },

    benefits: [
      { icon: "🧵", label: "240 GSM" },
      { icon: "🌱", label: "100% Cotton" },
      { icon: "👕", label: "Oversized Fit" },
      { icon: "✨", label: "Premium Print" }
    ],
    tags: ["retro", "sports", "cricket", "gully", "nostalgia", "gola", "summer", "bachpan"],
    badge: null,
    featured: true,
    inStock: true,
    createdAt: "2025-03-25"
  }
];

/* =========================================================
   Shop by Story collections
   ========================================================= */
const STORY_COLLECTIONS = [
  {
    id: "school-days",
    number: "01",
    title: "School Days",
    hindi: "स्कूल के दिन",
    description: "Last benches, first bells, and the friends who made ordinary days feel infinite.",
    link: "shop.html?collection=school-days",
    productIds: [1]
  },
  {
    id: "gully-games",
    number: "02",
    title: "Gully Games",
    hindi: "गली के खेल",
    description: "Cricket, kanche, and the evening light that told us when to go home.",
    link: "shop.html?collection=gully-games",
    productIds: [1, 2, 4]
  },
  {
    id: "bachpan",
    number: "03",
    title: "Bachpan",
    hindi: "बचपन",
    description: "A place we grew up in, and never fully left.",
    link: "shop.html?collection=bachpan",
    productIds: [4]
  },
  {
    id: "dosti",
    number: "04",
    title: "Dosti",
    hindi: "दोस्ती",
    description: "For the friends who became family without ever saying so.",
    link: "shop.html?collection=dosti",
    productIds: [1, 2, 3]
  },
  {
    id: "sunday-memories",
    number: "05",
    title: "Sunday Memories",
    hindi: "रविवार",
    description: "Chai, radio, and the slow mornings we still chase.",
    link: "shop.html?collection=sunday-memories",
    productIds: [3]
  },
  {
    id: "desi-nostalgia",
    number: "06",
    title: "Desi Nostalgia",
    hindi: "देसी यादें",
    description: "Everything that smelled like home before we knew what home meant.",
    link: "shop.html?collection=desi-nostalgia",
    productIds: [3]
  }
];

/* =========================================================
   Memory Archive — homepage scrapbook cards
   ========================================================= */
const MEMORY_ARCHIVE = [
  {
    icon: "🚲",
    title: "Bicycle",
    story: "School mornings. Dusty roads. A ride home with your favourite person.",
    link: "shop.html?q=cycle",
    productId: 1
  },
  {
    icon: "🍧",
    title: "Gola Cart",
    story: "Summer afternoons, sticky fingers, and a race to finish first.",
    link: "shop.html?q=gola",
    productId: 4
  },
  {
    icon: "🃏",
    title: "Playing Cards",
    story: "Terrace evenings. A deck of cards. Friends who never left.",
    link: "shop.html?q=cards",
    productId: 2
  },
  {
    icon: "📼",
    title: "Cassette",
    story: "Rewind. Play. The songs that still live in your head.",
    link: "shop.html?collection=sunday-memories",
    productId: 3
  },
  {
    icon: "🎒",
    title: "School Bag",
    story: "Heavier than it looked. Lighter than the memories inside.",
    link: "shop.html?collection=school-days",
    productId: 1
  },
  {
    icon: "🏏",
    title: "Cricket Bat",
    story: "One wicket. Ten runs. A whole summer of glory.",
    link: "shop.html?collection=gully-games",
    productId: 2
  },
  {
    icon: "📻",
    title: "Old Radio",
    story: "Sunday mornings, old Hindi songs, and a voice you trusted.",
    link: "shop.html?q=radio",
    productId: 3
  },
  {
    icon: "🥛",
    title: "Summer Glass",
    story: "Cold water, a steel glass, and the sound of the fan.",
    link: "shop.html?collection=sunday-memories",
    productId: 3
  }
];

/* =========================================================
   Lookbook — editorial shots mapped to products
   ========================================================= */
const LOOKBOOK = [
  { image: "assets/images/look-1.jpg", productId: 4, location: "Old Delhi" },
  { image: "assets/images/look-2.jpg", productId: 3, location: "Mumbai" },
  { image: "assets/images/look-3.jpg", productId: 1, location: "Pune" },
  { image: "assets/images/look-4.jpg", productId: 2, location: "Studio" },
  { image: "assets/images/look-5.jpg", productId: 2, location: "Terrace" }
];

/* =========================================================
   CORE HELPERS
   ========================================================= */
function getProductById(id) {
  return PRODUCTS.find(p => p.id === Number(id));
}

function getFeaturedProducts(limit) {
  const featured = PRODUCTS.filter(p => p.featured);
  return limit ? featured.slice(0, limit) : featured;
}

function getProductsByCollection(collectionId) {
  if (!collectionId || collectionId === 'all') return PRODUCTS;
  return PRODUCTS.filter(p => {
    if (Array.isArray(p.collections) && p.collections.length) {
      return p.collections.includes(collectionId);
    }
    return p.collection === collectionId;
  });
}

function searchProducts(query) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    (p.collection || '').toLowerCase().includes(q) ||
    (Array.isArray(p.collections) && p.collections.some(c => c.toLowerCase().includes(q))) ||
    p.description.toLowerCase().includes(q) ||
    (p.story || '').toLowerCase().includes(q) ||
    p.tags.some(t => t.toLowerCase().includes(q))
  );
}

/* =========================================================
   VARIANT STOCK
   ========================================================= */
function getVariantStock(productId, color, size) {
  const product = getProductById(productId);
  if (!product || !product.sizeStock) return 0;
  const byColor = product.sizeStock[color];
  if (!byColor) return 0;
  return byColor[size] || 0;
}

function isVariantInStock(productId, color, size) {
  return getVariantStock(productId, color, size) > 0;
}

/* =========================================================
   STORY & MEMORY LOOKUPS
   ========================================================= */
function getStoryProducts(collectionId) {
  return getProductsByCollection(collectionId);
}

function getStoryById(collectionId) {
  return STORY_COLLECTIONS.find(c => c.id === collectionId) || null;
}

function getProductStories(productId) {
  const product = getProductById(productId);
  if (!product) return [];
  if (Array.isArray(product.collections) && product.collections.length) {
    return product.collections
      .map(id => getStoryById(id))
      .filter(Boolean);
  }
  const primary = getStoryById(product.collection);
  return primary ? [primary] : [];
}

function getMemoryCardsForProduct(productId) {
  return MEMORY_ARCHIVE.filter(m => m.productId === Number(productId));
}

function getFeaturedCollectionProducts() {
  return PRODUCTS.filter(p => p.featured);
}

function getLookbookItems() {
  return LOOKBOOK.map(item => {
    const product = getProductById(item.productId);
    return {
      ...item,
      name: product ? product.name : "Retro Poshak",
      caption: product ? `${product.name} · ${item.location}` : item.location,
      link: product ? `product.html?id=${product.id}` : "shop.html"
    };
  });
}

/* =========================================================
   SHARED — Product card renderer
   Used by shop.html grid AND product.html related grid.
   ========================================================= */

/* Normalise collection(s) into an array */
function getCollections(p) {
  return Array.isArray(p.collections) && p.collections.length
    ? p.collections
    : [p.collection];
}

/* All sizes across all colours are 0 */
function isProductSoldOut(p) {
  if (!p.sizeStock) return !p.inStock;
  return Object.values(p.sizeStock).every(sizes =>
    Object.values(sizes).every(n => n === 0)
  );
}

/* Consistent currency formatting */
function formatPrice(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

function renderProductCard(p, i = 0) {
  const soldOut = isProductSoldOut(p);
  const save = (p.compareAt && p.compareAt > p.price) ? (p.compareAt - p.price) : 0;
  const index = String(i + 1).padStart(2, '0');

  let badgeHTML = '';
  if (p.badge === 'bestseller') badgeHTML = `<span class="product-badge">Bestseller</span>`;
  else if (p.badge === 'new')  badgeHTML = `<span class="product-badge badge-new">New</span>`;
  else if (save > 0)            badgeHTML = `<span class="product-badge badge-sale">Sale</span>`;

  const secondImg = p.image2
    ? `<img src="${p.image2}" alt="" aria-hidden="true" loading="lazy">`
    : '';

  const swatches = p.colors.map(c => {
    const hex = (p.colorHex && p.colorHex[c]) || '#ccc';
    return `<span class="swatch" style="background:${hex}" title="${c}"></span>`;
  }).join('');

  const compareHTML = p.compareAt && p.compareAt > p.price
    ? `<span class="product-compare">${formatPrice(p.compareAt)}</span>` : '';
  const saveHTML = save > 0
    ? `<span class="product-save">Save ${formatPrice(save)}</span>` : '';

  return `
    <article class="product-card${soldOut ? ' is-sold-out' : ''}" data-id="${p.id}">
      <span class="product-index">${index}</span>
      ${badgeHTML}
      <button class="wishlist-btn" type="button" aria-label="Add ${p.name} to wishlist" data-id="${p.id}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>
        </svg>
      </button>

      <a href="product.html?id=${p.id}" class="product-media" aria-label="View ${p.name}">
        <img src="${p.image}" alt="${p.name} — ${p.subtitle || ''}" loading="lazy">
        ${secondImg}
      </a>

      <div class="product-info">
        <h3 class="product-name">
          <a href="product.html?id=${p.id}">${p.name}</a>
        </h3>
        <p class="product-desc">${p.subtitle || p.description}</p>

        <div class="product-price-row">
          <span class="product-price">${formatPrice(p.price)}</span>
          ${compareHTML}
          ${saveHTML}
        </div>

        <div class="product-swatches" aria-label="Available colours">
          ${swatches}
        </div>

        <button class="add-cart-btn" type="button" data-id="${p.id}" ${soldOut ? 'disabled' : ''}>
          ${soldOut ? 'Sold Out' : 'Add to Memories'}
        </button>
      </div>
    </article>`;
}

function bindProductCardEvents(root = document) {
  const WISHLIST_KEY = 'retroPoshakWishlist';
  const readWishlist = () => {
    try { return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]'); }
    catch { return []; }
  };
  const writeWishlist = (arr) => {
    try { localStorage.setItem(WISHLIST_KEY, JSON.stringify(arr)); } catch { }
  };

  const wishlist = new Set(readWishlist());

  root.querySelectorAll('.wishlist-btn').forEach(btn => {
    const id = Number(btn.dataset.id);
    if (wishlist.has(id)) btn.classList.add('is-active');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const list = new Set(readWishlist());
      if (list.has(id)) { list.delete(id); btn.classList.remove('is-active'); }
      else              { list.add(id);    btn.classList.add('is-active'); }
      writeWishlist([...list]);
      const count = document.getElementById('wishlistCount');
      if (count) count.textContent = list.size;
    });
  });

  root.querySelectorAll('.add-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      const product = getProductById(id);
      if (!product) return;

      if (window.Cart && typeof window.Cart.add === 'function') {
        try { window.Cart.add(id, product.colors[0], product.sizes[2], 1); }
        catch (err) { console.warn('Cart.add failed:', err); }
      } else if (window.RetroCart && typeof window.RetroCart.addToCart === 'function') {
        try { window.RetroCart.addToCart(id, product.sizes[2], product.colors[0], 1); }
        catch (err) { console.warn('RetroCart.addToCart failed:', err); }
      } else {
        const toast = document.getElementById('toast');
        if (toast) {
          toast.textContent = `${product.name} added to your memories.`;
          toast.classList.add('show');
          setTimeout(() => toast.classList.remove('show'), 2400);
        }
      }
    });
  });
}