// ── Auth ──────────────────────────────────────
export const ROLES = Object.freeze({
  CUSTOMER: 'customer',
  ADMIN: 'admin',
});

// ── Orders ────────────────────────────────────
export const ORDER_STATUS = Object.freeze({
  PENDING: 'pending',       // payment not yet confirmed
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
});

export const PAYMENT_STATUS = Object.freeze({
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
});

export const PAYMENT_METHOD = Object.freeze({
  COD: 'COD',
  PREPAID: 'Prepaid', // Razorpay
});

// ── Products ──────────────────────────────────
export const SIZES = Object.freeze(['XS', 'S', 'M', 'L', 'XL', 'XXL']);

// Colour hex values, exactly as in your js/data.js
export const COLOR_HEX = Object.freeze({
  Beige: '#e6d8c3',
  'Navy Blue': '#3b4a63',
  Black: '#262220',
  'Charcoal Grey': '#4a4643',
});

// ── Pricing rules (mirrors your cart.js / checkout.js) ──
export const PRICING = Object.freeze({
  FREE_SHIPPING_THRESHOLD: 1499, // ₹
  FLAT_SHIPPING_FEE: 79,         // ₹
  PREPAID_DISCOUNT_RATE: 0.05,   // 5%
});

// ── Collections (the 8 "Shop by Story" slugs) ──
export const COLLECTIONS = Object.freeze([
  'gola-wale-ki-gali',
  'school-ka-vo-safar',
  'doston-ki-baithak',
  'ek-chai-hazaar-kisse',
  'woh-lambi-calls',
  'gali-cricket',
  'ready-set-bachpan',
  'woh-gaane-woh-din',
]);

// ── Blog categories (from js/blog.js) ─────────
export const BLOG_CATEGORIES = Object.freeze([
  { slug: 'childhood', label: 'Childhood' },
  { slug: 'indian-streets', label: 'Indian Streets' },
  { slug: 'people-places', label: 'People & Places' },
  { slug: 'vintage-things', label: 'Vintage Things' },
  { slug: 'life-lessons', label: 'Life Lessons' },
]);