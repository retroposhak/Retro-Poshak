// ============================================
// RENDER PRODUCTS
// ============================================
function renderProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    grid.innerHTML = products.map(product => {
        const primaryImage = product.images[0];
        const isWishlisted = isInWishlist(product.id);

        return `
        <div class="product-card" data-id="${product.id}" data-images='${JSON.stringify(product.images)}'>
            <div class="product-image-wrap">
                <a href="shop.html?id=${product.id}" class="product-image-link">
                    <img src="${primaryImage}" alt="${product.name}" class="product-img" loading="lazy">
                </a>

                <button class="wishlist-btn ${isWishlisted ? 'active' : ''}"
                        aria-label="Add to wishlist"
                        data-id="${product.id}">
                    <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                </button>
            </div>

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
                        <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        </div>
        `;
    }).join('');

    attachHoverCycling();
    attachWishlistToggle();
    preloadImages();
    updateWishlistBadge();
}

// ============================================
// PRELOAD ALL IMAGES
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
// HOVER IMAGE CYCLING
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
// WISHLIST TOGGLE — FULLY FUNCTIONAL
// ============================================
function attachWishlistToggle() {
    const buttons = document.querySelectorAll('.wishlist-btn');

    buttons.forEach(btn => {
        // Remove existing listeners by cloning
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const productId = newBtn.dataset.id;
            if (!productId) return;

            const isAdded = toggleWishlist(productId);
            const icon = newBtn.querySelector('i');

            if (isAdded) {
                newBtn.classList.add('active', 'pop');
                if (icon) {
                    icon.classList.remove('fa-regular');
                    icon.classList.add('fa-solid');
                }
                setTimeout(() => newBtn.classList.remove('pop'), 500);
            } else {
                newBtn.classList.remove('active');
                if (icon) {
                    icon.classList.remove('fa-solid');
                    icon.classList.add('fa-regular');
                }
            }

            updateWishlistBadge();
        });
    });
}