// ============================================
// WISHLIST STATE
// ============================================
let wishlist = JSON.parse(localStorage.getItem('retroPoshakWishlist') || '[]');

function saveWishlist() {
    localStorage.setItem('retroPoshakWishlist', JSON.stringify(wishlist));
}

function isInWishlist(productId) {
    return wishlist.includes(parseInt(productId));
}

function toggleWishlist(productId) {
    const id = parseInt(productId);
    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(x => x !== id);
        saveWishlist();
        return false;
    } else {
        wishlist.push(id);
        saveWishlist();
        return true;
    }
}

function updateWishlistBadge() {
    const badges = document.querySelectorAll('.wishlist-count');
    badges.forEach(badge => {
        const count = wishlist.length;
        badge.textContent = count;
        if (count > 0) {
            badge.classList.add('visible');
            badge.classList.add('pulse');
            setTimeout(() => badge.classList.remove('pulse'), 500);
        } else {
            badge.classList.remove('visible');
        }
    });
    const mobileCount = document.querySelector('.mobile-wishlist-count');
    if (mobileCount) mobileCount.textContent = wishlist.length > 0 ? wishlist.length : '';
}

function syncWishlistButtons() {
    document.querySelectorAll('[data-wishlist-id]').forEach(btn => {
        const id = btn.dataset.wishlistId;
        const svg = btn.querySelector('svg');
        if (isInWishlist(id)) {
            btn.classList.add('active');
            if (svg) svg.setAttribute('fill', '#b33a3a');
        } else {
            btn.classList.remove('active');
            if (svg) svg.setAttribute('fill', 'none');
        }
    });
}

// ============================================
// CART STATE
// ============================================
let cart = JSON.parse(localStorage.getItem('retroPoshakCart') || '[]');

function saveCart() {
    localStorage.setItem('retroPoshakCart', JSON.stringify(cart));
}

function addToCart(productId, quantity = 1, size = 'M', color = null) {
    const id = parseInt(productId);
    const product = products.find(p => p.id === id);
    if (!product) return false;

    const chosenColor = color || product.colors[0];
    const existingIndex = cart.findIndex(item =>
        item.id === id && item.size === size && item.color === chosenColor
    );

    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({
            id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            size,
            color: chosenColor,
            quantity
        });
    }

    saveCart();
    updateCartBadge();
    return true;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartBadge();
}

function updateCartQuantity(index, quantity) {
    if (quantity < 1) return;
    cart[index].quantity = quantity;
    saveCart();
    updateCartBadge();
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function getCartCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartBadge();
}

function updateCartBadge() {
    const badges = document.querySelectorAll('.cart-count');
    const total = getCartCount();
    badges.forEach(badge => {
        badge.textContent = total;
        badge.style.display = total > 0 ? 'flex' : 'none';
    });
}

// ============================================
// AUTH STATE (users + session)
// ============================================
let users = JSON.parse(localStorage.getItem('retroPoshakUsers') || '[]');
let currentUser = JSON.parse(localStorage.getItem('retroPoshakCurrentUser') || 'null');

function saveUsers() {
    localStorage.setItem('retroPoshakUsers', JSON.stringify(users));
}

function saveCurrentUser() {
    if (currentUser) {
        localStorage.setItem('retroPoshakCurrentUser', JSON.stringify(currentUser));
    } else {
        localStorage.removeItem('retroPoshakCurrentUser');
    }
}

function signupUser(name, email, password, phone = '') {
    const normalizedEmail = email.toLowerCase().trim();
    if (users.find(u => u.email === normalizedEmail)) {
        return { success: false, error: 'Email already registered' };
    }
    const user = {
        id: Date.now(),
        name: name.trim(),
        email: normalizedEmail,
        password: password, // Demo only — never store plaintext in production!
        phone,
        createdAt: new Date().toISOString(),
        orders: []
    };
    users.push(user);
    saveUsers();
    currentUser = user;
    saveCurrentUser();
    return { success: true, user };
}

function loginUser(email, password) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = users.find(u => u.email === normalizedEmail && u.password === password);
    if (!user) return { success: false, error: 'Invalid email or password' };
    currentUser = user;
    saveCurrentUser();
    return { success: true, user };
}

function logoutUser() {
    currentUser = null;
    saveCurrentUser();
}

function isLoggedIn() {
    return currentUser !== null;
}

function updateCurrentUser(updates) {
    if (!currentUser) return;
    const idx = users.findIndex(u => u.id === currentUser.id);
    if (idx > -1) {
        users[idx] = { ...users[idx], ...updates };
        currentUser = users[idx];
        saveUsers();
        saveCurrentUser();
    }
}

// ============================================
// ORDERS
// ============================================
function placeOrder(orderData) {
    if (!currentUser) return { success: false, error: 'Not logged in' };

    const order = {
        orderId: 'RP' + Date.now().toString().slice(-8),
        date: new Date().toISOString(),
        status: 'confirmed',
        items: [...cart],
        subtotal: getCartTotal(),
        shipping: getCartTotal() >= 1499 ? 0 : 79,
        discount: 0,
        total: 0,
        shipping_address: orderData,
        payment_method: orderData.payment_method || 'COD',
    };
    order.total = order.subtotal + order.shipping - order.discount;

    // Save to current user
    const idx = users.findIndex(u => u.id === currentUser.id);
    if (idx > -1) {
        if (!users[idx].orders) users[idx].orders = [];
        users[idx].orders.unshift(order);
        currentUser = users[idx];
        saveUsers();
        saveCurrentUser();
    }

    clearCart();
    return { success: true, order };
}

function getUserOrders() {
    if (!currentUser) return [];
    return currentUser.orders || [];
}

// ============================================
// PRODUCTS DATA
// ============================================
const products = [
    {
        id: 1,
        name: "Cycle ka Safar",
        subtitle: "For every game that had a starting line.",
        price: 1299,
        compareAt: 1699,
        colors: ["Beige", "Navy Blue", "Black"],
        colorHex: { "Beige": "#e6d8c3", "Navy Blue": "#3b4a63", "Black": "#262220" },
        categories: ["ready-set-bachpan", "school-ka-vo-safar", "doston-ki-baithak", "gali-cricket"],
        images: [
            "assets/images/products/Cycle ka Safar/Website_Shop/1.0.png",
            "assets/images/products/Cycle ka Safar/Website_Shop/1.png",
            "assets/images/products/Cycle ka Safar/Website_Shop/2.0.png",
            "assets/images/products/Cycle ka Safar/Website_Shop/2.png",
            "assets/images/products/Cycle ka Safar/Website_Shop/3.0.png",
            "assets/images/products/Cycle ka Safar/Website_Shop/3.png"
        ],
        image: "assets/images/products/Cycle ka Safar/Website_Shop/1.0.png",
        description: "Oversized heavyweight tee with a nostalgic gully-cricket graphic."
    },
    {
        id: 2,
        name: "Khelo Cards",
        subtitle: "The rivalry that made us best friends.",
        price: 1299,
        compareAt: 1699,
        colors: ["Beige", "Navy Blue", "Black", "Charcoal Grey"],
        colorHex: { "Beige": "#e6d8c3", "Navy Blue": "#3b4a63", "Black": "#262220", "Charcoal Grey": "#4a4643" },
        categories: ["doston-ki-baithak", "gali-cricket", "ready-set-bachpan"],
        images: [
            "assets/images/products/Khelo Cards/Website _shop/1.0.png",
            "assets/images/products/Khelo Cards/Website _shop/1.png",
            "assets/images/products/Khelo Cards/Website _shop/2.0.png",
            "assets/images/products/Khelo Cards/Website _shop/2.png",
            "assets/images/products/Khelo Cards/Website _shop/3.0.png",
            "assets/images/products/Khelo Cards/Website _shop/3.png",
            "assets/images/products/Khelo Cards/Website _shop/4.0.png",
            "assets/images/products/Khelo Cards/Website _shop/4.png"
        ],
        image: "assets/images/products/Khelo Cards/Website _shop/1.0.png",
        description: "For every mohalla that turned into a stadium."
    },
    {
        id: 3,
        name: "Chai ki Tapri",
        subtitle: "Conversations that fixed everything.",
        price: 1399,
        compareAt: 1799,
        colors: ["Beige", "Navy Blue", "Black", "Charcoal Grey"],
        colorHex: { "Beige": "#e6d8c3", "Navy Blue": "#3b4a63", "Black": "#262220", "Charcoal Grey": "#4a4643" },
        categories: ["ek-chai-hazaar-kisse", "woh-lambi-calls", "doston-ki-baithak", "woh-gaane-woh-din"],
        images: [
            "assets/images/products/Chai ki Tapri/Website _shop/4.png",
            "assets/images/products/Chai ki Tapri/Website _shop/4.0.png",
            "assets/images/products/Chai ki Tapri/Website _shop/2.0.png",
            "assets/images/products/Chai ki Tapri/Website _shop/2.png",
            "assets/images/products/Chai ki Tapri/Website _shop/3.0.png",
            "assets/images/products/Chai ki Tapri/Website _shop/3.png",
            "assets/images/products/Chai ki Tapri/Website _shop/1.0.png",
            "assets/images/products/Chai ki Tapri/Website _shop/1.png"
        ],
        image: "assets/images/products/Chai ki Tapri/Website _shop/4.png",
        description: "A relaxed-fit tee with a nostalgic cutting-chai graphic."
    },
    {
        id: 4,
        name: "Barf Ka Gola",
        subtitle: "Filed from the field of every summer evening.",
        price: 1299,
        compareAt: 1699,
        colors: ["Beige", "Navy Blue", "Black"],
        colorHex: { "Beige": "#e6d8c3", "Navy Blue": "#3b4a63", "Black": "#262220" },
        categories: ["gola-wale-ki-gali", "gali-cricket", "ready-set-bachpan"],
        images: [
            "assets/images/products/Barf Ka Gola/Website _shop/2.1.png",
            "assets/images/products/Barf Ka Gola/Website _shop/2.0.png",
            "assets/images/products/Barf Ka Gola/Website _shop/3.0.png",
            "assets/images/products/Barf Ka Gola/Website _shop/3.1.png",
            "assets/images/products/Barf Ka Gola/Website _shop/1.0.png",
            "assets/images/products/Barf Ka Gola/Website _shop/1.1.png"
        ],
        image: "assets/images/products/Barf Ka Gola/Website _shop/2.1.png",
        description: "A tribute to the local grounds that hosted our greatest matches."
    }
];