import { Post } from '../models/Post.js';

// ── From js/blog.js ─────────────────────────────
const POSTS = [
  {
    id: 1,
    title: 'The Soundtrack of Our Childhood',
    excerpt: 'From radio hits to mixtape cassettes, music made everything better.',
    category: 'childhood',
    categoryLabel: 'Childhood',
    date: '2025-09-12',
    image: 'assets/images/blog/wohgaanewohdin.jpeg',
  },
  {
    id: 2,
    title: 'Gali Cricket and Golden Evenings',
    excerpt: 'No stadiums, no jerseys — just a bat, a tennis ball and endless happiness.',
    category: 'indian-streets',
    categoryLabel: 'Indian Streets',
    date: '2025-09-05',
    image: 'assets/images/blog/galicricket.jpeg',
  },
  {
    id: 3,
    title: 'The Magic of Gola Walas',
    excerpt: 'Those colourful ice golas that turned ordinary afternoons into celebrations.',
    category: 'people-places',
    categoryLabel: 'People & Places',
    date: '2025-08-28',
    image: 'assets/images/blog/golawalekigali.jpeg',
  },
  {
    id: 4,
    title: 'Those Long Calls from Red Booths',
    excerpt: 'When a phone call was an event, not a quick text. Different times, deeper conversations.',
    category: 'vintage-things',
    categoryLabel: 'Vintage Things',
    date: '2025-08-18',
    image: 'assets/images/blog/wohlambicalls.jpeg',
  },
  {
    id: 5,
    title: "Summer Vacations at Nani's House",
    excerpt: 'Where every meal was a feast, every story a lesson, and every goodbye a small heartbreak.',
    category: 'childhood',
    categoryLabel: 'Childhood',
    date: '2025-08-10',
    image: 'assets/images/blog/post-5.jpg',
  },
  {
    id: 6,
    title: 'The Corner Chai Stall Chronicles',
    excerpt: "Cutting chai, biscuits, and conversations that solved the world's problems one cup at a time.",
    category: 'indian-streets',
    categoryLabel: 'Indian Streets',
    date: '2025-08-02',
    image: 'assets/images/blog/ekchaihazaarkisse.jpeg',
  },
  {
    id: 7,
    title: 'Letters We Never Sent',
    excerpt: 'The art of writing, folding, and waiting for a reply that meant the world.',
    category: 'vintage-things',
    categoryLabel: 'Vintage Things',
    date: '2025-07-24',
    image: 'assets/images/blog/post-7.jpg',
  },
  {
    id: 8,
    title: 'What the Monsoons Taught Us',
    excerpt: 'Paper boats, wet uniforms, and the simple joy of dancing in the first rain.',
    category: 'life-lessons',
    categoryLabel: 'Life Lessons',
    date: '2025-07-16',
    image: 'assets/images/blog/post-8.jpg',
  },
  {
    id: 9,
    title: 'The Old Photo Album',
    excerpt: 'Faded photographs that hold entire lifetimes inside their frames.',
    category: 'people-places',
    categoryLabel: 'People & Places',
    date: '2025-07-08',
    image: 'assets/images/blog/dostonkibaithak.jpeg',
  },
  {
    id: 10,
    title: 'Doordarshan Sundays',
    excerpt: 'When the whole family gathered around a single TV for one hour of magic.',
    category: 'childhood',
    categoryLabel: 'Childhood',
    date: '2025-06-30',
    image: 'assets/images/blog/post-10.jpg',
  },
  {
    id: 11,
    title: 'The Cycle Repairwala',
    excerpt: 'He fixed more than punctures — he patched up childhoods.',
    category: 'people-places',
    categoryLabel: 'People & Places',
    date: '2025-06-22',
    image: 'assets/images/blog/schoolkavosafar.jpeg',
  },
  {
    id: 12,
    title: 'Notebooks and Ink Stains',
    excerpt: 'The smell of fresh paper, the pressure of a good pen, the importance of neat handwriting.',
    category: 'vintage-things',
    categoryLabel: 'Vintage Things',
    date: '2025-06-14',
    image: 'assets/images/blog/post-12.jpg',
  },
];

// ── From js/blog-post.js — the 4 custom bodies ──
const BODIES = {
  1: {
    readTime: 5,
    content: [
      { type: 'p', text: "There was a time when music wasn't something you carried in your pocket. It lived in wooden cabinets, in the corner of a room, and in every cassette you ever rewound with a pencil." },
      { type: 'h2', text: 'The Ritual of the Radio' },
      { type: 'p', text: 'Sunday mornings meant one thing — the radio was on, and the whole house was listening. Nobody spoke over the songs. Nobody scrolled through anything. You just listened, really listened, and let the melodies fill up the room.' },
      { type: 'p', text: "Every family had that one radio, polished to a shine, sitting on a shelf like a small god. And when a song you loved came on, you didn't skip. You waited. You let it play all the way through, because there was no other way." },
      { type: 'quote', text: "Music didn't just play in our homes. It became the background score of our childhood." },
      { type: 'h2', text: 'Mixtapes and Memories' },
      { type: 'p', text: 'Then came the cassette. Suddenly you could choose. You could record. You could make a mixtape for a friend, spending hours carefully timing every track so nothing got cut off.' },
      { type: 'p', text: "A mixtape wasn't just music. It was a letter. It was a feeling. It was you, on a Tuesday evening, sitting beside a tape recorder, hoping the radio wouldn't play an ad when your favourite song came on." },
      { type: 'h2', text: 'Why It Still Matters' },
      { type: 'p', text: "We don't rewind cassettes anymore. We don't wait for the radio. But we still feel it — that shiver when an old song comes on. That sudden, sharp memory of a summer afternoon, a scooter ride, a friend's terrace." },
      { type: 'p', text: "The soundtrack didn't change. We did. And that's exactly why it still matters." },
    ],
  },
  2: {
    readTime: 4,
    content: [
      { type: 'p', text: "Gali cricket wasn't a sport. It was a religion, and every gully had its own rules, its own pitch, and its own legends." },
      { type: 'h2', text: 'The Pitch' },
      { type: 'p', text: 'One stump made of a stick. One tennis ball, worn thin from use. And a boundary — that imaginary line that ran where the neighbour aunty\u2019s window began.' },
      { type: 'quote', text: 'If the ball went into her house, you ran. If the ball broke her window, you ran faster.' },
      { type: 'h2', text: 'The Teams' },
      { type: 'p', text: 'The teams were never fair. But nobody cared. The youngest kid always batted first. The oldest always bowled. And when the evening light turned golden, everything became dramatic — every run a victory, every wicket a tragedy.' },
      { type: 'h2', text: 'The End of the Day' },
      { type: 'p', text: "Amma's voice from the balcony meant the match was over. The bat was handed over. The ball was pocketed. And you walked home, sweaty and happy, already planning the next evening's game." },
    ],
  },
  3: {
    readTime: 4,
    content: [
      { type: 'p', text: 'The gola wala arrived on his cart, pushing it slowly down the street, his bell announcing him before he came into view.' },
      { type: 'h2', text: 'The Cart' },
      { type: 'p', text: 'Crushed ice, colourful syrups, tiny wooden sticks, and a small block of ice he shaved down by hand. It looked like magic. It tasted like summer.' },
      { type: 'quote', text: 'Every colour was a different promise. Orange was mango. Pink was rose. Green was… well, green. You never asked. You just chose.' },
      { type: 'h2', text: 'The Choices' },
      { type: 'p', text: 'Sometimes you wanted the classic — plain ice with a squeeze of lemon. Sometimes you wanted the elaborate one, drenched in three syrups, the ice melting faster than you could eat it.' },
      { type: 'h2', text: 'The Feeling' },
      { type: 'p', text: 'The first bite was always too cold. The last bite always left you wanting more. And somewhere between them, you grew up a little, every summer, one gola at a time.' },
    ],
  },
  4: {
    readTime: 5,
    content: [
      { type: 'p', text: 'There was a red booth on the corner of the street. It had been there forever. And every time you stepped inside, the world outside went quiet.' },
      { type: 'h2', text: 'The Call' },
      { type: 'p', text: "You picked up the receiver. You dropped a coin. You waited for the tone. And when the voice on the other end picked up — your cousin, your grandmother, your friend who'd moved away — everything felt closer." },
      { type: 'quote', text: "A phone call wasn't a quick thing. It was an event. You planned for it. You looked forward to it. You remembered it." },
      { type: 'h2', text: 'The Queue' },
      { type: 'p', text: 'There was always a line. Always someone waiting. And the man who ran the booth knew every regular by name, by voice, and by the size of the coin they always dropped.' },
      { type: 'h2', text: 'The Feeling' },
      { type: 'p', text: "You didn't text back then. You called. You listened. And when the call ended, you walked out of that red booth carrying something you couldn't quite name — but you felt it for the rest of the day." },
    ],
  },
};

// ── From js/blog-post.js — the generic fallback body ──
const FALLBACK = {
  readTime: 4,
  content: [
    { type: 'p', text: "Some stories don't need grand events. They live in small moments — a song, a smell, a street corner you pass every day without noticing." },
    { type: 'h2', text: 'The Little Things' },
    { type: 'p', text: 'The mornings that started with the smell of filter coffee. The evenings that ended with the sound of a whistle. The in-between that we didn\u2019t know was precious until it was gone.' },
    { type: 'quote', text: "Nostalgia isn't about the past. It's about the pieces of ourselves we left behind in it." },
    { type: 'h2', text: 'Why We Remember' },
    { type: 'p', text: 'Because they shaped us. Because they made us who we are. And because every now and then, the smallest thing — a familiar tune, a stranger\u2019s laugh — brings it all rushing back.' },
    { type: 'p', text: "And that's why we write these stories. Not to go back. But to keep those moments alive for whoever needs them next." },
  ],
};

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function seedPosts({ reset = true } = {}) {
  if (reset) {
    await Post.deleteMany({});
    console.log('[seed] Cleared posts');
  }

  const docs = POSTS.map((p) => {
    const body = BODIES[p.id] || FALLBACK;
    return {
      slug: slugify(p.title),
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
      categoryLabel: p.categoryLabel,
      coverImage: p.image,
      publishedAt: new Date(p.date),
      readTimeMinutes: body.readTime,
      content: body.content,
      isPublished: true,
      authorName: 'The Retro Poshak Team',
    };
  });

  const inserted = await Post.insertMany(docs);
  console.log(`[seed] Inserted ${inserted.length} posts`);
  inserted.forEach((p) =>
    console.log(`        · ${p.title} (${p.content.length} blocks)`)
  );

  return { posts: inserted.length };
}