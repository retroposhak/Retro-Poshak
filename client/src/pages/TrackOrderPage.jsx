import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, CheckCircle2, Truck, MapPin } from 'lucide-react';
import { orderService } from '../services/orderService';
import { formatINR } from '../utils/formatCurrency';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  let formattedPath = path.startsWith('/') ? path : `/${path}`;
  return formattedPath.replace(/ /g, '%20');
};

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const o = await orderService.track(orderId.trim().toUpperCase());
      setOrder(o);
    } catch (err) {
      setError(err?.response?.data?.message || 'Order not found. Please check your ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#F7F3EC] min-h-screen py-20 relative overflow-hidden">
      
      {/* Decorative Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-gradient-to-b from-[#EBE4D8]/50 to-transparent pointer-events-none" />

      <div className="container-page max-w-3xl relative z-10">
        
        <div className="text-center mb-12">
          <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#b33a3a] block mb-4">
            Where's my order?
          </span>
          <h1 className="font-serif text-5xl md:text-6xl text-[#1A1715]">Track Your Package<span className="text-[#b33a3a]">.</span></h1>
          <p className="mt-4 text-sm text-[#1A1715]/50 font-sans max-w-md mx-auto">
            Enter your order ID below to see exactly where your package is right now.
          </p>
        </div>

        {/* Search Form */}
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FCFAF5] border border-[#1A1715]/10 rounded-full p-2 pl-6 shadow-lg flex items-center max-w-xl mx-auto"
          onSubmit={submit}
        >
          <Search size={20} className="text-[#1A1715]/40 shrink-0" />
          <input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value.toUpperCase())}
            placeholder="e.g. RP12345678"
            className="flex-1 bg-transparent px-4 py-3 text-sm font-sans outline-none placeholder:text-[#1A1715]/30 text-[#1A1715] tracking-wider uppercase"
          />
          <button 
            disabled={loading} 
            className="bg-[#1A1715] text-[#F7F3EC] rounded-full px-8 py-3 text-xs font-bold tracking-[0.15em] uppercase hover:bg-[#b33a3a] transition-colors disabled:opacity-50 shrink-0"
          >
            {loading ? 'Tracking...' : 'Track'}
          </button>
        </motion.form>
        
        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-6 text-sm text-[#b33a3a] bg-[#b33a3a]/10 py-2 px-4 rounded-full inline-block mx-auto w-fit block">
            {error}
          </motion.p>
        )}

        {/* Tracking Result */}
        {order && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-12 bg-[#FCFAF5] border border-[#1A1715]/10 rounded-3xl shadow-xl overflow-hidden"
          >
            {/* Result Header */}
            <div className="bg-[#EBE4D8]/50 p-6 sm:p-8 border-b border-[#1A1715]/10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A1715]/50 mb-1">Order ID</p>
                <p className="font-serif text-2xl text-[#1A1715]">#{order.orderId}</p>
              </div>
              <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${
                order.status === 'delivered' ? 'bg-[#2c7a4a]/15 text-[#2c7a4a]' : 'bg-[#b33a3a]/15 text-[#b33a3a]'
              }`}>
                {order.status}
              </div>
            </div>

            <div className="p-6 sm:p-8 grid gap-10 md:grid-cols-[1fr_1.2fr]">
              
              {/* Timeline */}
              <div>
                <h3 className="font-serif text-xl text-[#1A1715] mb-6">Timeline</h3>
                <ol className="relative border-l-2 border-[#EBE4D8] ml-3 space-y-8">
                  {order.statusHistory.map((s, i) => {
                    const isLatest = i === order.statusHistory.length - 1;
                    return (
                      <li key={i} className="ml-6">
                        <span className={`absolute -left-[9px] mt-1 h-4 w-4 rounded-full border-2 border-[#FCFAF5] ${
                          isLatest ? 'bg-[#b33a3a] ring-4 ring-[#b33a3a]/20' : 'bg-[#C8A97E]'
                        }`} />
                        <p className={`text-sm font-bold uppercase tracking-wider ${isLatest ? 'text-[#b33a3a]' : 'text-[#1A1715]'}`}>
                          {s.status}
                        </p>
                        <p className="text-xs text-[#1A1715]/50 font-sans mt-1">
                          {new Date(s.at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-serif text-xl text-[#1A1715] mb-6">Items in this package</h3>
                <div className="space-y-4 bg-[#F7F3EC] rounded-2xl p-4 border border-[#1A1715]/5">
                  {order.items.map((i, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="h-16 w-14 shrink-0 rounded-lg overflow-hidden bg-white border border-[#1A1715]/5">
                        <img src={getImageUrl(i.image)} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <p className="font-serif text-base text-[#1A1715] leading-tight">{i.name}</p>
                        <p className="text-[11px] font-sans text-[#1A1715]/50 mt-1">Size: {i.size} · {i.colour} · Qty: {i.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}