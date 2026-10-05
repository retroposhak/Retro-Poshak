// ============================================
// RENDER PRODUCTS
// ============================================
function renderProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    grid.innerHTML = products.map(product => {
        const primaryImage = product.images[0];

        return `
        <div class="product-card" data-id="${product.id}" data-images='${JSON.stringify(product.images)}'>
            <!-- Image Area -->
            <div class="product-image-wrap">
                <a href="shop.html?id=${product.id}" class="product-image-link">
                    <img src="${primaryImage}" alt="${product.name}" class="product-img" loading="lazy">
                </a>

                <!-- Wishlist Heart -->
                <button class="wishlist-btn" aria-label="Add to wishlist">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>

            <!-- Info -->
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="story-text">${product.subtitle}</p>

                <div class="product-bottom">
                    <div class="product-price-row">
                        <div class="product-price">
                            <span class="current-price">₹${product.price.toLocaleString()}</span>
                        </div>
                        <div class="color-dots">
                            ${product.colors.map(color => 
                                `<span class="color-dot" style="background: ${product.colorHex[color]}" title="${color}"></span>`
                            ).join('')}
                        </div>
                    </div>

                    <a href="shop.html?id=${product.id}" class="product-arrow" aria-label="View product">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
        `;
    }).join('');

    attachHoverCycling();
    attachWishlistToggle();
    preloadImages();
}

// ============================================
// PRELOAD ALL IMAGES (for instant hover)
// ============================================
function preloadImages() {
    products.forEach(product => {
        product.images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    });
}

// ============================================
// HOVER IMAGE CYCLING — SMOOTH
// ============================================
function attachHoverCycling() {
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
        const img = card.querySelector('.product-img');
        const images = JSON.parse(card.dataset.images || '[]');

        if (!img || images.length < 2) return;

        let interval = null;
        let index = 0;

        card.addEventListener('mouseenter', () => {
            index = 0;
            interval = setInterval(() => {
                index = (index + 1) % images.length;
                img.classList.add('fading');
                setTimeout(() => {
                    img.src = images[index];
                    img.classList.remove('fading');
                }, 250);
            }, 1500);
        });

        card.addEventListener('mouseleave', () => {
            clearInterval(interval);
            index = 0;
            img.src = images[0];
            img.classList.remove('fading');
        });
    });
}

// ============================================
// WISHLIST TOGGLE
// ============================================
function attachWishlistToggle() {
    const buttons = document.querySelectorAll('.wishlist-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            btn.classList.toggle('active');
        });
    });
}