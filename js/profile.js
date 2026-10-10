// ============================================
// PROFILE PAGE
// ============================================
function renderProfile() {
    const container = document.getElementById('profileContainer');
    if (!container) return;

    if (!isLoggedIn()) {
        window.location.href = 'login.html?redirect=profile.html';
        return;
    }

    const orders = getUserOrders();
    const initial = currentUser.name.charAt(0).toUpperCase();

    container.innerHTML = `
        <!-- Profile Header -->
        <div class="profile-header">
            <div class="profile-avatar">${initial}</div>
            <div class="profile-info">
                <span class="profile-eyebrow">MY ACCOUNT</span>
                <h1 class="profile-name">${currentUser.name}</h1>
                <p class="profile-email">${currentUser.email}</p>
                ${currentUser.phone ? `<p class="profile-phone">${currentUser.phone}</p>` : ''}
                <p class="profile-since">Member since ${new Date(currentUser.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
            </div>
            <button class="profile-logout-btn" id="profileLogout">Logout</button>
        </div>

        <!-- Tabs -->
        <div class="profile-tabs">
            <button class="profile-tab active" data-tab="orders">
                📦 My Orders <span class="tab-count">${orders.length}</span>
            </button>
            <button class="profile-tab" data-tab="details">
                👤 Account Details
            </button>
        </div>

        <!-- Tab Content -->
        <div class="profile-tab-content">
            <div class="tab-panel active" id="tab-orders">
                ${renderOrders(orders)}
            </div>
            <div class="tab-panel" id="tab-details">
                ${renderDetails()}
            </div>
        </div>
    `;

    attachProfileHandlers();
}

function renderOrders(orders) {
    if (orders.length === 0) {
        return `
            <div class="orders-empty">
                <div class="orders-empty-icon">📦</div>
                <h3>No orders yet</h3>
                <p>Your order history will appear here once you place your first order.</p>
                <a href="shop.html" class="orders-empty-cta">START SHOPPING</a>
            </div>
        `;
    }

    return `
        <div class="orders-list">
            ${orders.map(order => `
                <div class="order-card">
                    <div class="order-card-header">
                        <div>
                            <p class="order-id">Order #${order.orderId}</p>
                            <p class="order-date">Placed on ${new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <span class="order-status status-${order.status}">${order.status.toUpperCase()}</span>
                    </div>
                    <div class="order-items">
                        ${order.items.map(item => `
                            <div class="order-item">
                                <img src="${item.image}" alt="${item.name}">
                                <div class="order-item-info">
                                    <p class="order-item-name">${item.name}</p>
                                    <p class="order-item-meta">Size ${item.size} · ${item.color} · Qty ${item.quantity}</p>
                                </div>
                                <p class="order-item-price">₹${(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                        `).join('')}
                    </div>
                    <div class="order-card-footer">
                        <div class="order-shipping">
                            <p class="order-shipping-label">Shipped to:</p>
                            <p class="order-shipping-address">${order.shipping_address.name}, ${order.shipping_address.address}, ${order.shipping_address.city} - ${order.shipping_address.pincode}</p>
                        </div>
                        <div class="order-total-block">
                            <p class="order-total-label">Total Paid</p>
                            <p class="order-total">₹${order.total.toLocaleString()}</p>
                            <p class="order-payment">via ${order.payment_method}</p>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderDetails() {
    return `
        <div class="details-form-wrap">
            <h3 class="details-title">Account Details</h3>
            <form class="details-form" id="detailsForm">
                <div class="details-field">
                    <label>Full Name</label>
                    <input type="text" id="detName" value="${currentUser.name}" required>
                </div>
                <div class="details-field">
                    <label>Email</label>
                    <input type="email" id="detEmail" value="${currentUser.email}" disabled>
                    <small>Email cannot be changed.</small>
                </div>
                <div class="details-field">
                    <label>Phone</label>
                    <input type="tel" id="detPhone" value="${currentUser.phone || ''}" placeholder="+91 9XXXXXXXXX">
                </div>
                <button type="submit" class="details-save">SAVE CHANGES</button>
                <p class="details-msg" id="detailsMsg"></p>
            </form>
        </div>
    `;
}

function attachProfileHandlers() {
    // Tabs
    document.querySelectorAll('.profile-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
        });
    });

    // Logout
    document.getElementById('profileLogout')?.addEventListener('click', () => {
        logoutUser();
        window.location.href = 'index.html';
    });

    // Details form
    document.getElementById('detailsForm')?.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('detName').value.trim();
        const phone = document.getElementById('detPhone').value.trim();
        const msg = document.getElementById('detailsMsg');

        if (!name) { msg.textContent = 'Name is required.'; msg.style.color = '#b33a3a'; return; }

        updateCurrentUser({ name, phone });
        msg.textContent = '✓ Saved successfully!';
        msg.style.color = '#2c7a4a';
        setTimeout(() => msg.textContent = '', 2500);
    });

    // Support #orders hash for direct linking
    if (window.location.hash === '#orders') {
        document.querySelector('.profile-tab[data-tab="orders"]')?.click();
    }
}