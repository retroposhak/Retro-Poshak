// ============================================
// CART PAGE
// ============================================
function renderCart() {
    const layout = document.getElementById('cartLayout');
    const empty = document.getElementById('cartEmpty');
    const itemsEl = document.getElementById('cartItems');
    const countEl = document.getElementById('cartItemsCount');
    const subtitle = document.getElementById('cartSubtitle');
    if (!itemsEl) return;

    if (cart.length === 0) {
        layout.style.display = 'none';
        empty.style.display = 'flex';
        subtitle.textContent = 'Your cart is waiting to be filled.';
        return;
    }

    layout.style.display = 'grid';
    empty.style.display = 'none';
    subtitle.textContent = `${getCartCount()} item${getCartCount() > 1 ? 's' : ''} ready for checkout.`;
    countEl.textContent = `${cart.length} item${cart.length > 1 ? 's' : ''}`;

    itemsEl.innerHTML = cart.map((item, i) => `
        <div class="cart-item" data-index="${i}">
            <a href="shop.html?id=${item.id}" class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </a>
            <div class="cart-item-info">
                <div class="cart-item-top">
                    <div>
                        <h3 class="cart-item-name">${item.name}</h3>
                        <p class="cart-item-meta">Size: <strong>${item.size}</strong> · Colour: <strong>${item.color}</strong></p>
                    </div>
                    <button class="cart-item-remove" data-index="${i}" aria-label="Remove">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
                <div class="cart-item-bottom">
                    <div class="qty-control">
                        <button class="qty-btn" data-action="dec" data-index="${i}">−</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn" data-action="inc" data-index="${i}">+</button>
                    </div>
                    <div class="cart-item-price">₹${(item.price * item.quantity).toLocaleString()}</div>
                </div>
            </div>
        </div>
    `).join('');

    updateSummary();
    attachCartHandlers();
}

function updateSummary() {
    const subtotal = getCartTotal();
    const shipping = subtotal >= 1499 ? 0 : (subtotal > 0 ? 79 : 0);
    const total = subtotal + shipping;

    document.getElementById('sumSubtotal').textContent = `₹${subtotal.toLocaleString()}`;
    document.getElementById('sumShipping').textContent = shipping === 0 ? 'FREE' : `₹${shipping}`;
    document.getElementById('sumTotal').textContent = `₹${total.toLocaleString()}`;

    const note = document.getElementById('shippingNote');
    if (subtotal > 0 && subtotal < 1499) {
        const diff = 1499 - subtotal;
        note.textContent = `Add ₹${diff.toLocaleString()} more for FREE shipping!`;
        note.style.display = 'block';
    } else if (subtotal >= 1499) {
        note.textContent = '🎉 You qualify for FREE shipping!';
        note.style.display = 'block';
    } else {
        note.style.display = 'none';
    }
}

function attachCartHandlers() {
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const i = parseInt(btn.dataset.index);
            const action = btn.dataset.action;
            const item = cart[i];
            if (action === 'inc') updateCartQuantity(i, item.quantity + 1);
            else if (action === 'dec' && item.quantity > 1) updateCartQuantity(i, item.quantity - 1);
            renderCart();
        });
    });

    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            const i = parseInt(btn.dataset.index);
            const card = btn.closest('.cart-item');
            card.style.transition = 'opacity 0.25s, transform 0.25s';
            card.style.opacity = '0';
            card.style.transform = 'translateX(30px)';
            setTimeout(() => { removeFromCart(i); renderCart(); }, 250);
        });
    });

    document.getElementById('clearCartBtn')?.addEventListener('click', () => {
        if (!confirm('Remove all items from cart?')) return;
        clearCart();
        renderCart();
    });

    document.getElementById('checkoutBtn')?.addEventListener('click', e => {
        if (cart.length === 0) {
            e.preventDefault();
            return;
        }
        if (!isLoggedIn()) {
            e.preventDefault();
            window.location.href = 'login.html?redirect=checkout.html';
        }
    });
}