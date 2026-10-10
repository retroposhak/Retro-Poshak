let checkoutTotals = { subtotal: 0, shipping: 0, discount: 0, total: 0 };

function initCheckout() {
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    if (!isLoggedIn()) {
        window.location.href = 'login.html?redirect=checkout.html';
        return;
    }

    // Pre-fill user info
    document.getElementById('coName').value = currentUser.name || '';
    document.getElementById('coEmail').value = currentUser.email || '';
    document.getElementById('coPhone').value = currentUser.phone || '';

    renderCheckoutSummary();

    // Payment change → update discount
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', renderCheckoutSummary);
    });

    document.getElementById('checkoutForm').addEventListener('submit', e => {
        e.preventDefault();
        placeOrderHandler();
    });
}

function renderCheckoutSummary() {
    const itemsEl = document.getElementById('checkoutSummaryItems');
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'COD';

    itemsEl.innerHTML = cart.map(item => `
        <div class="checkout-summary-item">
            <img src="${item.image}" alt="${item.name}">
            <div>
                <p class="checkout-item-name">${item.name}</p>
                <p class="checkout-item-meta">${item.size} · ${item.color} · Qty ${item.quantity}</p>
            </div>
            <p class="checkout-item-price">₹${(item.price * item.quantity).toLocaleString()}</p>
        </div>
    `).join('');

    const subtotal = getCartTotal();
    const shipping = subtotal >= 1499 ? 0 : 79;
    const discount = paymentMethod === 'Prepaid' ? Math.round(subtotal * 0.05) : 0;
    const total = subtotal + shipping - discount;

    checkoutTotals = { subtotal, shipping, discount, total };

    document.getElementById('coSubtotal').textContent = `₹${subtotal.toLocaleString()}`;
    document.getElementById('coShipping').textContent = shipping === 0 ? 'FREE' : `₹${shipping}`;
    document.getElementById('coDiscount').textContent = discount > 0 ? `-₹${discount.toLocaleString()}` : '₹0';
    document.getElementById('coTotal').textContent = `₹${total.toLocaleString()}`;
}

function placeOrderHandler() {
    const btn = document.getElementById('placeOrderBtn');
    const data = {
        name: document.getElementById('coName').value.trim(),
        email: document.getElementById('coEmail').value.trim(),
        phone: document.getElementById('coPhone').value.trim(),
        address: document.getElementById('coAddress').value.trim(),
        city: document.getElementById('coCity').value.trim(),
        state: document.getElementById('coState').value.trim(),
        pincode: document.getElementById('coPincode').value.trim(),
        payment_method: document.querySelector('input[name="payment"]:checked').value
    };

    // Validation
    for (const [key, val] of Object.entries(data)) {
        if (!val) {
            alert(`Please fill in all fields.`);
            return;
        }
    }

    btn.textContent = 'PLACING ORDER...';
    btn.disabled = true;

    setTimeout(() => {
        const result = placeOrder(data);
        if (result.success) {
            sessionStorage.setItem('lastOrderId', result.order.orderId);
            window.location.href = 'order-success.html';
        } else {
            alert('Something went wrong. Please try again.');
            btn.textContent = 'PLACE ORDER';
            btn.disabled = false;
        }
    }, 800);
}