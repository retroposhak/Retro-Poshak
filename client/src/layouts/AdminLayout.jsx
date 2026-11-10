import { NavLink, Link, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Ticket,
  ArrowLeft,
} from 'lucide-react';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/users', label: 'Customers', icon: Users },
  { to: '/admin/coupons', label: 'Coupons', icon: Ticket },
];

export default function AdminLayout() {
  return (
    <div className="min-h-[100dvh] bg-cream-100 flex font-sans text-ink">
      {/* ── SIDEBAR ── */}
      <motion.aside 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-64 flex-shrink-0 border-r border-ink/10 bg-cream-50 hidden md:flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20 relative"
      >
        <div className="p-8 pb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-ink-mute hover:text-red transition-colors">
            <ArrowLeft size={14} /> Back to store
          </Link>
          <h1 className="mt-6 font-display text-3xl tracking-wide text-ink flex items-center gap-1">
            Admin<span className="text-red">.</span>
          </h1>
          <p className="font-script text-lg text-ink/40 mt-1">Retro Poshak</p>
        </div>

        <nav className="flex-1 space-y-1.5 px-4 mt-4">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                  isActive 
                    ? 'text-cream bg-ink shadow-md' 
                    : 'text-ink-soft hover:bg-cream-200 hover:text-ink'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className={isActive ? 'text-cream' : 'text-ink-mute'} />
                  {label}
                  {isActive && (
                    <motion.div layoutId="nav-indicator" className="absolute inset-0 bg-ink rounded-xl -z-10 shadow-lg" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-ink-mute border-t border-ink/10">
          Est. 2026 · Admin Panel
        </div>
      </motion.aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 min-w-0 flex flex-col h-[100dvh] overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden border-b border-ink/10 bg-cream-50/80 backdrop-blur-md p-4 flex items-center justify-between sticky top-0 z-30">
          <Link to="/" className="text-xs font-bold text-ink-mute hover:text-red flex items-center gap-1">
            <ArrowLeft size={14} /> Store
          </Link>
          <span className="font-display text-lg">Admin<span className="text-red">.</span></span>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-10 relative">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}