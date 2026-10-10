// ============================================
// POLICY PAGES — Shared Interactions
// ============================================

// ============================================
// PATH HELPERS — work from root AND /pages/
// ============================================
function policyBase() {
    // Returns "../" when inside /pages/, "" otherwise
    return /\/pages\//i.test(window.location.pathname) ? '../' : '';
}

function policyAsset(path) {
    if (!path) return '';
    // Leave absolute / protocol / data URLs untouched
    if (/^(https?:|data:|\/\/|\/)/i.test(path)) return path;
    // Otherwise prefix so it resolves from /pages/ correctly
    return policyBase() + path;
}

// ============================================
// FAQ ACCORDION
// ============================================
function initFaqAccordion() {
    const items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    // ✅ Prevent double-wiring
    if (items[0].dataset.faqWired === '1') return;
    items.forEach(item => { item.dataset.faqWired = '1'; });

    items.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (!question || !answer) return;

        // Set initial closed state
        answer.style.maxHeight = '0px';

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Close all other open items (single-open accordion)
            items.forEach(other => {
                if (other !== item && other.classList.contains('open')) {
                    other.classList.remove('open');
                    const otherAnswer = other.querySelector('.faq-answer');
                    if (otherAnswer) otherAnswer.style.maxHeight = '0px';
                    const otherBtn = other.querySelector('.faq-question');
                    if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current
            if (isOpen) {
                item.classList.remove('open');
                answer.style.maxHeight = '0px';
                question.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                question.setAttribute('aria-expanded', 'true');
            }
        });

        // Initialize aria
        question.setAttribute('aria-expanded', 'false');
    });

    // Recalculate on window resize (in case text wraps differently)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.querySelectorAll('.faq-item.open .faq-answer').forEach(answer => {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            });
        }, 200);
    });
}

// ============================================
// TRACK ORDER
// ============================================
function initTrackOrder() {
    const form = document.getElementById('trackOrderForm');
    if (!form) return;

    // ✅ Prevent double-wiring
    if (form.dataset.trackWired === '1') return;
    form.dataset.trackWired = '1';

    const input = document.getElementById('trackOrderId');
    const result = document.getElementById('trackResult');
    const empty = document.getElementById('trackEmpty');
    const btn = form.querySelector('button');

    form.addEventListener('submit', e => {
        e.preventDefault();
        const orderId = input.value.trim().toUpperCase();

        if (!orderId) {
            showTrackError('Please enter your order ID.');
            return;
        }

        // Loading state
        btn.disabled = true;
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span>SEARCHING...</span>';

        setTimeout(() => {
            const order = findOrderById(orderId);

            btn.disabled = false;
            btn.innerHTML = originalHTML;

            if (!order) {
                showTrackError('No order found with that ID. Please check and try again.');
                return;
            }

            renderTrackResult(order);
        }, 700);
    });

    function showTrackError(message) {
        if (result) result.classList.remove('show');
        if (empty) {
            empty.querySelector('p').textContent = message;
            empty.classList.add('show');
        }
    }
}

// ============================================
// FIND ORDER BY ID
// ============================================
function findOrderById(orderId) {
    // Check current user's orders first
    if (typeof currentUser !== 'undefined' && currentUser && currentUser.orders) {
        const found = currentUser.orders.find(
            o => o.orderId && o.orderId.toUpperCase() === orderId
        );
        if (found) return found;
    }

    // Fallback: search all registered users
    if (typeof users !== 'undefined' && Array.isArray(users)) {
        for (const u of users) {
            if (u.orders) {
                const found = u.orders.find(
                    o => o.orderId && o.orderId.toUpperCase() === orderId
                );
                if (found) return found;
            }
        }
    }

    return null;
}

// ============================================
// SCROLL REVEAL — policy cards & contact strip
// ============================================
(function () {
    function initScrollReveal() {
        const targets = document.querySelectorAll('.policy-card, .policy-contact');
        if (!targets.length) return;

        // Reduced motion → reveal immediately
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            targets.forEach(el => el.classList.add('revealed'));
            return;
        }

        if (!('IntersectionObserver' in window)) {
            targets.forEach(el => el.classList.add('revealed'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        targets.forEach(el => observer.observe(el));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollReveal);
    } else {
        initScrollReveal();
    }
})();

// ============================================
// RENDER TRACK RESULT
// ============================================
function renderTrackResult(order) {
    const result = document.getElementById('trackResult');
    const empty = document.getElementById('trackEmpty');
    if (!result) return;

    if (empty) empty.classList.remove('show');

    const status = (order.status || 'confirmed').toLowerCase();
    const statusLabel = {
        confirmed: 'Order Confirmed',
        shipped: 'Shipped',
        delivered: 'Delivered',
        cancelled: 'Cancelled'
    }[status] || 'Confirmed';

    const orderDate = order.date ? new Date(order.date).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric'
    }) : '—';

    // Determine which step is active
    const stepIndex = { confirmed: 1, shipped: 2, delivered: 3, cancelled: 1 }[status] || 1;

    const steps = [
        { key: 'confirmed', title: 'Order Confirmed', desc: 'We received your order and payment.' },
        { key: 'shipped',   title: 'Shipped',         desc: 'Your package is on its way.' },
        { key: 'delivered', title: 'Delivered',       desc: 'Package delivered. Enjoy!' }
    ];

    const timelineHTML = steps.map((step, i) => {
        const stepNum = i + 1;
        let cls = '';
        if (stepNum < stepIndex) cls = 'done';
        else if (stepNum === stepIndex) cls = 'current';
        return `
            <div class="track-step ${cls}">
                <p class="track-step-title">${step.title}</p>
                <p class="track-step-desc">${step.desc}</p>
            </div>
        `;
    }).join('');

    // ✅ Use policyAsset so images resolve correctly from /pages/
    const itemsHTML = (order.items || []).map(item => `
        <div class="track-item">
            <img src="${policyAsset(item.image)}" alt="${item.name}">
            <div class="track-item-info">
                <p class="track-item-name">${item.name}</p>
                <p class="track-item-meta">${item.size || ''} · ${item.color || ''} · Qty ${item.quantity}</p>
            </div>
            <p class="track-item-price">₹${(item.price * item.quantity).toLocaleString()}</p>
        </div>
    `).join('');

    result.innerHTML = `
        <div class="track-result-header">
            <div>
                <p class="track-result-id">Order #${order.orderId}</p>
                <p class="track-result-date">Placed on ${orderDate}</p>
            </div>
            <span class="track-status-badge ${status}">${statusLabel}</span>
        </div>
        <div class="track-timeline">${timelineHTML}</div>
        ${itemsHTML ? `
            <div class="track-items">
                <p class="track-items-title">Items in this order</p>
                ${itemsHTML}
            </div>
        ` : ''}
    `;

    result.classList.add('show');
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ============================================
// AUTO-INIT ON DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initFaqAccordion();
    initTrackOrder();
});