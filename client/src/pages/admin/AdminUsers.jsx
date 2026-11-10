import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User } from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function AdminUsers() {
  const [data, setData] = useState({ users: [], pagination: { page: 1, pages: 1 } });
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async (page = 1, search = q) => {
    setLoading(true);
    try {
      const res = await adminService.users.list({ q: search, page, limit: 20 });
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="font-display text-4xl tracking-wide text-ink">Customers</h1>
      <p className="text-sm text-ink-mute mt-1">{data.pagination.total} registered users</p>

      <form onSubmit={(e) => { e.preventDefault(); load(1); }} className="mt-8 flex gap-2 max-w-md relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute group-focus-within:text-ink transition-colors">
          <Search size={16} />
        </div>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or email..." className="input pl-11 h-12 shadow-sm rounded-full bg-cream-50" />
        <button className="btn-ghost rounded-full px-6 whitespace-nowrap shadow-sm">Search</button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-card border border-ink/10 bg-cream-50 shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-cream-100 text-left text-[11px] font-bold uppercase tracking-wide2 text-ink-mute border-b border-ink/10">
            <tr>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan="3" className="px-6 py-12 text-center text-ink-mute animate-pulse">Loading customers...</td></tr>}
            {!loading && data.users.length === 0 && <tr><td colSpan="3" className="px-6 py-12 text-center text-ink-mute">No customers found.</td></tr>}
            
            <AnimatePresence>
              {data.users.map((u) => (
                <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-b border-ink/5 last:border-0 hover:bg-white transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-ink/5 flex items-center justify-center text-ink-mute">
                        <User size={16} />
                      </div>
                      <span className="font-medium text-ink">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-ink">{u.email}</p>
                    <p className="text-[11px] text-ink-mute mt-0.5">{u.phone || 'No phone provided'}</p>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-ink-soft">
                    {new Date(u.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}