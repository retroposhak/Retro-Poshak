import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PackageOpen, ArrowRight } from 'lucide-react';
import { orderService } from '../services/orderService';
import { formatINR } from '../utils/formatCurrency';
import EmptyState from '../components/common/EmptyState';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  let formattedPath = path.startsWith('/') ? path : `/${path}`;
  return formattedPath.replace(/ /g, '%20');
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService
      .list()
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="bg-[#F7F3EC] min-h-screen py-16">
        <div className="container-page max-w-4xl">
          <div className="h-12 w-48 rounded-full bg-[#EBE4D8] mb-10 animate-pulse" />
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-40 rounded-3xl bg-[#EBE4D8] animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#F7F3EC] min-h-screen py-16">
      <div className="container-page max-w-4xl">
        
        <div className="flex items-center gap-4 mb-4">
          <Link to="/profile" className="text-xs font-bold tracking-[0.15em] uppercase text-[#1A1715]/50 hover:text-[#b33a3a] transition-colors">
            ← Back to profile
          </Link>
        </div>

        <h1 className="font-serif text-5xl text-[#1A1715] mb-10">My Orders<span className="text-[#b33a3a]">.</span></h1>

        {orders.length === 0 ? (
          <EmptyState
            icon="📦"
            title="No orders yet"
            description="Your order history will appear here once you place your first order."
            ctaLabel="Start Shopping"
            ctaHref="/shop"
          />
        ) : (
          <motion.div 
            initial="hidden" animate="visible"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
            className="space-y-6"
          >
            {orders.map((o) => (
              <motion.div 
                key={o.orderId}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
              >
                <Link
                  to={`/orders/${o.orderId}`}
                  className="group block bg-[#FCFAF5] border border-[#1A1715]/10 rounded-3xl p-6 sm:p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1A1715]/10 pb-4 mb-6">
                    <div>
                      <p className="font-serif text-xl text-[#1A1715]">Order #{o.orderId}</p>
                      <p className="text-xs font-sans text-[#1A1715]/50 mt-1">
                        Placed on {new Date(o.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </p>
                    </div>
                    <StatusChip status={o.status} />
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      {o.items.slice(0, 3).map((i, idx) => (
                        <img 
                          key={idx} 
                          src={getImageUrl(i.image)} 
                          alt="" 
                          className="h-16 w-14 rounded-xl object-cover bg-[#EBE4D8] border-2 border-[#FCFAF5] shadow-sm" 
                          onError={(e) => { e.target.style.display='none'; }}
                        />
                      ))}
                      {o.items.length > 3 && (
                        <div className="h-16 w-14 rounded-xl bg-[#EBE4D8] border-2 border-[#FCFAF5] flex items-center justify-center text-xs font-bold text-[#1A1715]/50 shadow-sm z-10">
                          +{o.items.length - 3}
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-auto text-right">
                      <p className="text-xs font-sans text-[#1A1715]/50 mb-1">Total Amount</p>
                      <p className="font-serif text-xl text-[#1A1715]">{formatINR(o.total)}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-end text-xs font-bold tracking-[0.15em] uppercase text-[#b33a3a] group-hover:text-[#1A1715] transition-colors">
                    View Details <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}

export function StatusChip({ status }) {
  const map = {
    pending: 'bg-[#C8A97E]/20 text-[#8f6c2e]',
    confirmed: 'bg-[#2c7a4a]/15 text-[#2c7a4a]',
    shipped: 'bg-[#3b4a63]/15 text-[#3b4a63]',
    delivered: 'bg-[#2c7a4a]/25 text-[#2c7a4a]',
    cancelled: 'bg-[#b33a3a]/15 text-[#b33a3a]',
  };
  return (
    <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] ${map[status] || 'bg-[#EBE4D8]'}`}>
      {status}
    </span>
  );
}