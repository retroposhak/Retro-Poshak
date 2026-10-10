// ============================================
// BLOG PAGE — Data + Rendering + Filters
// ============================================

const blogPosts = [
    {
        id: 1,
        title: "The Soundtrack of Our Childhood",
        excerpt: "From radio hits to mixtape cassettes, music made everything better.",
        category: "childhood",
        categoryLabel: "Childhood",
        date: "2025-09-12",
        image: "assets/images/blog/wohgaanewohdin.jpeg",
        url: "blog-post.html?id=1"
    },
    {
        id: 2,
        title: "Gali Cricket and Golden Evenings",
        excerpt: "No stadiums, no jerseys — just a bat, a tennis ball and endless happiness.",
        category: "indian-streets",
        categoryLabel: "Indian Streets",
        date: "2025-09-05",
        image: "assets/images/blog/galicricket.jpeg",
        url: "blog-post.html?id=2"
    },
    {
        id: 3,
        title: "The Magic of Gola Walas",
        excerpt: "Those colourful ice golas that turned ordinary afternoons into celebrations.",
        category: "people-places",
        categoryLabel: "People & Places",
        date: "2025-08-28",
        image: "assets/images/blog/golawalekigali.jpeg",
        url: "blog-post.html?id=3"
    },
    {
        id: 4,
        title: "Those Long Calls from Red Booths",
        excerpt: "When a phone call was an event, not a quick text. Different times, deeper conversations.",
        category: "vintage-things",
        categoryLabel: "Vintage Things",
        date: "2025-08-18",
        image: "assets/images/blog/wohlambicalls.jpeg",
        url: "blog-post.html?id=4"
    },
    {
        id: 5,
        title: "Summer Vacations at Nani's House",
        excerpt: "Where every meal was a feast, every story a lesson, and every goodbye a small heartbreak.",
        category: "childhood",
        categoryLabel: "Childhood",
        date: "2025-08-10",
        image: "assets/images/blog/post-5.jpg",
        url: "blog-post.html?id=5"
    },
    {
        id: 6,
        title: "The Corner Chai Stall Chronicles",
        excerpt: "Cutting chai, biscuits, and conversations that solved the world's problems one cup at a time.",
        category: "indian-streets",
        categoryLabel: "Indian Streets",
        date: "2025-08-02",
        image: "assets/images/blog/ekchaihazaarkisse.jpeg",
        url: "blog-post.html?id=6"
    },
    {
        id: 7,
        title: "Letters We Never Sent",
        excerpt: "The art of writing, folding, and waiting for a reply that meant the world.",
        category: "vintage-things",
        categoryLabel: "Vintage Things",
        date: "2025-07-24",
        image: "assets/images/blog/post-7.jpg",
        url: "blog-post.html?id=7"
    },
    {
        id: 8,
        title: "What the Monsoons Taught Us",
        excerpt: "Paper boats, wet uniforms, and the simple joy of dancing in the first rain.",
        category: "life-lessons",
        categoryLabel: "Life Lessons",
        date: "2025-07-16",
        image: "assets/images/blog/post-8.jpg",
        url: "blog-post.html?id=8"
    },
    {
        id: 9,
        title: "The Old Photo Album",
        excerpt: "Faded photographs that hold entire lifetimes inside their frames.",
        category: "people-places",
        categoryLabel: "People & Places",
        date: "2025-07-08",
        image: "assets/images/blog/dostonkibaithak.jpeg",
        url: "blog-post.html?id=9"
    },
    {
        id: 10,
        title: "Doordarshan Sundays",
        excerpt: "When the whole family gathered around a single TV for one hour of magic.",
        category: "childhood",
        categoryLabel: "Childhood",
        date: "2025-06-30",
        image: "assets/images/blog/post-10.jpg",
        url: "blog-post.html?id=10"
    },
    {
        id: 11,
        title: "The Cycle Repairwala",
        excerpt: "He fixed more than punctures — he patched up childhoods.",
        category: "people-places",
        categoryLabel: "People & Places",
        date: "2025-06-22",
        image: "assets/images/blog/schoolkavosafar.jpeg",
        url: "blog-post.html?id=11"
    },
    {
        id: 12,
        title: "Notebooks and Ink Stains",
        excerpt: "The smell of fresh paper, the pressure of a good pen, the importance of neat handwriting.",
        category: "vintage-things",
        categoryLabel: "Vintage Things",
        date: "2025-06-14",
        image: "assets/images/blog/post-12.jpg",
        url: "blog-post.html?id=12"
    }
];

// ============================================
// STATE
// ============================================
let blogState = {
    category: 'all',
    query: '',
    visibleCount: 8,
    increment: 4
};

// ============================================
// UTILITIES
// ============================================
function formatBlogDate(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return '';
    const day = String(d.getDate()).padStart(2, '0');
    const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
}

function filterPosts() {
    const q = blogState.query.trim().toLowerCase();
    return blogPosts.filter(p => {
        const matchesCategory =
            blogState.category === 'all' || p.category === blogState.category;
        const matchesQuery =
            !q ||
            p.title.toLowerCase().includes(q) ||
            p.excerpt.toLowerCase().includes(q) ||
            p.categoryLabel.toLowerCase().includes(q);
        return matchesCategory && matchesQuery;
    });
}

// ============================================
// RENDER
// ============================================
function renderBlogGrid() {
    const grid = document.getElementById('blogGrid');
    const empty = document.getElementById('blogEmpty');
    const loadMoreWrap = document.querySelector('.blog-load-more-wrap');
    const loadMoreBtn = document.getElementById('blogLoadMore');
    if (!grid) return;

    const all = filterPosts();
    const visible = all.slice(0, blogState.visibleCount);

    if (all.length === 0) {
        grid.innerHTML = '';
        if (empty) {
            // Customize empty message for search
            const h3 = empty.querySelector('h3');
            const p = empty.querySelector('p');
            if (blogState.query.trim()) {
                if (h3) h3.textContent = `No results for "${blogState.query.trim()}"`;
                if (p) p.textContent = 'Try a different keyword or category.';
            } else {
                if (h3) h3.textContent = 'No stories found';
                if (p) p.textContent = 'Try a different category.';
            }
            empty.hidden = false;
        }
        if (loadMoreWrap) loadMoreWrap.style.display = 'none';
        return;
    }

    if (empty) empty.hidden = true;
    if (loadMoreWrap) loadMoreWrap.style.display = '';

    grid.innerHTML = visible.map(post => `
        <a href="${post.url}" class="blog-card" data-post-id="${post.id}">
            <div class="blog-card-image">
                <span class="blog-card-tag">${post.categoryLabel}</span>
                <img src="${post.image}" alt="${post.title}" loading="lazy"
                     onerror="this.style.display='none';this.parentElement.style.background='linear-gradient(135deg,#ece3d1 0%,#d8c9ac 100%)'">
            </div>
            <div class="blog-card-content">
                <span class="blog-card-date">${formatBlogDate(post.date)}</span>
                <h3 class="blog-card-title">${post.title}</h3>
                <p class="blog-card-excerpt">${post.excerpt}</p>
                <span class="blog-card-more">Read More</span>
            </div>
        </a>
    `).join('');

    if (loadMoreBtn) {
        const hasMore = visible.length < all.length;
        loadMoreBtn.disabled = !hasMore;
        loadMoreBtn.querySelector('span').textContent = hasMore
            ? 'Load More Stories'
            : 'You\'ve reached the end';
        loadMoreBtn.style.display = all.length > blogState.visibleCount ? '' : 'none';
    }

    requestAnimationFrame(() => attachBlogReveal());
}

// ============================================
// SCROLL REVEAL
// ============================================
let blogRevealObserver = null;

function attachBlogReveal() {
    const cards = document.querySelectorAll('.blog-card:not(.revealed)');
    if (!cards.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        cards.forEach(c => c.classList.add('revealed'));
        return;
    }

    if (!('IntersectionObserver' in window)) {
        cards.forEach(c => c.classList.add('revealed'));
        return;
    }

    if (!blogRevealObserver) {
        blogRevealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => entry.target.classList.add('revealed'), i * 60);
                    blogRevealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px'
        });
    }

    cards.forEach(card => blogRevealObserver.observe(card));
}

// ============================================
// CATEGORY FILTER
// ============================================
function initBlogCategories() {
    const buttons = document.querySelectorAll('.blog-cat');
    if (!buttons.length) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            blogState.category = btn.dataset.category || 'all';
            blogState.visibleCount = 8;
            renderBlogGrid();
        });
    });
}

// ============================================
// SEARCH — hardened
// ============================================
function initBlogSearch() {
    const input = document.getElementById('blogSearchInput');
    const clear = document.getElementById('blogSearchClear');
    if (!input) {
        console.warn('[initBlogSearch] #blogSearchInput not found');
        return;
    }
    if (input.dataset.wired === '1') return;
    input.dataset.wired = '1';

    let debounce;

    const applySearch = () => {
        blogState.query = input.value;
        blogState.visibleCount = 8;
        if (clear) clear.hidden = !input.value;
        renderBlogGrid();
    };

    input.addEventListener('input', () => {
        clearTimeout(debounce);
        debounce = setTimeout(applySearch, 180);
    });

    // Enter key — instant apply
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            clearTimeout(debounce);
            applySearch();
        }
        if (e.key === 'Escape') {
            input.value = '';
            clearTimeout(debounce);
            applySearch();
        }
    });

    if (clear) {
        clear.addEventListener('click', () => {
            input.value = '';
            blogState.query = '';
            blogState.visibleCount = 8;
            clear.hidden = true;
            renderBlogGrid();
            input.focus();
        });
    }
}

// ============================================
// EMPTY STATE RESET
// ============================================
function initBlogEmptyReset() {
    const btn = document.getElementById('blogEmptyReset');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const input = document.getElementById('blogSearchInput');
        const clear = document.getElementById('blogSearchClear');
        const catButtons = document.querySelectorAll('.blog-cat');

        if (input) input.value = '';
        if (clear) clear.hidden = true;
        catButtons.forEach(b => b.classList.toggle('active', b.dataset.category === 'all'));

        blogState.category = 'all';
        blogState.query = '';
        blogState.visibleCount = 8;
        renderBlogGrid();
    });
}

// ============================================
// LOAD MORE
// ============================================
function initBlogLoadMore() {
    const btn = document.getElementById('blogLoadMore');
    if (!btn) return;
    if (btn.dataset.wired === '1') return;
    btn.dataset.wired = '1';

    btn.addEventListener('click', () => {
        if (btn.disabled) return;
        blogState.visibleCount += blogState.increment;
        renderBlogGrid();
        window.scrollBy({ top: 200, behavior: 'smooth' });
    });
}

// ============================================
// STICKY TOOLBAR SHADOW
// ============================================
function initToolbarShadow() {
    const toolbar = document.querySelector('.blog-toolbar');
    if (!toolbar) return;

    const onScroll = () => {
        toolbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

// ============================================
// CTA FORM
// ============================================
function initBlogCta() {
    const form = document.getElementById('blogCtaForm');
    const email = document.getElementById('blogCtaEmail');
    if (!form || !email) return;

    if (form.dataset.wired === '1') return;
    form.dataset.wired = '1';

    form.addEventListener('submit', e => {
        e.preventDefault();
        const value = email.value.trim();
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        if (!ok) {
            email.focus();
            email.style.boxShadow = '0 0 0 3px rgba(179, 58, 58, 0.35)';
            setTimeout(() => { email.style.boxShadow = ''; }, 1200);
            return;
        }

        const btn = form.querySelector('button');
        const originalHTML = btn.innerHTML;
        btn.classList.add('success');
        btn.innerHTML = '<span>Subscribed ✓</span>';
        btn.disabled = true;

        setTimeout(() => {
            form.reset();
            btn.classList.remove('success');
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        }, 2400);
    });
}

// ============================================
// INIT — safe per-function
// ============================================
function initBlog() {
    const safe = (name, fn) => {
        try { fn(); } catch (e) { console.error(`[initBlog] ${name} failed:`, e); }
    };

    safe('renderBlogGrid', renderBlogGrid);
    safe('initBlogCategories', initBlogCategories);
    safe('initBlogSearch', initBlogSearch);
    safe('initBlogEmptyReset', initBlogEmptyReset);
    safe('initBlogLoadMore', initBlogLoadMore);
    safe('initToolbarShadow', initToolbarShadow);
    safe('initBlogCta', initBlogCta);
}

// ============================================
// EXPORT POST DATA FOR blog-post.html
// ============================================
if (typeof window !== 'undefined') {
    window.blogPosts = blogPosts;
}