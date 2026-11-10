import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { postService } from '../services/postService';
import BlogCard from '../components/blog/BlogCard';
import useDebounce from '../hooks/useDebounce';

const CATEGORIES = [
  { slug: '', label: 'All Posts' },
  { slug: 'childhood', label: 'Childhood' },
  { slug: 'indian-streets', label: 'Indian Streets' },
  { slug: 'people-places', label: 'People & Places' },
  { slug: 'vintage-things', label: 'Vintage Things' },
  { slug: 'life-lessons', label: 'Life Lessons' },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

export default function BlogListPage() {
  const [category, setCategory] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 350);
  const [data, setData] = useState({ items: [], pagination: { total: 0 } });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    postService
      .list({ category, q: debouncedSearch, limit: 12 })
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category, debouncedSearch]);

  return (
    <main className="bg-[#F7F3EC] min-h-screen overflow-hidden">
      
      {/* ═══════════ HERO SECTION ═══════════ */}
      <section className="relative w-full flex flex-col justify-center bg-[#F7F3EC] pt-16 pb-12 lg:pt-24 lg:pb-16 overflow-hidden">
        
        {/* Subtle Grain Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-30 mix-blend-multiply" 
          style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }} 
        />

        {/* Floating Polaroids (Decorative) */}
        <motion.div 
          animate={{ y: [0, -10, 0], rotate: [-8, -6, -8] }} 
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute left-4 top-10 md:left-10 md:top-16 w-32 md:w-48 bg-white p-2 pb-6 shadow-xl z-10 hidden md:block"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-5 bg-[#C8A97E]/40 mix-blend-multiply" />
          <img src="/assets/images/shopbystory/galicricket.jpeg" alt="Polaroid 1" className="w-full h-32 md:h-48 object-cover grayscale-[20%]" />
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 10, 0], rotate: [5, 3, 5] }} 
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          className="absolute left-16 bottom-10 md:left-24 md:bottom-20 w-32 md:w-48 bg-white p-2 pb-6 shadow-xl z-10 hidden lg:block"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-5 bg-[#C8A97E]/40 mix-blend-multiply" />
          <img src="/assets/images/shopbystory/schoolkavosafar.jpeg" alt="Polaroid 2" className="w-full h-32 md:h-48 object-cover grayscale-[20%]" />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl ml-0 md:ml-48 lg:ml-64"
          >
            <motion.span variants={fadeUp} className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#b33a3a] block mb-6">
              Our Blog
            </motion.span>
            <motion.h1 variants={fadeUp} className="font-serif text-[70px] md:text-[100px] lg:text-[120px] text-[#1A1715] leading-[0.85] tracking-tight">
              Stories<br/>from<br/>Yesteryear<span className="text-[#b33a3a]">.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="font-script text-3xl md:text-4xl text-[#b33a3a] mt-8 rotate-[-2deg]">
              Same streets.<br/>
              Different generations.<br/>
              <em className="text-[#1A1715] not-italic text-2xl mt-2 block">Same feelings. ♡</em>
            </motion.p>
          </motion.div>
        </div>

        {/* Top Right Note */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="absolute top-16 right-12 font-script text-4xl text-[#1A1715] text-right hidden lg:block z-20 drop-shadow-sm"
        >
          Nostalgia<br/>Lives Here.
        </motion.div>
      </section>

      {/* ═══════════ TOOLBAR (Tabs & Search) ═══════════ */}
      <div className="border-y border-[#1A1715]/10 bg-[#F7F3EC]/95 backdrop-blur-md sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between py-4 gap-4">
          
          {/* Categories */}
          <div className="flex items-center overflow-x-auto hide-scrollbar w-full lg:w-auto gap-6 lg:gap-8">
            {CATEGORIES.map((c) => (
              <button
                key={c.slug}
                onClick={() => setCategory(c.slug)}
                className={`whitespace-nowrap py-1 text-sm font-sans font-medium transition-colors relative ${
                  category === c.slug ? 'text-[#1A1715]' : 'text-[#1A1715]/50 hover:text-[#1A1715]'
                }`}
              >
                {c.label}
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-[#b33a3a] transition-all duration-300 ${
                  category === c.slug ? 'w-full' : 'w-0'
                }`} />
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-72 group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1A1715]/40 group-focus-within:text-[#b33a3a] transition-colors" />
            <input
              type="search"
              placeholder="Search stories..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-transparent border border-[#1A1715]/15 rounded-full text-sm outline-none focus:border-[#1A1715] placeholder:text-[#1A1715]/40 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* ═══════════ BLOG GRID ═══════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative min-h-[40vh]">
        
        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#b33a3a]"></div>
          </div>
        )}
        
        {!loading && data.items.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <h3 className="font-serif text-2xl text-[#1A1715]">No stories found</h3>
            <p className="text-[#1A1715]/50 mt-2">Try a different category or search term.</p>
          </motion.div>
        )}

        {!loading && data.items.length > 0 && (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-stretch"
          >
            {data.items.map((p) => (
              <BlogCard key={p.id} post={p} />
            ))}
          </motion.div>
        )}
      </section>

    </main>
  );
}