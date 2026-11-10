import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Tag } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatINR } from '../../utils/formatCurrency';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    code: '', description: '', type: 'percent', value: 10,
    minOrderValue: 0, maxDiscount: 0, usageLimit: 0, isActive: true,
  });

  const load = async () => {
    setLoading(true);
    try {
      setCoupons(await adminService.coupons.list());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await adminService.coupons.create(form);
      toast.success('Coupon created');
      setForm({ code: '', description: '', type: 'percent', value: 10, minOrderValue: 0, maxDiscount: 0, usageLimit: 0, isActive: true });
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this coupon?')) return;
    await adminService.coupons.remove(id);
    toast.success('Deleted');
    load();
  };

  const toggle = async (c) => {
    await adminService.coupons.update(c._id, { isActive: !c.isActive });
    load();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="font-display text-4xl tracking-wide text-ink">Coupons</h1>
      <p className="text-sm text-ink-mute mt-1">{coupons.length} active promotions</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px] items-start">
        
        {/* Coupon List */}
        <div className="overflow-x-auto rounded-card border border-ink/10 bg-cream-50 shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-cream-100 text-left text-[11px] font-bold uppercase tracking-wide2 text-ink-mute border-b border-ink/10">
              <tr>
                <th className="px-6 py-4">Code & Rule</th>
                <th className="px-6 py-4">Usage</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan="4" className="px-6 py-12 text-center text-ink-mute animate-pulse">Loading coupons...</td></tr>}
              {!loading && coupons.length === 0 && <tr><td colSpan="4" className="px-6 py-12 text-center text-ink-mute">No coupons found. Create one to get started.</td></tr>}
              <AnimatePresence>
                {coupons.map((c) => (
                  <motion.tr key={c._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-b border-ink/5 last:border-0 hover:bg-white transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-ink/5 flex items-center justify-center text-ink/60">
                          <Tag size={18} />
                        </div>
                        <div>
                          <p className="font-bold tracking-wider text-ink flex items-center gap-2">
                            {c.code}
                            {c.description && <span className="text-[10px] font-normal text-ink-mute bg-cream-200 px-2 py-0.5 rounded-full">{c.description}</span>}
                          </p>
                          <p className="text-[11px] text-ink-mute mt-0.5">
                            {c.type === 'percent' ? `${c.value}% off` : `${formatINR(c.value)} off`}
                            {c.maxDiscount > 0 && c.type === 'percent' && ` (max ${formatINR(c.maxDiscount)})`}
                            {c.minOrderValue > 0 && ` · min ${formatINR(c.minOrderValue)}`}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-ink-soft">
                      {c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ' / ∞'}
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => toggle(c)} className={`chip border-0 text-[10px] uppercase tracking-wider font-bold shadow-sm ${c.isActive ? 'bg-green/15 text-green' : 'bg-ink/10 text-ink-mute'}`}>
                        {c.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => remove(c._id)} className="p-2 rounded-full hover:bg-red/10 text-ink-mute hover:text-red transition-colors opacity-0 group-hover:opacity-100" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Create Form */}
        <form onSubmit={submit} className="card p-6 md:p-8 space-y-4 border border-ink/5 shadow-sm sticky top-10">
          <h3 className="font-serif text-2xl mb-2 border-b border-ink/10 pb-3">Create Promo</h3>
          <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="CODE (e.g. WELCOME10)" className="input bg-cream-50 font-bold tracking-wider" />
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short description (optional)" className="input bg-cream-50 text-sm" />
          
          <div className="grid grid-cols-2 gap-3">
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input bg-cream-50 font-medium cursor-pointer">
              <option value="percent">Percentage %</option>
              <option value="flat">Flat Amount ₹</option>
            </select>
            <input type="number" min="0" required value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} placeholder="Value" className="input bg-cream-50" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <input type="number" min="0" value={form.minOrderValue} onChange={(e) => setForm({ ...form, minOrderValue: Number(e.target.value) })} placeholder="Min order ₹" className="input bg-cream-50" />
            <input type="number" min="0" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: Number(e.target.value) })} placeholder="Max discount ₹" className="input bg-cream-50" />
          </div>
          
          <input type="number" min="0" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })} placeholder="Usage limit (0 = Unlimited)" className="input bg-cream-50" />
          
          <button className="btn-primary w-full mt-4">Create Coupon</button>
        </form>
      </div>
    </motion.div>
  );
}