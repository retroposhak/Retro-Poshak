import { SORT_OPTIONS } from '../../utils/constants';

export default function ProductFilters({ categories, filters, onChange, priceBounds }) {
  const toggleColor = (color) => {
    const next = filters.colors.includes(color)
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];
    onChange({ ...filters, colors: next, page: 1 });
  };

  const setCategory = (slug) => {
    onChange({ ...filters, category: slug, page: 1 });
  };

  const setPrice = (key, value) => {
    onChange({ ...filters, [key]: value, page: 1 });
  };

  const hasActiveFilters = filters.q || filters.category || filters.colors.length > 0 || filters.maxPrice < 2000;

  return (
    <aside className="space-y-8 text-[#1A1715]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-serif text-2xl">Filters</h3>
        {hasActiveFilters && (
          <button 
            onClick={() => onChange({ category: '', colors: [], maxPrice: 2000, page: 1, sort: filters.sort })}
            className="text-[11px] font-cond uppercase tracking-wider text-[#b33a3a] hover:text-[#1A1715] underline underline-offset-4 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="border-b border-[#1A1715]/10 pb-8">
        <h4 className="text-[11px] font-bold uppercase tracking-widest mb-4">Category</h4>
        <ul className="space-y-3">
          <li>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${!filters.category ? 'border-[#b33a3a] bg-[#b33a3a]' : 'border-[#1A1715]/30 group-hover:border-[#1A1715]'}`}>
                {!filters.category && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
              </div>
              <span className={`text-sm font-sans ${!filters.category ? 'text-[#b33a3a]' : 'text-[#1A1715]/80 group-hover:text-[#1A1715]'}`}>All Products</span>
              <input type="checkbox" className="hidden" checked={!filters.category} onChange={() => setCategory('')} />
            </label>
          </li>
          {categories.map((c) => {
            const isActive = filters.category === c.slug;
            return (
              <li key={c.slug}>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${isActive ? 'border-[#b33a3a] bg-[#b33a3a]' : 'border-[#1A1715]/30 group-hover:border-[#1A1715]'}`}>
                    {isActive && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                  </div>
                  <span className={`text-sm font-sans ${isActive ? 'text-[#b33a3a]' : 'text-[#1A1715]/80 group-hover:text-[#1A1715]'}`}>{c.label}</span>
                  <input type="checkbox" className="hidden" checked={isActive} onChange={() => setCategory(c.slug)} />
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Colors */}
      {priceBounds?.colors?.length > 0 && (
        <div className="border-b border-[#1A1715]/10 pb-8">
          <h4 className="text-[11px] font-bold uppercase tracking-widest mb-4">Colour</h4>
          <div className="flex flex-wrap gap-3">
            {priceBounds.colors.map((c) => {
              const active = filters.colors.includes(c.name);
              return (
                <button
                  key={c.name}
                  onClick={() => toggleColor(c.name)}
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
      )}

      {/* Price */}
      <div>
        <h4 className="text-[11px] font-bold uppercase tracking-widest mb-4">Price</h4>
        <div className="px-1">
          <input
            type="range"
            min={0}
            max={2000}
            step="50"
            value={filters.maxPrice ?? 2000}
            onChange={(e) => setPrice('maxPrice', Number(e.target.value))}
            className="w-full accent-[#b33a3a]"
          />
          <div className="flex justify-between text-xs font-sans text-[#1A1715]/60 mt-2">
            <span>₹0</span>
            <span>₹{filters.maxPrice ?? 2000}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}