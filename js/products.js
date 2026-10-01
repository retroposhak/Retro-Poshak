/* =========================================================
   RETRO POSHAK — Product Data
   Add/edit products here. No HTML changes required.
   ========================================================= */

const PRODUCTS = [
  {
    id: 1,
    name: "Gully Champion",
    subtitle: "For every game that had a starting line.",
    category: "oversized-tshirt",
    collection: "school-days",
    price: 1299,
    compareAt: 1699,
    colors: ["Beige", "Faded Black", "Washed Blue"],
    colorHex: { "Beige": "#e6d8c3", "Faded Black": "#262220", "Washed Blue": "#6b7f8c" },
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "assets/images/gully-champion.jpg",
    image2: "assets/images/gully-champion-2.jpg",
    description: "Oversized heavyweight tee with a nostalgic gully-cricket graphic.",
    story: "Some memories don't need photographs. They live somewhere between the starting line, dusty playgrounds, school bells and the friends who made ordinary days special.",
    fabric: "100% Cotton Terry",
    gsm: 240,
    fit: "Oversized / Drop Shoulder",
    benefits: [
      { icon: "🧵", label: "240 GSM" },
      { icon: "🌱", label: "100% Cotton" },
      { icon: "👕", label: "Oversized Fit" },
      { icon: "✨", label: "Premium Print" }
    ],
    tags: ["retro", "sports", "school", "nostalgia", "gully", "cricket"],
    badge: "bestseller",
    featured: true,
    inStock: true,
    createdAt: "2025-06-01"
  },
  {
    id: 2,
    name: "Last Bench",
    subtitle: "Where the best stories were written.",
    category: "oversized-tshirt",
    collection: "school-days",
    price: 1299,
    compareAt: 1699,
    colors: ["Beige", "Charcoal"],
    colorHex: { "Beige": "#e6d8c3", "Charcoal": "#262220" },
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "assets/images/last-bench.jpg",
    image2: "assets/images/last-bench-2.jpg",
    description: "For the backbenchers who made school worth remembering.",
    story: "The last bench wasn't a place. It was a feeling — half-notebooks, shared tiffins, whispered jokes, and a friendship that outlived every exam.",
    fabric: "100% Cotton Terry",
    gsm: 240,
    fit: "Oversized / Drop Shoulder",
    benefits: [
      { icon: "🧵", label: "240 GSM" },
      { icon: "🌱", label: "100% Cotton" },
      { icon: "👕", label: "Oversized Fit" },
      { icon: "✨", label: "Premium Print" }
    ],
    tags: ["retro", "school", "nostalgia", "friends", "last bench"],
    badge: "new",
    featured: true,
    inStock: true,
    createdAt: "2025-06-15"
  },
  {
    id: 3,
    name: "Sunday Scene",
    subtitle: "Slow mornings. Old songs. Nobody in a hurry.",
    category: "oversized-tshirt",
    collection: "sunday-memories",
    price: 1399,
    compareAt: 1799,
    colors: ["Beige", "Mustard"],
    colorHex: { "Beige": "#e6d8c3", "Mustard": "#c69a3e" },
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "assets/images/sunday-scene.jpg",
    image2: "assets/images/sunday-scene-2.jpg",
    description: "The feeling of a Sunday that never had to end.",
    story: "Chai on the balcony. The radio playing something old. A newspaper somebody else already read. Sundays were never about doing nothing — they were about doing everything slowly.",
    fabric: "100% Cotton Terry",
    gsm: 240,
    fit: "Oversized / Drop Shoulder",
    benefits: [
      { icon: "🧵", label: "240 GSM" },
      { icon: "🌱", label: "100% Cotton" },
      { icon: "👕", label: "Oversized Fit" },
      { icon: "✨", label: "Premium Print" }
    ],
    tags: ["retro", "sunday", "nostalgia", "family", "chai"],
    badge: "bestseller",
    featured: true,
    inStock: true,
    createdAt: "2025-05-20"
  },
  {
    id: 4,
    name: "Bachpan",
    subtitle: "The version of you that still laughs freely.",
    category: "oversized-tshirt",
    collection: "bachpan",
    price: 1299,
    compareAt: 1699,
    colors: ["Beige", "Faded Green"],
    colorHex: { "Beige": "#e6d8c3", "Faded Green": "#7a8a6a" },
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "assets/images/bachpan.jpg",
    image2: "assets/images/bachpan-2.jpg",
    description: "A wearable ode to the childhood we keep returning to.",
    story: "Bachpan wasn't a phase. It was a place we grew up in and never fully left. Every time we laugh without thinking, a little bit of it comes back.",
    fabric: "100% Cotton Terry",
    gsm: 240,
    fit: "Oversized / Drop Shoulder",
    benefits: [
      { icon: "🧵", label: "240 GSM" },
      { icon: "🌱", label: "100% Cotton" },
      { icon: "👕", label: "Oversized Fit" },
      { icon: "✨", label: "Premium Print" }
    ],
    tags: ["retro", "bachpan", "childhood", "nostalgia", "youth"],
    badge: null,
    featured: true,
    inStock: true,
    createdAt: "2025-04-10"
  },
  {
    id: 5,
    name: "Ground Report",
    subtitle: "Filed from the field of every summer evening.",
    category: "oversized-tshirt",
    collection: "gully-games",
    price: 1299,
    compareAt: 1699,
    colors: ["Beige", "Washed Blue"],
    colorHex: { "Beige": "#e6d8c3", "Washed Blue": "#6b7f8c" },
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "assets/images/ground-report.jpg",
    image2: "assets/images/ground-report-2.jpg",
    description: "A tribute to the local grounds that hosted our greatest matches.",
    story: "One wicket. Ten runs. A whole summer of glory. The ground didn't care who won — it just kept the score in our memory.",
    fabric: "100% Cotton Terry",
    gsm: 240,
    fit: "Oversized / Drop Shoulder",
    benefits: [
      { icon: "🧵", label: "240 GSM" },
      { icon: "🌱", label: "100% Cotton" },
      { icon: "👕", label: "Oversized Fit" },
      { icon: "✨", label: "Premium Print" }
    ],
    tags: ["retro", "sports", "cricket", "gully", "nostalgia"],
    badge: null,
    featured: false,
    inStock: true,
    createdAt: "2025-03-25"
  },
  {
    id: 6,
    name: "Mohalla Match",
    subtitle: "The rivalry that made us best friends.",
    category: "oversized-tshirt",
    collection: "gully-games",
    price: 1299,
    compareAt: 1699,
    colors: ["Beige", "Faded Black"],
    colorHex: { "Beige": "#e6d8c3", "Faded Black": "#262220" },
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "assets/images/mohalla-match.jpg",
    image2: "assets/images/mohalla-match-2.jpg",
    description: "For every mohalla that turned into a stadium.",
    story: "Every street had its own World Cup. Every evening had a new final. The only prize that mattered was bragging rights until tomorrow.",
    fabric: "100% Cotton Terry",
    gsm: 240,
    fit: "Oversized / Drop Shoulder",
    benefits: [
      { icon: "🧵", label: "240 GSM" },
      { icon: "🌱", label: "100% Cotton" },
      { icon: "👕", label: "Oversized Fit" },
      { icon: "✨", label: "Premium Print" }
    ],
    tags: ["retro", "sports", "mohalla", "nostalgia", "friends"],
    badge: "new",
    featured: false,
    inStock: true,
    createdAt: "2025-06-20"
  },
  {
    id: 7,
    name: "Chai & Baatein",
    subtitle: "Conversations that fixed everything.",
    category: "shirt",
    collection: "sunday-memories",
    price: 1899,
    compareAt: 2299,
    colors: ["Beige", "Charcoal"],
    colorHex: { "Beige": "#e6d8c3", "Charcoal": "#262220" },
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "assets/images/chai-baatein.jpg",
    image2: "assets/images/chai-baatein-2.jpg",
    description: "A relaxed-fit shirt with a nostalgic cutting-chai graphic.",
    story: "Cutting chai, gossip, and the corner tapri that knew everyone. Every sip carried a story — and every story had a listener.",
    fabric: "100% Cotton",
    gsm: 180,
    fit: "Relaxed Fit",
    benefits: [
      { icon: "🧵", label: "180 GSM" },
      { icon: "🌱", label: "100% Cotton" },
      { icon: "👕", label: "Relaxed Fit" },
      { icon: "✨", label: "Premium Print" }
    ],
    tags: ["retro", "chai", "street", "nostalgia", "conversation"],
    badge: "bestseller",
    featured: false,
    inStock: true,
    createdAt: "2025-05-05"
  },
  {
    id: 8,
    name: "Purani Yaadein",
    subtitle: "A shirt that remembers out loud.",
    category: "shirt",
    collection: "bachpan",
    price: 1999,
    compareAt: 2399,
    colors: ["Beige", "Washed Blue"],
    colorHex: { "Beige": "#e6d8c3", "Washed Blue": "#6b7f8c" },
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "assets/images/purani-yaadein.jpg",
    image2: "assets/images/purani-yaadein-2.jpg",
    description: "An editorial shirt for those who keep memories close.",
    story: "Some memories aren't photographs. They're the feel of old paper, the smell of grandmother's cupboard, and the sound of an old radio.",
    fabric: "100% Cotton",
    gsm: 180,
    fit: "Relaxed Fit",
    benefits: [
      { icon: "🧵", label: "180 GSM" },
      { icon: "🌱", label: "100% Cotton" },
      { icon: "👕", label: "Relaxed Fit" },
      { icon: "✨", label: "Premium Print" }
    ],
    tags: ["retro", "radio", "music", "nostalgia", "yaadein"],
    badge: null,
    featured: false,
    inStock: false,
    createdAt: "2025-02-15"
  }
];

/* Shop by Story collections */
const STORY_COLLECTIONS = [
  {
    id: "school-days",
    number: "01",
    title: "School Days",
    hindi: "स्कूल के दिन",
    description: "Last benches, first bells, and the friends who made ordinary days feel infinite.",
    link: "shop.html?collection=school-days"
  },
  {
    id: "gully-games",
    number: "02",
    title: "Gully Games",
    hindi: "गली के खेल",
    description: "Cricket, kanche, and the evening light that told us when to go home.",
    link: "shop.html?collection=gully-games"
  },
  {
    id: "bachpan",
    number: "03",
    title: "Bachpan",
    hindi: "बचपन",
    description: "A place we grew up in, and never fully left.",
    link: "shop.html?collection=bachpan"
  },
  {
    id: "dosti",
    number: "04",
    title: "Dosti",
    hindi: "दोस्ती",
    description: "For the friends who became family without ever saying so.",
    link: "shop.html?collection=dosti"
  },
  {
    id: "sunday-memories",
    number: "05",
    title: "Sunday Memories",
    hindi: "रविवार",
    description: "Chai, radio, and the slow mornings we still chase.",
    link: "shop.html?collection=sunday-memories"
  },
  {
    id: "desi-nostalgia",
    number: "06",
    title: "Desi Nostalgia",
    hindi: "देसी यादें",
    description: "Everything that smelled like home before we knew what home meant.",
    link: "shop.html?collection=desi-nostalgia"
  }
];

/* Memory Archive — homepage scrapbook cards */
const MEMORY_ARCHIVE = [
  { icon: "🚲", title: "Bicycle", story: "School mornings. Dusty roads. A ride home with your favourite person.", link: "shop.html?q=cycle" },
  { icon: "🍧", title: "Gola Cart", story: "Summer afternoons, sticky fingers, and a race to finish first.", link: "shop.html?q=gola" },
  { icon: "🃏", title: "Playing Cards", story: "Terrace evenings. A deck of cards. Friends who never left.", link: "shop.html?q=cards" },
  { icon: "📼", title: "Cassette", story: "Rewind. Play. The songs that still live in your head.", link: "shop.html?q=radio" },
  { icon: "🎒", title: "School Bag", story: "Heavier than it looked. Lighter than the memories inside.", link: "shop.html?collection=school-days" },
  { icon: "🏏", title: "Cricket Bat", story: "One wicket. Ten runs. A whole summer of glory.", link: "shop.html?collection=gully-games" },
  { icon: "📻", title: "Old Radio", story: "Sunday mornings, old Hindi songs, and a voice you trusted.", link: "shop.html?q=radio" },
  { icon: "🥛", title: "Summer Glass", story: "Cold water, a steel glass, and the sound of the fan.", link: "shop.html?collection=sunday-memories" }
];

/* Helpers */
function getProductById(id) {
  return PRODUCTS.find(p => p.id === Number(id));
}
function getFeaturedProducts(limit) {
  const featured = PRODUCTS.filter(p => p.featured);
  return limit ? featured.slice(0, limit) : featured;
}
function getProductsByCollection(collectionId) {
  if (!collectionId || collectionId === 'all') return PRODUCTS;
  return PRODUCTS.filter(p => p.collection === collectionId);
}
function searchProducts(query) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    (p.collection || '').toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    (p.story || '').toLowerCase().includes(q) ||
    p.tags.some(t => t.toLowerCase().includes(q))
  );
}