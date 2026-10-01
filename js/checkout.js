/* =========================================================
   RETRO POSHAK — Checkout Page Logic (frontend prototype)
   Saves order to logged-in user's history. Connect a real
   gateway (Razorpay / Stripe) by replacing `placeOrder`.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('checkoutForm');
  if (!form) return;

  const itemsWrap = document.getElementById('checkoutItems');
  const subtotalEl = document.getElementById('coSubtotal');
  const shippingEl = document.getElementById('coShipping');
  const discountEl = document.getElementById('coDiscount');
  const discountRow = document.getElementById('coDiscountRow');
  const totalEl = document.getElementById('coTotal');
  const msgEl = document.getElementById('checkoutMsg');

  function inr(n) { return '₹' + Number(n).toLocaleString('en-IN'); }

  function renderSummary() {
    const cart = window.RetroCart.getCart();
    if (!cart.length) {
      itemsWrap.innerHTML = '<p style="color:var(--brown-soft);">Your cart is empty.</p>';
    } else {
      itemsWrap.innerHTML = cart.map(item => {
        const p = getProductById(item.id);
        if (!p) return '';
        return `
          <div class="checkout-item">
            <img src="${p.image}" alt="${p.name}" onerror="this.style.display='none'">
            <div>
              <div class="co-name">${p.name} × ${item.qty}</div>
              <div class="co-meta">Size ${item.size} · ${item.color}</div>
            </div>
            <div style="margin-left:auto;font-weight:600;">${inr(p.price * item.qty)}</div>
          </div>
        `;
      }).join('');
    }
    const sub = window.RetroCart.getSubtotal();
    const ship = window.RetroCart.getShipping();
    const disc = window.RetroCart.getDiscount();
    subtotalEl.textContent = inr(sub);
    shippingEl.textContent = ship === 0 ? 'Free' : inr(ship);
    totalEl.textContent = inr(window.RetroCart.getTotal());
    if (disc > 0) {
      discountRow.hidden = false;
      discountEl.textContent = '-' + inr(disc);
    } else {
      discountRow.hidden = true;
    }
  }

  renderSummary();
  document.addEventListener('cart:updated', renderSummary);

  function validate() {
    let ok = true;
    form.querySelectorAll('[required]').forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) { field.style.borderColor = 'var(--terracotta)'; ok = false; return; }
      if (field.type === 'email' && !/^\S+@\S+\.\S+$/.test(field.value)) { field.style.borderColor = 'var(--terracotta)'; ok = false; }
      if (field.name === 'phone' && !/^[0-9]{10}$/.test(field.value.trim())) { field.style.borderColor = 'var(--terracotta)'; ok = false; }
      if (field.name === 'pincode' && !/^[0-9]{6}$/.test(field.value.trim())) { field.style.borderColor = 'var(--terracotta)'; ok = false; }
    });
    return ok;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    msgEl.textContent = '';
    msgEl.className = 'form-msg';

    if (!window.RetroCart.getCart().length) {
      msgEl.textContent = 'Your cart is empty — add a memory first.';
      msgEl.className = 'form-msg error';
      return;
    }
    if (!validate()) {
      msgEl.textContent = 'Please check the highlighted fields.';
      msgEl.className = 'form-msg error';
      return;
    }

    const payment = form.querySelector('input[name="payment"]:checked')?.value || 'upi';
    const orderId = 'RP-' + Date.now().toString().slice(-8);
    const total = window.RetroCart.getTotal();
    const items = window.RetroCart.getCart().map(i => {
      const p = getProductById(i.id);
      return { id: i.id, name: p ? p.name : '', size: i.size, color: i.color, qty: i.qty, price: p ? p.price : 0 };
    });

    // ---- FRONTEND-ONLY PLACEHOLDER ----
    // Replace this block with Razorpay/Stripe integration.
    const user = window.RetroAuth?.currentUser();
    if (user) {
      window.RetroAuth.saveOrder({ id: orderId, at: Date.now(), total, payment, items, userId: user.id });
    }

    msgEl.textContent = `Order ${orderId} placed (prototype). Payment: ${payment.toUpperCase()}. Total: ${inr(total)}.`;
    msgEl.className = 'form-msg success';

    window.RetroCart.clearCart();
    renderSummary();
    form.reset();

    window.RetroCart?.showToast('Order placed — a memory is on its way.');
  });
});