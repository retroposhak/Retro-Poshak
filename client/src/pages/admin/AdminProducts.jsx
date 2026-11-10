import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, Image as ImageIcon } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatINR } from '../../utils/formatCurrency';

// Helper to ensure image paths resolve correctly regardless of formatting
const resolveImage = (src) => {
  if (!src) return null;
  const clean = src.replace(/^\/+/, '');
  return clean.startsWith('http') || clean.startsWith('assets') ? `/${clean}` : `/${clean}`; 
};

export default function AdminProducts() {
  const [data, setData] = useState({ items: [], pagination: { page: 1, pages: 1 } });
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async (page = 1, search = q) => {
    setLoading(true);
    try {
      const res = await adminService.products.list({ q: search, page, limit: 20 });
      setData(res);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const remove = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await adminService.products.remove(id);
      toast.success('Product deleted');
      load(data.pagination.page);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-8">
        <div>
          <h1 className="font-display text-4xl tracking-wide text-ink">Products</h1>
          <p className="text-sm text-ink-mute mt-1">{data.pagination.total} items in catalog</p>
        </div>
        <Link to="/admin/products/new" className="btn-primary flex items-center gap-2 group">
          <Plus size={16} className="transition-transform group-hover:rotate-90" /> 
          <span>New Product</span>
        </Link>
      </div>

      <div className="mb-6">
        <form
          onSubmit={(e) => { e.preventDefault(); load(1); }}
          className="flex gap-2 max-w-md relative group"
        >
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute group-focus-within:text-ink transition-colors">
            <Search size={16} />
          </div>
          <input 
            value={q} 
            onChange={(e) => setQ(e.target.value)} 
            placeholder="Search products..." 
            className="input pl-11 h-12 shadow-sm rounded-full bg-cream-50" 
          />
          <button className="btn-ghost rounded-full px-6 whitespace-nowrap shadow-sm">Search</button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-card border border-ink/10 bg-cream-50 shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-cream-100 text-left text-[11px] font-bold uppercase tracking-wide2 text-ink-mute border-b border-ink/10">
            <tr>
              <th className="px-6 py-4">Product Details</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Inventory</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan="5" className="px-6 py-12 text-center text-ink-mute animate-pulse">Loading catalog...</td></tr>
            )}
            {!loading && data.items.length === 0 && (
              <tr><td colSpan="5" className="px-6 py-12 text-center text-ink-mute">No products found.</td></tr>
            )}
            <AnimatePresence>
              {data.items.map((p) => {
                const stock = p.variants?.reduce((s, v) => s + v.stock, 0) || 0;
                return (
                  <motion.tr 
                    key={p._id} 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="border-b border-ink/5 last:border-0 hover:bg-white transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-cream-200 border border-ink/5 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {p.images?.[0] ? (
                            <img 
                              src={resolveImage(p.images[0])} 
                              alt="" 
                              className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-500" 
                              onError={(e) => { 
                                e.target.style.display = 'none'; 
                                e.target.nextSibling.style.display = 'block'; 
                              }} 
                            />
                          ) : null}
                          <ImageIcon size={18} className="text-ink/20 hidden" />
                        </div>
                        <div>
                          <p className="font-medium text-ink text-[15px]">{p.name}</p>
                          <p className="text-[11px] text-ink-mute font-cond uppercase tracking-wider mt-0.5">{p.categories?.[0] || 'Uncategorized'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{formatINR(p.price)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold tracking-wide ${
                        stock === 0 ? 'bg-red/10 text-red' : stock < 10 ? 'bg-gold/10 text-gold' : 'bg-green/10 text-green'
                      }`}>
                        {stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`chip border-0 text-[10px] uppercase tracking-wider font-bold ${
                        p.isActive ? 'bg-green/10 text-green' : 'bg-ink/5 text-ink-mute'
                      }`}>
                        {p.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/admin/products/${p._id}`} className="p-2 rounded-full hover:bg-cream-200 text-ink-mute hover:text-ink transition-colors" title="Edit">
                          <Pencil size={16} />
                        </Link>
                        <button onClick={() => remove(p._id, p.name)} className="p-2 rounded-full hover:bg-red/10 text-ink-mute hover:text-red transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {data.pagination.pages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: data.pagination.pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => load(i + 1)}
              className={`h-10 min-w-[40px] rounded-full text-sm font-medium transition-all duration-300 ${
                data.pagination.page === i + 1 
                  ? 'bg-ink text-cream shadow-md scale-105' 
                  : 'bg-cream-50 text-ink-soft hover:bg-cream-200 border border-ink/10'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}