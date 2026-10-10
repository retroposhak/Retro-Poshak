// ============================================
// BLOG POST PAGE — Loads post by ?id= query
// ============================================

// Long-form content for each post.
// If a post id isn't listed here, we fall back to a generic body.
const blogPostBodies = {
    1: {
        readTime: 5,
        content: [
            { type: 'p', text: "There was a time when music wasn't something you carried in your pocket. It lived in wooden cabinets, in the corner of a room, and in every cassette you ever rewound with a pencil." },
            { type: 'h2', text: "The Ritual of the Radio" },
            { type: 'p', text: "Sunday mornings meant one thing — the radio was on, and the whole house was listening. Nobody spoke over the songs. Nobody scrolled through anything. You just listened, really listened, and let the melodies fill up the room." },
            { type: 'p', text: "Every family had that one radio, polished to a shine, sitting on a shelf like a small god. And when a song you loved came on, you didn't skip. You waited. You let it play all the way through, because there was no other way." },
            { type: 'quote', text: "Music didn't just play in our homes. It became the background score of our childhood." },
            { type: 'h2', text: "Mixtapes and Memories" },
            { type: 'p', text: "Then came the cassette. Suddenly you could choose. You could record. You could make a mixtape for a friend, spending hours carefully timing every track so nothing got cut off." },
            { type: 'p', text: "A mixtape wasn't just music. It was a letter. It was a feeling. It was you, on a Tuesday evening, sitting beside a tape recorder, hoping the radio wouldn't play an ad when your favourite song came on." },
            { type: 'h2', text: "Why It Still Matters" },
            { type: 'p', text: "We don't rewind cassettes anymore. We don't wait for the radio. But we still feel it — that shiver when an old song comes on. That sudden, sharp memory of a summer afternoon, a scooter ride, a friend's terrace." },
            { type: 'p', text: "The soundtrack didn't change. We did. And that's exactly why it still matters." }
        ]
    },
    2: {
        readTime: 4,
        content: [
            { type: 'p', text: "Gali cricket wasn't a sport. It was a religion, and every gully had its own rules, its own pitch, and its own legends." },
            { type: 'h2', text: "The Pitch" },
            { type: 'p', text: "One stump made of a stick. One tennis ball, worn thin from use. And a boundary — that imaginary line that ran where the neighbour aunty's window began." },
            { type: 'quote', text: "If the ball went into her house, you ran. If the ball broke her window, you ran faster." },
            { type: 'h2', text: "The Teams" },
            { type: 'p', text: "The teams were never fair. But nobody cared. The youngest kid always batted first. The oldest always bowled. And when the evening light turned golden, everything became dramatic — every run a victory, every wicket a tragedy." },
            { type: 'h2', text: "The End of the Day" },
            { type: 'p', text: "Amma's voice from the balcony meant the match was over. The bat was handed over. The ball was pocketed. And you walked home, sweaty and happy, already planning the next evening's game." }
        ]
    },
    3: {
        readTime: 4,
        content: [
            { type: 'p', text: "The gola wala arrived on his cart, pushing it slowly down the street, his bell announcing him before he came into view." },
            { type: 'h2', text: "The Cart" },
            { type: 'p', text: "Crushed ice, colourful syrups, tiny wooden sticks, and a small block of ice he shaved down by hand. It looked like magic. It tasted like summer." },
            { type: 'quote', text: "Every colour was a different promise. Orange was mango. Pink was rose. Green was… well, green. You never asked. You just chose." },
            { type: 'h2', text: "The Choices" },
            { type: 'p', text: "Sometimes you wanted the classic — plain ice with a squeeze of lemon. Sometimes you wanted the elaborate one, drenched in three syrups, the ice melting faster than you could eat it." },
            { type: 'h2', text: "The Feeling" },
            { type: 'p', text: "The first bite was always too cold. The last bite always left you wanting more. And somewhere between them, you grew up a little, every summer, one gola at a time." }
        ]
    },
    4: {
        readTime: 5,
        content: [
            { type: 'p', text: "There was a red booth on the corner of the street. It had been there forever. And every time you stepped inside, the world outside went quiet." },
            { type: 'h2', text: "The Call" },
            { type: 'p', text: "You picked up the receiver. You dropped a coin. You waited for the tone. And when the voice on the other end picked up — your cousin, your grandmother, your friend who'd moved away — everything felt closer." },
            { type: 'quote', text: "A phone call wasn't a quick thing. It was an event. You planned for it. You looked forward to it. You remembered it." },
            { type: 'h2', text: "The Queue" },
            { type: 'p', text: "There was always a line. Always someone waiting. And the man who ran the booth knew every regular by name, by voice, and by the size of the coin they always dropped." },
            { type: 'h2', text: "The Feeling" },
            { type: 'p', text: "You didn't text back then. You called. You listened. And when the call ended, you walked out of that red booth carrying something you couldn't quite name — but you felt it for the rest of the day." }
        ]
    }
};

// Generic fallback for posts without a custom body
const fallbackBody = {
    readTime: 4,
    content: [
        { type: 'p', text: "Some stories don't need grand events. They live in small moments — a song, a smell, a street corner you pass every day without noticing." },
        { type: 'h2', text: "The Little Things" },
        { type: 'p', text: "The mornings that started with the smell of filter coffee. The evenings that ended with the sound of a whistle. The in-between that we didn't know was precious until it was gone." },
        { type: 'quote', text: "Nostalgia isn't about the past. It's about the pieces of ourselves we left behind in it." },
        { type: 'h2', text: "Why We Remember" },
        { type: 'p', text: "Because they shaped us. Because they made us who we are. And because every now and then, the smallest thing — a familiar tune, a stranger's laugh — brings it all rushing back." },
        { type: 'p', text: "And that's why we write these stories. Not to go back. But to keep those moments alive for whoever needs them next." }
    ]
};

// ============================================
// HELPERS
// ============================================
function getPostIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'), 10);
    return isNaN(id) ? 1 : id;
}

function getPostById(id) {
    return (window.blogPosts || []).find(p => p.id === id) || null;
}

function getPostBody(id) {
    return blogPostBodies[id] || fallbackBody;
}

function formatLongDate(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return '';
    const day = d.getDate();
    const month = d.toLocaleString('en-US', { month: 'short' });
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
}

function escapeHtml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// ============================================
// RENDER ARTICLE
// ============================================
function renderPost(post) {
    const body = getPostBody(post.id);

    // Meta + hero
    document.title = `${post.title} — Retro Poshak`;

    const categoryEl = document.getElementById('postCategory');
    if (categoryEl) categoryEl.textContent = post.categoryLabel;

    const titleEl = document.getElementById('postTitle');
    if (titleEl) titleEl.textContent = post.title;

    const ledeEl = document.getElementById('postLede');
    if (ledeEl) ledeEl.textContent = post.excerpt;

    const dateEl = document.getElementById('postDate');
    if (dateEl) dateEl.innerHTML = `<i class="fa-regular fa-calendar"></i> ${formatLongDate(post.date)}`;

    const readEl = document.getElementById('postReadTime');
    if (readEl) readEl.innerHTML = `<i class="fa-regular fa-clock"></i> ${body.readTime} min read`;

    const heroImg = document.getElementById('postHeroImage');
    if (heroImg) {
        heroImg.src = post.image;
        heroImg.alt = post.title;
    }

    // Body
    const contentEl = document.getElementById('postContent');
    if (contentEl) {
        contentEl.innerHTML = body.content.map(block => {
            switch (block.type) {
                case 'p':
                    return `<p>${escapeHtml(block.text)}</p>`;
                case 'h2':
                    return `<h2>${escapeHtml(block.text)}</h2>`;
                case 'h3':
                    return `<h3>${escapeHtml(block.text)}</h3>`;
                case 'quote':
                    return `<blockquote><p>${escapeHtml(block.text)}</p></blockquote>`;
                case 'image':
                    return `<figure class="post-inline-image">
                        <img src="${escapeHtml(block.src)}" alt="${escapeHtml(block.alt || '')}">
                        ${block.caption ? `<figcaption>${escapeHtml(block.caption)}</figcaption>` : ''}
                    </figure>`;
                default:
                    return '';
            }
        }).join('');

        // First paragraph gets a drop cap
        const firstP = contentEl.querySelector('p');
        if (firstP) firstP.classList.add('post-dropcap');
    }
}

// ============================================
// RELATED POSTS
// ============================================
function renderRelated(currentId) {
    const grid = document.getElementById('postRelatedGrid');
    if (!grid) return;

    const posts = window.blogPosts || [];
    const current = posts.find(p => p.id === currentId);
    if (!current) return;

    // Prefer same-category posts, then fill with others
    const sameCat = posts.filter(p => p.id !== currentId && p.category === current.category);
    const others = posts.filter(p => p.id !== currentId && p.category !== current.category);
    const picks = [...sameCat, ...others].slice(0, 3);

    grid.innerHTML = picks.map(p => `
        <a href="${p.url}" class="post-related-card">
            <div class="post-related-card-img">
                <img src="${p.image}" alt="${p.title}" loading="lazy"
                     onerror="this.style.display='none';this.parentElement.style.background='linear-gradient(135deg,#ece3d1 0%,#d8c9ac 100%)'">
            </div>
            <div class="post-related-card-body">
                <span class="post-related-card-tag">${p.categoryLabel}</span>
                <h3 class="post-related-card-title">${p.title}</h3>
                <span class="post-related-card-date">${formatLongDate(p.date)}</span>
            </div>
        </a>
    `).join('');
}

// ============================================
// SHARE BUTTONS
// ============================================
function initShare() {
    document.querySelectorAll('.post-share-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const post = getPostById(getPostIdFromURL());
            const url = window.location.href;
            const title = post ? post.title : 'Retro Poshak Blog';
            const type = btn.dataset.share;

            try {
                if (type === 'twitter') {
                    window.open(
                        `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
                        '_blank', 'noopener'
                    );
                } else if (type === 'facebook') {
                    window.open(
                        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
                        '_blank', 'noopener'
                    );
                } else if (type === 'whatsapp') {
                    window.open(
                        `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
                        '_blank', 'noopener'
                    );
                } else if (type === 'copy') {
                    await navigator.clipboard.writeText(url);
                    const original = btn.innerHTML;
                    btn.innerHTML = '<i class="fa-solid fa-check"></i>';
                    setTimeout(() => { btn.innerHTML = original; }, 1600);
                }
            } catch (err) {
                console.warn('Share failed:', err);
            }
        });
    });
}

// ============================================
// READING PROGRESS BAR
// ============================================
function initReadingProgress() {
    const bar = document.getElementById('postProgressBar');
    if (!bar) return;

    const onScroll = () => {
        const doc = document.documentElement;
        const scrollTop = window.scrollY || doc.scrollTop;
        const height = doc.scrollHeight - doc.clientHeight;
        const pct = height > 0 ? (scrollTop / height) * 100 : 0;
        bar.style.width = Math.min(100, Math.max(0, pct)) + '%';
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

// ============================================
// SMOOTH REVEAL FOR CONTENT BLOCKS
// ============================================
function initContentReveal() {
    const content = document.getElementById('postContent');
    if (!content) return;

    const blocks = content.querySelectorAll('p, h2, h3, blockquote, figure');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        blocks.forEach(b => b.classList.add('revealed'));
        return;
    }
    if (!('IntersectionObserver' in window)) {
        blocks.forEach(b => b.classList.add('revealed'));
        return;
    }

    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    blocks.forEach(b => io.observe(b));
}

// ============================================
// INIT
// ============================================
function initBlogPost() {
    const id = getPostIdFromURL();
    const post = getPostById(id);

    const safe = (name, fn) => {
        try { fn(); } catch (e) { console.error(`[initBlogPost] ${name} failed:`, e); }
    };

    if (post) {
        safe('renderPost', () => renderPost(post));
        safe('renderRelated', () => renderRelated(post.id));
    } else {
        // Fallback if no post found
        const titleEl = document.getElementById('postTitle');
        if (titleEl) titleEl.textContent = 'Story not found';
        const contentEl = document.getElementById('postContent');
        if (contentEl) {
            contentEl.innerHTML = `
                <p>We couldn't find that story. It may have been moved or removed.</p>
                <p><a href="blog.html">← Back to all stories</a></p>
            `;
        }
    }

    safe('initShare', initShare);
    safe('initReadingProgress', initReadingProgress);
    safe('initContentReveal', initContentReveal);
}