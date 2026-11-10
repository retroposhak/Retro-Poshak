import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { adminService } from '../../services/adminService';
import { formatINR } from '../../utils/formatCurrency';

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [data, setData] = useState({ orders: [], pagination: { page: 1, pages: 1 } });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async (page = 1, s = status) => {
    setLoading(true);
    try {
      const res = await adminService.orders.list({ status: s, page, limit: 20 });
      setData(res);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1, status); /* eslint-disable-next-line */ }, [status]);

  const changeStatus = async (id, next) => {
    try {
      await adminService.orders.updateStatus(id, next);
      toast.success(`Order marked ${next}`);
      load(data.pagination.page, status);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="font-display text-4xl tracking-wide text-ink">Orders</h1>
      <p className="text-sm text-ink-mute mt-1">{data.pagination.total} total orders</p>

      <div className="mt-6 flex gap-2 flex-wrap pb-4 border-b border-ink/10">
        <button onClick={() => setStatus('')} className={`chip px-4 py-2 font-bold uppercase tracking-wider text-[10px] ${!status ? 'bg-ink text-cream border-ink shadow-md' : 'bg-cream-50 text-ink-mute'}`}>All Orders</button>
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setStatus(s)} className={`chip px-4 py-2 font-bold uppercase tracking-wider text-[10px] capitalize ${status === s ? 'bg-ink text-cream border-ink shadow-md' : 'bg-cream-50 text-ink-mute'}`}>{s}</button>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-card border border-ink/10 bg-cream-50 shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-cream-100 text-left text-[11px] font-bold uppercase tracking-wide2 text-ink-mute border-b border-ink/10">
            <tr>
              <th className="px-6 py-4">Order</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Payment</th>
              <th className="px-6 py-4">Fulfillment</th>
              <th className="px-6 py-4 text-right">Tracking</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan="6" className="px-6 py-12 text-center text-ink-mute animate-pulse">Loading orders...</td></tr>}
            {!loading && data.orders.length === 0 && <tr><td colSpan="6" className="px-6 py-12 text-center text-ink-mute">No orders found.</td></tr>}
            
            <AnimatePresence>
              {data.orders.map((o) => (
                <motion.tr key={o._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-b border-ink/5 last:border-0 hover:bg-white transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-ink tracking-wide">#{o.orderId}</p>
                    <p className="text-[11px] text-ink-mute font-cond uppercase mt-0.5">{new Date(o.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{o.user?.name || 'Guest'}</p>
                    <p className="text-[11px] text-ink-mute">{o.user?.email || '—'}</p>
                  </td>
                  <td className="px-6 py-4 font-medium">{formatINR(o.total)}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cream-100 text-[11px] font-bold uppercase tracking-wider">
                      {o.paymentMethod} · <span className={o.paymentStatus === 'paid' ? 'text-green' : 'text-gold'}>{o.paymentStatus}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={o.status}
                      onChange={(e) => changeStatus(o._id, e.target.value)}
                      className={`input py-1.5 px-3 text-xs font-bold uppercase tracking-wider cursor-pointer border-0 ring-1 ring-inset ${
                        o.status === 'delivered' ? 'bg-green/10 text-green ring-green/20' :
                        o.status === 'cancelled' ? 'bg-red/10 text-red ring-red/20' :
                        'bg-cream-200 text-ink ring-ink/10'
                      }`}
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <TrackingInput
                      value={o.trackingNumber}
                      onSave={(v) => adminService.orders.updateTracking(o._id, v).then(() => toast.success('Tracking saved')).catch(() => toast.error('Failed'))}
                    />
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {data.pagination.pages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: data.pagination.pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => load(i + 1, status)}
              className={`h-10 min-w-[40px] rounded-full text-sm font-medium transition-all duration-300 ${
                data.pagination.page === i + 1 ? 'bg-ink text-cream shadow-md scale-105' : 'bg-cream-50 text-ink-soft hover:bg-cream-200 border border-ink/10'
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

function TrackingInput({ value, onSave }) {
  const [v, setV] = useState(value || '');
  return (
    <div className="flex items-center justify-end gap-2">
      <input
        placeholder="Add tracking #"
        value={v}
        onChange={(e) => setV(e.target.value)}
        className="input py-1.5 px-3 text-xs w-32 bg-cream-50 focus:bg-white"
      />
      <button onClick={() => onSave(v)} className="text-[10px] font-bold uppercase tracking-wider text-ink-mute hover:text-red transition-colors bg-cream-200 px-2 py-1.5 rounded">
        Save
      </button>
    </div>
  );
}