/* =========================================================
   RETRO POSHAK — Cart & Wishlist (localStorage) + Orders
   ========================================================= */

(function () {
  const CART_KEY = 'retroPoshakCart';
  const WISHLIST_KEY = 'retroPoshakWishlist';
  const COUPON_KEY = 'retroPoshakCoupon';

  function read(key, fallback) {
    try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; }
    catch (e) { return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  /* ---------- Cart ---------- */
  function getCart() { return read(CART_KEY, []); }
  function saveCart(cart) { write(CART_KEY, cart); updateCartUI(); }

  function addToCart(productId, size, color, qty = 1) {
    const cart = getCart();
    const existing = cart.find(i => i.id === productId && i.size === size && i.color === color);
    if (existing) existing.qty += qty;
    else cart.push({ id: productId, size, color, qty });
    saveCart(cart);
    showToast('Added to your memory.');
    animateCartIcon();
    return true;
  }
  function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
  }
  function updateQty(index, delta) {
    const cart = getCart();
    if (!cart[index]) return;
    cart[index].qty = Math.max(1, cart[index].qty + delta);
    saveCart(cart);
  }
  function clearCart() {
    saveCart([]);
    write(COUPON_KEY, null);
  }
  function getCartCount() { return getCart().reduce((s, i) => s + i.qty, 0); }

  /* ---------- Wishlist ---------- */
  function getWishlist() { return read(WISHLIST_KEY, []); }
  function saveWishlist(list) { write(WISHLIST_KEY, list); updateWishlistUI(); }
  function toggleWishlist(productId) {
    const list = getWishlist();
    const idx = list.indexOf(productId);
    if (idx > -1) { list.splice(idx, 1); saveWishlist(list); return false; }
    list.push(productId); saveWishlist(list);
    showToast('Saved to wishlist.');
    return true;
  }
  function isWishlisted(id) { return getWishlist().includes(id); }
  function getWishlistCount() { return getWishlist().length; }

  /* ---------- Coupons ---------- */
  const COUPONS = {
    'MEMORY10': { type: 'percent', value: 10, label: '10% off' },
    'RETRO20':  { type: 'percent', value: 20, label: '20% off' },
    'FIRST100': { type: 'flat', value: 100, label: '₹100 off' }
  };
  function applyCoupon(code) {
    const key = (code || '').toUpperCase().trim();
    if (!key) return { ok: false, msg: 'Enter a coupon code.' };
    if (!COUPONS[key]) return { ok: false, msg: 'Invalid coupon code.' };
    write(COUPON_KEY, key);
    return { ok: true, msg: `Coupon applied: ${COUPONS[key].label}` };
  }
  function getCoupon() { return read(COUPON_KEY, null); }
  function getCouponData() { const c = getCoupon(); return c ? COUPONS[c] : null; }
  function clearCoupon() { write(COUPON_KEY, null); }

  /* ---------- Totals ---------- */
  function getSubtotal() {
    return getCart().reduce((sum, item) => {
      const p = getProductById(item.id);
      return p ? sum + p.price * item.qty : sum;
    }, 0);
  }
  function getShipping() {
    const sub = getSubtotal();
    if (sub === 0) return 0;
    return sub >= 1999 ? 0 : 99;
  }
  function getDiscount() {
    const sub = getSubtotal();
    const c = getCouponData();
    if (!c || sub === 0) return 0;
    if (c.type === 'percent') return Math.round(sub * c.value / 100);
    if (c.type === 'flat') return Math.min(c.value, sub);
    return 0;
  }
  function getTotal() { return Math.max(0, getSubtotal() + getShipping() - getDiscount()); }

  /* ---------- UI sync ---------- */
  function updateCartUI() {
    const count = getCartCount();
    document.querySelectorAll('#cartCount').forEach(el => {
      el.textContent = count;
    });
    document.dispatchEvent(new CustomEvent('cart:updated'));
  }
  function updateWishlistUI() {
    const count = getWishlistCount();
    document.querySelectorAll('#wishlistCount').forEach(el => { el.textContent = count; });
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
      const id = Number(btn.dataset.id);
      btn.classList.toggle('active', isWishlisted(id));
    });
    document.dispatchEvent(new CustomEvent('wishlist:updated'));
  }
  function animateCartIcon() {
    document.querySelectorAll('.cart-icon').forEach(el => {
      el.classList.remove('bump');
      void el.offsetWidth;
      el.classList.add('bump');
      setTimeout(() => el.classList.remove('bump'), 600);
    });
  }

  /* ---------- Toast ---------- */
  let toastTimer = null;
  function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  }

  /* ---------- Expose ---------- */
  window.RetroCart = {
    getCart, addToCart, removeFromCart, updateQty, clearCart, getCartCount,
    getWishlist, toggleWishlist, isWishlisted, getWishlistCount,
    applyCoupon, getCoupon, getCouponData, clearCoupon,
    getSubtotal, getShipping, getDiscount, getTotal,
    showToast, updateCartUI, updateWishlistUI
  };

  document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    updateWishlistUI();
  });
})();