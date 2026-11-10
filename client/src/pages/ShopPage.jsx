import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
import { productService } from '../services/productService';
import ProductGrid from '../components/products/ProductGrid';
import EmptyState from '../components/common/EmptyState';
import useDebounce from '../hooks/useDebounce';

const TABS = [
  { id: '', label: 'All Products', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg> },
  { 
    id: 'childhood', 
    label: 'Childhood', 
    dbSlugs: ['ready-set-bachpan', 'school-ka-vo-safar'], 
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="5.5" cy="17.5" r="3.5"></circle><circle cx="18.5" cy="17.5" r="3.5"></circle><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2"></path></svg> 
  },
  { 
    id: 'vintage', 
    label: 'Vintage', 
    dbSlugs: ['woh-gaane-woh-din'], 
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="1"></rect><circle cx="7" cy="12" r="2"></circle><circle cx="17" cy="12" r="2"></circle><path d="M9 12h6"></path></svg> 
  },
  { 
    id: 'indian-streets', 
    label: 'Indian Streets', 
    dbSlugs: ['gali-cricket', 'ek-chai-hazaar-kisse'], 
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 9h.01M15 9h.01M9 13h.01M15 13h.01"></path></svg> 
  },
  { 
    id: 'everyday', 
    label: 'Everyday Memories', 
    dbSlugs: ['doston-ki-baithak', 'gola-wale-ki-gali'], 
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 8 6H4l4 4-3 3 3 3-4 4h4l4 4 4-4h4l-4-4 3-3-3-3 4-4h-4z"></path></svg> 
  },
];

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
];

export default function ShopPage() {
  const [params, setParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ items: [], pagination: { page: 1, pages: 1, total: 0 } });
  const [searchInput, setSearchInput] = useState(params.get('q') || '');
  const debouncedSearch = useDebounce(searchInput, 350);

  const filters = useMemo(() => {
    return {
      q: params.get('q') || '',
      category: params.get('category') || '',
      colors: (params.get('colors') || '').split(',').filter(Boolean),
      maxPrice: params.get('maxPrice') ? Number(params.get('maxPrice')) : 2000,
      sort: params.get('sort') || 'featured',
      page: Number(params.get('page') || 1),
    };
  }, [params]);

  useEffect(() => {
    if (debouncedSearch === filters.q) return;
    const next = new URLSearchParams(params);
    if (debouncedSearch) next.set('q', debouncedSearch);
    else next.delete('q');
    next.set('page', '1');
    setParams(next, { replace: true });
  }, [debouncedSearch]);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    let dbCategory = filters.category;
    if (filters.category !== '') {
      const tab = TABS.find(t => t.id === filters.category);
      if (tab && tab.dbSlugs) {
        dbCategory = tab.dbSlugs[0]; 
      }
    }

    productService
      .list({
        q: filters.q,
        category: dbCategory,
        colors: filters.colors.join(','),
        maxPrice: filters.maxPrice,
        sort: filters.sort,
        page: filters.page,
        limit: 12,
      })
      .then((res) => alive && setData(res))
      .catch((e) => console.error(e))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [filters]);

  const updateFilters = (next) => {
    const p = new URLSearchParams();
    if (next.q) p.set('q', next.q);
    if (next.category) p.set('category', next.category);
    if (next.colors?.length) p.set('colors', next.colors.join(','));
    if (next.maxPrice && next.maxPrice < 2000) p.set('maxPrice', String(next.maxPrice));
    if (next.sort && next.sort !== 'featured') p.set('sort', next.sort);
    if (next.page && next.page > 1) p.set('page', String(next.page));
    setParams(p, { replace: true });
  };

  const availableColors = useMemo(() => {
    const colors = new Map();
    data.items.forEach((p) =>
      (p.colors || []).forEach((c) => {
        if (!colors.has(c)) {
          colors.set(c, p.colorHex?.[c] || '#ccc');
        }
      })
    );
    return Array.from(colors.entries()).map(([name, hex]) => ({ name, hex }));
  }, [data.items]);

  const hasActiveFilters = 
    filters.q || 
    filters.category || 
    filters.colors.length > 0 || 
    filters.maxPrice < 2000;

  const clearAllFilters = () => {
    setParams(new URLSearchParams());
    setSearchInput('');
  };

  return (
    <main className="bg-[#F7F3EC] min-h-screen">
      {/* SHOP HERO BANNER */}
      <div className="relative h-[35vh] md:h-[45vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: "url('/assets/images/shop-hero.jpeg')" }} 
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 text-center px-4">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-[#E8DCC4] text-[11px] font-cond tracking-[0.4em] uppercase mb-4 block drop-shadow-md">
            Explore Our Collection
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="font-serif text-6xl md:text-8xl text-[#F7F3EC] italic drop-shadow-2xl mb-4">
            Shop
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="font-script text-3xl md:text-4xl text-[#E8DCC4] rotate-[-2deg] drop-shadow-md">
            Nostalgia you can wear.
          </motion.p>
        </div>

        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} className="absolute bottom-8 right-8 hidden lg:block">
          <p className="font-script text-3xl text-[#E8DCC4]/90 text-right leading-tight drop-shadow-md">
            Same<br/>streets.<br/>Different<br/>generations.
          </p>
        </motion.div>
      </div>

      {/* HORIZONTAL CATEGORY TABS */}
      <div className="bg-[#F7F3EC] border-b border-[#1A1715]/10 shadow-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-start md:justify-center gap-4 md:gap-12 overflow-x-auto hide-scrollbar">
            {TABS.map((tab, idx) => {
              const isActive = filters.category === tab.id;
              return (
                <button
                  key={idx}
                  onClick={() => updateFilters({ ...filters, category: tab.id, page: 1 })}
                  className={`flex flex-col items-center gap-2 py-6 px-2 border-b-[3px] transition-all min-w-[100px] ${
                    isActive ? 'border-[#b33a3a] text-[#b33a3a]' : 'border-transparent text-[#1A1715]/60 hover:text-[#1A1715]'
                  }`}
                >
                  <span className="opacity-80">{tab.icon}</span>
                  <span className="text-[13px] font-cond tracking-wide uppercase whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-12 lg:grid-cols-[240px_1fr]">
          
          {/* SIDEBAR FILTERS */}
          <aside className="hidden lg:block text-[#1A1715]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-serif text-2xl">Filters</h3>
              {hasActiveFilters && (
                <button 
                  onClick={clearAllFilters}
                  className="text-[11px] font-cond uppercase tracking-wider text-red-600 hover:text-red-800 underline underline-offset-4"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="mb-8 border-b border-[#1A1715]/10 pb-8">
              <h4 className="text-[11px] font-bold uppercase tracking-widest mb-4">Category</h4>
              <ul className="space-y-3">
                {TABS.map((tab) => {
                  const isActive = filters.category === tab.id;
                  return (
                    <li key={tab.id}>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${isActive ? 'border-[#b33a3a] bg-[#b33a3a]' : 'border-[#1A1715]/30 group-hover:border-[#1A1715]'}`}>
                          {isActive && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                        </div>
                        <span className={`text-sm font-sans ${isActive ? 'text-[#b33a3a]' : 'text-[#1A1715]/80 group-hover:text-[#1A1715]'}`}>{tab.label}</span>
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={isActive} 
                          onChange={() => updateFilters({ ...filters, category: tab.id, page: 1 })} 
                        />
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Colors */}
            <div className="mb-8 border-b border-[#1A1715]/10 pb-8">
              <h4 className="text-[11px] font-bold uppercase tracking-widest mb-4">Colour</h4>
              <div className="flex gap-3 flex-wrap">
                {availableColors.map((c) => {
                  const active = filters.colors.includes(c.name);
                  return (
                    <button
                      key={c.name}
                      onClick={() => {
                        const next = active ? filters.colors.filter(x => x !== c.name) : [...filters.colors, c.name];
                        updateFilters({ ...filters, colors: next, page: 1 });
                      }}
                      className={`relative w-7 h-7 rounded-full border transition-transform hover:scale-110 flex items-center justify-center ${active ? 'border-[#b33a3a] scale-110 shadow-md' : 'border-[#1A1715]/10 shadow-sm'}`}
                      title={c.name}
                    >
                      <span className="w-5 h-5 rounded-full" style={{ backgroundColor: c.hex }} />
                      {active && <span className="absolute inset-0 flex items-center justify-center"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={c.hex === '#262220' || c.hex === '#3b4a63' ? 'white' : 'black'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price */}
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest mb-4">Price</h4>
              <div className="px-1">
                <input
                  type="range"
                  min={0}
                  max={2000}
                  step="50"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilters({ ...filters, maxPrice: Number(e.target.value), page: 1 })}
                  className="w-full accent-[#b33a3a]"
                />
                <div className="flex justify-between text-xs font-sans text-[#1A1715]/60 mt-2">
                  <span>₹0</span>
                  <span>₹{filters.maxPrice}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* PRODUCTS AREA */}
          <div>
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <span className="text-sm font-sans text-[#1A1715]/60">
                {loading ? 'Loading stories...' : `${data.pagination.total} Products`}
              </span>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <input
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search..."
                  className="border-b border-[#1A1715]/20 bg-transparent px-2 py-2 text-sm outline-none focus:border-[#1A1715] w-full sm:w-48 font-sans placeholder:text-[#1A1715]/40 transition-colors"
                />
                
                <div className="flex items-center gap-2 text-sm font-sans w-full sm:w-auto">
                  <span className="text-[#1A1715]/60 whitespace-nowrap hidden sm:inline">Sort by:</span>
                  <div className="relative w-full sm:w-auto">
                    <select
                      value={filters.sort}
                      onChange={(e) => updateFilters({ ...filters, sort: e.target.value, page: 1 })}
                      className="appearance-none border border-[#1A1715]/20 bg-transparent px-4 py-2 pr-8 outline-none focus:border-[#1A1715] w-full text-[#1A1715] text-xs font-medium cursor-pointer"
                    >
                      {SORT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#1A1715]/60" />
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filter Chips */}
            {filters.colors.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => updateFilters({ ...filters, colors: filters.colors.filter(c => c !== color), page: 1 })}
                    className="flex items-center gap-2 bg-[#EBE4D8] text-[#1A1715] text-[11px] font-cond uppercase tracking-wider px-3 py-1.5 rounded-full hover:bg-[#1A1715] hover:text-[#F7F3EC] transition-colors"
                  >
                    {color} <X size={12} />
                  </button>
                ))}
              </div>
            )}

            {/* Grid - PASSING activeColors DOWN */}
            {!loading && data.items.length === 0 ? (
              <EmptyState
                icon="🔍"
                title="No stories match"
                description="Try a different category, colour, or search term."
                ctaLabel="Clear filters"
                onCtaClick={clearAllFilters}
              />
            ) : (
              <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}>
                <ProductGrid 
                  products={data.items} 
                  loading={loading} 
                  activeColors={filters.colors} 
                />
              </motion.div>
            )}

            {/* Pagination */}
            {data.pagination.pages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-2">
                {Array.from({ length: data.pagination.pages }).map((_, i) => {
                  const page = i + 1;
                  const active = page === filters.page;
                  return (
                    <button
                      key={page}
                      onClick={() => updateFilters({ ...filters, page })}
                      className={`h-10 min-w-[40px] rounded-full px-3 text-sm font-medium transition-all ${
                        active ? 'bg-[#1A1715] text-[#F7F3EC] shadow-md' : 'bg-transparent border border-[#1A1715]/20 text-[#1A1715]/60 hover:border-[#1A1715] hover:text-[#1A1715]'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}