import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ShoppingBag, Users, IndianRupee } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatINR } from '../../utils/formatCurrency';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminService.stats().then(setStats).catch(() => {});
  }, []);

  if (!stats) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-10 w-48 bg-cream-200 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-cream-200 rounded-card" />)}
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h1 className="font-display text-4xl tracking-wide text-ink">Dashboard</h1>
      <p className="text-sm text-ink-mute mt-1">Overview of your store's performance.</p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={IndianRupee} label="Total Revenue" value={formatINR(stats.revenue)} delay={0.1} />
        <StatCard icon={ShoppingBag} label="Total Orders" value={stats.orders} delay={0.2} />
        <StatCard icon={Users} label="Customers" value={stats.customers} delay={0.3} />
        <StatCard
          icon={Package}
          label="Low Stock Alerts"
          value={stats.lowStock.length}
          tone={stats.lowStock.length > 0 ? 'warn' : 'ok'}
          delay={0.4}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="card p-6 border border-ink/5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl">Recent Orders</h2>
            <Link to="/admin/orders" className="text-[10px] font-bold uppercase tracking-wide2 text-red hover:underline">View All</Link>
          </div>
          <div className="space-y-3 text-sm">
            {stats.recentOrders.length === 0 && (
              <p className="text-ink-mute text-center py-4">No orders yet.</p>
            )}
            {stats.recentOrders.map((o) => (
              <Link
                key={o._id}
                to={`/admin/orders`}
                className="flex items-center justify-between rounded-xl px-4 py-3 border border-transparent hover:border-ink/5 hover:bg-cream-50 transition-all group"
              >
                <div className="flex flex-col">
                  <span className="font-medium group-hover:text-red transition-colors">#{o.orderId}</span>
                  <span className="text-[11px] text-ink-mute capitalize mt-0.5">{o.status}</span>
                </div>
                <span className="font-medium bg-cream-100 px-3 py-1 rounded-full">{formatINR(o.total)}</span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Low Stock */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="card p-6 border border-ink/5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl">Inventory Alerts</h2>
            <Link to="/admin/products" className="text-[10px] font-bold uppercase tracking-wide2 text-red hover:underline">Manage</Link>
          </div>
          <div className="space-y-3 text-sm">
            {stats.lowStock.length === 0 && (
              <p className="text-ink-mute text-center py-4">All products are well-stocked.</p>
            )}
            {stats.lowStock.map((p) => (
              <div key={p._id} className="flex items-center justify-between rounded-xl px-4 py-3 bg-cream-50">
                <span className="font-medium truncate pr-4">{p.name}</span>
                <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                  p.minStock === 0 ? 'bg-red/10 text-red' : 'bg-gold/10 text-gold'
                }`}>
                  {p.minStock === 0 ? 'Out of stock' : `${p.minStock} left`}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function StatCard({ icon: Icon, label, value, tone = 'ok', delay = 0 }) {
  const isWarn = tone === 'warn';
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className={`card p-6 border relative overflow-hidden group ${
        isWarn ? 'border-red/20' : 'border-ink/5'
      }`}
    >
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 transition-transform group-hover:scale-110 ${isWarn ? 'bg-red' : 'bg-ink'}`} />
      <div className="flex items-center justify-between relative z-10">
        <div className={`p-2.5 rounded-lg ${isWarn ? 'bg-red/10 text-red' : 'bg-cream-200 text-ink-mute'}`}>
          <Icon size={20} />
        </div>
      </div>
      <p className="mt-4 text-3xl font-display tracking-wide relative z-10">{value}</p>
      <p className="text-xs font-bold uppercase tracking-wide2 text-ink-mute mt-1 relative z-10">{label}</p>
    </motion.div>
  );
}